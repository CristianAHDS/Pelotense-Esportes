const STORAGE_KEY = 'pelotense:penaltis:v1'
const CHANNEL_NAME = 'broadcast:sync-penaltis-v1'
const MSG_TIPO = 'estado:penaltis:v1'

function wsUrl() {
  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/pelotense-sync`
  } catch {
    return 'ws://localhost:5173/pelotense-sync'
  }
}

function criarLado() {
  return { nome: '', sigla: '---', cor: '#4b5563', escudo: null, cobrancas: [] }
}

const estadoPadrao = {
  competicao: 'CAMPEONATO GAÚCHO SÉRIE A2',
  fase: 'DISPUTA DE PÊNALTIS',
  casa: criarLado(),
  visitante: criarLado(),
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      const salvo = JSON.parse(bruto)
      if (!salvo.casa || !salvo.visitante) salvo.casa = criarLado()
      if (!Array.isArray(salvo.casa.cobrancas)) salvo.casa = criarLado()
      if (!salvo.visitante || !Array.isArray(salvo.visitante.cobrancas)) salvo.visitante = criarLado()
      return { ...structuredClone(estadoPadrao), ...salvo }
    }
  } catch (e) {
    console.warn('Pênaltis: falha ao carregar estado.', e)
  }
  return structuredClone(estadoPadrao)
}

let estado = carregar()
const ouvintes = new Set()
let processandoRemoto = false

const canal =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null

function notificar() {
  ouvintes.forEach((ouvinte) => ouvinte(estado))
}

function persistir() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado))
  } catch (e) {
    console.warn('Pênaltis: falha ao persistir estado.', e)
  }
}

export function getEstado() {
  return estado
}

/* Total de gols convertidos de um lado */
export function placarDe(lado) {
  return (lado?.cobrancas || []).filter((c) => c === 'gol').length
}

/* Quantas cobranças cada lado precisa exibir (mínimo 5, acompanha o maior) */
export function slotsVisiveis(est = estado) {
  const max = Math.max(
    est.casa?.cobrancas.length || 0,
    est.visitante?.cobrancas.length || 0,
    5
  )
  return Math.min(max + 1, 30)
}

function normalizar(novoEstado) {
  for (const nome of ['casa', 'visitante']) {
    const lado = novoEstado[nome] || criarLado()
    if (!Array.isArray(lado.cobrancas)) lado.cobrancas = []
    novoEstado[nome] = lado
  }
  return novoEstado
}

export function setEstado(atualizador, { remoto = false } = {}) {
  if (remoto) {
    processandoRemoto = true
  }

  estado =
    typeof atualizador === 'function' ? atualizador(structuredClone(estado)) : atualizador
  estado = normalizar(estado)
  persistir()
  notificar()

  if (!remoto) {
    const pacote = structuredClone(estado)
    canal?.postMessage({ tipo: MSG_TIPO, estado: pacote })
    enviarEstadoWS(pacote)
  }

  processandoRemoto = false
}

let ultimoSync = ''

function aplicarEstadoRemoto(novoEstado) {
  const serializado = JSON.stringify(novoEstado)
  if (serializado === ultimoSync || serializado === JSON.stringify(estado)) return
  ultimoSync = serializado

  if (!processandoRemoto) {
    setEstado(novoEstado, { remoto: true })
  }
}

/* ---------- WebSocket ---------- */

let ws = null
let wsReconectarTimer = null

function conectarWS() {
  if (typeof WebSocket === 'undefined') return

  try {
    ws = new WebSocket(wsUrl())
  } catch {
    tentarReconectarWS()
    return
  }

  ws.onopen = () => {
    console.log('[Pênaltis] WebSocket conectado')
  }

  ws.onmessage = (evento) => {
    try {
      const msg = JSON.parse(evento.data)
      if (msg.tipo === MSG_TIPO) {
        aplicarEstadoRemoto(msg.estado)
      }
    } catch (e) {
      console.warn('Pênaltis: mensagem WS inválida', e)
    }
  }

  ws.onclose = () => {
    ws = null
    tentarReconectarWS()
  }

  ws.onerror = () => {
    ws?.close()
  }
}

function tentarReconectarWS() {
  if (wsReconectarTimer) return
  wsReconectarTimer = setTimeout(() => {
    wsReconectarTimer = null
    conectarWS()
  }, 3000)
}

function enviarEstadoWS(pacote) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ tipo: MSG_TIPO, estado: pacote || estado }))
  }
}

conectarWS()

/* ---------- BroadcastChannel ---------- */

if (canal) {
  canal.onmessage = (evento) => {
    if (evento.data?.tipo === MSG_TIPO) {
      aplicarEstadoRemoto(evento.data.estado)
    }
  }
}

/* ---------- localStorage ---------- */

window.addEventListener('storage', (evento) => {
  if (evento.key === STORAGE_KEY && evento.newValue) {
    try {
      aplicarEstadoRemoto(JSON.parse(evento.newValue))
    } catch (e) {
      console.warn('Pênaltis: falha ao sincronizar via storage.', e)
    }
  }
})

/* ---------- Assinatura ---------- */

export function inscrever(ouvinte) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

/* ---------- Ações ---------- */

export function definirTexto(campo, valor) {
  setEstado((estado) => {
    if (campo === 'competicao') estado.competicao = String(valor).slice(0, 60).toUpperCase()
    else if (campo === 'fase') estado.fase = String(valor).slice(0, 40).toUpperCase()
    return estado
  })
}

export function atualizarLado(ladoNome, campo, valor) {
  setEstado((estado) => {
    const lado = estado[ladoNome]
    if (!lado) return estado
    if (campo === 'nome') lado.nome = String(valor).slice(0, 24).toUpperCase()
    else if (campo === 'sigla') lado.sigla = String(valor).slice(0, 4).toUpperCase() || '---'
    else if (campo === 'cor') lado.cor = valor
    else if (campo === 'escudo') lado.escudo = valor || null
    return estado
  })
}

/* Marca a próxima cobrança do lado ('gol' | 'perdeu'); se já marcada, desfaz */
export function marcarCobranca(ladoNome, resultado) {
  setEstado((estado) => {
    const lado = estado[ladoNome]
    if (!lado) return estado
    const i = lado.cobrancas.length - 1
    if (i >= 0 && lado.cobrancas[i] === resultado) lado.cobrancas.pop()
    else lado.cobrancas.push(resultado)
    return estado
  })
}

/* Define diretamente uma posição específica (usada pelo controle) */
export function definirCobranca(ladoNome, indice, resultado) {
  setEstado((estado) => {
    const lado = estado[ladoNome]
    if (!lado) return estado
    while (lado.cobrancas.length <= indice) lado.cobrancas.push(null)
    lado.cobrancas[indice] = resultado === lado.cobrancas[indice] ? null : resultado
    return estado
  })
}

export function limparCobrancas() {
  setEstado((estado) => {
    estado.casa.cobrancas = []
    estado.visitante.cobrancas = []
    return estado
  })
}

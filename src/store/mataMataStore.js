const STORAGE_KEY = 'pelotense:mata-mata:v1'
const CHANNEL_NAME = 'broadcast:sync-mata-mata-v1'
const MSG_TIPO = 'estado:mata-mata:v1'

function wsUrl() {
  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/pelotense-sync`
  } catch {
    return 'ws://localhost:5173/pelotense-sync'
  }
}

function criarLado() {
  return { nome: '', sigla: '---', cor: '#4b5563', escudo: null, gols: null, pen: null }
}

function criarConfronto() {
  return { casa: criarLado(), visitante: criarLado() }
}

const CONFRONTOS_PADRAO = Array.from({ length: 8 }, criarConfronto)

const estadoPadrao = {
  competicao: 'CAMPEONATO GAÚCHO SÉRIE A2',
  fase: 'OITAVAS DE FINAL',
  confrontos: structuredClone(CONFRONTOS_PADRAO),
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      const salvo = JSON.parse(bruto)
      if (!Array.isArray(salvo.confrontos)) salvo.confrontos = structuredClone(estadoPadrao.confrontos)
      return { ...structuredClone(estadoPadrao), ...salvo }
    }
  } catch (e) {
    console.warn('Mata-Mata: falha ao carregar estado.', e)
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
    console.warn('Mata-Mata: falha ao persistir estado.', e)
  }
}

export function getEstado() {
  return estado
}

function pacoteSincronizacao() {
  return structuredClone(estado)
}

export function setEstado(atualizador, { remoto = false } = {}) {
  if (remoto) {
    processandoRemoto = true
  }

  estado =
    typeof atualizador === 'function' ? atualizador(structuredClone(estado)) : atualizador
  persistir()
  notificar()

  if (!remoto) {
    const pacote = pacoteSincronizacao()
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
    console.log('[Mata-Mata] WebSocket conectado')
  }

  ws.onmessage = (evento) => {
    try {
      const msg = JSON.parse(evento.data)
      if (msg.tipo === MSG_TIPO) {
        aplicarEstadoRemoto(msg.estado)
      }
    } catch (e) {
      console.warn('Mata-Mata: mensagem WS inválida', e)
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
      console.warn('Mata-Mata: falha ao sincronizar via storage.', e)
    }
  }
})

/* ---------- Assinatura ---------- */

export function inscrever(ouvinte) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

/* ---------- Ações ---------- */

export function definirCompeticao(texto) {
  setEstado((estado) => {
    estado.competicao = String(texto).slice(0, 60).toUpperCase()
    return estado
  })
}

export function definirFase(texto) {
  setEstado((estado) => {
    estado.fase = String(texto).slice(0, 40).toUpperCase()
    return estado
  })
}

export function atualizarLado(indice, ladoNome, campo, valor) {
  setEstado((estado) => {
    const confronto = estado.confrontos[indice]
    const lado = confronto?.[ladoNome]
    if (!lado) return estado
    if (campo === 'nome') {
      lado.nome = String(valor).slice(0, 24)
    } else if (campo === 'sigla') {
      lado.sigla = String(valor).slice(0, 4).toUpperCase() || '---'
    } else if (campo === 'cor') {
      lado.cor = valor
    } else if (campo === 'escudo') {
      lado.escudo = valor || null
    } else if (campo === 'gols' || campo === 'pen') {
      lado[campo] = valor === '' || valor == null ? null : Math.max(0, Math.floor(Number(valor) || 0))
    }
    return estado
  })
}

/* Preenche os confrontos a partir de pares prontos
   [{ casa:{nome,sigla,cor,escudo}, visitante:{...} }] */
export function preencherConfrontos(pares) {
  setEstado((estado) => {
    pares.forEach((par, i) => {
      if (!estado.confrontos[i]) return
      for (const ladoNome of ['casa', 'visitante']) {
        const origem = par[ladoNome]
        const destino = estado.confrontos[i][ladoNome]
        destino.nome = origem.nome
        destino.sigla = origem.sigla
        destino.cor = origem.cor
        destino.escudo = origem.escudo || `/escudos/${origem.sigla}.png`
        destino.gols = null
        destino.pen = null
      }
    })
    return estado
  })
}

export function limparPlacares() {
  setEstado((estado) => {
    estado.confrontos.forEach((c) => {
      c.casa.gols = null
      c.casa.pen = null
      c.visitante.gols = null
      c.visitante.pen = null
    })
    return estado
  })
}

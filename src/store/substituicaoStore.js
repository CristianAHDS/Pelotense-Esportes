const STORAGE_KEY = 'pelotense:substituicao:v1'
const CHANNEL_NAME = 'broadcast:sync-substituicao-v1'
const MSG_TIPO = 'estado:substituicao:v1'

function wsUrl() {
  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/pelotense-sync`
  } catch {
    return 'ws://localhost:5173/pelotense-sync'
  }
}

const estadoPadrao = {
  visivel: true,
  minuto: "67'",
  corTime: '#16a34a',
  nomeTime: 'PELOTENSE',
  siglaTime: 'PEL',
  escudoTime: null,
  saiNum: '10',
  saiNome: 'SILVA',
  entraNum: '9',
  entraNome: 'SANTOS',
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      const salvo = JSON.parse(bruto)
      return { ...structuredClone(estadoPadrao), ...salvo }
    }
  } catch (e) {
    console.warn('Substituição: falha ao carregar estado.', e)
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
    console.warn('Substituição: falha ao persistir estado.', e)
  }
}

export function getEstado() {
  return estado
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
    console.log('[Substituição] WebSocket conectado')
  }

  ws.onmessage = (evento) => {
    try {
      const msg = JSON.parse(evento.data)
      if (msg.tipo === MSG_TIPO) {
        aplicarEstadoRemoto(msg.estado)
      }
    } catch (e) {
      console.warn('Substituição: mensagem WS inválida', e)
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
      console.warn('Substituição: falha ao sincronizar via storage.', e)
    }
  }
})

/* ---------- Assinatura ---------- */

export function inscrever(ouvinte) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

/* ---------- Ações ---------- */

export function atualizarCampo(campo, valor) {
  setEstado((estado) => {
    switch (campo) {
      case 'minuto':
        estado.minuto = String(valor).slice(0, 6)
        break
      case 'nomeTime':
        estado.nomeTime = String(valor).slice(0, 24).toUpperCase()
        break
      case 'siglaTime':
        estado.siglaTime = String(valor).slice(0, 4).toUpperCase() || '---'
        break
      case 'corTime':
        estado.corTime = valor
        break
      case 'escudoTime':
        estado.escudoTime = valor || null
        break
      case 'saiNum':
        estado.saiNum = String(valor).slice(0, 2)
        break
      case 'saiNome':
        estado.saiNome = String(valor).slice(0, 22).toUpperCase()
        break
      case 'entraNum':
        estado.entraNum = String(valor).slice(0, 2)
        break
      case 'entraNome':
        estado.entraNome = String(valor).slice(0, 22).toUpperCase()
        break
      default:
        estado[campo] = valor
    }
    return estado
  })
}

export function mostrar() {
  setEstado((estado) => {
    estado.visivel = true
    return estado
  })
}

export function ocultar() {
  setEstado((estado) => {
    estado.visivel = false
    return estado
  })
}

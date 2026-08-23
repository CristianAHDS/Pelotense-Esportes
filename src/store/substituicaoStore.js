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

/* Fábrica: cada scoreboard tem sua própria substituição independente */
export function criarSubstituicaoStore(rotulo) {
  const STORAGE_KEY = `pelotense:substituicao:${rotulo}:v1`
  const CHANNEL_NAME = `broadcast:sync-substituicao-${rotulo}-v1`
  const MSG_TIPO = `estado:substituicao:${rotulo}:v1`

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      const salvo = JSON.parse(bruto)
      return { ...structuredClone(estadoPadrao), ...salvo }
  }
  } catch (e) {
      console.warn(`Substituição ${rotulo}: falha ao carregar estado.`, e)
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
      console.warn(`Substituição ${rotulo}: falha ao persistir estado.`, e)
  }
  }

  function getEstado() {
  return estado
  }

  function setEstado(atualizador, { remoto = false } = {}) {
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

  ws.onmessage = (evento) => {
  try {
      const msg = JSON.parse(evento.data)
      if (msg.tipo === MSG_TIPO) {
        aplicarEstadoRemoto(msg.estado)
  }
  } catch (e) {
        console.warn(`Substituição ${rotulo}: mensagem WS inválida`, e)
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
        console.warn(`Substituição ${rotulo}: falha ao sincronizar via storage.`, e)
  }
  }
})

/* ---------- Assinatura ---------- */

  function inscrever(ouvinte) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
  }

/* ---------- Ações ---------- */

  function atualizarCampo(campo, valor) {
    setEstado((estadoAtual) => {
    switch (campo) {
      case 'minuto':
          estadoAtual.minuto = String(valor).slice(0, 6)
        break
      case 'nomeTime':
          estadoAtual.nomeTime = String(valor).slice(0, 24).toUpperCase()
        break
      case 'siglaTime':
          estadoAtual.siglaTime = String(valor).slice(0, 4).toUpperCase() || '---'
        break
      case 'corTime':
          estadoAtual.corTime = valor
        break
      case 'escudoTime':
          estadoAtual.escudoTime = valor || null
        break
      case 'saiNum':
          estadoAtual.saiNum = String(valor).slice(0, 2)
        break
      case 'saiNome':
          estadoAtual.saiNome = String(valor).slice(0, 22).toUpperCase()
        break
      case 'entraNum':
          estadoAtual.entraNum = String(valor).slice(0, 2)
        break
      case 'entraNome':
          estadoAtual.entraNome = String(valor).slice(0, 22).toUpperCase()
        break
      default:
          estadoAtual[campo] = valor
  }
      return estadoAtual
})
  }

  function mostrar() {
    setEstado((estadoAtual) => {
      estadoAtual.visivel = true
      return estadoAtual
})
  }

  function ocultar() {
    setEstado((estadoAtual) => {
      estadoAtual.visivel = false
      return estadoAtual
})
  }

  return { rotulo, getEstado, inscrever, atualizarCampo, mostrar, ocultar }
  }

export const substituicaoPro = criarSubstituicaoStore('pro')
export const substituicaoPL = criarSubstituicaoStore('pl')
export const substituicaoBL = criarSubstituicaoStore('bl')
export const substituicaoLL = criarSubstituicaoStore('ll')

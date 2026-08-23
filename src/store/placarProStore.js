import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js'

const STORAGE_KEY = 'pelotense:placar-pro'
const CHANNEL_NAME = 'placar-pro:sync'
const MSG_TIPO = 'estado:placar-pro'
const CANAL_NUVEM = 'placar-pro'

const estadoPadrao = {
  timeCasa: { nome: 'TIME CASA', gols: 0 },
  timeVisitante: { nome: 'VISITANTE', gols: 0 },
  cronometro: { base: 0, rodando: false, iniciadoEm: null },
  periodo: '1º TEMPO',
  eventoGol: null,
  corCasa: '#a5ef1c',
  corVisitante: '#3b82f6'
  }

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      return { ...estadoPadrao, ...JSON.parse(bruto) }
  }
  } catch (e) {
    console.warn('PlacarPro: falha ao carregar estado.', e)
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
    console.warn('PlacarPro: falha ao persistir estado.', e)
  }
  }

export function getEstado() {
  return estado
  }

export function segundosAtuais(cron) {
  if (!cron) return 0
  const { base, rodando, iniciadoEm } = cron
  if (rodando && iniciadoEm) {
    return Math.max(0, base + Math.floor((Date.now() - iniciadoEm) / 1000))
  }
  return Math.max(0, base)
  }

function pacoteSincronizacao() {
  const pacote = structuredClone(estado)
  if (pacote.cronometro?.rodando) {
    pacote.cronometro.segundos = segundosAtuais(pacote.cronometro)
  }
  return pacote
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
    publicarNuvem(CANAL_NUVEM, pacote)
  }

  processandoRemoto = false
  }

function aplicarEstadoRemoto(novoEstado) {
  if (!processandoRemoto) {
    if (novoEstado.cronometro?.rodando && typeof novoEstado.cronometro.segundos === 'number') {
      novoEstado.cronometro.base = novoEstado.cronometro.segundos
      novoEstado.cronometro.iniciadoEm = Date.now()
      delete novoEstado.cronometro.segundos
    } else if (novoEstado.cronometro?.rodando && novoEstado.cronometro?.iniciadoEm) {
      novoEstado.cronometro.iniciadoEm = Date.now()
  }
    setEstado(novoEstado, { remoto: true })
  }
  }

/* ---------- Tick de sincronização ---------- */

let tickSync = null

function iniciarTickSync() {
  if (tickSync) return
  tickSync = setInterval(() => {
    if (!estado.cronometro?.rodando) return
    const pacote = pacoteSincronizacao()
    canal?.postMessage({ tipo: MSG_TIPO, estado: pacote })
    publicarNuvem(CANAL_NUVEM, pacote)
  }, 2000)
  }

function pararTickSync() {
  if (tickSync) {
    clearInterval(tickSync)
    tickSync = null
  }
  }

/* ---------- Sincronização na nuvem ---------- */

inscreverNuvem(CANAL_NUVEM, aplicarEstadoRemoto)

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
      console.warn('PlacarPro: falha ao sincronizar via storage.', e)
  }
  }
})

/* ---------- Assinatura ---------- */

export function inscrever(ouvinte) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
  }

/* ---------- Ações ---------- */

export function gol(lado, delta) {
  setEstado((estado) => {
    const chave = lado === 'casa' ? 'timeCasa' : 'timeVisitante'
    estado[chave].gols = Math.max(0, estado[chave].gols + delta)
    if (delta > 0) {
      estado.eventoGol = { lado, em: Date.now() }
  }
  return estado
})
  }

export function definirGols(lado, valor) {
  setEstado((estado) => {
    const chave = lado === 'casa' ? 'timeCasa' : 'timeVisitante'
    estado[chave].gols = Math.max(0, Number(valor) || 0)
  return estado
})
  }

export function renomearTime(lado, nome) {
  setEstado((estado) => {
    const chave = lado === 'casa' ? 'timeCasa' : 'timeVisitante'
    estado[chave].nome = nome.slice(0, 20).toUpperCase()
  return estado
})
  }

export function alternarCronometro() {
  setEstado((estado) => {
    const cron = estado.cronometro
    if (cron.rodando) {
      cron.base += Math.floor((Date.now() - cron.iniciadoEm) / 1000)
      cron.rodando = false
      cron.iniciadoEm = null
      pararTickSync()
    } else {
      cron.rodando = true
      cron.iniciadoEm = Date.now()
      iniciarTickSync()
  }
  return estado
})
  }

export function zerarCronometro() {
      pararTickSync()
  setEstado((estado) => {
    estado.cronometro = { base: 0, rodando: false, iniciadoEm: null }
  return estado
})
  }

export function ajustarMinutos(delta) {
  setEstado((estado) => {
    const cron = estado.cronometro
    let base = cron.base
    if (cron.rodando) {
      base += Math.floor((Date.now() - cron.iniciadoEm) / 1000)
      cron.iniciadoEm = Date.now()
  }
    cron.base = Math.max(0, base + delta * 60)
  return estado
})
  }

export function definirPeriodo(periodo) {
  setEstado((estado) => {
    estado.periodo = periodo
  return estado
})
  }

export function definirCorTime(lado, cor) {
  setEstado((estado) => {
    const chave = lado === 'casa' ? 'corCasa' : 'corVisitante'
    estado[chave] = cor
  return estado
})
  }

export function resetarPartida() {
      pararTickSync()
  setEstado(() => structuredClone(estadoPadrao))
  }

export function formatarTempo(totalSegundos) {
  const horas = Math.floor(totalSegundos / 3600)
  const minutos = Math.floor((totalSegundos % 3600) / 60)
  const segundos = totalSegundos % 60
  const mm = String(minutos).padStart(2, '0')
  const ss = String(segundos).padStart(2, '0')
  return horas > 0 ? `${horas}:${mm}:${ss}` : `${mm}:${ss}`
  }

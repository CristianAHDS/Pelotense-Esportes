import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js'

const STORAGE_KEY = 'pelotense:placar-model'
const CHANNEL_NAME = 'placar-model:sync'
const MSG_TIPO = 'estado:placar-model'
const CANAL_NUVEM = 'placar-model'

export const PERIODOS = ['1º', '2º', 'INT', 'FT', 'PROR']
export const ESTADOS_PARTIDA = ['INÍCIO', 'AO VIVO', 'INTERVALO', 'ENCERRADO']

const estadoPadrao = {
  timeCasa: { nome: 'PEL', escudo: '/escudos/PEL.png' },
  timeVisitante: { nome: 'GLO', escudo: '/escudos/GLO.png' },
  golsCasa: 0,
  golsVisitante: 0,
  cronometro: { base: 0, rodando: false, iniciadoEm: null },
  periodo: '1º',
  estadoPartida: 'INÍCIO',
  corCasa: '#1565c0',
  corVisitante: '#ca8a04',
  mostrarEscudos: true,
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      return { ...structuredClone(estadoPadrao), ...JSON.parse(bruto) }
    }
  } catch (e) {
    console.warn('Placar Model: falha ao carregar estado.', e)
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
    console.warn('Placar Model: falha ao persistir estado.', e)
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
    typeof atualizador === 'function'
      ? atualizador(structuredClone(estado))
      : atualizador
  persistir()
  notificar()

  if (!remoto) {
    const pacote = pacoteSincronizacao()
    canal?.postMessage({ tipo: MSG_TIPO, estado: pacote })
    publicarNuvem(CANAL_NUVEM, pacote)
    registrarSync(pacote)
  }

  processandoRemoto = false
}

const ultimosSync = []
const LIMITE_SYNC = 16

function registrarSync(valor) {
  const texto = JSON.stringify(valor)
  ultimosSync.push(texto)
  while (ultimosSync.length > LIMITE_SYNC) ultimosSync.shift()
}

function aplicarEstadoRemoto(novoEstado) {
  const serializado = JSON.stringify(novoEstado)
  if (ultimosSync.includes(serializado) || serializado === JSON.stringify(estado)) return
  registrarSync(novoEstado)

  if (!processandoRemoto) {
    if (novoEstado.cronometro?.rodando && typeof novoEstado.cronometro.segundos === 'number') {
      const local = segundosAtuais(estado.cronometro)
      const diff = Math.abs(novoEstado.cronometro.segundos - local)
      if (diff > 2) {
        novoEstado.cronometro.base = novoEstado.cronometro.segundos
        novoEstado.cronometro.iniciadoEm = Date.now()
      }
      delete novoEstado.cronometro.segundos
    } else if (novoEstado.cronometro?.rodando && novoEstado.cronometro?.iniciadoEm) {
      novoEstado.cronometro.iniciadoEm = Date.now()
    }
    setEstado(novoEstado, { remoto: true })
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
      console.warn('Placar Model: falha ao sincronizar via storage.', e)
    }
  }
})

/* ---------- Assinatura ---------- */

export function inscrever(ouvinte) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

/* ---------- Ações ---------- */

function resolverEscudo(sigla) {
  const s = String(sigla || '').toUpperCase()
  return /^[A-Z]{3,4}$/.test(s) ? `/escudos/${s}.png` : null
}

export function definirTime(lado, nome) {
  setEstado((estado) => {
    const chave = lado === 'casa' ? 'timeCasa' : 'timeVisitante'
    const sigla = nome.slice(0, 6).toUpperCase()
    estado[chave].nome = sigla
    estado[chave].escudo = resolverEscudo(sigla)
    return estado
  })
}

export function definirGols(lado, valor) {
  setEstado((estado) => {
    if (lado === 'casa') estado.golsCasa = Math.max(0, Number(valor) || 0)
    else estado.golsVisitante = Math.max(0, Number(valor) || 0)
    return estado
  })
}

export function gol(lado, delta) {
  setEstado((estado) => {
    if (lado === 'casa') estado.golsCasa = Math.max(0, estado.golsCasa + delta)
    else estado.golsVisitante = Math.max(0, estado.golsVisitante + delta)
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
    } else {
      cron.rodando = true
      cron.iniciadoEm = Date.now()
    }
    return estado
  })
}

export function zerarCronometro() {
  setEstado((estado) => {
    estado.cronometro = { base: 0, rodando: false, iniciadoEm: null }
    return estado
  })
}

export function definirPeriodo(periodo) {
  setEstado((estado) => {
    estado.periodo = periodo
    return estado
  })
}

export function definirEstadoPartida(valor) {
  setEstado((estado) => {
    estado.estadoPartida = valor
    return estado
  })
}

export function definirCor(lado, cor) {
  setEstado((estado) => {
    if (lado === 'casa') estado.corCasa = cor
    else estado.corVisitante = cor
    return estado
  })
}

export function alternarEscudos() {
  setEstado((estado) => {
    estado.mostrarEscudos = !estado.mostrarEscudos
    return estado
  })
}

export function resetarPartida() {
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
import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js'

const STORAGE_KEY = 'pelotense:broadcast-bl'
const CHANNEL_NAME = 'broadcast:sync-bl'
const MSG_TIPO = 'estado:broadcast-bl'
const CANAL_NUVEM = 'placar-broadcast-bl'

const estadoPadrao = {
  timeCasa: { nome: 'PAL', gols: 0 },
  timeVisitante: { nome: 'BOT', gols: 0 },
  cronometro: { base: 0, rodando: false, iniciadoEm: null },
  periodo: '1T',
  acrescimo: null,
  eventoGol: null,
  corCasa: '#008F3D',
  corCasaBorda: '#006b2d',
  corVisitante: '#252525',
  corVisitanteBorda: '#1a1a1a',
  estadoPartida: 'AO VIVO',
  cartoesCasa: { amarelo: 0, vermelho: 0 },
  cartoesVisitante: { amarelo: 0, vermelho: 0 },
  eventoCartao: null
}

export const ESTADOS_PARTIDA = ['AO VIVO', 'INTERVALO', 'ENCERRADO']

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      return { ...estadoPadrao, ...JSON.parse(bruto) }
    }
  } catch (e) {
    console.warn('Broadcast: falha ao carregar estado.', e)
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
    console.warn('Broadcast: falha ao persistir estado.', e)
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

/* ---------- SincronizaÃ§Ã£o na nuvem ---------- */

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
      console.warn('Broadcast: falha ao sincronizar via storage.', e)
    }
  }
})

/* ---------- Assinatura ---------- */

export function inscrever(ouvinte) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

/* ---------- AÃ§Ãµes ---------- */

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
    estado[chave].nome = nome.slice(0, 6).toUpperCase()
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

export function ajustarSegundos(delta) {
  setEstado((estado) => {
    const cron = estado.cronometro
    let base = cron.base
    if (cron.rodando) {
      base += Math.floor((Date.now() - cron.iniciadoEm) / 1000)
      cron.iniciadoEm = Date.now()
    }
    cron.base = Math.max(0, base + delta)
    return estado
  })
}

export function definirPeriodo(periodo) {
  setEstado((estado) => {
    estado.periodo = periodo
    return estado
  })
}

export function definirAcrescimo(minutos) {
  setEstado((estado) => {
    const m = Math.floor(Number(minutos))
    estado.acrescimo = m > 0 ? m : null
    return estado
  })
}

export function definirEstadoPartida(valor) {
  setEstado((estado) => {
    estado.estadoPartida = valor
    return estado
  })
}

export const CORES_PRESET = [
  { fundo: '#008F3D', borda: '#006b2d', nome: 'Verde' },
  { fundo: '#1a56db', borda: '#1e40af', nome: 'Azul' },
  { fundo: '#dc2626', borda: '#991b1b', nome: 'Vermelho' },
  { fundo: '#eab308', borda: '#a16207', nome: 'Amarelo' },
  { fundo: '#ea580c', borda: '#9a3412', nome: 'Laranja' },
  { fundo: '#7c3aed', borda: '#5b21b6', nome: 'Roxo' },
  { fundo: '#1f1f1f', borda: '#0a0a0a', nome: 'Preto' },
  { fundo: '#e5e5e5', borda: '#a3a3a3', nome: 'Branco' },
  { fundo: '#4b5563', borda: '#374151', nome: 'Cinza' },
  { fundo: '#0891b2', borda: '#155e75', nome: 'Ciano' },
  { fundo: '#059669', borda: '#065f46', nome: 'Esmeralda' },
  { fundo: '#db2777', borda: '#9d174d', nome: 'Rosa' },
]

export function definirCorPreset(lado, preset) {
  setEstado((estado) => {
    const prefixo = lado === 'casa' ? 'corCasa' : 'corVisitante'
    estado[prefixo] = preset.fundo
    estado[prefixo + 'Borda'] = preset.borda
    return estado
  })
}

export function definirCorTime(lado, cor, tipo = 'fundo') {
  setEstado((estado) => {
    const prefixo = lado === 'casa' ? 'corCasa' : 'corVisitante'
    const chave = tipo === 'borda' ? prefixo + 'Borda' : prefixo
    estado[chave] = cor
    return estado
  })
}

export function darCartao(lado, cor) {
  setEstado((estado) => {
    const chave = lado === 'casa' ? 'cartoesCasa' : 'cartoesVisitante'
    estado[chave][cor]++
    estado.eventoCartao = { lado, cor, em: Date.now() }
    return estado
  })
}

export function removerCartao(lado, cor) {
  setEstado((estado) => {
    const chave = lado === 'casa' ? 'cartoesCasa' : 'cartoesVisitante'
    estado[chave][cor] = Math.max(0, estado[chave][cor] - 1)
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

import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js'

const STORAGE_KEY = 'pelotense:pre-jogo'
const CHANNEL_NAME = 'pre-jogo:sync'
const MSG_TIPO = 'estado:pre-jogo'
const CANAL_NUVEM = 'pre-jogo'

const estadoPadrao = {
  timeCasa: { nome: 'PEL', escudo: '/escudos/PEL.png' },
  timeVisitante: { nome: 'GLO', escudo: '/escudos/GLO.png' },
  cronometro: { base: 0, rodando: false, iniciadoEm: null },
  atualizadoEm: 0,
  mostrar: true,
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      const salvo = JSON.parse(bruto)
      if (typeof salvo.atualizadoEm !== 'number') salvo.atualizadoEm = 0
      return { ...structuredClone(estadoPadrao), ...salvo }
    }
  } catch (e) {
    console.warn('PreJogo: falha ao carregar estado.', e)
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
    console.warn('PreJogo: falha ao persistir estado.', e)
  }
}

export function getEstado() {
  return estado
}

/* Segundos restantes do countdown */
export function segundosRestantes(cron) {
  if (!cron) return 0
  const { base, rodando, iniciadoEm } = cron
  if (rodando && iniciadoEm) {
    return Math.max(0, base - Math.floor((Date.now() - iniciadoEm) / 1000))
  }
  return Math.max(0, base)
}

function pacoteSincronizacao() {
  const pacote = structuredClone(estado)
  if (pacote.cronometro?.rodando) {
    pacote.cronometro.segundos = segundosRestantes(pacote.cronometro)
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
  if (!remoto) estado.atualizadoEm = Date.now()
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

  /* Rejeitar estados mais antigos que o atual (last-write-wins). Evita que um
     snapshot "rodando" já em trânsito (echo do tick na nuvem) revele o pause
     e religue o cronômetro. */
  const atualizadoNovo = Number(novoEstado.atualizadoEm)
  const atualizadoLocal = Number(estado.atualizadoEm || 0)
  if (!Number.isFinite(atualizadoNovo)) {
    /* Estado antigo sem carimbo de tempo (nuvem entregue por um cliente com
       código legado). Só é aceito se o local ainda não tem um estado com
       carimbo; caso contrário o carimbo local representa um estado mais novo
       (ex.: o pause) e o snapshot "rodando" legado não pode desfazê-lo. */
    if (atualizadoLocal > 0) return
  } else if (atualizadoNovo <= atualizadoLocal) {
    return
  }
  registrarSync(novoEstado)

  if (!processandoRemoto) {
    const cron = novoEstado.cronometro
    if (cron?.rodando) {
      /* Com `iniciadoEm` válido o tempo é recomputado a partir dele (referência
         absoluta), então nunca re-basear pelo snapshot `segundos` — isso causava
         reset do countdown ao recarregar a página. Só re-baseamos quando não há
         referência de tempo (estado antigo/corrompido). */
      if (typeof cron.iniciadoEm !== 'number') {
        const seg = typeof cron.segundos === 'number' ? cron.segundos : segundosRestantes(cron)
        cron.base = Math.max(0, Math.floor(seg))
        cron.iniciadoEm = Date.now()
      }
    }
    delete novoEstado.cronometro?.segundos
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
      console.warn('PreJogo: falha ao sincronizar via storage.', e)
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

/* Define a duração total (em segundos) e zera o contador para o valor completo */
export function definirDuracao(segundos) {
  setEstado((estado) => {
    const s = Math.max(0, Math.floor(Number(segundos) || 0))
    estado.cronometro = { base: s, rodando: false, iniciadoEm: null }
    return estado
  })
}

export function alternarCronometro() {
  setEstado((estado) => {
    const cron = estado.cronometro
    if (cron.rodando) {
      cron.rodando = false
      cron.base = Math.max(0, segundosRestantes(cron))
      cron.iniciadoEm = null
    } else {
      cron.iniciadoEm = Date.now()
      cron.rodando = true
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

export function mostrar() {
  setEstado((estado) => {
    estado.mostrar = true
    return estado
  })
}

export function ocultar() {
  setEstado((estado) => {
    estado.mostrar = false
    return estado
  })
}

export function resetar() {
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
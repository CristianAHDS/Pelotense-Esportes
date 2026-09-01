import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js'

const STORAGE_KEY = 'pelotense:brasileirao-compacta:v1'
const CHANNEL_NAME = 'broadcast:sync-brasileirao-compacta-v1'
const MSG_TIPO = 'estado:brasileirao-compacta:v1'
const CANAL_NUVEM = 'brasileirao-compacta'

const estadoPadrao = {
  dividir: false,
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      const salvo = JSON.parse(bruto)
      return {
        dividir: Boolean(salvo.dividir),
      }
    }
  } catch (e) {
    console.warn('Brasileirão compacta: falha ao carregar estado.', e)
  }
  return { ...estadoPadrao }
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
    console.warn('Brasileirão compacta: falha ao persistir estado.', e)
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
    typeof atualizador === 'function'
      ? atualizador(structuredClone(estado))
      : atualizador
  persistir()
  notificar()

  if (!remoto) {
    const pacote = structuredClone(estado)
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
  if (serializado === JSON.stringify(estado)) return
  registrarSync(novoEstado)

  if (!processandoRemoto) {
    setEstado(novoEstado, { remoto: true })
  }
}

inscreverNuvem(CANAL_NUVEM, aplicarEstadoRemoto)

if (canal) {
  canal.onmessage = (evento) => {
    if (evento.data?.tipo === MSG_TIPO) {
      aplicarEstadoRemoto(evento.data.estado)
    }
  }
}

window.addEventListener('storage', (evento) => {
  if (evento.key === STORAGE_KEY && evento.newValue) {
    try {
      aplicarEstadoRemoto(JSON.parse(evento.newValue))
    } catch (e) {
      console.warn('Brasileirão compacta: falha ao sincronizar via storage.', e)
    }
  }
})

function inscrever(ouvinte) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

function definirDivisao(valor) {
  setEstado((estadoAtual) => {
    estadoAtual.dividir = Boolean(valor)
    return estadoAtual
  })
}

function alternarDivisao() {
  setEstado((estadoAtual) => {
    estadoAtual.dividir = !estadoAtual.dividir
    return estadoAtual
  })
}

export const brasilieraCompacta = {
  getEstado,
  inscrever,
  definirDivisao,
  alternarDivisao,
}

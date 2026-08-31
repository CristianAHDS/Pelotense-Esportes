import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js'

const STORAGE_KEY = 'pelotense:artilheiros:v1'
const CHANNEL_NAME = 'broadcast:sync-artilheiros-v1'
const MSG_TIPO = 'estado:artilheiros:v1'
const CANAL_NUVEM = 'artilheiros'

function normalizarEstado(estadoAtual) {
  return estadoAtual
}

function jogadoresPadrao() {
  return Array.from({ length: 5 }, () => ({ pos: '', nome: '', sigla: '', gols: '' }))
}

const estadoPadrao = {
  visivel: true,
  titulo: 'ARTILHEIROS',
  jogadores: jogadoresPadrao(),
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      const salvo = JSON.parse(bruto)
      const estado = { ...structuredClone(estadoPadrao), ...salvo }
      estado.jogadores = Array.isArray(salvo.jogadores)
        ? salvo.jogadores
        : jogadoresPadrao()
      return normalizarEstado(estado)
    }
  } catch (e) {
    console.warn('Artilheiros: falha ao carregar estado.', e)
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
    console.warn('Artilheiros: falha ao persistir estado.', e)
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
  normalizarEstado(estado)
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
      console.warn('Artilheiros: falha ao sincronizar via storage.', e)
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
      case 'titulo':
        estadoAtual.titulo = String(valor).slice(0, 32).toUpperCase()
        break
      default:
        estadoAtual[campo] = valor
    }
    return estadoAtual
  })
}

function atualizarJogador(indice, campo, valor) {
  setEstado((estadoAtual) => {
    const jogador = estadoAtual.jogadores[indice]
    if (!jogador) return estadoAtual
    if (campo === 'gols' || campo === 'pos') {
      jogador[campo] = String(valor).replace(/[^0-9]/g, '').slice(0, 2)
    } else if (campo === 'sigla') {
      jogador.sigla = String(valor).slice(0, 4).toUpperCase()
    } else {
      jogador.nome = String(valor).slice(0, 24).toUpperCase()
    }
    return estadoAtual
  })
}

/* Preenche de uma vez com os dados da FGF */
function preencherDaFGF({ titulo, jogadores }) {
  setEstado((estadoAtual) => {
    if (titulo) estadoAtual.titulo = String(titulo).slice(0, 32).toUpperCase()

    if (Array.isArray(jogadores) && jogadores.length) {
      estadoAtual.jogadores = jogadores.map((j, i) => ({
        pos: String(j.pos ?? i + 1),
        nome: String(j.nome || '').slice(0, 24).toUpperCase(),
        sigla: String(j.sigla || '').slice(0, 4).toUpperCase(),
        gols: String(j.gols ?? ''),
      }))
    }

    return estadoAtual
  })
}

function linhaVazia() {
  return { pos: '', nome: '', sigla: '', gols: '' }
}

function adicionarJogador() {
  setEstado((estadoAtual) => {
    estadoAtual.jogadores.push(linhaVazia())
    return estadoAtual
  })
}

function removerJogador(indice) {
  setEstado((estadoAtual) => {
    if (estadoAtual.jogadores.length <= 1) return estadoAtual
    estadoAtual.jogadores.splice(indice, 1)
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

export const artilheiros = {
  getEstado,
  inscrever,
  atualizarCampo,
  atualizarJogador,
  preencherDaFGF,
  adicionarJogador,
  removerJogador,
  mostrar,
  ocultar,
}
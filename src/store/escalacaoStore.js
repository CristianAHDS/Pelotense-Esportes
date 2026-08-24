import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js'

const STORAGE_KEY = 'pelotense:escalacao:v1'
const CHANNEL_NAME = 'broadcast:sync-escalacao-v1'
const MSG_TIPO = 'estado:escalacao:v1'
const CANAL_NUVEM = 'escalacao'

function timePadrao() {
  return Array.from({ length: 11 }, (_, i) => ({ num: String(i + 1), nome: '' }))
}

const estadoPadrao = {
  visivel: true,
  corCasa: '#008F3D',
  nomeCasa: 'PELOTENSE',
  siglaCasa: 'PEL',
  formacaoCasa: '4-3-3',
  corFora: '#1d4ed8',
  nomeFora: 'VISITANTE',
  siglaFora: 'VIS',
  formacaoFora: '4-3-3',
  jogadores: {
    casa: timePadrao(),
    fora: timePadrao()
  }
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      const salvo = JSON.parse(bruto)
      const estado = { ...structuredClone(estadoPadrao), ...salvo }
      estado.jogadores = {
        casa: Array.isArray(salvo.jogadores?.casa) ? salvo.jogadores.casa : structuredClone(estadoPadrao.jogadores.casa),
        fora: Array.isArray(salvo.jogadores?.fora) ? salvo.jogadores.fora : structuredClone(estadoPadrao.jogadores.fora)
      }
      return estado
    }
  } catch (e) {
    console.warn('Escalação: falha ao carregar estado.', e)
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
    console.warn('Escalação: falha ao persistir estado.', e)
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
    publicarNuvem(CANAL_NUVEM, pacote)
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
      console.warn('Escalação: falha ao sincronizar via storage.', e)
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
      case 'nomeCasa':
        estadoAtual.nomeCasa = String(valor).slice(0, 24).toUpperCase()
        break
      case 'siglaCasa':
        estadoAtual.siglaCasa = String(valor).slice(0, 4).toUpperCase() || '---'
        break
      case 'corCasa':
        estadoAtual.corCasa = valor
        break
      case 'formacaoCasa':
        estadoAtual.formacaoCasa = valor
        break
      case 'nomeFora':
        estadoAtual.nomeFora = String(valor).slice(0, 24).toUpperCase()
        break
      case 'siglaFora':
        estadoAtual.siglaFora = String(valor).slice(0, 4).toUpperCase() || '---'
        break
      case 'corFora':
        estadoAtual.corFora = valor
        break
      case 'formacaoFora':
        estadoAtual.formacaoFora = valor
        break
      default:
        estadoAtual[campo] = valor
    }
    return estadoAtual
  })
}

function atualizarJogador(lado, indice, campo, valor) {
  setEstado((estadoAtual) => {
    const lista = estadoAtual.jogadores[lado]
    if (!lista || !lista[indice]) return estadoAtual
    if (campo === 'num') lista[indice].num = String(valor).slice(0, 2)
    else lista[indice].nome = String(valor).slice(0, 22).toUpperCase()
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

export const escalacao = {
  getEstado,
  inscrever,
  atualizarCampo,
  atualizarJogador,
  mostrar,
  ocultar
}

import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js'

const STORAGE_KEY = 'pelotense:ultima-rodada:v1'
const CHANNEL_NAME = 'broadcast:sync-ultima-rodada-v1'
const MSG_TIPO = 'estado:ultima-rodada:v1'
const CANAL_NUVEM = 'ultima-rodada'

const RENOME_SIGLAS = { GVA: 'GUA' }

function normalizarSigla(sigla) {
  const s = String(sigla || '').toUpperCase()
  return RENOME_SIGLAS[s] || s
}

function normalizarEstado(estadoAtual) {
  for (const jogo of estadoAtual.jogos || []) {
    jogo.casaSigla = normalizarSigla(jogo.casaSigla)
    jogo.foraSigla = normalizarSigla(jogo.foraSigla)
  }
  for (const posicao of estadoAtual.posicoes || []) {
    posicao.sigla = normalizarSigla(posicao.sigla)
  }
  return estadoAtual
}

function jogosPadrao() {
  return Array.from({ length: 6 }, () => ({
    casaSigla: '',
    casaNome: '',
    casaGols: '',
    foraGols: '',
    foraSigla: '',
    foraNome: ''
  }))
}

function posicoesPadrao() {
  return Array.from({ length: 6 }, () => ({ sigla: '', nome: '', pos: '' }))
}

const estadoPadrao = {
  visivel: true,
  titulo: 'ÚLTIMA RODADA',
  jogos: jogosPadrao(),
  posicoes: posicoesPadrao(),
  classificacaoVisivel: true
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      const salvo = JSON.parse(bruto)
      const estado = { ...structuredClone(estadoPadrao), ...salvo }
      estado.jogos = Array.isArray(salvo.jogos) ? salvo.jogos.map(j => ({
        ...j,
        casaNome: j.casaNome || '',
        foraNome: j.foraNome || ''
      })) : jogosPadrao()
      estado.posicoes = Array.isArray(salvo.posicoes) ? salvo.posicoes : posicoesPadrao()
      /* Migração do formato antigo (pontos) para posição na tabela */
      estado.posicoes = estado.posicoes.map((p, i) => ({
        sigla: p.sigla || '',
        nome: p.nome || '',
        pos: p.pos ?? p.pontos ?? String(i + 1)
      }))
      return normalizarEstado(estado)
    }
  } catch (e) {
    console.warn('Última rodada: falha ao carregar estado.', e)
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
    console.warn('Última rodada: falha ao persistir estado.', e)
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
  if (ultimosSync.includes(serializado) || serializado === JSON.stringify(estado)) return
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
      console.warn('Última rodada: falha ao sincronizar via storage.', e)
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

function atualizarJogo(indice, campo, valor) {
  setEstado((estadoAtual) => {
    const jogo = estadoAtual.jogos[indice]
    if (!jogo) return estadoAtual
    if (campo === 'casaGols' || campo === 'foraGols') {
      jogo[campo] = String(valor).replace(/[^0-9]/g, '').slice(0, 2)
    } else if (campo === 'casaNome' || campo === 'foraNome') {
      jogo[campo] = String(valor).slice(0, 20)
    } else {
      jogo[campo] = String(valor).slice(0, 4).toUpperCase()
    }
    return estadoAtual
  })
}

function atualizarPosicao(indice, campo, valor) {
  setEstado((estadoAtual) => {
    const posicao = estadoAtual.posicoes[indice]
    if (!posicao) return estadoAtual
    if (campo === 'pos') {
      posicao.pos = String(valor).replace(/[^0-9]/g, '').slice(0, 2)
    } else if (campo === 'nome') {
      posicao.nome = String(valor).slice(0, 20)
    } else {
      posicao.sigla = String(valor).slice(0, 4).toUpperCase()
    }
    return estadoAtual
  })
}

/* Preenche tudo de uma vez com os dados da FGF */
function preencherDaFGF({ titulo, jogos, classificacao }) {
  setEstado((estadoAtual) => {
    if (titulo) estadoAtual.titulo = String(titulo).slice(0, 32).toUpperCase()

    if (Array.isArray(jogos) && jogos.length) {
      estadoAtual.jogos = jogos.map((j) => ({
        casaSigla: String(j.casaSigla || '').slice(0, 4).toUpperCase(),
        casaNome: String(j.casaNome || j.casaSigla || '').slice(0, 20),
        casaGols: String(j.casaGols ?? ''),
        foraGols: String(j.foraGols ?? ''),
        foraSigla: String(j.foraSigla || '').slice(0, 4).toUpperCase(),
        foraNome: String(j.foraNome || j.foraSigla || '').slice(0, 20)
      }))
    }

    if (Array.isArray(classificacao) && classificacao.length) {
      estadoAtual.posicoes = classificacao.map((c, i) => ({
        sigla: String(c.sigla || '').slice(0, 4).toUpperCase(),
        nome: String(c.nome || c.sigla || '').slice(0, 20),
        pos: String(c.pos ?? i + 1)
      }))
    }

    return estadoAtual
  })
}

function linhaJogoVazia() {
  return { casaSigla: '', casaNome: '', casaGols: '', foraGols: '', foraSigla: '', foraNome: '' }
}

function adicionarJogo() {
  setEstado((estadoAtual) => {
    estadoAtual.jogos.push(linhaJogoVazia())
    return estadoAtual
  })
}

function removerJogo(indice) {
  setEstado((estadoAtual) => {
    if (estadoAtual.jogos.length <= 1) return estadoAtual
    estadoAtual.jogos.splice(indice, 1)
    return estadoAtual
  })
}

function adicionarPosicao() {
  setEstado((estadoAtual) => {
    const proxima =
      estadoAtual.posicoes.reduce((maior, p) => Math.max(maior, Number(p.pos) || 0), 0) + 1
    estadoAtual.posicoes.push({ sigla: '', nome: '', pos: String(proxima) })
    return estadoAtual
  })
}

function removerPosicao(indice) {
  setEstado((estadoAtual) => {
    if (estadoAtual.posicoes.length <= 1) return estadoAtual
    estadoAtual.posicoes.splice(indice, 1)
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

function mostrarClassificacao() {
  setEstado((estadoAtual) => {
    estadoAtual.classificacaoVisivel = true
    return estadoAtual
  })
}

function ocultarClassificacao() {
  setEstado((estadoAtual) => {
    estadoAtual.classificacaoVisivel = false
    return estadoAtual
  })
}

export const ultimaRodada = {
  getEstado,
  inscrever,
  atualizarCampo,
  atualizarJogo,
  atualizarPosicao,
  preencherDaFGF,
  adicionarJogo,
  removerJogo,
  adicionarPosicao,
  removerPosicao,
  mostrar,
  ocultar,
  mostrarClassificacao,
  ocultarClassificacao
}

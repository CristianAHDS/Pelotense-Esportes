import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js'
import { elencoDaSigla, nomeDaSigla } from '../lib/elencos.js'

const STORAGE_KEY = 'pelotense:broadcast-escalacao:v1'
const CHANNEL_NAME = 'broadcast:sync-broadcast-escalacao-v1'
const MSG_TIPO = 'estado:broadcast-escalacao:v1'
const CANAL_NUVEM = 'placar-broadcast-escalacao'

export const ESTADOS_PARTIDA = ['AO VIVO', 'INTERVALO', 'ENCERRADO']
export const FORMACOES = ['4-3-3', '4-4-2', '4-2-3-1', '4-1-4-1', '3-5-2', '3-4-3', '5-3-2', '4-3-1-2']

function jogadorPadrao() {
  return { num: '', nome: '', cartoes: { amarelo: 0, vermelho: 0 }, gols: 0, expulso: false }
}

function timePadrao() {
  return Array.from({ length: 11 }, () => jogadorPadrao())
}

const estadoPadrao = {
  timeCasa: { nome: 'CASA', gols: 0 },
  timeVisitante: { nome: 'VISITANTE', gols: 0 },
  cronometro: { base: 0, rodando: false, iniciadoEm: null },
  periodo: '1T',
  acrescimo: null,
  eventoGol: null,
  corCasa: '#1f1f1f',
  corCasaBorda: '#0a0a0a',
  corVisitante: '#1f1f1f',
  corVisitanteBorda: '#0a0a0a',
  estadoPartida: 'AO VIVO',
  escalacao: {
    nomeCasa: 'CASA',
    siglaCasa: 'CAS',
    formacaoCasa: '4-3-3',
    tecnicoCasa: '',
    corCasa: '#008F3D',
    corFora: '#1d4ed8',
    nomeFora: 'VISITANTE',
    siglaFora: 'VIS',
    formacaoFora: '4-3-3',
    tecnicoFora: '',
    jogadores: { casa: timePadrao(), fora: timePadrao() }
  },
  escalacaoVisivel: true,
  notificacao: null
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (bruto) {
      const salvo = JSON.parse(bruto)
      const estado = { ...structuredClone(estadoPadrao), ...salvo }
      const esc = { ...structuredClone(estadoPadrao.escalacao), ...salvo.escalacao }
      esc.jogadores = {
        casa: Array.isArray(salvo.escalacao?.jogadores?.casa)
          ? salvo.escalacao.jogadores.casa.map(normalizarJogador)
          : timePadrao(),
        fora: Array.isArray(salvo.escalacao?.jogadores?.fora)
          ? salvo.escalacao.jogadores.fora.map(normalizarJogador)
          : timePadrao()
      }
      estado.escalacao = esc
      return estado
    }
  } catch (e) {
    console.warn('PlacarEscalacao: falha ao carregar estado.', e)
  }
  return structuredClone(estadoPadrao)
}

function normalizarJogador(j) {
  const cartoes = {
    amarelo: Math.max(0, Number(j?.cartoes?.amarelo) || 0),
    vermelho: Math.max(0, Number(j?.cartoes?.vermelho) || 0)
  }
  return {
    num: String(j?.num || ''),
    nome: String(j?.nome || ''),
    cartoes,
    gols: Math.max(0, Number(j?.gols) || 0),
    expulso: Boolean(j?.expulso)
  }
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
    console.warn('PlacarEscalacao: falha ao persistir estado.', e)
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

function minutoDeJogo(cron) {
  return Math.floor(segundosAtuais(cron) / 60)
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
  if (JSON.stringify(novoEstado) === JSON.stringify(estado)) return
  if (!processandoRemoto) {
    const cron = novoEstado.cronometro
    if (cron?.rodando) {
      if (typeof cron.iniciadoEm === 'number') {
        /* Referência de tempo absoluta: o tempo é recomputado a partir de
           `iniciadoEm`. O snapshot `segundos` pode chegar defasado pela
           latência da nuvem e, se usado para re-basear, faz o relógio voltar
           quando qualquer outra informação muda no controle. Por isso ele é
           descartado e o lado local segue o `iniciadoEm` (carimbo de época,
           imune à latência). */
        delete cron.segundos
      } else {
        /* Sem referência de tempo confiável: restaura a partir do snapshot. */
        const baseSnap = typeof cron.segundos === 'number' ? cron.segundos : segundosAtuais(cron)
        cron.base = Math.max(0, Math.floor(baseSnap))
        cron.iniciadoEm = Date.now()
        delete cron.segundos
      }
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
      console.warn('PlacarEscalacao: falha ao sincronizar via storage.', e)
    }
  }
})

/* ---------- Assinatura ---------- */

export function inscrever(ouvinte) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

/* ---------- Ações do placar ---------- */

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

export function renomearTime(lado, sigla) {
  setEstado((estado) => aplicarTimeSelecionado(estado, lado, sigla))
}

function aplicarTimeSelecionado(estado, lado, sigla) {
  const prefCasa = lado === 'casa'
  const chave = prefCasa ? 'timeCasa' : 'timeVisitante'
  const esc = estado.escalacao
  const s = String(sigla || '').toUpperCase()
  const nome = nomeDaSigla(s)
  const elenco = elencoDaSigla(s)
  const campoSigla = prefCasa ? 'siglaCasa' : 'siglaFora'
  const campoNome = prefCasa ? 'nomeCasa' : 'nomeFora'

  estado[chave].nome = s || (prefCasa ? 'CASA' : 'VISITANTE')

  esc[campoSigla] = s || '---'
  if (nome) esc[campoNome] = nome
  if (elenco) {
    if (prefCasa) esc.jogadores.casa = elenco
    else esc.jogadores.fora = elenco
  }
  return estado
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
  { fundo: '#db2777', borda: '#9d174d', nome: 'Rosa' }
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

export function resetarPartida() {
  setEstado(() => structuredClone(estadoPadrao))
}

/* ---------- Ações da escalação ---------- */

export function atualizarEscalacaoCampo(campo, valor) {
  setEstado((estado) => {
    const esc = estado.escalacao
    switch (campo) {
      case 'nomeCasa':
        esc.nomeCasa = String(valor).slice(0, 24).toUpperCase()
        break
      case 'siglaCasa':
        esc.siglaCasa = String(valor).slice(0, 4).toUpperCase() || '---'
        break
      case 'corCasa':
        esc.corCasa = valor
        break
      case 'formacaoCasa':
        esc.formacaoCasa = valor
        break
      case 'tecnicoCasa':
        esc.tecnicoCasa = String(valor).slice(0, 28).toUpperCase()
        break
      case 'nomeFora':
        esc.nomeFora = String(valor).slice(0, 24).toUpperCase()
        break
      case 'siglaFora':
        esc.siglaFora = String(valor).slice(0, 4).toUpperCase() || '---'
        break
      case 'corFora':
        esc.corFora = valor
        break
      case 'formacaoFora':
        esc.formacaoFora = valor
        break
      case 'tecnicoFora':
        esc.tecnicoFora = String(valor).slice(0, 28).toUpperCase()
        break
      default:
        esc[campo] = valor
    }
    return estado
  })
}

export function preencherDeSigla(lado, sigla) {
  setEstado((estado) => aplicarTimeSelecionado(estado, lado, sigla))
}

export function atualizarJogador(lado, indice, campo, valor) {
  setEstado((estado) => {
    const lista = estado.escalacao.jogadores[lado]
    if (!lista || !lista[indice]) return estado
    if (campo === 'num') lista[indice].num = String(valor).slice(0, 2)
    else if (campo === 'nome') lista[indice].nome = String(valor).slice(0, 28).toUpperCase()
    return estado
  })
}

function notificarCartao(lado, indice, cor, estadoAtual) {
  const lista = estadoAtual.escalacao.jogadores[lado]
  const jogador = lista?.[indice] || {}
  const chave = lado === 'casa' ? 'siglaCasa' : 'siglaFora'
  const time = estadoAtual.escalacao[chave]
  return {
    tipo: 'cartao',
    lado,
    cor,
    corTime: lado === 'casa' ? estadoAtual.escalacao.corCasa : estadoAtual.escalacao.corFora,
    indice,
    num: jogador.num,
    nome: jogador.nome,
    sigla: time,
    minuto: minutoDeJogo(estadoAtual.cronometro),
    em: Date.now(),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  }
}

export function notificarGol(lado, indice, estadoAtual) {
  const lista = estadoAtual.escalacao.jogadores[lado]
  const jogador = lista?.[indice] || {}
  const chave = lado === 'casa' ? 'siglaCasa' : 'siglaFora'
  const time = estadoAtual.escalacao[chave]
  return {
    tipo: 'gol',
    lado,
    indice,
    num: jogador.num,
    nome: jogador.nome,
    sigla: time,
    cor: lado === 'casa' ? estadoAtual.escalacao.corCasa : estadoAtual.escalacao.corFora,
    minuto: minutoDeJogo(estadoAtual.cronometro),
    em: Date.now(),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  }
}

export function marcarGol(lado, indice) {
  setEstado((estado) => {
    const lista = estado.escalacao.jogadores[lado]
    if (!lista || !lista[indice]) return estado
    lista[indice].gols = (lista[indice].gols || 0) + 1
    const chaveTime = lado === 'casa' ? 'timeCasa' : 'timeVisitante'
    estado[chaveTime].gols = Math.max(0, estado[chaveTime].gols + 1)
    estado.eventoGol = { lado: lado === 'casa' ? 'casa' : 'visitante', em: Date.now() }
    estado.notificacao = notificarGol(lado, indice, estado)
    return estado
  })
}

export function darCartaoJogador(lado, indice, cor) {
  setEstado((estado) => {
    const lista = estado.escalacao.jogadores[lado]
    if (!lista || !lista[indice]) return estado
    if (cor === 'amarelo' && lista[indice].cartoes.amarelo >= 1) return estado
    if (cor === 'vermelho' && lista[indice].cartoes.vermelho >= 1) return estado
    lista[indice].cartoes[cor]++
    if (cor === 'vermelho') lista[indice].expulso = true
    estado.notificacao = notificarCartao(lado, indice, cor, estado)
    return estado
  })
}

export function removerCartaoJogador(lado, indice, cor) {
  setEstado((estado) => {
    const lista = estado.escalacao.jogadores[lado]
    if (!lista || !lista[indice]) return estado
    lista[indice].cartoes[cor] = Math.max(0, lista[indice].cartoes[cor] - 1)
    if (cor === 'vermelho' && lista[indice].cartoes.vermelho === 0) {
      lista[indice].expulso = false
    }
    return estado
  })
}

export function mostrarEscalacao() {
  setEstado((estado) => {
    estado.escalacaoVisivel = true
    return estado
  })
}

export function ocultarEscalacao() {
  setEstado((estado) => {
    estado.escalacaoVisivel = false
    return estado
  })
}

/* ---------- Substituição integrada à escalação ---------- */

export function realizarSubstituicao({ lado, sairIndice, numEntra, nomeEntra, minuto }) {
  setEstado((estado) => {
    const lista = estado.escalacao.jogadores[lado]
    if (!lista || !lista[sairIndice]) return estado
    const esc = estado.escalacao
    const sair = lista[sairIndice]
    const m = String(minuto || `${minutoDeJogo(estado.cronometro)}'`).slice(0, 6) || `'`
    const entraNum = String(numEntra || '').slice(0, 2)
    const entraNome = String(nomeEntra || '').slice(0, 28).toUpperCase()
    estado.notificacao = {
      tipo: 'troca',
      lado,
      cor: lado === 'casa' ? esc.corCasa : esc.corFora,
      sigla: lado === 'casa' ? esc.siglaCasa : esc.siglaFora,
      nome: lado === 'casa' ? esc.nomeCasa : esc.nomeFora,
      minuto: m,
      saiNum: sair.num,
      saiNome: sair.nome,
      entraNum,
      entraNome,
      em: Date.now(),
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    }
    lista[sairIndice] = {
      num: entraNum,
      nome: entraNome,
      cartoes: { amarelo: 0, vermelho: 0 },
      gols: 0
    }
    return estado
  })
}

export function limparNotificacao() {
  setEstado((estado) => {
    estado.notificacao = null
    return estado
  })
}

export function formatarTempo(totalSegundos) {
  const horas = Math.floor(totalSegundos / 3600)
  const minutos = Math.floor((totalSegundos % 3600) / 60)
  const segundos = totalSegundos % 60
  const mm = String(minutos).padStart(2, '0')
  const ss = String(segundos).padStart(2, '0')
  return horas > 0 ? `${horas}:${mm}:${ss}` : `${mm}:${ss}`
}

export const placarBroadcastEscalacao = {
  getEstado,
  inscrever
}

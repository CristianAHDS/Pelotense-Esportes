import { getEstado, aplicarEstatisticas } from '../store/tabelaStore'

/* Página da classificação do Gauchão Série A2 no site da FGF.
   Atualize aqui se a FGF mudar o endereço da competição. */
const CAMINHO_CLASSIFICACAO = '/competicoes/profissional/24/2026/4218'

/* Enquanto o cache estiver fresco, nenhum acesso à rede é feito. */
const CHAVE_CACHE = 'pelotense:tabela:fgf:v1'
const TTL_CACHE_MS = 3 * 60 * 1000

/* Siglas usadas pela FGF -> siglas padrão da nossa tabela */
const SIGLAS_FGF_PARA_PADRAO = {
  VEC: 'VER',
  PFU: 'PAS',
  ESP: 'ESP',
  AIM: 'AIM',
  BRA: 'BRA',
  STA: 'SCR',
  APF: 'APA',
  UNI: 'UFR',
  GAU: 'GAU',
  PEL: 'PEL',
  BFA: 'BFR',
  GRA: 'GRA',
  GUA: 'GVA',
  BAG: 'BAG',
  GLO: 'GLO',
  LAJ: 'LAJ',
}

/* Nomes usados pela FGF -> nomes padrão da nossa tabela
   (chaves já normalizadas, sem acento/espaço) */
const APELIDOS_NOMES_FGF = {
  brassaf: 'brasildepelotas',
  guaraniva: 'guaranirs',
}

let buscaEmVoo = null

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function hashDe(dados) {
  return dados
    .map((t) => [t.sigla, t.p, t.j, t.v, t.e, t.d, t.gp, t.gc].join(':'))
    .join('|')
}

function lerCache() {
  try {
    const bruto = localStorage.getItem(CHAVE_CACHE)
    if (!bruto) return null
    const cache = JSON.parse(bruto)
    if (!Array.isArray(cache?.dados) || !cache.dados.length) return null
    return cache
  } catch (e) {
    return null
  }
}

function gravarCache(dados) {
  try {
    localStorage.setItem(
      CHAVE_CACHE,
      JSON.stringify({ quando: Date.now(), hash: hashDe(dados), dados })
    )
  } catch (e) {
    console.warn('FGF: falha ao salvar cache.', e)
  }
}

async function obterHtml() {
  const candidatos = [
    `/fgf${CAMINHO_CLASSIFICACAO}`,
    `https://fgf.com.br${CAMINHO_CLASSIFICACAO}`,
  ]

  let ultimoErro = null
  for (const url of candidatos) {
    try {
      const resposta = await fetch(url, { headers: { Accept: 'text/html' } })
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
      return await resposta.text()
    } catch (e) {
      ultimoErro = e
    }
  }
  throw ultimoErro || new Error('Não foi possível acessar o site da FGF')
}

function numeroDe(texto) {
  const n = parseInt(String(texto).replace(/\D/g, ''), 10)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function extrairClassificacao(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const porChave = new Map()

  for (const tabela of doc.querySelectorAll('table')) {
    if (!tabela.querySelector('th.posicao')) continue

    for (const tr of tabela.querySelectorAll('tr')) {
      const tdPontos = tr.querySelector('td.pontos')
      if (!tdPontos) continue

      const imgNome = tr.querySelector(
        'td.posicao-time img[title], td.posicao-time2 img[title]'
      )
      const nome = (imgNome?.getAttribute('title') || '').trim()

      /* A célula da sigla vem como "5º BRA" (posição + sigla) */
      const celulaSigla = (
        tr.querySelector('td.posicao-time2')?.textContent || ''
      ).trim()
      const tokensSigla = celulaSigla.split(/\s+/).filter(Boolean)
      const sigla = (
        tokensSigla[tokensSigla.length - 1] || ''
      ).toUpperCase()

      if (!nome && !sigla) continue

      const nums = [...tr.querySelectorAll('td.dados')].map((td) =>
        numeroDe(td.textContent)
      )

      const time = {
        nome,
        sigla,
        p: numeroDe(tdPontos.textContent),
        j: nums[0],
        v: nums[1],
        e: nums[2],
        d: nums[3],
        gp: nums[4],
        gc: nums[5],
      }

      porChave.set(`${normalizar(nome)}|${sigla}`, time)
    }
  }

  return [...porChave.values()]
}

function casarPorNome(timeLocal, nomeFgf) {
  const nl = normalizar(timeLocal.nome)
  let nf = normalizar(nomeFgf)
  nf = APELIDOS_NOMES_FGF[nf] || nf
  if (!nl || !nf) return false
  return nl === nf
}

function casarParcial(timeLocal, nomeFgf) {
  const nl = normalizar(timeLocal.nome)
  const nf = normalizar(nomeFgf)
  if (!nl || !nf || nl.length <= 3 || nf.length <= 3) return false
  return nl.includes(nf) || nf.includes(nl)
}

function casarPorSigla(timeLocal, siglaFgf) {
  const sl = normalizar(timeLocal.sigla)
  if (!sl) return false
  const mapeada = normalizar(SIGLAS_FGF_PARA_PADRAO[siglaFgf] || siglaFgf)
  return !!mapeada && (sl === mapeada || sl === normalizar(siglaFgf))
}

/* Casa os times da FGF com os times locais (por nome exato, depois
   parcial e por fim por sigla), devolvendo [{ indice, stats }] */
export function resolverCasamentos(timesLocais, dadosFgf) {
  const pares = []
  const usados = new Set()

  const procurar = (predicado) => {
    const indice = timesLocais.findIndex(
      (t, i) => !usados.has(i) && predicado(t)
    )
    if (indice >= 0) usados.add(indice)
    return indice
  }

  for (const f of dadosFgf) {
    let indice = procurar((t) => casarPorNome(t, f.nome))
    if (indice < 0) indice = procurar((t) => casarParcial(t, f.nome))
    if (indice < 0) indice = procurar((t) => casarPorSigla(t, f.sigla))
    if (indice < 0) continue

    pares.push({
      indice,
      stats: { p: f.p, j: f.j, v: f.v, e: f.e, d: f.d, gp: f.gp, gc: f.gc },
    })
  }

  return pares
}

function aplicarDados(dados) {
  const pares = resolverCasamentos(getEstado().times, dados)
  return pares.length ? aplicarEstatisticas(pares) : 0
}

export async function buscarClassificacaoFGF({ forcar = false } = {}) {
  if (buscaEmVoo) return buscaEmVoo

  buscaEmVoo = (async () => {
    try {
      const html = await obterHtml()
      const dados = extrairClassificacao(html)
      if (!dados.length) {
        throw new Error('Classificação não encontrada na página da FGF')
      }
      gravarCache(dados)
      return dados
    } finally {
      buscaEmVoo = null
    }
  })()

  return buscaEmVoo
}

/* Fluxo principal:
   1. Cache fresco -> usa localStorage, zero rede e zero recarga.
   2. Cache velho/ausente -> busca na rede; o store aplica apenas
      os valores que mudaram (sem notificação se nada mudou).
   3. Falha de rede -> cai para o último cache conhecido. */
export async function importarClassificacaoFGF({ forcar = false } = {}) {
  const cache = lerCache()
  const idade = cache ? Date.now() - (cache.quando || 0) : Infinity

  if (!forcar && cache && idade < TTL_CACHE_MS) {
    return {
      total: cache.dados.length,
      atualizados: aplicarDados(cache.dados),
      quando: cache.quando,
      origem: 'cache',
      mudou: false,
    }
  }

  try {
    const dados = await buscarClassificacaoFGF({ forcar })
    return {
      total: dados.length,
      atualizados: aplicarDados(dados),
      quando: Date.now(),
      origem: 'rede',
      mudou: !cache || cache.hash !== hashDe(dados),
    }
  } catch (erro) {
    if (cache) {
      return {
        total: cache.dados.length,
        atualizados: aplicarDados(cache.dados),
        quando: cache.quando,
        origem: 'cache',
        mudou: false,
      }
    }
    throw erro
  }
}

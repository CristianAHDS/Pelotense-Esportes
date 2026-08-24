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

      /* Posição vem junto na célula ("5º BRA") */
      const posTexto = String(tokensSigla[0] || '').replace(/\D/g, '')
      const pos = posTexto ? numeroDe(posTexto) : 0

      if (!nome && !sigla) continue

      const nums = [...tr.querySelectorAll('td.dados')].map((td) =>
        numeroDe(td.textContent)
      )

      const time = {
        pos,
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

/* ---------- Última rodada (jogos realizados + posições) ---------- */

const CHAVE_CACHE_UR = 'pelotense:ultima-rodada:fgf:v3'

function mapaNomeParaSigla(dados) {
  return dados.map((t) => ({
    chave: normalizar(t.nome),
    sigla: SIGLAS_FGF_PARA_PADRAO[t.sigla] || String(t.sigla || '').slice(0, 4),
  }))
}

/* Casa um texto (slug do jogo ou nome completo do clube) com os nomes
   da classificação. Prioridade: igualdade > sufixo ("…brasilsaf" termina
   com "brasilsaf") > contenção, sempre preferindo a chave mais longa —
   evita que "gremioesportivobrasilsaf" case com "esportivo". */
function casarSigla(entradas, texto) {
  const alvo = normalizar(texto)
  if (!alvo) return null
  let melhor = null
  for (const e of entradas) {
    if (!e.chave || e.chave.length < 4) continue
    let p = -1
    if (e.chave === alvo) p = 100
    else if (alvo.endsWith(e.chave)) p = 60 + e.chave.length
    else if (alvo.includes(e.chave) || e.chave.includes(alvo))
      p = 30 + e.chave.length
    if (p >= 0 && (!melhor || p > melhor.p)) melhor = { ...e, p }
  }
  return melhor?.sigla || null
}

/* Extrai a rodada corrente do carrossel da página de classificação.
   Blocos especiais ("JOGOS ADIADOS", "Classificação Geral") são ignorados.
   O time é resolvido pelo slug do link do jogo (/jogo/casaXvisitante-…),
   que usa o nome canônico do clube — o atributo title das imagens traz
   nomes longos ("Grêmio Esportivo Bagé") que não batem com a classificação
   ("Bagé"). Jogos sem placar numérico entram como agendados (gols vazios). */
function extrairUltimaRodada(html, entradas) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const itens = [...doc.querySelectorAll('.carousel-item')]

  const lerItem = (item) => {
    const titulo = (
      item.querySelector('.carousel-titulo h4')?.textContent || ''
    )
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase()
    if (!titulo || /ADIADAS|ADIADOS|GERAL/.test(titulo)) return null

    const jogos = []
    let realizados = 0
    for (const bloco of item.querySelectorAll('.carousel-conteudo')) {
      const nomeCasa =
        bloco.querySelector('.mandante img')?.getAttribute('title') || ''
      const nomeFora =
        bloco.querySelector('.visitante img')?.getAttribute('title') || ''
      if (!nomeCasa && !nomeFora) continue

      const mSlug = (bloco.querySelector('.contra a')?.getAttribute('href') || '')
        .match(/\/jogo\/([a-z0-9]+)x([a-z0-9]+)/i)

      const placarTexto = (
        bloco.querySelector('.contra div')?.textContent || ''
      ).trim()
      const m = placarTexto.match(/^(\d+)\s*[Xx×]\s*(\d+)$/)
      if (m) realizados++

      jogos.push({
        casaSigla:
          (mSlug && casarSigla(entradas, mSlug[1])) ||
          casarSigla(entradas, nomeCasa) ||
          nomeCasa.slice(0, 4).toUpperCase(),
        foraSigla:
          (mSlug && casarSigla(entradas, mSlug[2])) ||
          casarSigla(entradas, nomeFora) ||
          nomeFora.slice(0, 4).toUpperCase(),
        casaGols: m ? m[1] : '',
        foraGols: m ? m[2] : '',
      })
    }

    return { titulo, jogos, realizados }
  }

  /* Rodada corrente: a mais recente com algum resultado; quando essa
     rodada termina por completo, passa a valer a seguinte — mesmo que
     seus jogos ainda não tenham começado. */
  const lidas = itens.map(lerItem).filter(Boolean)
  if (!lidas.length) return null

  let indice = -1
  for (let i = lidas.length - 1; i >= 0; i--) {
    if (lidas[i].realizados > 0) {
      indice = i
      break
    }
  }
  if (indice === -1) return lidas[0]

  const atual = lidas[indice]
  const terminou =
    atual.jogos.length > 0 && atual.realizados >= atual.jogos.length
  const proxima = lidas[indice + 1]
  return terminou && proxima ? proxima : atual
}

function lerCacheUR() {
  try {
    const bruto = localStorage.getItem(CHAVE_CACHE_UR)
    if (!bruto) return null
    const cache = JSON.parse(bruto)
    if (!cache?.pacote) return null
    return cache
  } catch (e) {
    return null
  }
}

function gravarCacheUR(pacote) {
  try {
    localStorage.setItem(
      CHAVE_CACHE_UR,
      JSON.stringify({ quando: Date.now(), pacote })
    )
  } catch (e) {
    console.warn('FGF: falha ao salvar cache da última rodada.', e)
  }
}

export async function importarUltimaRodadaFGF({ forcar = false } = {}) {
  const aplicarPacote = (pacote) => ({
    titulo: pacote.titulo,
    jogos: pacote.jogos,
    classificacao: pacote.classificacao,
    quando: pacote.quando,
  })

  const cache = lerCacheUR()
  const idade = cache ? Date.now() - (cache.quando || 0) : Infinity
  if (!forcar && cache && idade < TTL_CACHE_MS) {
    return { ...aplicarPacote(cache.pacote), origem: 'cache' }
  }

  try {
    const html = await obterHtml()
    const dadosClass = extrairClassificacao(html)
    if (!dadosClass.length) {
      throw new Error('Classificação não encontrada na página da FGF')
    }

    const entradas = mapaNomeParaSigla(dadosClass)
    const rodada = extrairUltimaRodada(html, entradas)

    const classificacao = dadosClass
      .filter((t) => t.pos > 0)
      .sort((a, b) => a.pos - b.pos)
      .map((t) => ({
        sigla: SIGLAS_FGF_PARA_PADRAO[t.sigla] || t.sigla,
        pos: t.pos,
      }))

    const pacote = {
      titulo: rodada?.titulo || '',
      jogos: rodada?.jogos || [],
      classificacao,
      quando: Date.now(),
    }
    gravarCacheUR(pacote)
    return { ...aplicarPacote(pacote), origem: 'rede' }
  } catch (erro) {
    if (cache) {
      return { ...aplicarPacote(cache.pacote), origem: 'cache' }
    }
    throw erro
  }
}

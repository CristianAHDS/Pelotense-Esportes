import { getEstado, aplicarEstatisticas } from '../store/tabelaStore';
import { resolverCasamentos } from './fgfService';
import { nomeCanonico, variantesNome } from '../lib/nomesClubes.js';

const URL_CLASSIFICACAO = '/superplacar/campeonato/55/gaucho-serie-a2/';
const URL_CLASSIFICACAO_DIRETA =
  'https://superplacar.com.br/campeonato/55/gaucho-serie-a2/';

const URL_RODADA = '/superplacar/rodada/anterior/';
const URL_RODADA_DIRETA = 'https://superplacar.com.br/rodada/anterior/';

const CHAVE_CACHE = 'pelotense:tabela:superplacar:v1';
const CHAVE_CACHE_UR = 'pelotense:ultima-rodada:superplacar:v1';
const CHAVE_CACHE_RA = 'pelotense:rodada-atual:superplacar:v1';
const TTL_CACHE_MS = 3 * 60 * 1000;

let buscaEmVoo = null;

function numeroDe(texto) {
  const n = parseInt(String(texto).replace(/\D/g, ''), 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function hashDe(dados) {
  return dados.map((t) => [t.pos, t.sigla, t.p, t.j, t.v, t.e, t.d, t.gp, t.gc].join(':')).join('|');
}

async function obterHtml() {
  let ultimoErro = null;
  for (const url of [URL_CLASSIFICACAO, URL_CLASSIFICACAO_DIRETA]) {
    try {
      const resposta = await fetch(url, { headers: { Accept: 'text/html' } });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      return await resposta.text();
    } catch (e) {
      ultimoErro = e;
    }
  }
  throw ultimoErro || new Error('Não foi possível acessar o SuperPlacar');
}

export function extrairClassificacao(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const times = [];

  for (const linha of doc.querySelectorAll('.linha.classificacao')) {
    const nome = (
      linha.querySelector('.coluna.time figcaption')?.textContent || ''
    ).trim();
    if (!nome) continue;

    times.push({
      pos: numeroDe(
        linha.querySelector('.coluna.posicao span')?.textContent,
      ),
      nome: nomeCanonico(nome),
      sigla: '',
      p: numeroDe(linha.querySelector('.coluna.pontos')?.textContent),
      j: numeroDe(linha.querySelector('.coluna.jogos')?.textContent),
      v: numeroDe(linha.querySelector('.coluna.vitorias')?.textContent),
      e: numeroDe(linha.querySelector('.coluna.empates')?.textContent),
      d: numeroDe(linha.querySelector('.coluna.derrotas')?.textContent),
      gp: numeroDe(linha.querySelector('.coluna.gols-pro')?.textContent),
      gc: numeroDe(linha.querySelector('.coluna.gols-contra')?.textContent),
    });
  }

  return times;
}

function lerCache() {
  try {
    const bruto = localStorage.getItem(CHAVE_CACHE);
    if (!bruto) return null;
    const cache = JSON.parse(bruto);
    if (!Array.isArray(cache?.dados) || !cache.dados.length) return null;
    return cache;
  } catch (e) {
    return null;
  }
}

function gravarCache(dados) {
  try {
    localStorage.setItem(
      CHAVE_CACHE,
      JSON.stringify({ quando: Date.now(), hash: hashDe(dados), dados }),
    );
  } catch (e) {
    console.warn('SuperPlacar: falha ao salvar cache.', e);
  }
}

export async function buscarClassificacaoSuperPlacar({ forcar = false } = {}) {
  if (buscaEmVoo) return buscaEmVoo;

  buscaEmVoo = (async () => {
    try {
      const html = await obterHtml();
      const dados = extrairClassificacao(html);
      if (!dados.length) {
        throw new Error('Classificação não encontrada na página do SuperPlacar');
      }
      gravarCache(dados);
      return dados;
    } finally {
      buscaEmVoo = null;
    }
  })();

  return buscaEmVoo;
}

function aplicarDados(dados) {
  const pares = resolverCasamentos(getEstado().times, dados);
  return pares.length ? aplicarEstatisticas(pares) : 0;
}

export async function importarClassificacaoSuperPlacar({
  forcar = false,
} = {}) {
  const cache = lerCache();
  const idade = cache ? Date.now() - (cache.quando || 0) : Infinity;

  if (!forcar && cache && idade < TTL_CACHE_MS) {
    return {
      total: cache.dados.length,
      atualizados: aplicarDados(cache.dados),
      quando: cache.quando,
      origem: 'cache',
      mudou: false,
    };
  }

  try {
    const dados = await buscarClassificacaoSuperPlacar({ forcar });
    return {
      total: dados.length,
      atualizados: aplicarDados(dados),
      quando: Date.now(),
      origem: 'rede',
      mudou: !cache || cache.hash !== hashDe(dados),
    };
  } catch (erro) {
    if (cache) {
      return {
        total: cache.dados.length,
        atualizados: aplicarDados(cache.dados),
        quando: cache.quando,
        origem: 'cache',
        mudou: false,
      };
    }
    throw erro;
  }
}

/* ---------- Última rodada (resultados + posições) ---------- */

function chaveNome(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/* Mapa nome normalizado -> sigla local, montado a partir dos times da
   tabela (inclui todas as grafias conhecidas de cada clube). */
function mapaSiglas() {
  const porNome = new Map();
  for (const t of getEstado().times) {
    const sigla = String(t.sigla || '').toUpperCase();
    if (!sigla) continue;
    for (const variante of variantesNome(t.nome)) {
      if (variante) porNome.set(variante, sigla);
    }
  }
  return porNome;
}

function resolverSigla(porNome, nome) {
  const chave = chaveNome(nome);
  if (!chave) return '';
  if (porNome.has(chave)) return porNome.get(chave);
  let melhor = '';
  for (const candidato of porNome.keys()) {
    if (candidato.length < 5) continue;
    if (
      chave.endsWith(candidato) ||
      chave.includes(candidato) ||
      candidato.includes(chave)
    ) {
      if (candidato.length > melhor.length) melhor = candidato;
    }
  }
  return melhor ? porNome.get(melhor) : '';
}

/* Lê a rodada exibida no HTML da página do campeonato (lista de jogos). */
export function extrairRodadaDaPagina(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const titulo = (doc.querySelector('.titulo-rodada h2')?.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();

  const jogos = [];
  let realizados = 0;
  let primeiraPartida = '';

  for (const jogo of doc.querySelectorAll('.rodada .jogo[data-id]')) {
    const casa = jogo.querySelector('.time.time-1 .nome-time');
    const fora = jogo.querySelector('.time.time-2 .nome-time');
    if (!casa && !fora) continue;
    if (!primeiraPartida) primeiraPartida = jogo.getAttribute('data-id') || '';

    const placar = (jogo.querySelector('.placar')?.textContent || '').trim();
    const m = placar.match(/^(\d+)\s*[-x×]\s*(\d+)$/i);
    if (m) realizados++;

    jogos.push({
      casaNome: (casa?.textContent || '').trim(),
      foraNome: (fora?.textContent || '').trim(),
      casaGols: m ? m[1] : '',
      foraGols: m ? m[2] : '',
    });
  }

  const numero = Number((titulo.match(/(\d+)/) || [])[1]) || 0;
  return { titulo, numero, jogos, realizados, primeiraPartida };
}

/* Lê a resposta de /rodada/anterior/{id} (JSON do SuperPlacar). */
export function extrairRodadaDoJson(json) {
  const partidas = Array.isArray(json?.partidas) ? json.partidas : [];
  const titulo = (json?.rodada || partidas[0]?.rodada || '')
    .replace(/\s+/g, ' ')
    .trim();

  const jogos = [];
  let realizados = 0;

  for (const p of partidas) {
    const comPlacar =
      p?.status === 'encerrado' ||
      p?.status === 'em-andamento' ||
      p?.status === 'suspenso';
    if (comPlacar) realizados++;

    jogos.push({
      casaNome: String(p?.nmMand || '').trim(),
      foraNome: String(p?.nmAdv || '').trim(),
      casaGols: comPlacar ? String(p?.qtdGolsMand ?? '') : '',
      foraGols: comPlacar ? String(p?.qtdGolsAdv ?? '') : '',
    });
  }

  const numero = Number((titulo.match(/(\d+)/) || [])[1]) || 0;
  return {
    titulo,
    numero,
    jogos,
    realizados,
    primeiraPartida: String(partidas[0]?.id || ''),
  };
}

async function buscarRodadaAnterior(id) {
  let ultimoErro = null;
  for (const base of [URL_RODADA, URL_RODADA_DIRETA]) {
    try {
      const resposta = await fetch(`${base}${id}`, {
        headers: { Accept: 'application/json' },
      });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      return await resposta.json();
    } catch (e) {
      ultimoErro = e;
    }
  }
  throw ultimoErro || new Error('Não foi possível acessar a rodada no SuperPlacar');
}

function lerCacheUR() {
  try {
    const bruto = localStorage.getItem(CHAVE_CACHE_UR);
    if (!bruto) return null;
    const cache = JSON.parse(bruto);
    if (!cache?.pacote) return null;
    return cache;
  } catch (e) {
    return null;
  }
}

function gravarCacheUR(pacote) {
  try {
    localStorage.setItem(
      CHAVE_CACHE_UR,
      JSON.stringify({ quando: Date.now(), pacote }),
    );
  } catch (e) {
    console.warn('SuperPlacar: falha ao salvar cache da última rodada.', e);
  }
}

function montarJogos(rodada, porNome) {
  return rodada.jogos
    .map((j) => ({
      casaSigla: resolverSigla(porNome, j.casaNome),
      foraSigla: resolverSigla(porNome, j.foraNome),
      casaGols: j.casaGols,
      foraGols: j.foraGols,
    }))
    .filter((j) => j.casaSigla || j.foraSigla);
}

export async function importarUltimaRodadaSuperPlacar({
  forcar = false,
  rodadaAlvo = 0,
} = {}) {
  const aplicar = (pacote) => ({
    titulo: pacote.titulo,
    jogos: pacote.jogos,
    classificacao: pacote.classificacao,
    quando: pacote.quando,
  });

  const cache = lerCacheUR();
  const idade = cache ? Date.now() - (cache.quando || 0) : Infinity;
  if (!forcar && cache && idade < TTL_CACHE_MS) {
    return { ...aplicar(cache.pacote), origem: 'cache' };
  }

  try {
    const html = await obterHtml();
    const dadosClass = extrairClassificacao(html);
    if (!dadosClass.length) {
      throw new Error('Classificação não encontrada na página do SuperPlacar');
    }

    let rodada = extrairRodadaDaPagina(html);

    /* Rodada exibida costuma ser a próxima (sem placares). Navega para trás
       até encontrar a rodada pedida — ou, sem alvo, a última com jogos. */
    const alvo = Number(rodadaAlvo) || 0;
    let passos = 0;
    while (
      rodada.primeiraPartida &&
      passos < 30 &&
      ((alvo > 0 && rodada.numero > alvo) ||
        (alvo === 0 && rodada.realizados === 0))
    ) {
      const json = await buscarRodadaAnterior(rodada.primeiraPartida);
      const anterior = extrairRodadaDoJson(json);
      if (!anterior.jogos.length) break;
      rodada = anterior;
      passos++;
    }

    const porNome = mapaSiglas();
    const pacote = {
      titulo: rodada.titulo,
      jogos: montarJogos(rodada, porNome),
      classificacao: dadosClass
        .filter((t) => t.pos > 0)
        .sort((a, b) => a.pos - b.pos)
        .map((t) => ({ sigla: resolverSigla(porNome, t.nome), pos: t.pos })),
      quando: Date.now(),
    };
    gravarCacheUR(pacote);
    return { ...aplicar(pacote), origem: 'rede' };
  } catch (erro) {
    if (cache) return { ...aplicar(cache.pacote), origem: 'cache' };
    throw erro;
  }
}

/* ---------- Rodada atual (jogos em tempo real) ---------- */

function lerCacheRA() {
  try {
    const bruto = localStorage.getItem(CHAVE_CACHE_RA);
    if (!bruto) return null;
    const cache = JSON.parse(bruto);
    if (!cache?.pacote) return null;
    return cache;
  } catch (e) {
    return null;
  }
}

function gravarCacheRA(pacote) {
  try {
    localStorage.setItem(
      CHAVE_CACHE_RA,
      JSON.stringify({ quando: Date.now(), pacote }),
    );
  } catch (e) {
    console.warn('SuperPlacar: falha ao salvar cache da rodada atual.', e);
  }
}

/* Não navega para trás: devolve exatamente a rodada exibida no site
   (a rodada corrente), com os placares em tempo real disponíveis. */
export async function importarRodadaAtualSuperPlacar({ forcar = false } = {}) {
  const aplicar = (pacote) => ({
    titulo: pacote.titulo,
    jogos: pacote.jogos,
    quando: pacote.quando,
  });

  const cache = lerCacheRA();
  const idade = cache ? Date.now() - (cache.quando || 0) : Infinity;
  if (!forcar && cache && idade < TTL_CACHE_MS) {
    return { ...aplicar(cache.pacote), origem: 'cache' };
  }

  try {
    const html = await obterHtml();
    const rodada = extrairRodadaDaPagina(html);
    if (!rodada.jogos.length) {
      throw new Error('Rodada atual não encontrada na página do SuperPlacar');
    }

    const porNome = mapaSiglas();
    const pacote = {
      titulo: rodada.titulo,
      jogos: montarJogos(rodada, porNome),
      quando: Date.now(),
    };
    gravarCacheRA(pacote);
    return { ...aplicar(pacote), origem: 'rede' };
  } catch (erro) {
    if (cache) return { ...aplicar(cache.pacote), origem: 'cache' };
    throw erro;
  }
}
import { getEstado, aplicarEstatisticas } from '../store/tabelaStore';
import { resolverCasamentos } from './fgfService';
import { nomeCanonico } from '../lib/nomesClubes.js';

const URL_CLASSIFICACAO = '/superplacar/campeonato/55/gaucho-serie-a2/';
const URL_CLASSIFICACAO_DIRETA =
  'https://superplacar.com.br/campeonato/55/gaucho-serie-a2/';

const CHAVE_CACHE = 'pelotense:tabela:superplacar:v1';
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
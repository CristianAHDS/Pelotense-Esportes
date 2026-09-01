import { definirDadosUOL } from '../store/brasileiraoStore';

const CAMINHO_UOL = '/esporte/futebol/campeonatos/brasileirao/';
const CHAVE_CACHE = 'pelotense:brasileirao:uol:v1';
const TTL_CACHE_MS = 3 * 60 * 1000;
const NOME_COMPETICAO = 'CAMPEONATO BRASILEIRO SÉRIE A 2026';
const MARCADOR_STATE = '<script id="VUELAND_STATE" type="application/json">';

let buscaEmVoo = null;

function hashDe(dados) {
  return dados
    .map((t) => [t.sigla, t.p, t.j, t.v, t.e, t.d, t.gp, t.gc].join(':'))
    .join('|');
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

function gravarCache(dados, rodada, competicao) {
  try {
    localStorage.setItem(
      CHAVE_CACHE,
      JSON.stringify({
        quando: Date.now(),
        hash: hashDe(dados),
        dados,
        rodada,
        competicao,
      }),
    );
  } catch (e) {
    console.warn('Brasileirão: falha ao salvar cache.', e);
  }
}

async function obterHtml() {
  const candidatos = [
    `/uol${CAMINHO_UOL}`,
    `https://www.uol.com.br${CAMINHO_UOL}`,
  ];

  let ultimoErro = null;
  for (const url of candidatos) {
    try {
      const resposta = await fetch(url, {
        headers: {
          Accept: 'text/html',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36',
        },
      });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      return await resposta.text();
    } catch (e) {
      ultimoErro = e;
    }
  }
  throw ultimoErro || new Error('Não foi possível acessar o site da UOL');
}

function extrairClassificacao(html) {
  const idx = html.indexOf(MARCADOR_STATE);
  if (idx < 0) {
    throw new Error('classificação não encontrada na página da UOL');
  }
  const inicio = idx + MARCADOR_STATE.length;
  const fim = html.indexOf('</script>', inicio);
  if (fim < 0) {
    throw new Error('classificação incompleta na página da UOL');
  }

  const estado = JSON.parse(html.slice(inicio, fim));
  const chaveCampeonato = Object.keys(estado).find((chave) =>
    chave.startsWith('football-championship-'),
  );
  const campeonato = estado[chaveCampeonato];
  if (!campeonato?.tableItems?.length) {
    throw new Error('classificação não encontrada na página da UOL');
  }

  const times = campeonato.tableItems
    .slice()
    .sort((a, b) => Number(a.pos || a.position || 0) - Number(b.pos || b.position || 0))
    .map((t) => ({
      nome: String(t.name || '').slice(0, 24) || 'TIME',
      sigla: String(t.acronym || '').toUpperCase().slice(0, 4) || '---',
      p: Math.max(0, Math.floor(Number(t.pts) || 0)),
      j: Math.max(0, Math.floor(Number(t.pl) || 0)),
      v: Math.max(0, Math.floor(Number(t.w) || 0)),
      e: Math.max(0, Math.floor(Number(t.d) || 0)),
      d: Math.max(0, Math.floor(Number(t.l) || 0)),
      gp: Math.max(0, Math.floor(Number(t.gf) || 0)),
      gc: Math.max(0, Math.floor(Number(t.ga) || 0)),
    }));

  return {
    times,
    rodada: Math.max(0, Math.floor(Number(campeonato.currentRound) || 0)),
    competicao: NOME_COMPETICAO,
  };
}

function aplicarDados(dados, rodada, competicao) {
  return definirDadosUOL({ times: dados, rodada, competicao });
}

export async function buscarClassificacaoUOL({ forcar = false } = {}) {
  if (buscaEmVoo) return buscaEmVoo;

  buscaEmVoo = (async () => {
    try {
      const html = await obterHtml();
      const resultado = extrairClassificacao(html);
      if (!resultado.times.length) {
        throw new Error('Classificação não encontrada na página da UOL');
      }
      gravarCache(resultado.times, resultado.rodada, resultado.competicao);
      return resultado;
    } finally {
      buscaEmVoo = null;
    }
  })();

  return buscaEmVoo;
}

export async function importarClassificacaoUOL({ forcar = false } = {}) {
  const cache = lerCache();
  const idade = cache ? Date.now() - (cache.quando || 0) : Infinity;

  if (!forcar && cache && idade < TTL_CACHE_MS) {
    return {
      total: cache.dados.length,
      atualizados: aplicarDados(cache.dados, cache.rodada, cache.competicao),
      quando: cache.quando,
      rodada: cache.rodada,
      competicao: cache.competicao,
      origem: 'cache',
      mudou: false,
    };
  }

  try {
    const resultado = await buscarClassificacaoUOL({ forcar });
    const atualizados = aplicarDados(
      resultado.times,
      resultado.rodada,
      resultado.competicao,
    );
    return {
      total: resultado.times.length,
      atualizados,
      quando: Date.now(),
      rodada: resultado.rodada,
      competicao: resultado.competicao,
      origem: 'rede',
      mudou: !cache || cache.hash !== hashDe(resultado.times),
    };
  } catch (erro) {
    if (cache) {
      return {
        total: cache.dados.length,
        atualizados: aplicarDados(cache.dados, cache.rodada, cache.competicao),
        quando: cache.quando,
        rodada: cache.rodada,
        competicao: cache.competicao,
        origem: 'cache',
        mudou: false,
      };
    }
    throw erro;
  }
}
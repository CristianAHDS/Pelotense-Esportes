import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js';

const STORAGE_KEY = 'pelotense:mata-mata:v1';
const CHANNEL_NAME = 'broadcast:sync-mata-mata-v1';
const MSG_TIPO = 'estado:mata-mata:v1';
const CANAL_NUVEM = 'mata-mata';

function criarLado() {
  return {
    nome: '',
    sigla: '---',
    cor: '#4b5563',
    escudo: null,
    gols: null,
    pen: null,
  };
}

function criarConfronto() {
  return { casa: criarLado(), visitante: criarLado() };
}

const CONFRONTOS_PADRAO = Array.from({ length: 8 }, criarConfronto);

export const CHAVES_FASES = ['confrontos', 'quartas', 'semi', 'final'];

function criarFases() {
  return {
    quartas: Array.from({ length: 4 }, criarConfronto),
    semi: Array.from({ length: 2 }, criarConfronto),
    final: [criarConfronto()],
  };
}

const estadoPadrao = {
  competicao: 'CAMPEONATO GAÚCHO SÉRIE A2',
  fase: 'OITAVAS DE FINAL',
  confrontos: structuredClone(CONFRONTOS_PADRAO),
  ...criarFases(),
};

export function vencedorDe(c) {
  if (!c) return null;
  const gc = c.casa.gols;
  const gv = c.visitante.gols;
  if (gc != null && gv != null && gc !== gv)
    return gc > gv ? 'casa' : 'visitante';
  const pc = c.casa.pen;
  const pv = c.visitante.pen;
  if (pc != null && pv != null && pc !== pv)
    return pc > pv ? 'casa' : 'visitante';
  return null;
}

function ladoVazio(lado) {
  return !lado || (lado.sigla === '---' && !lado.nome);
}

/* Preenche lados vazios das fases seguintes com os vencedores das anteriores */
function enriquecer(estado) {
  const pares = [
    { de: 'confrontos', para: 'quartas', totalDe: 8 },
    { de: 'quartas', para: 'semi', totalDe: 4 },
    { de: 'semi', para: 'final', totalDe: 2 },
  ];
  for (const { de, para, totalDe } of pares) {
    const origem = estado[de];
    const destino = estado[para];
    if (!Array.isArray(origem) || !Array.isArray(destino)) continue;
    for (let i = 0; i < totalDe; i++) {
      const c = origem[i];
      if (!c) continue;
      const venc = vencedorDe(c);
      if (!venc) continue;
      const alvo = destino[Math.floor(i / 2)];
      if (!alvo) continue;
      const ladoDestino = alvo[i % 2 === 0 ? 'casa' : 'visitante'];
      if (!ladoVazio(ladoDestino)) continue;
      const origemLado = c[venc];
      ladoDestino.nome = origemLado.nome;
      ladoDestino.sigla = origemLado.sigla;
      ladoDestino.cor = origemLado.cor;
      ladoDestino.escudo = origemLado.escudo;
    }
  }
  return estado;
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (bruto) {
      const salvo = JSON.parse(bruto);
      if (!Array.isArray(salvo.confrontos))
        salvo.confrontos = structuredClone(estadoPadrao.confrontos);
      const fases = criarFases();
      for (const chave of CHAVES_FASES) {
        if (!Array.isArray(salvo[chave]))
          salvo[chave] = structuredClone(estadoPadrao[chave] ?? fases[chave]);
      }
      return { ...structuredClone(estadoPadrao), ...salvo };
    }
  } catch (e) {
    console.warn('Mata-Mata: falha ao carregar estado.', e);
  }
  return structuredClone(estadoPadrao);
}

let estado = carregar();
const ouvintes = new Set();
let processandoRemoto = false;

const canal =
  typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel(CHANNEL_NAME)
    : null;

function notificar() {
  ouvintes.forEach((ouvinte) => ouvinte(estado));
}

function persistir() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch (e) {
    console.warn('Mata-Mata: falha ao persistir estado.', e);
  }
}

export function getEstado() {
  return estado;
}

function pacoteSincronizacao() {
  return structuredClone(estado);
}

export function setEstado(atualizador, { remoto = false } = {}) {
  if (remoto) {
    processandoRemoto = true;
  }

  estado =
    typeof atualizador === 'function'
      ? atualizador(structuredClone(estado))
      : atualizador;
  enriquecer(estado);
  persistir();
  notificar();

  if (!remoto) {
    const pacote = pacoteSincronizacao();
    canal?.postMessage({ tipo: MSG_TIPO, estado: pacote });
    publicarNuvem(CANAL_NUVEM, pacote);
    registrarSync(pacote);
  }

  processandoRemoto = false;
}

const ultimosSync = [];
const LIMITE_SYNC = 16;

function registrarSync(valor) {
  const texto = JSON.stringify(valor);
  ultimosSync.push(texto);
  while (ultimosSync.length > LIMITE_SYNC) ultimosSync.shift();
}

function aplicarEstadoRemoto(novoEstado) {
  const serializado = JSON.stringify(novoEstado);
  if (serializado === JSON.stringify(estado)) return;
  registrarSync(novoEstado);

  if (!processandoRemoto) {
    setEstado(novoEstado, { remoto: true });
  }
}

/* ---------- SincronizaÃ§Ã£o na nuvem ---------- */

inscreverNuvem(CANAL_NUVEM, aplicarEstadoRemoto);

/* ---------- BroadcastChannel ---------- */

if (canal) {
  canal.onmessage = (evento) => {
    if (evento.data?.tipo === MSG_TIPO) {
      aplicarEstadoRemoto(evento.data.estado);
    }
  };
}

/* ---------- localStorage ---------- */

window.addEventListener('storage', (evento) => {
  if (evento.key === STORAGE_KEY && evento.newValue) {
    try {
      aplicarEstadoRemoto(JSON.parse(evento.newValue));
    } catch (e) {
      console.warn('Mata-Mata: falha ao sincronizar via storage.', e);
    }
  }
});

/* ---------- Assinatura ---------- */

export function inscrever(ouvinte) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/* ---------- AÃ§Ãµes ---------- */

export function definirCompeticao(texto) {
  setEstado((estado) => {
    estado.competicao = String(texto).slice(0, 60).toUpperCase();
    return estado;
  });
}

export function definirFase(texto) {
  setEstado((estado) => {
    estado.fase = String(texto).slice(0, 40).toUpperCase();
    return estado;
  });
}

export function atualizarLado(chaveFase, indice, ladoNome, campo, valor) {
  setEstado((estado) => {
    const lista = estado[chaveFase] || estado.confrontos;
    const confronto = lista[indice];
    const lado = confronto?.[ladoNome];
    if (!lado) return estado;
    if (campo === 'nome') {
      lado.nome = String(valor).slice(0, 24);
    } else if (campo === 'sigla') {
      lado.sigla = String(valor).slice(0, 4).toUpperCase() || '---';
    } else if (campo === 'cor') {
      lado.cor = valor;
    } else if (campo === 'escudo') {
      lado.escudo = valor || null;
    } else if (campo === 'gols' || campo === 'pen') {
      lado[campo] =
        valor === '' || valor == null
          ? null
          : Math.max(0, Math.floor(Number(valor) || 0));
    }
    return estado;
  });
}

/* Os dois lados do slot são exatamente os mesmos que chegaram do
   exterior? (sigla vazia normalizada para '---') */
function mesmosLados(confronto, par) {
  return (
    confronto.casa.sigla === (par?.casa?.sigla ?? '---') &&
    confronto.visitante.sigla === (par?.visitante?.sigla ?? '---')
  );
}

/* Preenche uma fase a partir de pares prontos
   [{ casa:{nome,sigla,cor,escudo,gols}, visitante:{...} }].
   Confrontos sem par correspondente são zerados, evitando sobras de
   preenchimentos anteriores, e as fases seguintes também são zeradas
   porque dependem dos vencedores desta.
   Com `preservarPlacar`, o placar já digitado no controle é mantido
   enquanto o exterior ainda não tiver resultado. */
export function preencherConfrontos(chaveFase, pares, opcoes = {}) {
  const preservarPlacar = !!opcoes.preservarPlacar;

  setEstado((estado) => {
    const lista = estado[chaveFase] || estado.confrontos;
    lista.forEach((confronto, i) => {
      const par = pares?.[i] || null;
      const manterPlacar = preservarPlacar && mesmosLados(confronto, par);

      for (const ladoNome of ['casa', 'visitante']) {
        const destino = confronto[ladoNome];
        const origem = par?.[ladoNome];
        if (!origem) {
          destino.nome = '';
          destino.sigla = '---';
          destino.cor = '#4b5563';
          destino.escudo = null;
        } else {
          destino.nome = origem.nome;
          destino.sigla = origem.sigla;
          destino.cor = origem.cor;
          destino.escudo = origem.escudo || `/escudos/${origem.sigla}.png`;
        }

        if (manterPlacar && origem && origem.gols == null) continue;

        destino.gols =
          par && origem?.gols != null
            ? Math.max(0, Math.floor(Number(origem.gols) || 0))
            : null;
        destino.pen =
          par && origem?.pen != null
            ? Math.max(0, Math.floor(Number(origem.pen) || 0))
            : null;
      }
    });

    const proximas = CHAVES_FASES.slice(CHAVES_FASES.indexOf(chaveFase) + 1);
    for (const chave of proximas) {
      if (Array.isArray(estado[chave])) {
        estado[chave] = Array.from(
          { length: estado[chave].length },
          criarConfronto,
        );
      }
    }

    return estado;
  });
}

/* Fases por quantidade de confrontos: 8 -> OITAVAS, 4 -> QUARTAS,
   2 -> SEMI, 1 -> FINAL. */
const FASE_POR_QUANTIDADE = {
  8: 'confrontos',
  4: 'quartas',
  2: 'semi',
  1: 'final',
};

/* Preenche a fase correspondente à quantidade de confrontos recebidos
   (ex.: dados do SuperPlacar) e devolve a chave da fase usada. */
export function preencherDoSuperPlacar(
  { fase = '', confrontos = [] } = {},
  opcoes,
) {
  const chaveFase = FASE_POR_QUANTIDADE[confrontos.length] || 'quartas';
  if (fase) definirFase(fase);
  preencherConfrontos(chaveFase, confrontos, opcoes);
  return chaveFase;
}

/* Sincronização automática (usada pelos overlays a cada 30s): só escreve
   quando o chaveamento mudou de times ou quando o exterior traz um
   resultado para um confronto que ainda está sem placar. Assim o placar
   digitado no controle não é apagado a cada rodada de atualização. */
export function sincronizarDoSuperPlacar({ fase = '', confrontos = [] } = {}) {
  const chaveFase = FASE_POR_QUANTIDADE[confrontos.length];
  if (!chaveFase) return null;

  const lista = getEstado()[chaveFase] || [];
  const mesmoChaveamento =
    confrontos.length === lista.length &&
    lista.every((c, i) => mesmosLados(c, confrontos[i]));

  if (mesmoChaveamento) {
    const resultadoNovo = confrontos.some((par, i) =>
      ['casa', 'visitante'].some(
        (lado) => par?.[lado]?.gols != null && lista[i]?.[lado]?.gols == null,
      ),
    );
    if (!resultadoNovo) return { chaveFase, aplicado: false };
  }

  const chaveUsada = preencherDoSuperPlacar(
    { fase, confrontos },
    { preservarPlacar: mesmoChaveamento },
  );
  return { chaveFase: chaveUsada, aplicado: true };
}

export function limparPlacares() {
  setEstado((estado) => {
    for (const chave of CHAVES_FASES) {
      (estado[chave] || []).forEach((c) => {
        c.casa.gols = null;
        c.casa.pen = null;
        c.visitante.gols = null;
        c.visitante.pen = null;
      });
    }
    return estado;
  });
}

export function limparFase(chaveFase) {
  setEstado((estado) => {
    const lista = estado[chaveFase];
    if (!Array.isArray(lista)) return estado;
    estado[chaveFase] = Array.from({ length: lista.length }, criarConfronto);
    return estado;
  });
}

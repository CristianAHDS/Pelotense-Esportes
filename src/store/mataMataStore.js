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
  if (
    ultimosSync.includes(serializado) ||
    serializado === JSON.stringify(estado)
  )
    return;
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

/* Preenche os confrontos a partir de pares prontos
   [{ casa:{nome,sigla,cor,escudo}, visitante:{...} }] */
export function preencherConfrontos(pares) {
  setEstado((estado) => {
    pares.forEach((par, i) => {
      if (!estado.confrontos[i]) return;
      for (const ladoNome of ['casa', 'visitante']) {
        const origem = par[ladoNome];
        const destino = estado.confrontos[i][ladoNome];
        destino.nome = origem.nome;
        destino.sigla = origem.sigla;
        destino.cor = origem.cor;
        destino.escudo = origem.escudo || `/escudos/${origem.sigla}.png`;
        destino.gols = null;
        destino.pen = null;
      }
    });
    return estado;
  });
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

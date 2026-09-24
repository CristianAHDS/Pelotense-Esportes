import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js';
import { aplicarNomesCanonicos } from '../lib/nomesClubes.js';

const STORAGE_KEY = 'pelotense:tabela:v4';
const CHANNEL_NAME = 'broadcast:sync-tabela-v4';
const MSG_TIPO = 'estado:tabela:v4';
const CANAL_NUVEM = 'tabela';

function criarTime(nome, sigla, cor, dados = {}) {
  return {
    nome,
    sigla,
    cor,
    escudo: null,
    p: 0,
    j: 0,
    v: 0,
    e: 0,
    d: 0,
    gp: 0,
    gc: 0,
    ...dados,
  };
}

/* Campeonato Gaúcho Série A2 (Divisão de Acesso) 2026 */
const E = '/escudos';
const TIMES_PADRAO = [
  criarTime('Passo Fundo', 'PAS', '#c1121f', {
    escudo: `${E}/PAS.png`,
    p: 29,
    j: 14,
    v: 8,
    e: 5,
    d: 1,
    gp: 21,
    gc: 9,
  }),
  criarTime('Veranópolis', 'VER', '#047857', {
    escudo: `${E}/VER.png`,
    p: 25,
    j: 14,
    v: 7,
    e: 4,
    d: 3,
    gp: 12,
    gc: 6,
  }),
  criarTime('União Frederiquense', 'UFR', '#2563eb', {
    escudo: `${E}/UFR.png`,
    p: 24,
    j: 14,
    v: 6,
    e: 6,
    d: 2,
    gp: 16,
    gc: 9,
  }),
  criarTime('Esportivo', 'ESP', '#7c3aed', {
    escudo: 'https://i.imgur.com/u5q7j4R.png',
    p: 24,
    j: 14,
    v: 6,
    e: 6,
    d: 2,
    gp: 17,
    gc: 11,
  }),
  criarTime('Brasil - FAR', 'BFR', '#ea580c', {
    escudo: `${E}/BFR.png`,
    p: 23,
    j: 14,
    v: 5,
    e: 8,
    d: 1,
    gp: 15,
    gc: 9,
  }),
  criarTime('Santa Cruz', 'SCR', '#eab308', {
    escudo: `${E}/SCR.png`,
    p: 22,
    j: 14,
    v: 5,
    e: 7,
    d: 2,
    gp: 14,
    gc: 10,
  }),
  criarTime('Brasil', 'BRA', '#b91c1c', {
    escudo: `${E}/BRA.png`,
    p: 21,
    j: 13,
    v: 5,
    e: 6,
    d: 2,
    gp: 14,
    gc: 8,
  }),
  criarTime('Apafut', 'APA', '#0d9488', {
    escudo: `${E}/APA.png`,
    p: 21,
    j: 14,
    v: 5,
    e: 6,
    d: 3,
    gp: 18,
    gc: 13,
  }),
  criarTime('Aimoré', 'AIM', '#111827', {
    escudo: `${E}/AIM.png`,
    p: 20,
    j: 14,
    v: 5,
    e: 5,
    d: 4,
    gp: 13,
    gc: 13,
  }),
  criarTime('Pelotas', 'PEL', '#1565c0', {
    escudo: `${E}/PEL.png`,
    p: 15,
    j: 13,
    v: 3,
    e: 6,
    d: 4,
    gp: 13,
    gc: 16,
  }),
  criarTime('Guarani - VA', 'GUA', '#166534', {
    escudo: `${E}/GUA.png`,
    p: 15,
    j: 14,
    v: 3,
    e: 6,
    d: 5,
    gp: 15,
    gc: 20,
  }),
  criarTime('Gaúcho', 'GAU', '#171717', {
    escudo: `${E}/GAU.png`,
    p: 12,
    j: 14,
    v: 3,
    e: 3,
    d: 8,
    gp: 11,
    gc: 15,
  }),
  criarTime('Bagé', 'BAG', '#334155', {
    escudo: `${E}/BAG.png`,
    p: 12,
    j: 14,
    v: 2,
    e: 6,
    d: 6,
    gp: 9,
    gc: 18,
  }),
  criarTime('Glória', 'GLO', '#991b1b', {
    escudo: `${E}/GLO.png`,
    p: 11,
    j: 14,
    v: 2,
    e: 5,
    d: 7,
    gp: 11,
    gc: 17,
  }),
  criarTime('Gramadense', 'GRA', '#15803d', {
    escudo: `${E}/GRA.png`,
    p: 10,
    j: 14,
    v: 1,
    e: 7,
    d: 6,
    gp: 9,
    gc: 18,
  }),
  criarTime('Lajeadense', 'LAJ', '#1d4ed8', {
    escudo: `${E}/LAJ.png`,
    p: 5,
    j: 14,
    v: 1,
    e: 2,
    d: 11,
    gp: 5,
    gc: 21,
  }),
];

const estadoPadrao = {
  competicao: 'CAMPEONATO GAÚCHO SÉRIE A2',
  rodada: 13,
  times: structuredClone(TIMES_PADRAO),
};

/* Garante que times conhecidos usem o escudo/cor padrão e a sigla atual,
   mesmo quando o estado chega de outra aba/dispositivo com dados antigos */
const RENOME_SIGLAS = { GVA: 'GUA' };

function completarVisuais(times) {
  if (!Array.isArray(times)) return times;
  return times.map((t) => {
    if (!t?.sigla) return t;
    const sigla = RENOME_SIGLAS[t.sigla] || t.sigla;
    const comSigla = sigla === t.sigla ? t : { ...t, sigla };
    const padrao = TIMES_PADRAO.find(
      (p) => p.sigla === comSigla.sigla && p.escudo,
    );
    return padrao
      ? { ...comSigla, escudo: padrao.escudo, cor: comSigla.cor || padrao.cor }
      : comSigla;
  });
}

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (bruto) {
      const salvo = JSON.parse(bruto);
      if (!Array.isArray(salvo.times))
        salvo.times = structuredClone(estadoPadrao.times);
      else salvo.times = aplicarNomesCanonicos(completarVisuais(salvo.times));
      return { ...structuredClone(estadoPadrao), ...salvo };
    }
  } catch (e) {
    console.warn('Tabela: falha ao carregar estado.', e);
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
    console.warn('Tabela: falha ao persistir estado.', e);
  }
}

export function getEstado() {
  return estado;
}

/* Relê o estado salvo no localStorage e notifica os ouvintes */
export function recarregar() {
  const novo = carregar();
  if (JSON.stringify(novo) === JSON.stringify(estado)) return;
  estado = novo;
  persistir();
  notificar();
}

export function ordenarClassificacao(times) {
  return times
    .map((t, i) => ({ ...t, _i: i }))
    .sort(
      (a, b) =>
        b.p - a.p ||
        b.v - a.v ||
        b.gp - b.gc - (a.gp - a.gc) ||
        b.gp - a.gp ||
        a._i - b._i,
    );
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
  estado.times = aplicarNomesCanonicos(completarVisuais(estado.times));
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

/* ---------- Sincronização na nuvem ---------- */

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
      console.warn('Tabela: falha ao sincronizar via storage.', e);
    }
  }
});

/* ---------- Assinatura ---------- */

export function inscrever(ouvinte) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/* ---------- Ações ---------- */

export function definirCompeticao(texto) {
  setEstado((estado) => {
    estado.competicao = String(texto).slice(0, 60).toUpperCase();
    return estado;
  });
}

export function definirRodada(valor) {
  setEstado((estado) => {
    estado.rodada = Math.max(0, Math.floor(Number(valor) || 0));
    return estado;
  });
}

export function adicionarTime() {
  setEstado((estado) => {
    if (estado.times.length >= 24) return estado;
    const n = estado.times.length + 1;
    estado.times.push(criarTime(`TIME ${n}`, `T${n}`, '#4b5563'));
    return estado;
  });
}

export function removerTime(indice) {
  setEstado((estado) => {
    if (estado.times.length <= 2) return estado;
    estado.times.splice(indice, 1);
    return estado;
  });
}

export function atualizarTime(indice, campo, valor) {
  setEstado((estado) => {
    const t = estado.times[indice];
    if (!t) return estado;
    if (campo === 'nome') {
      t.nome = String(valor).slice(0, 24) || 'TIME';
    } else if (campo === 'sigla') {
      t.sigla = String(valor).slice(0, 4).toUpperCase() || '---';
    } else if (campo === 'cor') {
      t.cor = valor;
    } else {
      t[campo] = Math.max(0, Math.floor(Number(valor) || 0));
    }
    return estado;
  });
}

export function zerarEstatisticas() {
  setEstado((estado) => {
    estado.times = estado.times.map((t) => ({
      ...t,
      p: 0,
      j: 0,
      v: 0,
      e: 0,
      d: 0,
      gp: 0,
      gc: 0,
    }));
    return estado;
  });
}

export function restaurarPadrao() {
  setEstado(() => structuredClone(estadoPadrao));
}

/* Aplica estatísticas externas (ex.: FGF) em [{ indice, stats }].
   Só altera (e notifica) os campos que de fato mudaram. */
export function aplicarEstatisticas(pares) {
  if (!Array.isArray(pares)) return 0;

  const campos = ['p', 'j', 'v', 'e', 'd', 'gp', 'gc'];
  const mudancas = [];

  for (const { indice, stats } of pares) {
    const t = Number.isInteger(indice) ? estado.times[indice] : null;
    if (!t || !stats || typeof stats !== 'object') continue;

    const valores = {};
    for (const campo of campos) {
      const valor = Number(stats[campo]);
      if (!Number.isFinite(valor)) continue;
      const normalizado = Math.max(0, Math.floor(valor));
      if (t[campo] !== normalizado) valores[campo] = normalizado;
    }
    if (Object.keys(valores).length) mudancas.push({ indice, valores });
  }

  if (!mudancas.length) return 0;

  setEstado((atual) => {
    for (const { indice, valores } of mudancas) {
      Object.assign(atual.times[indice], valores);
    }
    return atual;
  });

  return mudancas.length;
}

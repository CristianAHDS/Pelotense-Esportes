import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js';

const STORAGE_KEY = 'pelotense:brasileirao:v1';
const CHANNEL_NAME = 'broadcast:sync-brasileirao-v1';
const MSG_TIPO = 'estado:brasileirao:v1';
const CANAL_NUVEM = 'brasileirao';

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

const E = (cod) => `https://conteudo.cbf.com.br/clubes/${cod}/escudo.jpg`;
const TIMES_PADRAO = [
  criarTime('Palmeiras', 'PAL', '#006437', { escudo: E(20002), p: 52, j: 25, v: 15, e: 7, d: 3, gp: 45, gc: 21 }),
  criarTime('Flamengo', 'FLA', '#c21a1a', { escudo: E(20016), p: 48, j: 24, v: 14, e: 6, d: 4, gp: 48, gc: 21 }),
  criarTime('Athletico-PR', 'CAP', '#d90a2b', { escudo: E(20052), p: 45, j: 25, v: 13, e: 6, d: 6, gp: 37, gc: 25 }),
  criarTime('Fluminense', 'FLU', '#841b3f', { escudo: E(20014), p: 42, j: 25, v: 11, e: 9, d: 5, gp: 39, gc: 32 }),
  criarTime('Bahia', 'BAH', '#1b4587', { escudo: E(61377), p: 40, j: 25, v: 10, e: 10, d: 5, gp: 37, gc: 30 }),
  criarTime('Cruzeiro', 'CRU', '#1e5aa8', { escudo: E(59849), p: 39, j: 25, v: 11, e: 6, d: 8, gp: 35, gc: 36 }),
  criarTime('Coritiba', 'CFC', '#007143', { escudo: E(61590), p: 37, j: 25, v: 10, e: 7, d: 8, gp: 33, gc: 33 }),
  criarTime('Atlético-MG', 'CAM', '#272727', { escudo: E(62194), p: 36, j: 24, v: 10, e: 6, d: 8, gp: 32, gc: 28 }),
  criarTime('Bragantino', 'RBB', '#b0211b', { escudo: E(20007), p: 35, j: 24, v: 10, e: 5, d: 9, gp: 29, gc: 25 }),
  criarTime('Corinthians', 'COR', '#262626', { escudo: E(20001), p: 32, j: 25, v: 8, e: 8, d: 9, gp: 26, gc: 25 }),
  criarTime('São Paulo', 'SAO', '#d22e2e', { escudo: E(20005), p: 30, j: 24, v: 8, e: 6, d: 10, gp: 29, gc: 28 }),
  criarTime('Botafogo', 'BOT', '#1f1f1f', { escudo: E(60175), p: 30, j: 24, v: 8, e: 6, d: 10, gp: 37, gc: 40 }),
  criarTime('Vitória', 'VIT', '#c4161c', { escudo: E(20018), p: 29, j: 25, v: 8, e: 5, d: 12, gp: 24, gc: 37 }),
  criarTime('Santos', 'SAN', '#9e9e9e', { escudo: E(20008), p: 29, j: 24, v: 7, e: 8, d: 9, gp: 34, gc: 36 }),
  criarTime('Grêmio', 'GRE', '#0d6ea8', { escudo: E(20013), p: 28, j: 24, v: 7, e: 7, d: 10, gp: 27, gc: 32 }),
  criarTime('Mirassol', 'MIR', '#1a7f37', { escudo: E(20385), p: 25, j: 24, v: 6, e: 7, d: 11, gp: 27, gc: 37 }),
  criarTime('Vasco', 'VAS', '#161616', { escudo: E(60646), p: 25, j: 24, v: 6, e: 7, d: 11, gp: 27, gc: 39 }),
  criarTime('Internacional', 'INT', '#d00027', { escudo: E(20011), p: 25, j: 25, v: 5, e: 10, d: 10, gp: 26, gc: 31 }),
  criarTime('Remo', 'REM', '#1e3a8a', { escudo: E(20022), p: 23, j: 25, v: 5, e: 8, d: 12, gp: 30, gc: 42 }),
  criarTime('Chapecoense', 'CHA', '#1a7a33', { escudo: E(20086), p: 14, j: 24, v: 2, e: 8, d: 14, gp: 25, gc: 49 }),
];

const estadoPadrao = {
  competicao: 'CAMPEONATO BRASILEIRO SÉRIE A 2026',
  rodada: 25,
  times: structuredClone(TIMES_PADRAO),
};

const padraoPorSigla = {};
for (const t of TIMES_PADRAO) padraoPorSigla[t.sigla] = t;

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (bruto) {
      const salvo = JSON.parse(bruto);
      if (!Array.isArray(salvo.times)) {
        salvo.times = structuredClone(estadoPadrao.times);
      } else {
        salvo.times = salvo.times.map((t) => {
          const base = padraoPorSigla[t.sigla];
          if (base && !t.escudo) {
            return { ...structuredClone(base), ...t, escudo: base.escudo };
          }
          return t;
        });
      }
      return { ...structuredClone(estadoPadrao), ...salvo };
    }
  } catch (e) {
    console.warn('Brasileirão: falha ao carregar estado.', e);
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
    console.warn('Brasileirão: falha ao persistir estado.', e);
  }
}

export function getEstado() {
  return estado;
}

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

inscreverNuvem(CANAL_NUVEM, aplicarEstadoRemoto);

if (canal) {
  canal.onmessage = (evento) => {
    if (evento.data?.tipo === MSG_TIPO) {
      aplicarEstadoRemoto(evento.data.estado);
    }
  };
}

window.addEventListener('storage', (evento) => {
  if (evento.key === STORAGE_KEY && evento.newValue) {
    try {
      aplicarEstadoRemoto(JSON.parse(evento.newValue));
    } catch (e) {
      console.warn('Brasileirão: falha ao sincronizar via storage.', e);
    }
  }
});

export function inscrever(ouvinte) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

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

export function definirDadosUOL({ times, rodada, competicao }) {
  if (!Array.isArray(times) || !times.length) return 0;
  setEstado((atual) => {
    atual.competicao = String(competicao || atual.competicao)
      .slice(0, 60)
      .toUpperCase();
    atual.rodada = Math.max(0, Math.floor(Number(rodada) || 0));
    const cores = {};
    const escudos = {};
    for (const t of atual.times) {
      if (t.sigla) cores[t.sigla] = t.cor;
      if (t.sigla && t.escudo) escudos[t.sigla] = t.escudo;
    }
    atual.times = times.map((t) => {
      const sigla = String(t.sigla || '').toUpperCase().slice(0, 4) || '---';
      const base = padraoPorSigla[sigla];
      return {
        nome: String(t.nome || '').slice(0, 24) || 'TIME',
        sigla,
        cor: cores[sigla] || base?.cor || t.cor || '#4b5563',
        escudo: escudos[sigla] || base?.escudo || t.escudo || null,
        p: Math.max(0, Math.floor(Number(t.p) || 0)),
        j: Math.max(0, Math.floor(Number(t.j) || 0)),
        v: Math.max(0, Math.floor(Number(t.v) || 0)),
        e: Math.max(0, Math.floor(Number(t.e) || 0)),
        d: Math.max(0, Math.floor(Number(t.d) || 0)),
        gp: Math.max(0, Math.floor(Number(t.gp) || 0)),
        gc: Math.max(0, Math.floor(Number(t.gc) || 0)),
      };
    });
    return atual;
  });
  return times.length;
}

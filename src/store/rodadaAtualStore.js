import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js';

const STORAGE_KEY = 'pelotense:rodada-atual:v1';
const CHANNEL_NAME = 'broadcast:sync-rodada-atual-v1';
const MSG_TIPO = 'estado:rodada-atual:v1';
const CANAL_NUVEM = 'rodada-atual';

const RENOME_SIGLAS = { GVA: 'GUA', '*': 'BRA' };

function normalizarSigla(sigla) {
  const s = String(sigla || '').toUpperCase();
  return RENOME_SIGLAS[s] || s;
}

function normalizarEstado(estadoAtual) {
  for (const rodada of estadoAtual.rodadas || []) {
    for (const jogo of rodada.jogos || []) {
      jogo.casaSigla = normalizarSigla(jogo.casaSigla);
      jogo.foraSigla = normalizarSigla(jogo.foraSigla);
      jogo.casaGols = String(jogo.casaGols ?? '').replace(/[^0-9]/g, '').slice(0, 2);
      jogo.foraGols = String(jogo.foraGols ?? '').replace(/[^0-9]/g, '').slice(0, 2);
    }
  }
  return estadoAtual;
}

function rodadaPadrao() {
  return {
    titulo: '',
    jogos: [{ casaSigla: '', casaGols: '', foraGols: '', foraSigla: '' }],
  };
}

const estadoPadrao = {
  visivel: true,
  titulo: 'Rodada Atual',
  rodadas: [rodadaPadrao()],
};

function carregar() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (bruto) {
      const salvo = JSON.parse(bruto);
      const estado = { ...structuredClone(estadoPadrao), ...salvo };
      estado.rodadas = Array.isArray(salvo.rodadas)
        ? salvo.rodadas
        : [rodadaPadrao()];
      return normalizarEstado(estado);
    }
  } catch (e) {
    console.warn('Rodada Atual: falha ao carregar estado.', e);
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
    console.warn('Rodada Atual: falha ao persistir estado.', e);
  }
}

function getEstado() {
  return estado;
}

function setEstado(atualizador, { remoto = false } = {}) {
  if (remoto) {
    processandoRemoto = true;
  }

  estado =
    typeof atualizador === 'function'
      ? atualizador(structuredClone(estado))
      : atualizador;
  normalizarEstado(estado);
  persistir();
  notificar();

  if (!remoto) {
    const pacote = structuredClone(estado);
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
      console.warn('Rodada Atual: falha ao sincronizar via storage.', e);
    }
  }
});

/* ---------- Assinatura ---------- */

function inscrever(ouvinte) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/* ---------- Ações ---------- */

function atualizarCampo(campo, valor) {
  setEstado((estadoAtual) => {
    switch (campo) {
      case 'titulo':
        estadoAtual.titulo = String(valor).slice(0, 32).toUpperCase();
        break;
      default:
        estadoAtual[campo] = valor;
    }
    return estadoAtual;
  });
}

function atualizarRodada(indice, campo, valor) {
  setEstado((estadoAtual) => {
    const rodada = estadoAtual.rodadas[indice];
    if (!rodada) return estadoAtual;
    if (campo === 'titulo') {
      rodada.titulo = String(valor).slice(0, 24).toUpperCase();
    }
    return estadoAtual;
  });
}

function atualizarJogo(indiceRodada, indiceJogo, campo, valor) {
  setEstado((estadoAtual) => {
    const jogo = estadoAtual.rodadas[indiceRodada]?.jogos[indiceJogo];
    if (!jogo) return estadoAtual;
    if (campo === 'casaGols' || campo === 'foraGols') {
      jogo[campo] = String(valor).replace(/[^0-9]/g, '').slice(0, 2);
    } else {
      jogo[campo] = normalizarSigla(valor).slice(0, 4);
    }
    return estadoAtual;
  });
}

/* Preenche a rodada atual com os dados do SuperPlacar */
function preencherDaRodada({ titulo, jogos }) {
  if (!Array.isArray(jogos) || !jogos.length) return;

  const novaRodada = {
    titulo: String(titulo || '').slice(0, 24).toUpperCase(),
    jogos: jogos.map((j) => ({
      casaSigla: normalizarSigla(j.casaSigla).slice(0, 4),
      casaGols: String(j.casaGols ?? '').replace(/[^0-9]/g, '').slice(0, 2),
      foraGols: String(j.foraGols ?? '').replace(/[^0-9]/g, '').slice(0, 2),
      foraSigla: normalizarSigla(j.foraSigla).slice(0, 4),
    })),
  };

  if (JSON.stringify(estado.rodadas) === JSON.stringify([novaRodada])) return;

  setEstado((estadoAtual) => {
    estadoAtual.rodadas = [novaRodada];
    return estadoAtual;
  });
}

function adicionarRodada() {
  setEstado((estadoAtual) => {
    const proximo =
      estadoAtual.rodadas.reduce((maior, r) => {
        const n = Number((r.titulo.match(/(\d+)/) || [])[1]) || 0;
        return Math.max(maior, n);
      }, 0) + 1;
    estadoAtual.rodadas.push({
      titulo: `RODADA ${proximo}`,
      jogos: [{ casaSigla: '', casaGols: '', foraGols: '', foraSigla: '' }],
    });
    return estadoAtual;
  });
}

function removerRodada(indice) {
  setEstado((estadoAtual) => {
    if (estadoAtual.rodadas.length <= 1) return estadoAtual;
    estadoAtual.rodadas.splice(indice, 1);
    return estadoAtual;
  });
}

function adicionarJogo(indiceRodada) {
  setEstado((estadoAtual) => {
    estadoAtual.rodadas[indiceRodada]?.jogos.push({
      casaSigla: '',
      casaGols: '',
      foraGols: '',
      foraSigla: '',
    });
    return estadoAtual;
  });
}

function removerJogo(indiceRodada, indiceJogo) {
  setEstado((estadoAtual) => {
    const jogos = estadoAtual.rodadas[indiceRodada]?.jogos;
    if (!jogos || jogos.length <= 1) return estadoAtual;
    jogos.splice(indiceJogo, 1);
    return estadoAtual;
  });
}

function mostrar() {
  setEstado((estadoAtual) => {
    estadoAtual.visivel = true;
    return estadoAtual;
  });
}

function ocultar() {
  setEstado((estadoAtual) => {
    estadoAtual.visivel = false;
    return estadoAtual;
  });
}

export const rodadaAtual = {
  getEstado,
  inscrever,
  atualizarCampo,
  atualizarRodada,
  atualizarJogo,
  preencherDaRodada,
  adicionarRodada,
  removerRodada,
  adicionarJogo,
  removerJogo,
  mostrar,
  ocultar,
};

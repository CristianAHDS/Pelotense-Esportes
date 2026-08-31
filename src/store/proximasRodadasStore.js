import { inscreverNuvem, publicarNuvem } from '../lib/sincronizacaoNuvem.js';

const STORAGE_KEY = 'pelotense:proximas-rodadas:v1';
const CHANNEL_NAME = 'broadcast:sync-proximas-rodadas-v1';
const MSG_TIPO = 'estado:proximas-rodadas:v1';
const CANAL_NUVEM = 'proximas-rodadas';

function normalizarEstado(estadoAtual) {
  return estadoAtual;
}

function rodadaPadrao() {
  return { titulo: '', jogos: [{ casaSigla: '', foraSigla: '' }] };
}

const estadoPadrao = {
  visivel: true,
  titulo: 'Próxima Rodada',
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
    console.warn('Próxima Rodada: falha ao carregar estado.', e);
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
    console.warn('Próxima Rodada: falha ao persistir estado.', e);
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
      console.warn('Próxima Rodada: falha ao sincronizar via storage.', e);
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
    jogo[campo] = String(valor).slice(0, 4).toUpperCase();
    return estadoAtual;
  });
}

/* Preenche de uma vez com os dados da FGF */
function preencherDaFGF({ titulo, rodadas }) {
  setEstado((estadoAtual) => {
    if (titulo) estadoAtual.titulo = String(titulo).slice(0, 32).toUpperCase();

    if (Array.isArray(rodadas) && rodadas.length) {
      estadoAtual.rodadas = rodadas.map((r) => ({
        titulo: String(r.titulo || '')
          .slice(0, 24)
          .toUpperCase(),
        jogos: (r.jogos || []).map((j) => ({
          casaSigla: String(j.casaSigla || '')
            .slice(0, 4)
            .toUpperCase(),
          foraSigla: String(j.foraSigla || '')
            .slice(0, 4)
            .toUpperCase(),
        })),
      }));
    }

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
      jogos: [{ casaSigla: '', foraSigla: '' }],
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

export const proximasRodadas = {
  getEstado,
  inscrever,
  atualizarCampo,
  atualizarRodada,
  atualizarJogo,
  preencherDaFGF,
  adicionarRodada,
  removerRodada,
  adicionarJogo,
  removerJogo,
  mostrar,
  ocultar,
};

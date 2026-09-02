import { describe, it, expect, vi, beforeEach } from 'vitest';

/* Teste p2p REAL: cria DUAS instâncias independentes da store (duas "abas"),
   importadas de novo a cada vez, compartilhando o MESMO canal BroadcastChannel.
   A transmissão é feita pela própria store (ação local), não por mensagem
   injetada — valida a convergência peer-to-peer de ponta a ponta, inclusive
   propagação reversa e last-write-wins. */

const ESTILO_SET = [
  'brasileiraoStore.js',
  'mataMataStore.js',
  'penaltisStore.js',
  'placarBroadcastBLStore.js',
  'placarBroadcastEscalacaoStore.js',
  'placarBroadcastLLStore.js',
  'placarBroadcastPLStore.js',
  'placarBroadcastStore.js',
  'placarModelStore.js',
  'placarNormalStore.js',
  'placarProStore.js',
  'placarStore.js',
  'preJogoStore.js',
  'tabelaStore.js',
].map((arquivo) => ({
  arquivo,
  estilo: 'set',
  norm: (v) => v,
  semear: (a, v) => a.setEstado({ ...a.getEstado(), __marca: v, atualizadoEm: Date.now() }),
  ler: (a) => a.getEstado().__marca,
}));

const ESTILO_ACAO = [
  { arquivo: 'ultimaRodadaStore.js', chave: 'ultimaRodada', campo: 'titulo' },
  { arquivo: 'artilheirosStore.js', chave: 'artilheiros', campo: 'titulo' },
  {
    arquivo: 'proximasRodadasStore.js',
    chave: 'proximasRodadas',
    campo: 'titulo',
  },
  { arquivo: 'escalacaoStore.js', chave: 'escalacao', campo: 'nomeCasa' },
  { arquivo: 'substituicaoStore.js', chave: 'substituicao', campo: 'nomeTime' },
].map(({ arquivo, chave, campo }) => ({
  arquivo,
  estilo: 'acao',
  norm: (v) => v.toUpperCase(),
  semear: (a, v) => a.atualizarCampo(campo, v),
  ler: (a) => a.getEstado()[campo],
}));

const CASOS = [...ESTILO_SET, ...ESTILO_ACAO];

beforeEach(() => {
  let _t = 1e12;
  vi.spyOn(Date, 'now').mockImplementation(() => (_t += 1));
});

function obterApi(mod) {
  if (typeof mod.getEstado === 'function') return mod;
  const nome = Object.keys(mod).find(
    (k) => mod[k] && typeof mod[k].getEstado === 'function',
  );
  return mod[nome];
}

async function novoPeer(caso) {
  vi.resetModules();
  const mod = await import(`./${caso.arquivo}`);
  const api = obterApi(mod);
  expect(api.getEstado, `${caso.arquivo} deve expor getEstado`).toBeTruthy();
  expect(api.inscrever, `${caso.arquivo} deve expor inscrever`).toBeTruthy();
  return api;
}

async function dupla(caso) {
  const a = await novoPeer(caso);
  const b = await novoPeer(caso);
  return { a, b };
}

describe.each(CASOS)('%s — p2p real entre duas instâncias (abas)', (caso) => {
  it('mudança local no peer A propaga via BroadcastChannel até o peer B', async () => {
    const { a, b } = await dupla(caso);
    caso.semear(a, 'p2p-a');
    expect(caso.ler(b)).toBe(caso.norm('p2p-a'));
  });

  it('propagação é bidirecional (B pública de volta para A)', async () => {
    const { a, b } = await dupla(caso);

    caso.semear(a, 'p2p-a');
    expect(caso.ler(b)).toBe(caso.norm('p2p-a'));

    caso.semear(b, 'p2p-b');
    expect(caso.ler(a)).toBe(caso.norm('p2p-b'));
    expect(caso.ler(b)).toBe(caso.norm('p2p-b'));
  });

  it('gera estado convergente quando os dois peers escrevem (last-write-wins)', async () => {
    const { a, b } = await dupla(caso);

    caso.semear(a, 'v1');
    caso.semear(b, 'v2');

    expect(caso.ler(a)).toBe(caso.norm('v2'));
    expect(caso.ler(b)).toBe(caso.norm('v2'));
  });

  it('não reinforma o peer autor com o eco do estado (evita loop)', async () => {
    const { a } = await dupla(caso);
    const ouvinte = vi.fn();
    a.inscrever(ouvinte);

    caso.semear(a, 'eco');
    const base = ouvinte.mock.calls.length;
    expect(caso.ler(a)).toBe(caso.norm('eco'));

    /* A mensagem que o peer B devolveria (eco) já está aplicada: reentregar o
       mesmo estado não pode disparar nova notificação. */
    const emissor = new BroadcastChannel(
      globalThis.__broadcastMock().instances[0].name,
    );
    emissor.postMessage({ tipo: 'eco', estado: a.getEstado() });
    emissor.close();

    expect(caso.ler(a)).toBe(caso.norm('eco'));
    expect(ouvinte.mock.calls.length).toBe(base);
  });
});
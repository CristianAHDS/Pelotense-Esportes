import { describe, it, expect, vi } from 'vitest';

/* Teste de contrato aplicado a TODAS as stores: verifica que a "teia" de
   sincronização entre abas (BroadcastChannel, storage, persistência e
   assinatura) funciona igualmente para todos os módulos — exatamente onde
   morava o bug de flicker ao digitar.

   Usa um marcador __marca injetado no estado: ele sobrevive à normalização
   (que é defensiva) e não depende de campos específicos de cada store.
   A aplicação remota (BroadcastChannel/storage) funciona para todos os
   estilos de export; o setEstado direto só existe em alguns. */

/* Cobre as stores que expõem setEstado diretamente. As stores "objeto"
   (artilheiros, brasileiraoCompacta, escalacao, proximasRodadas,
   substituicao, tabelaCompacta, ultimaRodada) que não expõem setEstado no
   módulo são cobertas por testes dedicados (ex.: ultimaRodadaStore.test.js),
   pois sem setEstado não dá para semear uma mudança genérica. */
const ARQUIVOS = [
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
];

function obterApi(mod) {
  if (typeof mod.getEstado === 'function') return mod;
  const nome = Object.keys(mod).find(
    (k) => mod[k] && typeof mod[k].getEstado === 'function',
  );
  return mod[nome];
}

async function carregar(arquivo) {
  vi.resetModules();
  const mod = await import(`./${arquivo}`);
  const api = obterApi(mod);
  expect(api.getEstado, `${arquivo} deve expor getEstado`).toBeTruthy();
  expect(api.inscrever, `${arquivo} deve expor inscrever`).toBeTruthy();
  return api;
}

let seq = 16;
function comMarca(api, marca) {
  const base = { ...structuredClone(api.getEstado()), __marca: marca };
  /* Stores de cronômetro (preJogo, placarBroadcastEscalacao) rejeitam estados
     remotos cujo `atualizadoEm` não seja estritamente mais novo que o local
     (last-write-wins). Marcamos cada snapshot com carimbo estritamente crescente
     para representar um estado genuinamente mais novo. Inofensivo p/ demais. */
  seq += 1;
  base.atualizadoEm = Date.now() + seq;
  return base;
}

/* Descobre o MSG_TIPO real da store disparando a própria transmissão local
   (só disponível nas stores que expõem setEstado). Retorna null se não. */
function descobrirTipo(api) {
  if (typeof api.setEstado !== 'function') return null;
  const vizinha = new BroadcastChannel(
    globalThis.__broadcastMock().instances[0].name,
  );
  let tipo = null;
  vizinha.onmessage = (ev) => {
    if (ev.data?.estado?.__marca === '__tipo__') tipo = ev.data.tipo;
  };
  api.setEstado(comMarca(api, '__tipo__'));
  vizinha.close();
  api.setEstado(comMarca(api, '__tipo__reset'));
  return tipo;
}

/* Entrega um estado remoto no canal BroadcastChannel da store via postMessage
   de um emissor vizinho (simula fielmente outra aba). */
function entregarPelaBroadcast(api, marca, tipo) {
  const nome = globalThis.__broadcastMock().instances[0].name;
  const emissor = new BroadcastChannel(nome);
  emissor.postMessage({ tipo, estado: comMarca(api, marca) });
  emissor.close();
}

/* Entrega um estado remoto via evento storage (simula outra aba escrevendo) */
function entregarPelaStorage(api, marca, chave) {
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: chave,
      newValue: JSON.stringify(comMarca(api, marca)),
    }),
  );
}

/* Descobre a chave do localStorage da store a partir de um marcador persistido */
function chaveDaStore(marca) {
  return Object.keys(localStorage).find(
    (k) => JSON.parse(localStorage.getItem(k)).__marca === marca,
  );
}

describe.each(ARQUIVOS)('%s — contrato de sync entre abas (p2p)', (arquivo) => {
  it('aplica estado remoto recebido via BroadcastChannel e persiste', async () => {
    const api = await carregar(arquivo);
    const tipo = descobrirTipo(api);
    if (!tipo) return;
    entregarPelaBroadcast(api, 'bc1', tipo);
    expect(api.getEstado().__marca).toBe('bc1');
    expect(chaveDaStore('bc1')).toBeTruthy();
  });

  it('aplica estado remoto recebido via evento storage (outra aba)', async () => {
    const api = await carregar(arquivo);
    const tipo = descobrirTipo(api);
    if (!tipo) return;
    entregarPelaBroadcast(api, 'a1', tipo);
    const chave = chaveDaStore('a1');
    expect(chave).toBeTruthy();
    entregarPelaStorage(api, 'a2', chave);
    expect(api.getEstado().__marca).toBe('a2');
  });

  it('não entra em loop ao reaplicar o mesmo estado (eco)', async () => {
    const api = await carregar(arquivo);
    const tipo = descobrirTipo(api);
    if (!tipo) return;
    const ouvinte = vi.fn();
    api.inscrever(ouvinte);
    entregarPelaBroadcast(api, 'eco', tipo);
    const chave = chaveDaStore('eco');
    expect(chave).toBeTruthy();
    const base = ouvinte.mock.calls.length;

    /* Reentrega o MESMO blob persistido (byte a byte) — é o eco da outra aba */
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: chave,
        newValue: localStorage.getItem(chave),
      }),
    );
    expect(api.getEstado().__marca).toBe('eco');
    expect(ouvinte.mock.calls.length).toBe(base);
  });

  it('inscrever notifica a cada mudança e cancelar interrompe', async () => {
    const api = await carregar(arquivo);
    const tipo = descobrirTipo(api);
    if (!tipo) return;
    const ouvinte = vi.fn();
    const cancelar = api.inscrever(ouvinte);

    entregarPelaBroadcast(api, 'n1', tipo);
    expect(ouvinte).toHaveBeenCalledTimes(1);

    cancelar();
    entregarPelaBroadcast(api, 'n2', tipo);
    expect(ouvinte).toHaveBeenCalledTimes(1);
  });

  it('edição local publica no BroadcastChannel e persiste', async () => {
    const api = await carregar(arquivo);
    if (typeof api.setEstado !== 'function') return;

    const tipo = descobrirTipo(api);
    const vizinha = new BroadcastChannel(
      globalThis.__broadcastMock().instances[0].name,
    );
    const recebidas = [];
    vizinha.onmessage = (ev) => recebidas.push(ev.data);

    api.setEstado(comMarca(api, 'local1'));

    expect(tipo).toBeTruthy();
    expect(recebidas.length).toBe(1);
    expect(recebidas[0].tipo).toBe(tipo);
    expect(recebidas[0].estado.__marca).toBe('local1');
    expect(chaveDaStore('local1')).toBeTruthy();
  });
});

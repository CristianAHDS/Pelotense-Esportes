import { describe, it, expect, vi } from 'vitest';

/* Dedicada às stores "objeto" que NÃO expõem setEstado no módulo, apenas ações
   (artilheiros, proximasRodadas, escalacao, substituicao, tabelaCompacta,
   brasileiraoCompacta, ultimaRodada). Valida o mesmo contrato de sync entre
   abas usando cada ação real como gatilho de mudança. */

const CASOS = [
  {
    arquivo: 'artilheirosStore.js',
    semear: (a) => a.atualizarCampo('titulo', 'TESTE'),
    marcar: (a) => a.getEstado().titulo,
    esperado: 'TESTE',
  },
  {
    arquivo: 'proximasRodadasStore.js',
    semear: (a) => a.atualizarCampo('titulo', 'TESTE'),
    marcar: (a) => a.getEstado().titulo,
    esperado: 'TESTE',
  },
  {
    arquivo: 'escalacaoStore.js',
    semear: (a) => a.atualizarCampo('nomeCasa', 'TESTE'),
    marcar: (a) => a.getEstado().nomeCasa,
    esperado: 'TESTE',
  },
  {
    arquivo: 'substituicaoStore.js',
    semear: (a) => a.atualizarCampo('nomeTime', 'TESTE'),
    marcar: (a) => a.getEstado().nomeTime,
    esperado: 'TESTE',
  },
  {
    arquivo: 'tabelaCompactaStore.js',
    semear: (a) => a.alternarDivisao(),
    marcar: (a) => a.getEstado().dividir,
    esperado: true,
  },
  {
    arquivo: 'brasileiraoCompactaStore.js',
    semear: (a) => a.alternarDivisao(),
    marcar: (a) => a.getEstado().dividir,
    esperado: true,
  },
];

function obterObjeto(mod) {
  const nome = Object.keys(mod).find(
    (k) => mod[k] && typeof mod[k].getEstado === 'function',
  );
  return mod[nome];
}

async function carregar(arquivo) {
  vi.resetModules();
  const api = obterObjeto(await import(`./${arquivo}`));
  expect(api.getEstado).toBeTruthy();
  expect(api.inscrever).toBeTruthy();
  return api;
}

function descobrirTipo(api, semear) {
  const nome = globalThis.__broadcastMock().instances[0]?.name;
  const vizinha = new BroadcastChannel(nome);
  let tipo = null;
  vizinha.onmessage = (ev) => {
    if (!tipo) tipo = ev.data.tipo;
  };
  semear(api);
  vizinha.close();
  return tipo;
}

describe.each(CASOS)(
  '%s — sync entre abas (p2p) com ações reais',
  ({ arquivo, semear, marcar, esperado }) => {
    it('ação local altera estado, persiste e publica no BroadcastChannel', async () => {
      const api = await carregar(arquivo);
      const tipo = descobrirTipo(api, semear);
      expect(tipo).toBeTruthy();
      expect(marcar(api)).toBe(esperado);
      /* A mudança real foi persistida em ao menos uma chave do localStorage. */
      const algumBlobReflete = Object.keys(localStorage).some((chave) =>
        String(localStorage.getItem(chave)).includes(
          esperado === true ? '"dividir":true' : `"${esperado}"`,
        ),
      );
      expect(algumBlobReflete).toBe(true);
    });

    it('aplica estado remoto recebido via storage (outra aba)', async () => {
      const api = await carregar(arquivo);

      semear(api);
      const chaves = Object.keys(localStorage);
      expect(chaves.length).toBeGreaterThan(0);

      chaves.forEach((chave) => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: chave,
            newValue: JSON.stringify({ ...api.getEstado(), __marca: 'st' }),
          }),
        );
      });
      expect(api.getEstado().__marca).toBe('st');
    });

    it('não entra em loop ao reaplicar o mesmo estado persistido', async () => {
      const api = await carregar(arquivo);
      const ouvinte = vi.fn();
      api.inscrever(ouvinte);

      semear(api);
      const base = ouvinte.mock.calls.length;
      const chave = Object.keys(localStorage)[0];
      const blob = localStorage.getItem(chave);

      window.dispatchEvent(
        new StorageEvent('storage', { key: chave, newValue: blob }),
      );
      expect(ouvinte.mock.calls.length).toBe(base);
    });

    it('inscrever notifica a cada mudança local e cancelar interrompe', async () => {
      const api = await carregar(arquivo);
      const ouvinte = vi.fn();
      const cancelar = api.inscrever(ouvinte);

      semear(api);
      expect(ouvinte).toHaveBeenCalledTimes(1);

      cancelar();
      semear(api);
      expect(ouvinte).toHaveBeenCalledTimes(1);
    });
  },
);

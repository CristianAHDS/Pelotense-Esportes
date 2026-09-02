import { beforeEach, describe, it, expect, vi } from 'vitest';

/* Cada teste importa o módulo da store de novo (singleton fresco),
   simulando uma nova aba. O estado é zerado via config e pelo reset de
   localStorage/BroadcastChannel no setup. */

async function carregarStore() {
  vi.resetModules();
  const mod = await import('./ultimaRodadaStore');
  return mod.ultimaRodada;
}

const CHANNEL = 'broadcast:sync-ultima-rodada-v1';
const STORAGE_KEY = 'pelotense:ultima-rodada:v1';
const MSG_TIPO = 'estado:ultima-rodada:v1';

describe('ultimaRodadaStore — funcionamento', () => {
  let store;

  beforeEach(async () => {
    store = await carregarStore();
  });

  it('estado padrão inicial tem rodadaNumero vazio', () => {
    expect(store.getEstado().rodadaNumero).toBe('');
    expect(store.getEstado().titulo).toBe('ÚLTIMA RODADA');
  });

  it('atualizarCampo rodadaNumero substitui o dígito no título', () => {
    store.atualizarCampo('rodadaNumero', '8');
    const e = store.getEstado();
    expect(e.rodadaNumero).toBe('8');
    expect(e.titulo).toBe('ÚLTIMA RODADA 8');
  });

  it('atualizarCampo rodadaNumero troca o dígito já existente', () => {
    store.atualizarCampo('rodadaNumero', '8');
    store.atualizarCampo('rodadaNumero', '15');
    expect(store.getEstado().rodadaNumero).toBe('15');
    expect(store.getEstado().titulo).toBe('ÚLTIMA RODADA 15');
  });

  it('rodadaNumero só aceita dígitos e no máximo 2', () => {
    store.atualizarCampo('rodadaNumero', 'a12b3');
    expect(store.getEstado().rodadaNumero).toBe('12');
  });

  it('limpar rodadaNumero remove o número do título', () => {
    store.atualizarCampo('rodadaNumero', '8');
    store.atualizarCampo('rodadaNumero', '');
    expect(store.getEstado().rodadaNumero).toBe('');
    expect(store.getEstado().titulo).toBe('ÚLTIMA RODADA ');
  });

  it('atualizarCampo título é normalizado em maiúsculas e limitado a 32', () => {
    store.atualizarCampo('titulo', 'rodada grande de teste com muitos caracteres extras');
    expect(store.getEstado().titulo).toBe(store.getEstado().titulo.toUpperCase());
    expect(store.getEstado().titulo.length).toBeLessThanOrEqual(32);
  });

  it('preencherDaFGF define título, rodadaNumero, jogos e posições', () => {
    store.preencherDaFGF({
      titulo: 'Rodada 8',
      jogos: [
        { casaSigla: 'pel', casaGols: 2, foraGols: 1, foraSigla: 'scl' },
      ],
      classificacao: [{ sigla: 'pel', pos: 1 }],
    });
    const e = store.getEstado();
    expect(e.rodadaNumero).toBe('8');
    expect(e.titulo).toBe('RODADA 8');
    expect(e.jogos[0].casaGols).toBe('2');
    expect(e.posicoes[0].sigla).toBe('PEL');
  });

  it('persiste o estado no localStorage', async () => {
    store.atualizarCampo('rodadaNumero', '8');
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(salvo.rodadaNumero).toBe('8');
  });
});

describe('ultimaRodadaStore — sync entre abas (p2p)', () => {
  it('edição local publica mensagem no BroadcastChannel para outras abas', async () => {
    const store = await carregarStore();

    /* Aba vizinha escutando no mesmo canal */
    const vizinha = new BroadcastChannel(CHANNEL);
    const recebidas = [];
    vizinha.onmessage = (ev) => recebidas.push(ev.data);

    store.atualizarCampo('rodadaNumero', '8');

    expect(recebidas.length).toBe(1);
    expect(recebidas[0].tipo).toBe(MSG_TIPO);
    expect(recebidas[0].estado.rodadaNumero).toBe('8');
  });

  it('mensagem recebida do BroadcastChannel (outra aba) atualiza o estado', async () => {
    const store = await carregarStore();

    /* Outra aba manda um estado pelo canal */
    const outraAba = new BroadcastChannel(CHANNEL);
    const forasteiro = {
      ...store.getEstado(),
      titulo: 'RODADA 15',
      rodadaNumero: '15',
    };
    outraAba.postMessage({ tipo: MSG_TIPO, estado: forasteiro });

    expect(store.getEstado().rodadaNumero).toBe('15');
    expect(store.getEstado().titulo).toBe('RODADA 15');
  });

  it('evento "storage" (outra aba) aplica o estado remoto', async () => {
    const store = await carregarStore();

    const forasteiro = {
      ...store.getEstado(),
      rodadaNumero: '3',
      titulo: 'RODADA 3',
    };
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(forasteiro),
      }),
    );

    expect(store.getEstado().rodadaNumero).toBe('3');
  });

  it('anula eco do próprio estado (mesmo conteúdo) sem ficar em loop', async () => {
    const store = await carregarStore();
    const ouvinte = vi.fn();
    store.inscrever(ouvinte);

    store.atualizarCampo('rodadaNumero', '8');
    const chamadas = ouvinte.mock.calls.length;

    /* Reenvia exatamente o mesmo estado como se fosse eco remoto */
    const outraAba = new BroadcastChannel(CHANNEL);
    outraAba.postMessage({ tipo: MSG_TIPO, estado: store.getEstado() });

    expect(store.getEstado().rodadaNumero).toBe('8');
    expect(ouvinte.mock.calls.length).toBe(chamadas);
  });

  it('inscrever notifica os ouvintes a cada mudança local', async () => {
    const store = await carregarStore();
    const ouvinte = vi.fn();
    store.inscrever(ouvinte);

    store.atualizarCampo('rodadaNumero', '8');
    expect(ouvinte).toHaveBeenCalledTimes(1);
    expect(ouvinte.mock.calls[0][0].rodadaNumero).toBe('8');
  });

  it('inscrever retorna função que cancela a assinatura', async () => {
    const store = await carregarStore();
    const ouvinte = vi.fn();
    const cancelar = store.inscrever(ouvinte);
    cancelar();

    store.atualizarCampo('rodadaNumero', '8');
    expect(ouvinte).not.toHaveBeenCalled();
  });
});

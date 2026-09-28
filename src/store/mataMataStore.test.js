import { beforeEach, describe, it, expect, vi } from 'vitest';

async function carregarStore() {
  vi.resetModules();
  return import('./mataMataStore');
}

function par(casaSigla, visitanteSigla, golsCasa = null, golsFora = null) {
  return {
    casa: {
      nome: casaSigla,
      sigla: casaSigla,
      cor: '#111',
      escudo: `/escudos/${casaSigla}.png`,
      gols: golsCasa,
    },
    visitante: {
      nome: visitanteSigla,
      sigla: visitanteSigla,
      cor: '#222',
      escudo: `/escudos/${visitanteSigla}.png`,
      gols: golsFora,
    },
  };
}

describe('mataMataStore — preenchimento por fase', () => {
  let store;

  beforeEach(async () => {
    store = await carregarStore();
  });

  it('preencherConfrontos mantém o nome, a cor e o escudo do time', () => {
    store.preencherConfrontos('quartas', [par('APA', 'SCR')]);
    const c = store.getEstado().quartas[0];
    expect(c.casa.sigla).toBe('APA');
    expect(c.casa.escudo).toBe('/escudos/APA.png');
    expect(c.visitante.sigla).toBe('SCR');
  });

  it('zera os confrontos sem par correspondente', () => {
    store.preencherConfrontos('quartas', [
      par('APA', 'SCR'),
      par('BFR', 'PAS'),
    ]);
    store.preencherConfrontos('quartas', [par('BRA', 'ESP')]);
    const q = store.getEstado().quartas;
    expect(q[0].casa.sigla).toBe('BRA');
    expect(q[1].casa.sigla).toBe('---');
    expect(q[1].casa.nome).toBe('');
    expect(q[3].casa.sigla).toBe('---');
  });

  it('zera os placares quando o par não traz gols', () => {
    store.preencherConfrontos('quartas', [par('APA', 'SCR', 2, 0)]);
    expect(store.getEstado().quartas[0].casa.gols).toBe(2);
    store.preencherConfrontos('quartas', [par('APA', 'SCR')]);
    expect(store.getEstado().quartas[0].casa.gols).toBeNull();
  });

  it('preserva os gols vindos da importação', () => {
    store.preencherConfrontos('quartas', [par('APA', 'SCR', 1, 0)]);
    expect(store.getEstado().quartas[0].casa.gols).toBe(1);
    expect(store.getEstado().quartas[0].visitante.gols).toBe(0);
  });

  it('limpa as fases seguintes, que dependem dos vencedores desta', () => {
    store.preencherConfrontos(
      'confrontos',
      Array.from({ length: 8 }, (_, i) => par(`A${i}`, `B${i}`, 1, 0)),
    );
    store.preencherConfrontos('quartas', [
      par('A0', 'B0', 2, 1),
      par('A2', 'B2', 0, 0),
      par('A4', 'B4', 1, 1),
      par('A6', 'B6', 3, 0),
    ]);
    store.preencherConfrontos('semi', [
      par('A0', 'A2', 1, 0),
      par('A4', 'A6', 0, 2),
    ]);
    expect(store.getEstado().final[0].casa.sigla).toBe('A0');
    expect(store.getEstado().final[0].visitante.sigla).toBe('A6');

    store.preencherConfrontos('confrontos', [par('BRA', 'ESP')]);
    expect(store.getEstado().confrontos[0].casa.sigla).toBe('BRA');
    expect(store.getEstado().confrontos[1].casa.sigla).toBe('---');
    expect(store.getEstado().quartas[0].casa.sigla).toBe('---');
    expect(store.getEstado().semi[0].casa.sigla).toBe('---');
    expect(store.getEstado().final[0].casa.sigla).toBe('---');
  });

  it('propaga o vencedor das oitavas para as quartas', () => {
    store.preencherConfrontos('confrontos', [par('APA', 'SCR', 2, 0)]);
    expect(store.getEstado().quartas[0].casa.sigla).toBe('APA');
    expect(store.getEstado().quartas[0].casa.escudo).toBe('/escudos/APA.png');
  });

  it('define o vencedor pelos pênaltis quando o placar é igual', () => {
    const confronto = par('APA', 'SCR', 1, 1);
    confronto.casa.pen = 5;
    confronto.visitante.pen = 3;
    store.preencherConfrontos('confrontos', [confronto]);
    expect(store.getEstado().quartas[0].casa.sigla).toBe('APA');
  });
});

describe('mataMataStore — preencherDoSuperPlacar', () => {
  let store;

  beforeEach(async () => {
    store = await carregarStore();
  });

  it('manda 8 confrontos para as oitavas e devolve a chave da fase', () => {
    const confrontos = Array.from({ length: 8 }, (_, i) =>
      par(`A${i}`, `B${i}`),
    );
    const chave = store.preencherDoSuperPlacar({ confrontos });
    expect(chave).toBe('confrontos');
    expect(store.getEstado().confrontos[7].casa.sigla).toBe('A7');
  });

  it('manda 4 confrontos para as quartas e atualiza o nome da fase', () => {
    const chave = store.preencherDoSuperPlacar({
      fase: 'Quartas de Final',
      confrontos: [
        par('APA', 'SCR'),
        par('BFR', 'PAS'),
        par('BRA', 'ESP'),
        par('UFR', 'VER'),
      ],
    });
    expect(chave).toBe('quartas');
    expect(store.getEstado().fase).toBe('QUARTAS DE FINAL');
    expect(store.getEstado().quartas[0].casa.sigla).toBe('APA');
    expect(store.getEstado().quartas[3].visitante.sigla).toBe('VER');
  });

  it('manda 2 confrontos para a semifinal e 1 para a final', () => {
    expect(
      store.preencherDoSuperPlacar({ confrontos: [par('APA', 'SCR')] }),
    ).toBe('final');
    store.limparFase('final');
    expect(
      store.preencherDoSuperPlacar({
        confrontos: [par('APA', 'SCR'), par('BFR', 'PAS')],
      }),
    ).toBe('semi');
  });

  it('não apaga o nome da fase quando o serviço não devolve o título', () => {
    store.definirFase('SEMIFINAL');
    store.preencherDoSuperPlacar({ confrontos: [par('APA', 'SCR')] });
    expect(store.getEstado().fase).toBe('SEMIFINAL');
  });
});

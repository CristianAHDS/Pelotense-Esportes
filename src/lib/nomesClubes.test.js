import { describe, it, expect } from 'vitest';
import {
  nomeCanonico,
  variantesNome,
  aplicarNomesCanonicos,
} from './nomesClubes';

describe('nomesClubes — nomeCanonico', () => {
  it('retorna o próprio nome quando não há variante cadastrada', () => {
    expect(nomeCanonico('Pelotas')).toBe('Pelotas');
  });

  it('normaliza variantes do Brasil de Pelotas', () => {
    expect(nomeCanonico('Brasil - SAF')).toBe('Brasil');
    expect(nomeCanonico('brasil de pelotas')).toBe('Brasil');
    expect(nomeCanonico('Brasil-PE')).toBe('Brasil');
  });

  it('normaliza Guarani - VA', () => {
    expect(nomeCanonico('Guarani VA')).toBe('Guarani - VA');
    expect(nomeCanonico('Guarani-RS')).toBe('Guarani - VA');
  });

  it('é insensível a acentos e maiúsculas/minúsculas', () => {
    expect(nomeCanonico('Brasil de Farroupilha')).toBe('Brasil - FAR');
    expect(nomeCanonico('BRASIL-FAR')).toBe('Brasil - FAR');
  });

  it('Apafut varia em caixa', () => {
    expect(nomeCanonico('APAFUT')).toBe('Apafut');
    expect(nomeCanonico('Apa Fut')).toBe('Apafut');
  });

  it('lida com valores vazios', () => {
    expect(nomeCanonico('')).toBe('');
    expect(nomeCanonico(null)).toBe('');
  });
});

describe('nomesClubes — variantesNome', () => {
  it('retorna apenas a chave cuando não há clube casado', () => {
    const v = variantesNome('Fulano');
    expect(v).toEqual(['fulano']);
  });

  it('ajusta todas as grafias conhecidas de um clube', () => {
    const v = variantesNome('Brasil');
    expect(v).toContain('brasil');
    expect(v).toContain('brasildepelotas');
    expect(v).toContain('brasilpe');
  });

  it('retorna array vazio para entrada vazia', () => {
    expect(variantesNome('')).toEqual([]);
  });
});

describe('nomesClubes — aplicarNomesCanonicos', () => {
  it('devolve o mesmo array quando não é array', () => {
    const n = aplicarNomesCanonicos(null);
    expect(n).toBe(null);
  });

  it('aplica o nome canônico em cada clube', () => {
    const times = [{ nome: 'Brasil - SAF' }, { nome: 'Outro' }];
    const r = aplicarNomesCanonicos(times);
    expect(r[0].nome).toBe('Brasil');
    expect(r[1].nome).toBe('Outro');
  });

  it('não altera entradas sem nome', () => {
    const times = [{ sigla: 'PEL' }];
    expect(aplicarNomesCanonicos(times)[0]).toEqual({ sigla: 'PEL' });
  });
});

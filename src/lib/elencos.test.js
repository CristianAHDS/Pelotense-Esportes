import { describe, it, expect } from 'vitest';
import {
  ELENCOS_POR_SIGLA,
  elencoDaSigla,
  NOMES_POR_SIGLA,
  nomeDaSigla,
} from './elencos';

describe('elencos — elencoDaSigla', () => {
  it('retorna null para sigla desconhecida ou vazia', () => {
    expect(elencoDaSigla('ZZZ')).toBe(null);
    expect(elencoDaSigla('')).toBe(null);
    expect(elencoDaSigla(undefined)).toBe(null);
  });

  it('é insensível a caixa', () => {
    expect(elencoDaSigla('pel')).toBeDefined();
    expect(elencoDaSigla('PEL')).toBeDefined();
  });

  it('todo elenco tem 11 jogadores', () => {
    for (const sigla of Object.keys(NOMES_POR_SIGLA)) {
      expect(elencoDaSigla(sigla)).toHaveLength(11);
    }
  });

  it('cada jogador é inicializado com cartões e gols zerados e nume/nome em maiúscula', () => {
    const j = elencoDaSigla('PEL')[0];
    expect(j.cartoes).toEqual({ amarelo: 0, vermelho: 0 });
    expect(j.gols).toBe(0);
    expect(j.nome).toBe(j.nome.toUpperCase());
  });

  it('aponta para lista de elenco por sigla', () => {
    expect(Array.isArray(ELENCOS_POR_SIGLA.PEL)).toBe(true);
    expect(ELENCOS_POR_SIGLA.PEL.length).toBe(11);
  });
});

describe('elencos — nomeDaSigla', () => {
  it('retorna o nome por sigla em maiúscula', () => {
    expect(nomeDaSigla('PEL')).toBe('PELOTAS');
    expect(nomeDaSigla('BRA')).toBe('BRASIL');
  });

  it('retorna string vazia para sigla desconhecida', () => {
    expect(nomeDaSigla('XXX')).toBe('');
    expect(nomeDaSigla()).toBe('');
  });
});

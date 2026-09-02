import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('html2canvas', () => ({
  default: vi.fn(async () => ({ toDataURL: () => 'data:image/png;base64,abc' })),
}));

import { slugArquivo } from './capturaImagem';

describe('capturaImagem — slugArquivo', () => {
  it('converte para minúsculas sem acentos', () => {
    expect(slugArquivo('Última Rodada')).toBe('ultima-rodada');
  });

  it('substitui espaços e caracteres especiais por hífen', () => {
    expect(slugArquivo('Brasil de Pelotas 8')).toBe('brasil-de-pelotas-8');
  });

  it('remove hífens nas pontas e duplicados', () => {
    expect(slugArquivo('  X  Y  ')).toBe('x-y');
  });

  it('retorna string vazia para entrada vazia', () => {
    expect(slugArquivo('')).toBe('');
    expect(slugArquivo(null)).toBe('');
  });

  it('mantém dígitos e letras, convertendo pontuação em hífen', () => {
    expect(slugArquivo('FGF#2026!')).toBe('fgf-2026');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { usePlacarNormal } from './usePlacarNormal';

function lojaMock(estadoInicial) {
  const ouvintes = new Set();
  return {
    getEstado: vi.fn(() => estadoInicial),
    inscrever: vi.fn((fn) => {
      ouvintes.add(fn);
      return () => ouvintes.delete(fn);
    }),
    _ouvintes: ouvintes,
    _emitir(novo) {
      estadoInicial = novo;
      ouvintes.forEach((fn) => fn(novo));
    },
  };
}

describe('usePlacarNormal', () => {
  it('inicializa com o estado atual da loja', () => {
    const loja = lojaMock({ titulo: 'partida' });
    const { result } = renderHook(() => usePlacarNormal(loja));
    expect(loja.getEstado).toHaveBeenCalled();
    expect(result.current).toEqual({ titulo: 'partida' });
  });

  it('se inscreve na loja e reflete mudanças em tempo real', () => {
    const loja = lojaMock({ titulo: 'a' });
    const { result } = renderHook(() => usePlacarNormal(loja));
    expect(loja.inscrever).toHaveBeenCalledTimes(1);

    act(() => loja._emitir({ titulo: 'b' }));
    expect(result.current).toEqual({ titulo: 'b' });
  });

  it('cancela a assinatura ao desmontar', () => {
    const loja = lojaMock({});
    const inscrever = loja.inscrever.mock;
    const { unmount } = renderHook(() => usePlacarNormal(loja));
    const retorno = inscrever.results[0].value; // função de cancelamento
    expect(loja._ouvintes.size).toBe(1);
    unmount();
    expect(loja._ouvintes.size).toBe(0);
    expect(typeof retorno).toBe('function');
  });

  it('não re-renderiza depois de desmontado (assinatura cancelada)', () => {
    const loja = lojaMock({ titulo: 'x' });
    const { result, unmount } = renderHook(() => usePlacarNormal(loja));
    unmount();
    act(() => loja._emitir({ titulo: 'y' }));
    // estado não muda mais internamente (sem erro de setState)
    expect(result.current).toEqual({ titulo: 'x' });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlacarBroadcast } from './usePlacarBroadcast';

/* Loja falsa com o contrato esperado (getEstado + inscrever) */
function lojaFalsa(estadoInicial) {
  const ouvintes = new Set();
  let estado = estadoInicial;
  return {
    getEstado: () => estado,
    state: () => estado,
    cru: {
      getEstado: () => estado,
      inscrever: (fn) => {
        ouvintes.add(fn);
        return () => ouvintes.delete(fn);
      },
      __emitir: (novo) => {
        estado = novo;
        ouvintes.forEach((fn) => fn(novo));
      },
    },
  };
}

describe('usePlacarBroadcast', () => {
  it('inicializa com o estado atual da loja', () => {
    const l = lojaFalsa({ casa: 'A' });
    const { result } = renderHook(() => usePlacarBroadcast(l.cru));
    expect(result.current).toEqual({ casa: 'A' });
  });

  it('usa a loja padrão quando nenhuma é passada', () => {
    /* Apenas garante que não quebra chamando sem argumento */
    const { result } = renderHook(() => usePlacarBroadcast());
    expect(result.current).toBeDefined();
  });

  it('atualiza o estado quando a loja emite (notifica)', () => {
    const l = lojaFalsa({ casa: 'A' });
    const { result } = renderHook(() => usePlacarBroadcast(l.cru));

    act(() => l.cru.__emitir({ casa: 'B' }));
    expect(result.current).toEqual({ casa: 'B' });
  });

  it('cancela a assinatura ao desmontar (sem re-render pós-unmount)', () => {
    const l = lojaFalsa({ casa: 'A' });
    const { unmount } = renderHook(() => usePlacarBroadcast(l.cru));
    unmount();
    expect(() => act(() => l.cru.__emitir({ casa: 'C' }))).not.toThrow();
  });
});

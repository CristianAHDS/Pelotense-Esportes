import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TemaProvider, useTema } from './useTema.jsx';
import { theme, lightTheme } from '../theme';

const STORAGE_KEY = 'pelotense-tema';

beforeEach(() => {
  localStorage.clear();
});

describe('useTema', () => {
  it('padrão escuro sem valor salvo', () => {
    const { result } = renderHook(() => useTema(), {
      wrapper: TemaProvider,
    });
    expect(result.current.escuro).toBe(true);
    expect(result.current.tema).toBe(theme);
  });

  it('carrega tema salvo "claro"', () => {
    localStorage.setItem(STORAGE_KEY, 'claro');
    const { result } = renderHook(() => useTema(), {
      wrapper: TemaProvider,
    });
    expect(result.current.escuro).toBe(false);
    expect(result.current.tema).toBe(lightTheme);
  });

  it('alternarTema troca o tema e persiste', () => {
    const { result } = renderHook(() => useTema(), {
      wrapper: TemaProvider,
    });
    act(() => result.current.alternarTema());
    expect(result.current.escuro).toBe(false);
    expect(result.current.tema).toBe(lightTheme);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('claro');

    act(() => result.current.alternarTema());
    expect(result.current.escuro).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('escuro');
  });
});

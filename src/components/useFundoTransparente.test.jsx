import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFundoTransparente } from './useFundoTransparente';

describe('useFundoTransparente', () => {
  it('torna html/body transparentes e restaura ao desmontar', () => {
    const html = document.documentElement;
    const body = document.body;
    html.style.background = 'rgb(1,2,3)';
    body.style.background = 'rgb(4,5,6)';

    const { unmount } = renderHook(() => useFundoTransparente());

    expect(html.style.background).toBe('transparent');
    expect(body.style.background).toBe('transparent');

    unmount();
    expect(html.style.background).toBe('rgb(1, 2, 3)');
    expect(body.style.background).toBe('rgb(4, 5, 6)');
  });
});

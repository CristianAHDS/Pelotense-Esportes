import { useEffect } from 'react';

/* Deixa html/body transparentes para uso como browser source (OBS) */
export function useFundoTransparente() {
  useEffect(() => {
    const docEl = document.documentElement;
    const corpo = document.body;
    const anterior = [docEl.style.background, corpo.style.background];
    docEl.style.background = 'transparent';
    corpo.style.background = 'transparent';
    return () => {
      docEl.style.background = anterior[0];
      corpo.style.background = anterior[1];
    };
  }, []);
}

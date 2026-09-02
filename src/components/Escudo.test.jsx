import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { Escudo } from './Escudo';

function renderComTema(el) {
  return render(<ThemeProvider theme={theme}>{el}</ThemeProvider>);
}

function emoldura(el) {
  return <ThemeProvider theme={theme}>{el}</ThemeProvider>;
}

function imagem() {
  return document.querySelector('img');
}

function svg() {
  return document.querySelector('svg');
}

describe('Escudo', () => {
  it('renderiza o fallback SVG quando não há url', () => {
    renderComTema(<Escudo sigla="PEL" tamanho={30} />);
    expect(svg()).toBeTruthy();
    expect(svg().getAttribute('viewBox')).toBe('0 0 24 27');
    expect(svg().textContent).toContain('PEL');
  });

  it('renderiza a imagem quando há url', () => {
    renderComTema(<Escudo url="/escudos/PEL.png" tamanho={30} />);
    expect(imagem()).toHaveAttribute('src', '/escudos/PEL.png');
    expect(imagem()).toHaveAttribute('alt', '');
    expect(svg()).toBeNull();
  });

  it('cai para o SVG quando a imagem falha ao carregar', () => {
    renderComTema(<Escudo url="/escudos/X.png" sigla="BRA" />);
    fireEvent.error(imagem());
    expect(svg()).toBeTruthy();
  });

  it('volta a mostrar a imagem se a url mudar após erro', () => {
    const { rerender } = renderComTema(<Escudo url="/a.png" sigla="PEL" />);
    fireEvent.error(imagem());
    expect(svg()).toBeTruthy();

    rerender(emoldura(<Escudo url="/b.png" sigla="PEL" />));
    expect(imagem()).toHaveAttribute('src', '/b.png');
  });
});

describe('Escudo — sigla truncada para 4 caracteres', () => {
  it('limita a sigla a 4 letras em maiúsculas', () => {
    renderComTema(<Escudo sigla="pelotaslonga" tamanho={20} />);
    const texto = svg().querySelector('text');
    expect(texto.textContent).toBe('PELO');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { SubstituicaoCartao, urlEscudoTime } from './SubstituicaoCartao';

function emoldura(el) {
  return <ThemeProvider theme={theme}>{el}</ThemeProvider>;
}

const base = {
  corTime: '#16a34a',
  siglaTime: 'PEL',
  nomeTime: 'PELOTAS',
  minuto: "35'",
};

describe('SubstituicaoCartao — urlEscudoTime', () => {
  it('prioriza a url informada', () => {
    expect(urlEscudoTime('/x.png', 'PEL')).toBe('/x.png');
  });

  it('gera url padrão para sigla de 3-4 letras', () => {
    expect(urlEscudoTime(null, 'pel')).toBe('/escudos/PEL.png');
  });

  it('retorna null para sigla inválida', () => {
    expect(urlEscudoTime(null, 'X')).toBe(null);
  });
});

describe('SubstituicaoCartao — troca', () => {
  it('mostra saída e entrada', () => {
    render(
      emoldura(
        <SubstituicaoCartao
          dados={{
            ...base,
            saiNum: '7',
            saiNome: 'RAFAEL',
            entraNum: '17',
            entraNome: 'LUCAS',
          }}
        />,
      ),
    );
    expect(screen.getByText('Sai')).toBeInTheDocument();
    expect(screen.getByText('Entra')).toBeInTheDocument();
    expect(screen.getByText('RAFAEL')).toBeInTheDocument();
    expect(screen.getByText('LUCAS')).toBeInTheDocument();
    expect(screen.getByText("35'")).toBeInTheDocument();
  });
});

describe('SubstituicaoCartao — gol', () => {
  it('mostra autor do gol', () => {
    render(
      emoldura(
        <SubstituicaoCartao
          dados={{ ...base, tipo: 'gol', saiNum: '9', saiNome: 'DIEGO' }}
        />,
      ),
    );
    expect(screen.getByText('DIEGO')).toBeInTheDocument();
    expect(screen.getByText('⚽')).toBeInTheDocument();
  });
});

describe('SubstituicaoCartao — cartão', () => {
  it('mostra o tipo do cartão', () => {
    render(
      emoldura(
        <SubstituicaoCartao
          dados={{
            ...base,
            tipo: 'cartao',
            cartaoCor: 'amarelo',
            saiNum: '4',
            saiNome: 'RODRIGO',
          }}
        />,
      ),
    );
    expect(screen.getByText('Cartão Amarelo')).toBeInTheDocument();
    expect(screen.getByText('RODRIGO')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { PlacarModelCartao } from './PlacarModelCartao';
import { segundosAtuais, formatarTempo } from '../store/placarModelStore';

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function emoldura(el) {
  return <ThemeProvider theme={theme}>{el}</ThemeProvider>;
}

const dados = {
  timeCasa: { nome: 'PELOTAS', escudo: '/escudos/PEL.png' },
  timeVisitante: { nome: 'BRASIL', escudo: '/escudos/BRA.png' },
  golsCasa: 2,
  golsVisitante: 1,
  corCasa: '#1a1a2e',
  corVisitante: '#e63946',
  cronometro: { base: 45 * 60, rodando: false, iniciadoEm: 0 },
  periodo: '2º TEMPO',
  estadoPartida: 'AO VIVO',
  acrescimo: 0,
  cartoesCasa: { amarelo: 1, vermelho: 0 },
  cartoesVisitante: { amarelo: 2, vermelho: 1 },
  mostrarEscudos: true,
};

describe('placarModelStore — segundosAtuais', () => {
  it('retorna a base quando parado', () => {
    expect(segundosAtuais({ base: 45 * 60, rodando: false })).toBe(2700);
  });

  it('soma o tempo decorrido quando rodando', () => {
    let agora = 5_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => agora);
    const cron = { base: 10, rodando: true, iniciadoEm: agora };
    expect(segundosAtuais(cron)).toBe(10);
    agora += 90_000;
    expect(segundosAtuais(cron)).toBe(100);
  });

  it('retorna 0 quando não há cronômetro', () => {
    expect(segundosAtuais(null)).toBe(0);
  });

  it('formata 0 como 00:00 e com horas quando houver', () => {
    expect(formatarTempo(0)).toBe('00:00');
    expect(formatarTempo(90)).toBe('01:30');
    expect(formatarTempo(3600)).toBe('1:00:00');
  });
});

describe('PlacarModelCartao', () => {
  it('exibe os nomes dos times e o placar', () => {
    render(emoldura(<PlacarModelCartao dados={{ ...dados }} />));
    expect(screen.getByText('PELOTAS')).toBeInTheDocument();
    expect(screen.getByText('BRASIL')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('exibe o tempo e o período', () => {
    render(emoldura(<PlacarModelCartao dados={{ ...dados }} />));
    expect(document.body.textContent).toContain('45:00');
    // para AO VIVO o período é refletido (rotuloStatus retorna o período)
    expect(document.body.textContent).toContain('2º TEMPO');
  });

  it('mostra INT no intervalo e FT no encerrado (rotuloStatus)', () => {
    const { unmount } = render(
      emoldura(
        <PlacarModelCartao dados={{ ...dados, estadoPartida: 'INTERVALO' }} />,
      ),
    );
    expect(document.body.textContent).toContain('INT');
    unmount();

    render(
      emoldura(
        <PlacarModelCartao
          dados={{ ...dados, estadoPartida: 'ENCERRADO', cronometro: { base: 90 * 60, rodando: false, iniciadoEm: 0 } }}
        />,
      ),
    );
    expect(document.body.textContent).toContain('FT');
  });

  it('exibe o acréscimo quando maior que zero', () => {
    render(emoldura(<PlacarModelCartao dados={{ ...dados, acrescimo: 3 }} />));
    const el = document.body.textContent;
    expect(el).toContain("+3'");
  });

  it('renderiza os cartões amarelos e vermelhos de cada time', () => {
    // conta spans vazios (CartaoMini, Divisor, PontoVivo) com escudos desativados
    const contaVazios = (c) =>
      Array.from(c.querySelectorAll('span')).filter(
        (e) => e.textContent.trim() === '',
      ).length;

    const comCartoes = render(
      emoldura(<PlacarModelCartao dados={{ ...dados, mostrarEscudos: false }} />),
    );
    const semCartoes = render(
      emoldura(
        <PlacarModelCartao
          dados={{
            ...dados,
            mostrarEscudos: false,
            cartoesCasa: { amarelo: 0, vermelho: 0 },
            cartoesVisitante: { amarelo: 0, vermelho: 0 },
          }}
        />,
      ),
    );

    // a diferença de spans vazios é exatamente o nº de CartaoMini esperado
    // (1 amarelo na casa, 2 amarelos + 1 vermelho na visita = 4)
    const delta =
      contaVazios(comCartoes.container) - contaVazios(semCartoes.container);
    expect(delta).toBe(4);
  });

  it('esconde os escudos quando mostrarEscudos=false', () => {
    render(
      emoldura(<PlacarModelCartao dados={{ ...dados, mostrarEscudos: false }} />),
    );
    expect(document.querySelectorAll('img').length).toBe(0);
  });

  it('mostra os escudos por padrão', () => {
    render(emoldura(<PlacarModelCartao dados={dados} />));
    expect(document.querySelectorAll('img').length).toBe(2);
  });

  it('o cronômetro reflete o tempo decorrido quando rodando (após re-render)', () => {
    let agora = 5_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => agora);

    const { rerender } = render(
      emoldura(
        <PlacarModelCartao
          dados={{
            ...dados,
            cronometro: { base: 10, rodando: true, iniciadoEm: agora },
          }}
        />,
      ),
    );
    expect(document.body.textContent).toContain('00:10');

    agora += 65_000;
    // o pai re-renderiza (mesmas props) e o tempo é recomputado a partir de Date.now
    rerender(
      emoldura(
        <PlacarModelCartao
          dados={{
            ...dados,
            cronometro: { base: 10, rodando: true, iniciadoEm: 5_000_000 },
          }}
        />,
      ),
    );
    expect(document.body.textContent).toContain('01:15');
  });

  it('reflete a mudança de gols ao alterar as props (inclusive a animação)', () => {
    const { rerender } = render(emoldura(<PlacarModelCartao dados={dados} />));
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(() =>
      rerender(emoldura(<PlacarModelCartao dados={{ ...dados, golsCasa: 3 }} />)),
    ).not.toThrow();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

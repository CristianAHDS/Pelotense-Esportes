import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { PreJogoCartao } from './PreJogoCartao';
import { formatarTempo, segundosRestantes } from '../store/preJogoStore';

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function emoldura(el) {
  return <ThemeProvider theme={theme}>{el}</ThemeProvider>;
}

const dadosBase = {
  timeCasa: { nome: 'PELOTAS', escudo: '/escudos/PEL.png' },
  timeVisitante: { nome: 'BRASIL', escudo: '/escudos/BRA.png' },
  cronometro: { inicio: null },
};

describe('preJogoStore — formatarTempo', () => {
  it('formata minutos e segundos', () => {
    expect(formatarTempo(0)).toBe('00:00');
    expect(formatarTempo(65)).toBe('01:05');
    expect(formatarTempo(3599)).toBe('59:59');
  });

  it('inclui horas quando houver', () => {
    expect(formatarTempo(3600)).toBe('1:00:00');
    expect(formatarTempo(3661)).toBe('1:01:01');
  });

  it('não deixa segundosRestantes ir abaixo de zero', () => {
    expect(segundosRestantes({ inicio: Date.now() - 5000 })).toBe(0);
  });
});

describe('preJogoStore — segundosRestantes', () => {
  it('retorna 0 sem horário de início', () => {
    expect(segundosRestantes({ inicio: null })).toBe(0);
  });

  it('calcula automaticamente o tempo até o início', () => {
    let agora = 1_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => agora);

    const cron = { inicio: agora + 120_000 };
    expect(segundosRestantes(cron)).toBe(120);

    agora += 30_000; // 30s depois
    expect(segundosRestantes(cron)).toBe(90);
  });

  it('prende em 0 quando o horário de início já passou', () => {
    let agora = 1_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => agora);
    const cron = { inicio: agora + 5_000 };
    agora += 60_000;
    expect(segundosRestantes(cron)).toBe(0);
  });

  it('retorna 0 quando não há cronômetro', () => {
    expect(segundosRestantes(null)).toBe(0);
  });
});

describe('PreJogoCartao', () => {
  it('exibe "Pré-Jogo", o rótulo e o tempo formatado', () => {
    vi.useFakeTimers();
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000);
    const dados = {
      ...dadosBase,
      cronometro: { inicio: 1_000_000 + 90_000 },
    };
    render(emoldura(<PreJogoCartao dados={dados} />));
    expect(screen.getByText(/pré-jogo/i)).toBeInTheDocument();
    expect(screen.getByText(/começa em:/i)).toBeInTheDocument();
    expect(screen.getByText('01:30')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('renderiza o confronto com os escudos dos dois times', () => {
    render(emoldura(<PreJogoCartao dados={dadosBase} />));
    const imgs = document.querySelectorAll('img');
    expect(imgs.length).toBe(2);
  });

  it('atualiza o tempo ao longo do tempo (tick a cada 500ms)', () => {
    vi.useFakeTimers();
    let agora = 1_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => agora);

    const dados = {
      ...dadosBase,
      cronometro: { inicio: agora + 90_000 },
    };
    render(emoldura(<PreJogoCartao dados={dados} />));
    expect(document.body.textContent).toContain('01:30');

    agora += 10_000;
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(document.body.textContent).toContain('01:20');
  });
});

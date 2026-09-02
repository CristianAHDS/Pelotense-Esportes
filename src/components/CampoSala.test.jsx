import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { CampoSala, sanitizar, montarUrl } from './CampoSala';

function removerCliente() {
  vi.restoreAllMocks();
  vi.useRealTimers();
  Reflect.deleteProperty(navigator, 'clipboard');
  Reflect.deleteProperty(document, 'execCommand');
}

afterEach(() => {
  removerCliente();
  window.history.replaceState({}, '', '/controle');
});

function emoldura(ui) {
  return (
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/controle']}>{ui}</MemoryRouter>
    </ThemeProvider>
  );
}

describe('CampoSala — sanitizar', () => {
  it('remove acentos, maiúsculas viram minúsculas e símbolos são descartados', () => {
    expect(sanitizar('FúT#bOl A2!')).toBe('ftbola2');
    expect(sanitizar('PELOTAS')).toBe('pelotas');
    expect(sanitizar('')).toBe('');
    expect(sanitizar(null)).toBe('');
  });

  it('mantém hífen e underline e limita a 32 caracteres', () => {
    expect(sanitizar('gauchao_a2-2026')).toBe('gauchao_a2-2026');
    expect(sanitizar('a'.repeat(40)).length).toBe(32);
  });
});

describe('CampoSala — montarUrl', () => {
  beforeEach(() => {
    window.history.replaceState(
      {},
      '',
      '/controle?origem=hub&sala=antiga#topo',
    );
  });

  it('gera a URL com ?sala=<nova> (remove a sala antiga)', () => {
    const url = montarUrl('minha');
    expect(url).toBe(`${window.location.origin}/controle?sala=minha`);
  });

  it('não adiciona sufixo de sala quando a nova sala é vazia ou "padrao"', () => {
    expect(montarUrl('')).toBe(`${window.location.origin}/controle?origem=hub`);
    expect(montarUrl('padrao')).toBe(
      `${window.location.origin}/controle?origem=hub`,
    );
  });
});

describe('CampoSala — renderização', () => {
  it('exibe o rótulo Sala, o input e o botão Copiar link', () => {
    render(emoldura(<CampoSala />));
    expect(screen.getByText(/sala/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /copiar link/i }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('padrao')).toBeInTheDocument();
  });
});

describe('CampoSala — copiar link', () => {
  it('copia o URL atual e mostra "Copiado!"', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(emoldura(<CampoSala />));
    await user.click(screen.getByRole('button', { name: /copiar link/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      window.location.href,
    );
    expect(await screen.findByText(/copiado!/i)).toBeInTheDocument();
  });

  it('usa fallback execCommand quando clipboard falha', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn(() => true),
    });
    render(emoldura(<CampoSala />));
    await user.click(screen.getByRole('button', { name: /copiar link/i }));
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(await screen.findByText(/copiado!/i)).toBeInTheDocument();
  });

  it('mostra "Erro ao copiar" quando clipboard e fallback falham', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn(() => {
        throw new Error('falhou');
      }),
    });
    render(emoldura(<CampoSala />));
    await user.click(screen.getByRole('button', { name: /copiar link/i }));
    expect(await screen.findByText(/erro ao copiar/i)).toBeInTheDocument();
  });
});

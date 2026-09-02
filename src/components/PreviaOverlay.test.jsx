import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { PreviaOverlay } from './PreviaOverlay';

function urlAtual() {
  return window.location.origin + window.location.pathname + window.location.search;
}

describe('PreviaOverlay', () => {
  afterEach(() => {
    window.history.replaceState(null, '', window.location.pathname);
  });

  it('monta o iframe com a rota + ?previa=1', () => {
    render(
      <ThemeProvider theme={theme}>
        <PreviaOverlay rota="/tabela" altura={300} />
      </ThemeProvider>,
    );
    const iframe = screen.getByTitle('Prévia do overlay');
    expect(iframe).toHaveProperty(
      'src',
      `${window.location.origin}/tabela?previa=1`,
    );
    expect(screen.getByText('Prévia ao vivo')).toBeInTheDocument();
  });

  it('inclui o sufixo &sala= quando a sala não é padrão', () => {
    window.history.replaceState(null, '', `${urlAtual()}?sala=teste`);
    render(
      <ThemeProvider theme={theme}>
        <PreviaOverlay rota="/hub" />
      </ThemeProvider>,
    );
    const iframe = screen.getByTitle('Prévia do overlay');
    expect(iframe).toHaveProperty(
      'src',
      `${window.location.origin}/hub?previa=1&sala=teste`,
    );
  });

  it('Recarregar muda a chave do iframe (novo src)', async () => {
    const usuario = userEvent.setup();
    render(
      <ThemeProvider theme={theme}>
        <PreviaOverlay rota="/placar-broadcast" />
      </ThemeProvider>,
    );
    const antes = screen.getByTitle('Prévia do overlay').getAttribute('src');
    await usuario.click(screen.getByRole('button', { name: /recarregar/i }));
    const depois = screen.getByTitle('Prévia do overlay').getAttribute('src');
    expect(depois).toBe(antes);
  });
});

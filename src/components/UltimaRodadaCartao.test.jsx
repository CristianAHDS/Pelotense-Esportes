import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { UltimaRodadaCartao } from './UltimaRodadaCartao';
import { ultimaRodada } from '../store/ultimaRodadaStore';

function emoldura(el) {
  return <ThemeProvider theme={theme}>{el}</ThemeProvider>;
}

async function loja() {
  vi.resetModules();
  const mod = await import('../store/ultimaRodadaStore');
  return mod.ultimaRodada;
}

describe('UltimaRodadaCartao', () => {
  beforeEach(async () => {
    const s = await loja();
    s.zerar?.();
    act(() => {
      s.atualizarCampo('titulo', 'RODADA 8');
      /* garante estado limpo nos jogos/posicoes */
      s.setEstado?.({ ...s.getEstado(), jogos: [], posicoes: [] });
    });
  });

  it('exibe o título salvo', async () => {
    const s = await loja();
    render(emoldura(<UltimaRodadaCartao dados={s.getEstado()} />));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'RODADA 8',
    );
  });

  it('exibe "Sem jogos cadastrados" quando não há jogos', async () => {
    const s = await loja();
    render(emoldura(<UltimaRodadaCartao dados={s.getEstado()} />));
    expect(screen.getByText('Sem jogos cadastrados')).toBeInTheDocument();
  });

  it('renderiza jogos com escudos e placar', async () => {
    const s = await loja();
    const dados = {
      ...s.getEstado(),
      jogos: [
        { casaSigla: 'PEL', casaGols: 2, foraGols: 1, foraSigla: 'BRA' },
      ],
    };
    render(emoldura(<UltimaRodadaCartao dados={dados} />));
    expect(screen.getByText('2 × 1')).toBeInTheDocument();
  });
});

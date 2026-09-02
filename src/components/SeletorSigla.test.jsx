import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SeletorSigla, SIGLAS_PADRAO } from './SeletorSigla';

describe('SeletorSigla', () => {
  it('renderiza o placeholder e todas as siglas padrão', () => {
    render(<SeletorSigla />);
    expect(screen.getByRole('option', { name: 'SIGLA' })).toBeInTheDocument();
    for (const s of SIGLAS_PADRAO) {
      expect(screen.getByRole('option', { name: s })).toBeInTheDocument();
    }
  });

  it('inclui o valor atual na lista quando não é padrão', () => {
    render(<SeletorSigla value="XYZ" />);
    expect(screen.getByRole('option', { name: 'XYZ' })).toBeInTheDocument();
  });

  it('chama onChange com o valor selecionado', async () => {
    const onChange = vi.fn();
    const usuario = userEvent.setup();
    render(<SeletorSigla onChange={onChange} />);

    await usuario.selectOptions(screen.getByRole('combobox'), 'PEL');
    expect(onChange).toHaveBeenCalledWith('PEL');
  });

  it('normaliza o valor atual em maiúsculas', () => {
    render(<SeletorSigla value="pel" />);
    expect(screen.getByRole('combobox')).toHaveValue('PEL');
  });
});

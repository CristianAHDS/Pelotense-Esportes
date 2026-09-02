import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CoresFixas } from './CoresFixas';

const CORES = [
  { fundo: '#008F3D', nome: 'Verde' },
  { fundo: '#dc2626', nome: 'Vermelho' },
  { fundo: '#e5e5e5', nome: 'Branco' },
];

describe('CoresFixas', () => {
  it('renderiza um botão por cor do preset', () => {
    render(<CoresFixas onChange={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(12);
  });

  it('marca como ativa a cor correspondente ao valor', () => {
    render(<CoresFixas valor="#dc2626" onChange={() => {}} />);
    const vermelho = screen.getByRole('button', { name: 'Vermelho' });
    expect(vermelho).toHaveStyle('border-color: #fff');
  });

  it('chama onChange com a cor ao clicar', async () => {
    const onChange = vi.fn();
    const usuario = userEvent.setup();
    render(<CoresFixas onChange={onChange} />);
    await usuario.click(screen.getByRole('button', { name: 'Verde' }));
    expect(onChange).toHaveBeenCalledWith('#008F3D');
  });
});

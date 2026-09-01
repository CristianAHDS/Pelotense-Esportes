import styled from 'styled-components'
import { useTema } from '../hooks/useTema.jsx'

const Botao = styled.button`
  position: fixed;
  top: 16px;
  right: ${({ $aoLado }) => ($aoLado ? '180px' : '16px')};
  z-index: 40;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #0a0f00;
  background: ${({ theme }) => theme.cores.primaria};
  border: none;
  border-radius: 999px;
  padding: 9px 18px;
  cursor: pointer;
  box-shadow: 0 10px 26px -12px rgba(165, 239, 28, 0.7);
  transition:
    transform 0.12s ease,
    opacity 0.12s ease;

  &:hover {
    transform: translateY(-1px);
  }
`

export function BotaoAlternarTema({ aoLado }) {
  const { escuro, alternarTema } = useTema()

  return (
    <Botao onClick={alternarTema} $aoLado={aoLado}>
      {escuro ? '☀ Tema claro' : '☾ Tema escuro'}
    </Botao>
  )
}

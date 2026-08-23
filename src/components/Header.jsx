import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { LOGO_URL } from '../theme'
import { CampoSala } from './CampoSala'

const Barra = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 32px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.fundoClaro};
`

const Logo = styled.img`
  width: 44px;
  height: 44px;
  object-fit: contain;
`

const Titulo = styled(Link)`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.cores.texto};
  text-decoration: none;

  span {
    color: ${({ theme }) => theme.cores.primaria};
  }
`

const Subtitulo = styled.span`
  margin-left: auto;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};

  @media (max-width: 640px) {
    display: none;
  }
`

const VoltarHome = styled(Link)`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.superficie};
  color: ${({ theme }) => theme.cores.textoSuave};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.cores.primaria};
    border-color: rgba(165, 239, 28, 0.45);
    background: rgba(165, 239, 28, 0.08);
  }

  @media (max-width: 640px) {
    padding: 7px 13px;
  }
`

export function Header({ subtitulo, voltar }) {
  return (
    <Barra>
      <Logo src={LOGO_URL} alt="Pelotense Esportes" />
      <Titulo to="/hub">
        PELOTENSE <span>ESPORTES</span>
      </Titulo>
      <CampoSala />
      {subtitulo && <Subtitulo>{subtitulo}</Subtitulo>}
      {voltar && <VoltarHome to="/hub">← Voltar ao hub</VoltarHome>}
    </Barra>
  )
  }

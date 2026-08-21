import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { LOGO_URL } from '../theme'

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

export function Header({ subtitulo }) {
  return (
    <Barra>
      <Logo src={LOGO_URL} alt="Pelotense Esportes" />
      <Titulo to="/">
        PELOTENSE <span>ESPORTES</span>
      </Titulo>
      {subtitulo && <Subtitulo>{subtitulo}</Subtitulo>}
    </Barra>
  )
}

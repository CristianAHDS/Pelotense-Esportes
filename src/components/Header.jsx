import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { LOGO_URL } from '../theme'
import { CampoSala } from './CampoSala'
import { useControleRemoto } from '../hooks/useControleRemoto'
import { nuvemAtiva } from '../lib/sincronizacaoNuvem'

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

const PilulaControle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid ${({ $modo }) => ($modo === 'bloqueado' ? 'rgba(251, 191, 36, 0.5)' : 'rgba(165, 239, 28, 0.4)')};
  background: ${({ $modo }) => ($modo === 'bloqueado' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(165, 239, 28, 0.08)')};
  color: ${({ $modo }) => ($modo === 'bloqueado' ? '#fbbf24' : 'rgba(165, 239, 28, 0.9)')};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  white-space: nowrap;

  @media (max-width: 900px) {
    display: none;
  }
`

const BotaoAssumir = styled.button`
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid rgba(251, 191, 36, 0.6);
  background: transparent;
  color: #fbbf24;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: #0a0f00;
    background: #fbbf24;
  }
`

function StatusControle() {
  const location = useLocation()
  const passivo = location.pathname === '/hub' || location.pathname === '/'
  const { status, assumir } = useControleRemoto({ autoReivindicar: !passivo })
  if (passivo || !nuvemAtiva()) return null
  if (status === 'ativo') {
    return <PilulaControle $modo="ativo">● Você controla</PilulaControle>
  }
  if (status === 'bloqueado') {
    return (
      <PilulaControle $modo="bloqueado">
        Outro dispositivo controla
        <BotaoAssumir type="button" onClick={assumir}>
          Assumir
        </BotaoAssumir>
      </PilulaControle>
    )
  }
  return null
}

export function Header({ subtitulo, voltar }) {
  return (
    <Barra>
      <Logo src={LOGO_URL} alt="Pelotense Esportes" />
      <Titulo to="/hub">
        PELOTENSE <span>ESPORTES</span>
      </Titulo>
      <CampoSala />
      <StatusControle />
      {subtitulo && <Subtitulo>{subtitulo}</Subtitulo>}
      {voltar && <VoltarHome to="/hub">← Voltar ao hub</VoltarHome>}
    </Barra>
  )
}

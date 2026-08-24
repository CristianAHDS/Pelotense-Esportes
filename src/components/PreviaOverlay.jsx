import { useState } from 'react'
import styled from 'styled-components'
import { salaAtual } from '../lib/sincronizacaoNuvem'

const VERDE = '#a5ef1c';

const Quadro = styled.section`
  margin-top: 18px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.cores.fundo};
`;

const Barra = styled.header`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
`;

const Ponto = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${VERDE};
  box-shadow: 0 0 8px rgba(165, 239, 28, 0.7);
  animation: pulsar 1.6s ease-in-out infinite;

  @keyframes pulsar {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
`;

const Recarregar = styled.button`
  margin-left: auto;
  padding: 3px 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background: transparent;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    color: ${VERDE};
    border-color: rgba(165, 239, 28, 0.45);
  }
`;

const Tela = styled.iframe`
  display: block;
  width: 100%;
  height: ${({ $altura }) => $altura}px;
  border: 0;
  background: repeating-conic-gradient(#111 0% 25%, #0a0a0a 0% 50%) 0 0 / 24px 24px;
`;

/* Prévia ao vivo do overlay embutida no próprio controle.
   O iframe apenas escuta o estado da sala — nunca publica. */
export function PreviaOverlay({ rota, altura = 360 }) {
  const [chave, setChave] = useState(0);
  const sala = salaAtual();
  const sufixoSala = sala && sala !== 'padrao' ? `&sala=${sala}` : '';

  return (
    <Quadro>
      <Barra>
        <Ponto />
        Prévia ao vivo
        <Recarregar type="button" onClick={() => setChave((k) => k + 1)}>
          ↻ Recarregar
        </Recarregar>
      </Barra>
      <Tela
        key={chave}
        src={`${window.location.origin}${rota}?previa=1${sufixoSala}`}
        $altura={altura}
        title="Prévia do overlay"
      />
    </Quadro>
  );
}

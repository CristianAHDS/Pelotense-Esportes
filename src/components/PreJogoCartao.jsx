import { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Escudo } from './Escudo';
import { segundosRestantes, formatarTempo } from '../store/preJogoStore';

const VERDE = '#a5ef1c';

const Shell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(16px, 3vw, 32px);

  padding: clamp(14px, 2.5vw, 22px) clamp(18px, 3vw, 28px);
  border-radius: 14px;

  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;

    opacity: 0.85;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Titulo = styled.h2`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(3.4rem, 4vw, 2rem);
  font-weight: 800;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: #fff;
  line-height: 1;
  text-shadow: 0 0 18px rgba(0, 0, 0, 0.5);
`;

const LinhaComeca = styled.div`
  display: flex;
  align-items: center;

  gap: clamp(8px, 2vw, 14px);
`;

const Rotulo = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(1.15rem, 2vw, 0.9rem);
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  text-shadow: 0 0 18px rgba(0, 0, 0, 0.5);
`;

const TimerBloco = styled.div`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-variant-numeric: tabular-nums;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 800;
  letter-spacing: 2px;
  color: #0a0f00;
  background: ${VERDE};
  border-radius: 8px;
  padding: 5px 14px;
  box-shadow: 0 0 18px rgba(165, 239, 28, 0.35);
  white-space: nowrap;
  width: 120px;
  text-align: center;
`;

const Confronto = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(6px, 1.5vw, 12px);
  flex-shrink: 0;
`;

const EscudoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Vs = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(5rem, 2vw, 1rem);
  font-weight: 800;
  color: #fff;
  opacity: 0.9;
`;

export const PreJogoCartao = forwardRef(function PreJogoCartao({ dados }, ref) {
  const [, tick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => tick((t) => t + 1), 500);
    return () => clearInterval(i);
  }, []);

  const restante = segundosRestantes(dados.cronometro);
  const tempo = formatarTempo(restante);

  return (
    <Shell ref={ref}>
      <Info>
        <Titulo>Pré-Jogo</Titulo>
        <LinhaComeca>
          <Rotulo>Começa em:</Rotulo>
          <TimerBloco>{tempo}</TimerBloco>
        </LinhaComeca>
      </Info>

      <Confronto>
        <EscudoWrapper>
          <Escudo
            cor="#a5ef1c"
            sigla={dados.timeCasa.nome}
            url={dados.timeCasa.escudo}
            tamanho={100}
          />
        </EscudoWrapper>
        <Vs>×</Vs>
        <EscudoWrapper>
          <Escudo
            cor="#a5ef1c"
            sigla={dados.timeVisitante.nome}
            url={dados.timeVisitante.escudo}
            tamanho={100}
          />
        </EscudoWrapper>
      </Confronto>
    </Shell>
  );
});

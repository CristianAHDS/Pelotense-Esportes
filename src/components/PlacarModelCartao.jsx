import styled, { keyframes } from 'styled-components';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Escudo } from './Escudo';
import { segundosAtuais, formatarTempo } from '../store/placarModelStore';

const VERDE = '#a5ef1c';

function hexParaRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const pulsoGlow = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const glisseScore = keyframes`
  from { transform: scale(1.35); }
  to { transform: scale(1); }
`;

const entrar = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: none; }
`;

const Shell = styled.div`
  position: relative;
  width: min(560px, 100%);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(10, 10, 10, 0.55);
  backdrop-filter: blur(16px) saturate(1.35);
  -webkit-backdrop-filter: blur(16px) saturate(1.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 3px 22px rgba(0, 0, 0, 0.55),
    inset 0 0 0 1px rgba(255, 255, 255, 0.02);
`;

const GlowOrb = styled.div`
  position: absolute;
  inset: -16px;
  z-index: -1;
  border-radius: 18px;
  background: radial-gradient(
    ellipse at 50% 50%,
    ${({ $c }) => hexParaRgba($c, 0.12)},
    transparent 70%
  );
  filter: blur(16px);
  pointer-events: none;
  animation: ${pulsoGlow} 3s ease-in-out infinite;
`;

const FaixaCor = styled.div`
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    ${({ $a }) => $a} 18%,
    ${VERDE} 50%,
    ${({ $b }) => $b} 82%,
    transparent
  );
  opacity: 0.75;
`;

const Corpo = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(8px, 2vw, 16px);
  padding: clamp(10px, 2vw, 16px) clamp(14px, 3vw, 22px);
`;

const Equipe = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(6px, 1.5vw, 10px);
  min-width: 0;

  &.visitante {
    flex-direction: row-reverse;
  }
`;

const Sigla = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(0.9rem, 2.4vw, 1.15rem);
  font-weight: 700;
  letter-spacing: 2px;
  color: #fff;
  white-space: nowrap;
`;

const GolNum = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-variant-numeric: tabular-nums;
  font-size: clamp(1.5rem, 4vw, 2.1rem);
  font-weight: 700;
  line-height: 1;
  min-width: 1.1em;
  text-align: center;
  color: #fff;
  ${({ $a }) => $a && `animation: ${glisseScore} 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);`}
`;

const Divisor = styled.span`
  width: 1px;
  align-self: stretch;
  margin: 0 clamp(2px, 1vw, 6px);
  background: linear-gradient(
    180deg,
    transparent,
    rgba(255, 255, 255, 0.16),
    transparent
  );
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
`;

const Crono = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-variant-numeric: tabular-nums;
  font-size: clamp(0.95rem, 2.4vw, 1.15rem);
  font-weight: 700;
  letter-spacing: 1.5px;
  color: ${({ $r }) => ($r ? VERDE : 'rgba(255,255,255,0.55)')};
  transition: color 0.3s ease;
`;

const PontoVivo = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $r }) => ($r ? '#ef4444' : 'rgba(255,255,255,0.25)')};
  box-shadow: ${({ $r }) => ($r ? '0 0 7px rgba(239,68,68,0.6)' : 'none')};
  animation: ${({ $r }) => ($r ? pulsoGlow : 'none')} 1.2s ease-in-out infinite;
`;

const PeriodoTag = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(0.6rem, 1.5vw, 0.72rem);
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 3px 9px;
  border-radius: 6px;
  animation: ${entrar} 0.3s ease;
`;

function rotuloStatus(estadoPartida, periodo) {
  if (estadoPartida === 'INÍCIO' || estadoPartida === 'AO VIVO') {
    return periodo;
  }
  return estadoPartida === 'INTERVALO' ? 'INT' : estadoPartida === 'ENCERRADO' ? 'FT' : periodo;
}

/* Componente parametrizado: dados espera
   { timeCasa, timeVisitante, golsCasa, golsVisitante, cronometro,
     periodo, estadoPartida, corCasa, corVisitante, mostrarEscudos } */
export const PlacarModelCartao = forwardRef(function PlacarModelCartao(
  { dados },
  ref
) {
  const { timeCasa, timeVisitante } = dados;
  const [animC, setAnimC] = useState(false);
  const [animV, setAnimV] = useState(false);
  const prevC = useRef(dados.golsCasa);
  const prevV = useRef(dados.golsVisitante);

  useEffect(() => {
    if (dados.golsCasa !== prevC.current) {
      prevC.current = dados.golsCasa;
      setAnimC(true);
      const t = setTimeout(() => setAnimC(false), 380);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [dados.golsCasa]);

  useEffect(() => {
    if (dados.golsVisitante !== prevV.current) {
      prevV.current = dados.golsVisitante;
      setAnimV(true);
      const t = setTimeout(() => setAnimV(false), 380);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [dados.golsVisitante]);

  const aoVivo = Boolean(dados.cronometro?.rodando);
  const tempo = formatarTempo(segundosAtuais(dados.cronometro));
  const corGlow = aoVivo ? VERDE : 'rgba(255,255,255,0.12)';
  const rotulo = rotuloStatus(dados.estadoPartida, dados.periodo);

  return (
    <Shell ref={ref}>
      {aoVivo && <GlowOrb $c={corGlow} />}
      <FaixaCor $a={dados.corCasa} $b={dados.corVisitante} />
      <Corpo>
        <Equipe>
          {dados.mostrarEscudos !== false && (
            <Escudo
              cor={dados.corCasa}
              sigla={timeCasa.nome}
              url={timeCasa.escudo}
              tamanho={26}
            />
          )}
          <Sigla>{timeCasa.nome}</Sigla>
          <GolNum $a={animC}>{dados.golsCasa}</GolNum>
        </Equipe>

        <Divisor />

        <Equipe className="visitante">
          {dados.mostrarEscudos !== false && (
            <Escudo
              cor={dados.corVisitante}
              sigla={timeVisitante.nome}
              url={timeVisitante.escudo}
              tamanho={26}
            />
          )}
          <Sigla>{timeVisitante.nome}</Sigla>
          <GolNum $a={animV}>{dados.golsVisitante}</GolNum>
        </Equipe>

        <Meta>
          <PontoVivo $r={aoVivo} />
          <Crono $r={aoVivo}>{tempo}</Crono>
          <PeriodoTag>{rotulo}</PeriodoTag>
        </Meta>
      </Corpo>
    </Shell>
  );
});
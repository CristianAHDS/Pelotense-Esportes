import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import {
  getEstado,
  inscrever,
  definirTime,
  definirDuracao,
  alternarCronometro,
  zerarCronometro,
  mostrar,
  ocultar,
  resetar,
  segundosRestantes,
  formatarTempo,
} from '../store/preJogoStore';
import { SeletorSigla } from './SeletorSigla';

const LOJA = { getEstado, inscrever };

const DURACOES_MIN = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];

const Cartao = styled.section`
  background: #0d0d0d;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  padding: 24px;
`;

const Titulo = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 18px;

  span {
    color: #a5ef1c;
  }
`;

const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 22px;
`;

const SecaoTitulo = styled.h3`
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
`;

const Rotulo = styled.span`
  display: block;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 7px;
`;

const Entrada = styled.input`
  width: 100%;
  min-width: 0;
  background: #000;
  border: 1px solid #262626;
  border-radius: 8px;
  padding: 9px 10px;
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: border-color 120ms ease;

  &:focus {
    outline: none;
    border-color: #a5ef1c;
  }
`;

const BlocoTime = styled.div`
  background: #000;
  border: 1px solid #262626;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DisplayTempo = styled.div`
  text-align: center;
  font-family: 'Rajdhani', sans-serif;
  font-variant-numeric: tabular-nums;
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${({ $rodando }) => ($rodando ? '#a5ef1c' : 'rgba(255,255,255,0.55)')};
  background: #000;
  border: 1px solid #262626;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 14px;
`;

const ListaChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
`;

const Chip = styled.button`
  background: ${({ $ativo }) => ($ativo ? '#a5ef1c' : '#000')};
  border: 1px solid ${({ $ativo }) => ($ativo ? '#a5ef1c' : '#333')};
  color: ${({ $ativo }) => ($ativo ? '#0a0f00' : '#94a3b8')};
  border-radius: 999px;
  padding: 8px 14px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 120ms ease;

  &:hover {
    border-color: #a5ef1c;
    color: ${({ $ativo }) => ($ativo ? '#0a0f00' : '#a5ef1c')};
  }
`;

const GradeBotoes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const Botao = styled.button`
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    filter 120ms ease,
    border-color 120ms ease;

  ${({ $primario }) =>
    $primario
      ? `
    background: #a5ef1c;
    color: #0a0f00;
    &:hover { filter: brightness(1.08); }
  `
      : `
    background: transparent;
    border-color: #333;
    color: #ddd;
    &:hover { border-color: #a5ef1c; color: #a5ef1c; }
  `}
`;

export function PainelPreJogo() {
  const estado = usePlacarBroadcast(LOJA);
  const [, tick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => tick((t) => t + 1), 500);
    return () => clearInterval(i);
  }, []);
  const rodando = Boolean(estado.cronometro?.rodando);
  const restante = segundosRestantes(estado.cronometro);

  return (
    <Cartao>
      <Titulo>
        <span>●</span> Pré-Jogo
      </Titulo>
      <Grade>
        <div>
          <SecaoTitulo>Timer</SecaoTitulo>
          <DisplayTempo $rodando={rodando}>
            {formatarTempo(restante)}
          </DisplayTempo>
          <Rotulo>Duração (minutos)</Rotulo>
          <ListaChips>
            {DURACOES_MIN.map((m) => (
              <Chip key={m} onClick={() => definirDuracao(m * 60)}>
                {m} min
              </Chip>
            ))}
          </ListaChips>
          <GradeBotoes>
            <Botao $primario onClick={alternarCronometro}>
              {rodando ? '⏸ Pausar' : '▶ Iniciar'}
            </Botao>
            <Botao onClick={zerarCronometro} disabled={rodando}>
              ⟲ Zerar
            </Botao>
          </GradeBotoes>
        </div>

        <div>
          <SecaoTitulo>Times e escudos</SecaoTitulo>
          {[
            { lado: 'casa', time: estado.timeCasa, titulo: 'Time da casa' },
            {
              lado: 'visitante',
              time: estado.timeVisitante,
              titulo: 'Time visitante',
            },
          ].map(({ lado, time, titulo }) => (
            <BlocoTime key={lado}>
              <Rotulo>{titulo} (sigla)</Rotulo>
              <SeletorSigla
                value={time.nome}
                onChange={(v) => definirTime(lado, v)}
              />
            </BlocoTime>
          ))}
        </div>
      </Grade>

      <GradeBotoes style={{ marginTop: 22 }}>
        <Botao $primario onClick={mostrar}>
          Mostrar overlay
        </Botao>
        <Botao onClick={ocultar}>Ocultar overlay</Botao>
        <Botao onClick={resetar}>Resetar</Botao>
      </GradeBotoes>
    </Cartao>
  );
}

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CoresFixas } from '../components/CoresFixas';
import { Header } from '../components/Header';
import { usePlacarPro } from '../hooks/usePlacarPro';
import {
  gol,
  renomearTime,
  alternarCronometro,
  zerarCronometro,
  ajustarMinutos,
  definirPeriodo,
  resetarPartida,
  definirCorTime,
  segundosAtuais,
  formatarTempo,
} from '../store/placarProStore';

const PERIODOS = [
  '1º TEMPO',
  'INTERVALO',
  '2º TEMPO',
  'PRORROGAÇÃO',
  'PÊNALTIS',
  'ENCERRADO',
];

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Conteudo = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  align-content: start;
`;

const Painel = styled.section`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 16px;
  padding: 24px;
`;

const PainelTitulo = styled.h2`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::after {
    content: '';
  flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.cores.borda};
  }
`;

const BlocoTime = styled.div`
  background: ${({ theme }) => theme.cores.fundoClaro};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Rotulo = styled.label`
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-bottom: 8px;
`;

const EntradaNome = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  padding: 12px 14px;
  color: ${({ theme }) => theme.cores.texto};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.cores.primaria};
  }
`;

const LinhaGols = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
`;

const Numero = styled.div`
  flex: 1;
  text-align: center;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
`;

const Botao = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition:
    filter 0.15s ease,
    background 0.15s ease,
    transform 0.05s ease;

  &:active {
    transform: scale(0.97);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &.gol {
    background: ${({ theme }) => theme.cores.primaria};
    color: #0a0f00;
    &:hover {
      filter: brightness(1.1);
  }
  }

  &.redondo {
    width: 46px;
    height: 46px;
    padding: 0;
    font-size: 1.3rem;
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  color: ${({ theme }) => theme.cores.texto};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.cores.superficieHover};
  }
  }

  &.primario {
    background: ${({ theme }) => theme.cores.primaria};
    color: #0a0f00;
    &:hover {
      filter: brightness(1.1);
  }
  }

  &.perigo {
    background: transparent;
    border: 1px solid ${({ theme }) => theme.cores.perigo};
    color: ${({ theme }) => theme.cores.perigo};
    &:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.12);
  }
  }

  &.neutro {
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  color: ${({ theme }) => theme.cores.texto};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.cores.superficieHover};
  }
  }
`;

const DisplayTempo = styled.div`
  text-align: center;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-variant-numeric: tabular-nums;
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${({ $rodando, theme }) =>
    $rodando ? theme.cores.primaria : theme.cores.textoSuave};
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const GradeBotoes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const ListaPeriodos = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ChipPeriodo = styled.button`
  background: ${({ $ativo, theme }) =>
    $ativo ? theme.cores.primaria : theme.cores.fundo};
  border: 1px solid
    ${({ $ativo, theme }) =>
      $ativo ? theme.cores.primaria : theme.cores.borda};
  color: ${({ $ativo }) => ($ativo ? '#0a0f00' : '#94a3b8')};
  border-radius: 999px;
  padding: 9px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 0.15s ease;
    &:hover:not(:disabled) {
    ${({ $ativo, theme }) =>
      $ativo
        ? ''
        : `background: ${theme.cores.superficieHover}; color: ${theme.cores.texto};`}
  }
`;

const AvisoReset = styled.p`
  margin-top: 14px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.cores.textoSuave};
  line-height: 1.5;
`;

const CorInput = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  cursor: pointer;
  margin-top: 12px;

  span {
    font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  }

  input {
    width: 28px;
    height: 28px;
  border: none;
    border-radius: 6px;
    padding: 0;
    background: transparent;
  cursor: pointer;
    &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
    &::-webkit-color-swatch {
  border: none;
    border-radius: 6px;
  }
  }
`;

function PainelTimes() {
  const estado = usePlacarPro();

  const configuracoes = [
    {
      lado: 'casa',
      time: estado.timeCasa,
      titulo: 'Time da casa',
      cor: estado.corCasa,
    },
    {
      lado: 'visitante',
      time: estado.timeVisitante,
      titulo: 'Time visitante',
      cor: estado.corVisitante,
    },
];

  return (
    <Painel>
      <PainelTitulo>⚽ Times e Placar</PainelTitulo>
      {configuracoes.map(({ lado, time, titulo, cor }) => (
        <BlocoTime key={lado}>
          <Rotulo>{titulo}</Rotulo>
          <EntradaNome
            value={time.nome}
            placeholder="NOME DO TIME"
            onChange={(e) => renomearTime(lado, e.target.value)}
          />
          <LinhaGols>
            <Botao
              className="redondo"
              onClick={() => gol(lado, -1)}
              disabled={time.gols === 0}
            >
              −
            </Botao>
            <Numero>{time.gols}</Numero>
            <Botao className="redondo" onClick={() => gol(lado, +1)}>
              +
            </Botao>
            <Botao className="gol" onClick={() => gol(lado, +1)}>
              ⚽ GOL
            </Botao>
          </LinhaGols>
          <CorInput>
            <CoresFixas
              valor={cor}
              onChange={(v) => definirCorTime(lado, v)}
            />
            <span>Cor do time</span>
          </CorInput>
        </BlocoTime>
      ))}
    </Painel>
  );
  }

function PainelCronometro() {
  const estado = usePlacarPro();
  const [, forcarTick] = useState(0);
  const cron = estado.cronometro;

  useEffect(() => {
    const intervalo = setInterval(() => forcarTick((t) => t + 1), 500);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <Painel>
      <PainelTitulo>⏱️ Cronômetro</PainelTitulo>
      <DisplayTempo $rodando={cron.rodando}>
        {formatarTempo(segundosAtuais(cron))}
      </DisplayTempo>
      <GradeBotoes>
            <Botao
          className={cron.rodando ? 'perigo' : 'primario'}
          onClick={alternarCronometro}
            >
          {cron.rodando ? '⏸ Pausar' : '▶ Iniciar'}
            </Botao>
            <Botao
          className="neutro"
          onClick={zerarCronometro}
          disabled={cron.rodando}
            >
          ⟲ Zerar
            </Botao>
        <Botao className="neutro" onClick={() => ajustarMinutos(-1)}>
          − 1 min
            </Botao>
        <Botao className="neutro" onClick={() => ajustarMinutos(+1)}>
          + 1 min
            </Botao>
      </GradeBotoes>
    </Painel>
  );
  }

function PainelPartida() {
  const estado = usePlacarPro();
  const [confirmar, setConfirmar] = useState(false);

  function handleReset() {
    if (!confirmar) {
      setConfirmar(true);
      setTimeout(() => setConfirmar(false), 4000);
      return;
  }
    resetarPartida();
    setConfirmar(false);
  }

  return (
    <Painel>
      <PainelTitulo>📋 Partida</PainelTitulo>
      <Rotulo>Período do jogo</Rotulo>
      <ListaPeriodos>
        {PERIODOS.map((periodo) => (
          <ChipPeriodo
            key={periodo}
            $ativo={estado.periodo === periodo}
            onClick={() => definirPeriodo(periodo)}
            >
            {periodo}
          </ChipPeriodo>
      ))}
      </ListaPeriodos>
      <div style={{ marginTop: 20 }}>
            <Botao
          className="perigo"
          style={{ width: '100%' }}
          onClick={handleReset}
            >
          {confirmar
            ? '⚠ Clique novamente para confirmar'
            : '🗑 Resetar partida inteira'}
            </Botao>
        <AvisoReset>
          Zera gols, cronômetro e período. Os nomes dos times também voltam ao
          padrão.
        </AvisoReset>
      </div>
    </Painel>
  );
  }

export default function ControlePlacarPro() {
  return (
    <Container>
      <Header subtitulo="Controle · Placar Profissional" />
      <Conteudo>
        <PainelTimes />
        <div style={{ display: 'grid', gap: 24 }}>
          <PainelCronometro />
          <PainelPartida />
      </div>
      </Conteudo>
    </Container>
  );
  }

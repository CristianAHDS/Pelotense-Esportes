import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Header } from '../components/Header';
import { PainelSubstituicao } from '../components/PainelSubstituicao';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import {
  getEstado,
  inscrever,
  gol,
  renomearTime,
  alternarCronometro,
  zerarCronometro,
  ajustarSegundos,
  definirPeriodo,
  definirAcrescimo,
  definirEstadoPartida,
  definirCorTime,
  definirCorPreset,
  CORES_PRESET,
  darCartao,
  removerCartao,
  resetarPartida,
  ESTADOS_PARTIDA,
  segundosAtuais,
  formatarTempo,
} from '../store/placarBroadcastPLStore';

const PERIODOS = ['1T', '2T', 'PRORROGAÇÃO', 'PÊNALTIS'];
const ACRESCIMOS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
  max-width: 32px;
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
    color: #052e13;
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
    color: #052e13;
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

const ListaChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  background: ${({ $ativo, theme }) =>
    $ativo ? theme.cores.primaria : theme.cores.fundo};
  border: 1px solid
    ${({ $ativo, theme }) =>
      $ativo ? theme.cores.primaria : theme.cores.borda};
  color: ${({ $ativo }) => ($ativo ? '#052e13' : '#94a3b8')};
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

function corContraste(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5 ? '#000' : '#fff';
}

const PreviewBarra = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding-top: 24px;
  margin-bottom: 32px;
`;

const PreviewLinhaTempo = styled.div`
  display: flex;
  align-items: stretch;
  gap: 5px;
`;

const PreviewChipPeriodo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 14px;
  background: rgba(0, 0, 0, 0.78);
  border-radius: 7px 7px 0 0;
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #ffffff;
  text-transform: uppercase;
`;

const PreviewChipTempo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 18px;
  background: #00ff87;
  border-radius: 7px 7px 0 0;
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #001a0d;
  font-variant-numeric: tabular-nums;
`;

const PreviewChipAcrescimo = styled.div`
  position: absolute;
  left: calc(100% + 5px);
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  background: rgba(0, 0, 0, 0.78);
  border-radius: 7px 7px 0 0;
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #fbbf24;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const PreviewCorpo = styled.div`
  display: flex;
  align-items: stretch;
  overflow: hidden;
  background: linear-gradient(180deg, #47124f 0%, #38003c 100%);
  border-radius: 0 0 10px 10px;
`;

const PreviewBloco = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 150px;
  gap: 12px;
  padding: 8px 16px 10px;
  background: rgba(255, 255, 255, 0.07);
  border-bottom: 4px solid ${({ $cor }) => $cor || 'transparent'};
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #ffffff;

  .g {
    font-size: 1.35rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
`;

const PreviewSep = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.55);
  font-size: 0.85rem;
  font-weight: 800;
  color: #00ff87;
`;

const PreviewTraco = styled.span`
  display: inline-block;
  width: 14px;
  height: 4px;
  border-radius: 1px;
  background: ${({ $cor }) => ($cor === 'amarelo' ? '#eab308' : '#dc2626')};
  margin: 0 1px;
`;

const PreviewClicavel = styled.div`
  width: fit-content;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 10px;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

function PreviewLive() {
  const estado = usePlacarBroadcast({ getEstado, inscrever });
  const [, tick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => tick((t) => t + 1), 500);
    return () => clearInterval(i);
  }, []);
  const tempo = formatarTempo(segundosAtuais(estado.cronometro));

  const tc = [
    ...Array(estado.cartoesCasa?.amarelo || 0).fill('amarelo'),
    ...Array(estado.cartoesCasa?.vermelho || 0).fill('vermelho'),
  ];
  const tv = [
    ...Array(estado.cartoesVisitante?.amarelo || 0).fill('amarelo'),
    ...Array(estado.cartoesVisitante?.vermelho || 0).fill('vermelho'),
  ];

  return (
    <PreviewClicavel
      title="Abrir visualização em nova guia"
      onClick={() =>
        window.open(
          `${window.location.origin}${window.location.pathname}#/placar-pl`,
          '_blank',
        )
      }
    >
      <PreviewBarra>
        <PreviewLinhaTempo>
          <PreviewChipPeriodo>{estado.periodo}</PreviewChipPeriodo>
          <PreviewChipTempo>
            {tempo}
            {estado.acrescimo > 0 && (
              <PreviewChipAcrescimo>
                +{estado.acrescimo}:00
              </PreviewChipAcrescimo>
            )}
          </PreviewChipTempo>
        </PreviewLinhaTempo>
        <div
          style={{
            display: 'flex',
            height: 5,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {tc.map((c, i) => (
              <PreviewTraco key={`pc-${c}-${i}`} $cor={c} />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {tv.map((c, i) => (
              <PreviewTraco key={`pv-${c}-${i}`} $cor={c} />
            ))}
          </div>
        </div>
        <PreviewCorpo>
          <PreviewBloco $cor={estado.timeCasa.cor}>
            <span>{estado.timeCasa.nome}</span>
            <span className="g">{estado.timeCasa.gols}</span>
          </PreviewBloco>
          <PreviewSep>×</PreviewSep>
          <PreviewBloco $cor={estado.timeVisitante.cor}>
            <span className="g">{estado.timeVisitante.gols}</span>
            <span>{estado.timeVisitante.nome}</span>
          </PreviewBloco>
        </PreviewCorpo>
      </PreviewBarra>
    </PreviewClicavel>
  );
}

const AvisoReset = styled.p`
  margin-top: 14px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.cores.textoSuave};
  line-height: 1.5;
`;

const GradeCores = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`;

const Swatch = styled.button`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ $ativo }) => ($ativo ? '#fff' : 'transparent')};
  border-radius: 6px;
  padding: 0;
  cursor: pointer;
  background: ${({ $cor }) => $cor};
  transition:
    border-color 0.15s ease,
    transform 0.1s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
  }

  ${({ $ativo }) =>
    $ativo &&
    `
    border-color: #fff;
    box-shadow: 0 0 0 2px ${({ $cor }) => $cor};
    transform: scale(1.15);
  `}
`;

const CorInputBorda = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 6px;
  cursor: pointer;
  input {
    width: 22px;
    height: 22px;
    border: 1px solid ${({ theme }) => theme.cores.borda};
    border-radius: 4px;
    padding: 0;
    background: transparent;
    cursor: pointer;
    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    &::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }
  }
  span {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.textoSuave};
  }
`;

const LinhaCartoes = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 14px;
  align-items: center;
`;

const ContagemCartao = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.cores.textoSuave};
  min-width: 20px;
  text-align: center;
`;

const BotaoCartao = styled(Botao)`
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &.amarelo {
    background: #eab308;
    border: 1px solid #ca8a04;
    color: #000;
    font-size: 0.6rem;
    letter-spacing: 0;
  }
  &.vermelho {
    background: #dc2626;
    border: 1px solid #991b1b;
    color: #fff;
    font-size: 0.6rem;
    letter-spacing: 0;
  }
`;

const ToggleCores = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.cores.texto};
  }
`;

function PainelTimes() {
  const estado = usePlacarBroadcast({ getEstado, inscrever });
  const [coresAberto, setCoresAberto] = useState({});

  const toggle = (lado) => setCoresAberto((p) => ({ ...p, [lado]: !p[lado] }));

  const cfg = [
    {
      lado: 'casa',
      time: estado.timeCasa,
      titulo: 'Time da casa',
      cor: estado.corCasa,
      corBorda: estado.corCasaBorda,
      cartoes: estado.cartoesCasa || { amarelo: 0, vermelho: 0 },
    },
    {
      lado: 'visitante',
      time: estado.timeVisitante,
      titulo: 'Time visitante',
      cor: estado.corVisitante,
      corBorda: estado.corVisitanteBorda,
      cartoes: estado.cartoesVisitante || { amarelo: 0, vermelho: 0 },
    },
  ];
  return (
    <Painel>
      <PainelTitulo>⚽ Times e Placar</PainelTitulo>
      {cfg.map(({ lado, time, titulo, cor, corBorda, cartoes }) => (
        <BlocoTime key={lado}>
          <Rotulo>{titulo} (sigla 3 letras)</Rotulo>
          <EntradaNome
            value={time.nome}
            placeholder="PAL"
            maxLength={6}
            onChange={(e) => renomearTime(lado, e.target.value)}
          />
          <Rotulo style={{ marginTop: 10 }}>Gols</Rotulo>
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
          </LinhaGols>

          <Rotulo style={{ marginTop: 10 }}>Cartões</Rotulo>
          <LinhaCartoes>
            <Botao
              className="redondo"
              onClick={() => removerCartao(lado, 'amarelo')}
              disabled={cartoes.amarelo === 0}
            >
              −
            </Botao>
            <BotaoCartao
              className="amarelo"
              onClick={() => darCartao(lado, 'amarelo')}
            >
              █
            </BotaoCartao>
            <Botao
              className="redondo"
              onClick={() => darCartao(lado, 'amarelo')}
            >
              +
            </Botao>
            <ContagemCartao>{cartoes.amarelo}</ContagemCartao>
            <Botao
              className="redondo"
              onClick={() => removerCartao(lado, 'vermelho')}
              disabled={cartoes.vermelho === 0}
            >
              −
            </Botao>
            <BotaoCartao
              className="vermelho"
              onClick={() => darCartao(lado, 'vermelho')}
            >
              █
            </BotaoCartao>
            <Botao
              className="redondo"
              onClick={() => darCartao(lado, 'vermelho')}
            >
              +
            </Botao>
            <ContagemCartao>{cartoes.vermelho}</ContagemCartao>
          </LinhaCartoes>

          <ToggleCores onClick={() => toggle(lado)}>
            {coresAberto[lado] ? '▾' : '▸'} Cores
          </ToggleCores>
          {coresAberto[lado] && (
            <>
              <Rotulo style={{ marginTop: 8 }}>Fundo</Rotulo>
              <GradeCores>
                {CORES_PRESET.map((p) => (
                  <Swatch
                    key={'fundo-' + p.nome}
                    $cor={p.fundo}
                    $ativo={cor === p.fundo}
                    onClick={() => definirCorTime(lado, p.fundo)}
                    title={p.nome}
                  />
                ))}
              </GradeCores>
              <Rotulo style={{ marginTop: 8 }}>Borda</Rotulo>
              <GradeCores>
                {CORES_PRESET.map((p) => (
                  <Swatch
                    key={'borda-' + p.nome}
                    $cor={p.borda}
                    $ativo={corBorda === p.borda}
                    onClick={() => definirCorTime(lado, p.borda, 'borda')}
                    title={p.nome}
                  />
                ))}
              </GradeCores>
            </>
          )}
        </BlocoTime>
      ))}
    </Painel>
  );
}

function PainelCronometro() {
  const estado = usePlacarBroadcast({ getEstado, inscrever });
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
        <Botao className="neutro" onClick={() => ajustarSegundos(-30)}>
          − 30s
        </Botao>
        <Botao className="neutro" onClick={() => ajustarSegundos(+30)}>
          + 30s
        </Botao>
        <Botao className="neutro" onClick={() => ajustarSegundos(-60)}>
          − 1 min
        </Botao>
        <Botao className="neutro" onClick={() => ajustarSegundos(+60)}>
          + 1 min
        </Botao>
      </GradeBotoes>
    </Painel>
  );
}

function PainelPartida() {
  const estado = usePlacarBroadcast({ getEstado, inscrever });
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
      <Rotulo>Período</Rotulo>
      <ListaChips style={{ marginBottom: 16 }}>
        {PERIODOS.map((p) => (
          <Chip
            key={p}
            $ativo={estado.periodo === p}
            onClick={() => definirPeriodo(p)}
          >
            {p}
          </Chip>
        ))}
      </ListaChips>
      <Rotulo>Acréscimo</Rotulo>
      <ListaChips style={{ marginBottom: 16 }}>
        {ACRESCIMOS.map((m) => (
          <Chip
            key={m}
            $ativo={(estado.acrescimo || 0) === m}
            onClick={() => definirAcrescimo(m)}
          >
            {m === 0 ? 'Sem' : `+${m}:00`}
          </Chip>
        ))}
      </ListaChips>
      <Rotulo>Estado da partida</Rotulo>
      <ListaChips>
        {ESTADOS_PARTIDA.map((e) => (
          <Chip
            key={e}
            $ativo={estado.estadoPartida === e}
            onClick={() => definirEstadoPartida(e)}
          >
            {e}
          </Chip>
        ))}
      </ListaChips>
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

export default function ControlePlacarBroadcast() {
  return (
    <Container>
      <Header subtitulo="Controle · Placar Broadcast PL" />
      <PreviewLive />
      <Conteudo>
        <PainelTimes />
        <div style={{ display: 'grid', gap: 24 }}>
          <PainelCronometro />
          <PainelPartida />
          <PainelSubstituicao /><PainelPartida />
        </div>
      </Conteudo>
    </Container>
  );
}

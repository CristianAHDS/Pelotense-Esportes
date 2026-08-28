import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import {
  getEstado,
  inscrever,
  PERIODOS,
  ESTADOS_PARTIDA,
  CORES_PRESET,
  definirTime,
  gol,
  alternarCronometro,
  zerarCronometro,
  ajustarSegundos,
  definirPeriodo,
  definirEstadoPartida,
  definirAcrescimo,
  definirCorPreset,
  darCartao,
  removerCartao,
  alternarEscudos,
  resetarPartida,
  segundosAtuais,
  formatarTempo,
} from '../store/placarModelStore';
import { SeletorSigla } from './SeletorSigla';

const CORES = CORES_PRESET;

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

const LinhaGols = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const Numero = styled.span`
  max-width: 40px;
  flex: 1;
  text-align: center;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
`;

const BotaoPasso = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #333;
  background: transparent;
  color: #ddd;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 120ms ease,
    color 120ms ease;

  &:hover:not(:disabled) {
    border-color: #a5ef1c;
    color: #a5ef1c;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const GradeCores = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
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
    border-color 120ms ease,
    transform 100ms ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
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

const GradeBotoes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const LinhaCartoes = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const ContagemCartao = styled.span`
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  min-width: 16px;
  text-align: center;
`;

const BotaoCartao = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid #333;
  background: ${({ $cor }) => $cor};
  color: #000;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: filter 120ms ease;

  &:hover:not(:disabled) {
    filter: brightness(1.15);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
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

const ListaChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
`;

const GrupoAcrescimo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
`;

const EntradaNum = styled(Entrada)`
  width: 70px;
  padding: 9px 6px;
  text-align: center;
`;

const BotaoPassoAcr = styled.button`
  width: 38px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #333;
  background: transparent;
  color: #ddd;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 120ms ease,
    color 120ms ease;

  &:hover {
    border-color: #a5ef1c;
    color: #a5ef1c;
  }
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

const Aviso = styled.p`
  margin: 12px 0 0;
  font-size: 0.78rem;
  letter-spacing: 0.5px;
  color: #f59e0b;
`;

const ResetBotao = styled(Botao)`
  width: 100%;
  margin-top: 18px;
  border-color: #ef4444;
  color: #ef4444;
  background: transparent;

  &:hover {
    background: rgba(239, 68, 68, 0.12);
    border-color: #ef4444;
    color: #ef4444;
  }
`;

const LOJA = { getEstado, inscrever };

function PainelTimes() {
  const estado = usePlacarBroadcast(LOJA);
  const cfg = [
    {
      lado: 'casa',
      time: estado.timeCasa,
      cor: estado.corCasa,
      corBorda: estado.corCasaBorda,
      cartoes: estado.cartoesCasa || { amarelo: 0, vermelho: 0 },
      titulo: 'Casa',
    },
    {
      lado: 'visitante',
      time: estado.timeVisitante,
      cor: estado.corVisitante,
      corBorda: estado.corVisitanteBorda,
      cartoes: estado.cartoesVisitante || { amarelo: 0, vermelho: 0 },
      titulo: 'Visitante',
    },
  ];
  return (
    <div>
      <SecaoTitulo>Times e placar</SecaoTitulo>
      {cfg.map(({ lado, time, cor, corBorda, cartoes, titulo }) => (
        <BlocoTime key={lado}>
          <Rotulo>{titulo} (sigla)</Rotulo>
          <SeletorSigla
            value={time.nome}
            onChange={(v) => definirTime(lado, v)}
          />
          <LinhaGols>
            <BotaoPasso
              onClick={() => gol(lado, -1)}
              disabled={lado === 'casa' ? estado.golsCasa === 0 : estado.golsVisitante === 0}
            >
              −
            </BotaoPasso>
            <Numero>{lado === 'casa' ? estado.golsCasa : estado.golsVisitante}</Numero>
            <BotaoPasso onClick={() => gol(lado, 1)}>+</BotaoPasso>
          </LinhaGols>

          <Rotulo style={{ marginTop: 12 }}>Cartões</Rotulo>
          <LinhaCartoes>
            <BotaoCartao
              $cor="#eab308"
              onClick={() => removerCartao(lado, 'amarelo')}
              disabled={cartoes.amarelo === 0}
              title="Remover amarelo"
            >
              −
            </BotaoCartao>
            <ContagemCartao>{cartoes.amarelo}</ContagemCartao>
            <BotaoCartao $cor="#eab308" onClick={() => darCartao(lado, 'amarelo')} title="Amarelo">
              +
            </BotaoCartao>
            <BotaoCartao
              $cor="#ef4444"
              onClick={() => removerCartao(lado, 'vermelho')}
              disabled={cartoes.vermelho === 0}
              title="Remover vermelho"
            >
              −
            </BotaoCartao>
            <ContagemCartao>{cartoes.vermelho}</ContagemCartao>
            <BotaoCartao $cor="#ef4444" onClick={() => darCartao(lado, 'vermelho')} title="Vermelho">
              +
            </BotaoCartao>
          </LinhaCartoes>

          <Rotulo style={{ marginTop: 12 }}>Cor de destaque</Rotulo>
          <GradeCores>
            {CORES.map((c) => (
              <Swatch
                key={c.nome}
                $cor={c.fundo}
                $ativo={cor === c.fundo && corBorda === c.borda}
                title={c.nome}
                onClick={() => definirCorPreset(lado, c)}
              />
            ))}
          </GradeCores>
        </BlocoTime>
      ))}
    </div>
  );
}

function PainelCronometro() {
  const estado = usePlacarBroadcast(LOJA);
  const [, tick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => tick((t) => t + 1), 500);
    return () => clearInterval(i);
  }, []);
  const rodando = Boolean(estado.cronometro?.rodando);
  return (
    <div>
      <SecaoTitulo>Cronômetro</SecaoTitulo>
      <DisplayTempo $rodando={rodando}>
        {formatarTempo(segundosAtuais(estado.cronometro))}
      </DisplayTempo>
      <GradeBotoes>
        <Botao $primario onClick={alternarCronometro}>
          {rodando ? '⏸ Pausar' : '▶ Iniciar'}
        </Botao>
        <Botao onClick={zerarCronometro} disabled={rodando}>
          ⟲ Zerar
        </Botao>
        <Botao onClick={() => ajustarSegundos(-30)}>− 30s</Botao>
        <Botao onClick={() => ajustarSegundos(30)}>+ 30s</Botao>
        <Botao onClick={() => ajustarSegundos(-60)}>− 1 min</Botao>
        <Botao onClick={() => ajustarSegundos(60)}>+ 1 min</Botao>
      </GradeBotoes>
    </div>
  );
}

function PainelPartida() {
  const estado = usePlacarBroadcast(LOJA);
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
    <div>
      <SecaoTitulo>Período</SecaoTitulo>
      <ListaChips>
        {PERIODOS.map((p) => (
          <Chip key={p} $ativo={estado.periodo === p} onClick={() => definirPeriodo(p)}>
            {p}
          </Chip>
        ))}
      </ListaChips>
      <SecaoTitulo>Acréscimo</SecaoTitulo>
      <GrupoAcrescimo>
        <BotaoPassoAcr onClick={() => definirAcrescimo((estado.acrescimo || 0) - 1)}>
          −
        </BotaoPassoAcr>
        <EntradaNum
          type="number"
          min="0"
          max="99"
          placeholder="Sem"
          value={estado.acrescimo ?? ''}
          onChange={(e) => definirAcrescimo(e.target.value)}
        />
        <BotaoPassoAcr onClick={() => definirAcrescimo((estado.acrescimo || 0) + 1)}>
          +
        </BotaoPassoAcr>
        <Chip $ativo={!(estado.acrescimo > 0)} onClick={() => definirAcrescimo(0)}>
          Sem
        </Chip>
      </GrupoAcrescimo>
      <SecaoTitulo>Estado da partida</SecaoTitulo>
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
      <SecaoTitulo>Exibição</SecaoTitulo>
      <ListaChips>
        <Chip $ativo={estado.mostrarEscudos !== false} onClick={alternarEscudos}>
          {estado.mostrarEscudos !== false ? 'Escudos visíveis' : 'Ocultar escudos'}
        </Chip>
      </ListaChips>
      <ResetBotao onClick={handleReset}>
        {confirmar ? '⚠ Clique novamente para confirmar' : '🗑 Resetar partida inteira'}
      </ResetBotao>
      <Aviso>Zera gols, cronômetro e período. Os nomes e cores voltam ao padrão.</Aviso>
    </div>
  );
}

export function PainelPlacarModel() {
  return (
    <Cartao>
      <Titulo>
        <span>●</span> Placar Model
      </Titulo>
      <Grade>
        <PainelTimes />
        <div>
          <PainelCronometro />
          <div style={{ marginTop: 22 }}>
            <PainelPartida />
          </div>
        </div>
      </Grade>
    </Cartao>
  );
}
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { SeletorSigla } from '../components/SeletorSigla'
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast'
import {
  gol,
  renomearTime,
  alternarCronometro,
  zerarCronometro,
  ajustarSegundos,
  definirPeriodo,
  definirAcrescimo,
  definirEstadoPartida,
  definirCorTime,
  CORES_PRESET,
  resetarPartida,
  ESTADOS_PARTIDA,
  segundosAtuais,
  formatarTempo,
  placarBroadcastEscalacao
} from '../store/placarBroadcastEscalacaoStore'
import { PainelEscalacaoBroadcast } from '../components/PainelEscalacaoBroadcast'
import { EscalacaoCartao } from '../components/EscalacaoCartao'
import { PreviaOverlay } from '../components/PreviaOverlay'

const PERIODOS = ['1T', '2T', 'PRORROGAÇÃO', 'PÊNALTIS']

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Conteudo = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`

const Secao = styled.section``

const GradeQuadros = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`

const GradeDois = styled.div`
  display: grid;
  grid-template-columns: 2.6fr 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`

const SecaoTitulo = styled.h2`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.primaria};
  margin: 4px 0 20px;
  display: flex;
  align-items: center;
  gap: 12px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.cores.borda};
  }
`

const Painel = styled.section`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 16px;
  padding: 24px;
`

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
`

const BlocoTime = styled.div`
  background: ${({ theme }) => theme.cores.fundoClaro};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`

const Rotulo = styled.label`
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-bottom: 8px;
`

const LinhaGols = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
`

const Numero = styled.div`
  max-width: 32px;
  flex: 1;
  text-align: center;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
`

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
    background 0.15s ease;
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
  }
  &.redondo {
    width: 46px;
    height: 46px;
    padding: 0;
    font-size: 1.3rem;
    background: ${({ theme }) => theme.cores.fundo};
    border: 1px solid ${({ theme }) => theme.cores.borda};
    color: ${({ theme }) => theme.cores.texto};
  }
  &.primario {
    background: ${({ theme }) => theme.cores.primaria};
    color: #0a0f00;
  }
  &.perigo {
    background: transparent;
    border: 1px solid ${({ theme }) => theme.cores.perigo};
    color: ${({ theme }) => theme.cores.perigo};
  }
  &.neutro {
    background: ${({ theme }) => theme.cores.fundo};
    border: 1px solid ${({ theme }) => theme.cores.borda};
    color: ${({ theme }) => theme.cores.texto};
  }
`

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
`

const GradeBotoes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

const ListaChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const Chip = styled.button`
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
`

const EntradaNum = styled.input`
  width: 84px;
  text-align: center;
  padding: 12px 6px;
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  color: ${({ theme }) => theme.cores.texto};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1rem;
  font-weight: 600;
  outline: none;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

const GrupoAcrescimo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`

const BotaoPasso = styled.button`
  width: 42px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.superficie};
  color: ${({ theme }) => theme.cores.texto};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
`

const GradeCores = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`

const Swatch = styled.button`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ $ativo }) => ($ativo ? '#fff' : 'transparent')};
  border-radius: 6px;
  padding: 0;
  cursor: pointer;
  background: ${({ $cor }) => $cor};
`

const AvisoReset = styled.p`
  margin-top: 10px;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.cores.textoSuave};
`

function PainelTimes() {
  const estado = usePlacarBroadcast(placarBroadcastEscalacao)
  const [coresAberto, setCoresAberto] = useState({})
  const toggle = (lado) => setCoresAberto((p) => ({ ...p, [lado]: !p[lado] }))

  const cfg = [
    {
      lado: 'casa',
      time: estado.timeCasa,
      titulo: 'Time da casa',
      cor: estado.corCasa,
      corBorda: estado.corCasaBorda
    },
    {
      lado: 'visitante',
      time: estado.timeVisitante,
      titulo: 'Time visitante',
      cor: estado.corVisitante,
      corBorda: estado.corVisitanteBorda
    }
  ]

  return (
    <Painel>
      <PainelTitulo>⚽ Times e Placar</PainelTitulo>
      {cfg.map(({ lado, time, titulo, cor, corBorda }) => (
        <BlocoTime key={lado}>
          <Rotulo>{titulo} (sigla 3 letras)</Rotulo>
          <SeletorSigla value={time.nome} onChange={(v) => renomearTime(lado, v)} />
          <Rotulo style={{ marginTop: 10 }}>Gols</Rotulo>
          <LinhaGols>
            <Botao className="redondo" onClick={() => gol(lado, -1)} disabled={time.gols === 0}>
              −
            </Botao>
            <Numero>{time.gols}</Numero>
            <Botao className="redondo" onClick={() => gol(lado, +1)}>
              +
            </Botao>
          </LinhaGols>
          <button
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: 12,
              cursor: 'pointer'
            }}
            onClick={() => toggle(lado)}
          >
            {coresAberto[lado] ? '▾' : '▸'} Cores
          </button>
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
  )
}

function PainelCronometro() {
  const estado = usePlacarBroadcast(placarBroadcastEscalacao)
  const [, forcarTick] = useState(0)
  const cron = estado.cronometro
  useEffect(() => {
    const intervalo = setInterval(() => forcarTick((t) => t + 1), 500)
    return () => clearInterval(intervalo)
  }, [])
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
        <Botao className="neutro" onClick={zerarCronometro} disabled={cron.rodando}>
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
  )
}

function PainelPartida() {
  const estado = usePlacarBroadcast(placarBroadcastEscalacao)
  const [confirmar, setConfirmar] = useState(false)
  function handleReset() {
    if (!confirmar) {
      setConfirmar(true)
      setTimeout(() => setConfirmar(false), 4000)
      return
    }
    resetarPartida()
    setConfirmar(false)
  }
  return (
    <Painel>
      <PainelTitulo>📋 Partida</PainelTitulo>
      <Rotulo>Período</Rotulo>
      <ListaChips style={{ marginBottom: 16 }}>
        {PERIODOS.map((p) => (
          <Chip key={p} $ativo={estado.periodo === p} onClick={() => definirPeriodo(p)}>
            {p}
          </Chip>
        ))}
      </ListaChips>
      <Rotulo>Acréscimo</Rotulo>
      <GrupoAcrescimo>
        <BotaoPasso type="button" onClick={() => definirAcrescimo((estado.acrescimo || 0) - 1)}>
          −
        </BotaoPasso>
        <EntradaNum
          type="number"
          min="0"
          max="99"
          placeholder="Sem"
          value={estado.acrescimo ?? ''}
          onChange={(e) => definirAcrescimo(e.target.value)}
        />
        <BotaoPasso type="button" onClick={() => definirAcrescimo((estado.acrescimo || 0) + 1)}>
          +
        </BotaoPasso>
        <Chip $ativo={(estado.acrescimo || 0) === 0} onClick={() => definirAcrescimo(0)}>
          Sem
        </Chip>
      </GrupoAcrescimo>
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
        <Botao className="perigo" style={{ width: '100%' }} onClick={handleReset}>
          {confirmar ? '⚠ Clique novamente para confirmar' : '🗑 Resetar partida inteira'}
        </Botao>
        <AvisoReset>Zera gols, cronômetro, período e escalações.</AvisoReset>
      </div>
    </Painel>
  )
}

function PreviaOverlayCompleta() {
  const estado = usePlacarBroadcast(placarBroadcastEscalacao)
  return (
    <Painel>
      <PainelTitulo>👁 Prévia da escalação</PainelTitulo>
      {estado.escalacaoVisivel ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <EscalacaoCartao dados={estado.escalacao} lado="casa" />
          <EscalacaoCartao dados={estado.escalacao} lado="fora" />
        </div>
      ) : (
        <p style={{ color: '#94a3b8' }}>Escalação oculta da tela.</p>
      )}
    </Painel>
  )
}

export default function ControlePlacarBroadcastEscalacao() {
  return (
    <Container>
      <Header subtitulo="Controle · Placar Broadcast + Escalação" />
      <Conteudo>
        <Secao>
          <SecaoTitulo>🎮 Controle de jogo</SecaoTitulo>
          <GradeQuadros>
            <PainelTimes />
            <PainelCronometro />
            <PainelPartida />
          </GradeQuadros>
        </Secao>
        <Secao>
          <SecaoTitulo>📋 Escalação e informações</SecaoTitulo>
          <GradeDois>
            <PainelEscalacaoBroadcast />
            <PreviaOverlayCompleta />
          </GradeDois>
        </Secao>
      </Conteudo>
      <div style={{ width: '100%', maxWidth: 1920, margin: '0 auto', padding: '0 24px 40px' }}>
        <PreviaOverlay rota="/placar-broadcast-escalacao" altura={760} />
      </div>
    </Container>
  )
}

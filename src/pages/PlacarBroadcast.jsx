import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast'
import { segundosAtuais, formatarTempo } from '../store/placarBroadcastStore'
import { substituicaoPro } from '../store/substituicaoStore'
import { SubstituicaoCartao } from '../components/SubstituicaoCartao'
import { useFundoTransparente } from '../components/useFundoTransparente'
import { BotaoAlternarTema } from '../components/BotaoAlternarTema'

const compacto = new URLSearchParams(window.location.search).has('compacto')

const VERDE = '#a5ef1c'

function corContraste(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 0.5 ? '#000' : '#fff'
}

const Tela = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 60px;
  background: transparent;
  gap: 16px;
`

const BarraPlacar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
  position: relative;
`

const FaixaTempo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 6px 28px;
  position: relative;
  background: ${({ theme }) => theme.cores.barra};
  border-radius: 6px 6px 0 0;
  backdrop-filter: blur(4px);

  .tempo {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: ${({ theme }) => theme.cores.texto};
}

  .periodo {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.cores.textoVideo};
    text-transform: uppercase;
}

  .grupo {
  position: relative;
    display: inline-flex;
  align-items: center;
}

  .acrescimo {
    position: absolute;
    left: calc(100% + 2px);
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 0 16px;
    background: ${({ theme }) => theme.cores.barra};
    border-radius: 6px 6px 0 0;
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 1px;
    color: #fbbf24;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.25s ease,
      visibility 0.25s ease;
}

  .acrescimo.visivel {
    opacity: 1;
    visibility: visible;
}
`

const CorpoPlacar = styled.div`
  display: flex;
  align-items: stretch;
  border-radius: 0 0 6px 6px;
  overflow: visible;
  animation: ${({ $penaltis }) => $penaltis ? transicaoModo : 'none'} 0.5s ease;
`

const BlocoTime = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 10px 24px;
  background: ${({ $cor }) => $cor};
  min-width: 140px;

  ${({ $gol }) => $gol && `
    .sigla, .gols { visibility: hidden; }
  `}

  .sigla {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: ${({ $cor }) => corContraste($cor)};
    text-transform: uppercase;
}

  .gols {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-variant-numeric: tabular-nums;
    font-size: 2rem;
    font-weight: 700;
    color: ${({ $cor }) => corContraste($cor)};
    line-height: 1;
    min-width: 1.2em;
    text-align: center;
}
`

const Separador = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  background: ${({ theme }) => theme.cores.barraForte};
  backdrop-filter: blur(4px);
  position: relative;

  span {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ theme }) => theme.cores.textoVideoFino};
}
`

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 20px;
  background: ${({ theme }) => theme.cores.barra};
  border-radius: 4px;
  backdrop-filter: blur(4px);

  .label {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${({ theme, $ativo }) =>
      $ativo ? theme.cores.primaria : theme.cores.texto};
}
`

const pulso = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
`

const Ponto = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a5ef1c;
  animation: ${pulso} 1s ease-in-out infinite;
`

const Voltar = styled(Link)`
  position: fixed;
  top: 18px;
  left: 18px;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: ${({ theme }) => theme.cores.superficieHover};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  color: ${({ theme }) => theme.cores.textoSuave};
    font-size: 1.2rem;
  text-decoration: none;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${Tela}:hover & {
    opacity: 1;
}
`

/* ---------- Faixa de gol estilo breaking news ---------- */

const rolagemGol = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`

const TEXTO_GOL = Array(6).fill('GOLL \u2022 ').join('')

const FaixaGol = styled.span`
    position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  overflow: hidden;
    white-space: nowrap;
  background: rgba(0, 0, 0, 0.45);

  span {
    display: inline-block;
    min-width: max-content;
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 1.2rem;
    font-weight: 800;
    font-style: italic;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #ffd700;
    filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.7));
    animation: ${rolagemGol} 2s linear infinite;
}
`

/* ---------- Transição modo pênaltis ---------- */

const transicaoModo = keyframes`
  0% { transform: scaleX(1); }
  50% { transform: scaleX(0.85); }
  100% { transform: scaleX(1); }
`

/* ---------- Traços de cartão ---------- */

const TracoCartao = styled.span`
    display: inline-block;
  width: 14px;
  height: 4px;
  border-radius: 1px;
  background: ${({ $cor }) => $cor === 'amarelo' ? '#eab308' : '#dc2626'};
  margin: 0 1px;
`

const Marca = styled.div`
  opacity: 0.2;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.8rem;
    font-weight: 600;
  letter-spacing: 4px;
    text-transform: uppercase;
`

const CartaoSubFixo = styled.div`
  position: fixed;
  left: 48px;
  bottom: 48px;
  z-index: 20;
`

export default function PlacarBroadcast() {
  const estado = usePlacarBroadcast()
  const substituicao = usePlacarBroadcast(substituicaoPro)
  const [, forcarTick] = useState(0)
  const [golAtivo, setGolAtivo] = useState(null)
  const ultimoEventoGol = useRef(null)

  useFundoTransparente()

  useEffect(() => {
    const intervalo = setInterval(() => forcarTick((t) => t + 1), 500)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    const evento = estado.eventoGol
    if (!evento || evento.em === ultimoEventoGol.current) return
    ultimoEventoGol.current = evento.em
    if (Date.now() - evento.em > 8000) return
    setGolAtivo(evento)
  }, [estado.eventoGol])

  useEffect(() => {
    if (!golAtivo) return
    const t = setTimeout(() => setGolAtivo(null), 4000)
    return () => clearTimeout(t)
  }, [golAtivo])

  const { timeCasa, timeVisitante, cronometro, periodo, estadoPartida, cartoesCasa, cartoesVisitante, acrescimo } = estado
  const tempo = formatarTempo(segundosAtuais(cronometro))

  const tracosCasa = [
    ...Array(cartoesCasa?.amarelo || 0).fill('amarelo'),
    ...Array(cartoesCasa?.vermelho || 0).fill('vermelho'),
  ]
  const tracosVisitante = [
    ...Array(cartoesVisitante?.amarelo || 0).fill('amarelo'),
    ...Array(cartoesVisitante?.vermelho || 0).fill('vermelho'),
  ]

  return (
    <Tela $compacto={compacto}>
      {!compacto && <Voltar to="/hub" title="Voltar ao hub">←</Voltar>}
      {!compacto && <BotaoAlternarTema />}

      {!compacto && <Marca>PELOTENSE ESPORTES</Marca>}

      <BarraPlacar>
        <FaixaTempo>
          <span className="periodo">{periodo}</span>
          <div className="grupo">
            <span className="tempo">{tempo}</span>
          </div>
          <span className={`acrescimo${acrescimo > 0 ? ' visivel' : ''}`}>+{Math.max(0, acrescimo || 0)}:00</span>
        </FaixaTempo>

        <div style={{ display: 'flex', height: 5, width: '100%' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
            {tracosCasa.map((cor, i) => (<TracoCartao key={`casa-${cor}-${i}`} $cor={cor} />))}
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
            {tracosVisitante.map((cor, i) => (<TracoCartao key={`vis-${cor}-${i}`} $cor={cor} />))}
          </div>
          </div>
        <CorpoPlacar $penaltis={periodo === 'PÊNALTIS'}>
          {periodo === 'PÊNALTIS' ? (
            <>
              <BlocoTime $cor={estado.corCasa} $gol={golAtivo?.lado === 'casa'} style={{ borderLeft: `6px solid ${VERDE}` }}>
                <span className="sigla">{timeCasa.nome}</span>
                {golAtivo?.lado === 'casa' && (
                  <FaixaGol key={golAtivo.em}><span>{TEXTO_GOL}{TEXTO_GOL}</span></FaixaGol>
                )}
              </BlocoTime>
              <Separador style={{ padding: '10px 14px', gap: 8 }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{timeCasa.gols}</span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>×</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{timeVisitante.gols}</span>
              </Separador>
              <BlocoTime $cor={estado.corVisitante} $gol={golAtivo?.lado === 'visitante'} style={{ borderRight: `6px solid ${VERDE}` }}>
                <span className="sigla">{timeVisitante.nome}</span>
                {golAtivo?.lado === 'visitante' && (
                  <FaixaGol key={golAtivo.em}><span>{TEXTO_GOL}{TEXTO_GOL}</span></FaixaGol>
                )}
              </BlocoTime>
            </>
          ) : (
            <>
              <BlocoTime $cor={estado.corCasa} $gol={golAtivo?.lado === 'casa'} style={{ borderLeft: `6px solid ${VERDE}` }}>
                <span className="sigla">{timeCasa.nome}</span>
                <span className="gols">{timeCasa.gols}</span>
                {golAtivo?.lado === 'casa' && (
                  <FaixaGol key={golAtivo.em}><span>{TEXTO_GOL}{TEXTO_GOL}</span></FaixaGol>
                )}
              </BlocoTime>
              <Separador>
                <span>×</span>
              </Separador>
              <BlocoTime $cor={estado.corVisitante} $gol={golAtivo?.lado === 'visitante'} style={{ borderRight: `6px solid ${VERDE}` }}>
                <span className="gols">{timeVisitante.gols}</span>
                <span className="sigla">{timeVisitante.nome}</span>
                {golAtivo?.lado === 'visitante' && (
                  <FaixaGol key={golAtivo.em}><span>{TEXTO_GOL}{TEXTO_GOL}</span></FaixaGol>
                )}
              </BlocoTime>
            </>
                )}
        </CorpoPlacar>
      </BarraPlacar>

      {!compacto && (
            <>
          <StatusBar $ativo={cronometro.rodando}>
            {cronometro.rodando && <Ponto />}
            <span className="label">{estadoPartida}</span>
          </StatusBar>
            </>
                )}

      {substituicao.visivel && (
        <CartaoSubFixo>
          <SubstituicaoCartao dados={substituicao} />
        </CartaoSubFixo>
                )}
    </Tela>
  )
}

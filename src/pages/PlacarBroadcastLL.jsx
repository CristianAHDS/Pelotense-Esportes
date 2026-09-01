import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { useFundoTransparente } from '../components/useFundoTransparente'
import { BotaoAlternarTema } from '../components/BotaoAlternarTema'
import { substituicaoLL } from '../store/substituicaoStore'
import { SubstituicaoCartao } from '../components/SubstituicaoCartao'
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast'
import {
  getEstado,
  inscrever,
  segundosAtuais,
  formatarTempo,
} from '../store/placarBroadcastLLStore'

const loja = { getEstado, inscrever }

/* Identidade LaLiga */
const LL_CORAL = '#FF4B44'
const LL_MARINHO = '#0B1E3A'
const LL_BRANCO = '#ffffff'

const compacto = new URLSearchParams(window.location.search).has('compacto')

const Tela = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 60px;
  background: transparent;
  gap: 16px;

  ${({ $compacto }) => $compacto && `
    min-height: auto;
    padding-top: 10px;
    gap: 0;
    padding-bottom: 14px;
  `}
`

const BarraPlacar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
    gap: 0;
  filter: drop-shadow(0 6px 18px rgba(11, 30, 58, 0.35));
`

const LinhaTempo = styled.div`
  display: flex;
  align-items: stretch;
  gap: 6px;
`

const ChipTempo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 22px;
  background: ${LL_CORAL};
  border-radius: 10px 10px 0 0;

  .tempo {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-variant-numeric: tabular-nums;
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: 2px;
    color: ${LL_BRANCO};
  }
`

const ChipPeriodo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 16px;
  background: ${LL_MARINHO};
  border-radius: 10px 10px 0 0;

  span {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: ${LL_BRANCO};
    text-transform: uppercase;
  }
`

const ChipAcrescimo = styled.div`
  position: absolute;
  left: calc(100% + 6px);
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 16px;
  background: ${LL_BRANCO};
  border-radius: 10px 10px 0 0;
  white-space: nowrap;
  opacity: ${({ $visivel }) => ($visivel ? 1 : 0)};
  visibility: ${({ $visivel }) => ($visivel ? 'visible' : 'hidden')};
  transition:
    opacity 0.25s ease,
    visibility 0.25s ease;

  span {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-variant-numeric: tabular-nums;
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: 1px;
    color: ${LL_CORAL};
  }
`

const CorpoPlacar = styled.div`
  display: flex;
  align-items: stretch;
  background: ${LL_BRANCO};
  border-radius: 0 0 14px 14px;
  overflow: visible;
  animation: ${({ $penaltis }) => ($penaltis ? transicaoModo : 'none')} 0.5s ease;
`

const BlocoTime = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 12px 26px;
  background: ${LL_BRANCO};
  min-width: 150px;

  &::after {
    content: '';
  position: absolute;
    left: 14px;
    right: 14px;
    bottom: 6px;
    height: 4px;
    border-radius: 2px;
    background: ${({ $cor }) => $cor};
  }

  .sigla {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: 2px;
    color: ${LL_MARINHO};
    text-transform: uppercase;
  }

  .gols {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-variant-numeric: tabular-nums;
    font-size: 2rem;
    font-weight: 800;
    color: ${LL_MARINHO};
    line-height: 1;
    min-width: 1.2em;
    text-align: center;
  }

  ${({ $gol }) => $gol && `
    .sigla, .gols { visibility: hidden; }
  `}
`

const Separador = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ff7a52 0%, ${LL_CORAL} 100%);

  > span:first-child {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    color: ${LL_BRANCO};
  }

  .placarPen {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-variant-numeric: tabular-nums;
    font-size: 1.3rem;
    font-weight: 800;
    color: ${LL_BRANCO};
  }

  .xPen {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.75);
  }
`

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 20px;
  background: ${LL_BRANCO};
  border-radius: 999px;

  .label {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${({ $ativo }) => ($ativo ? LL_CORAL : LL_MARINHO)};
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
  background: ${LL_CORAL};
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
  background: linear-gradient(135deg, #ff7a52 0%, ${LL_CORAL} 100%);
  border-radius: 0 0 14px 14px;

  span {
    display: inline-block;
    min-width: max-content;
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 1.2rem;
    font-weight: 800;
    font-style: italic;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${LL_BRANCO};
    filter: drop-shadow(0 1px 3px rgba(11, 30, 58, 0.35));
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
    border-radius: 2px;
  background: ${({ $cor }) => ($cor === 'amarelo' ? '#eab308' : '#dc2626')};
  margin: 0 1px;
`

const Marca = styled.div`
  opacity: 0.25;
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 4px;
    text-transform: uppercase;
  color: ${({ theme }) => theme.cores.texto};
`


const CartaoSubFixo = styled.div`
  position: fixed;
  left: 48px;
  bottom: 48px;
  z-index: 20;
`
export default function PlacarBroadcastLL() {
  const estado = usePlacarBroadcast(loja)
  const sub = usePlacarBroadcast(substituicaoLL)
  useFundoTransparente()
  const [, forcarTick] = useState(0)
  const [golAtivo, setGolAtivo] = useState(null)
  const ultimoEventoGol = useRef(null)

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
        <LinhaTempo>
          <ChipPeriodo><span>{periodo}</span></ChipPeriodo>
          <ChipTempo>
            <span className="tempo">{tempo}</span>
            <ChipAcrescimo $visivel={acrescimo > 0}><span>+{Math.max(0, acrescimo || 0)}:00</span></ChipAcrescimo>
          </ChipTempo>
        </LinhaTempo>

        <div style={{ display: 'flex', height: 5, width: '100%' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 2 }}>
            {tracosCasa.map((cor, i) => (<TracoCartao key={`casa-${cor}-${i}`} $cor={cor} />))}
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 2 }}>
            {tracosVisitante.map((cor, i) => (<TracoCartao key={`vis-${cor}-${i}`} $cor={cor} />))}
          </div>
          </div>

        <CorpoPlacar $penaltis={periodo === 'PÊNALTIS'}>
          {periodo === 'PÊNALTIS' ? (
            <>
              <BlocoTime $cor={estado.corCasa} $gol={golAtivo?.lado === 'casa'}>
                <span className="sigla">{timeCasa.nome}</span>
                {golAtivo?.lado === 'casa' && (
                  <FaixaGol key={golAtivo.em}><span>{TEXTO_GOL}{TEXTO_GOL}</span></FaixaGol>
                )}
              </BlocoTime>
              <Separador>
                <span className="placarPen">{timeCasa.gols}</span>
                <span className="xPen">×</span>
                <span className="placarPen">{timeVisitante.gols}</span>
              </Separador>
              <BlocoTime $cor={estado.corVisitante} $gol={golAtivo?.lado === 'visitante'}>
                <span className="sigla">{timeVisitante.nome}</span>
                {golAtivo?.lado === 'visitante' && (
                  <FaixaGol key={golAtivo.em}><span>{TEXTO_GOL}{TEXTO_GOL}</span></FaixaGol>
                )}
              </BlocoTime>
            </>
          ) : (
            <>
              <BlocoTime $cor={estado.corCasa} $gol={golAtivo?.lado === 'casa'}>
                <span className="sigla">{timeCasa.nome}</span>
                <span className="gols">{timeCasa.gols}</span>
                {golAtivo?.lado === 'casa' && (
                  <FaixaGol key={golAtivo.em}><span>{TEXTO_GOL}{TEXTO_GOL}</span></FaixaGol>
                )}
              </BlocoTime>
              <Separador>
                <span>–</span>
              </Separador>
              <BlocoTime $cor={estado.corVisitante} $gol={golAtivo?.lado === 'visitante'}>
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
    {sub.visivel && (
      <CartaoSubFixo>
        <SubstituicaoCartao dados={sub} />
      </CartaoSubFixo>
                )}
    </Tela>
  )
  }

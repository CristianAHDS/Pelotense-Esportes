import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { usePlacarNormal } from '../hooks/usePlacarNormal'
import { segundosAtuais, formatarTempo } from '../store/placarNormalStore'
import { substituicaoPro } from '../store/substituicaoStore'
import { SubstituicaoCartao } from '../components/SubstituicaoCartao'
import { Escudo } from '../components/Escudo'
import { useFundoTransparente } from '../components/useFundoTransparente'

const compacto = new URLSearchParams(window.location.search).has('compacto')

function hexParaRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

/* ── Animações ── */

const pulsoGlow = keyframes`
  0%,100% { opacity:.5; }
  50% { opacity:1; }
`
const pulso = keyframes`
  0%,100% { opacity:1; }
  50% { opacity:.15; }
`
const rolagemGol = keyframes`
  from { transform:translateX(0); }
  to { transform:translateX(-50%); }
`
const glisseScore = keyframes`
  from { transform:scale(1.4); opacity:0; }
  to { transform:scale(1); opacity:1; }
`
const fadeGol = keyframes`
  0%  { opacity:0; transform:translateY(6px); }
  10% { opacity:1; transform:translateY(0); }
  80% { opacity:1; transform:translateY(0); }
  100%{ opacity:0; transform:translateY(-6px); }
`

/* ── Tela ── */

const Tela = styled.div`
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-start;
  padding-top:60px;
  background:transparent;
  gap:10px;
`

/* ── Shell compacto ── */

const Barra = styled.div`
  position:relative;
  width:420px;
`

const GlowOrb = styled.div`
  position:absolute;
  inset:-14px;
  z-index:-1;
  border-radius:18px;
  background:radial-gradient(ellipse at 50% 50%,${({ $c }) => hexParaRgba($c,.1)},transparent 70%);
  filter:blur(14px);
  pointer-events:none;
  animation:${pulsoGlow} 3s ease-in-out infinite;
`

const Shell = styled.div`
  position:relative;
  border-radius:10px;
  overflow:hidden;
  background:rgba(8,8,8,.85);
  backdrop-filter:blur(14px) saturate(1.3);
  border:1px solid rgba(255,255,255,.06);
  box-shadow:0 3px 18px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.02) inset;
`

const NeonStrip = styled.div`
  height:2px;
  background:linear-gradient(90deg,transparent,${({ $c }) => $c} 25%,#a5ef1c 50%,${({ $c }) => $c} 75%,transparent);
  opacity:.75;
`

/* ── Top strip: período + cronômetro + status ── */

const TopoStrip = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:3px 14px;
  border-bottom:1px solid rgba(255,255,255,.04);
`

const PeriodoTag = styled.span`
  font-family:${({ theme }) => theme.fontes.titulo};
  font-size:.58rem;
  font-weight:700;
  letter-spacing:2px;
  text-transform:uppercase;
  color:rgba(255,255,255,.45);
  background:rgba(255,255,255,.05);
  padding:2px 7px;
  border-radius:4px;
`

const Crono = styled.span`
  font-family:${({ theme }) => theme.fontes.titulo};
  font-variant-numeric:tabular-nums;
  font-size:.82rem;
  font-weight:700;
  letter-spacing:1.5px;
  color:${({ $r }) => $r ? '#a5ef1c' : 'rgba(255,255,255,.5)'};
  transition:color .3s;
`

const AcrescimoTag = styled.span`
  font-family:${({ theme }) => theme.fontes.titulo};
  font-variant-numeric:tabular-nums;
  font-size:.75rem;
  font-weight:800;
  color:#fbbf24;
`

const LiveDot = styled.span`
  width:5px; height:5px;
  border-radius:50%;
  background:${({ $r }) => $r ? '#ef4444' : 'rgba(255,255,255,.25)'};
  box-shadow:${({ $r }) => $r ? '0 0 6px rgba(239,68,68,.6)' : 'none'};
  animation:${({ $r }) => $r ? pulso : 'none'} 1.2s ease-in-out infinite;
  transition:background .3s,box-shadow .3s;
  margin-left:4px;
`

/* ── Corpo: linha única ── */

const Corpo = styled.div`
  display:flex;
  align-items:center;
  min-height:48px;
`

const Lado = styled.div`
  display:flex;
  align-items:center;
  gap:8px;
  padding:0 14px;
  flex:1;
  min-width:0;
  position:relative;

  ${({ $dir }) => $dir && 'justify-content:flex-end;'}
`

const BarraCor = styled.span`
  position:absolute;
  ${({ $dir }) => $dir ? 'right:0;' : 'left:0;'}
  top:4px; bottom:4px;
  width:3px;
  border-radius:2px;
  background:${({ $c }) => $c};
  box-shadow:0 0 8px ${({ $c }) => hexParaRgba($c,.45)};
`

const Sigla = styled.span`
  font-family:${({ theme }) => theme.fontes.titulo};
  font-size:.95rem;
  font-weight:700;
  letter-spacing:2px;
  color:#fff;
  white-space:nowrap;
`

const GolNum = styled.span`
  font-family:${({ theme }) => theme.fontes.titulo};
  font-variant-numeric:tabular-nums;
  font-size:1.7rem;
  font-weight:700;
  line-height:1;
  min-width:1.1em;
  text-align:center;
  color:#fff;
  ${({ $a }) => $a && `animation:${glisseScore} .3s cubic-bezier(.34,1.56,.64,1);`}
`

const Centro = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  padding:0 2px;
  flex-shrink:0;
`

const LinhaScore = styled.div`
  display:flex;
  align-items:center;
  gap:4px;
`

const Traco = styled.span`
  font-family:${({ theme }) => theme.fontes.titulo};
  font-size:1.1rem;
  font-weight:300;
  color:rgba(255,255,255,.2);
  line-height:1;
`

/* ── Faixa cartões (fina) ── */

const CartoesBar = styled.div`
  display:flex;
  height:2px;
  width:100%;
`
const CartoesMetade = styled.div`
  flex:1;
  display:flex;
  justify-content:center;
  gap:3px;
  align-items:center;
`
const CartaoTraco = styled.span`
  display:inline-block;
  width:14px;
  height:2px;
  border-radius:2px;
  background:${({ $c }) => $c === 'amarelo' ? '#eab308' : '#dc2626'};
  box-shadow:0 0 5px ${({ $c }) => $c === 'amarelo' ? 'rgba(234,179,8,.45)' : 'rgba(220,38,38,.45)'};
`

/* ── Faixa de gol ── */

const TEXTO_GOL = Array(8).fill('GOL').join(' \u2022 ')

const FaixaGol = styled.div`
  position:absolute;
  inset:0;
  z-index:5;
  display:flex;
  align-items:center;
  overflow:hidden;
  white-space:nowrap;
  background:linear-gradient(90deg,rgba(165,239,28,.12),rgba(255,215,0,.18),rgba(165,239,28,.12));
  animation:${fadeGol} 4s ease-in-out forwards;

  span {
    display:inline-block;
    min-width:max-content;
    font-family:${({ theme }) => theme.fontes.titulo};
    font-size:.95rem;
    font-weight:700;
    letter-spacing:5px;
    text-transform:uppercase;
    color:#ffd700;
    filter:drop-shadow(0 0 6px rgba(255,215,0,.55));
    animation:${rolagemGol} 3s linear infinite;
  }
`

/* ── Voltar + Marca ── */

const Voltar = styled(Link)`
  position:fixed;
  top:18px; left:18px;
  width:38px; height:38px;
  display:grid;
  place-items:center;
  border-radius:10px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
  color:rgba(255,255,255,.4);
  font-size:1.1rem;
  text-decoration:none;
  opacity:0;
  transition:opacity .2s;
  ${Tela}:hover & { opacity:1; }
`

const Marca = styled.div`
  opacity:.12;
  font-family:${({ theme }) => theme.fontes.titulo};
  font-size:.7rem;
  font-weight:600;
  letter-spacing:5px;
  text-transform:uppercase;
`

const CartaoSubFixo = styled.div`
  position:fixed;
  left:48px; bottom:48px;
  z-index:20;
`

/* ── Componente ── */

export default function PlacarNormal() {
  const estado = usePlacarNormal()
  const substituicao = usePlacarNormal(substituicaoPro)
  const [, tick] = useState(0)
  const [golAtivo, setGolAtivo] = useState(null)
  const refGol = useRef(null)
  const prevC = useRef(0)
  const prevV = useRef(0)
  const [animC, setAnimC] = useState(false)
  const [animV, setAnimV] = useState(false)

  useFundoTransparente()

  useEffect(() => {
    const id = setInterval(() => tick(t => t + 1), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ev = estado.eventoGol
    if (!ev || ev.em === refGol.current) return
    refGol.current = ev.em
    if (Date.now() - ev.em > 8000) return
    setGolAtivo(ev)
  }, [estado.eventoGol])

  useEffect(() => {
    if (!golAtivo) return
    const t = setTimeout(() => setGolAtivo(null), 4000)
    return () => clearTimeout(t)
  }, [golAtivo])

  useEffect(() => {
    if (estado.timeCasa.gols !== prevC.current) {
      prevC.current = estado.timeCasa.gols
      setAnimC(true)
      const t = setTimeout(() => setAnimC(false), 400)
      return () => clearTimeout(t)
    }
  }, [estado.timeCasa.gols])

  useEffect(() => {
    if (estado.timeVisitante.gols !== prevV.current) {
      prevV.current = estado.timeVisitante.gols
      setAnimV(true)
      const t = setTimeout(() => setAnimV(false), 400)
      return () => clearTimeout(t)
    }
  }, [estado.timeVisitante.gols])

  const { timeCasa: tc, timeVisitante: tv, cronometro, periodo, estadoPartida, cartoesCasa: cc, cartoesVisitante: cv, acrescimo } = estado
  const tempo = formatarTempo(segundosAtuais(cronometro))
  const aoVivo = cronometro.rodando
  const corGlow = aoVivo ? '#a5ef1c' : 'rgba(255,255,255,.12)'

  const tCasa = [
    ...Array(cc?.amarelo || 0).fill('amarelo'),
    ...Array(cc?.vermelho || 0).fill('vermelho'),
  ]
  const tVis = [
    ...Array(cv?.amarelo || 0).fill('amarelo'),
    ...Array(cv?.vermelho || 0).fill('vermelho'),
  ]

  return (
    <Tela>
      {!compacto && <Voltar to="/hub" title="Voltar ao hub">←</Voltar>}
      {!compacto && <Marca>PELOTENSE ESPORTES</Marca>}

      <Barra>
        {aoVivo && <GlowOrb $c={corGlow} />}
        <Shell>
          <NeonStrip $c={corGlow} />

          <TopoStrip>
            <LiveDot $r={aoVivo} />
            <PeriodoTag>{periodo}</PeriodoTag>
            <Crono $r={aoVivo}>{tempo}</Crono>
            {acrescimo > 0 && <AcrescimoTag>+{acrescimo}:00</AcrescimoTag>}
          </TopoStrip>

          <CartoesBar>
            <CartoesMetade>
              {tCasa.map((c, i) => <CartaoTraco key={`c${i}`} $c={c} />)}
            </CartoesMetade>
            <CartoesMetade>
              {tVis.map((c, i) => <CartaoTraco key={`v${i}`} $c={c} />)}
            </CartoesMetade>
          </CartoesBar>

          <Corpo>
            <Lado>
              <BarraCor $c={estado.corCasa} />
              <Escudo cor={estado.corCasa} sigla={tc.nome} url={tc.escudo} tamanho={22} />
              <Sigla $c={estado.corCasa}>{tc.nome}</Sigla>
              <GolNum $a={animC}>{tc.gols}</GolNum>
              {golAtivo?.lado === 'casa' && (
                <FaixaGol key={golAtivo.em}><span>{TEXTO_GOL} {TEXTO_GOL}</span></FaixaGol>
              )}
            </Lado>

            <Centro>
              <LinhaScore>
                <Traco>–</Traco>
              </LinhaScore>
            </Centro>

            <Lado $dir>
              <BarraCor $dir $c={estado.corVisitante} />
              <GolNum $a={animV}>{tv.gols}</GolNum>
              <Sigla $c={estado.corVisitante}>{tv.nome}</Sigla>
              <Escudo cor={estado.corVisitante} sigla={tv.nome} url={tv.escudo} tamanho={22} />
              {golAtivo?.lado === 'visitante' && (
                <FaixaGol key={golAtivo.em}><span>{TEXTO_GOL} {TEXTO_GOL}</span></FaixaGol>
              )}
            </Lado>
          </Corpo>
        </Shell>
      </Barra>

      {substituicao.visivel && (
        <CartaoSubFixo>
          <SubstituicaoCartao dados={substituicao} />
        </CartaoSubFixo>
      )}
    </Tela>
  )
}

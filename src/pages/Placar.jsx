import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { usePlacar } from '../hooks/usePlacar'
import { segundosAtuais, formatarTempo } from '../store/placarStore'
import { theme } from '../theme'

const Tela = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  background:
    radial-gradient(ellipse at top, rgba(165, 239, 28, 0.08), transparent 60%),
    ${({ theme }) => theme.cores.fundo};
  padding: 24px;
`

const Periodo = styled.div`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(1rem, 2.5vw, 1.6rem);
  font-weight: 700;
  letter-spacing: 6px;
  color: #0a0f00;
  background: ${({ theme }) => theme.cores.primaria};
  padding: 8px 32px;
  border-radius: 999px;
  box-shadow: 0 0 30px rgba(165, 239, 28, 0.4);
`

const PainelPlacar = styled.div`
  display: flex;
  align-items: stretch;
  background: linear-gradient(160deg, #182238, #0d1424);
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
  width: min(1100px, 100%);
`

const Time = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: clamp(24px, 5vw, 56px) clamp(16px, 3vw, 40px);
  background: ${({ $destaque, theme }) =>
    $destaque === 'casa' ? 'rgba(165,239,28,0.07)' : $destaque === 'visitante' ? 'rgba(59,130,246,0.07)' : 'transparent'};

  .nome {
  font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: clamp(1rem, 3vw, 2rem);
  font-weight: 700;
    letter-spacing: 3px;
    text-align: center;
    text-transform: uppercase;
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .gols {
  font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: clamp(4rem, 14vw, 9rem);
  font-weight: 700;
    line-height: 1;
  }
`

const Centro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: clamp(20px, 4vw, 48px) clamp(16px, 3vw, 40px);
  border-left: 1px solid ${({ theme }) => theme.cores.borda};
  border-right: 1px solid ${({ theme }) => theme.cores.borda};
  background: rgba(0, 0, 0, 0.25);

  .tempo {
  font-family: ${({ theme }) => theme.fontes.titulo};
    font-variant-numeric: tabular-nums;
    font-size: clamp(2.2rem, 7vw, 4.5rem);
  font-weight: 700;
    letter-spacing: 2px;
    color: ${({ theme }) => theme.cores.primaria};
    text-shadow: 0 0 30px rgba(165, 239, 28, 0.45);
    min-width: 3.8em;
    text-align: center;
  }

  .status {
  display: flex;
  align-items: center;
    gap: 8px;
    font-size: clamp(0.65rem, 1.5vw, 0.85rem);
  font-weight: 700;
    letter-spacing: 3px;
    color: ${({ theme }) => theme.cores.textoSuave};
    text-transform: uppercase;
  }
`

const Ponto = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $ativo, theme }) => ($ativo ? theme.cores.perigo : theme.cores.borda)};
  animation: ${({ $ativo }) => ($ativo ? 'pulsar 1s infinite' : 'none')};

  @keyframes pulsar {
    50% {
      opacity: 0.25;
  }
  }
`

const Marca = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.35;

  img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  span {
  font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 4px;
  }
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
  background: rgba(255, 255, 255, 0.06);
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

/* ---------- Animação de gol ---------- */

const pulsoFundo = keyframes`
  from {
    background: radial-gradient(circle at center, ${({ $cor }) => $cor}26, rgba(4, 7, 12, 0.94) 70%);
  }
  to {
    background: radial-gradient(circle at center, ${({ $cor }) => $cor}5c, rgba(4, 7, 12, 0.94) 70%);
  }
`

const textoEntrando = keyframes`
  0% {
    transform: scale(0.2) rotate(-10deg);
  opacity: 0;
  }
  60% {
    transform: scale(1.18) rotate(3deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`

const brilhoTexto = keyframes`
  from {
    text-shadow: 0 0 24px ${({ $cor }) => $cor}, 0 0 70px ${({ $cor }) => $cor}80;
  }
  to {
    text-shadow: 0 0 50px ${({ $cor }) => $cor}, 0 0 140px ${({ $cor }) => $cor}cc;
  }
`

const bolaQuicando = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
    50% {
    transform: translateY(-26px) rotate(180deg);
  }
`

const nomeSubindo = keyframes`
  from {
    transform: translateY(36px);
  opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const SobreposicaoGol = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  animation: ${pulsoFundo} 0.7s ease-in-out infinite alternate;
`

const BolaGol = styled.div`
  font-size: clamp(3rem, 9vw, 5.5rem);
  animation: ${bolaQuicando} 0.9s ease-in-out infinite;
`

const TextoGol = styled.div`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(4.5rem, 20vw, 13rem);
  font-weight: 700;
  letter-spacing: clamp(4px, 1.5vw, 14px);
  line-height: 1.05;
  color: ${({ $cor }) => $cor};
  animation:
    ${textoEntrando} 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both,
    ${brilhoTexto} 0.9s ease-in-out infinite alternate;
`

const NomeTimeGol = styled.div`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(1.3rem, 4.5vw, 2.6rem);
  font-weight: 700;
  letter-spacing: clamp(4px, 1vw, 10px);
  color: #fff;
  animation: ${nomeSubindo} 0.55s 0.18s ease both;
`

export default function Placar() {
  const estado = usePlacar()
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

  const { timeCasa, timeVisitante, cronometro, periodo } = estado
  const tempo = formatarTempo(segundosAtuais(cronometro))
  const corGol = golAtivo?.lado === 'casa' ? theme.cores.primaria : theme.cores.azul
  const nomeTimeGol =
    golAtivo?.lado === 'casa'
      ? timeCasa.nome || 'TIME DA CASA'
      : timeVisitante.nome || 'VISITANTE'

  return (
    <Tela>
      <Voltar to="/hub" title="Voltar ao hub">←</Voltar>

      <Marca>
        <img src="https://i.imgur.com/zmQCbYc.png" alt="" />
        <span>PELOTENSE ESPORTES</span>
      </Marca>

      <Periodo>{periodo}</Periodo>

      <PainelPlacar>
        <Time $destaque="casa">
          <div className="nome">{timeCasa.nome || 'TIME DA CASA'}</div>
          <div className="gols">{timeCasa.gols}</div>
        </Time>

        <Centro>
          <div className="tempo">{tempo}</div>
          <div className="status">
            <Ponto $ativo={cronometro.rodando} />
            {cronometro.rodando ? 'AO VIVO' : 'CRONÔMETRO PARADO'}
          </div>
        </Centro>

        <Time $destaque="visitante">
          <div className="nome">{timeVisitante.nome || 'VISITANTE'}</div>
          <div className="gols">{timeVisitante.gols}</div>
        </Time>
      </PainelPlacar>

      {golAtivo && (
        <SobreposicaoGol key={golAtivo.em} $cor={corGol}>
          <BolaGol>⚽</BolaGol>
          <TextoGol $cor={corGol}>GOOOOL!</TextoGol>
          <NomeTimeGol>{nomeTimeGol}</NomeTimeGol>
        </SobreposicaoGol>
      )}
    </Tela>
  )
  }

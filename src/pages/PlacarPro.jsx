import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { usePlacarPro } from '../hooks/usePlacarPro'
import { segundosAtuais, formatarTempo } from '../store/placarProStore'

const Tela = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(20px, 4vw, 40px);
  background:
    radial-gradient(ellipse at 50% 40%, rgba(34, 197, 94, 0.04), transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.04), transparent 50%),
    #060b14;
  padding: 32px;
`

const Periodo = styled.div`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(0.85rem, 2vw, 1.2rem);
  font-weight: 700;
  letter-spacing: 6px;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 36px;
  border-radius: 999px;
`

const Painel = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(24px, 5vw, 64px);
  padding: clamp(32px, 6vw, 56px) clamp(28px, 5vw, 56px);
  background: linear-gradient(180deg, #0d1420, #0a0f1a);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03),
    0 24px 80px rgba(0, 0, 0, 0.6);
`

const LadoTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: clamp(140px, 22vw, 200px);
  padding: 0 clamp(8px, 2vw, 16px);

  .nome {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: clamp(1rem, 2.5vw, 1.6rem);
    font-weight: 700;
    letter-spacing: 2px;
    text-align: center;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.9);
    position: relative;
    padding-bottom: 14px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 48px;
      height: 3px;
      border-radius: 2px;
      background: ${({ $cor }) => $cor};
    }
  }

  .gols {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: clamp(3.5rem, 12vw, 7.5rem);
    font-weight: 700;
    line-height: 1;
    color: #ffffff;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
  }
`

const pulsarPonto = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
`

const Centro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 0 clamp(12px, 3vw, 28px);

  .tempo {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-variant-numeric: tabular-nums;
    font-size: clamp(2rem, 6vw, 3.8rem);
    font-weight: 700;
    letter-spacing: 2px;
    color: ${({ theme }) => theme.cores.primaria};
    text-shadow: 0 0 20px rgba(34, 197, 94, 0.35);
    min-width: 4em;
    text-align: center;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: clamp(0.6rem, 1.2vw, 0.75rem);
    font-weight: 700;
    letter-spacing: 3px;
    color: ${({ $rodando }) => ($rodando ? '#22c55e' : 'rgba(255,255,255,0.25)')};
    text-transform: uppercase;
    transition: color 0.3s ease;
  }
`

const Ponto = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $ativo, theme }) => ($ativo ? theme.cores.primaria : 'rgba(255,255,255,0.2)')};
  box-shadow: ${({ $ativo }) =>
    $ativo ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'};
  animation: ${({ $ativo }) => ($ativo ? pulsarPonto : 'none')} 1.2s ease-in-out infinite;
`

const Marca = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.25;

  span {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.85rem;
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
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
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
  from { background: radial-gradient(circle at center, ${({ $cor }) => $cor}26, rgba(6, 11, 20, 0.94) 70%); }
  to { background: radial-gradient(circle at center, ${({ $cor }) => $cor}5c, rgba(6, 11, 20, 0.94) 70%); }
`

const textoEntrando = keyframes`
  0% { transform: scale(0.15) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`

const brilhoTexto = keyframes`
  from { text-shadow: 0 0 24px ${({ $cor }) => $cor}, 0 0 70px ${({ $cor }) => $cor}80; }
  to { text-shadow: 0 0 50px ${({ $cor }) => $cor}, 0 0 140px ${({ $cor }) => $cor}cc; }
`

const bolaQuicando = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-24px) rotate(180deg); }
`

const nomeSubindo = keyframes`
  from { transform: translateY(36px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`

const SobreposicaoGol = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  animation: ${pulsoFundo} 0.7s ease-in-out infinite alternate;
`

const BolaGol = styled.div`
  font-size: clamp(2.5rem, 8vw, 5rem);
  animation: ${bolaQuicando} 0.9s ease-in-out infinite;
`

const TextoGol = styled.div`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(3.5rem, 18vw, 12rem);
  font-weight: 700;
  letter-spacing: clamp(4px, 1.5vw, 12px);
  line-height: 1.05;
  color: ${({ $cor }) => $cor};
  animation:
    ${textoEntrando} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both,
    ${brilhoTexto} 0.9s ease-in-out infinite alternate;
`

const NomeTimeGol = styled.div`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: clamp(1.1rem, 4vw, 2.2rem);
  font-weight: 700;
  letter-spacing: clamp(4px, 1vw, 8px);
  color: #fff;
  animation: ${nomeSubindo} 0.5s 0.15s ease both;
`

export default function PlacarPro() {
  const estado = usePlacarPro()
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

  const { timeCasa, timeVisitante, cronometro, periodo, corCasa, corVisitante } = estado
  const tempo = formatarTempo(segundosAtuais(cronometro))
  const corGol = golAtivo?.lado === 'casa' ? corCasa : corVisitante
  const nomeTimeGol =
    golAtivo?.lado === 'casa'
      ? timeCasa.nome || 'TIME CASA'
      : timeVisitante.nome || 'VISITANTE'

  return (
    <Tela>
      <Voltar to="/" title="Voltar ao hub">←</Voltar>

      <Periodo>{estado.periodo}</Periodo>

      <Painel>
        <LadoTime $cor={estado.corCasa}>
          <div className="nome">{timeCasa.nome || 'TIME CASA'}</div>
          <div className="gols">{timeCasa.gols}</div>
        </LadoTime>

        <Centro $rodando={cronometro.rodando}>
          <div className="tempo">{tempo}</div>
          <div className="status">
            <Ponto $ativo={cronometro.rodando} />
            {cronometro.rodando ? 'AO VIVO' : 'PARADO'}
          </div>
        </Centro>

        <LadoTime $cor={estado.corVisitante}>
          <div className="nome">{timeVisitante.nome || 'VISITANTE'}</div>
          <div className="gols">{timeVisitante.gols}</div>
        </LadoTime>
      </Painel>

      <Marca>
        <span>PELOTENSE ESPORTES</span>
      </Marca>

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

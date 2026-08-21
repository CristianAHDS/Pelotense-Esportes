import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast'
import { segundosAtuais, formatarTempo } from '../store/placarBroadcastStore'

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
  gap: 48px;
`

const BarraPlacar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
`

const FaixaTempo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 6px 28px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 6px 6px 0 0;
  backdrop-filter: blur(4px);

  .tempo {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #ffffff;
  }

  .periodo {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
  }
`

const CorpoPlacar = styled.div`
  display: flex;
  align-items: stretch;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
`

const BlocoTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 10px 24px;
  background: ${({ $cor }) => $cor};
  min-width: 140px;

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
  }
`

const Separador = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);

  span {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
  }
`

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 20px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  backdrop-filter: blur(4px);

  .label {
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${({ $ativo }) => ($ativo ? '#22c55e' : '#ffffff')};
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
  background: #22c55e;
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
  from { background: radial-gradient(circle at center, rgba(255,215,0,0.15), rgba(5, 8, 16, 0.96) 70%); }
  to { background: radial-gradient(circle at center, rgba(255,215,0,0.35), rgba(5, 8, 16, 0.96) 70%); }
`

const textoEntrando = keyframes`
  0% { transform: scale(0.15) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`

const brilhoTexto = keyframes`
  from { text-shadow: 0 0 24px rgba(255,215,0,0.9), 0 0 70px rgba(255,215,0,0.4); }
  to { text-shadow: 0 0 50px rgba(255,215,0,1), 0 0 140px rgba(255,215,0,0.6); }
`

const bolaEntrando = keyframes`
  0% { opacity: 0; transform: scale(0.2) rotate(-30deg); }
  50% { opacity: 1; transform: scale(1.3) rotate(15deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
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
  animation: ${pulsoFundo} 0.8s ease-in-out infinite alternate;
`

const BolaGol = styled.div`
  font-size: 3rem;
  animation: ${bolaEntrando} 1s ease forwards;
`

const TextoGol = styled.div`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: clamp(3rem, 16vw, 10rem);
  font-weight: 900;
  letter-spacing: 2px;
  color: #ffd700;
  animation:
    ${textoEntrando} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
    ${brilhoTexto} 1s ease-in-out infinite alternate;
`

const NomeTimeGol = styled.div`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 4px;
  color: #fff;
  opacity: 0;
  animation: fadeIn 0.4s 0.2s ease forwards;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

const Marca = styled.div`
  opacity: 0.2;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
`

export default function PlacarBroadcast() {
  const estado = usePlacarBroadcast()
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

  const { timeCasa, timeVisitante, cronometro, periodo, estadoPartida } = estado
  const tempo = formatarTempo(segundosAtuais(cronometro))
  const nomeTimeGol =
    golAtivo?.lado === 'casa'
      ? timeCasa.nome
      : timeVisitante.nome

  return (
    <Tela>
      <Voltar to="/" title="Voltar ao hub">←</Voltar>

      <BarraPlacar>
        <FaixaTempo>
          <span className="periodo">{periodo}</span>
          <span className="tempo">{tempo}</span>
        </FaixaTempo>

        <CorpoPlacar>
          <BlocoTime $cor={estado.corCasa} style={{ borderLeft: `6px solid ${estado.corCasaBorda}` }}>
            <span className="sigla">{timeCasa.nome}</span>
            <span className="gols">{timeCasa.gols}</span>
          </BlocoTime>

          <Separador>
            <span>×</span>
          </Separador>

          <BlocoTime $cor={estado.corVisitante} style={{ borderRight: `6px solid ${estado.corVisitanteBorda}` }}>
            <span className="gols">{timeVisitante.gols}</span>
            <span className="sigla">{timeVisitante.nome}</span>
          </BlocoTime>
        </CorpoPlacar>
      </BarraPlacar>

      <StatusBar $ativo={cronometro.rodando}>
        {cronometro.rodando && <Ponto />}
        <span className="label">{estadoPartida}</span>
      </StatusBar>

      <Marca>PELOTENSE ESPORTES</Marca>

      {golAtivo && (
        <SobreposicaoGol key={golAtivo.em}>
          <BolaGol>⚽</BolaGol>
          <TextoGol>GOL!</TextoGol>
          <NomeTimeGol>{nomeTimeGol}</NomeTimeGol>
        </SobreposicaoGol>
      )}
    </Tela>
  )
}

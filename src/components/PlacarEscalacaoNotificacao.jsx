import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { SubstituicaoCartao } from './SubstituicaoCartao'

const VERDE = '#a5ef1c'
const AMARELO = '#eab308'
const VERMELHO = '#dc2626'

const entrar = keyframes`
  from { transform: translateX(-24px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`

const Cartao = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 300px;
  max-width: 420px;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(8, 10, 14, 0.92);
  border-left: 6px solid ${({ $cor }) => $cor};
  box-shadow: 0 14px 44px -10px rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(6px);
  font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
  animation: ${entrar} 0.35s cubic-bezier(0.2, 0.9, 0.25, 1);
`

const Rotulo = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  ${({ $tipo, $cor }) =>
    $tipo === 'cartao'
      ? `background: ${$cor}; color: ${$cor === AMARELO ? '#0a0f00' : '#fff'};`
      : `background: ${$cor || VERDE}; color: #04140a;`};
`

const Linha = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;

  .topo {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;

    .sigla {
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 1px;
      color: #fff;
    }

    .minuto {
      flex-shrink: 0;
      font-size: 0.7rem;
      font-weight: 700;
      color: ${VERDE};
      font-variant-numeric: tabular-nums;
    }
  }

  .principal {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.5px;
    color: #fff;
  }

  .evento {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.55);
  }
`

const Marca = styled.span`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 22px;
  height: 30px;
  border-radius: 3px;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.35);
  background: ${({ $cor }) => $cor};
`

export function PlacarEscalacaoNotificacao({ notificacao, tempoMinuto }) {
  const [atual, setAtual] = useState(notificacao)
  const [, forcarTick] = useState(0)

  useEffect(() => {
    const i = setInterval(() => forcarTick((t) => t + 1), 1000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    if (notificacao) {
      if (Date.now() - (notificacao.em || 0) > 9000) {
        setAtual(null)
        return undefined
      }
      setAtual(notificacao)
      const t = setTimeout(() => setAtual(null), 6000)
      return () => clearTimeout(t)
    }
    return undefined
  }, [notificacao?.id])

  if (!atual) return null

  if (atual.tipo === 'cartao') {
    const cor = atual.cor === 'amarelo' ? AMARELO : VERMELHO
    return (
      <Cartao $cor={cor}>
        <Marca $cor={cor} />
        <Linha>
          <div className="topo">
            <span className="sigla">{atual.sigla || 'TIME'}</span>
            {tempoMinuto && <span className="minuto">{tempoMinuto}</span>}
          </div>
          <span className="principal">
            {atual.nome || `Jogador ${(atual.indice || 0) + 1}`}
            {atual.num ? ` · ${atual.num}` : ''}
          </span>
          <span className="evento">
            Cartão {atual.cor === 'amarelo' ? 'amarelo' : 'vermelho'}
          </span>
        </Linha>
      </Cartao>
    )
  }
  const cor = atual.cor || VERDE
  return (
    <SubstituicaoCartao
      dados={{
        corTime: cor,
        siglaTime: atual.sigla || 'TIME',
        nomeTime: atual.nome || '',
        escudoTime: undefined,
        minuto: atual.minuto || tempoMinuto,
        saiNum: atual.saiNum,
        saiNome: atual.saiNome || 'Sai',
        entraNum: atual.entraNum,
        entraNome: atual.entraNome || 'Entra',
      }}
    />
  )
}

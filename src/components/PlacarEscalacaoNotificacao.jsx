import { useEffect, useState } from 'react'
import { SubstituicaoCartao } from './SubstituicaoCartao'

const VERDE = '#a5ef1c'

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

  const corTime =
    atual.tipo === 'cartao' ? atual.corTime || VERDE : atual.cor || VERDE
  const sigla = atual.sigla || 'TIME'
  const nomeTime = atual.nome || ''
  const minuto =
    atual.minuto != null ? `${atual.minuto}'` : tempoMinuto

  return (
    <SubstituicaoCartao
      dados={{
        tipo: atual.tipo,
        corTime,
        siglaTime: sigla,
        nomeTime,
        escudoTime: undefined,
        minuto,
        cartaoCor: atual.cor,
        saiNum: atual.saiNum ?? atual.num,
        saiNome: atual.saiNome ?? (atual.nome || `Jogador ${(atual.indice || 0) + 1}`),
        entraNum: atual.entraNum,
        entraNome: atual.entraNome || 'Entra',
      }}
    />
  )
}

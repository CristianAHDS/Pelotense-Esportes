import { useEffect, useState } from 'react'
import { inscreverStatusControle, reivindicarControle } from '../lib/sincronizacaoNuvem'

/* Observa quem detém o controle exclusivo da sala.
   Com autoReivindicar, assume o controle na primeira interação do usuário
   enquanto ele estiver livre. */
export function useControleRemoto({ autoReivindicar = false } = {}) {
  const [status, setStatus] = useState('verificando')

  useEffect(() => inscreverStatusControle(setStatus), [])

  useEffect(() => {
    if (!autoReivindicar || status !== 'livre') return undefined
    const tentar = () => {
      reivindicarControle()
    }
    document.addEventListener('pointerdown', tentar)
    document.addEventListener('keydown', tentar)
    return () => {
      document.removeEventListener('pointerdown', tentar)
      document.removeEventListener('keydown', tentar)
    }
  }, [autoReivindicar, status])

  return { status, assumir: () => reivindicarControle({ forcar: true }) }
}

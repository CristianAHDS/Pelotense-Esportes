import { useState, useEffect } from 'react'
import { getEstado, inscrever } from '../store/placarNormalStore'

export function usePlacarNormal(loja) {
  const pegarEstado = loja?.getEstado ?? getEstado
  const seInscrever = loja?.inscrever ?? inscrever
  const [estado, setEstadoLocal] = useState(pegarEstado)

  useEffect(() => {
    return seInscrever(setEstadoLocal)
  }, [])

  return estado
}

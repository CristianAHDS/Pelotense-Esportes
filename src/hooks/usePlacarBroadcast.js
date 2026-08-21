import { useState, useEffect } from 'react'
import { getEstado, inscrever } from '../store/placarBroadcastStore'

export function usePlacarBroadcast() {
  const [estado, setEstadoLocal] = useState(getEstado)

  useEffect(() => {
    return inscrever(setEstadoLocal)
  }, [])

  return estado
}

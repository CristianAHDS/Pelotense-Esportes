import { useState, useEffect } from 'react'
import { getEstado, inscrever } from '../store/placarProStore'

export function usePlacarPro() {
  const [estado, setEstadoLocal] = useState(getEstado)

  useEffect(() => {
    return inscrever(setEstadoLocal)
  }, [])

  return estado
}

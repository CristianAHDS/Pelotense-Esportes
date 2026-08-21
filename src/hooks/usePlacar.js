import { useEffect, useState } from 'react'
import { getEstado, inscrever } from '../store/placarStore'

export function usePlacar() {
  const [estado, setEstadoLocal] = useState(getEstado)

  useEffect(() => inscrever(setEstadoLocal), [])

  return estado
}

import { useEffect } from 'react'
import { usePlacarBroadcast } from './usePlacarBroadcast'

export function useDocumentoJogo(loja) {
  const estado = usePlacarBroadcast(loja)
  useEffect(() => {
    const casa = estado?.timeCasa?.nome || 'HOME'
    const fora = estado?.timeVisitante?.nome || 'AWAY'
    const gcasa = estado?.timeCasa?.gols ?? 0
    const gfora = estado?.timeVisitante?.gols ?? 0
    document.title = `${casa} ${gcasa}×${gfora} ${fora}`
  }, [
    estado?.timeCasa?.nome,
    estado?.timeVisitante?.nome,
    estado?.timeCasa?.gols,
    estado?.timeVisitante?.gols
  ])
  return estado
}
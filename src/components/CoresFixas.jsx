import styled from 'styled-components'

/* Mesma paleta fixa dos placares broadcast */
const CORES_PRESET = [
  { fundo: '#008F3D', nome: 'Verde' },
  { fundo: '#1a56db', nome: 'Azul' },
  { fundo: '#dc2626', nome: 'Vermelho' },
  { fundo: '#eab308', nome: 'Amarelo' },
  { fundo: '#ea580c', nome: 'Laranja' },
  { fundo: '#7c3aed', nome: 'Roxo' },
  { fundo: '#1f1f1f', nome: 'Preto' },
  { fundo: '#e5e5e5', nome: 'Branco' },
  { fundo: '#4b5563', nome: 'Cinza' },
  { fundo: '#0891b2', nome: 'Ciano' },
  { fundo: '#059669', nome: 'Esmeralda' },
  { fundo: '#db2777', nome: 'Rosa' }
]

const Grade = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`

const Swatch = styled.button`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ $ativo }) => ($ativo ? '#fff' : 'transparent')};
  border-radius: 6px;
  padding: 0;
  cursor: pointer;
  background: ${({ $cor }) => $cor};
  transition:
    border-color 0.15s ease,
    transform 0.1s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
  }

  ${({ $ativo }) =>
    $ativo &&
    `
    transform: scale(1.08);
    box-shadow: 0 0 0 1px rgba(165, 239, 28, 0.8);
  `}
`

/* Grade de cores pré-definidas — substitui o picker nativo,
   que oscilava sob sincronização. */
export function CoresFixas({ valor, onChange }) {
  return (
    <Grade>
      {CORES_PRESET.map((p) => (
        <Swatch
          key={p.nome}
          $cor={p.fundo}
          $ativo={String(valor || '').toLowerCase() === p.fundo.toLowerCase()}
          onClick={() => onChange(p.fundo)}
          title={p.nome}
        />
      ))}
    </Grade>
  )
}

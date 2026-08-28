import styled from 'styled-components';

export const SIGLAS_PADRAO = [
  'APA',
  'AIM',
  'BAG',
  'BFR',
  'BRA',
  'ESP',
  'GAU',
  'GLO',
  'GRA',
  'GUA',
  'LAJ',
  'PAS',
  'PEL',
  'SCR',
  'UFR',
  'VER',
];

const Seletor = styled.select`
  width: 100%;
  min-width: 0;
  background: #000;
  border: 1px solid #262626;
  border-radius: 8px;
  padding: 9px 10px;
  color: #fff;
  font-size: 0.85rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: inherit;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition: border-color 120ms ease;

  &:focus {
    outline: none;
    border-color: #a5ef1c;
  }

  option {
    background: #0d0d0d;
    color: #fff;
    text-transform: uppercase;
  }
`;

export function SeletorSigla({ value = '', onChange, placeholder = 'SIGLA' }) {
  const atual = String(value || '').toUpperCase();
  const opcoes = [...SIGLAS_PADRAO];
  if (atual && !opcoes.includes(atual)) opcoes.unshift(atual);

  return (
    <Seletor
      value={atual}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {opcoes.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Seletor>
  );
}
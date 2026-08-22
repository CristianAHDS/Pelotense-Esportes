import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { getEstado, inscrever } from '../store/substituicaoStore';
import { SubstituicaoCartao } from '../components/SubstituicaoCartao';
import { useFundoTransparente } from '../components/useFundoTransparente';

const Palco = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  padding: 48px;
`;

export default function Substituicao() {
  const estado = usePlacarBroadcast({ getEstado, inscrever });
  useFundoTransparente();

  if (!estado.visivel) return <Palco />;

  return (
    <Palco>
      <SubstituicaoCartao dados={estado} />
    </Palco>
  );
}

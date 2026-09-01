import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { escalacao } from '../store/escalacaoStore';
import { EscalacaoCartao } from '../components/EscalacaoCartao';
import { useFundoTransparente } from '../components/useFundoTransparente';
import { BotaoAlternarTema } from '../components/BotaoAlternarTema';

const Palco = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 40px;
  flex-wrap: wrap;

  @media (max-width: 720px) {
    align-items: flex-start;
    gap: 20px;
  }
`;

export default function Escalacao() {
  const estado = usePlacarBroadcast(escalacao);
  useFundoTransparente();

  if (!estado.visivel) return <Palco />;

  return (
    <Palco>
      <BotaoAlternarTema />
      <EscalacaoCartao dados={estado} lado="casa" />
      <EscalacaoCartao dados={estado} lado="fora" />
    </Palco>
  );
}

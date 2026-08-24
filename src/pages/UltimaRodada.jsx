import { useRef } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { ultimaRodada } from '../store/ultimaRodadaStore';
import { UltimaRodadaCartao } from '../components/UltimaRodadaCartao';
import { useFundoTransparente } from '../components/useFundoTransparente';
import { BotaoSalvarImagem } from '../components/BotaoSalvarImagem';

const Palco = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  @media (max-width: 720px) {
    align-items: flex-start;
    padding: 24px;
  }
`;

export default function UltimaRodada() {
  const estado = usePlacarBroadcast(ultimaRodada);
  useFundoTransparente();
  const cartaoRef = useRef(null);
  const emPrevia = new URLSearchParams(window.location.search).has('previa');

  return (
    <Palco>
      {!emPrevia && (
        <BotaoSalvarImagem
          alvo={cartaoRef}
          nome={estado.titulo || 'ultima-rodada'}
        />
      )}
      <UltimaRodadaCartao ref={cartaoRef} dados={estado} />
    </Palco>
  );
}

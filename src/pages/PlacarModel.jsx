import { useRef } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { getEstado, inscrever } from '../store/placarModelStore';
import { PlacarModelCartao } from '../components/PlacarModelCartao';
import { useFundoTransparente } from '../components/useFundoTransparente';
import { BotaoSalvarImagem } from '../components/BotaoSalvarImagem';
import { BotaoAlternarTema } from '../components/BotaoAlternarTema';

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

export default function PlacarModel() {
  const estado = usePlacarBroadcast({ getEstado, inscrever });
  useFundoTransparente();
  const cartaoRef = useRef(null);
  const emPrevia = new URLSearchParams(window.location.search).has('previa');

  return (
    <Palco>
      {!emPrevia && (
        <>
          <BotaoAlternarTema aoLado />
          <BotaoSalvarImagem alvo={cartaoRef} nome="placar-model" />
        </>
      )}
      <PlacarModelCartao ref={cartaoRef} dados={estado} />
    </Palco>
  );
}
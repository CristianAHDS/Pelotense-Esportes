import { useRef } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { artilheiros } from '../store/artilheirosStore';
import { ArtilheirosCartao } from '../components/ArtilheirosCartao';
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

export default function Artilheiros() {
  const estado = usePlacarBroadcast(artilheiros);
  useFundoTransparente();
  const cartaoRef = useRef(null);
  const emPrevia = new URLSearchParams(window.location.search).has('previa');

  return (
    <Palco>
      {!emPrevia && (
        <BotaoSalvarImagem alvo={cartaoRef} nome={estado.titulo || 'artilheiros'} />
      )}
      <ArtilheirosCartao ref={cartaoRef} dados={estado} />
    </Palco>
  );
}
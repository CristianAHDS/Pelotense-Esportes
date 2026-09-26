import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { rodadaAtual } from '../store/rodadaAtualStore';
import { importarRodadaAtualSuperPlacar } from '../services/superPlacarService';
import { RodadaAtualCartao } from '../components/RodadaAtualCartao';
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

export default function RodadaAtual() {
  useFundoTransparente();

  useEffect(() => {
    const atualizar = () =>
      importarRodadaAtualSuperPlacar({ forcar: true })
        .then((dados) => rodadaAtual.preencherDaRodada(dados))
        .catch((e) =>
          console.warn('Rodada Atual: falha ao atualizar do SuperPlacar.', e),
        );
    atualizar();
    const intervalo = setInterval(atualizar, 30_000);
    return () => clearInterval(intervalo);
  }, []);

  const estado = usePlacarBroadcast(rodadaAtual);
  const cartaoRef = useRef(null);
  const emPrevia = new URLSearchParams(window.location.search).has('previa');

  return (
    <Palco>
      {!emPrevia && (
        <>
          <BotaoAlternarTema aoLado />
          <BotaoSalvarImagem alvo={cartaoRef} nome={estado.titulo || 'rodada-atual'} />
        </>
      )}
      <RodadaAtualCartao ref={cartaoRef} dados={estado} />
    </Palco>
  );
}

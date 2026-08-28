import styled from 'styled-components';
import { Header } from '../components/Header';
import { PainelPlacarModel } from '../components/PainelPlacarModel';
import { PreviaOverlay } from '../components/PreviaOverlay';

const Container = styled.main`
  min-height: 100vh;
  padding: 32px 24px 48px;
`;

const Conteudo = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  margin-top: 40px;
`;

export default function ControlePlacarModel() {
  return (
    <Container>
      <Header subtitulo="Controle · Placar Model" />
      <Conteudo>
        <PainelPlacarModel />
        <PreviaOverlay rota="/placar-model" altura={220} />
      </Conteudo>
    </Container>
  );
}

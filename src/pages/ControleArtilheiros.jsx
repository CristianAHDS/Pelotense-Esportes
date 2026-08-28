import styled from 'styled-components';
import { Header } from '../components/Header';
import { PainelArtilheiros } from '../components/PainelArtilheiros';
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

export default function ControleArtilheiros() {
  return (
    <Container>
      <Header subtitulo="Controle · Artilheiros" />
      <Conteudo>
        <PainelArtilheiros />
        <PreviaOverlay rota="/artilheiros" altura={420} />
      </Conteudo>
    </Container>
  );
}

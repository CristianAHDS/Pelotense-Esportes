import styled from 'styled-components';
import { Header } from '../components/Header';
import { PainelPreJogo } from '../components/PainelPreJogo';
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

export default function ControlePreJogo() {
  return (
    <Container>
      <Header subtitulo="Controle · Pré-Jogo" />
      <Conteudo>
        <PainelPreJogo />
        <PreviaOverlay rota="/pre-jogo" altura={220} />
      </Conteudo>
    </Container>
  );
}

import styled from 'styled-components';
import { Header } from '../components/Header';
import { PainelEscalacao } from '../components/PainelEscalacao';
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

export default function ControleEscalacao() {
  return (
    <Container>
      <Header subtitulo="Controle · Escalação" />
      <Conteudo>
        <PainelEscalacao />
        <PreviaOverlay rota="/escalacao" altura={520} />
      </Conteudo>
    </Container>
  );
}

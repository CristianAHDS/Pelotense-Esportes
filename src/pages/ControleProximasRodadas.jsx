import styled from 'styled-components';
import { Header } from '../components/Header';
import { PainelProximasRodadas } from '../components/PainelProximasRodadas';
import { PreviaOverlay } from '../components/PreviaOverlay';

const Container = styled.main`
  min-height: 100vh;
  padding: 32px 24px 48px;
`;

const Conteudo = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

export default function ControleProximasRodadas() {
  return (
    <Container>
      <Header subtitulo="Controle · Próxima Rodada" />
      <Conteudo>
        <PainelProximasRodadas />
        <PreviaOverlay rota="/proximas-rodadas" altura={420} />
      </Conteudo>
    </Container>
  );
}

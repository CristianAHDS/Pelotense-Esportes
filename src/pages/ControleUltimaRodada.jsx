import styled from 'styled-components';
import { Header } from '../components/Header';
import { PainelUltimaRodada } from '../components/PainelUltimaRodada';
import { PreviaOverlay } from '../components/PreviaOverlay';

const Container = styled.main`
  min-height: 100vh;
  padding: 32px 24px 48px;
`;

const Conteudo = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

export default function ControleUltimaRodada() {
  return (
    <Container>
      <Header subtitulo="Controle · Última Rodada" />
      <Conteudo>
        <PainelUltimaRodada />
        <PreviaOverlay rota="/ultima-rodada" altura={420} />
      </Conteudo>
    </Container>
  );
}

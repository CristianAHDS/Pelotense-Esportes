import styled from 'styled-components';
import { Header } from '../components/Header';
import { PainelSubstituicao } from '../components/PainelSubstituicao';
import { PreviaOverlay } from '../components/PreviaOverlay';

const Container = styled.main`
  min-height: 100vh;
  padding: 32px 24px 48px;
`;

const Conteudo = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

export default function ControleSubstituicao() {
  return (
    <Container>
      <Header subtitulo="Controle · Substituição" />
      <Conteudo>
        <PainelSubstituicao />
        <PreviaOverlay rota="/substituicao" altura={260} />
      </Conteudo>
    </Container>
  );
}

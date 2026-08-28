import styled from 'styled-components';
import { Header } from '../components/Header';
import { PainelPlacarModel } from '../components/PainelPlacarModel';
import { PainelSubstituicao } from '../components/PainelSubstituicao';
import { PreviaOverlay } from '../components/PreviaOverlay';
import { substituicaoPro } from '../store/substituicaoStore';

const Container = styled.main`
  min-height: 100vh;
  padding: 32px 24px 48px;
`;

const Conteudo = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  margin-top: 40px;
`;

const GradePainel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

export default function ControlePlacarModel() {
  return (
    <Container>
      <Header subtitulo="Controle · Placar Model" />
      <Conteudo>
        <PainelPlacarModel />
        <GradePainel>
          <PainelSubstituicao loja={substituicaoPro} />
        </GradePainel>
        <PreviaOverlay rota="/placar-model" altura={220} />
      </Conteudo>
    </Container>
  );
}
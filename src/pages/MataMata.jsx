import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useFundoTransparente } from '../components/useFundoTransparente';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { getEstado, inscrever } from '../store/mataMataStore';
import { PainelOitavas } from '../components/PainelOitavas';
import { BotaoAlternarTema } from '../components/BotaoAlternarTema';

const ACC = '#a5ef1c';

const Tela = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: ${({ $previa }) => ($previa ? '10px 12px 16px' : '64px 24px 48px')};
  background: transparent;
`;

const Voltar = styled(Link)`
  align-self: flex-start;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto 0;
  text-decoration: none;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.cores.textoSuave};
  &:hover {
    color: ${({ theme }) => theme.cores.texto};
  }
`;

const CartaoCabecalho = styled.header`
  width: 100%;
  max-width: 1280px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 24px;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.cores.superficie},
    ${({ theme }) => theme.cores.fundoClaro}
  );
  border: 1px solid rgba(252, 252, 251, 0.09);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 60px -30px rgba(0, 0, 0, 0.8);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${ACC};
  }

  h1 {
    margin: 0;
    font-family: ${({ theme }) => theme.fontes.corpo};
    font-size: clamp(1.15rem, 2.6vw, 1.55rem);
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    line-height: 1.1;
    color: ${({ theme }) => theme.cores.texto};
  }

  span.sub {
    display: block;
    margin-top: 3px;
    font-family: 'Inter', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(252, 252, 251, 0.45);
  }
`;

const BadgeFase = styled.div`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #0a0f00;
  background: ${ACC};
  padding: 7px 16px;
  border-radius: 999px;
  white-space: nowrap;
`;

export default function MataMata() {
  useFundoTransparente();
  const estado = usePlacarBroadcast({ getEstado, inscrever });
  const emPrevia = new URLSearchParams(window.location.search).has('previa');

  return (
    <Tela $previa={emPrevia}>
      {!emPrevia && <Voltar to="/hub" title="Voltar ao hub">←</Voltar>}
      {!emPrevia && <BotaoAlternarTema />}

      <CartaoCabecalho>
        <div>
          <h1>{estado.competicao}</h1>
          <span className="sub">Fase final · Mata-mata</span>
        </div>
        <BadgeFase>{estado.fase}</BadgeFase>
      </CartaoCabecalho>

      <PainelOitavas estado={estado} />
    </Tela>
  );
}

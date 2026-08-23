import styled from 'styled-components';
import { ListaOitavas } from './ListaOitavas';

/* Painel independente com os confrontos das oitavas de final */

const ACC = '#a5ef1c';

const Cartao = styled.section`
  width: 100%;
  max-width: 1280px;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.cores.superficie},
    ${({ theme }) => theme.cores.fundoClaro}
  );
  border: 1px solid rgba(252, 252, 251, 0.09);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 60px -30px rgba(0, 0, 0, 0.8);
`;

const TituloSecao = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 22px;
  border-bottom: 1px solid rgba(252, 252, 251, 0.08);
  background: linear-gradient(90deg, rgba(165, 239, 28, 0.08), transparent 55%);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${ACC};
  }

  h2 {
    margin: 0;
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fcfcfb;
  }

  span {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: rgba(252, 252, 251, 0.4);
  }
`;

const Rolagem = styled.div`
  overflow-x: auto;
`;

export function PainelOitavas({ estado }) {
  return (
    <Cartao>
      <TituloSecao>
        <h2>Oitavas de final</h2>
        <span>{(estado.confrontos || []).length} CONFRONTOS</span>
      </TituloSecao>
      <Rolagem>
        <ListaOitavas confrontos={estado.confrontos} />
      </Rolagem>
    </Cartao>
  );
}

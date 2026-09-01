import styled from 'styled-components';
import { Chaveamento } from './Chaveamento';

/* Painel independente com o chaveamento das fases finais (quartas -> final) */

const ACC = '#a5ef1c';

const Cartao = styled.section`
  width: 100%;
  max-width: 1280px;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.cores.superficie},
    ${({ theme }) => theme.cores.fundoClaro}
  );
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 60px -30px rgba(0, 0, 0, 0.5);
`;

const TituloSecao = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 22px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
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
    color: ${({ theme }) => theme.cores.texto};
  }

  span {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: ${({ theme }) => theme.cores.textoSuave};
  }
`;

const Rolagem = styled.div`
  overflow-x: auto;
`;

const Rodape = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 20px;
  border-top: 1px solid rgba(252, 252, 251, 0.07);
  background: rgba(255, 255, 255, 0.02);

  .legenda {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(252, 252, 251, 0.5);

    i {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      background: ${ACC};
    }
  }
`;

const SeloAoVivo = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(252, 252, 251, 0.5);

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.cores.perigo};
    animation: pulsoChaveamento 1.2s ease-in-out infinite;
  }

  @keyframes pulsoChaveamento {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }
`;

export function PainelChaveamento({ estado }) {
  return (
    <Cartao>
      <TituloSecao>
        <h2>Fases finais</h2>
        <span>QUARTAS · SEMIFINAL · FINAL</span>
      </TituloSecao>
      <Rolagem>
        <Chaveamento estado={estado} fases={['quartas', 'semi', 'final']} />
      </Rolagem>
      <Rodape>
        <span className="legenda">
          <i />
          Vencedor do confronto
        </span>
        <SeloAoVivo>Sincronizado em tempo real</SeloAoVivo>
      </Rodape>
    </Cartao>
  );
}

import styled from 'styled-components';
import { Header } from '../components/Header';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { tabelaCompacta } from '../store/tabelaCompactaStore';
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

const Cartao = styled.section`
  background: #0d0d0d;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  padding: 24px;
`;

const Titulo = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 18px;

  span {
    color: #a5ef1c;
  }
`;

const Rotulo = styled.span`
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
`;

const LinhaOpcao = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  margin-top: 12px;
  border: 1px solid #1f1f1f;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 120ms ease;

  &:hover {
    border-color: rgba(165, 239, 28, 0.4);
  }

  .texto {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .desc {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Switch = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 46px;
  height: 26px;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? '#a5ef1c' : '#262626')};
  transition: background 150ms ease;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? '23px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ $on }) => ($on ? '#0a0f00' : '#ddd')};
    transition: left 150ms ease;
  }
`;

export default function ControleTabelaCompacta() {
  const estado = usePlacarBroadcast(tabelaCompacta);

  return (
    <Container>
      <Header subtitulo="Controle · Tabela Compacta" />
      <Conteudo>
        <Cartao>
          <Titulo>
            <span>●</span> Tabela Compacta
          </Titulo>

          <LinhaOpcao>
            <div className="texto">
              <Rotulo>Separar em 2 colunas</Rotulo>
              <span className="desc">
                Mostra à esquerda os 8 primeiros e à direita os 8 últimos.
              </span>
            </div>
            <input
              type="checkbox"
              checked={estado.dividir}
              onChange={(e) => tabelaCompacta.definirDivisao(e.target.checked)}
              style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
              }}
            />
            <Switch $on={estado.dividir} />
          </LinhaOpcao>
        </Cartao>
        <PreviaOverlay rota="/tabela-compacta" altura={420} />
      </Conteudo>
    </Container>
  );
}

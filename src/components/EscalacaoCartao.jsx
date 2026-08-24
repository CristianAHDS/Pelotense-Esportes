import styled, { keyframes } from 'styled-components';
import { Escudo } from './Escudo';

const VERDE = '#a5ef1c';

export function urlEscudoTime(escudo, sigla) {
  if (escudo) return escudo;
  const s = String(sigla || '').toUpperCase();
  return /^[A-Z]{3,4}$/.test(s) ? `/escudos/${s}.png` : null;
}

const Entrada = keyframes`
  from {
    transform: translateY(-16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Cartao = styled.div`
  display: flex;
  flex-direction: column;
  width: 340px;
  border-radius: 10px;
  overflow: hidden;
  border-left: 6px solid ${({ $cor }) => $cor};
  box-shadow: 0 14px 44px -14px rgba(0, 0, 0, 0.75);
  animation: ${Entrada} 0.4s cubic-bezier(0.2, 0.9, 0.25, 1);
  font-family: 'Inter', 'Roboto', 'Arial', sans-serif;

  @media (max-width: 420px) {
    width: 300px;
  }
`;

const FaixaTopo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #000;

  .sigla {
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #fff;
  }

  .nome {
    flex: 1;
    min-width: 0;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .formacao {
    flex-shrink: 0;
    padding: 3px 12px;
    border-radius: 999px;
    background: ${VERDE};
    color: #0a0f00;
    font-family: 'Rajdhani', 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 2px;
    font-variant-numeric: tabular-nums;
  }
`;

const LinhaJogador = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #000;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.07);
  }

  .num {
    min-width: 26px;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
    font-weight: 700;
    color: ${VERDE};
  }

  .nome {
    flex: 1;
    min-width: 0;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
  }

  .nome.vazio {
    color: rgba(255, 255, 255, 0.28);
    font-weight: 500;
  }
`;

function corContraste(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5 ? '#000' : '#fff';
}

/* dados: estado do escalacaoStore; lado: 'casa' | 'fora' */
export function EscalacaoCartao({ dados, lado }) {
  const casa = lado === 'casa';
  const cor = casa ? dados.corCasa || '#008F3D' : dados.corFora || '#1d4ed8';
  const sigla = casa ? dados.siglaCasa : dados.siglaFora;
  const nomeTime = casa ? dados.nomeCasa : dados.nomeFora;
  const formacao = casa ? dados.formacaoCasa : dados.formacaoFora;
  const jogadores = (dados.jogadores?.[lado] || []).slice(0, 11);

  return (
    <Cartao $cor={cor}>
      <FaixaTopo>
        <Escudo cor={cor} sigla={sigla} url={urlEscudoTime(null, sigla)} tamanho={26} />
        <span className="sigla">{sigla}</span>
        <span className="nome">{nomeTime}</span>
        <span className="formacao">{formacao}</span>
      </FaixaTopo>
      {jogadores.map((jogador, i) => (
        <LinhaJogador key={`${lado}-${i}`}>
          <span className="num">{jogador.num || i + 1}</span>
          <span className={`nome${jogador.nome ? '' : ' vazio'}`}>
            {jogador.nome || `Jogador ${i + 1}`}
          </span>
        </LinhaJogador>
      ))}
    </Cartao>
  );
}

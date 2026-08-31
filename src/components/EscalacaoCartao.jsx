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
  width: 380px;
  border-radius: 10px;
  overflow: hidden;
  border-left: 6px solid ${VERDE};
  box-shadow: 0 14px 44px -14px rgba(0, 0, 0, 0.75);
  animation: ${Entrada} 0.4s cubic-bezier(0.2, 0.9, 0.25, 1);
  font-family: 'Inter', 'Roboto', 'Arial', sans-serif;

  @media (max-width: 420px) {
    width: 320px;
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

  .marcas {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  ${({ $expulso }) =>
    $expulso &&
    `
      background: #161616;
      .num {
        color: #a5ef1c;
      }
      .nome {
        color: #9a9a9a;
        text-decoration: line-through;
      }
    `}
`;

const CartaoMarca = styled.span`
  display: inline-block;
  width: 11px;
  height: 15px;
  border-radius: 2px;
  box-shadow: inset 0 -1.6px 0 rgba(0, 0, 0, 0.35);
  background: ${({ $cor }) => ($cor === 'amarelo' ? '#eab308' : '#dc2626')};
`;

const BolaGol = styled.span`
  display: inline-block;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  font-size: 0.92rem;
  line-height: 1;
`;

const GolBadge = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
`;

const LinhaTecnico = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: #000;
  border-top: 1px solid ${VERDE}33;

  .rotulo {
    font-family: 'Rajdhani', 'Inter', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: ${VERDE};
  }

  .nome {
    flex: 1;
    min-width: 0;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(255, 255, 255, 0.85);
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
  const tecnico = casa ? dados.tecnicoCasa : dados.tecnicoFora;
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
        <LinhaJogador key={`${lado}-${i}`} $expulso={jogador.expulso}>
          <span className="num">{jogador.num || i + 1}</span>
          <span className={`nome${jogador.nome ? '' : ' vazio'}`}>
            {jogador.nome || `Jogador ${i + 1}`}
          </span>
          {(jogador.gols > 0 ||
            jogador.cartoes?.amarelo > 0 ||
            jogador.cartoes?.vermelho > 0) && (
            <span className="marcas">
              {jogador.gols > 0 && (
                <GolBadge>
                  {Array(jogador.gols)
                    .fill(null)
                    .map((_, gi) => (
                      <BolaGol key={gi}>⚽</BolaGol>
                    ))}
                </GolBadge>
              )}
              {Array(jogador.cartoes?.amarelo || 0)
                .fill('amarelo')
                .map((c, ci) => <CartaoMarca key={`am-${i}-${ci}`} $cor={c} />)}
              {Array(jogador.cartoes?.vermelho || 0)
                .fill('vermelho')
                .map((c, ci) => <CartaoMarca key={`vm-${i}-${ci}`} $cor={c} />)}
            </span>
          )}
        </LinhaJogador>
      ))}
      {tecnico && (
        <LinhaTecnico>
          <span className="rotulo">TÃ‰C</span>
          <span className="nome">{tecnico}</span>
        </LinhaTecnico>
      )}
    </Cartao>
  );
}

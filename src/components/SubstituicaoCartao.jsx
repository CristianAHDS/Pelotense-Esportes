import styled, { keyframes } from 'styled-components';
import { Escudo } from './Escudo';

const VERDE = '#a5ef1c';
const VERMELHO = '#ef4444';

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

const BolaGolIcon = styled.span`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.82rem;
  background: radial-gradient(circle at 35% 30%, #ffffff, #dcdcdc);
  box-shadow: inset -2px -3px 4px rgba(0, 0, 0, 0.35);
  color: #04140a;
`;

const CartaoGolIcon = styled.span`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 800;
  color: #04140a;
  background: ${({ $cor }) => ($cor === 'amarelo' ? '#eab308' : '#ef4444')};
`;

const Cartao = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 380px;
  border-radius: 10px;
  overflow: hidden;
  border-left: 6px solid ${({ $cor }) => $cor};
  box-shadow: 0 14px 44px -14px rgba(0, 0, 0, 0.75);
  animation: ${Entrada} 0.4s cubic-bezier(0.2, 0.9, 0.25, 1);
  font-family: 'Inter', 'Roboto', 'Arial', sans-serif;

  @media (max-width: 520px) {
    min-width: 300px;
}
`;

const FaixaTopo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
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

  .minuto {
    flex-shrink: 0;
    padding: 3px 12px;
    border-radius: 999px;
    background: ${({ $cor }) => $cor};
    color: ${({ $corTexto }) => $corTexto};
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1px;
    font-variant-numeric: tabular-nums;
}
`;

const RotuloAcao = styled.span`
    flex-shrink: 0;
  margin-left: auto;
  padding-left: 14px;
  font-size: 0.58rem;
    font-weight: 700;
  letter-spacing: 2.5px;
    text-transform: uppercase;
  color: ${({ $tipo }) => ($tipo === 'sai' ? VERMELHO : VERDE)};
`;

const EscudoEvento = styled.span`
  flex-shrink: 0;
  margin-left: auto;
  padding-left: 14px;
  display: flex;
  align-items: center;
`;

const LinhaJogador = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 16px;
  background: #000;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    background: ${({ $destaque }) =>
      $destaque
        ? 'linear-gradient(90deg, rgba(165, 239, 28, 0.22), rgba(165, 239, 28, 0.06)), #000'
        : '#000'};
}

  .seta {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  display: flex;
  align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 800;
    color: #04140a;

    &.sai {
      background: ${VERMELHO};
}

    &.entra {
      background: ${VERDE};
}
}

  .num {
    min-width: 26px;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-size: 1.05rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
}

  .nome {
    flex: 1;
    min-width: 0;
    font-size: 0.92rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    white-space: nowrap;
  overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ $tipo }) => ($tipo === 'sai' ? 'rgba(255,255,255,.42)' : '#fff')};
    text-decoration: ${({ $tipo }) => ($tipo === 'sai' ? 'line-through' : 'none')};
}
`;

function corContraste(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5 ? '#000' : '#fff';
}

/* dados: estado do substituicaoStore */
export function SubstituicaoCartao({ dados }) {
  const cor = dados.corTime || '#16a34a';
  const temMinuto = Boolean(dados.minuto);
  const evento = dados.tipo || 'troca';

  if (evento === 'gol' || evento === 'cartao') {
    const isGol = evento === 'gol';
    const rotulo = isGol ? null : `Cartão ${dados.cartaoCor === 'amarelo' ? 'Amarelo' : 'Vermelho'}`;
    return (
      <Cartao $cor={cor}>
        <FaixaTopo $cor={cor} $corTexto={corContraste(cor)}>
          <Escudo
            cor={cor}
            sigla={dados.siglaTime}
            url={urlEscudoTime(dados.escudoTime, dados.siglaTime)}
            tamanho={24}
          />
          <span className="sigla">{dados.siglaTime}</span>
          <span className="nome">{dados.nomeTime}</span>
          {temMinuto && <span className="minuto">{dados.minuto}</span>}
        </FaixaTopo>
        <LinhaJogador $tipo={isGol ? 'gol' : 'sai'} $destaque>
          {isGol ? (
            <BolaGolIcon>⚽</BolaGolIcon>
          ) : (
            <CartaoGolIcon $cor={dados.cartaoCor} />
          )}
          <span className="num">{dados.saiNum}</span>
          <span className="nome">{dados.saiNome}</span>
          {isGol ? (
            <EscudoEvento>
              <Escudo
                cor={cor}
                sigla={dados.siglaTime}
                url={urlEscudoTime(dados.escudoTime, dados.siglaTime)}
                tamanho={26}
              />
            </EscudoEvento>
          ) : (
            <RotuloAcao $tipo="sai">{rotulo}</RotuloAcao>
          )}
        </LinhaJogador>
      </Cartao>
    );
  }

  return (
    <Cartao $cor={cor}>
      <FaixaTopo $cor={cor} $corTexto={corContraste(cor)}>
        <Escudo
          cor={cor}
          sigla={dados.siglaTime}
          url={urlEscudoTime(dados.escudoTime, dados.siglaTime)}
          tamanho={24}
        />
        <span className="sigla">{dados.siglaTime}</span>
        <span className="nome">{dados.nomeTime}</span>
        {temMinuto && <span className="minuto">{dados.minuto}</span>}
      </FaixaTopo>
      <LinhaJogador $tipo="sai">
        <span className="seta sai">↓</span>
        <span className="num">{dados.saiNum}</span>
        <span className="nome">{dados.saiNome}</span>
        <RotuloAcao $tipo="sai">Sai</RotuloAcao>
      </LinhaJogador>
      <LinhaJogador $tipo="entra" $destaque>
        <span className="seta entra">↑</span>
        <span className="num">{dados.entraNum}</span>
        <span className="nome">{dados.entraNome}</span>
        <RotuloAcao $tipo="entra">Entra</RotuloAcao>
      </LinhaJogador>
    </Cartao>
  );
}

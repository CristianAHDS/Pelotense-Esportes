import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Moldura = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: ${({ $tamanho }) => $tamanho}px;
`;

const Img = styled.img`
  max-height: ${({ $tamanho }) => $tamanho}px;
  max-width: ${({ $tamanho }) => $tamanho * 0.95}px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45));
`;

const Svg = styled.svg`
  display: block;
  flex-shrink: 0;
  width: ${({ $tamanho }) => $tamanho}px;
  height: auto;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45));

  .campo {
    fill: ${({ $cor }) => $cor || '#4b5563'};
    stroke: rgba(255, 255, 255, 0.5);
    stroke-width: 1;
  }

  .faixa {
    fill: rgba(0, 0, 0, 0.28);
  }

  .brilho {
    fill: rgba(255, 255, 255, 0.18);
  }

  text {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-weight: 700;
    fill: #fff;
    text-anchor: middle;
    paint-order: stroke;
    stroke: rgba(0, 0, 0, 0.55);
    stroke-width: 2.4;
    stroke-linejoin: round;
  }
`;

function EscudoSvg({ cor, sigla, tamanho }) {
  const texto = String(sigla || '---').toUpperCase().slice(0, 4);
  return (
    <Svg viewBox="0 0 24 27" $cor={cor} $tamanho={tamanho} aria-hidden="true">
      <path
        className="campo"
        d="M12 1 L22 4.6 V12.5 C22 19 17.6 23.6 12 26 C6.4 23.6 2 19 2 12.5 V4.6 Z"
      />
      <path className="brilho" d="M12 1 L22 4.6 V10 H12 Z" />
      <rect className="faixa" x="2" y="11" width="20" height="8.5" />
      <text
        x="12"
        y={texto.length >= 4 ? 17.6 : 18}
        fontSize={texto.length >= 4 ? 6.4 : texto.length === 3 ? 7.4 : 8.6}
        letterSpacing={texto.length >= 4 ? 0.4 : 0.8}
      >
        {texto}
      </text>
      <path
        d="M12 1 L22 4.6 V12.5 C22 19 17.6 23.6 12 26 C6.4 23.6 2 19 2 12.5 V4.6 Z"
        fill="none"
        stroke="rgba(0,0,0,.4)"
        strokeWidth="0.6"
      />
    </Svg>
  );
}

export function Escudo({ cor, sigla, url, tamanho = 22 }) {
  const [erro, setErro] = useState(false);
  useEffect(() => setErro(false), [url]);

  if (url && !erro) {
    return (
      <Moldura $tamanho={tamanho}>
        <Img
          src={url}
          alt=""
          $tamanho={tamanho}
          draggable={false}
          onError={() => setErro(true)}
        />
      </Moldura>
    );
  }
  return <EscudoSvg cor={cor} sigla={sigla} tamanho={tamanho} />;
}

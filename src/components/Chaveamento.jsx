import styled from 'styled-components';
import { Escudo } from './Escudo';

/* Chaveamento das fases finais — visual de bracket com conectores em cotovelo,
   chips de placar e selo de campeão. Paleta da landing: fundo escuro + acento #A5EF1C. */

const ACC = '#a5ef1c';
const NEUTRO = 'rgba(252, 252, 251, 0.08)';
const TRILHO = 'rgba(165, 239, 28, 0.3)';

function urlEscudo(lado) {
  if (lado.escudo) return lado.escudo;
  const sigla = String(lado.sigla || '').toUpperCase();
  return /^[A-Z]{3,4}$/.test(sigla) ? `/escudos/${sigla}.png` : null;
}

function vazio(lado) {
  return !lado || (lado.sigla === '---' && !lado.nome);
}

function vencedorDe(c) {
  const gc = c.casa?.gols;
  const gv = c.visitante?.gols;
  if (gc != null && gv != null && gc !== gv) return gc > gv ? 'casa' : 'visitante';
  const pc = c.casa?.pen;
  const pv = c.visitante?.pen;
  if (pc != null && pv != null && pc !== pv) return pc > pv ? 'casa' : 'visitante';
  return null;
}

/* ---------- Estrutura ---------- */

const Grade = styled.div`
  display: flex;
  gap: 30px;
  padding: 22px 18px 20px;
  overflow-x: auto;

  @media (max-width: 760px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Coluna = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 218px;
  flex: 1;

  &:not(:last-child) {
    position: relative;
  }
`;

const Piloto = styled.div`
  display: flex;
  justify-content: center;
`;

const RotuloPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 3px;
  color: rgba(252, 252, 251, 0.6);
  padding: 7px 16px;
  border: 1px solid rgba(165, 239, 28, 0.28);
  border-radius: 999px;
  background: rgba(165, 239, 28, 0.05);

  b {
    color: ${ACC};
    font-weight: 800;
  }
`;

const Pares = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 18px;
`;

/* Par = dois jogos que alimentam a mesma vaga da fase seguinte */
const Par = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* trilho vertical ligando os dois jogos do par */
  &::before {
    content: '';
    position: absolute;
    right: -19px;
    top: 48px;
    bottom: 48px;
    width: 0;
    border-left: 1.5px solid ${TRILHO};
  }

  /* segmento horizontal até a próxima fase */
  &::after {
    content: '';
    position: absolute;
    right: -31px;
    top: 50%;
    width: 13px;
    border-top: 1.5px solid ${TRILHO};
  }

  ${(p) =>
    p.$ultimo &&
    `
    &::before,
    &::after {
      display: none;
    }
  `}
`;

const CartaoJogo = styled.div`
  position: relative;
  min-height: 96px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: linear-gradient(180deg, #121212, #0a0a0a);
  border: 1px solid ${NEUTRO};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    background: linear-gradient(90deg, ${ACC}, transparent 70%);
    opacity: 0.5;
  }

  ${(p) =>
    p.$destaque &&
    `
    border-color: rgba(165, 239, 28, 0.45);
    box-shadow:
      0 0 0 1px rgba(165, 239, 28, 0.15),
      0 16px 38px -20px rgba(165, 239, 28, 0.35);

    &::before {
      opacity: 1;
    }
  `}
`;

const Lado = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;

  & + & {
    border-top: 1px solid rgba(252, 252, 251, 0.05);
  }

  ${(p) =>
    p.$venceu &&
    `
    background: linear-gradient(90deg, rgba(165, 239, 28, 0.09), transparent 65%);
    box-shadow: inset 3px 0 0 ${ACC};
  `}
  ${(p) => p.$perdeu && `opacity: 0.45;`}
`;

const ChipEscudo = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #171717;
  border: 1.5px solid ${({ $cor }) => $cor || NEUTRO};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Info = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Sigla = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  line-height: 1;
  color: ${({ $venceu }) => ($venceu ? ACC : '#fcfcfb')};

  i {
    font-style: normal;
    color: rgba(252, 252, 251, 0.32);
    margin-right: 5px;
  }
`;

const NomeTime = styled.span`
  font-size: 0.58rem;
  letter-spacing: 0.5px;
  color: rgba(252, 252, 251, 0.4);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChipGol = styled.span`
  min-width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #181818;
  border: 1px solid ${NEUTRO};
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;

  b {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.95rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: ${({ $venceu }) => ($venceu ? ACC : '#fcfcfb')};
  }

  small {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.52rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: ${ACC};
    margin-top: 1px;
  }
`;

const ChipVazio = styled.span`
  width: 14px;
  height: 3px;
  border-radius: 2px;
  background: rgba(252, 252, 251, 0.15);
`;

const Indefinido = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 3px;
  color: rgba(252, 252, 251, 0.26);

  & + & {
    border-top: 1px solid rgba(252, 252, 251, 0.05);
  }
`;

const FaixaCampeao = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 10px;
  background: linear-gradient(90deg, ${ACC}, rgba(165, 239, 28, 0.75));
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: #0a0f00;
`;

/* ---------- Peças ---------- */

function LinhoLado({ indice, lado, estado }) {
  const rotulo = ['CASA', 'FORA'][indice];

  if (vazio(lado)) {
    return <Indefinido>A DEFINIR</Indefinido>;
  }

  return (
    <Lado $venceu={estado === 'venceu'} $perdeu={estado === 'perdeu'}>
      <ChipEscudo $cor={lado.cor}>
        <Escudo cor={lado.cor} sigla={lado.sigla} url={urlEscudo(lado)} tamanho={20} />
      </ChipEscudo>
      <Info>
        <Sigla $venceu={estado === 'venceu'}>
          <i>{rotulo}</i>
          {lado.sigla}
        </Sigla>
        <NomeTime>{lado.nome}</NomeTime>
      </Info>
      {lado.gols != null ? (
        <ChipGol $venceu={estado === 'venceu'}>
          <b>{lado.gols}</b>
          {lado.pen != null && <small>{lado.pen}P</small>}
        </ChipGol>
      ) : (
        <ChipVazio />
      )}
    </Lado>
  );
}

function Jogo({ confronto, destaque }) {
  const venc = vencedorDe(confronto);
  const est = (nomeLado) => (venc == null ? '' : venc === nomeLado ? 'venceu' : 'perdeu');
  const campeao = destaque && venc != null ? confronto[venc] : null;

  return (
    <CartaoJogo $destaque={!!campeao}>
      <LinhoLado indice={0} lado={confronto.casa} estado={est('casa')} />
      <LinhoLado indice={1} lado={confronto.visitante} estado={est('visitante')} />
      {campeao && <FaixaCampeao>CAMPEÃO · {campeao.sigla}</FaixaCampeao>}
    </CartaoJogo>
  );
}

function agruparEmPares(jogos) {
  const pares = [];
  for (let i = 0; i < jogos.length; i += 2) {
    pares.push(jogos.slice(i, i + 2));
  }
  return pares.length ? pares : [[]];
}

export function Chaveamento({ estado, fases }) {
  const todas = [
    { chave: 'confrontos', rotulo: 'OITAVAS' },
    { chave: 'quartas', rotulo: 'QUARTAS' },
    { chave: 'semi', rotulo: 'SEMIFINAL' },
    { chave: 'final', rotulo: 'FINAL' },
  ];
  const colunas = fases ? todas.filter((c) => fases.includes(c.chave)) : todas;
  const ultima = colunas[colunas.length - 1]?.chave;

  return (
    <Grade>
      {colunas.map((col) => {
        const jogos = estado[col.chave] || [];
        return (
          <Coluna key={col.chave}>
            <Piloto>
              <RotuloPill>
                {col.rotulo} · <b>{jogos.length}</b>
              </RotuloPill>
            </Piloto>
            <Pares>
              {agruparEmPares(jogos).map((par, pi) => (
                <Par key={pi} $ultimo={col.chave === ultima}>
                  {par.map((c, ji) => (
                    <Jogo
                      key={`${col.chave}-${pi}-${ji}`}
                      confronto={c}
                      destaque={col.chave === ultima}
                    />
                  ))}
                </Par>
              ))}
            </Pares>
          </Coluna>
        );
      })}
    </Grade>
  );
}

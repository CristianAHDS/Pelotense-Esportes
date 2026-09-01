import styled from 'styled-components';
import { Escudo } from './Escudo';

/* Lista dos confrontos de oitavas no formato tabela (JOGO · CASA · GOL × GOL · VISITANTE) */

const ACC = '#a5ef1c';

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

const Grade = styled.div`
  min-width: 680px;
`;

const LinhaCabecalho = styled.div`
  display: grid;
  grid-template-columns: 70px minmax(0, 1fr) 72px 36px 72px minmax(0, 1fr);
  align-items: center;
  padding: 10px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.superficieHover};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: ${({ theme }) => theme.cores.textoSuave};

  .centro {
    text-align: center;
    color: ${ACC};
  }
`;

const LinhaJogo = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 70px minmax(0, 1fr) 72px 36px 72px minmax(0, 1fr);
  align-items: stretch;
  padding: 0 18px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};

  &:last-child {
    border-bottom: none;
  }

  .num {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.cores.textoSuave};

    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${ACC};
      opacity: 0.85;
    }
  }
`;

const TimeCasa = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
  padding: 11px 8px 11px 0;

  .nome {
    font-size: 0.72rem;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.cores.textoSuave};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sigla {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: ${({ theme, $destaque }) =>
      $destaque === 'sim' ? ACC : theme.cores.texto};
    opacity: ${({ $destaque }) => ($destaque === 'fora' ? 0.45 : 1)};
    white-space: nowrap;
  }

  &.vazio {
    opacity: 0.3;
  }
`;

const TimeVisitante = styled(TimeCasa)`
  justify-content: flex-start;
  padding: 11px 0 11px 8px;
`;

const Placar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  padding: 8px 0;

  .gol {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    color: ${({ $destaque }) => ($destaque === 'sim' ? ACC : 'inherit')};
    opacity: ${({ $destaque }) => ($destaque === 'fora' ? 0.45 : 1)};
  }

  .pen {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: ${ACC};
  }

  .traco {
    width: 14px;
    height: 2px;
    background: ${({ theme }) => theme.cores.borda};
  }
`;

const Separador = styled.div`
  align-self: center;
  justify-self: center;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.cores.textoSuave};
  padding: 0 4px;
`;

function Gol({ lado, destaque }) {
  return (
    <Placar $destaque={destaque}>
      {lado.gols != null ? <span className="gol">{lado.gols}</span> : <span className="traco" />}
      {lado.pen != null && <span className="pen">({lado.pen})</span>}
    </Placar>
  );
}

export function ListaOitavas({ confrontos }) {
  return (
    <Grade>
      <LinhaCabecalho>
        <span>JOGO</span>
        <span style={{ textAlign: 'right' }}>CASA</span>
        <span className="centro">GOL</span>
        <span className="centro">×</span>
        <span className="centro">GOL</span>
        <span>VISITANTE</span>
      </LinhaCabecalho>

      {(confrontos || []).map((c, i) => {
        const venc = vencedorDe(c);
        const dest = (ladoNome) =>
          venc == null ? '' : venc === ladoNome ? 'sim' : 'fora';
        return (
          <LinhaJogo key={i}>
            <span className="num">
              <i />
              {String(i + 1).padStart(2, '0')}
            </span>
            <TimeCasa className={vazio(c.casa) ? 'vazio' : ''} $destaque={dest('casa')}>
              <span className="nome">{c.casa.nome}</span>
              <span className="sigla">{c.casa.sigla}</span>
              <Escudo cor={c.casa.cor} sigla={c.casa.sigla} url={urlEscudo(c.casa)} tamanho={26} />
            </TimeCasa>
            <Gol lado={c.casa} destaque={dest('casa')} />
            <Separador>×</Separador>
            <Gol lado={c.visitante} destaque={dest('visitante')} />
            <TimeVisitante className={vazio(c.visitante) ? 'vazio' : ''} $destaque={dest('visitante')}>
              <Escudo cor={c.visitante.cor} sigla={c.visitante.sigla} url={urlEscudo(c.visitante)} tamanho={26} />
              <span className="sigla">{c.visitante.sigla}</span>
              <span className="nome">{c.visitante.nome}</span>
            </TimeVisitante>
          </LinhaJogo>
        );
      })}
    </Grade>
  );
}

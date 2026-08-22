import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useFundoTransparente } from '../components/useFundoTransparente';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { getEstado, inscrever } from '../store/mataMataStore';
import { Escudo } from '../components/Escudo';

const ACENTO = '#f59e0b';

function urlEscudo(lado) {
  if (lado.escudo) return lado.escudo;
  const sigla = String(lado.sigla || '').toUpperCase();
  return /^[A-Z]{3,4}$/.test(sigla) ? `/escudos/${sigla}.png` : null;
}

function vazio(lado) {
  return lado.sigla === '---' && !lado.nome;
}

function vencedorDe(c) {
  const gc = c.casa.gols;
  const gv = c.visitante.gols;
  if (gc != null && gv != null) {
    if (gc > gv) return 'casa';
    if (gv > gc) return 'visitante';
  }
  const pc = c.casa.pen;
  const pv = c.visitante.pen;
  if (pc != null && pv != null && pc !== pv) return pc > pv ? 'casa' : 'visitante';
  return null;
}

const Tela = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ $previa }) => ($previa ? '10px 12px 16px' : '64px 24px 48px')};
  background: transparent;
`;

const Voltar = styled(Link)`
  align-self: flex-start;
  max-width: 1020px;
  width: 100%;
  margin: 0 auto 14px;
  text-decoration: none;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.cores.textoSuave};
  &:hover {
    color: ${({ theme }) => theme.cores.texto};
  }
`;

const Painel = styled.section`
  width: 100%;
  max-width: 1020px;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.cores.superficie},
    ${({ theme }) => theme.cores.fundoClaro}
  );
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 60px -30px rgba(0, 0, 0, 0.8);
`;

const Cabecalho = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 26px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.12), transparent 55%);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${ACENTO};
  }

  h1 {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: clamp(1.15rem, 2.6vw, 1.55rem);
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    line-height: 1.1;
  }

  span.sub {
    display: block;
    margin-top: 3px;
    font-family: 'Inter', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.textoSuave};
  }
`;

const BadgeFase = styled.div`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #431407;
  background: ${ACENTO};
  padding: 7px 16px;
  border-radius: 999px;
  white-space: nowrap;
`;

const Rolagem = styled.div`
  overflow-x: auto;
`;

const Grade = styled.div`
  min-width: 720px;
`;

const LinhaCabecalho = styled.div`
  display: grid;
  grid-template-columns: 70px minmax(0, 1fr) 72px 36px 72px minmax(0, 1fr);
  align-items: center;
  padding: 10px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
  background: rgba(255, 255, 255, 0.03);
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: ${({ theme }) => theme.cores.textoSuave};

  .centro {
    text-align: center;
    color: ${ACENTO};
  }
`;

const LinhaJogo = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 70px minmax(0, 1fr) 72px 36px 72px minmax(0, 1fr);
  align-items: stretch;
  padding: 0 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

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
      background: ${ACENTO};
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
    color: ${({ $destaque, theme }) =>
      $destaque === 'sim' ? '#22c55e' : $destaque === 'fora' ? 'rgba(148,163,184,.45)' : theme.cores.textoSuave};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sigla {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 1px;
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
    color: ${({ $destaque }) => ($destaque === 'sim' ? '#22c55e' : 'inherit')};
    opacity: ${({ $destaque }) => ($destaque === 'fora' ? 0.45 : 1)};
  }

  .pen {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: ${ACENTO};
  }

  .traco {
    width: 14px;
    height: 2px;
    background: rgba(255, 255, 255, 0.18);
  }
`;

const Separador = styled.div`
  align-self: center;
  justify-self: center;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.cores.textoSuave};
  opacity: 0.55;
  padding: 0 4px;
`;

const RodapePainel = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 20px;
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  background: rgba(255, 255, 255, 0.02);

  .legenda {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.textoSuave};

    i {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      background: #22c55e;
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
  color: ${({ theme }) => theme.cores.textoSuave};

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.cores.perigo};
    animation: pulsoMata 1.2s ease-in-out infinite;
  }

  @keyframes pulsoMata {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }
`;

function Gol({ lado, destaque }) {
  return (
    <Placar $destaque={destaque}>
      {lado.gols != null ? <span className="gol">{lado.gols}</span> : <span className="traco" />}
      {lado.pen != null && <span className="pen">({lado.pen})</span>}
    </Placar>
  );
}

export default function MataMata() {
  useFundoTransparente();
  const estado = usePlacarBroadcast({ getEstado, inscrever });
  const emPrevia = new URLSearchParams(window.location.search).has('previa');

  return (
    <Tela $previa={emPrevia}>
      {!emPrevia && <Voltar to="/" title="Voltar ao hub">←</Voltar>}

      <Painel>
        <Cabecalho>
          <div>
            <h1>{estado.competicao}</h1>
            <span className="sub">Fase final · Mata-mata</span>
          </div>
          <BadgeFase>{estado.fase}</BadgeFase>
        </Cabecalho>

        <Rolagem>
          <Grade>
            <LinhaCabecalho>
              <span>JOGO</span>
              <span style={{ textAlign: 'right' }}>CASA</span>
              <span className="centro">GOL</span>
              <span className="centro">×</span>
              <span className="centro">GOL</span>
              <span>VISITANTE</span>
            </LinhaCabecalho>

            {estado.confrontos.map((c, i) => {
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
        </Rolagem>

        <RodapePainel>
          <span className="legenda">
            <i />
            Vencedor do confronto
          </span>
          <SeloAoVivo>Sincronizado em tempo real</SeloAoVivo>
        </RodapePainel>
      </Painel>
    </Tela>
  );
}

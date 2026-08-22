import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useFundoTransparente } from '../components/useFundoTransparente';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { getEstado, inscrever, placarDe, slotsVisiveis } from '../store/penaltisStore';
import { Escudo } from '../components/Escudo';

const ACENTO = '#22c55e';
const VERDE = '#22c55e';
const VERMELHO = '#ef4444';

function urlEscudo(lado) {
  if (lado.escudo) return lado.escudo;
  const sigla = String(lado.sigla || '').toUpperCase();
  return /^[A-Z]{3,4}$/.test(sigla) ? `/escudos/${sigla}.png` : null;
}

const Tela = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ $previa }) => ($previa ? '10px 12px 16px' : '64px 24px 48px')};
  background: transparent;
`;

const Voltar = styled(Link)`
  align-self: flex-start;
  max-width: 700px;
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
  max-width: 700px;
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
  padding: 18px 26px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.12), transparent 55%);

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
    font-size: clamp(1rem, 2.4vw, 1.3rem);
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    line-height: 1.15;
  }
`;

const Badge = styled.div`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #052e13;
  background: ${ACENTO};
  padding: 6px 14px;
  border-radius: 999px;
  white-space: nowrap;
`;

const Corpo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const LadoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;

  &:first-child {
    border-right: 1px solid ${({ theme }) => theme.cores.borda};
  }

  .ident {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 100%;
  }

  .nome {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .placar {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 3.4rem;
    font-weight: 700;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    color: #fff;
    text-shadow: 0 4px 30px rgba(34, 197, 94, 0.22);
  }
`;

const Cobrancas = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  min-height: 30px;
`;

const Slot = styled.span`
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.82rem;
  font-weight: 800;
  border: 2px solid rgba(255, 255, 255, 0.14);
  color: transparent;
  transition:
    transform 0.15s ease,
    border-color 0.2s ease,
    background 0.2s ease;

  &.gol {
    background: rgba(34, 197, 94, 0.16);
    border-color: ${VERDE};
    color: ${VERDE};
  }

  &.perdeu {
    background: rgba(239, 68, 68, 0.14);
    border-color: ${VERMELHO};
    color: ${VERMELHO};
  }

  &.atual {
    border-color: ${ACENTO};
    animation: pulsoPen 1.2s ease-in-out infinite;
  }

  &.morte {
    &.gol,
    &.perdeu {
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.35);
    }

    &:not(.gol):not(.perdeu) {
      border-style: dashed;
      border-color: rgba(245, 158, 11, 0.5);
    }
  }

  @keyframes pulsoPen {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.45);
    }
    50% {
      box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.08);
    }
  }
`;

const RodapePainel = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  background: rgba(255, 255, 255, 0.02);

  .legenda {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.textoSuave};

    i {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${VERDE};
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
    animation: pulsoPenVivo 1.2s ease-in-out infinite;
  }

  @keyframes pulsoPenVivo {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }
`;

function ColunaLado({ lado, total }) {
  const atual = lado.cobrancas.length;

  return (
    <LadoBox>
      <div className="ident">
        <Escudo cor={lado.cor} sigla={lado.sigla} url={urlEscudo(lado)} tamanho={30} />
        <span className="nome">{lado.nome || lado.sigla}</span>
      </div>
      <span className="placar">{placarDe(lado)}</span>
      <Cobrancas>
        {Array.from({ length: total }, (_, i) => {
          const c = lado.cobrancas[i] ?? null;
          const classes = [
            c === 'gol' ? 'gol' : '',
            c === 'perdeu' ? 'perdeu' : '',
            !c && i === atual ? 'atual' : '',
            i >= 5 ? 'morte' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <Slot key={i} className={classes} title={`Cobrança ${i + 1}`}>
              {c === 'gol' ? '✓' : c === 'perdeu' ? '✕' : ''}
            </Slot>
          );
        })}
      </Cobrancas>
    </LadoBox>
  );
}

export default function Penaltis() {
  useFundoTransparente();
  const estado = usePlacarBroadcast({ getEstado, inscrever });
  const emPrevia = new URLSearchParams(window.location.search).has('previa');

  return (
    <Tela $previa={emPrevia}>
      {!emPrevia && <Voltar to="/" title="Voltar ao hub">←</Voltar>}

      <Painel>
        <Cabecalho>
          <h1>{estado.competicao}</h1>
          <Badge>{estado.fase}</Badge>
        </Cabecalho>

        <Corpo>
          <ColunaLado lado={estado.casa} total={slotsVisiveis(estado)} />
          <ColunaLado lado={estado.visitante} total={slotsVisiveis(estado)} />
        </Corpo>

        <RodapePainel>
          <span className="legenda">
            <i />
            Cobrança convertida
          </span>
          <SeloAoVivo>Sincronizado em tempo real</SeloAoVivo>
        </RodapePainel>
      </Painel>
    </Tela>
  );
}

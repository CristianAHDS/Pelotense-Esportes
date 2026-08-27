import styled, { keyframes } from 'styled-components';
import { forwardRef, useMemo } from 'react';
import { Escudo } from './Escudo';
import { getEstado as getTabela } from '../store/tabelaStore';

const VERDE = '#a5ef1c';

function urlEscudo(sigla) {
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

const Quadro = styled.div`
  display: flex;
  flex-direction: column;
  width: min(620px, 100%);
  border-radius: 10px;
  overflow: hidden;
  border-top: 4px solid ${VERDE};
  box-shadow: 0 14px 44px -14px rgba(0, 0, 0, 0.75);
  animation: ${Entrada} 0.4s cubic-bezier(0.2, 0.9, 0.25, 1);
  font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.cores.superficie},
    ${({ theme }) => theme.cores.fundoClaro}
  );
`;

const Topo = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: linear-gradient(90deg, rgba(165, 239, 28, 0.14), transparent 55%), #000;

  .titulo {
    font-family: 'Rajdhani', 'Inter', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 3px;
    color: #fff;
  }

  .selo {
    margin-left: auto;
    padding: 3px 12px;
    border-radius: 999px;
    background: ${VERDE};
    color: #0a0f00;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
`;

const Legenda = styled.div`
  display: grid;
  grid-template-columns: 44px 28px minmax(0, 1fr) 72px;
  gap: 10px;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 2.5px;
  color: rgba(255, 255, 255, 0.45);
`;

const Linha = styled.div`
  display: grid;
  grid-template-columns: 44px 28px minmax(0, 1fr) 72px;
  gap: 10px;
  align-items: center;
  padding: 9px 16px;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  &:hover {
    background: rgba(165, 239, 28, 0.04);
  }

  .pos {
    font-family: 'Rajdhani', 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: ${VERDE};
    text-align: center;
  }

  .nome {
    font-size: 0.86rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .clube {
    font-size: 0.68rem;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gols {
    text-align: center;
    font-family: 'Rajdhani', 'Inter', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: ${VERDE};
  }
`;

const Vazio = styled.span`
  padding: 14px 16px;
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.35);
`;

/* dados: estado do artilheirosStore */
export const ArtilheirosCartao = forwardRef(function ArtilheirosCartao(
  { dados },
  ref
) {
  const mapaSiglaNome = useMemo(() => {
    const mapa = {};
    for (const t of getTabela().times || []) {
      if (t.sigla) mapa[t.sigla] = t.nome;
    }
    return mapa;
  }, []);

  const nomeTime = (sigla) => mapaSiglaNome[sigla] || sigla;

  return (
    <Quadro ref={ref}>
      <Topo>
        <span className="titulo">{dados.titulo || 'ARTILHEIROS'}</span>
        <span className="selo">GOLS</span>
      </Topo>

      <Legenda>
        <span className="pos">#</span>
        <span />
        <span>JOGADOR</span>
        <span style={{ textAlign: 'center' }}>GOLS</span>
      </Legenda>

      {(dados.jogadores || []).slice(0, 5).map((j, i) => (
        <Linha key={`jogador-${i}`}>
          <span className="pos">{i + 1}º</span>
          <Escudo cor="#1f1f1f" sigla={j.sigla} url={urlEscudo(j.sigla)} tamanho={26} />
          <div>
            <div className="nome">{j.nome || '—'}</div>
            {j.sigla && <div className="clube">{nomeTime(j.sigla)}</div>}
          </div>
          <span className="gols">{j.gols === '' ? '–' : j.gols}</span>
        </Linha>
      ))}

      {!dados.jogadores?.some((j) => j.nome) && <Vazio>Sem artilheiros cadastrados</Vazio>}
    </Quadro>
  );
});
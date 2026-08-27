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
  width: min(760px, 100%);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 14px 44px -14px rgba(0, 0, 0, 0.75);
  animation: ${Entrada} 0.4s cubic-bezier(0.2, 0.9, 0.25, 1);
  font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
`;

const Topo = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 26px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
  background: linear-gradient(90deg, rgba(165, 239, 28, 0.1), transparent 55%),
    ${({ theme }) => theme.cores.superficie};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${({ theme }) => theme.cores.primaria};
  }

  h1 {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: clamp(1.15rem, 2.6vw, 1.55rem);
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    line-height: 1.1;
    color: #fff;
  }

  .sub {
    display: block;
    margin-top: 3px;
    font-family: 'Inter', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.textoSuave};
  }

  .selo {
    flex-shrink: 0;
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #0a0f00;
    background: ${({ theme }) => theme.cores.primaria};
    padding: 7px 16px;
    border-radius: 999px;
    white-space: nowrap;
  }
`;

const Corpo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColunaJogos = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.cores.superficie},
    ${({ theme }) => theme.cores.fundoClaro}
  );
`;

const LinhaJogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 16px;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.07);
  }

  .placar {
    font-family: 'Rajdhani', 'Inter', sans-serif;
    font-variant-numeric: tabular-nums;
    font-size: 1.05rem;
    font-weight: 700;
    color: ${VERDE};
    white-space: nowrap;
  }
`;

const BlocoTime = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
  flex: 1;
  justify-content: ${({ $lado }) => ($lado === 'fora' ? 'flex-end' : 'flex-start')};

  .sigla {
    font-size: 0.74rem;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Vazio = styled.span`
  padding: 14px 16px;
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.35);
`;

const LegendaPosicoes = styled.span`
  padding: 10px 16px 0;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 2.5px;
  color: rgba(255, 255, 255, 0.45);
`;

const FaixaClassificacao = styled.div`
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.cores.superficie},
    ${({ theme }) => theme.cores.fundoClaro}
  );
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const FaixaPosicoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 16px 14px;
`;

const ChipTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 44px;

  .pos {
    font-family: 'Rajdhani', 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: ${VERDE};
  }
`;

/* dados: estado do ultimaRodadaStore */
export const UltimaRodadaCartao = forwardRef(function UltimaRodadaCartao(
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
        <div>
          <h1>{dados.titulo || 'ÚLTIMA RODADA'}</h1>
          <span className="sub">
            Resultados · Temporada {new Date().getFullYear()}
          </span>
        </div>
        <span className="selo">RESULTADOS</span>
      </Topo>

      <Corpo>
        <ColunaJogos>
          {(dados.jogos || []).map((jogo, i) => (
            <LinhaJogo key={`jogo-${i}`}>
              <BlocoTime $lado="casa">
                <Escudo cor="#1f1f1f" sigla={jogo.casaSigla} url={urlEscudo(jogo.casaSigla)} tamanho={26} />
                <span className="sigla">{nomeTime(jogo.casaSigla)}</span>
              </BlocoTime>
              <span className="placar">
                {jogo.casaGols === '' ? '–' : jogo.casaGols} × {jogo.foraGols === '' ? '–' : jogo.foraGols}
              </span>
              <BlocoTime $lado="fora">
                <span className="sigla">{nomeTime(jogo.foraSigla)}</span>
                <Escudo cor="#1f1f1f" sigla={jogo.foraSigla} url={urlEscudo(jogo.foraSigla)} tamanho={26} />
              </BlocoTime>
            </LinhaJogo>
          ))}
          {!dados.jogos?.some((j) => j.casaSigla || j.foraSigla) && (
            <Vazio>Sem jogos cadastrados</Vazio>
          )}
        </ColunaJogos>
      </Corpo>

      {dados.classificacaoVisivel !== false &&
        (dados.posicoes || []).some((p) => p.sigla) && (
        <FaixaClassificacao>
          <LegendaPosicoes>CLASSIFICAÇÃO</LegendaPosicoes>
          <FaixaPosicoes>
            {(dados.posicoes || []).map((p, i) => (
              <ChipTime key={`pos-${i}`}>
                <Escudo cor="#1f1f1f" sigla={p.sigla} url={urlEscudo(p.sigla)} tamanho={30} />
                <span className="pos">{p.pos === '' ? '–' : `${p.pos}º`}</span>
              </ChipTime>
            ))}
          </FaixaPosicoes>
        </FaixaClassificacao>
      )}
    </Quadro>
  );
});

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
  width: min(720px, 100%);
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
  background:
    linear-gradient(90deg, rgba(165, 239, 28, 0.1), transparent 55%),
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
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.cores.superficie},
    ${({ theme }) => theme.cores.fundoClaro}
  );
`;

const Rodada = styled.section`
  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
`;

const RodadaTitulo = styled.h2`
  padding: 12px 18px 4px;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${VERDE};
`;

const LinhaJogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 16px;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const BlocoTime = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
  flex: 1;
  justify-content: ${({ $lado }) =>
    $lado === 'fora' ? 'flex-end' : 'flex-start'};

  .sigla {
    font-size: 0.74rem;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Vs = styled.span`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
`;

const Vazio = styled.span`
  padding: 14px 16px;
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.35);
`;

/* dados: estado do proximasRodadasStore */
export const ProximasRodadasCartao = forwardRef(function ProximasRodadasCartao(
  { dados },
  ref,
) {
  const mapaSiglaNome = useMemo(() => {
    const mapa = {};
    for (const t of getTabela().times || []) {
      if (t.sigla) mapa[t.sigla] = t.nome;
    }
    return mapa;
  }, []);

  const nomeTime = (sigla) => mapaSiglaNome[sigla] || sigla;

  const temJogos = (dados.rodadas || []).some((r) =>
    r.jogos?.some((j) => j.casaSigla || j.foraSigla),
  );

  return (
    <Quadro ref={ref}>
      <Topo>
        <div>
          <h1>{dados.titulo || 'Próxima Rodada'}</h1>
          <span className="sub">
            Jogos · Temporada {new Date().getFullYear()}
          </span>
        </div>
        <span className="selo">AGENDA</span>
      </Topo>

      <Corpo>
        {(dados.rodadas || []).slice(0, 1).map((rodada, ri) => (
          <Rodada key={`rodada-${ri}`}>
            <RodadaTitulo>{rodada.titulo || `RODADA ${ri + 1}`}</RodadaTitulo>
            {(rodada.jogos || []).map((jogo, ji) => (
              <LinhaJogo key={`jogo-${ri}-${ji}`}>
                <BlocoTime $lado="casa">
                  <Escudo
                    cor="#1f1f1f"
                    sigla={jogo.casaSigla}
                    url={urlEscudo(jogo.casaSigla)}
                    tamanho={26}
                  />
                  <span className="sigla">{nomeTime(jogo.casaSigla)}</span>
                </BlocoTime>
                <Vs>×</Vs>
                <BlocoTime $lado="fora">
                  <span className="sigla">{nomeTime(jogo.foraSigla)}</span>
                  <Escudo
                    cor="#1f1f1f"
                    sigla={jogo.foraSigla}
                    url={urlEscudo(jogo.foraSigla)}
                    tamanho={26}
                  />
                </BlocoTime>
              </LinhaJogo>
            ))}
          </Rodada>
        ))}
        {!temJogos && <Vazio>Sem jogos agendados</Vazio>}
      </Corpo>
    </Quadro>
  );
});

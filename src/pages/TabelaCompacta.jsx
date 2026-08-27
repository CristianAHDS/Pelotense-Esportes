import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useFundoTransparente } from '../components/useFundoTransparente';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import {
  getEstado,
  inscrever,
  ordenarClassificacao,
  recarregar,
} from '../store/tabelaStore';
import { Escudo } from '../components/Escudo';
import { BotaoSalvarImagem } from '../components/BotaoSalvarImagem';
import { slugArquivo } from '../lib/capturaImagem';

const CORES_ZONA = {
  class: '#a5ef1c',
  reb: '#ef4444',
};

function zonaDa(pos, total) {
  if (pos <= Math.min(8, total)) return 'class';
  if (pos >= total - 1) return 'reb';
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
  max-width: 460px;
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
  max-width: 500px;
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
  background: linear-gradient(90deg, rgba(165, 239, 28, 0.1), transparent 55%);

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
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

const BadgeRodada = styled.div`
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
`;

const Grade = styled.div`
  min-width: 0;
`;

const LinhaCabecalho = styled.div`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 34px 30px 30px 30px 30px 40px;
  align-items: center;
  padding: 10px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
  background: rgba(255, 255, 255, 0.03);
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.cores.textoSuave};

  .num {
    text-align: center;
  }

  .destaque {
    color: ${({ theme }) => theme.cores.primaria};
  }
`;

const LinhaTime = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 34px 30px 30px 30px 30px 40px;
  align-items: center;
  padding: 10px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.12s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(165, 239, 28, 0.05);
  }

  .pos {
    position: relative;
    text-align: center;
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.9rem;
    font-weight: 700;
    color: ${({ theme }) => theme.cores.textoSuave};
    border-left: 4px solid transparent;
    padding-left: 14px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: -10px;
      bottom: -10px;
      width: 4px;
      background: ${({ $zona }) => CORES_ZONA[$zona] || 'transparent'};
    }
  }

  .time {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
    margin-left: 10px;
  }

  .nome {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.86rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .num {
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-size: 0.84rem;
    color: ${({ theme }) => theme.cores.textoSuave};
  }

  .pontos {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.95rem;
    font-weight: 700;
    color: ${({ theme }) => theme.cores.texto};
  }

  .saldoPos {
    color: #a5ef1c;
    font-weight: 600;
  }

  .saldoNeg {
    color: #ef4444;
    font-weight: 600;
  }
`;

function saldo(gp, gc) {
  const s = gp - gc;
  if (s > 0) return `+${s}`;
  return String(s);
}

const RodapePainel = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 20px;
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  background: rgba(255, 255, 255, 0.02);
`;

const Legenda = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.textoSuave};
  }

  i {
    width: 10px;
    height: 10px;
    border-radius: 3px;
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
    animation: pulsoTabela 1.2s ease-in-out infinite;
  }

  @keyframes pulsoTabela {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }
`;

export default function TabelaCompacta() {
  useFundoTransparente();
  const painelRef = useRef(null);
  useEffect(() => {
    recarregar();
  }, []);
  const estado = usePlacarBroadcast({ getEstado, inscrever });
  const emPrevia = new URLSearchParams(window.location.search).has('previa');
  const times = ordenarClassificacao(estado.times);
  const total = times.length;

  const nomeArquivo =
    slugArquivo(estado.competicao) + (estado.rodada > 0 ? `-rodada-${estado.rodada}` : '');

  const zonas = [
    { chave: 'class', rotulo: 'G-8', cor: CORES_ZONA.class },
    { chave: 'reb', rotulo: 'Rebaixamento', cor: CORES_ZONA.reb },
  ].filter((z) => times.some((_, i) => zonaDa(i + 1, total) === z.chave));

  return (
    <Tela $previa={emPrevia}>
      {!emPrevia && (
        <Voltar to="/hub" title="Voltar ao hub">
          ←
        </Voltar>
      )}
      {!emPrevia && <BotaoSalvarImagem alvo={painelRef} nome={nomeArquivo} />}

      <Painel ref={painelRef}>
        <Cabecalho>
          <div>
            <h1>{estado.competicao}</h1>
            <span className="sub">Classificação · Temporada {new Date().getFullYear()}</span>
          </div>
          {estado.rodada > 0 && <BadgeRodada>RODADA {estado.rodada}</BadgeRodada>}
        </Cabecalho>

        <Grade>
          <LinhaCabecalho>
            <span>#</span>
            <span>TIME</span>
            <span className="num destaque">P</span>
            <span className="num">J</span>
            <span className="num">V</span>
            <span className="num">E</span>
            <span className="num">D</span>
            <span className="num">SG</span>
          </LinhaCabecalho>

          {times.map((t, i) => {
            const pos = i + 1;
            const zona = zonaDa(pos, total);
            const s = t.gp - t.gc;
            return (
              <LinhaTime key={`${t.sigla}-${i}`} $zona={zona}>
                <span className="pos">{pos}</span>
                <div className="time">
                  <Escudo cor={t.cor} sigla={t.sigla} url={t.escudo} tamanho={22} />
                  <span className="nome">{t.nome}</span>
                </div>
                <span className="num pontos">{t.p}</span>
                <span className="num">{t.j}</span>
                <span className="num">{t.v}</span>
                <span className="num">{t.e}</span>
                <span className="num">{t.d}</span>
                <span className={`num ${s > 0 ? 'saldoPos' : s < 0 ? 'saldoNeg' : ''}`}>
                  {saldo(t.gp, t.gc)}
                </span>
              </LinhaTime>
            );
          })}
        </Grade>

        <RodapePainel>
          <Legenda>
            {zonas.map((z) => (
              <span key={z.chave}>
                <i style={{ background: z.cor }} />
                {z.rotulo}
              </span>
            ))}
          </Legenda>
          <SeloAoVivo>Sincronizado em tempo real</SeloAoVivo>
        </RodapePainel>
      </Painel>
    </Tela>
  );
}
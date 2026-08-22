import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Escudo } from '../components/Escudo';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import {
  getEstado,
  inscrever,
  placarDe,
  slotsVisiveis,
  definirTexto,
  atualizarLado,
  definirCobranca,
  limparCobrancas,
} from '../store/penaltisStore';

const VERDE = '#22c55e';
const VERMELHO = '#ef4444';

const Voltar = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  width: fit-content;
  text-decoration: none;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 999px;
  padding: 9px 18px;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.cores.texto};
    background: ${({ theme }) => theme.cores.superficieHover};
  }
`;

const Tela = styled.main`
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px 60px;
`;

const Titulo = styled.h1`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 34px 0 18px;

  span {
    color: ${VERDE};
  }
`;

const Cartao = styled.section`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 18px;
`;

const Rotulo = styled.h2`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-bottom: 12px;
`;

const GradeCampos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
`;

const Campo = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.textoSuave};
  }
`;

const InputTexto = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 8px;
  padding: 10px 14px;
  color: ${({ theme }) => theme.cores.texto};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.92rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  outline: none;

  &:focus {
    border-color: ${VERDE};
  }
`;

const InputCor = styled.input`
  width: 46px;
  height: 40px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
`;

const LinhaLado = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  > :first-child {
    flex: 1;
  }
`;

const Botao = styled.button`
  background: ${({ $variante, theme }) =>
    $variante === 'primario'
      ? VERDE
      : $variante === 'perigo'
        ? 'rgba(239, 68, 68, 0.12)'
        : theme.cores.superficieHover};
  color: ${({ $variante, theme }) =>
    $variante === 'primario' ? '#052e13' : $variante === 'perigo' ? '#f87171' : theme.cores.texto};
  border: ${({ $variante, theme }) =>
    $variante === 'primario' ? 'none' : `1px solid ${theme.cores.borda}`};
  border-radius: 8px;
  padding: 10px 16px;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.12);
  }
`;

const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
`;

const GradeLados = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 14px;
`;

const BlocoCobrancas = styled.div`
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  background: ${({ theme }) => theme.cores.fundo};
  padding: 14px;

  .topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;

    .placar {
      font-family: ${({ theme }) => theme.fontes.titulo};
      font-size: 1.6rem;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: ${VERDE};

      small {
        font-size: 0.58rem;
        letter-spacing: 2px;
        opacity: 0.7;
        margin-left: 6px;
      }
    }
  }

  .slots {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
`;

const SlotBotao = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: transparent;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    transform: scale(1.08);
  }

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

  &:not(.gol):not(.perdeu)::after {
    content: attr(data-num);
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.66rem;
    color: rgba(255, 255, 255, 0.35);
  }

  &.morte:not(.gol):not(.perdeu) {
    border-style: dashed;
    border-color: rgba(245, 158, 11, 0.45);
  }
`;

function BlocoLado({ ladoNome, lado, total }) {
  const rotulos = { gol: '✓', perdeu: '✕' };

  return (
    <BlocoCobrancas>
      <div className="topo">
        <LinhaLado>
          <Campo>
            <span>Time</span>
            <InputTexto
              value={lado.nome}
              placeholder="NOME DO TIME"
              maxLength={24}
              onChange={(e) => atualizarLado(ladoNome, 'nome', e.target.value)}
            />
          </Campo>
          <Campo style={{ width: 84 }}>
            <span>Sigla</span>
            <InputTexto
              value={lado.sigla}
              maxLength={4}
              onChange={(e) => atualizarLado(ladoNome, 'sigla', e.target.value)}
            />
          </Campo>
          <InputCor
            type="color"
            value={lado.cor}
            title="Cor do time"
            onChange={(e) => atualizarLado(ladoNome, 'cor', e.target.value)}
          />
        </LinhaLado>
        <span className="placar">
          {placarDe(lado)}
          <small>GOLS</small>
        </span>
      </div>

      <div className="slots">
        {Array.from({ length: total }, (_, i) => {
          const c = lado.cobrancas[i] ?? null;
          return (
            <SlotBotao
              key={i}
              data-num={i + 1}
              title={`Cobrança ${i + 1} · clique alterna ✓ / ✕`}
              className={[
                c === 'gol' ? 'gol' : '',
                c === 'perdeu' ? 'perdeu' : '',
                i >= 5 ? 'morte' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => definirCobranca(ladoNome, i, c === 'gol' ? 'perdeu' : 'gol')}
            >
              {rotulos[c] || ''}
            </SlotBotao>
          );
        })}
      </div>
    </BlocoCobrancas>
  );
}

export default function ControlePenaltis() {
  const estado = usePlacarBroadcast({ getEstado, inscrever });
  const total = slotsVisiveis(estado);

  return (
    <Tela>
      <Voltar to="/" title="Voltar ao hub">← Voltar ao hub</Voltar>
      <Header />
      <Titulo>
        Controle · <span>Pênaltis</span>
      </Titulo>

      <Cartao>
        <Rotulo>Competição</Rotulo>
        <GradeCampos>
          <Campo>
            <span>Competição</span>
            <InputTexto
              value={estado.competicao}
              maxLength={60}
              onChange={(e) => definirTexto('competicao', e.target.value)}
            />
          </Campo>
          <Campo>
            <span>Fase / observação</span>
            <InputTexto
              value={estado.fase}
              maxLength={40}
              onChange={(e) => definirTexto('fase', e.target.value)}
            />
          </Campo>
        </GradeCampos>
      </Cartao>

      <Cartao>
        <Rotulo>Cobranças (clique alterna convertido / perdido)</Rotulo>
        <GradeLados>
          <BlocoLado ladoNome="casa" lado={estado.casa} total={total} />
          <BlocoLado ladoNome="visitante" lado={estado.visitante} total={total} />
        </GradeLados>

        <Acoes>
          <Botao $variante="perigo" onClick={() => limparCobrancas()}>
            Limpar cobranças
          </Botao>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              alignSelf: 'center',
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,.45)',
            }}
          >
            <Escudo cor="#4b5563" sigla="---" tamanho={18} /> Prévia ao vivo na home ·
            cobranças a partir da 6ª são morte súbita
          </span>
        </Acoes>
      </Cartao>
    </Tela>
  );
}

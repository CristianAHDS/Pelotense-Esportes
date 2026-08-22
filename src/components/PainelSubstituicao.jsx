import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import {
  getEstado,
  inscrever,
  atualizarCampo,
  mostrar,
  ocultar,
} from '../store/substituicaoStore';

const VERDE = '#22c55e';

const Painel = styled.section`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 16px;
  padding: 20px 24px;
`;

const Titulo = styled.h2`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 16px;

  span {
    color: ${VERDE};
  }
`;

const Rotulo = styled.span`
  display: block;
  margin-bottom: 6px;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
`;

const Linha = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 14px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Campo = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.cresce {
    flex: 1;
    min-width: 150px;
  }
`;

const Entrada = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  padding: 11px 13px;
  color: ${({ theme }) => theme.cores.texto};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.92rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${VERDE};
  }
`;

const EntradaNum = styled(Entrada)`
  width: 84px;
  text-align: center;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const CorInput = styled.input`
  width: 46px;
  height: 42px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
`;

const Acoes = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 18px;
`;

const Botao = styled.button`
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: filter 0.15s ease;

  &:active {
    transform: scale(0.98);
  }

  &.primario {
    background: ${VERDE};
    color: #052e13;
    &:hover {
      filter: brightness(1.1);
    }
  }

  &.perigo {
    background: transparent;
    border: 1px solid #ef4444;
    color: #ef4444;
    &:hover {
      background: rgba(239, 68, 68, 0.12);
    }
  }
`;

export function PainelSubstituicao() {
  const sub = usePlacarBroadcast({ getEstado, inscrever });

  return (
    <Painel>
      <Titulo>
        🔄 <span>Substituição</span>
      </Titulo>

      <Linha>
        <Campo>
          <Rotulo>Cor</Rotulo>
          <CorInput
            type="color"
            value={sub.corTime}
            title="Cor do time"
            onChange={(e) => atualizarCampo('corTime', e.target.value)}
          />
        </Campo>
        <Campo className="cresce">
          <Rotulo>Time</Rotulo>
          <Entrada
            value={sub.nomeTime}
            maxLength={24}
            onChange={(e) => atualizarCampo('nomeTime', e.target.value)}
          />
        </Campo>
        <Campo>
          <Rotulo>Sigla</Rotulo>
          <Entrada
            style={{ width: 90 }}
            value={sub.siglaTime}
            maxLength={4}
            onChange={(e) => atualizarCampo('siglaTime', e.target.value)}
          />
        </Campo>
        <Campo>
          <Rotulo>Minuto</Rotulo>
          <Entrada
            style={{ width: 90 }}
            value={sub.minuto}
            maxLength={6}
            placeholder="67'"
            onChange={(e) => atualizarCampo('minuto', e.target.value)}
          />
        </Campo>
      </Linha>

      <Linha>
        <EntradaNum
          type="number"
          min={0}
          max={99}
          value={sub.saiNum}
          title="Número"
          onChange={(e) => atualizarCampo('saiNum', e.target.value)}
        />
        <Campo className="cresce">
          <Rotulo>Jogador que sai ↓</Rotulo>
          <Entrada
            value={sub.saiNome}
            maxLength={22}
            onChange={(e) => atualizarCampo('saiNome', e.target.value)}
          />
        </Campo>
      </Linha>

      <Linha>
        <EntradaNum
          type="number"
          min={0}
          max={99}
          value={sub.entraNum}
          title="Número"
          onChange={(e) => atualizarCampo('entraNum', e.target.value)}
        />
        <Campo className="cresce">
          <Rotulo>Jogador que entra ↑</Rotulo>
          <Entrada
            value={sub.entraNome}
            maxLength={22}
            onChange={(e) => atualizarCampo('entraNome', e.target.value)}
          />
        </Campo>
      </Linha>

      <Acoes>
        {sub.visivel ? (
          <Botao className="perigo" onClick={() => ocultar()}>
            Ocultar da tela
          </Botao>
        ) : (
          <Botao className="primario" onClick={() => mostrar()}>
            Mostrar na tela
          </Botao>
        )}
      </Acoes>
    </Painel>
  );
}

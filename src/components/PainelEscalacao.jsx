import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { escalacao } from '../store/escalacaoStore';
import { CoresFixas } from './CoresFixas';
import { SeletorSigla } from './SeletorSigla';

const VERDE = '#a5ef1c';

const FORMACOES = ['4-3-3', '4-4-2', '4-2-3-1', '4-1-4-1', '3-5-2', '3-4-3', '5-3-2', '4-3-1-2'];

const LADOS = [
  {
    lado: 'casa',
    rotulo: 'Time da casa',
    campoCor: 'corCasa',
    campoNome: 'nomeCasa',
    campoSigla: 'siglaCasa',
    campoFormacao: 'formacaoCasa',
    campoTecnico: 'tecnicoCasa'
  },
  {
    lado: 'fora',
    rotulo: 'Visitante',
    campoCor: 'corFora',
    campoNome: 'nomeFora',
    campoSigla: 'siglaFora',
    campoFormacao: 'formacaoFora',
    campoTecnico: 'tecnicoFora'
  }
];

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

const GradeTimes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const SecaoTime = styled.div`
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-left: 4px solid ${({ $cor }) => $cor};
  border-radius: 12px;
  padding: 14px 16px;
`;

const RotuloTime = styled.h3`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-bottom: 12px;
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
    min-width: 130px;
  }
`;

const Entrada = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.cores.superficie};
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

const Selecao = styled.select`
  width: 100%;
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  padding: 11px 13px;
  color: ${({ theme }) => theme.cores.texto};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.92rem;
  letter-spacing: 1.5px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${VERDE};
  }
`;

const EntradaNum = styled(Entrada)`
  width: 64px;
  text-align: center;
  padding: 11px 6px;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
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
    color: #0a0f00;
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

function ColunaTime({ estado, config, atualizarCampo, atualizarJogador }) {
  const cor = estado[config.campoCor];

  return (
    <SecaoTime $cor={cor}>
      <RotuloTime>{config.rotulo}</RotuloTime>
      <Linha>
        <Campo className="cresce">
          <Rotulo>Cor</Rotulo>
          <CoresFixas
            valor={cor}
            onChange={(v) => atualizarCampo(config.campoCor, v)}
          />
        </Campo>
        <Campo>
          <Rotulo>Sigla</Rotulo>
          <div style={{ width: 90 }}>
            <SeletorSigla
              value={estado[config.campoSigla]}
              onChange={(v) => atualizarCampo(config.campoSigla, v)}
            />
          </div>
        </Campo>
      </Linha>
      <Linha>
        <Campo className="cresce">
          <Rotulo>Nome</Rotulo>
          <Entrada
            value={estado[config.campoNome]}
            maxLength={24}
            onChange={(e) => atualizarCampo(config.campoNome, e.target.value)}
          />
        </Campo>
        <Campo>
          <Rotulo>Formação</Rotulo>
          <Selecao
            value={estado[config.campoFormacao]}
            onChange={(e) => atualizarCampo(config.campoFormacao, e.target.value)}
          >
            {FORMACOES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Selecao>
        </Campo>
      </Linha>
      <Linha>
        <Campo className="cresce">
          <Rotulo>Técnico</Rotulo>
          <Entrada
            value={estado[config.campoTecnico]}
            maxLength={28}
            placeholder="Nome do técnico"
            onChange={(e) => atualizarCampo(config.campoTecnico, e.target.value)}
          />
        </Campo>
      </Linha>
      {(estado.jogadores?.[config.lado] || []).map((jogador, i) => (
        <Linha key={`jog-${config.lado}-${i}`}>
          <EntradaNum
            type="number"
            min={0}
            max={99}
            value={jogador.num}
            title="Número"
            onChange={(e) => atualizarJogador(config.lado, i, 'num', e.target.value)}
          />
          <Campo className="cresce">
            <Entrada
              value={jogador.nome}
              maxLength={22}
              placeholder={`Jogador ${i + 1}`}
              onChange={(e) => atualizarJogador(config.lado, i, 'nome', e.target.value)}
            />
          </Campo>
        </Linha>
      ))}
    </SecaoTime>
  );
}

export function PainelEscalacao() {
  const estado = usePlacarBroadcast(escalacao);
  const { atualizarCampo, atualizarJogador, mostrar, ocultar } = escalacao;

  return (
    <Painel>
      <Titulo>
        📋 <span>Escalação</span> · Grid 11x1
      </Titulo>

      <GradeTimes>
        {LADOS.map((config) => (
          <ColunaTime
            key={config.lado}
            estado={estado}
            config={config}
            atualizarCampo={atualizarCampo}
            atualizarJogador={atualizarJogador}
          />
        ))}
      </GradeTimes>

      <Acoes>
        {estado.visivel ? (
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

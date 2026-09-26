import { useState } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { rodadaAtual } from '../store/rodadaAtualStore';
import { importarRodadaAtualSuperPlacar } from '../services/superPlacarService';

const Cartao = styled.section`
  background: #0d0d0d;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  padding: 24px;
`;

const Titulo = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 18px;

  span {
    color: #a5ef1c;
  }
`;

const CampoTitulo = styled.div`
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  margin-bottom: 22px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Rotulo = styled.span`
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);

  @media (max-width: 480px) {
    display: none;
  }
`;

const SecaoRodada = styled.div`
  padding: 16px;
  margin-top: 12px;
  border: 1px solid #1f1f1f;
  border-radius: 10px;

  & + & {
    margin-top: 12px;
  }
`;

const CabecaRodada = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 26px;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
`;

const Entrada = styled.input`
  width: 100%;
  min-width: 0;
  background: #000;
  border: 1px solid #262626;
  border-radius: 8px;
  padding: 9px 10px;
  color: #fff;
  font-size: 0.85rem;
  letter-spacing: 1px;
  transition: border-color 120ms ease;

  &:focus {
    outline: none;
    border-color: #a5ef1c;
  }
`;

const EntradaNum = styled(Entrada)`
  padding: 9px 4px;
  text-align: center;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
`;

const LinhaJogo = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 46px 20px 46px minmax(0, 1fr) 26px;
  gap: 8px;
  align-items: center;

  & + & {
    margin-top: 8px;
  }
`;

const Vs = styled.span`
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 700;
`;

const BotaoLinha = styled.button`
  width: 26px;
  height: 34px;
  border-radius: 7px;
  border: 1px solid #333;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.72rem;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 120ms ease,
    color 120ms ease;

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
  }
`;

const BotaoAdicionar = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  width: 100%;
  border-radius: 8px;
  border: 1px dashed #3a3a3a;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    border-color 120ms ease,
    color 120ms ease;

  &:hover {
    border-color: #a5ef1c;
    color: #a5ef1c;
  }
`;

const Acoes = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const Botao = styled.button`
  flex: 1;
  min-width: 140px;
  padding: 11px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    filter 120ms ease,
    border-color 120ms ease;

  ${({ $primario }) =>
    $primario
      ? `
    background: #a5ef1c;
    color: #0a0f00;
    &:hover { filter: brightness(1.08); }
  `
      : `
    background: transparent;
    border-color: #333;
    color: #ddd;
    &:hover { border-color: #a5ef1c; color: #a5ef1c; }
  `}
`;

const Aviso = styled.p`
  margin: 12px 0 0;
  font-size: 0.78rem;
  letter-spacing: 0.5px;
  color: #f59e0b;
`;

export function PainelRodadaAtual() {
  const estado = usePlacarBroadcast(rodadaAtual);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  async function puxarSuperPlacar() {
    setCarregando(true);
    setErro('');
    setAviso('');
    try {
      const dados = await importarRodadaAtualSuperPlacar({ forcar: true });
      if (!dados.jogos?.length) {
        setAviso('Nenhum jogo encontrado na rodada atual do SuperPlacar.');
      } else {
        rodadaAtual.preencherDaRodada(dados);
        setAviso(
          `${dados.titulo || 'Rodada atual'} carregada (${dados.jogos.length} jogos).`,
        );
      }
    } catch (e) {
      console.warn('Rodada Atual: falha ao buscar SuperPlacar.', e);
      setErro('Não foi possível acessar o SuperPlacar agora. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Cartao>
      <Titulo>
        <span>●</span> Rodada Atual
      </Titulo>

      <CampoTitulo>
        <Rotulo>Título</Rotulo>
        <Entrada
          value={estado.titulo}
          placeholder="Rodada Atual"
          maxLength={32}
          onChange={(e) =>
            rodadaAtual.atualizarCampo('titulo', e.target.value)
          }
        />
      </CampoTitulo>

      {(estado.rodadas || []).map((rodada, ri) => (
        <SecaoRodada key={`rodada-${ri}`}>
          <CabecaRodada>
            <Entrada
              value={rodada.titulo}
              placeholder={`RODADA ${ri + 1}`}
              maxLength={24}
              onChange={(e) =>
                rodadaAtual.atualizarRodada(ri, 'titulo', e.target.value)
              }
            />
            <BotaoAdicionar
              style={{ width: 'auto', margin: 0 }}
              onClick={() => rodadaAtual.adicionarJogo(ri)}
            >
              + Jogo
            </BotaoAdicionar>
            <BotaoLinha
              onClick={() => rodadaAtual.removerRodada(ri)}
              title="Remover rodada"
            >
              ✕
            </BotaoLinha>
          </CabecaRodada>

          {(rodada.jogos || []).map((jogo, ji) => (
            <LinhaJogo key={`jogo-${ri}-${ji}`}>
              <Entrada
                value={jogo.casaSigla}
                placeholder="CASA"
                maxLength={4}
                onChange={(e) =>
                  rodadaAtual.atualizarJogo(ri, ji, 'casaSigla', e.target.value)
                }
              />
              <EntradaNum
                type="number"
                min={0}
                max={99}
                value={jogo.casaGols}
                onChange={(e) =>
                  rodadaAtual.atualizarJogo(ri, ji, 'casaGols', e.target.value)
                }
              />
              <Vs>×</Vs>
              <EntradaNum
                type="number"
                min={0}
                max={99}
                value={jogo.foraGols}
                onChange={(e) =>
                  rodadaAtual.atualizarJogo(ri, ji, 'foraGols', e.target.value)
                }
              />
              <Entrada
                value={jogo.foraSigla}
                placeholder="FORA"
                maxLength={4}
                onChange={(e) =>
                  rodadaAtual.atualizarJogo(ri, ji, 'foraSigla', e.target.value)
                }
              />
              <BotaoLinha
                onClick={() => rodadaAtual.removerJogo(ri, ji)}
                title="Remover jogo"
              >
                ✕
              </BotaoLinha>
            </LinhaJogo>
          ))}
        </SecaoRodada>
      ))}
      <BotaoAdicionar onClick={() => rodadaAtual.adicionarRodada()}>
        + Adicionar rodada
      </BotaoAdicionar>

      <Acoes>
        <Botao $primario onClick={puxarSuperPlacar} disabled={carregando}>
          {carregando ? 'Buscando…' : 'Puxar Rodada Atual do SuperPlacar'}
        </Botao>
        <Botao $primario onClick={() => rodadaAtual.mostrar()}>
          Mostrar overlay
        </Botao>
        <Botao onClick={() => rodadaAtual.ocultar()}>Ocultar overlay</Botao>
      </Acoes>

      {(erro || aviso) && <Aviso>{erro || aviso}</Aviso>}
    </Cartao>
  );
}

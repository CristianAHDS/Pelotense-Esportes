import { useState } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { ultimaRodada } from '../store/ultimaRodadaStore';
import { importarUltimaRodadaFGF } from '../services/fgfService';

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
  grid-template-columns: 90px minmax(0, 1fr);
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

const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 22px;
`;

const SecaoTitulo = styled.h3`
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
`;

const LinhaJogo = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 52px auto 52px minmax(0, 1fr) 26px;
  gap: 8px;
  align-items: center;

  & + & {
    margin-top: 8px;
  }

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr) 44px auto 44px minmax(0, 1fr) 26px;
  }
`;

const LinhaPosicao = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 64px 26px;
  gap: 8px;
  align-items: center;

  & + & {
    margin-top: 8px;
  }
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
  transition: border-color 120ms ease, color 120ms ease;

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
  transition: border-color 120ms ease, color 120ms ease;

  &:hover {
    border-color: #a5ef1c;
    color: #a5ef1c;
  }
`;

const Indice = styled.span`
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #a5ef1c;
  text-align: center;
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
  width: 100%;
  padding: 9px 4px;
  text-align: center;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
`;

const Separador = styled.span`
  color: rgba(255, 255, 255, 0.35);
  font-weight: 700;
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
  transition: filter 120ms ease, border-color 120ms ease;

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

export function PainelUltimaRodada() {
  const estado = usePlacarBroadcast(ultimaRodada);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  async function puxarFGF() {
    setCarregando(true);
    setErro('');
    setAviso('');
    try {
      const dados = await importarUltimaRodadaFGF();
      if (!dados.jogos?.length) {
        setAviso('Nenhum jogo realizado encontrado na FGF.');
      } else {
        ultimaRodada.preencherDaFGF(dados);
        setAviso(
          `Dados da ${dados.titulo || 'última rodada'} carregados (${dados.jogos.length} jogos, ${dados.classificacao.length} times).`
        );
      }
    } catch (e) {
      console.warn('Última rodada: falha ao buscar FGF.', e);
      setErro('Não foi possível acessar a FGF agora. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Cartao>
      <Titulo>
        <span>●</span> Última Rodada
      </Titulo>

      <CampoTitulo>
        <Rotulo>Título</Rotulo>
        <Entrada
          value={estado.titulo}
          placeholder="ÚLTIMA RODADA"
          maxLength={32}
          onChange={(e) => ultimaRodada.atualizarCampo('titulo', e.target.value)}
        />
      </CampoTitulo>

      <Grade>
        <div>
          <SecaoTitulo>Resultados</SecaoTitulo>
          {(estado.jogos || []).map((jogo, i) => (
            <LinhaJogo key={`jogo-${i}`}>
              <Entrada
                value={jogo.casaSigla}
                placeholder="SIGLA"
                maxLength={4}
                onChange={(e) => ultimaRodada.atualizarJogo(i, 'casaSigla', e.target.value)}
              />
              <EntradaNum
                type="number"
                min={0}
                max={99}
                value={jogo.casaGols}
                onChange={(e) => ultimaRodada.atualizarJogo(i, 'casaGols', e.target.value)}
              />
              <Separador>×</Separador>
              <EntradaNum
                type="number"
                min={0}
                max={99}
                value={jogo.foraGols}
                onChange={(e) => ultimaRodada.atualizarJogo(i, 'foraGols', e.target.value)}
              />
              <Entrada
                value={jogo.foraSigla}
                placeholder="SIGLA"
                maxLength={4}
                onChange={(e) => ultimaRodada.atualizarJogo(i, 'foraSigla', e.target.value)}
              />
              <BotaoLinha onClick={() => ultimaRodada.removerJogo(i)} title="Remover jogo">
                ✕
              </BotaoLinha>
            </LinhaJogo>
          ))}
          <BotaoAdicionar onClick={() => ultimaRodada.adicionarJogo()}>
            + Adicionar jogo
          </BotaoAdicionar>
        </div>

        <div>
          <SecaoTitulo>Classificação após a rodada</SecaoTitulo>
          {(estado.posicoes || []).map((p, i) => (
            <LinhaPosicao key={`pos-${i}`}>
              <Entrada
                value={p.sigla}
                placeholder="SIGLA"
                maxLength={4}
                onChange={(e) => ultimaRodada.atualizarPosicao(i, 'sigla', e.target.value)}
              />
              <EntradaNum
                type="number"
                min={1}
                max={20}
                placeholder="POS"
                value={p.pos}
                onChange={(e) => ultimaRodada.atualizarPosicao(i, 'pos', e.target.value)}
              />
              <BotaoLinha onClick={() => ultimaRodada.removerPosicao(i)} title="Remover posição">
                ✕
              </BotaoLinha>
            </LinhaPosicao>
          ))}
          <BotaoAdicionar onClick={() => ultimaRodada.adicionarPosicao()}>
            + Adicionar time
          </BotaoAdicionar>
        </div>
      </Grade>

      <Acoes>
        <Botao $primario onClick={puxarFGF} disabled={carregando}>
          {carregando ? 'Buscando…' : 'Puxar dados da FGF'}
        </Botao>
        <Botao $primario onClick={() => ultimaRodada.mostrar()}>
          Mostrar overlay
        </Botao>
        <Botao onClick={() => ultimaRodada.ocultar()}>
          Ocultar overlay
        </Botao>
      </Acoes>

      {(erro || aviso) && (
        <Aviso>{erro || aviso}</Aviso>
      )}
    </Cartao>
  );
}

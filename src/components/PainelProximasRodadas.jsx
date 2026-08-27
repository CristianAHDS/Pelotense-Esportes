import { useState } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { proximasRodadas } from '../store/proximasRodadasStore';
import { importarProximasRodadasFGF } from '../services/fgfService';

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

const LinhaJogo = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px minmax(0, 1fr) 26px;
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

export function PainelProximasRodadas() {
  const estado = usePlacarBroadcast(proximasRodadas);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  async function puxarFGF() {
    setCarregando(true);
    setErro('');
    setAviso('');
    try {
      const dados = await importarProximasRodadasFGF();
      if (!dados.rodadas?.length) {
        setAviso('Nenhuma próxima rodada encontrada na FGF.');
      } else {
        proximasRodadas.preencherDaFGF(dados);
        setAviso(
          `Próxima Rodada da FGF carregadas (${dados.rodadas.length} rodadas).`,
        );
      }
    } catch (e) {
      console.warn('Próxima Rodada: falha ao buscar FGF.', e);
      setErro('Não foi possível acessar a FGF agora. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Cartao>
      <Titulo>
        <span>●</span> Próxima Rodada
      </Titulo>

      <CampoTitulo>
        <Rotulo>Título</Rotulo>
        <Entrada
          value={estado.titulo}
          placeholder="Próxima Rodada"
          maxLength={32}
          onChange={(e) =>
            proximasRodadas.atualizarCampo('titulo', e.target.value)
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
                proximasRodadas.atualizarRodada(ri, 'titulo', e.target.value)
              }
            />
            <BotaoAdicionar
              style={{ width: 'auto', margin: 0 }}
              onClick={() => proximasRodadas.adicionarJogo(ri)}
            >
              + Jogo
            </BotaoAdicionar>
            <BotaoLinha
              onClick={() => proximasRodadas.removerRodada(ri)}
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
                  proximasRodadas.atualizarJogo(
                    ri,
                    ji,
                    'casaSigla',
                    e.target.value,
                  )
                }
              />
              <Vs>×</Vs>
              <Entrada
                value={jogo.foraSigla}
                placeholder="FORA"
                maxLength={4}
                onChange={(e) =>
                  proximasRodadas.atualizarJogo(
                    ri,
                    ji,
                    'foraSigla',
                    e.target.value,
                  )
                }
              />
              <BotaoLinha
                onClick={() => proximasRodadas.removerJogo(ri, ji)}
                title="Remover jogo"
              >
                ✕
              </BotaoLinha>
            </LinhaJogo>
          ))}
        </SecaoRodada>
      ))}
      <BotaoAdicionar onClick={() => proximasRodadas.adicionarRodada()}>
        + Adicionar rodada
      </BotaoAdicionar>

      <Acoes>
        <Botao $primario onClick={puxarFGF} disabled={carregando}>
          {carregando ? 'Buscando…' : 'Puxar Próxima Rodada da FGF'}
        </Botao>
        <Botao $primario onClick={() => proximasRodadas.mostrar()}>
          Mostrar overlay
        </Botao>
        <Botao onClick={() => proximasRodadas.ocultar()}>Ocultar overlay</Botao>
      </Acoes>

      {(erro || aviso) && <Aviso>{erro || aviso}</Aviso>}
    </Cartao>
  );
}

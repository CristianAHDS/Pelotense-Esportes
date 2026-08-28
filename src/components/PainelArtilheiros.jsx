import { useState } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { artilheiros } from '../store/artilheirosStore';
import { importarArtilheirosFGF } from '../services/fgfService';
import { SeletorSigla } from './SeletorSigla';

const Cartao = styled.section`
  background: #0d0d0d;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  padding: 24px;
  margin-top: 40px;
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

const SecaoTitulo = styled.h3`
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
`;

const LinhaJogador = styled.div`
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) 56px 56px 26px;
  gap: 8px;
  align-items: center;

  & + & {
    margin-top: 8px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 48px minmax(0, 1fr) 48px 48px 26px;
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

export function PainelArtilheiros() {
  const estado = usePlacarBroadcast(artilheiros);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  async function puxarFGF() {
    setCarregando(true);
    setErro('');
    setAviso('');
    try {
      const dados = await importarArtilheirosFGF();
      if (!dados.jogadores?.length) {
        setAviso('Nenhum artilheiro encontrado na FGF.');
      } else {
        artilheiros.preencherDaFGF(dados);
        setAviso(
          `Artilheiros da FGF carregados (${dados.jogadores.length} jogadores).`,
        );
      }
    } catch (e) {
      console.warn('Artilheiros: falha ao buscar FGF.', e);
      setErro('Não foi possível acessar a FGF agora. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Cartao>
      <Titulo>
        <span>●</span> Artilheiros
      </Titulo>

      <CampoTitulo>
        <Rotulo>Título</Rotulo>
        <Entrada
          value={estado.titulo}
          placeholder="ARTILHEIROS"
          maxLength={32}
          onChange={(e) => artilheiros.atualizarCampo('titulo', e.target.value)}
        />
      </CampoTitulo>

      <SecaoTitulo>Jogadores</SecaoTitulo>
      {(estado.jogadores || []).slice(0, 5).map((j, i) => (
        <LinhaJogador key={`jogador-${i}`}>
          <EntradaNum
            type="number"
            min={1}
            max={99}
            placeholder="POS"
            value={j.pos}
            onChange={(e) =>
              artilheiros.atualizarJogador(i, 'pos', e.target.value)
            }
          />
          <Entrada
            value={j.nome}
            placeholder="NOME"
            maxLength={24}
            onChange={(e) =>
              artilheiros.atualizarJogador(i, 'nome', e.target.value)
            }
          />
          <SeletorSigla
            value={j.sigla}
            onChange={(v) => artilheiros.atualizarJogador(i, 'sigla', v)}
          />
          <EntradaNum
            type="number"
            min={0}
            max={99}
            placeholder="GOLS"
            value={j.gols}
            onChange={(e) =>
              artilheiros.atualizarJogador(i, 'gols', e.target.value)
            }
          />
          <BotaoLinha
            onClick={() => artilheiros.removerJogador(i)}
            title="Remover jogador"
          >
            ✕
          </BotaoLinha>
        </LinhaJogador>
      ))}
      <BotaoAdicionar onClick={() => artilheiros.adicionarJogador()}>
        + Adicionar jogador
      </BotaoAdicionar>

      <Acoes>
        <Botao $primario onClick={puxarFGF} disabled={carregando}>
          {carregando ? 'Buscando…' : 'Puxar artilheiros da FGF'}
        </Botao>
        <Botao $primario onClick={() => artilheiros.mostrar()}>
          Mostrar overlay
        </Botao>
        <Botao onClick={() => artilheiros.ocultar()}>Ocultar overlay</Botao>
      </Acoes>

      {(erro || aviso) && <Aviso>{erro || aviso}</Aviso>}
    </Cartao>
  );
}

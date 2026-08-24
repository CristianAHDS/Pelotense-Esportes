import styled from 'styled-components';
import { PreviaOverlay } from '../components/PreviaOverlay';
import { useState } from 'react';
import { Header } from '../components/Header';
import { Escudo } from '../components/Escudo';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { getEstado, inscrever } from '../store/mataMataStore';
import {
  definirCompeticao,
  definirFase,
  atualizarLado,
  preencherConfrontos,
  limparPlacares,
  limparFase,
} from '../store/mataMataStore';
import { getEstado as getTabela, ordenarClassificacao } from '../store/tabelaStore';

const ABAS_FASES = [
  { chave: 'confrontos', rotulo: 'OITAVAS' },
  { chave: 'quartas', rotulo: 'QUARTAS' },
  { chave: 'semi', rotulo: 'SEMIFINAL' },
  { chave: 'final', rotulo: 'FINAL' },
];

const BarraAbas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Aba = styled.button`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 7px 16px;
  border-radius: 999px;
  cursor: pointer;
  color: ${({ $ativa, theme }) => ($ativa ? '#0a0f00' : theme.cores.textoSuave)};
  background: ${({ $ativa }) => ($ativa ? '#a5ef1c' : 'transparent')};
  border: 1px solid ${({ $ativa }) => ($ativa ? 'transparent' : 'rgba(165, 239, 28, 0.3)')};

  &:hover {
    border-color: rgba(165, 239, 28, 0.6);
  }
`;

const FASES = [
  'OITAVAS DE FINAL',
  'QUARTAS DE FINAL',
  'SEMIFINAL',
  'TERCEIRO LUGAR',
  'FINAL',
];

const Tela = styled.main`
  min-height: 100vh;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 28px 60px;
`;

const Titulo = styled.h1`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 34px 0 18px;

  span {
    color: #f59e0b;
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

const LinhaConfig = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;

  > :first-child {
    flex: 1;
    min-width: 240px;
  }
`;

const CampoTexto = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 8px;
  padding: 10px 14px;
  color: ${({ theme }) => theme.cores.texto};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.95rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  outline: none;

  &:focus {
    border-color: #f59e0b;
  }
`;

const Botao = styled.button`
  background: ${({ $variante, theme }) =>
    $variante === 'primario'
      ? '#f59e0b'
      : $variante === 'perigo'
        ? 'rgba(239, 68, 68, 0.12)'
        : theme.cores.superficieHover};
  color: ${({ $variante, theme }) =>
    $variante === 'primario'
      ? '#431407'
      : $variante === 'perigo'
        ? '#f87171'
        : theme.cores.texto};
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

const GradeConfrontos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 14px;
`;

const CartaoConfronto = styled.div`
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  overflow: hidden;
  background: ${({ theme }) => theme.cores.fundo};

  .jogo {
  display: flex;
  align-items: center;
    justify-content: space-between;
    padding: 9px 14px;
    border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
    background: rgba(255, 255, 255, 0.03);
  font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.66rem;
  font-weight: 700;
    letter-spacing: 2.5px;
  color: ${({ theme }) => theme.cores.textoSuave};
  }

  .ladoRotulo {
    width: 58px;
    flex-shrink: 0;
  font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: ${({ theme }) => theme.cores.textoSuave};
  text-transform: uppercase;
  }
`;

const LinhaLado = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px 2px;

  &:last-child {
    padding-bottom: 12px;
  }
`;

const InputCor = styled.input`
  width: 30px;
  height: 32px;
    flex-shrink: 0;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
`;

const InputNome = styled.input`
    flex: 1;
  min-width: 90px;
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 6px;
  padding: 7px 9px;
  color: ${({ theme }) => theme.cores.texto};
  font-size: 0.82rem;
  outline: none;

  &:focus {
    border-color: #f59e0b;
  }
`;

const InputNum = styled.input`
  width: 52px;
    flex-shrink: 0;
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 6px;
  padding: 7px 4px;
  color: ${({ theme }) => theme.cores.texto};
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &::placeholder {
    font-size: 0.62rem;
  letter-spacing: 1px;
  }

  &:focus {
    border-color: #f59e0b;
  }
`;

/* ---------- Prévia clicável ---------- */

const PreviaClicavel = styled.div`
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.01);
  }
`;

const MiniJogo = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-left: 3px solid #f59e0b;
  margin-bottom: 4px;
    background: rgba(255, 255, 255, 0.03);

  .time {
  display: flex;
  align-items: center;
  gap: 8px;
    min-width: 0;

  &:last-child {
      justify-content: flex-end;
  }
  }

  .sigla {
  font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .gol {
    font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 0.78rem;
    color: #f59e0b;
  }

  .vs {
    font-size: 0.6rem;
  font-weight: 700;
    opacity: 0.5;
  }
`;

function PreviewMataMata({ estado }) {
  return (
    <PreviaClicavel
      title="Abrir visualização em nova guia"
      onClick={() =>
        window.open(
          `${window.location.origin}/mata-mata`,
          '_blank'
        )
  }
    >
      <Cartao style={{ marginBottom: 0 }}>
        <Rotulo>Prévia · clique para abrir em nova guia</Rotulo>
        {estado.confrontos.slice(0, 4).map((c, i) => (
          <MiniJogo key={i}>
            <span className="time">
              <Escudo cor={c.casa.cor} sigla={c.casa.sigla} url={c.casa.escudo} tamanho={16} />
              <span className="sigla">{c.casa.nome || c.casa.sigla}</span>
              <span className="gol">{c.casa.gols ?? '-'}</span>
            </span>
            <span className="vs">VS</span>
            <span className="time">
              <span className="gol">{c.visitante.gols ?? '-'}</span>
              <span className="sigla">{c.visitante.nome || c.visitante.sigla}</span>
              <Escudo cor={c.visitante.cor} sigla={c.visitante.sigla} url={c.visitante.escudo} tamanho={16} />
            </span>
          </MiniJogo>
        ))}
      </Cartao>
    </PreviaClicavel>
  );
  }

/* ---------- Página ---------- */

export default function ControleMataMata() {
  const estado = usePlacarBroadcast({ getEstado, inscrever });
  const [faseAtiva, definirFaseAtiva] = useState('confrontos');
  const listaFase = estado[faseAtiva] || estado.confrontos;

  function gerarParesDaClassificacao() {
    const times = ordenarClassificacao(getTabela().times);
    if (estado.fase.includes('OITAV') && times.length >= 16) {
      return Array.from({ length: 8 }, (_, i) => ({
        casa: times[i],
        visitante: times[15 - i],
      }));
  }
    const g8 = times.slice(0, 8);
    return [
      { casa: g8[0], visitante: g8[7] },
      { casa: g8[1], visitante: g8[6] },
      { casa: g8[2], visitante: g8[5] },
      { casa: g8[3], visitante: g8[4] },
];
  }

  return (
    <Tela>
      <Header />
      <Titulo>
        Controle · <span>Mata-Mata</span>
      </Titulo>
      <PreviaOverlay rota="/mata-mata" altura={420} />

      <Cartao>
        <Rotulo>Competição e fase</Rotulo>
        <LinhaConfig>
          <CampoTexto
            value={estado.competicao}
            maxLength={60}
            onChange={(e) => definirCompeticao(e.target.value)}
          />
          <div style={{ width: 260 }}>
          <CampoTexto
              list="lista-fases"
              value={estado.fase}
              maxLength={40}
              title="Fase (escolha ou digite)"
              onChange={(e) => definirFase(e.target.value)}
          />
            <datalist id="lista-fases">
              {FASES.map((f) => (
                <option key={f} value={f} />
        ))}
            </datalist>
          </div>
        </LinhaConfig>
      </Cartao>

      <Cartao>
        <BarraAbas>
          {ABAS_FASES.map((f) => (
            <Aba
              key={f.chave}
              $ativa={faseAtiva === f.chave}
              onClick={() => definirFaseAtiva(f.chave)}
              title={
                f.chave === 'quartas' || f.chave === 'semi'
                  ? 'Lados preenchidos automaticamente com os vencedores da fase anterior'
                  : undefined
              }
            >
              {f.rotulo}
            </Aba>
          ))}
        </BarraAbas>

        <Rotulo style={{ marginTop: 14 }}>
          Confrontos · {ABAS_FASES.find((f) => f.chave === faseAtiva)?.rotulo} ({listaFase.length})
        </Rotulo>
        <GradeConfrontos>
          {listaFase.map((c, ci) => (
            <CartaoConfronto key={ci}>
              <div className="jogo">
                JOGO {ci + 1}
                <span>{`GOLS · PÊN`}</span>
          </div>
              {['casa', 'visitante'].map((ladoNome) => {
                const lado = c[ladoNome];
  return (
                  <LinhaLado key={ladoNome}>
                    <span className="ladoRotulo">{ladoNome}</span>
                    <InputNome
                      value={lado.nome}
                      placeholder="NOME DO TIME"
                      maxLength={24}
                      onChange={(e) => atualizarLado(faseAtiva, ci, ladoNome, 'nome', e.target.value)}
          />
                    <InputNum
                      value={lado.sigla}
                      maxLength={4}
                      title="Sigla"
                      onChange={(e) => atualizarLado(faseAtiva, ci, ladoNome, 'sigla', e.target.value)}
          />
                    <InputNum
                      type="number"
                      min={0}
                      placeholder="GOL"
                      value={lado.gols ?? ''}
                      title="Gols"
                      onChange={(e) => atualizarLado(faseAtiva, ci, ladoNome, 'gols', e.target.value)}
          />
                    <InputNum
                      type="number"
                      min={0}
                      placeholder="PÊN"
                      value={lado.pen ?? ''}
                      title="Pênaltis (opcional)"
                      onChange={(e) => atualizarLado(faseAtiva, ci, ladoNome, 'pen', e.target.value)}
          />
                  </LinhaLado>
  );
              })}
            </CartaoConfronto>
        ))}
        </GradeConfrontos>

        <Acoes>
          <Botao
            $variante="primario"
            onClick={() => {
              preencherConfrontos(gerarParesDaClassificacao());
              definirFaseAtiva('confrontos');
            }}
            title="Preenche as oitavas com os times da tabela de classificação"
          >
            Preencher classificados
          </Botao>
          <Botao
            onClick={() => limparFase(faseAtiva)}
            title="Zera os nomes e placares desta fase"
          >
            Limpar fase
          </Botao>
          <Botao onClick={() => limparPlacares()}>Limpar placares</Botao>
        </Acoes>
      </Cartao>

      <PreviewMataMata estado={estado} />
    </Tela>
  );
  }

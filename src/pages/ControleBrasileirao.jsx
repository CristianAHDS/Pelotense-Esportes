import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PreviaOverlay } from '../components/PreviaOverlay';
import { Header } from '../components/Header';
import { Escudo } from '../components/Escudo';
import { SeletorSigla } from '../components/SeletorSigla';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import { importarClassificacaoUOL } from '../services/uolService';
import {
  getEstado,
  inscrever,
  ordenarClassificacao,
  recarregar,
  definirCompeticao,
  definirRodada,
  adicionarTime,
  removerTime,
  atualizarTime,
  zerarEstatisticas,
  restaurarPadrao,
} from '../store/brasileiraoStore';

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
    color: ${({ theme }) => theme.cores.primaria};
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
`;

const CampoTexto = styled.input`
  flex: 1;
  min-width: 220px;
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
    border-color: ${({ theme }) => theme.cores.primaria};
  }
`;

const CampoNumero = styled.input`
  width: 90px;
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 8px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.cores.texto};
  text-align: center;
  outline: none;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &:focus {
    border-color: ${({ theme }) => theme.cores.primaria};
  }
`;

const Botao = styled.button`
  background: ${({ $variante, theme }) =>
    $variante === 'primario'
      ? theme.cores.primaria
      : $variante === 'perigo'
        ? 'rgba(239, 68, 68, 0.12)'
        : theme.cores.superficieHover};
  color: ${({ $variante, theme }) =>
    $variante === 'primario'
      ? '#0a0f00'
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
    filter: brightness(1.15);
  }
`;

const GradeTimes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CabecalhoGrid = styled.div`
  display: grid;
  grid-template-columns: 34px 36px minmax(140px, 1.4fr) 78px repeat(
      7,
      52px
    ) 38px;
  gap: 6px;
  align-items: center;
  padding: 0 4px 8px;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.cores.textoSuave};

  .num {
    text-align: center;
  }
`;

const LinhaTime = styled.div`
  display: grid;
  grid-template-columns: 34px 36px minmax(140px, 1.4fr) 78px repeat(
      7,
      52px
    ) 38px;
  gap: 6px;
  align-items: center;
  padding: 4px;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .pos {
    text-align: center;
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-weight: 700;
    color: ${({ theme }) => theme.cores.textoSuave};
    border-left: 3px solid transparent;
    padding-left: 4px;
  }
`;

const InputNome = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 6px;
  padding: 8px 10px;
  color: ${({ theme }) => theme.cores.texto};
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.cores.primaria};
  }
`;

const InputNum = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 6px;
  padding: 8px 4px;
  color: ${({ theme }) => theme.cores.texto};
  text-align: center;
  font-size: 0.85rem;
  outline: none;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &:focus {
    border-color: ${({ theme }) => theme.cores.primaria};
  }
`;

const CelulaEscudo = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  input {
    position: absolute;
    inset: -4px;
    opacity: 0;
    cursor: pointer;
  }
`;

const BotaoRemover = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: none;
  border-radius: 6px;
  height: 32px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;

  &:hover {
    background: rgba(239, 68, 68, 0.22);
  }
`;

const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;

  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const StatusCbf = styled.span`
  align-self: center;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${({ $tipo, theme }) =>
    $tipo === 'erro'
      ? '#f87171'
      : $tipo === 'ok'
        ? theme.cores.primaria
        : theme.cores.textoSuave};
`;

const LinkCbf = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: ${({ theme }) => theme.cores.texto};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 8px;
  padding: 10px 16px;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.15);
  }
`;

function mensagemUOL(resultado) {
  const hora = new Date(resultado.quando || Date.now()).toLocaleTimeString(
    'pt-BR',
    { hour: '2-digit', minute: '2-digit' },
  );
  if (resultado.mudou) {
    return `Classificação da UOL atualizada às ${hora}`;
  }
  return resultado.origem === 'cache'
    ? `Em dia com a UOL (cache de ${hora})`
    : `Em dia com a UOL · verificado às ${hora}`;
}

export default function ControleBrasileirao() {
  const [statusUol, setStatusUol] = useState(null);

  useEffect(() => {
    recarregar();
    importarClassificacaoUOL()
      .then((resultado) =>
        setStatusUol({ tipo: 'ok', texto: mensagemUOL(resultado) }),
      )
      .catch((e) => {
        console.warn('Brasileirão: falha ao atualizar da UOL.', e);
        setStatusUol({
          tipo: 'erro',
          texto: 'Não foi possível buscar os dados da UOL agora.',
        });
      });
  }, []);
  const estado = usePlacarBroadcast({ getEstado, inscrever });

  async function atualizarDaUOL() {
    setStatusUol({ tipo: 'carregando', texto: 'Buscando dados da UOL...' });
    try {
      const resultado = await importarClassificacaoUOL({ forcar: true });
      setStatusUol({ tipo: 'ok', texto: mensagemUOL(resultado) });
    } catch (e) {
      console.warn('Brasileirão: falha ao atualizar da UOL.', e);
      setStatusUol({
        tipo: 'erro',
        texto:
          'Não foi possível buscar os dados da UOL. Verifique a conexão ou o servidor dev.',
      });
    }
  }

  return (
    <Tela>
      <Header />
      <Titulo>
        Controle · <span>Brasileirão</span>
      </Titulo>
      <PreviaOverlay rota="/brasileirao" altura={420} />

      <Cartao>
        <Rotulo>Competição</Rotulo>
        <LinhaConfig>
          <CampoTexto
            value={estado.competicao}
            maxLength={60}
            onChange={(e) => definirCompeticao(e.target.value)}
          />
          <CampoNumero
            type="number"
            min={0}
            value={estado.rodada}
            title="Rodada"
            onChange={(e) => definirRodada(e.target.value)}
          />
        </LinhaConfig>
      </Cartao>

      <Cartao>
        <Rotulo>Times ({estado.times.length})</Rotulo>
        <GradeTimes>
          <CabecalhoGrid>
            <span className="num">#</span>
            <span />
            <span>NOME</span>
            <span className="num">SIGLA</span>
            <span className="num">P</span>
            <span className="num">J</span>
            <span className="num">V</span>
            <span className="num">E</span>
            <span className="num">D</span>
            <span className="num">GP</span>
            <span className="num">GC</span>
            <span />
          </CabecalhoGrid>
          {ordenarClassificacao(estado.times).map((t) => (
            <LinhaTime key={t._i}>
              <span className="pos">{t._i + 1}</span>
              <CelulaEscudo title="Cor do escudo">
                <Escudo
                  cor={t.cor}
                  sigla={t.sigla}
                  url={t.escudo}
                  tamanho={24}
                />
              </CelulaEscudo>
              <InputNome
                value={t.nome}
                maxLength={24}
                onChange={(e) => atualizarTime(t._i, 'nome', e.target.value)}
              />
              <SeletorSigla
                value={t.sigla}
                onChange={(v) => atualizarTime(t._i, 'sigla', v)}
              />
              {['p', 'j', 'v', 'e', 'd', 'gp', 'gc'].map((campo) => (
                <InputNum
                  key={campo}
                  type="number"
                  min={0}
                  value={t[campo]}
                  onChange={(e) => atualizarTime(t._i, campo, e.target.value)}
                />
              ))}
              <BotaoRemover
                title="Remover time"
                onClick={() => removerTime(t._i)}
              >
                ×
              </BotaoRemover>
            </LinhaTime>
          ))}
        </GradeTimes>
        <Acoes>
          <Botao
            $variante="primario"
            disabled={statusUol?.tipo === 'carregando'}
            title="Busca a classificação atual no site da UOL"
            onClick={atualizarDaUOL}
          >
            ⟳ Atualizar da UOL
          </Botao>
          {statusUol && (
            <StatusCbf $tipo={statusUol.tipo}>{statusUol.texto}</StatusCbf>
          )}
        </Acoes>
        <Acoes>
          <LinkCbf
            href="https://www.uol.com.br/esporte/futebol/campeonatos/brasileirao/"
            target="_blank"
            rel="noreferrer"
            title="Abre a classificação oficial no site da UOL"
          >
            Abrir tabela no site da UOL
          </LinkCbf>
        </Acoes>
        <Acoes>
          <Botao $variante="primario" onClick={adicionarTime}>
            + Adicionar time
          </Botao>
          <Botao onClick={() => zerarEstatisticas()}>Zerar estatísticas</Botao>
          <Botao
            $variante="perigo"
            onClick={() => {
              if (
                window.confirm(
                  'Restaurar tabela padrão? Todos os dados atuais serão perdidos.',
                )
              ) {
                restaurarPadrao();
              }
            }}
          >
            Restaurar padrão
          </Botao>
        </Acoes>
      </Cartao>
    </Tela>
  );
}

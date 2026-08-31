import { useState } from 'react';
import styled from 'styled-components';
import { usePlacarBroadcast } from '../hooks/usePlacarBroadcast';
import {
  FORMACOES,
  atualizarEscalacaoCampo,
  preencherDeSigla,
  atualizarJogador,
  darCartaoJogador,
  removerCartaoJogador,
  realizarSubstituicao,
  marcarGol,
  mostrarEscalacao,
  ocultarEscalacao,
  segundosAtuais,
  placarBroadcastEscalacao,
} from '../store/placarBroadcastEscalacaoStore';
import { CoresFixas } from './CoresFixas';
import { SeletorSigla } from './SeletorSigla';

const VERDE = '#a5ef1c';

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
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
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
  letter-spacing: 1px;
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

const LinhaJogador = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  padding: 8px;
  background: ${({ theme }) => theme.cores.superficie};
`;

const ListaJogadores = styled.div`
  display: flex;
  flex-direction: column;
`;

const BotaoGol = styled.button`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
  background: #1f2937;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1;
  display: grid;
  place-items: center;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.25);
  }
`;

const BotaoCartao = styled.button`
  flex-shrink: 0;
  width: 30px;
  height: 40px;
  padding: 0;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.3);
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 800;
  color: #fff;
  transition: filter 0.15s ease;

  &.amarelo {
    background: #eab308;
    color: #0a0f00;
  }
  &.vermelho {
    background: #dc2626;
  }

  &:hover {
    filter: brightness(1.12);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const TrocarBotao = styled.button`
  flex-shrink: 0;
  width: 30px;
  height: 40px;
  padding: 0;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background: transparent;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${VERDE};
    border-color: rgba(165, 239, 28, 0.45);
  }

  &.ativo {
    color: #0a0f00;
    background: ${VERDE};
    border-color: ${VERDE};
  }
`;

const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
`;

const ToggleCores = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 8px;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: ${VERDE};
  }
`;

const BlocoCores = styled.div`
  margin-top: 8px;
  margin-bottom: 18px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  background: ${({ theme }) => theme.cores.superficie};
`;

const Botao = styled.button`
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

  &.neutro {
    background: ${({ theme }) => theme.cores.fundo};
    border: 1px solid ${({ theme }) => theme.cores.borda};
    color: ${({ theme }) => theme.cores.texto};
    &:hover {
      background: ${({ theme }) => theme.cores.superficieHover};
    }
  }
`;

function CampoNomeDois({ valor, onChange, placeholder }) {
  return (
    <NomeParte
      value={String(valor || '')}
      maxLength={24}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

const NomeParte = styled(Entrada)`
  flex: 1;
  min-width: 0;
  font-size: 0.82rem;
  padding: 8px 10px;
`;

export function PainelEscalacaoBroadcast() {
  const estado = usePlacarBroadcast(placarBroadcastEscalacao);
  const esc = estado.escalacao;
  const [sair, setSair] = useState({ casa: null, fora: null });
  const [entra, setEntra] = useState({
    casa: { num: '', nome: '' },
    fora: { num: '', nome: '' },
  });
  const [coresAberto, setCoresAberto] = useState({});

  const configColuna = (lado) => ({
    lado,
    rotulo: lado === 'casa' ? 'Time da casa' : 'Visitante',
    campoCor: lado === 'casa' ? 'corCasa' : 'corFora',
    campoNome: lado === 'casa' ? 'nomeCasa' : 'nomeFora',
    campoSigla: lado === 'casa' ? 'siglaCasa' : 'siglaFora',
    campoFormacao: lado === 'casa' ? 'formacaoCasa' : 'formacaoFora',
    campoTecnico: lado === 'casa' ? 'tecnicoCasa' : 'tecnicoFora',
  });

  const confirmarTroca = (lado) => {
    const conf = configColuna(lado);
    if (sair[lado] == null) return;
    realizarSubstituicao({
      lado,
      sairIndice: sair[lado],
      numEntra: entra[lado].num,
      nomeEntra: entra[lado].nome,
      minuto: formatarMinuto(estado.cronometro),
    });
    setSair((p) => ({ ...p, [lado]: null }));
    setEntra((p) => ({ ...p, [lado]: { num: '', nome: '' } }));
  };

  return (
    <Painel>
      <Titulo>
        📋 <span>Escalação integrada</span> · cartões por jogador
      </Titulo>

      <GradeTimes>
        {['casa', 'fora'].map((lado) => {
          const conf = configColuna(lado);
          const cor = esc[conf.campoCor];
          const jogadores = esc.jogadores?.[lado] || [];
          return (
            <SecaoTime key={lado} $cor={cor}>
              <RotuloTime>{conf.rotulo}</RotuloTime>
              <Linha>
                <Campo>
                  <Rotulo>Sigla</Rotulo>
                  <div style={{ width: 90 }}>
                    <SeletorSigla
                      value={esc[conf.campoSigla]}
                      onChange={(v) => preencherDeSigla(lado, v)}
                    />
                  </div>
                </Campo>
              </Linha>
              <Linha>
                <Campo className="cresce">
                  <Rotulo>Nome</Rotulo>
                  <Entrada
                    value={esc[conf.campoNome]}
                    maxLength={24}
                    onChange={(e) =>
                      atualizarEscalacaoCampo(conf.campoNome, e.target.value)
                    }
                  />
                </Campo>
                <Campo>
                  <Rotulo>Formação</Rotulo>
                  <Selecao
                    value={esc[conf.campoFormacao]}
                    onChange={(e) =>
                      atualizarEscalacaoCampo(
                        conf.campoFormacao,
                        e.target.value,
                      )
                    }
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
                    value={esc[conf.campoTecnico]}
                    maxLength={28}
                    placeholder="Nome do técnico"
                    onChange={(e) =>
                      atualizarEscalacaoCampo(conf.campoTecnico, e.target.value)
                    }
                  />
                </Campo>
              </Linha>

              <ToggleCores
                type="button"
                onClick={() =>
                  setCoresAberto((p) => ({ ...p, [lado]: !p[lado] }))
                }
              >
                {coresAberto[lado] ? '▾' : '▸'} Cores
              </ToggleCores>
              {coresAberto[lado] && (
                <BlocoCores>
                  <Rotulo>Cor do time</Rotulo>
                  <CoresFixas
                    valor={cor}
                    onChange={(v) => atualizarEscalacaoCampo(conf.campoCor, v)}
                  />
                </BlocoCores>
              )}

              <ListaJogadores>
                {jogadores.map((jogador, i) => (
                  <LinhaJogador key={`jog-${lado}-${i}`}>
                    <EntradaNum
                      type="number"
                      min={0}
                      max={99}
                      value={jogador.num}
                      title="Número"
                      onChange={(e) =>
                        atualizarJogador(lado, i, 'num', e.target.value)
                      }
                    />
                    <CampoNomeDois
                      valor={jogador.nome}
                      placeholder={`Jogador ${i + 1}`}
                      onChange={(nome) =>
                        atualizarJogador(lado, i, 'nome', nome)
                      }
                    />
                    <BotaoCartao
                      className="amarelo"
                      title={
                        jogador.cartoes?.amarelo > 0
                          ? 'Remover cartão amarelo'
                          : 'Dar cartão amarelo'
                      }
                      onClick={() =>
                        jogador.cartoes?.amarelo > 0
                          ? removerCartaoJogador(lado, i, 'amarelo')
                          : darCartaoJogador(lado, i, 'amarelo')
                      }
                    >
                      {jogador.cartoes?.amarelo > 0
                        ? jogador.cartoes.amarelo
                        : 'A'}
                    </BotaoCartao>
                    <BotaoCartao
                      className="vermelho"
                      title={
                        jogador.cartoes?.vermelho > 0
                          ? 'Remover cartão vermelho'
                          : 'Dar cartão vermelho'
                      }
                      onClick={() =>
                        jogador.cartoes?.vermelho > 0
                          ? removerCartaoJogador(lado, i, 'vermelho')
                          : darCartaoJogador(lado, i, 'vermelho')
                      }
                    >
                      {jogador.cartoes?.vermelho > 0
                        ? jogador.cartoes.vermelho
                        : 'V'}
                    </BotaoCartao>
                    <BotaoGol title="Gol" onClick={() => marcarGol(lado, i)}>
                      ⚽
                    </BotaoGol>
                    <TrocarBotao
                      className={sair[lado] === i ? 'ativo' : ''}
                      title={
                        sair[lado] === i
                          ? 'Desfazer seleção'
                          : 'Marcar para sair'
                      }
                      onClick={() =>
                        setSair((p) => ({
                          ...p,
                          [lado]: p[lado] === i ? null : i,
                        }))
                      }
                    >
                      ⇄
                    </TrocarBotao>
                  </LinhaJogador>
                ))}
              </ListaJogadores>

              {sair[lado] != null && (
                <Linha
                  style={{
                    marginTop: 10,
                    padding: 10,
                    border: '1px solid rgba(165,239,28,0.35)',
                    borderRadius: 10,
                    background: 'rgba(165,239,28,0.06)',
                  }}
                >
                  <Campo className="cresce">
                    <Rotulo>Entra (nome)</Rotulo>
                    <Entrada
                      value={entra[lado].nome}
                      maxLength={22}
                      placeholder="Qm entra"
                      onChange={(e) =>
                        setEntra((p) => ({
                          ...p,
                          [lado]: { ...p[lado], nome: e.target.value },
                        }))
                      }
                    />
                  </Campo>
                  <Campo>
                    <Rotulo>Nº</Rotulo>
                    <EntradaNum
                      type="number"
                      min={0}
                      max={99}
                      value={entra[lado].num}
                      onChange={(e) =>
                        setEntra((p) => ({
                          ...p,
                          [lado]: { ...p[lado], num: e.target.value },
                        }))
                      }
                    />
                  </Campo>
                  <Botao
                    className="primario"
                    onClick={() => confirmarTroca(lado)}
                  >
                    Confirmar troca
                  </Botao>
                </Linha>
              )}
            </SecaoTime>
          );
        })}
      </GradeTimes>

      <Acoes>
        {estado.escalacaoVisivel ? (
          <Botao className="perigo" onClick={ocultarEscalacao}>
            Ocultar escalação da tela
          </Botao>
        ) : (
          <Botao className="primario" onClick={mostrarEscalacao}>
            Mostrar escalação na tela
          </Botao>
        )}
      </Acoes>
    </Painel>
  );
}

function formatarMinuto(cron) {
  const s = segundosAtuais(cron);
  return `${Math.floor(s / 60)}'`;
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  extrairClassificacao,
  extrairRodadaDaPagina,
  extrairRodadaDoJson,
  extrairFase,
  buscarClassificacaoSuperPlacar,
  importarClassificacaoSuperPlacar,
  importarUltimaRodadaSuperPlacar,
  importarRodadaAtualSuperPlacar,
  importarMataMataSuperPlacar,
} from './superPlacarService';
import { resolverCasamentos } from './fgfService';
import { getEstado } from '../store/tabelaStore';

/* Fragmento real da página https://superplacar.com.br/campeonato/55/gaucho-serie-a2/
   (bloco .tabela com o cabeçalho .classificacao-topo e as linhas .classificacao). */
const HTML_CLASSIFICACAO = `
<div class="tabela">
  <div class="linha tabela-topo">
    <div class="coluna titulo-tabela"><h2>Primeira Fase</h2></div>
    <div class="coluna legenda"><div class="circulo" style="background-color:#0000FF"></div> Classificado</div>
  </div>
  <div class="linha classificacao-topo">
    <div class="coluna titulo-classificacao"><h2>Classificação</h2></div>
    <div class="coluna pontos">p</div><div class="coluna jogos">j</div>
    <div class="coluna vitorias">v</div><div class="coluna empates">e</div>
    <div class="coluna derrotas">d</div><div class="coluna gols-pro">gp</div>
    <div class="coluna gols-contra">gc</div><div class="coluna saldo-de-gols">sg</div>
  </div>
  <div class="linha classificacao">
    <div class="coluna posicao" aria-label="Posição"><span style="background-color:#0000FF">1</span></div>
    <div class="coluna time" aria-label="Time"><figure><a href="equipe/2758/passo-fundo/"><img src="imagem/times/f1728417476_passo_fundo.png" loading="lazy" width="100" height="100" alt="Passo Fundo"> <figcaption>Passo Fundo</figcaption></a></figure></div>
    <div class="coluna pontos" aria-label="Pontos">29</div><div class="coluna jogos" aria-label="Jogos">14</div>
    <div class="coluna vitorias" aria-label="Vitórias">8</div><div class="coluna empates" aria-label="Empates">5</div>
    <div class="coluna derrotas" aria-label="Derrotas">1</div><div class="coluna gols-pro" aria-label="Gols Pró">21</div>
    <div class="coluna gols-contra" aria-label="Gols Contra">9</div><div class="coluna saldo-de-gols" aria-label="Saldo de Gols">12</div>
  </div>
  <div class="linha classificacao">
    <div class="coluna posicao" aria-label="Posição"><span style="background-color:#000000">15</span></div>
    <div class="coluna time" aria-label="Time"><figure><a href="equipe/3558/gramadense/"><img src="imagem/times/f1728417608_gramadense.png" loading="lazy" width="100" height="100" alt="Gramadense"> <figcaption>Gramadense</figcaption></a></figure></div>
    <div class="coluna pontos" aria-label="Pontos">10</div><div class="coluna jogos" aria-label="Jogos">14</div>
    <div class="coluna vitorias" aria-label="Vitórias">1</div><div class="coluna empates" aria-label="Empates">7</div>
    <div class="coluna derrotas" aria-label="Derrotas">6</div><div class="coluna gols-pro" aria-label="Gols Pró">9</div>
    <div class="coluna gols-contra" aria-label="Gols Contra">18</div><div class="coluna saldo-de-gols" aria-label="Saldo de Gols">-9</div>
  </div>
  <div class="linha classificacao">
    <div class="coluna posicao" aria-label="Posição"><span style="background-color:#FF0000">16</span></div>
    <div class="coluna time" aria-label="Time"><figure><a href="equipe/2514/lajeadense/"><img src="imagem/times/f1728417520_lajeadense.png" loading="lazy" width="100" height="100" alt="Lajeadense"> <figcaption>Lajeadense</figcaption></a></figure></div>
    <div class="coluna pontos" aria-label="Pontos">5</div><div class="coluna jogos" aria-label="Jogos">14</div>
    <div class="coluna vitorias" aria-label="Vitórias">1</div><div class="coluna empates" aria-label="Empates">2</div>
    <div class="coluna derrotas" aria-label="Derrotas">11</div><div class="coluna gols-pro" aria-label="Gols Pró">5</div>
    <div class="coluna gols-contra" aria-label="Gols Contra">21</div><div class="coluna saldo-de-gols" aria-label="Saldo de Gols">-16</div>
  </div>
</div>`;

describe('superPlacarService — extrairClassificacao', () => {
  it('extrai somente as linhas de classificação (ignora cabeçalho e legendas)', () => {
    const dados = extrairClassificacao(HTML_CLASSIFICACAO);
    expect(dados.length).toBe(3);
    expect(dados.map((t) => t.pos)).toEqual([1, 15, 16]);
  });

  it('lê nome, pontos e estatísticas de cada linha', () => {
    const dados = extrairClassificacao(HTML_CLASSIFICACAO);
    const primeiro = dados[0];
    expect(primeiro.nome).toBe('Passo Fundo');
    expect(primeiro.p).toBe(29);
    expect(primeiro.j).toBe(14);
    expect(primeiro.v).toBe(8);
    expect(primeiro.e).toBe(5);
    expect(primeiro.d).toBe(1);
    expect(primeiro.gp).toBe(21);
    expect(primeiro.gc).toBe(9);
  });

  it('converte saldo e nomes com acento corretamente', () => {
    const dados = extrairClassificacao(HTML_CLASSIFICACAO);
    expect(dados[1].nome).toBe('Gramadense');
    expect(dados[2].nome).toBe('Lajeadense');
  });
});

describe('superPlacarService — integração com o store da tabela', () => {
  it('casa os 16 times do SuperPlacar com os times locais', () => {
    const timesLocais = getEstado().times;
    const dadosFgf = [
      ['Passo Fundo', 29], ['Veranópolis', 25], ['União Frederiquense', 24],
      ['Esportivo', 24], ['Brasil-Far', 23], ['Santa Cruz-RS', 22],
      ['Brasil', 21], ['Apafut', 21], ['Aimoré', 20], ['Pelotas', 15],
      ['Guarani-VA', 15], ['Gaúcho', 12], ['Bagé', 12], ['Glória', 11],
      ['Gramadense', 10], ['Lajeadense', 5],
    ].map(([nome, p]) => ({ nome, p }));
    const pares = resolverCasamentos(timesLocais, dadosFgf);
    expect(pares.length).toBe(16);
    expect(pares.map((p) => p.indice).sort((a, b) => a - b)).toEqual(
      timesLocais.map((_, i) => i),
    );
    expect(pares.find((p) => p.indice === 0).stats.p).toBe(29);
  });
});

describe('superPlacarService — classificação', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('cai para a página da primeira fase quando a raiz não tem tabela', async () => {
    const chamadas = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        chamadas.push(String(url));
        return { ok: true, text: async () => HTML_CLASSIFICACAO };
      }),
    );

    const dados = await buscarClassificacaoSuperPlacar();
    expect(dados.length).toBe(3);
    expect(chamadas[0]).toContain('/campeonato/55/gaucho-serie-a2/');
    expect(chamadas[0]).not.toContain('2803');
  });

  it('usa a primeira fase quando a raiz responde sem classificação', async () => {
    const chamadas = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        const u = String(url);
        chamadas.push(u);
        // A raiz passou a servir a fase de mata-mata: sem tabela.
        if (!u.includes('2803')) {
          return { ok: true, text: async () => '<div class="grupos"></div>' };
        }
        return { ok: true, text: async () => HTML_CLASSIFICACAO };
      }),
    );

    const dados = await buscarClassificacaoSuperPlacar();
    expect(dados.length).toBe(3);
    expect(chamadas.some((u) => u.includes('2803/primeira-fase'))).toBe(true);
  });

  it('aplica os pontos no store da tabela', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, text: async () => HTML_CLASSIFICACAO })),
    );
    const resultado = await importarClassificacaoSuperPlacar({ forcar: true });
    expect(resultado.total).toBe(3);
    expect(resultado.atualizados).toBe(3);
    const passoFundo = getEstado().times.find((t) => t.sigla === 'PAS');
    expect(passoFundo.p).toBe(29);
  });
});

const HTML_RODADA = `
<div class="rodada">
  <div class="navegacao">
    <a href="#" class="nav-prev-rodada" data-partida="69980"></a>
    <div class="titulo-rodada"><h2>15ª rodada</h2></div>
    <a href="#" class="nav-prox-rodada" data-partida="69980"></a>
  </div>
  <div class="lista-jogos">
    <div class="jogo em-breve" data-id="69980">
      <div class="resultado partida">
        <div class="time time-1"><img alt="Aimoré"><a href="equipe/1769/aimore/" class="nome-time">Aimoré</a></div>
        <div class="placar"> - </div>
        <div class="time time-2"><img alt="Esportivo"><a href="equipe/2242/esportivo/" class="nome-time">Esportivo</a></div>
      </div>
    </div>
    <div class="jogo encerrado" data-id="69973">
      <div class="resultado partida">
        <div class="time time-1"><a href="equipe/36/brasil/" class="nome-time">Brasil</a></div>
        <div class="placar">2 - 0</div>
        <div class="time time-2"><a href="equipe/2339/gloria/" class="nome-time">Glória</a></div>
      </div>
    </div>
  </div>
</div>`;

const JSON_RODADA = {
  rodada: '14ª rodada',
  partidas: [
    {
      id: 69973,
      status: 'encerrado',
      nmMand: 'Brasil',
      nmAdv: 'Glória',
      qtdGolsMand: 2,
      qtdGolsAdv: 0,
    },
    {
      id: 69980,
      status: 'em-breve',
      nmMand: 'Aimoré',
      nmAdv: 'Esportivo',
      qtdGolsMand: 0,
      qtdGolsAdv: 0,
    },
  ],
};

describe('superPlacarService — extrairRodadaDaPagina', () => {
  it('lê título, id da primeira partida e placares', () => {
    const rodada = extrairRodadaDaPagina(HTML_RODADA);
    expect(rodada.titulo).toBe('15ª rodada');
    expect(rodada.numero).toBe(15);
    expect(rodada.primeiraPartida).toBe('69980');
    expect(rodada.jogos.length).toBe(2);
    expect(rodada.realizados).toBe(1);
    expect(rodada.jogos[1]).toMatchObject({
      casaNome: 'Brasil',
      foraNome: 'Glória',
      casaGols: '2',
      foraGols: '0',
    });
    expect(rodada.jogos[0].casaGols).toBe('');
  });
});

describe('superPlacarService — extrairRodadaDoJson', () => {
  it('lê a rodada e zera o placar de jogos não realizados', () => {
    const rodada = extrairRodadaDoJson(JSON_RODADA);
    expect(rodada.titulo).toBe('14ª rodada');
    expect(rodada.numero).toBe(14);
    expect(rodada.primeiraPartida).toBe('69973');
    expect(rodada.realizados).toBe(1);
    expect(rodada.jogos[0]).toMatchObject({
      casaNome: 'Brasil',
      foraNome: 'Glória',
      casaGols: '2',
      foraGols: '0',
    });
    expect(rodada.jogos[1].casaGols).toBe('');
  });
});

const HTML_RODADA_SEM_PLACAR = `
<div class="rodada">
  <div class="navegacao">
    <a href="#" class="nav-prev-rodada" data-partida="69980"></a>
    <div class="titulo-rodada"><h2>15ª rodada</h2></div>
  </div>
  <div class="lista-jogos">
    <div class="jogo em-breve" data-id="69980">
      <div class="resultado partida">
        <div class="time time-1"><a href="equipe/1769/aimore/" class="nome-time">Aimoré</a></div>
        <div class="placar"> - </div>
        <div class="time time-2"><a href="equipe/2242/esportivo/" class="nome-time">Esportivo</a></div>
      </div>
    </div>
  </div>
</div>`;

const HTML_PAGINA = `${HTML_CLASSIFICACAO}${HTML_RODADA_SEM_PLACAR}`;

const JSON_ANTERIOR = {
  status: true,
  rodada: '14ª rodada',
  partidas: [
    {
      id: 69973,
      status: 'encerrado',
      nmMand: 'Brasil',
      nmAdv: 'Glória',
      qtdGolsMand: 2,
      qtdGolsAdv: 0,
    },
    {
      id: 69977,
      status: 'encerrado',
      nmMand: 'Passo Fundo',
      nmAdv: 'Guarani-VA',
      qtdGolsMand: 2,
      qtdGolsAdv: 1,
    },
  ],
};

describe('superPlacarService — importarUltimaRodadaSuperPlacar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('pega automaticamente a última rodada com jogos e atualiza o título', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        if (String(url).includes('rodada/anterior/69980')) {
          return { ok: true, json: async () => JSON_ANTERIOR };
        }
        return { ok: true, text: async () => HTML_PAGINA };
      }),
    );

    const dados = await importarUltimaRodadaSuperPlacar();
    expect(dados.titulo).toBe('14ª rodada');
    expect(dados.origem).toBe('rede');
    expect(dados.jogos.length).toBe(2);
    expect(dados.jogos[0]).toMatchObject({
      casaSigla: 'BRA',
      foraSigla: 'GLO',
      casaGols: '2',
      foraGols: '0',
    });
    expect(dados.jogos[1]).toMatchObject({
      casaSigla: 'PAS',
      foraSigla: 'GUA',
    });
  });
});

describe('superPlacarService — importarRodadaAtualSuperPlacar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('usa a rodada exibida no site (sem voltar) com placares ao vivo', async () => {
    const chamadas = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        chamadas.push(String(url));
        return { ok: true, text: async () => `${HTML_CLASSIFICACAO}${HTML_RODADA}` };
      }),
    );

    const dados = await importarRodadaAtualSuperPlacar({ forcar: true });
    expect(dados.titulo).toBe('15ª rodada');
    expect(dados.origem).toBe('rede');
    expect(dados.jogos.length).toBe(2);
    expect(dados.jogos[0]).toMatchObject({ casaSigla: 'AIM', foraSigla: 'ESP' });
    expect(dados.jogos[0].casaGols).toBe('');
    expect(dados.jogos[1]).toMatchObject({
      casaSigla: 'BRA',
      foraSigla: 'GLO',
      casaGols: '2',
      foraGols: '0',
    });
    expect(chamadas.some((u) => u.includes('rodada/anterior'))).toBe(false);
  });
});

/* Fragmento real da página de fase
   https://superplacar.com.br/campeonato/55/gaucho-serie-a2/2949/quartas-de-final/
   Cada .chave traz a perna de ida, o .titulo-chave e a perna de volta. */
const jogoChave = (id, casa, fora, placar = ' - ', data = '03/10/2026 - 15:00') => `
  <div class="lista-jogos">
    <div class='jogo em-breve' data-id='${id}'>
      <div class="topo"><div class="programacao"><span class='status'>Em breve</span> <span class='data-horario'>${data}</span></div></div>
      <div class="resultado partida">
        <div class="time time-1"><a href="equipe/x/${casa}/" class=' nome-time'>${casa}</a></div>
        <div class="placar">${placar}</div>
        <div class="time time-2"><a href="equipe/y/${fora}/" class=' nome-time'>${fora}</a></div>
      </div>
    </div>
  </div>`;

const chaveReal = (nome, jogo1, jogo2) => `
  <div class="chave">
    ${jogo1}
    <div class="titulo-chave">${nome}</div>
    ${jogo2}
  </div>`;

const HTML_MATA_MATA = `
<div class="titulo-rodada"><h2>Quartas de Final</h2></div>
<div class="grupos">
  ${chaveReal(
    'Chave 1',
    jogoChave(72996, 'Apafut', 'Santa Cruz-RS'),
    jogoChave(73002, 'Santa Cruz-RS', 'Apafut', ' - ', '11/10/2026 - 15:00'),
  )}
  ${chaveReal(
    'Chave 2',
    jogoChave(72997, 'Brasil-Far', 'Passo Fundo'),
    jogoChave(73001, 'Passo Fundo', 'Brasil-Far', ' - ', '11/10/2026 - 15:00'),
  )}
  ${chaveReal(
    'Chave 3',
    jogoChave(72998, 'Brasil', 'Esportivo'),
    jogoChave(73000, 'Esportivo', 'Brasil', ' - ', '10/10/2026 - 17:00'),
  )}
  ${chaveReal(
    'Chave 4',
    jogoChave(72999, 'União Frederiquense', 'Veranópolis'),
    jogoChave(73003, 'Veranópolis', 'União Frederiquense', ' - ', '11/10/2026 - 15:00'),
  )}
</div>`;

describe('superPlacarService — extrairFase', () => {
  it('lê o título da fase e as quatro chaves', () => {
    const { titulo, chaves } = extrairFase(HTML_MATA_MATA);
    expect(titulo).toBe('Quartas de Final');
    expect(chaves.length).toBe(4);
    expect(chaves.map((c) => c.nome)).toEqual([
      'Chave 1',
      'Chave 2',
      'Chave 3',
      'Chave 4',
    ]);
  });

  it('lê as duas pernas de cada chave', () => {
    const { chaves } = extrairFase(HTML_MATA_MATA);
    expect(chaves[0].jogos.length).toBe(2);
    expect(chaves[0].jogos[0]).toMatchObject({
      casaNome: 'Apafut',
      foraNome: 'Santa Cruz-RS',
    });
    expect(chaves[0].jogos[1]).toMatchObject({
      casaNome: 'Santa Cruz-RS',
      foraNome: 'Apafut',
    });
    expect(chaves[0].jogos[0].data).toBe('03/10/2026 - 15:00');
  });

  it('lê o placar quando a partida já foi disputada', () => {
    const { chaves } = extrairFase(HTML_MATA_MATA);
    const comPlacar = extrairFase(
      `<div class="grupos">${chaveReal(
        'Chave 1',
        jogoChave(1, 'Brasil', 'Esportivo', '2 - 0'),
        jogoChave(2, 'Esportivo', 'Brasil'),
      )}</div>`,
    );
    expect(comPlacar.chaves[0].jogos[0]).toMatchObject({
      casaGols: '2',
      foraGols: '0',
    });
    expect(chaves[0].jogos[0].casaGols).toBe('');
  });
});

describe('superPlacarService — importarMataMataSuperPlacar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('manda uma confrontos por chave, com a sigla, cor e escudo locais', async () => {
    const chamadas = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        chamadas.push(String(url));
        return { ok: true, text: async () => HTML_MATA_MATA };
      }),
    );

    const dados = await importarMataMataSuperPlacar({ forcar: true });
    expect(dados.origem).toBe('rede');
    expect(dados.fase).toBe('Quartas de Final');
    expect(dados.confrontos.length).toBe(4);

    expect(dados.confrontos[0].casa.sigla).toBe('APA');
    expect(dados.confrontos[0].casa.nome).toBe('Apafut');
    expect(dados.confrontos[0].visitante.sigla).toBe('SCR');
    expect(dados.confrontos[0].casa.escudo).toBe('/escudos/APA.png');
    expect(dados.confrontos[0].casa.gols).toBeNull();

    expect(dados.confrontos[1].casa.sigla).toBe('BFR');
    expect(dados.confrontos[1].visitante.sigla).toBe('PAS');
    expect(dados.confrontos[2].casa.sigla).toBe('BRA');
    expect(dados.confrontos[2].visitante.sigla).toBe('ESP');
    expect(dados.confrontos[3].casa.sigla).toBe('UFR');
    expect(dados.confrontos[3].visitante.sigla).toBe('VER');

    expect(chamadas.some((u) => u.includes('2949/quartas-de-final'))).toBe(true);
  });

  it('usa o cache quando a rede falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, text: async () => HTML_MATA_MATA })),
    );
    await importarMataMataSuperPlacar();

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      }),
    );
    const dados = await importarMataMataSuperPlacar();
    expect(dados.origem).toBe('cache');
    expect(dados.confrontos.length).toBe(4);
  });
});
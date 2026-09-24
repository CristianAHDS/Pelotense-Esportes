import { describe, it, expect } from 'vitest';
import { extrairClassificacao } from './superPlacarService';
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
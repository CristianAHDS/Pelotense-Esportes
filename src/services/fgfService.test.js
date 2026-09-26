import { describe, it, expect } from 'vitest';
import { extrairClassificacao, resolverCasamentos } from './fgfService';
import { getEstado } from '../store/tabelaStore';

/* Fragmento real da página https://fgf.com.br/competicoes/profissional/24/2026/4218
   depois que a FGF passou a marcar o clube com "*" (rodapé):
   title="Brasil SAF *" e a célula de sigla virou "3º BRA *". */
const HTML_CLASSIFICACAO = `
<table>
  <tr>
    <th class="posicao">Posição</th><th title="Pontos Ganhos" class="dados">PG</th>
    <th title="Jogos" class="dados">J</th><th title="Vitórias" class="dados">V</th>
    <th title="Empates" class="dados">E</th><th title="Derrotas" class="dados">D</th>
    <th title="Gols Pró" class="dados">GP</th><th title="Gols Contra" class="dados">GC</th>
    <th title="Saldo de Gols" class="dados">SG</th>
    <th title="Cartões Amarelos" class="dados uk-hidden-small">CA</th>
    <th title="Cartões Vermelhos" class="dados uk-hidden-small">CV</th>
    <th title="Aproveitamento" class="dados uk-hidden-small">%</th>
  </tr>
  <tr>
    <td class="posicao-time"><b style="">3º</b><img src="https://www.fgf.com.br/public/uploads/clubes/brasil.png" title="Brasil SAF *" height="36" width="36">Brasil SAF *</td>
    <td class="posicao-time2"><b style="">3º</b><img src="https://www.fgf.com.br/public/uploads/clubes/brasil.png" title="Brasil SAF *" height="30" width="30">BRA *</td>
    <td title="Pontos Ganhos" class="pontos" style="font-size:16px;">24</td>
    <td title="Jogos" class="dados">14</td><td title="Vitórias" class="dados">6</td>
    <td title="Empates" class="dados">6</td><td title="Derrotas" class="dados">2</td>
    <td title="Gols Pró" class="dados">17</td><td title="Gols Contra" class="dados">8</td>
    <td title="Saldo de Gols" class="dados">9</td>
    <td title="Cartões Amarelos" class="dados uk-hidden-small">40</td>
    <td title="Cartões Vermelhos" class="dados uk-hidden-small">3</td>
    <td title="Aproveitamento" class="dados uk-hidden-small">57</td>
  </tr>
  <tr>
    <td class="posicao-time"><b style="">6º</b><img src="https://www.fgf.com.br/public/uploads/clubes/brasilf.jpg" title="Brasil de Farroupilha" height="36" width="36">Brasil de Farroupilha</td>
    <td class="posicao-time2"><b style="">6º</b><img src="https://www.fgf.com.br/public/uploads/clubes/brasilf.jpg" title="Brasil de Farroupilha" height="30" width="30">BFA</td>
    <td title="Pontos Ganhos" class="pontos" style="font-size:16px;">23</td>
    <td title="Jogos" class="dados">14</td><td title="Vitórias" class="dados">5</td>
    <td title="Empates" class="dados">8</td><td title="Derrotas" class="dados">1</td>
    <td title="Gols Pró" class="dados">15</td><td title="Gols Contra" class="dados">9</td>
    <td title="Saldo de Gols" class="dados">6</td>
    <td title="Cartões Amarelos" class="dados uk-hidden-small">41</td>
    <td title="Cartões Vermelhos" class="dados uk-hidden-small">2</td>
    <td title="Aproveitamento" class="dados uk-hidden-small">55</td>
  </tr>
</table>`;

describe('fgfService — extrairClassificacao', () => {
  const dados = extrairClassificacao(HTML_CLASSIFICACAO);

  it('lê as duas linhas da tabela', () => {
    expect(dados.length).toBe(2);
    expect(dados.map((t) => t.pos)).toEqual([3, 6]);
  });

  it('descarta o marcador "*" do nome e devolve o nome canônico', () => {
    expect(dados[0].nome).toBe('Brasil');
    expect(dados[0].nome).not.toContain('*');
    expect(dados[1].nome).toBe('Brasil - FAR');
  });

  it('não transforma o marcador "*" na sigla do time', () => {
    expect(dados.map((t) => t.sigla)).toEqual(['BRA', 'BFA']);
  });

  it('lê pontos e estatísticas ignorando as colunas extras', () => {
    expect(dados[0]).toMatchObject({
      p: 24,
      j: 14,
      v: 6,
      e: 6,
      d: 2,
      gp: 17,
      gc: 8,
    });
  });
});

describe('fgfService — integração com o store da tabela', () => {
  it('casa "Brasil SAF *" no Brasil (BRA) e "Brasil de Farroupilha" no BFR', () => {
    const timesLocais = getEstado().times;
    const pares = resolverCasamentos(timesLocais, extrairClassificacao(HTML_CLASSIFICACAO));
    const porSigla = (sigla) =>
      pares.find((p) => timesLocais[p.indice].sigla === sigla);

    expect(pares.length).toBe(2);
    expect(porSigla('BRA').stats).toMatchObject({ p: 24, j: 14, gp: 17, gc: 8 });
    expect(porSigla('BFR').stats).toMatchObject({ p: 23, j: 14, gp: 15, gc: 9 });
  });
});

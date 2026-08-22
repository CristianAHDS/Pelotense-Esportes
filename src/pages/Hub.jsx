import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { LOGO_URL } from '../theme';

/* ---------- Dados dos segmentos ---------- */

const SCOREBOARDS = [
  {
    rota: '/placar-broadcast',
    tag: 'BROADCAST',
    titulo: 'Placar Broadcast',
    descricao:
      'Design flat profissional com siglas e cores personalizáveis. Ideal para transmissões ao vivo e overlays.',
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.2)',
    previa: {
      faixa: '#0b0b0b',
      tempoFundo: 'transparent',
      tempoTexto: '#ffffff',
      corpo: '#101010',
      casaFundo: '#008f3d',
      visFundo: '#2a2a2a',
      faixaCasa: '#00652c',
      faixaVis: '#1d1d1d',
      posicao: 'lados',
      sep: '#000000',
      texto: '#ffffff',
    },
  },
  {
    rota: '/placar-pl',
    tag: 'PREMIER LEAGUE',
    titulo: 'Placar Premier League',
    descricao:
      'Identidade da Premier League em roxo e verde menta, com cronômetro em destaque.',
    accent: '#00ff87',
    glow: 'rgba(0, 255, 135, 0.16)',
    previa: {
      faixa: 'rgba(0,0,0,.78)',
      tempoFundo: '#00ff87',
      tempoTexto: '#001a0d',
      corpo: '#38003c',
      casaFundo: 'rgba(255,255,255,.08)',
      visFundo: 'rgba(255,255,255,.08)',
      faixaCasa: '#008f3d',
      faixaVis: '#dc2626',
      posicao: 'base',
      sep: 'rgba(0,0,0,.55)',
      texto: '#ffffff',
    },
  },
  {
    rota: '/placar-bl',
    tag: 'BUNDESLIGA',
    titulo: 'Placar Bundesliga',
    descricao:
      'Estilo alemão: vermelho e grafite, paralelogramos inclinados e cantos retos.',
    accent: '#d20515',
    glow: 'rgba(210, 5, 21, 0.22)',
    previa: {
      faixa: 'rgba(0,0,0,.78)',
      tempoFundo: '#d20515',
      tempoTexto: '#ffffff',
      corpo: '#17191d',
      casaFundo: 'rgba(255,255,255,.07)',
      visFundo: 'rgba(255,255,255,.07)',
      faixaCasa: '#8e030e',
      faixaVis: '#3f3f46',
      posicao: 'lados',
      sep: '#d20515',
      texto: '#ffffff',
      italico: true,
    },
  },
  {
    rota: '/placar-ll',
    tag: 'LALIGA',
    titulo: 'Placar LaLiga',
    descricao:
      'Visual espanhol: barra branca com coral e azul-marinho, limpo e arredondado.',
    accent: '#ff4b44',
    glow: 'rgba(255, 75, 68, 0.18)',
    previa: {
      faixa: '#0b1e3a',
      tempoFundo: '#ff4b44',
      tempoTexto: '#ffffff',
      corpo: '#ffffff',
      casaFundo: '#ffffff',
      visFundo: '#ffffff',
      faixaCasa: '#008f3d',
      faixaVis: '#dc2626',
      posicao: 'base',
      sep: '#ff4b44',
      texto: '#0b1e3a',
    },
  },
];

const TABELAS = [
  {
    titulo: 'Classificação',
    descricao:
      'Tabela de classificação da competição atualizada em tempo real.',
    rota: '/tabela',
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.16)',
    ativo: true,
  },
  {
    titulo: 'Artilharia',
    descricao: 'Ranking de artilheiros com gols por rodada e médias.',
  },
];

const ESPORTES = [
  {
    titulo: 'Basquete',
    descricao: 'Placar de basquete com pontos, faltas e posse de bola.',
  },
  {
    titulo: 'Vôlei',
    descricao: 'Placar de vôlei com sets, pontos por set e saques.',
  },
];

/* ---------- Estilos ---------- */

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(
        ellipse 70% 40% at 50% -5%,
        rgba(34, 197, 94, 0.08),
        transparent
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.013) 0 1px,
        transparent 1px 140px
      ),
      repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.01) 0 1px,
        transparent 1px 140px
      );
  }
`;

const Conteudo = styled.main`
  position: relative;
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 32px 56px;
`;

const Hero = styled.section`
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 26px 32px;
  margin-bottom: 12px;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.09),
    ${({ theme }) => theme.cores.fundoClaro} 55%
  );
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-left: 4px solid ${({ theme }) => theme.cores.primaria};
  border-radius: 16px;

  img {
    width: 84px;
    height: 84px;
    object-fit: contain;
    filter: drop-shadow(0 0 22px rgba(34, 197, 94, 0.4));
  }

  h1 {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 700;
    letter-spacing: 3px;
    line-height: 1.05;
    text-transform: uppercase;
  }

  p {
    margin-top: 6px;
    color: ${({ theme }) => theme.cores.textoSuave};
    font-size: 0.95rem;
    max-width: 560px;
  }
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.primaria};
  border: 1px solid rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.07);
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 10px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.cores.primaria};
    animation: pulsoHero 1.2s ease-in-out infinite;
  }

  @keyframes pulsoHero {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }
`;

const Segmento = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 44px 0 20px;

  &:first-of-type {
    margin-top: 36px;
  }

  h2 {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.texto};
    white-space: nowrap;
  }

  &::after {
    content: '';
    order: 3;
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.cores.borda},
      transparent
    );
  }
`;

const SegmentoIcone = styled.span`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  font-size: 1.1rem;
  background: ${({ theme }) => theme.cores.fundoClaro};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
`;

const Contador = styled.span`
  order: 4;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.cores.textoSuave};
  background: ${({ theme }) => theme.cores.fundoClaro};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 999px;
  padding: 3px 11px;
`;

const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  position: relative;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.cores.superficie},
    ${({ theme }) => theme.cores.fundoClaro}
  );
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 14px;
  padding: 24px;
  padding-top: 27px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $accent, theme }) => $accent || theme.cores.primaria};
    opacity: 0.9;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ $accent, theme }) => $accent || theme.cores.primaria};
    box-shadow: 0 16px 36px -14px ${({ $glow }) => $glow || 'transparent'};
  }

  &.breve {
    opacity: 0.45;
    &::before {
      opacity: 0.35;
    }
    &:hover {
      transform: none;
      border-color: ${({ theme }) => theme.cores.borda};
      box-shadow: none;
    }
  }
`;

const CardTag = styled.span`
  align-self: flex-start;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ $accent, theme }) => $accent || theme.cores.textoSuave};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ theme }) => theme.cores.borda};
  padding: 3px 9px;
  border-radius: 5px;
`;

const CardTitulo = styled.h3`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  line-height: 1.15;
`;

const CardDescricao = styled.p`
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: 0.85rem;
  line-height: 1.55;
  flex: 1;
`;

const Miniatura = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 112px;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background:
    radial-gradient(
      circle at 25% 30%,
      rgba(34, 197, 94, 0.06),
      transparent 65%
    ),
    repeating-linear-gradient(
      90deg,
      ${({ theme }) => theme.cores.fundo} 0 44px,
      #0c1220 44px 88px
    );

  .m-faixa {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 28px;
    padding: 6px 16px;
    border-radius: 6px 6px 0 0;
    font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
  }

  .m-periodo {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.65);
  }

  .m-tempo {
    padding: 2px 12px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 2px;
    font-variant-numeric: tabular-nums;
  }

  .m-acrescimo {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 1px;
    color: #fbbf24;
  }

  .m-corpo {
    display: flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-radius: 0 0 6px 6px;
  }

  .m-bloco {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 18px;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 1.5px;
  }

  .m-gol {
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
  }

  .m-sep {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 700;
    opacity: 0.55;
  }
`;

const MiniaturaTabela = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 112px;
  overflow: hidden;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background:
    radial-gradient(circle at 25% 30%, rgba(34, 197, 94, 0.06), transparent 65%),
    ${({ theme }) => theme.cores.fundo};
`;

const MiniLinhaTab = styled.div`
  display: grid;
  grid-template-columns: 22px 1fr 30px;
  align-items: center;
  gap: 8px;
  padding: 3px 6px;
  border-left: 3px solid ${({ $zona }) => $zona || 'transparent'};
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.03);

  .pos {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.62rem;
    font-weight: 700;
    color: ${({ theme }) => theme.cores.textoSuave};
    text-align: center;
  }

  .time {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  i {
    width: 9px;
    height: 9px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .sigla {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .p {
    font-size: 0.68rem;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    color: #22c55e;
    text-align: center;
  }
`;

const LINHAS_MINI_TAB = [
  { pos: 1, sigla: 'FLA', cor: '#c52613', p: 64, zona: '#22c55e' },
  { pos: 2, sigla: 'PAL', cor: '#006437', p: 61, zona: '#22c55e' },
  { pos: 3, sigla: 'BOT', cor: '#2b2b2b', p: 57, zona: '#3b82f6' },
  { pos: 4, sigla: 'FOR', cor: '#1b5faa', p: 53, zona: '#ef4444' },
];

function MiniaturaTabelaPreview() {
  return (
    <MiniaturaTabela>
      {LINHAS_MINI_TAB.map((l) => (
        <MiniLinhaTab key={l.pos} $zona={l.zona}>
          <span className="pos">{l.pos}</span>
          <span className="time">
            <i style={{ background: l.cor }} />
            <span className="sigla">{l.sigla}</span>
          </span>
          <span className="p">{l.p}</span>
        </MiniLinhaTab>
      ))}
    </MiniaturaTabela>
  );
}

function faixaLateral(p, cor, primeiro) {
  if (p.posicao === 'base') return { boxShadow: `inset 0 -3px 0 ${cor}` };
  return primeiro
    ? { borderLeft: `3px solid ${cor}` }
    : { borderRight: `3px solid ${cor}` };
}

function PreviaEstatica({ p }) {
  return (
    <Miniatura>
      <div className="m-faixa" style={{ background: p.faixa }}>
        <span className="m-periodo">1T</span>
        <span
          className="m-tempo"
          style={{
            background: p.tempoFundo,
            color: p.tempoTexto,
            fontStyle: p.italico ? 'italic' : 'normal',
          }}
        >
          45:00
        </span>
        <span className="m-acrescimo">+5:00</span>
      </div>
      <div className="m-corpo">
        <div
          className="m-bloco"
          style={{
            background: p.casaFundo,
            color: p.texto,
            ...faixaLateral(p, p.faixaCasa, true),
          }}
        >
          <span>PAL</span>
          <span className="m-gol">2</span>
        </div>
        <div className="m-sep" style={{ color: p.sep }}>
          ×
        </div>
        <div
          className="m-bloco"
          style={{
            background: p.visFundo,
            color: p.texto,
            ...faixaLateral(p, p.faixaVis, false),
          }}
        >
          <span className="m-gol">1</span>
          <span>VIS</span>
        </div>
      </div>
    </Miniatura>
  );
}

const PreviaRotulo = styled.span`
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ theme }) => theme.cores.perigo};
    animation: pulsoPrevia 1.2s ease-in-out infinite;
  }

  @keyframes pulsoPrevia {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }
`;

const EmBreveChip = styled.span`
  align-self: flex-start;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.alerta};
  border: 1px dashed rgba(245, 158, 11, 0.4);
  padding: 5px 12px;
  border-radius: 999px;
`;

const CardAcoes = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 2px;
`;

const Botao = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 11px 14px;
  border-radius: 9px;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    filter 0.15s ease,
    background 0.15s ease;

  &.primario {
    background: ${({ theme }) => theme.cores.primaria};
    color: #052e13;
    &:hover {
      filter: brightness(1.12);
    }
  }

  &.secundario {
    background: transparent;
    border: 1px solid ${({ theme }) => theme.cores.borda};
    color: ${({ theme }) => theme.cores.texto};
    &:hover {
      background: ${({ theme }) => theme.cores.superficieHover};
    }
  }
`;

const Rodape = styled.footer`
  text-align: center;
  padding: 26px;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: 0.75rem;
  letter-spacing: 2px;
`;

/* ---------- Página ---------- */

export default function Hub() {
  return (
    <Container>
      <Header />
      <Conteudo>
        <Hero>
          <img src={LOGO_URL} alt="Logo Pelotense Esportes" />
          <div>
            <HeroBadge>Sistema de placares ao vivo</HeroBadge>
            <h1>Pelotense Esportes</h1>
            <p>
              Central de overlays e placares profissionais para transmissões.
              Escolha um módulo para abrir a visualização ou o controle remoto.
            </p>
          </div>
        </Hero>

        <Segmento>
          <SegmentoIcone>📺</SegmentoIcone>
          <h2>Scoreboards</h2>
          <Contador>{SCOREBOARDS.length} ativos</Contador>
        </Segmento>
        <Grade>
          {SCOREBOARDS.map((m) => (
            <Card key={m.rota} $accent={m.accent} $glow={m.glow}>
              <CardTag $accent={m.accent}>{m.tag}</CardTag>
              <CardTitulo>{m.titulo}</CardTitulo>
              <CardDescricao>{m.descricao}</CardDescricao>
              <PreviaRotulo>Prévia do placar</PreviaRotulo>
              <PreviaEstatica p={m.previa} />
              <CardAcoes>
                <Botao to={m.rota} className="primario">
                  Abrir
                </Botao>
                <Botao to={`${m.rota}/controle`} className="secundario">
                  Controlar
                </Botao>
              </CardAcoes>
            </Card>
          ))}
        </Grade>

        <Segmento>
          <SegmentoIcone>📊</SegmentoIcone>
          <h2>Tabelas</h2>
          <Contador>1 ativo</Contador>
        </Segmento>
        <Grade>
          {TABELAS.map((t) =>
            t.ativo ? (
              <Card key={t.titulo} $accent={t.accent} $glow={t.glow}>
                <CardTag $accent={t.accent}>CLASSIFICAÇÃO</CardTag>
                <CardTitulo>{t.titulo}</CardTitulo>
                <CardDescricao>{t.descricao}</CardDescricao>
                <MiniaturaTabelaPreview />
                <CardAcoes>
                  <Botao to={t.rota} className="primario">
                    Abrir
                  </Botao>
                  <Botao to={`${t.rota}/controle`} className="secundario">
                    Controlar
                  </Botao>
                </CardAcoes>
              </Card>
            ) : (
              <Card key={t.titulo} className="breve" $accent="#f59e0b">
                <CardTitulo>{t.titulo}</CardTitulo>
                <CardDescricao>{t.descricao}</CardDescricao>
                <EmBreveChip>Em breve</EmBreveChip>
              </Card>
            )
          )}
        </Grade>

        <Segmento>
          <SegmentoIcone>🏟️</SegmentoIcone>
          <h2>Outros Esportes</h2>
          <Contador>em breve</Contador>
        </Segmento>
        <Grade>
          {ESPORTES.map((e) => (
            <Card key={e.titulo} className="breve" $accent="#3b82f6">
              <CardTitulo>{e.titulo}</CardTitulo>
              <CardDescricao>{e.descricao}</CardDescricao>
              <EmBreveChip>Em breve</EmBreveChip>
            </Card>
          ))}
        </Grade>
      </Conteudo>
      <Rodape>
        PELOTENSE ESPORTES © {new Date().getFullYear()} — SISTEMA DE PLACARES AO
        VIVO
      </Rodape>
    </Container>
  );
}

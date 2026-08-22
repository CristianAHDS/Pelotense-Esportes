import { useEffect, useRef, useState } from 'react';
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
  },
  {
    rota: '/placar-pl',
    tag: 'PREMIER LEAGUE',
    titulo: 'Placar Premier League',
    descricao:
      'Identidade da Premier League em roxo e verde menta, com cronômetro em destaque.',
    accent: '#00ff87',
    glow: 'rgba(0, 255, 135, 0.16)',
  },
  {
    rota: '/placar-bl',
    tag: 'BUNDESLIGA',
    titulo: 'Placar Bundesliga',
    descricao:
      'Estilo alemão: vermelho e grafite, paralelogramos inclinados e cantos retos.',
    accent: '#d20515',
    glow: 'rgba(210, 5, 21, 0.22)',
  },
  {
    rota: '/placar-ll',
    tag: 'LALIGA',
    titulo: 'Placar LaLiga',
    descricao:
      'Visual espanhol: barra branca com coral e azul-marinho, limpo e arredondado.',
    accent: '#ff4b44',
    glow: 'rgba(255, 75, 68, 0.18)',
  },
];

const GAUCHAO_A2 = [
  {
    titulo: 'Classificação',
    tag: 'CLASSIFICAÇÃO',
    descricao:
      'Tabela do Gauchão Série A2 com zonas de quartas de final e rebaixamento em tempo real.',
    rota: '/tabela',
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.16)',
    preview: 'tabela',
  },
  {
    titulo: 'Oitavas · Mata-Mata',
    tag: 'MATA-MATA',
    descricao:
      'Chaveamento das fases finais com placares, pênaltis e vencedores destacados em tempo real.',
    rota: '/mata-mata',
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.16)',
    preview: 'mata',
  },
];

const EXTRAS = [
  {
    rota: '/substituicao',
    tag: 'SUBSTITUIÇÃO',
    titulo: 'Card de Substituição',
    descricao:
      'Tarja animada com escudo e cor do time, jogador que sai (↓) e que entra (↑), com minuto da troca. Também integrada ao Placar Broadcast.',
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.16)',
  },
  {
    rota: '/penaltis',
    tag: 'PÊNALTIS',
    titulo: 'Disputa de Pênaltis',
    descricao:
      'Quadro detalhado de cobranças ✓/✕ por lado, placar em tempo real e indicação de morte súbita.',
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.16)',
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

const MolduraPreview = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $largura, $altura }) => `${$largura} / ${$altura}`};
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.03), transparent 60%),
    #060a08;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    border: none;
    transform-origin: top left;
    pointer-events: none;
  }
`;

function PreviewAoVivo({ rota, largura = 1280, altura = 720 }) {
  const ref = useRef(null);
  const [escala, setEscala] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const medir = () => setEscala(el.clientWidth / largura);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, [largura]);

  return (
    <MolduraPreview ref={ref} $largura={largura} $altura={altura}>
      <iframe
        title={`Prévia ${rota}`}
        src={`${window.location.origin}${window.location.pathname}?previa=1#${rota}`}
        scrolling="no"
        loading="lazy"
        tabIndex={-1}
        style={{
          width: largura,
          height: altura,
          transform: `scale(${escala})`,
          opacity: escala ? 1 : 0,
        }}
      />
    </MolduraPreview>
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

const BotaoCopiar = styled.button`
  flex: 0 0 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background: transparent;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: 1rem;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    color: ${({ $copiado, theme }) => ($copiado ? '#22c55e' : theme.cores.texto)};
    background: ${({ theme }) => theme.cores.superficieHover};
  }

  &.ok {
    color: #22c55e;
    border-color: rgba(34, 197, 94, 0.5);
  }
`;

function CopiarLink({ rota }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    const url = `${window.location.origin}${window.location.pathname}#${rota}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const area = document.createElement('textarea');
      area.value = url;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  }

  return (
    <BotaoCopiar onClick={copiar} title="Copiar link" className={copiado ? 'ok' : ''}>
      {copiado ? '✓' : '⧉'}
    </BotaoCopiar>
  );
}

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
              <PreviaRotulo>Prévia ao vivo</PreviaRotulo>
              <PreviewAoVivo rota={m.rota} largura={720} altura={405} />
              <CardAcoes>
                <Botao as="a" href={`#${m.rota}`} target="_blank" rel="noreferrer" className="primario">
                  Abrir
                </Botao>
                <Botao to={`${m.rota}/controle`} className="secundario">
                  Controlar
                </Botao>
                <CopiarLink rota={m.rota} />
              </CardAcoes>
            </Card>
          ))}
        </Grade>

        <Segmento>
          <SegmentoIcone>🏆</SegmentoIcone>
          <h2>Gauchão A2</h2>
          <Contador>{GAUCHAO_A2.length} ativos</Contador>
        </Segmento>
        <Grade>
          {GAUCHAO_A2.map((t) => (
            <Card key={t.titulo} $accent={t.accent} $glow={t.glow}>
              <CardTag $accent={t.accent}>{t.tag}</CardTag>
              <CardTitulo>{t.titulo}</CardTitulo>
              <CardDescricao>{t.descricao}</CardDescricao>
                <PreviewAoVivo rota={t.rota} largura={760} altura={620} />
              <CardAcoes>
                <Botao as="a" href={`#${t.rota}`} target="_blank" rel="noreferrer" className="primario">
                  Abrir
                </Botao>
                <Botao to={`${t.rota}/controle`} className="secundario">
                  Controlar
                </Botao>
                <CopiarLink rota={t.rota} />
              </CardAcoes>
            </Card>
          ))}
        </Grade>

        <Segmento>
          <SegmentoIcone>⚡</SegmentoIcone>
          <h2>Extras da Transmissão</h2>
          <Contador>{EXTRAS.length} ativos</Contador>
        </Segmento>
        <Grade>
          {EXTRAS.map((x) => (
            <Card key={x.rota} $accent={x.accent} $glow={x.glow}>
              <CardTag $accent={x.accent}>{x.tag}</CardTag>
              <CardTitulo>{x.titulo}</CardTitulo>
              <CardDescricao>{x.descricao}</CardDescricao>
              <PreviewAoVivo rota={x.rota} largura={720} altura={405} />
              <CardAcoes>
                <Botao as="a" href={`#${x.rota}`} target="_blank" rel="noreferrer" className="primario">
                  Abrir
                </Botao>
                <Botao to={`${x.rota}/controle`} className="secundario">
                  Controlar
                </Botao>
                <CopiarLink rota={x.rota} />
              </CardAcoes>
            </Card>
          ))}
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

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { LOGO_URL } from '../theme';
import { salaAtual } from '../lib/sincronizacaoNuvem';

/* ---------- Dados dos segmentos ---------- */

const SCOREBOARDS = [
  {
    rota: '/placar-broadcast',
    tag: 'BROADCAST',
    titulo: 'Placar Broadcast',
    descricao:
      'Design flat profissional com siglas e cores personalizáveis. Ideal para transmissões ao vivo e overlays.',
    accent: '#a5ef1c',
    glow: 'rgba(165, 239, 28, 0.2)',
  },
  {
    rota: '/placar-pl',
    tag: 'PREMIER LEAGUE',
    titulo: 'Placar Premier League',
    descricao:
      'Identidade da Premier League em roxo e verde menta, com cronômetro em destaque.',
    accent: '#a5ef1c',
    glow: 'rgba(165, 239, 28, 0.16)',
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
    accent: '#a5ef1c',
    glow: 'rgba(165, 239, 28, 0.16)',
    preview: 'tabela',
  },
  {
    rota: '/ultima-rodada',
    tag: 'ÚLTIMA RODADA',
    titulo: 'Última Rodada',
    descricao:
      'Resultados dos últimos jogos com escudos e placares, mais a classificação dos times após a rodada.',
    accent: '#a5ef1c',
    glow: 'rgba(165, 239, 28, 0.16)',
  },
  {
    titulo: 'Oitavas de Final',
    tag: 'MATA-MATA',
    descricao:
      'Confrontos das oitavas em formato de tabela, com placares, pênaltis e vencedores destacados em tempo real.',
    rota: '/mata-mata',
    accent: '#a5ef1c',
    glow: 'rgba(165, 239, 28, 0.16)',
    preview: 'mata',
  },
  {
    titulo: 'Fases Finais · Chaveamento',
    tag: 'QUARTAS → FINAL',
    descricao:
      'Chaveamento visual das quartas à final: vencedores avançam automaticamente e campeão ganha selo especial.',
    rota: '/fases-finais',
    controle: '/mata-mata/controle',
    accent: '#a5ef1c',
    glow: 'rgba(165, 239, 28, 0.16)',
    preview: 'fases',
    altura: 700,
  },
];

const EXTRAS = [
  {
    rota: '/escalacao',
    tag: 'ESCALAÇÃO',
    titulo: 'Escalação',
    descricao:
      'Grid 11x1 dos dois times com escudos, números, nomes e formação (4-3-3), editável lado a lado.',
    accent: '#a5ef1c',
    glow: 'rgba(165, 239, 28, 0.16)',
  },
  {
    rota: '/substituicao',
    tag: 'SUBSTITUIÇÃO',
    titulo: 'Card de Substituição',
    descricao:
      'Tarja animada com escudo e cor do time, jogador que sai (↓) e que entra (↑), com minuto da troca. Também integrada ao Placar Broadcast.',
    accent: '#a5ef1c',
    glow: 'rgba(165, 239, 28, 0.16)',
  },
  {
    rota: '/penaltis',
    tag: 'PÊNALTIS',
    titulo: 'Disputa de Pênaltis',
    descricao:
      'Quadro detalhado de cobranças ✓/✕ por lado, placar em tempo real e indicação de morte súbita.',
    accent: '#a5ef1c',
    glow: 'rgba(165, 239, 28, 0.16)',
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

const RODAPE_LINKS = [
  { id: 'scoreboards', label: 'Scoreboards' },
  { id: 'gauchao', label: 'Gauchão A2' },
  { id: 'extras', label: 'Extras' },
];

function rolarPara(id) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

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
        rgba(165, 239, 28, 0.08),
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
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 26px 32px;
  margin-bottom: 12px;
  background: linear-gradient(
    135deg,
    rgba(165, 239, 28, 0.09),
    ${({ theme }) => theme.cores.fundoClaro} 55%
  );
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-left: 4px solid ${({ theme }) => theme.cores.primaria};
  border-radius: 16px;

  &::before {
    content: '';
    position: absolute;
    inset: -45%;
    pointer-events: none;
    background:
      radial-gradient(
        ellipse 42% 58% at 22% 32%,
        rgba(165, 239, 28, 0.14),
        transparent 70%
      ),
      radial-gradient(
        ellipse 38% 52% at 82% 68%,
        rgba(59, 130, 246, 0.1),
        transparent 70%
      );
    animation: derivaHero 16s ease-in-out infinite alternate;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @keyframes derivaHero {
    from {
      transform: translate3d(-2.5%, -2%, 0) rotate(-1.2deg);
    }
    to {
      transform: translate3d(2.5%, 2%, 0) rotate(1.2deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }

  img {
    width: 84px;
    height: 84px;
    object-fit: contain;
    filter: drop-shadow(0 0 22px rgba(165, 239, 28, 0.4));
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
  border: 1px solid rgba(165, 239, 28, 0.35);
  background: rgba(165, 239, 28, 0.07);
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 10px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
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

const HeroAcoes = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
`;

const HeroBotao = styled.button`
  padding: 11px 24px;
  border-radius: 9px;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    filter 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;

  &.primario {
    border: none;
    background: ${({ theme }) => theme.cores.primaria};
    color: #0a0f00;
    &:hover {
      filter: brightness(1.12);
      box-shadow: 0 0 22px rgba(165, 239, 28, 0.35);
    }
  }

  &.secundario {
    border: 1px solid ${({ theme }) => theme.cores.borda};
    background: transparent;
    color: ${({ theme }) => theme.cores.texto};
    &:hover {
      background: ${({ theme }) => theme.cores.superficieHover};
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
  height: 100%;
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
    radial-gradient(
      circle at 30% 20%,
      rgba(255, 255, 255, 0.03),
      transparent 60%
    ),
    #060606;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    border: none;
    transform-origin: top left;
    pointer-events: none;
  }

  ${({ $clicavel }) =>
    $clicavel &&
    `
  cursor: pointer;

    &:hover iframe {
      filter: brightness(1.07);
  }
  `}
`;

const DicaAmpliar = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  pointer-events: none;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;

  ${MolduraPreview}:hover & {
    opacity: 1;
    transform: none;
  }
`;

function PreviewAoVivo({ rota, largura = 1280, altura = 720, aoAmpliar }) {
  const ref = useRef(null);
  const [escala, setEscala] = useState(0);
  const sala = salaAtual();
  const sufixoSala =
    sala !== 'padrao' ? `&sala=${encodeURIComponent(sala)}` : '';

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
    <MolduraPreview
      ref={ref}
      $largura={largura}
      $altura={altura}
      $clicavel={!!aoAmpliar}
      onClick={aoAmpliar}
      title={aoAmpliar ? 'Ampliar prévia' : undefined}
    >
      <iframe
        title={`Prévia ${rota}`}
        src={`${window.location.origin}${rota}?previa=1${sufixoSala}`}
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
      {aoAmpliar && <DicaAmpliar>? Ampliar</DicaAmpliar>}
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

const Revelador = styled.div`
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 0.55s ease,
    transform 0.55s ease;
  transition-delay: ${({ $atraso }) => $atraso}ms;

  &.visivel {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
`;

function RevelarAoRolar({ atraso = 0, children }) {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisivel(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Revelador ref={ref} $atraso={atraso} className={visivel ? 'visivel' : ''}>
      {children}
    </Revelador>
  );
}

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
    color: #0a0f00;
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
    color: ${({ $copiado, theme }) =>
      $copiado ? '#a5ef1c' : theme.cores.texto};
    background: ${({ theme }) => theme.cores.superficieHover};
  }

  &.ok {
    color: #a5ef1c;
    border-color: rgba(165, 239, 28, 0.5);
  }
`;

function CopiarLink({ rota }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    const url = `${window.location.origin}${rota}`;
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
    <BotaoCopiar
      onClick={copiar}
      title="Copiar link"
      className={copiado ? 'ok' : ''}
    >
      {copiado ? '✓' : '⧉'}
    </BotaoCopiar>
  );
}

const SobreposicaoTV = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: clamp(16px, 4vw, 48px);
  background: rgba(4, 7, 12, 0.88);
  backdrop-filter: blur(6px);
  animation: entrarTv 0.22s ease;

  @keyframes entrarTv {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const JanelaTV = styled.div`
  width: min(1280px, 100%);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: subirTv 0.25s ease;

  @keyframes subirTv {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  ${MolduraPreview} {
    flex: 1;
    min-height: 0;
  }
`;

const BarraTV = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  flex-wrap: wrap;

  .ident {
    display: flex;
    align-items: baseline;
    gap: 12px;
    min-width: 0;
  }

  .tag {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
  }

  h3 {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const AcoesTV = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  ${Botao} {
    flex: 0 0 auto;
  }
`;

const FecharTV = styled.button`
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
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
    color: #fff;
    background: rgba(239, 68, 68, 0.14);
    border-color: rgba(239, 68, 68, 0.45);
  }
`;

const Rodape = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.fundoClaro};
  padding: 30px 32px;
`;

const RodapeTopo = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 28px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const RodapeMarca = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  b {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 2.5px;
  }

  b em {
    font-style: normal;
    color: ${({ theme }) => theme.cores.primaria};
  }
`;

const RodapeNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;

  button {
    padding: 7px 13px;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: ${({ theme }) => theme.cores.textoSuave};
    font-family: ${({ theme }) => theme.fontes.corpo};
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      color 0.15s ease,
      background 0.15s ease;

    &:hover {
      color: ${({ theme }) => theme.cores.texto};
      background: ${({ theme }) => theme.cores.superficieHover};
    }
  }
`;

const RodapeDivisor = styled.div`
  max-width: 1200px;
  margin: 22px auto;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    ${({ theme }) => theme.cores.borda},
    transparent
  );
`;

const RodapeCopy = styled.p`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: 0.72rem;
  letter-spacing: 2px;
`;

/* ---------- Página ---------- */

export default function Hub() {
  const [tv, setTv] = useState(null);

  useEffect(() => {
    if (!tv) return undefined;
    const aoTeclar = (e) => {
      if (e.key === 'Escape') setTv(null);
    };
    window.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [tv]);

  return (
    <Container>
      <Header />
      <Conteudo>
        <Hero>
          <img src={LOGO_URL} alt="Logo Pelotense Esportes" />
          <div>
            <HeroBadge>Sistema de overlays ao vivo</HeroBadge>
            <h1>Pelotense Esportes</h1>
            <p>
              Central de overlays e placares profissionais para transmissões.
              Escolha um módulo para abrir a visualização ou o controle remoto.
            </p>
            <HeroAcoes>
              <HeroBotao
                type="button"
                className="primario"
                onClick={() => rolarPara('scoreboards')}
              >
                Ver placares
              </HeroBotao>
              <HeroBotao
                type="button"
                className="secundario"
                onClick={() => rolarPara('gauchao')}
              >
                Gauchão A2
              </HeroBotao>
            </HeroAcoes>
          </div>
        </Hero>

        <Segmento id="scoreboards">
          <SegmentoIcone>📺</SegmentoIcone>
          <h2>Scoreboards</h2>
          <Contador>{SCOREBOARDS.length} ativos</Contador>
        </Segmento>
        <Grade>
          {SCOREBOARDS.map((m, i) => (
            <RevelarAoRolar key={m.rota} atraso={(i % 4) * 60}>
              <Card $accent={m.accent} $glow={m.glow}>
                <CardTag $accent={m.accent}>{m.tag}</CardTag>
                <CardTitulo>{m.titulo}</CardTitulo>
                <CardDescricao>{m.descricao}</CardDescricao>
                <PreviaRotulo>Prévia ao vivo</PreviaRotulo>
                <PreviewAoVivo
                  rota={m.rota}
                  largura={720}
                  altura={405}
                  aoAmpliar={() =>
                    setTv({
                      rota: m.rota,
                      tag: m.tag,
                      titulo: m.titulo,
                      accent: m.accent,
                      largura: 720,
                      altura: 405,
                    })
                  }
                />
                <CardAcoes>
                  <Botao
                    as="a"
                    href={m.rota}
                    target="_blank"
                    rel="noreferrer"
                    className="primario"
                  >
                    Abrir
                  </Botao>
                  <Botao to={`${m.rota}/controle`} className="secundario">
                    Controlar
                  </Botao>
                  <CopiarLink rota={m.rota} />
                </CardAcoes>
              </Card>
            </RevelarAoRolar>
          ))}
        </Grade>

        <Segmento id="gauchao">
          <SegmentoIcone>🏆</SegmentoIcone>
          <h2>Gauchão A2</h2>
          <Contador>{GAUCHAO_A2.length} ativos</Contador>
        </Segmento>
        <Grade>
          {GAUCHAO_A2.map((t, i) => (
            <RevelarAoRolar key={t.titulo} atraso={(i % 4) * 60}>
              <Card $accent={t.accent} $glow={t.glow}>
                <CardTag $accent={t.accent}>{t.tag}</CardTag>
                <CardTitulo>{t.titulo}</CardTitulo>
                <CardDescricao>{t.descricao}</CardDescricao>
                <PreviewAoVivo
                  rota={t.rota}
                  largura={760}
                  altura={t.altura || 620}
                  aoAmpliar={() =>
                    setTv({
                      rota: t.rota,
                      tag: t.tag,
                      titulo: t.titulo,
                      accent: t.accent,
                      largura: 760,
                      altura: t.altura || 620,
                    })
                  }
                />
                <CardAcoes>
                  <Botao
                    as="a"
                    href={t.rota}
                    target="_blank"
                    rel="noreferrer"
                    className="primario"
                  >
                    Abrir
                  </Botao>
                  <Botao
                    to={t.controle || `${t.rota}/controle`}
                    className="secundario"
                  >
                    Controlar
                  </Botao>
                  <CopiarLink rota={t.rota} />
                </CardAcoes>
              </Card>
            </RevelarAoRolar>
          ))}
        </Grade>

        <Segmento id="extras">
          <SegmentoIcone>⚡</SegmentoIcone>
          <h2>Extras da Transmissão</h2>
          <Contador>{EXTRAS.length} ativos</Contador>
        </Segmento>
        <Grade>
          {EXTRAS.map((x, i) => (
            <RevelarAoRolar key={x.rota} atraso={(i % 4) * 60}>
              <Card $accent={x.accent} $glow={x.glow}>
                <CardTag $accent={x.accent}>{x.tag}</CardTag>
                <CardTitulo>{x.titulo}</CardTitulo>
                <CardDescricao>{x.descricao}</CardDescricao>
                <PreviewAoVivo
                  rota={x.rota}
                  largura={720}
                  altura={405}
                  aoAmpliar={() =>
                    setTv({
                      rota: x.rota,
                      tag: x.tag,
                      titulo: x.titulo,
                      accent: x.accent,
                      largura: 720,
                      altura: 405,
                    })
                  }
                />
                <CardAcoes>
                  <Botao
                    as="a"
                    href={x.rota}
                    target="_blank"
                    rel="noreferrer"
                    className="primario"
                  >
                    Abrir
                  </Botao>
                  <Botao to={`${x.rota}/controle`} className="secundario">
                    Controlar
                  </Botao>
                  <CopiarLink rota={x.rota} />
                </CardAcoes>
              </Card>
            </RevelarAoRolar>
          ))}
        </Grade>

        <Segmento id="outros">
          <SegmentoIcone>🏟️</SegmentoIcone>
          <h2>Outros Esportes</h2>
          <Contador>em breve</Contador>
        </Segmento>
        <Grade>
          {ESPORTES.map((e, i) => (
            <RevelarAoRolar key={e.titulo} atraso={(i % 4) * 60}>
              <Card className="breve" $accent="#3b82f6">
                <CardTitulo>{e.titulo}</CardTitulo>
                <CardDescricao>{e.descricao}</CardDescricao>
                <EmBreveChip>Em breve</EmBreveChip>
              </Card>
            </RevelarAoRolar>
          ))}
        </Grade>
      </Conteudo>
      <Rodape>
        <RodapeTopo>
          <RodapeMarca>
            <img src={LOGO_URL} alt="Pelotense Esportes" />
            <b>
              PELOTENSE <em>ESPORTES</em>
            </b>
          </RodapeMarca>
          <RodapeNav>
            {RODAPE_LINKS.map((l) => (
              <button key={l.id} type="button" onClick={() => rolarPara(l.id)}>
                {l.label}
              </button>
            ))}
          </RodapeNav>
        </RodapeTopo>
        <RodapeDivisor />
        <RodapeCopy>
          PELOTENSE ESPORTES ? {new Date().getFullYear()} ? SISTEMA DE PLACARES
          AO VIVO
        </RodapeCopy>
      </Rodape>

      {tv && (
        <SobreposicaoTV
          onClick={() => setTv(null)}
          role="dialog"
          aria-modal="true"
        >
          <JanelaTV onClick={(e) => e.stopPropagation()}>
            <BarraTV>
              <div className="ident">
                <span className="tag" style={{ color: tv.accent }}>
                  {tv.tag}
                </span>
                <h3>{tv.titulo}</h3>
              </div>
              <AcoesTV>
                <Botao
                  as="a"
                  href={tv.rota}
                  target="_blank"
                  rel="noreferrer"
                  className="primario"
                >
                  Abrir
                </Botao>
                <Botao to={`${tv.rota}/controle`} className="secundario">
                  Controlar
                </Botao>
                <FecharTV
                  onClick={() => setTv(null)}
                  title="Fechar (Esc)"
                  autoFocus
                >
                  ?
                </FecharTV>
              </AcoesTV>
            </BarraTV>
            <PreviewAoVivo
              rota={tv.rota}
              largura={tv.largura}
              altura={tv.altura}
            />
          </JanelaTV>
        </SobreposicaoTV>
      )}
    </Container>
  );
}

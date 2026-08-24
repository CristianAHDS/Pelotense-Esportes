import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { LOGO_URL } from '../theme';
import { Escudo } from '../components/Escudo';
import {
  getEstado,
  inscrever,
  ordenarClassificacao,
} from '../store/tabelaStore';

/* ---------- Paleta da landing (referência Velocity) ---------- */

const C = {
  bg: '#060606',
  txt: '#FCFCFB',
  acc: '#A5EF1C',
  g2: '#63A70D',
  g3: '#405113',
  mut: '#9A9996',
  neu: '#616263',
};

const F = {
  corpo: "'Inter', sans-serif",
  dados: "'Rajdhani', sans-serif",
};

/* ---------- Confronto de exemplo (sorteado a cada visita) ---------- */

const CLUBES_EXEMPLO = {
  VER: {
    nome: 'VERANÓPOLIS',
    escudo: '/escudos/VER.png',
    cor: '#047857',
    estadio: 'ANTÔNIO DAVID FARINA',
    cidade: 'VERANÓPOLIS/RS',
  },
  PAS: {
    nome: 'PASSO FUNDO',
    escudo: '/escudos/PAS.png',
    cor: '#c1121f',
    estadio: 'VERMELHÃO DA SERRA',
    cidade: 'PASSO FUNDO/RS',
  },
  ESP: {
    nome: 'ESPORTIVO',
    escudo: 'https://i.imgur.com/u5q7j4R.png',
    cor: '#0e7490',
    estadio: 'MONTE CRISTO',
    cidade: 'BENTO GONÇALVES/RS',
  },
  AIM: {
    nome: 'AIMORÉ',
    escudo: '/escudos/AIM.png',
    cor: '#b91c1c',
    estadio: 'CRISTO REI',
    cidade: 'SÃO LEOPOLDO/RS',
  },
  BRA: {
    nome: 'BRASIL',
    escudo: '/escudos/BRA.png',
    cor: '#b91c1c',
    estadio: 'BENTO FREITAS',
    cidade: 'PELOTAS/RS',
  },
  PEL: {
    nome: 'PELOTAS',
    escudo: '/escudos/PEL.png',
    cor: '#1565c0',
    estadio: 'BOCA DO LOBO',
    cidade: 'PELOTAS/RS',
  },
  SCR: {
    nome: 'SANTA CRUZ',
    escudo: '/escudos/SCR.png',
    cor: '#ca8a04',
    estadio: 'DOS PLÁTANOS',
    cidade: 'SANTA CRUZ DO SUL/RS',
  },
  GVA: {
    nome: 'GUARANI-VA',
    escudo: '/escudos/GVA.png',
    cor: '#166534',
    estadio: 'DOS EUCALIPTOS',
    cidade: 'VENÂNCIO AIRES/RS',
  },
};

function sortearConfronto() {
  const chaves = Object.keys(CLUBES_EXEMPLO);
  const pega = () =>
    CLUBES_EXEMPLO[chaves[Math.floor(Math.random() * chaves.length)]];
  const casa = pega();
  let fora = pega();
  while (fora === casa) fora = pega();
  const g1 = Math.floor(Math.random() * 4);
  let g2 = Math.floor(Math.random() * 4);
  if (g2 === g1) g2 = (g2 + 1 + Math.floor(Math.random() * 3)) % 4;
  const rodada = 3 + Math.floor(Math.random() * 12);
  const minutos = 8 + Math.floor(Math.random() * 80);
  const cron = `${String(minutos).padStart(2, '0')}:${String(
    Math.floor(Math.random() * 60),
  ).padStart(2, '0')}`;
  return {
    casa,
    fora,
    g1,
    g2,
    rodada,
    cron,
    periodo: minutos > 45 ? '2ºT' : '1ºT',
  };
}

/* ---------- Utilidades ---------- */

function usarRevelado() {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisivel(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  return [ref, visivel];
}

function rolarPara(id) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function usePlacarBroadcastInterno() {
  const [estado, setEstado] = useState(getEstado());
  useEffect(() => inscrever(setEstado), []);
  return estado;
}

/* ---------- Primitivos visuais ---------- */

const Rotulo = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${F.corpo};
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: ${C.mut};

  &::before {
    content: '';
    width: 22px;
    height: 1px;
    background: ${C.acc};
  }
`;

const Cruz = styled.span`
  position: absolute;
  width: 11px;
  height: 11px;
  opacity: 0.5;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: ${C.neu};
  }
  &::before {
    left: 5px;
    top: 0;
    width: 1px;
    height: 11px;
  }
  &::after {
    top: 5px;
    left: 0;
    height: 1px;
    width: 11px;
  }
`;

const BlocoRevelavel = styled.div`
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transform: translateY(${({ $on }) => ($on ? '0' : '26px')});
  transition:
    opacity 0.7s ease,
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: ${({ $atraso }) => $atraso || 0}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
`;

function Revelar({ children, atraso = 0 }) {
  const [ref, on] = usarRevelado();
  return (
    <BlocoRevelavel ref={ref} $on={on} $atraso={atraso}>
      {children}
    </BlocoRevelavel>
  );
}

const Pagina = styled.div`
  min-height: 100vh;
  background: ${C.bg};
  color: ${C.txt};
  font-family: ${F.corpo};
  overflow-x: hidden;
`;

/* ---------- Navegação ---------- */

const Nav = styled.header`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 4vw;
  background: rgba(6, 6, 6, 0.72);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(252, 252, 251, 0.07);
`;

const Marca = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;

  img {
    height: 30px;
    width: auto;
  }

  span {
    font-family: ${F.corpo};
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 2.5px;
    color: ${C.txt};
    white-space: nowrap;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 26px;

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: ${F.corpo};
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${C.mut};
    transition: color 0.2s ease;

    &:hover {
      color: ${C.txt};
    }
  }

  @media (max-width: 860px) {
    display: none;
  }
`;

const NavCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 10px;
  background: ${C.acc};
  color: #0a0f00;
  font-family: ${F.corpo};
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    filter 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    filter: brightness(1.08);
    box-shadow: 0 0 26px rgba(165, 239, 28, 0.35);
  }
`;

/* ---------- Hero ---------- */

const HeroSec = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 120px 4vw 80px;

  /* grade fina de fundo */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(252, 252, 251, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(252, 252, 251, 0.035) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: radial-gradient(
      ellipse 90% 70% at 60% 40%,
      #000 30%,
      transparent 75%
    );
    pointer-events: none;
  }

  /* brilho sutil atrás do mockup */
  &::after {
    content: '';
    position: absolute;
    right: -8%;
    top: 16%;
    width: 46vw;
    height: 46vw;
    max-width: 720px;
    max-height: 720px;
    background: radial-gradient(
      circle,
      rgba(165, 239, 28, 0.09),
      transparent 62%
    );
    filter: blur(10px);
    pointer-events: none;
  }
`;

const HeroGrade = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: 40px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 56px;
  }
`;

const TituloHero = styled.h1`
  margin: 22px 0 26px;
  font-family: ${F.corpo};
  font-weight: 800;
  font-size: clamp(2.9rem, 6.4vw, 6.1rem);
  line-height: 0.97;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: ${C.txt};

  .linha2 {
    display: block;
    color: transparent;
    -webkit-text-stroke: 1.5px ${C.acc};
  }
`;

const SubHero = styled.p`
  max-width: 480px;
  font-size: clamp(0.95rem, 1.3vw, 1.08rem);
  line-height: 1.65;
  color: ${C.mut};
`;

const HeroAcoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
`;

const BotaoGrande = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  border-radius: 12px;
  background: ${({ $fantasma }) => ($fantasma ? 'transparent' : C.acc)};
  border: ${({ $fantasma }) =>
    $fantasma ? `1px solid rgba(252,252,251,.18)` : 'none'};
  color: ${({ $fantasma }) => ($fantasma ? C.txt : '#0a0f00')};
  font-family: ${F.corpo};
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    filter 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    filter: brightness(1.06);
    box-shadow: ${({ $fantasma }) =>
      $fantasma ? 'none' : '0 0 34px rgba(165, 239, 28, 0.4)'};
    border-color: ${({ $fantasma }) =>
      $fantasma ? 'rgba(252,252,251,.35)' : 'transparent'};
  }
`;

const TagsHero = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 44px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 13px;
  border: 1px solid rgba(252, 252, 251, 0.1);
  border-radius: 999px;
  font-family: ${F.dados};
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: ${C.mut};

  b {
    color: ${C.acc};
    font-weight: 700;
  }
`;

/* --- Mockup do placar (fiel ao PlacarBroadcast real) --- */

const MolduraMockup = styled.div`
  position: relative;
  justify-self: end;
  width: min(620px, 100%);
  transform: rotate(-1.5deg);

  @media (max-width: 960px) {
    justify-self: center;
    transform: none;
  }
`;

const EtiquetaFlutuante = styled.div`
  position: absolute;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(6, 6, 6, 0.85);
  border: 1px solid rgba(252, 252, 251, 0.12);
  border-radius: 8px;
  font-family: ${F.dados};
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: ${C.txt};
  backdrop-filter: blur(6px);

  &.cron {
    left: -18px;
    bottom: -20px;
    color: ${C.acc};

    @media (max-width: 960px) {
      left: 8px;
    }
  }

  &.vivo {
    right: 14px;
    top: -16px;
    color: ${C.txt};

    i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ff3b30;
      animation: pulsoLive 1.3s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      i {
        animation: none;
      }
    }
  }
`;

const EstiloPulso = createGlobalStyle`
  @keyframes pulsoLive {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }
`;

const PlacarMockup = styled.div`
  position: relative;
  z-index: 2;
  border-radius: 18px;
  background: linear-gradient(160deg, #101010, #0b0d07);
  border: 1px solid rgba(165, 239, 28, 0.28);
  box-shadow:
    0 40px 90px -40px rgba(0, 0, 0, 0.9),
    0 0 60px -20px rgba(165, 239, 28, 0.14);
  overflow: hidden;

  .faixa-topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    border-bottom: 1px solid rgba(252, 252, 251, 0.07);
    font-family: ${F.dados};
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 3px;
    color: ${C.neu};

    b {
      color: ${C.acc};
    }
  }

  .placar-linha {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 14px;
    padding: 26px 24px;
  }

  .time {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;

    &.visitante {
      flex-direction: row-reverse;
      text-align: right;
    }
  }

  .time span {
    font-family: ${F.dados};
    font-weight: 700;
    letter-spacing: 2px;
    font-size: clamp(0.95rem, 1.6vw, 1.25rem);
    color: ${C.txt};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gols {
    display: flex;
    align-items: baseline;
    gap: 12px;
    font-family: ${F.dados};
    font-size: clamp(2.8rem, 6vw, 4.6rem);
    font-weight: 700;
    line-height: 1;
    color: ${C.txt};

    em {
      font-style: normal;
      color: ${C.neu};
      font-size: 0.55em;
    }
  }

  .rodape-mockup {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 20px;
    border-top: 1px solid rgba(252, 252, 251, 0.07);
    background: rgba(165, 239, 28, 0.04);
    font-family: ${F.dados};
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    color: ${C.mut};

    .tempo {
      color: ${C.acc};
      font-size: 0.95rem;
    }
  }
`;

function Hero({ jogo }) {
  return (
    <HeroSec>
      <EstiloPulso />
      <Cruz style={{ left: '4vw', top: 96 }} />
      <Cruz style={{ right: '4vw', top: 96 }} />
      <HeroGrade>
        <div>
          <Revelar>
            <Rotulo>Sistema de graficação ao vivo</Rotulo>
          </Revelar>
          <Revelar atraso={90}>
            <TituloHero>
              O jogo no ar.
              <span className="linha2">Você no controle.</span>
            </TituloHero>
          </Revelar>
          <Revelar atraso={180}>
            <SubHero>
              Placares, classificação, substituições e pênaltis em tempo real
              para suas transmissões. Controle em um dispositivo, gráfico na
              tela — sem atraso, sem instalação.
            </SubHero>
          </Revelar>
          <Revelar atraso={260}>
            <HeroAcoes>
              <BotaoGrande to="/hub">Abrir o sistema →</BotaoGrande>
              <BotaoGrande to="/tabela" $fantasma>
                Ver classificação
              </BotaoGrande>
            </HeroAcoes>
          </Revelar>
          <Revelar atraso={340}>
            <TagsHero>
              <Tag>
                <b>SYNC</b> TEMPO REAL
              </Tag>
              <Tag>
                <b>OBS</b> READY
              </Tag>
              <Tag>
                <b>FGF</b> DADOS OFICIAIS
              </Tag>
              <Tag>
                <b>0</b> INSTALAÇÃO
              </Tag>
            </TagsHero>
          </Revelar>
        </div>

        <MolduraMockup>
          <EtiquetaFlutuante className="vivo">
            <i /> AO VIVO
          </EtiquetaFlutuante>
          <EtiquetaFlutuante className="cron">
            {jogo.cron} · {jogo.periodo}
          </EtiquetaFlutuante>
          <Revelar atraso={220}>
            <PlacarMockup>
              <div className="faixa-topo">
                <span>CAMPEONATO GAÚCHO SÉRIE A2</span>
                <span>
                  RODADA <b>{String(jogo.rodada).padStart(2, '0')}</b>
                </span>
              </div>
              <div className="placar-linha">
                <div className="time">
                  <Escudo
                    url={jogo.casa.escudo}
                    sigla="CASA"
                    cor={jogo.casa.cor}
                    tamanho={34}
                  />
                  <span>{jogo.casa.nome}</span>
                </div>
                <div className="gols">
                  {jogo.g1}
                  <em>×</em>
                  {jogo.g2}
                </div>
                <div className="time visitante">
                  <Escudo
                    url={jogo.fora.escudo}
                    sigla="FORA"
                    cor={jogo.fora.cor}
                    tamanho={34}
                  />
                  <span>{jogo.fora.nome}</span>
                </div>
              </div>
              <div className="rodape-mockup">
                <span>
                  {jogo.casa.estadio} · {jogo.casa.cidade}
                </span>
                <span className="tempo">{jogo.cron}</span>
              </div>
            </PlacarMockup>
          </Revelar>
        </MolduraMockup>
      </HeroGrade>
    </HeroSec>
  );
}

/* ---------- Seção: tempo real (controle -> tela) ---------- */

const SecaoSync = styled.section`
  position: relative;
  padding: 140px 4vw;
  border-top: 1px solid rgba(252, 252, 251, 0.06);

  .cabeca {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: end;
    gap: 28px;
    max-width: 1440px;
    margin: 0 auto 70px;

    h2 {
      margin: 0;
      font-family: ${F.corpo};
      font-weight: 800;
      font-size: clamp(2rem, 4.4vw, 4rem);
      line-height: 1;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      color: ${C.txt};
    }

    .num {
      font-family: ${F.dados};
      font-size: clamp(3rem, 6vw, 5.6rem);
      font-weight: 700;
      line-height: 0.85;
      color: transparent;
      -webkit-text-stroke: 1px ${C.neu};
      text-align: right;

      b {
        display: block;
        color: ${C.acc};
        -webkit-text-stroke: 0;
        font-size: 0.3em;
        letter-spacing: 4px;
        margin-top: 12px;
      }
    }
  }

  @media (max-width: 960px) {
    .cabeca {
      grid-template-columns: 1fr;
      align-items: start;

      .num {
        text-align: left;
      }
    }
  }
`;

const PalcoSync = styled.div`
  position: relative;
  max-width: 1440px;
  margin: 90px auto 0;
  display: grid;
  grid-template-columns: minmax(270px, 360px) minmax(110px, 1fr) minmax(
      300px,
      520px
    );
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 30px;
  }
`;

const PainelControle = styled.div`
  border-radius: 14px;
  background: #101010;
  border: 1px solid rgba(252, 252, 251, 0.09);
  overflow: hidden;
  box-shadow: 0 30px 70px -40px rgba(0, 0, 0, 0.9);

  .barra-janela {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(252, 252, 251, 0.07);

    i {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: rgba(252, 252, 251, 0.14);

      &:nth-child(2) {
        opacity: 0.65;
      }
      &:nth-child(3) {
        opacity: 0.35;
      }
    }

    span {
      margin-left: auto;
      font-family: ${F.dados};
      font-size: 0.66rem;
      font-weight: 600;
      letter-spacing: 2.5px;
      color: ${C.neu};
    }
  }

  .corpo-controle {
    display: grid;
    gap: 12px;
    padding: 16px;
  }

  .linha-time {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(252, 252, 251, 0.03);

    span {
      font-family: ${F.dados};
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 1.5px;
      color: ${C.mut};
    }

    .botoes {
      display: flex;
      gap: 6px;

      b {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        border-radius: 7px;
        background: rgba(252, 252, 251, 0.06);
        color: ${C.txt};
        font-family: ${F.corpo};
        font-size: 0.85rem;
      }

      b:last-child {
        background: ${C.acc};
        color: #0a0f00;
      }
    }
  }

  .gol-botao {
    padding: 12px;
    border-radius: 8px;
    background: ${C.acc};
    text-align: center;
    font-family: ${F.corpo};
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 3px;
    color: #0a0f00;
  }
`;

const Conexao = styled.div`
  position: relative;
  height: 2px;
  margin-top: 120px;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .traco {
    stroke-dasharray: 7 9;
    animation: correrLinha 1.1s linear infinite;
  }

  .ponto {
    fill: ${C.acc};
  }

  @keyframes correrLinha {
    to {
      stroke-dashoffset: -16;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .traco {
      animation: none;
    }
  }

  @media (max-width: 960px) {
    height: auto;
    width: 2px;
    min-height: 54px;
    margin: 0;

    svg {
      height: 54px;
      width: 2px;
    }
  }
`;

const ChipsTech = styled.div`
  position: absolute;
  left: 50%;
  top: -58px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 7px;
  z-index: 2;

  span {
    padding: 5px 11px;
    border-radius: 6px;
    border: 1px solid rgba(165, 239, 28, 0.22);
    background: rgba(165, 239, 28, 0.05);
    font-family: ${F.dados};
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: ${C.acc};
    text-align: center;
    white-space: nowrap;
  }

  @media (max-width: 960px) {
    left: 26px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

function ConexaoSvg() {
  return (
    <svg viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true">
      <line
        className="traco"
        x1="0"
        y1="4"
        x2="200"
        y2="4"
        stroke={C.g2}
        strokeWidth="1.6"
      />
      <circle className="ponto" cx="0" cy="4" r="3" />
      <circle className="ponto" cx="200" cy="4" r="3" />
    </svg>
  );
}

function SecaoTempoReal({ jogo }) {
  return (
    <SecaoSync id="sync">
      <div className="cabeca">
        <Revelar>
          <Rotulo>Tempo real</Rotulo>
        </Revelar>
        <Revelar atraso={80}>
          <h2>
            Do toque
            <br />à tela.
          </h2>
        </Revelar>
        <Revelar atraso={160}>
          <div className="num">
            &lt;1s<b>ATUALIZAÇÃO</b>
          </div>
        </Revelar>
      </div>

      <PalcoSync>
        <Revelar>
          <PainelControle>
            <div className="barra-janela">
              <i />
              <i />
              <i />
              <span>CONTROLE</span>
            </div>
            <div className="corpo-controle">
              <div className="linha-time">
                <span>{jogo.casa.nome}</span>
                <div className="botoes">
                  <b>−</b>
                  <b>+</b>
                </div>
              </div>
              <div className="linha-time">
                <span>{jogo.fora.nome}</span>
                <div className="botoes">
                  <b>−</b>
                  <b>+</b>
                </div>
              </div>
              <div className="linha-time">
                <span>CRONÔMETRO</span>
                <div className="botoes">
                  <b>−</b>
                  <b>+</b>
                </div>
              </div>
              <div className="gol-botao">GOL</div>
            </div>
          </PainelControle>
        </Revelar>

        <Conexao>
          <ChipsTech>
            <span>WEBSOCKET</span>
            <span>BROADCASTCHANNEL</span>
            <span>LOCALSTORAGE</span>
          </ChipsTech>
          <ConexaoSvg />
        </Conexao>

        <Revelar atraso={140}>
          <MolduraMockup
            style={{ justifySelf: 'start', width: 'min(520px, 100%)' }}
          >
            <PlacarMockup style={{ transform: 'none' }}>
              <div className="faixa-topo">
                <span>CAMPEONATO GAÚCHO SÉRIE A2</span>
                <span>
                  RODADA <b>{String(jogo.rodada).padStart(2, '0')}</b>
                </span>
              </div>
              <div className="placar-linha">
                <div className="time">
                  <Escudo
                    url={jogo.casa.escudo}
                    sigla="CASA"
                    cor={jogo.casa.cor}
                    tamanho={28}
                  />
                  <span>{jogo.casa.nome}</span>
                </div>
                <div
                  className="gols"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                  {jogo.g1}
                  <em>×</em>
                  {jogo.g2}
                </div>
                <div className="time visitante">
                  <Escudo
                    url={jogo.fora.escudo}
                    sigla="FORA"
                    cor={jogo.fora.cor}
                    tamanho={28}
                  />
                  <span>{jogo.fora.nome}</span>
                </div>
              </div>
              <div className="rodape-mockup">
                <span>OVERLAY · BROWSER SOURCE</span>
                <span className="tempo">{jogo.cron}</span>
              </div>
            </PlacarMockup>
          </MolduraMockup>
        </Revelar>
      </PalcoSync>
    </SecaoSync>
  );
}

/* ---------- Seção: ferramentas ---------- */

const SecaoFerramentas = styled.section`
  position: relative;
  padding: 130px 4vw;
  border-top: 1px solid rgba(252, 252, 251, 0.06);

  .cabeca {
    max-width: 1440px;
    margin: 0 auto 64px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;

    h2 {
      margin: 18px 0 0;
      font-family: ${F.corpo};
      font-weight: 800;
      font-size: clamp(2rem, 4.4vw, 4rem);
      line-height: 1;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      color: ${C.txt};

      em {
        font-style: normal;
        color: transparent;
        -webkit-text-stroke: 1.2px ${C.acc};
      }
    }

    p {
      max-width: 340px;
      margin: 0;
      font-size: 0.92rem;
      line-height: 1.6;
      color: ${C.mut};
    }
  }
`;

const GradeFerramentas = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;

  > * {
    &:nth-child(1) {
      grid-column: span 7;
    }
    &:nth-child(2) {
      grid-column: span 5;
    }
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6) {
      grid-column: span 3;
    }
    &:nth-child(7) {
      grid-column: span 12;
    }
  }

  @media (max-width: 1280px) {
    > *:nth-child(n + 3) {
      grid-column: span 6;
    }
  }

  @media (max-width: 960px) {
    > * {
      grid-column: 1 / -1;
    }
  }
`;

const CartaoFerramenta = styled(Link)`
  position: relative;
  display: block;
  padding: 24px;
  border-radius: 16px;
  background: #0c0c0c;
  border: 1px solid rgba(252, 252, 251, 0.08);
  text-decoration: none;
  overflow: hidden;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(165, 239, 28, 0.45);
    box-shadow: 0 30px 60px -35px rgba(165, 239, 28, 0.22);

    .abrir {
      color: ${C.acc};
      gap: 12px;
    }

    .palco-ferramenta {
      transform: scale(1.02);
    }
  }

  .topo-cartao {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  h3 {
    margin: 0;
    font-family: ${F.corpo};
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${C.txt};
  }

  p.descricao {
    margin: 6px 0 0;
    font-size: 0.82rem;
    line-height: 1.55;
    color: ${C.mut};
  }

  .indice {
    font-family: ${F.dados};
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 2px;
    color: ${C.neu};
  }

  .abrir {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 18px;
    font-family: ${F.corpo};
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: ${C.mut};
    transition:
      color 0.2s ease,
      gap 0.2s ease;
  }

  .palco-ferramenta {
    margin-top: 20px;
    transition: transform 0.3s ease;
  }
`;

const MiniTabela = styled.div`
  border-radius: 10px;
  border: 1px solid rgba(252, 252, 251, 0.08);
  overflow: hidden;
  font-family: ${F.dados};

  .mini-linha {
    display: grid;
    grid-template-columns: 26px 1fr 34px;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-left: 3px solid transparent;
    border-bottom: 1px solid rgba(252, 252, 251, 0.05);
    font-size: 0.82rem;
    font-weight: 600;
    color: ${C.txt};

    &:last-of-type {
      border-bottom: none;
    }

    .pos {
      color: ${C.neu};
      text-align: center;
    }

    .pts {
      text-align: right;
      color: ${C.acc};
    }
  }

  .legenda-mini {
    display: flex;
    gap: 14px;
    padding: 8px 12px;
    font-size: 0.62rem;
    letter-spacing: 1.5px;
    color: ${C.neu};

    i {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 2px;
      margin-right: 5px;
    }
  }
`;

const MiniOitavas = styled.div`
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(252, 252, 251, 0.12);
  overflow: hidden;
  max-width: 360px;

  .linha {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto auto minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    padding: 9px 13px;
    font-family: ${F.dados};
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: ${C.mut};

    + .linha {
      border-top: 1px dashed rgba(252, 252, 251, 0.1);
    }

    .num {
      color: ${C.neu};
      font-weight: 700;
    }

    .time {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.dir {
        text-align: right;
      }

      &.ganhou {
        color: ${C.acc};
      }
    }

    .x {
      color: ${C.neu};
      font-size: 0.56rem;
    }

    b {
      font-size: 0.82rem;
      color: ${C.txt};

      &.ganhou {
        color: ${C.acc};
      }
    }
  }
`;

const MiniBracket = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
  align-items: center;

  .coluna {
    display: grid;
    gap: 26px;
  }

  .jogo {
    border: 1px solid rgba(252, 252, 251, 0.12);
    border-radius: 7px;
    padding: 6px 9px;
    font-family: ${F.dados};
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: ${C.mut};

    div {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
    }

    b {
      color: ${C.acc};
    }
  }

  .destaque .jogo {
    border-color: rgba(165, 239, 28, 0.55);
  }

  .pill {
    justify-self: center;
    font-family: ${F.dados};
    font-size: 0.54rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: ${C.mut};
    padding: 4px 12px;
    border: 1px solid rgba(165, 239, 28, 0.3);
    border-radius: 999px;
    background: rgba(165, 239, 28, 0.06);
  }

  .faixa-camp {
    text-align: center;
    padding: 5px 8px;
    border-radius: 6px;
    background: linear-gradient(90deg, ${C.acc}, rgba(165, 239, 28, 0.7));
    font-family: ${F.dados};
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: #0a0f00;
  }

  .rotulo-col {
    text-align: center;
    font-family: ${F.dados};
    font-size: 0.56rem;
    font-weight: 600;
    letter-spacing: 2.5px;
    color: ${C.neu};
    margin-top: 8px;
  }
`;

const MiniSubstituicao = styled.div`
  border-radius: 10px;
  background: #000;
  border: 1px solid rgba(252, 252, 251, 0.1);
  overflow: hidden;
  max-width: 330px;

  .faixa-sub {
    padding: 6px 12px;
    background: linear-gradient(90deg, ${C.g3}, transparent);
    font-family: ${F.dados};
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 3px;
    color: ${C.acc};
  }

  .jogador {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    font-family: ${F.dados};
    font-size: 0.86rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: ${C.txt};

    + .jogador {
      border-top: 1px dashed rgba(252, 252, 251, 0.12);
    }

    small {
      font-size: 0.58rem;
      letter-spacing: 2.5px;
      display: block;
    }

    .sai small {
      color: #ff6b61;
    }

    .entra small {
      color: ${C.acc};
      text-align: right;
    }
  }
`;

const MiniPenaltis = styled.div`
  border-radius: 10px;
  border: 1px solid rgba(252, 252, 251, 0.1);
  padding: 16px;

  .titulo-pen {
    font-family: ${F.dados};
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 3px;
    color: ${C.neu};
    margin-bottom: 12px;
  }

  .lado-pen {
    display: flex;
    align-items: center;
    gap: 10px;

    + .lado-pen {
      margin-top: 10px;
    }

    span.nome-time {
      width: 52px;
      font-family: ${F.dados};
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: ${C.txt};
    }

    .bolinhas {
      display: flex;
      gap: 7px;
      flex: 1;

      i {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        border: 1.5px solid ${C.neu};

        &.convertido {
          background: ${C.acc};
          border-color: ${C.acc};
        }

        &.perdido {
          border-color: #ff3b30;
          background: rgba(255, 59, 48, 0.25);
        }
      }
    }
  }
`;

const Variacoes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .silhueta {
    border: 1px solid rgba(252, 252, 251, 0.12);
    border-radius: 8px;
    padding: 12px;
    display: grid;
    gap: 8px;
    align-content: center;
    justify-items: center;
    min-height: 92px;

    b {
      font-family: ${F.dados};
      font-size: 0.7rem;
      letter-spacing: 2.5px;
      color: ${C.mut};
    }

    .barra-silhueta {
      height: 8px;
      border-radius: 3px;
      background: linear-gradient(90deg, ${C.g3}, ${C.acc});

      &.curta {
        width: 62%;
      }
      &.media {
        width: 82%;
      }
      &.larga {
        width: 100%;
      }
    }
  }
`;

function PalcoDeFerramenta({ tipo }) {
  if (tipo === 'tabela') {
    const linhas = [
      ['1', 'VER · Veranópolis', 14, 'class'],
      ['2', 'PAS · Passo Fundo', 14, 'class'],
      ['3', 'ESP · Esportivo', 13, 'class'],
      ['4', 'AIM · Aimoré', 11, null],
      ['15', 'GLO · Glória', 2, null],
      ['16', 'LAJ · Lajeadense', 1, 'reb'],
    ];
    return (
      <MiniTabela>
        {linhas.map(([pos, nome, pts, zona]) => (
          <div
            key={pos}
            className="mini-linha"
            style={{
              borderLeftColor:
                zona === 'class'
                  ? C.acc
                  : zona === 'reb'
                    ? '#ff3b30'
                    : 'transparent',
            }}
          >
            <span className="pos">{pos}</span>
            <span>{nome}</span>
            <span className="pts">{pts}</span>
          </div>
        ))}
        <div className="legenda-mini">
          <span>
            <i style={{ background: C.acc }} />
            G-8
          </span>
          <span>
            <i style={{ background: '#ff3b30' }} />
            REBAIXAMENTO
          </span>
        </div>
      </MiniTabela>
    );
  }

  if (tipo === 'oitavas') {
    const jogos = [
      ['01', 'VER · Veranópolis', 1, 'PAS · Passo Fundo', 2, 'vis'],
      ['02', 'ESP · Esportivo', 3, 'AIM · Aimoré', 1, 'casa'],
      ['03', 'PEL · Pelotas', 2, 'GLO · Glória', 0, 'casa'],
      ['04', 'BRA · Brasil', 0, 'LAJ · Lajeadense', 4, 'vis'],
    ];
    return (
      <MiniOitavas>
        {jogos.map(([num, casa, g1, fora, g2, venc]) => (
          <div key={num} className="linha">
            <span className="num">{num}</span>
            <span className={`time ${venc === 'casa' ? 'ganhou' : ''}`}>
              {casa}
            </span>
            <b className={venc === 'casa' ? 'ganhou' : ''}>{g1}</b>
            <span className="x">×</span>
            <b className={venc === 'vis' ? 'ganhou' : ''}>{g2}</b>
            <span className={`time dir ${venc === 'vis' ? 'ganhou' : ''}`}>
              {fora}
            </span>
          </div>
        ))}
      </MiniOitavas>
    );
  }

  if (tipo === 'bracket') {
    return (
      <MiniBracket>
        <div className="coluna">
          <div className="pill">QUARTAS</div>
          <div className="jogo">
            <div>
              <span>VER</span>
              <b>2</b>
            </div>
            <div>
              <span>AIM</span>
              <span>1</span>
            </div>
          </div>
          <div className="jogo">
            <div>
              <span>PAS</span>
              <b>3</b>
            </div>
            <div>
              <span>ESP</span>
              <span>0</span>
            </div>
          </div>
        </div>
        <div className="coluna destaque">
          <div className="pill">SEMIFINAL</div>
          <div className="jogo">
            <div>
              <span>VER</span>
              <b>1</b>
            </div>
            <div>
              <span>PAS</span>
              <span>—</span>
            </div>
          </div>
        </div>
        <div className="coluna">
          <div className="pill">FINAL</div>
          <div className="jogo">
            <div>
              <span>?</span>
              <span>—</span>
            </div>
            <div>
              <span>?</span>
              <span>—</span>
            </div>
          </div>
          <div className="faixa-camp">CAMPEÃO</div>
        </div>
      </MiniBracket>
    );
  }

  if (tipo === 'substituicao') {
    return (
      <MiniSubstituicao>
        <div className="faixa-sub">SUBSTITUIÇÃO</div>
        <div className="jogador">
          <span className="sai">
            <small>SAI</small>Nº 7 RAFA
          </span>
        </div>
        <div className="jogador">
          <span className="entra">
            <small>ENTRA</small>Nº 11 LEO
          </span>
        </div>
      </MiniSubstituicao>
    );
  }

  if (tipo === 'penaltis') {
    return (
      <MiniPenaltis>
        <div className="titulo-pen">DISPUTA DE PÊNALTIS</div>
        <div className="lado-pen">
          <span className="nome-time">PEL</span>
          <div className="bolinhas">
            <i className="convertido" />
            <i className="convertido" />
            <i className="perdido" />
            <i className="convertido" />
            <i />
          </div>
        </div>
        <div className="lado-pen">
          <span className="nome-time">BRA</span>
          <div className="bolinhas">
            <i className="convertido" />
            <i className="perdido" />
            <i className="convertido" />
            <i />
            <i />
          </div>
        </div>
      </MiniPenaltis>
    );
  }

  return null;
}

const FERRAMENTAS = [
  {
    rota: '/placar-broadcast',
    indice: '01',
    titulo: 'Placar Broadcast',
    descricao:
      'Placar completo com cronômetro e período dos clubes — em quatro layouts diferentes.',
    palco: 'placar',
  },
  {
    rota: '/tabela',
    indice: '02',
    titulo: 'Classificação',
    descricao:
      'Tabela sincronizada direto com o site da FGF, com zonas de classificação e rebaixamento.',
    palco: 'tabela',
  },
  {
    rota: '/mata-mata',
    indice: '03',
    titulo: 'Oitavas de Final',
    descricao:
      'Tabela dos confrontos de oitavas com placares, pênaltis e vencedores destacados ao vivo.',
    palco: 'oitavas',
  },
  {
    rota: '/fases-finais',
    indice: '04',
    titulo: 'Fases Finais',
    descricao:
      'Chaveamento das quartas à final: vencedores avançam sozinhos e campeão ganha selo especial.',
    palco: 'bracket',
  },
  {
    rota: '/substituicao',
    indice: '05',
    titulo: 'Substituição',
    descricao: 'Cartão animado de trocas para o instante da bola rolando.',
    palco: 'substituicao',
  },
  {
    rota: '/penaltis',
    indice: '06',
    titulo: 'Pênaltis',
    descricao: 'Disputa cobrança a cobrança, com histórico visual por lado.',
    palco: 'penaltis',
  },
];

/* ---------- Seção: demonstração animada ao vivo ---------- */

const DEMOS_AO_VIVO = [
  { id: 'placar', rotulo: 'Placar Broadcast', rota: '/placar-broadcast' },
  { id: 'tabela', rotulo: 'Classificação', rota: '/tabela' },
  { id: 'fases', rotulo: 'Fases finais', rota: '/fases-finais' },
  { id: 'escalacao', rotulo: 'Escalação', rota: '/escalacao' },
  { id: 'rodada', rotulo: 'Última Rodada', rota: '/ultima-rodada' },
];

const ROTAS_EXTRAS = [
  ['/placar-pl', 'Placar PL'],
  ['/placar-bl', 'Placar BL'],
  ['/placar-ll', 'Placar LL'],
  ['/mata-mata', 'Oitavas'],
  ['/substituicao', 'Substituição'],
  ['/penaltis', 'Pênaltis'],
];

const LINHAS_DEMO = [
  ['1', 'VER', 'Veranópolis', '37'],
  ['2', 'PAS', 'Passo Fundo', '35'],
  ['3', 'ESP', 'Esportivo', '33'],
  ['4', 'AIM', 'Aimoré', '29'],
];

const flutuar = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
`;

const piscar = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
`;

const pulsoNeon = keyframes`
  0%, 100% {
    border-color: rgba(165, 239, 28, 0.55);
    box-shadow: 0 0 22px -6px rgba(165, 239, 28, 0.3);
  }
  50% {
    border-color: rgba(165, 239, 28, 0.25);
    box-shadow: 0 0 8px -6px rgba(165, 239, 28, 0.08);
  }
`;

const brilhoFaixa = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const DemoMoldura = styled.div`
  position: relative;
  max-width: 880px;
  margin: 48px auto 0;
`;

const ChipFlutuante = styled.div`
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(12, 12, 12, 0.94);
  border: 1px solid rgba(165, 239, 28, 0.32);
  box-shadow: 0 16px 34px -16px rgba(0, 0, 0, 0.85);
  font-family: ${F.dados};
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${C.txt};
  white-space: nowrap;
  animation: ${flutuar} 5.5s ease-in-out infinite;

  i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${C.acc};
  }

  &.c1 {
    top: -16px;
    left: 5%;
  }
  &.c2 {
    right: 4%;
    bottom: 30px;
    animation-delay: 1.4s;
  }
  &.c3 {
    left: -2%;
    top: 40%;
    animation-delay: 2.8s;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const AreaJanela = styled.div`
  position: relative;
`;

const JanelaDemo = styled.div`
  border-radius: 18px;
  overflow: hidden;
  background: #0b0b0b;
  border: 1px solid rgba(252, 252, 251, 0.1);
  box-shadow:
    0 44px 90px -44px rgba(0, 0, 0, 0.85),
    0 0 90px -34px rgba(165, 239, 28, 0.16);
`;

const BarraJanela = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  background: #101010;
  border-bottom: 1px solid rgba(252, 252, 251, 0.07);

  .dots {
    display: inline-flex;
    gap: 5px;

    span {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #262626;
    }
  }

  .url {
    flex: 1;
    text-align: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    font-family: ${F.dados};
    font-size: 0.64rem;
    letter-spacing: 1px;
    color: ${C.mut};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    b {
      color: ${C.acc};
      font-weight: 700;
    }
  }
`;

const PalcoDemos = styled.div`
  position: relative;
  min-height: 330px;

  @media (max-width: 700px) {
    min-height: 380px;
  }
`;

const PainelDemo = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 22px;
  opacity: 0;
  transform: translateY(16px) scale(0.985);
  transition:
    opacity 0.55s ease,
    transform 0.55s ease;
  pointer-events: none;

  &[data-on='true'] {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
`;

const CaixaPlacar = styled.div`
  width: min(560px, 100%);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 24px 22px;
  border-radius: 14px;
  background: linear-gradient(160deg, #151515, #090909);
  border: 1px solid rgba(252, 252, 251, 0.09);

  .time {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: ${F.dados};
    font-size: 0.88rem;
    font-weight: 600;
    color: ${C.txt};

    &.vis {
      justify-content: flex-end;
      text-align: right;
    }

    small {
      display: block;
      font-size: 0.54rem;
      letter-spacing: 2px;
      color: ${C.neu};
    }
  }

  .gols {
    font-family: ${F.dados};
    font-size: 2.1rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: #fcfcfb;

    em {
      font-style: normal;
      margin: 0 6px;
      font-size: 1.1rem;
      color: ${C.acc};
    }
  }

  .relogio {
    grid-column: 1 / -1;
    justify-self: center;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
    padding: 7px 18px;
    border-radius: 999px;
    background: rgba(165, 239, 28, 0.08);
    border: 1px solid rgba(165, 239, 28, 0.28);
    font-family: ${F.dados};
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 3px;
    font-variant-numeric: tabular-nums;
    color: ${C.acc};
  }

  .vivo {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${C.acc};
    animation: ${piscar} 1.1s ease-in-out infinite;
  }
`;

const CaixaTabela = styled.div`
  width: min(480px, 100%);
  border-radius: 12px;
  border: 1px solid rgba(252, 252, 251, 0.09);
  overflow: hidden;

  .cab,
  .lin {
    display: grid;
    grid-template-columns: 34px 1fr 38px;
    gap: 10px;
    align-items: center;
    padding: 10px 16px;
    font-family: ${F.dados};
  }

  .cab {
    background: rgba(255, 255, 255, 0.03);
    font-size: 0.58rem;
    letter-spacing: 2px;
    color: ${C.neu};
  }

  .lin {
    border-top: 1px solid rgba(252, 252, 251, 0.05);
    border-left: 3px solid transparent;
    font-size: 0.82rem;
    font-weight: 600;
    color: ${C.txt};
    opacity: 0.18;
    transform: translateX(-12px);
    transition:
      opacity 0.45s ease,
      transform 0.45s ease;

    &.zona {
      border-left-color: ${C.acc};
    }

    small {
      margin-left: 7px;
      font-size: 0.6rem;
      color: ${C.neu};
    }

    .p {
      text-align: right;
      color: ${C.acc};
    }
  }

  [data-on='true'] .lin {
    opacity: 1;
    transform: none;
    transition-delay: calc(var(--i) * 130ms);
  }
`;

const CaixaBracket = styled.div`
  width: min(520px, 100%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }

  .col {
    display: grid;
    gap: 12px;
    align-content: center;
  }

  .rotulo {
    text-align: center;
    font-family: ${F.dados};
    font-size: 0.56rem;
    letter-spacing: 2.5px;
    color: ${C.neu};
  }

  .jogo {
    border: 1px solid rgba(252, 252, 251, 0.1);
    border-radius: 10px;
    padding: 9px 12px;
    font-family: ${F.dados};
    font-size: 0.74rem;
    color: ${C.mut};

    div {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
    }

    b {
      color: ${C.acc};
    }

    &.quente {
      border-color: rgba(165, 239, 28, 0.5);
      animation: ${pulsoNeon} 2.4s ease-in-out infinite;
    }
  }

  .faixa {
    text-align: center;
    padding: 6px;
    border-radius: 8px;
    background: linear-gradient(
      90deg,
      ${C.acc},
      rgba(165, 239, 28, 0.55),
      ${C.acc}
    );
    background-size: 200% 100%;
    animation: ${brilhoFaixa} 3s linear infinite;
    color: #0a0f00;
    font-family: ${F.dados};
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 3px;
  }
`;

const PontosDemo = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;

  button {
    width: 28px;
    height: 5px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    background: rgba(252, 252, 251, 0.14);
    transition: background 0.3s ease;

    &.on {
      background: ${C.acc};
    }

    &:hover {
      background: rgba(252, 252, 251, 0.32);
    }
  }
`;

const LinksRapidos = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
  margin-top: 22px;

  a {
    padding: 7px 14px;
    border-radius: 999px;
    border: 1px solid rgba(252, 252, 251, 0.12);
    font-family: ${F.dados};
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: ${C.mut};
    text-decoration: none;
    transition:
      border-color 0.25s ease,
      color 0.25s ease,
      background 0.25s ease;

    &:hover {
      border-color: rgba(165, 239, 28, 0.5);
      color: ${C.txt};
    }

    &.ativo {
      background: ${C.acc};
      border-color: rgba(165, 239, 28, 0.55);
      color: #0a0f00;
    }
  }
`;

const CaixaEscalacao = styled.div`
  width: min(560px, 100%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }

  .cartao {
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(160deg, #151515, #090909);
    border-left: 4px solid ${({ $c1 }) => $c1};
    border-top: 1px solid rgba(252, 252, 251, 0.09);
    border-right: 1px solid rgba(252, 252, 251, 0.09);
    border-bottom: 1px solid rgba(252, 252, 251, 0.09);

    &:last-child {
      border-left-color: ${({ $c2 }) => $c2};
    }
  }

  .topo {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    background: rgba(255, 255, 255, 0.03);
    font-family: ${F.dados};
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: ${C.txt};

    .form {
      margin-left: auto;
      padding: 2px 10px;
      border-radius: 999px;
      background: ${C.acc};
      color: #0a0f00;
      font-size: 0.66rem;
      letter-spacing: 1px;
    }
  }

  .jog {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 6px 12px;
    font-family: ${F.dados};
    font-size: 0.74rem;
    color: ${C.txt};
    opacity: 0.18;
    transform: translateX(-10px);
    transition:
      opacity 0.4s ease,
      transform 0.4s ease;

    b {
      min-width: 18px;
      text-align: center;
      color: ${C.acc};
    }

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .tec {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 12px;
    border-top: 1px solid rgba(165, 239, 28, 0.25);
    font-family: ${F.dados};
    font-size: 0.62rem;
    letter-spacing: 1.5px;
    color: ${C.neu};

    i {
      font-style: normal;
      color: ${C.acc};
      font-weight: 700;
    }
  }

  [data-on='true'] .jog {
    opacity: 1;
    transform: none;
    transition-delay: calc(var(--i) * 110ms);
  }
`;

const CaixaRodada = styled.div`
  width: min(560px, 100%);
  border-radius: 14px;
  overflow: hidden;
  border-top: 3px solid ${C.acc};
  background: linear-gradient(160deg, #151515, #090909);
  border-left: 1px solid rgba(252, 252, 251, 0.09);
  border-right: 1px solid rgba(252, 252, 251, 0.09);
  border-bottom: 1px solid rgba(252, 252, 251, 0.09);

  .topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 16px;
    background: rgba(255, 255, 255, 0.03);
    font-family: ${F.dados};
    font-weight: 700;
    letter-spacing: 2px;
    color: ${C.txt};

    span {
      padding: 2px 10px;
      border-radius: 999px;
      background: ${C.acc};
      color: #0a0f00;
      font-size: 0.56rem;
      letter-spacing: 1.5px;
    }
  }

  .jogo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 7px 16px;
    font-family: ${F.dados};
    font-size: 0.78rem;
    font-weight: 600;
    color: ${C.txt};
    opacity: 0.18;
    transform: translateY(-8px);
    transition:
      opacity 0.4s ease,
      transform 0.4s ease;

    & + & {
      border-top: 1px solid rgba(252, 252, 251, 0.05);
    }

    .lado {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      min-width: 64px;

      &.fim {
        justify-content: flex-end;
      }
    }

    .placar {
      color: ${C.acc};
      font-variant-numeric: tabular-nums;
    }
  }

  .faixa-pos {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 16px 13px;
    border-top: 1px solid rgba(252, 252, 251, 0.07);
  }

  .chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;

    em {
      font-style: normal;
      font-family: ${F.dados};
      font-size: 0.68rem;
      font-weight: 700;
      color: ${C.acc};
    }
  }

  [data-on='true'] .jogo {
    opacity: 1;
    transform: none;
    transition-delay: calc(var(--i) * 130ms);
  }
`;

function DemoAoVivo() {
  const [ativa, definirAtiva] = useState(0);
  const [segundos, definirSegundos] = useState(2232);

  useEffect(() => {
    const giro = setInterval(
      () => definirAtiva((a) => (a + 1) % DEMOS_AO_VIVO.length),
      5600,
    );
    const relogio = setInterval(() => definirSegundos((s) => s + 1), 1000);
    return () => {
      clearInterval(giro);
      clearInterval(relogio);
    };
  }, []);

  const mmss = `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(
    segundos % 60,
  ).padStart(2, '0')}`;
  const demo = DEMOS_AO_VIVO[ativa];

  return (
    <DemoMoldura>
      <AreaJanela>
        <ChipFlutuante className="c1">
          <i />
          AO VIVO · GAUCHÃO A2
        </ChipFlutuante>
        <ChipFlutuante className="c2">
          <i />
          GOL DO VERANÓPOLIS
        </ChipFlutuante>
        <ChipFlutuante className="c3">
          <i />
          VER AVANÇA ÀS SEMIFINAIS
        </ChipFlutuante>

        <JanelaDemo>
          <BarraJanela>
            <span className="dots">
              <span />
              <span />
              <span />
            </span>
            <span className="url">
              pelotense-esportes.netlify.app<b>{demo.rota}</b>
            </span>
          </BarraJanela>

          <PalcoDemos>
            <PainelDemo data-on={ativa === 0}>
              <CaixaPlacar>
                <div className="time">
                  <Escudo
                    url="/escudos/VER.png"
                    sigla="VER"
                    cor="#047857"
                    tamanho={26}
                  />
                  <span>
                    VER<small>VERANÓPOLIS</small>
                  </span>
                </div>
                <div className="gols">
                  1<em>×</em>0
                </div>
                <div className="time vis">
                  <span>
                    PAS<small>PASSO FUNDO</small>
                  </span>
                  <Escudo
                    url="/escudos/PAS.png"
                    sigla="PAS"
                    cor="#c1121f"
                    tamanho={26}
                  />
                </div>
                <div className="relogio">
                  <span className="vivo" />
                  2º TEMPO · {mmss}
                </div>
              </CaixaPlacar>
            </PainelDemo>

            <PainelDemo data-on={ativa === 1}>
              <CaixaTabela>
                <div className="cab">
                  <span>#</span>
                  <span>CLASSIFICAÇÃO</span>
                  <span style={{ textAlign: 'right' }}>PTS</span>
                </div>
                {LINHAS_DEMO.map(([pos, sig, nome, pts], i) => (
                  <div
                    key={sig}
                    className={`lin${pos === '1' ? ' zona' : ''}`}
                    style={{ '--i': i }}
                  >
                    <span>{pos}</span>
                    <span>
                      {sig}
                      <small>{nome}</small>
                    </span>
                    <span className="p">{pts}</span>
                  </div>
                ))}
              </CaixaTabela>
            </PainelDemo>

            <PainelDemo data-on={ativa === 2}>
              <CaixaBracket>
                <div className="col">
                  <div className="rotulo">QUARTAS</div>
                  <div className="jogo quente">
                    <div>
                      <span>VER</span>
                      <b>2</b>
                    </div>
                    <div>
                      <span>AIM</span>
                      <span>1</span>
                    </div>
                  </div>
                  <div className="jogo">
                    <div>
                      <span>PAS</span>
                      <b>3</b>
                    </div>
                    <div>
                      <span>ESP</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="rotulo">FINAL</div>
                  <div className="jogo">
                    <div>
                      <span>VER</span>
                      <b>1</b>
                    </div>
                    <div>
                      <span>PAS</span>
                      <span>—</span>
                    </div>
                  </div>
                  <div className="faixa">CAMPEÃO</div>
                </div>
              </CaixaBracket>
            </PainelDemo>

            <PainelDemo data-on={ativa === 3}>
              <CaixaEscalacao $c1="#047857" $c2="#c1121f">
                {[
                  {
                    esc: 'VER',
                    cor: '#047857',
                    jog: ['CAIO', 'LÉO', 'MARCOS', 'DUDU'],
                    tec: 'PROF. SILVA',
                  },
                  {
                    esc: 'PAS',
                    cor: '#c1121f',
                    jog: ['TIAGO', 'RENAN', 'IVO', 'NETO'],
                    tec: 'PROF. LUIZ',
                  },
                ].map((time, ti) => (
                  <div key={ti} className="cartao">
                    <div className="topo">
                      <Escudo
                        url={`/escudos/${time.esc}.png`}
                        sigla={time.esc}
                        cor={time.cor}
                        tamanho={20}
                      />
                      {time.esc}
                      <span className="form">4-3-3</span>
                    </div>
                    {time.jog.map((nome, ji) => (
                      <div key={ji} className="jog" style={{ '--i': ji }}>
                        <b>{ji + 1}</b>
                        <span>{nome}</span>
                      </div>
                    ))}
                    <div className="tec">
                      <i>TÉC</i> {time.tec}
                    </div>
                  </div>
                ))}
              </CaixaEscalacao>
            </PainelDemo>

            <PainelDemo data-on={ativa === 4}>
              <CaixaRodada>
                <div className="topo">
                  RODADA 7<span>RESULTADOS</span>
                </div>
                {[
                  ['VER', 'AIM', '2', '1'],
                  ['PAS', 'ESP', '3', '0'],
                  ['SCR', 'GRA', '1', '1'],
                ].map(([casa, fora, gc, gf], i) => (
                  <div key={i} className="jogo" style={{ '--i': i }}>
                    <span className="lado">
                      <Escudo
                        url={`/escudos/${casa}.png`}
                        sigla={casa}
                        cor="#1f1f1f"
                        tamanho={22}
                      />
                      {casa}
                    </span>
                    <span className="placar">
                      {gc} × {gf}
                    </span>
                    <span className="lado fim">
                      {fora}
                      <Escudo
                        url={`/escudos/${fora}.png`}
                        sigla={fora}
                        cor="#1f1f1f"
                        tamanho={22}
                      />
                    </span>
                  </div>
                ))}
                <div className="faixa-pos">
                  {[
                    ['VER', 1],
                    ['PAS', 2],
                    ['ESP', 3],
                    ['AIM', 4],
                    ['SCR', 5],
                  ].map(([sig, pos]) => (
                    <span key={sig} className="chip">
                      <Escudo
                        url={`/escudos/${sig}.png`}
                        sigla={sig}
                        cor="#1f1f1f"
                        tamanho={30}
                      />
                      <em>{pos}º</em>
                    </span>
                  ))}
                </div>
              </CaixaRodada>
            </PainelDemo>
          </PalcoDemos>
        </JanelaDemo>
      </AreaJanela>

      <PontosDemo>
        {DEMOS_AO_VIVO.map((d, i) => (
          <button
            key={d.id}
            type="button"
            className={i === ativa ? 'on' : ''}
            onClick={() => definirAtiva(i)}
            aria-label={d.rotulo}
          />
        ))}
      </PontosDemo>

      <LinksRapidos>
        {DEMOS_AO_VIVO.map((d) => (
          <Link
            key={d.id}
            to={d.rota}
            className={d.id === demo.id ? 'ativo' : ''}
          >
            {d.rotulo}
          </Link>
        ))}
        {ROTAS_EXTRAS.map(([rota, nome]) => (
          <Link key={rota} to={rota}>
            {nome}
          </Link>
        ))}
      </LinksRapidos>
    </DemoMoldura>
  );
}
function SecaoFerramentasBloco() {
  return (
    <SecaoFerramentas id="ferramentas">
      <div className="cabeca">
        <Revelar>
          <div>
            <Rotulo>Ferramentas</Rotulo>
            <h2>
              Tudo que o jogo
              <br />
              <em>pede no ar.</em>
            </h2>
          </div>
        </Revelar>
        <Revelar atraso={140}>
          <p>
            Placar, classificação e chaveamento alternando ao vivo, como na
            transmissão real — passe o mouse, clique nos pontos ou abra o
            gráfico que quiser.
          </p>
        </Revelar>
      </div>
      <DemoAoVivo />
    </SecaoFerramentas>
  );
}

/* ---------- Seção: classificação ao vivo (dados reais) ---------- */

const SecaoTabela = styled.section`
  position: relative;
  padding: 130px 4vw;
  border-top: 1px solid rgba(252, 252, 251, 0.06);

  .grade-tabela {
    max-width: 1440px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
    gap: 70px;
    align-items: center;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
      gap: 44px;
    }
  }

  h2 {
    margin: 18px 0 22px;
    font-family: ${F.corpo};
    font-weight: 800;
    font-size: clamp(2rem, 3.8vw, 3.4rem);
    line-height: 1.02;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: ${C.txt};

    em {
      font-style: normal;
      color: ${C.acc};
    }
  }

  p {
    margin: 0 0 28px;
    max-width: 400px;
    font-size: 0.94rem;
    line-height: 1.7;
    color: ${C.mut};

    b {
      color: ${C.txt};
      font-weight: 600;
    }
  }
`;

const TabelaViva = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(252, 252, 251, 0.09);
  background: #0b0b0b;
  overflow: hidden;
  box-shadow: 0 40px 80px -50px rgba(0, 0, 0, 0.9);

  .cabecalho-vivo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(252, 252, 251, 0.07);
    font-family: ${F.dados};
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: ${C.mut};

    b {
      color: ${C.acc};
      display: inline-flex;
      align-items: center;
      gap: 8px;

      i {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #ff3b30;
        animation: pulsoLive 1.3s ease-in-out infinite;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      b i {
        animation: none;
      }
    }
  }

  .linha-viva {
    display: grid;
    grid-template-columns: 34px 30px 1fr repeat(3, 44px);
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-left: 3px solid transparent;
    border-bottom: 1px solid rgba(252, 252, 251, 0.05);
    font-family: ${F.dados};
    font-size: 0.88rem;
    font-weight: 600;
    color: ${C.txt};

    &:nth-child(odd) {
      background: rgba(252, 252, 251, 0.015);
    }

    &.zona-class {
      border-left-color: ${C.acc};
    }

    &.zona-reb {
      border-left-color: #ff3b30;
    }

    .pos-viva {
      color: ${C.neu};
      text-align: center;
    }

    .nome-viva {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: 1px;
    }

    .col-viva {
      text-align: center;
      color: ${C.mut};
      font-size: 0.8rem;
    }

    .pts-viva {
      text-align: center;
      color: ${C.acc};
      font-weight: 700;
    }
  }

  .rodape-vivo {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 18px;
    font-family: ${F.dados};
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 2px;
    color: ${C.neu};
  }
`;

const LinkInline = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 26px;
  font-family: ${F.corpo};
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: ${C.txt};
  text-decoration: none;
  border-bottom: 1px solid ${C.acc};
  padding-bottom: 6px;
  transition:
    color 0.2s ease,
    gap 0.25s ease;

  &:hover {
    color: ${C.acc};
    gap: 15px;
  }
`;

function SecaoClassificacao() {
  const estado = usePlacarBroadcastInterno();
  const times = ordenarClassificacao(estado.times).slice(0, 8);

  return (
    <SecaoTabela id="classificacao">
      <div className="grade-tabela">
        <Revelar>
          <div>
            <Rotulo>Dados oficiais</Rotulo>
            <h2>
              A tabela se <em>atualiza sozinha.</em>
            </h2>
            <p>
              A classificação é buscada <b>direto do site da FGF</b> e aplicada
              no overlay sem você tocar em nada. O painel abaixo mostra os dados
              que estão na sua transmissão agora.
            </p>
            <LinkInline to="/tabela">Ver tabela completa →</LinkInline>
          </div>
        </Revelar>

        <Revelar atraso={140}>
          <TabelaViva>
            <div className="cabecalho-vivo">
              <span>{estado.competicao || 'CLASSIFICAÇÃO'}</span>
              <b>
                <i /> AO VIVO
              </b>
            </div>
            {times.map((t, i) => (
              <div
                key={`${t.sigla}-${i}`}
                className={`linha-viva ${i < 8 ? 'zona-class' : ''}`}
              >
                <span className="pos-viva">{i + 1}</span>
                <Escudo
                  url={t.escudo}
                  sigla={t.sigla}
                  cor={t.cor}
                  tamanho={20}
                />
                <span className="nome-viva">{t.nome}</span>
                <span className="col-viva">{t.j}J</span>
                <span className="col-viva">{t.v}V</span>
                <span className="pts-viva">{t.p}</span>
              </div>
            ))}
            <div className="rodape-vivo">
              <span>G-8 EM VERDE · FONTE: FGF</span>
              <span>RODADA {String(estado.rodada).padStart(2, '0')}</span>
            </div>
          </TabelaViva>
        </Revelar>
      </div>
    </SecaoTabela>
  );
}

/* ---------- Seção: OBS ---------- */

const SecaoOBS = styled.section`
  position: relative;
  padding: 130px 4vw;
  border-top: 1px solid rgba(252, 252, 251, 0.06);
  overflow: hidden;
  .miolo-obs {
    max-width: 1440px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 60px;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
  }

  h2 {
    margin: 18px 0 20px;
    font-family: ${F.corpo};
    font-weight: 800;
    font-size: clamp(2.2rem, 5vw, 4.6rem);
    line-height: 0.98;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: ${C.txt};
  }

  p {
    margin: 0 0 30px;
    max-width: 430px;
    font-size: 0.94rem;
    line-height: 1.7;
    color: ${C.mut};

    code {
      font-family: ${F.dados};
      letter-spacing: 1px;
      color: ${C.acc};
      background: rgba(165, 239, 28, 0.07);
      border: 1px solid rgba(165, 239, 28, 0.2);
      border-radius: 5px;
      padding: 1px 7px;
      font-size: 0.85em;
    }
  }
`;

const ListaSpecs = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;

  li {
    display: flex;
    align-items: baseline;
    gap: 18px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(252, 252, 251, 0.08);

    &:first-child {
      border-top: 1px solid rgba(252, 252, 251, 0.08);
    }

    b {
      font-family: ${F.dados};
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 2px;
      color: ${C.acc};
      min-width: 38px;
    }

    span {
      font-family: ${F.corpo};
      font-size: 0.86rem;
      color: ${C.mut};
      line-height: 1.5;
    }
  }
`;

const Xadrez = styled.div`
  position: relative;
  width: min(520px, 100%);
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  border: 1px dashed rgba(252, 252, 251, 0.18);
  background: repeating-conic-gradient(
      rgba(252, 252, 251, 0.05) 0% 25%,
      transparent 0% 50%
    )
    0 0 / 36px 36px;
  display: grid;
  place-items: center;

  @media (max-width: 960px) {
    width: 100%;
  }

  .placar-flutuante {
    width: 78%;
    filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.65));
  }
`;

function SecaoOBSBloco() {
  return (
    <SecaoOBS id="obs">
      <div className="miolo-obs">
        <Revelar>
          <div>
            <Rotulo>Integração</Rotulo>
            <h2>
              Feito para
              <br />o OBS.
            </h2>
            <p>
              Cada gráfico roda como <code>browser source</code> com fundo
              transparente. Cole o link da ferramenta na sua cena, redimensione
              e pronto — nada de captura de janela nem chaveamento manual.
            </p>
            <ListaSpecs>
              <li>
                <b>SRC</b>
                <span>Fundo transparente nativo para composição na cena</span>
              </li>
              <li>
                <b>?PRÉVIA</b>
                <span>
                  Modo prévia compacta para conferir antes de entrar no ar
                </span>
              </li>
              <li>
                <b>MULTI</b>
                <span>
                  Vários overlays abertos ao mesmo tempo, todos sincronizados
                </span>
              </li>
            </ListaSpecs>
          </div>
        </Revelar>

        <Revelar atraso={140}>
          <Xadrez>
            <div className="placar-flutuante">
              <PlacarMockup style={{ transform: 'none' }}>
                <div className="placar-linha" style={{ padding: '18px 16px' }}>
                  <div className="time">
                    <Escudo
                      url="/escudos/GAU.png"
                      sigla="GAU"
                      cor="#171717"
                      tamanho={20}
                    />
                    <span style={{ fontSize: '0.8rem' }}>GAÚCHO</span>
                  </div>
                  <div className="gols" style={{ fontSize: '1.6rem' }}>
                    1<em>×</em>1
                  </div>
                  <div className="time visitante">
                    <Escudo
                      url="/escudos/SCR.png"
                      sigla="SCR"
                      cor="#eab308"
                      tamanho={20}
                    />
                    <span style={{ fontSize: '0.8rem' }}>SANTA CRUZ</span>
                  </div>
                </div>
                <div className="rodape-mockup">
                  <span>FUNDO TRANSPARENTE</span>
                  <span className="tempo">88:12</span>
                </div>
              </PlacarMockup>
            </div>
          </Xadrez>
        </Revelar>
      </div>
    </SecaoOBS>
  );
}

/* ---------- Fluxo ---------- */

const SecaoFluxo = styled.section`
  position: relative;
  padding: 130px 4vw;
  border-top: 1px solid rgba(252, 252, 251, 0.06);

  .miolo-fluxo {
    max-width: 1440px;
    margin: 0 auto;
  }

  h2 {
    margin: 18px 0 70px;
    font-family: ${F.corpo};
    font-weight: 800;
    font-size: clamp(2rem, 4vw, 3.6rem);
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: ${C.txt};
  }
`;

const Passos = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .passo {
    position: relative;
    padding-top: 26px;
    border-top: 1px solid rgba(252, 252, 251, 0.12);

    .numero-passo {
      position: absolute;
      top: -1.15em;
      right: 0;
      font-family: ${F.dados};
      font-weight: 700;
      font-size: clamp(3.4rem, 6vw, 5.4rem);
      line-height: 1;
      color: transparent;
      -webkit-text-stroke: 1px rgba(165, 239, 28, 0.55);
    }

    h3 {
      margin: 0 0 10px;
      font-family: ${F.corpo};
      font-size: 0.95rem;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: ${C.txt};
    }

    p {
      margin: 0;
      max-width: 300px;
      font-size: 0.88rem;
      line-height: 1.65;
      color: ${C.mut};
    }
  }
`;

/* ---------- CTA final + rodapé ---------- */

const CtaFinal = styled.section`
  position: relative;
  padding: 170px 4vw;
  text-align: center;
  border-top: 1px solid rgba(252, 252, 251, 0.06);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -30%;
    transform: translateX(-50%);
    width: 70vw;
    height: 60%;
    background: radial-gradient(
      ellipse at center,
      rgba(165, 239, 28, 0.12),
      transparent 65%
    );
    pointer-events: none;
  }

  h2 {
    position: relative;
    margin: 20px 0 40px;
    font-family: ${F.corpo};
    font-weight: 800;
    font-size: clamp(2.4rem, 6vw, 5.4rem);
    line-height: 1;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    color: ${C.txt};

    em {
      font-style: normal;
      color: transparent;
      -webkit-text-stroke: 1.5px ${C.acc};
    }
  }

  .acoes {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }
`;

const Rodape = styled.footer`
  padding: 46px 4vw 54px;
  border-top: 1px solid rgba(252, 252, 251, 0.07);

  .miolo-rodape {
    max-width: 1440px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    a {
      font-family: ${F.dados};
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 2px;
      color: ${C.neu};
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: ${C.acc};
      }
    }
  }

  small {
    font-family: ${F.dados};
    font-size: 0.66rem;
    letter-spacing: 2px;
    color: ${C.neu};
  }
`;

/* ---------- Montagem da página ---------- */

const PASSOS = [
  {
    titulo: 'Abra o controle',
    texto:
      'Escolha a ferramenta, configure times, escudos e cores uma única vez. Tudo fica salvo.',
  },
  {
    titulo: 'Adicione ao OBS',
    texto:
      'Cada gráfico é um browser source com fundo transparente. Cole o link e o overlay entra na cena.',
  },
  {
    titulo: 'Transmita',
    texto:
      'Gol, substituição, pênalti ou fim de rodada: um clique no controle atualiza a tela na hora.',
  },
];

export default function LandingPage() {
  const jogo = useMemo(() => sortearConfronto(), []);

  useEffect(() => {
    document.title =
      'Pelotense Esportes — Graficação ao vivo para transmissões';
  }, []);

  return (
    <Pagina>
      <EstiloPulso />
      <Nav>
        <Marca to="/">
          <img src={LOGO_URL} alt="Pelotense Esportes" />
        </Marca>
        <NavLinks>
          <button onClick={() => rolarPara('sync')}>Tempo real</button>
          <button onClick={() => rolarPara('ferramentas')}>Ferramentas</button>
          <button onClick={() => rolarPara('classificacao')}>
            Classificação
          </button>
          <button onClick={() => rolarPara('obs')}>OBS</button>
        </NavLinks>
        <NavCta to="/hub">Abrir sistema</NavCta>
      </Nav>

      <Hero jogo={jogo} />

      <SecaoTempoReal jogo={jogo} />

      <SecaoFerramentasBloco />

      <SecaoClassificacao />

      <SecaoOBSBloco />

      <SecaoFluxo>
        <div className="miolo-fluxo">
          <Revelar>
            <Rotulo>Como funciona</Rotulo>
            <h2 style={{ height: 90 }}>Três passos. No ar.</h2>
          </Revelar>
          <Passos>
            {PASSOS.map((p, i) => (
              <Revelar key={p.titulo} atraso={i * 110}>
                <div className="passo">
                  <span className="numero-passo">0{i + 1}</span>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </div>
              </Revelar>
            ))}
          </Passos>
        </div>
      </SecaoFluxo>

      <CtaFinal>
        <Revelar>
          <Rotulo style={{ justifyContent: 'center' }}>
            Pronto para transmitir
          </Rotulo>
          <h2>
            Seu próximo jogo
            <br />
            <em>começa aqui.</em>
          </h2>
          <div className="acoes">
            <BotaoGrande to="/hub">Abrir o sistema →</BotaoGrande>
            <BotaoGrande to="/tabela" $fantasma>
              Ver classificação
            </BotaoGrande>
          </div>
        </Revelar>
      </CtaFinal>

      <Rodape>
        <div className="miolo-rodape">
          <Marca to="/">
            <img src={LOGO_URL} alt="" />
            <span>PELOTENSE ESPORTES</span>
          </Marca>
          <nav>
            <Link to="/placar-broadcast">Placar</Link>
            <Link to="/tabela">Tabela</Link>
            <Link to="/mata-mata">Oitavas</Link>
            <Link to="/fases-finais">Fases finais</Link>
            <Link to="/substituicao">Substituição</Link>
            <Link to="/penaltis">Pênaltis</Link>
            <Link to="/hub">Hub</Link>
          </nav>
          <small>GRAFICAÇÃO AO VIVO · {new Date().getFullYear()}</small>
        </div>
      </Rodape>
    </Pagina>
  );
}

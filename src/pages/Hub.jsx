import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { LOGO_URL } from '../theme';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Conteudo = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px;
`;

const Hero = styled.section`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 48px;

  img {
    width: 96px;
    height: 96px;
    object-fit: contain;
    filter: drop-shadow(0 0 24px rgba(34, 197, 94, 0.35));
  }

  h1 {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    letter-spacing: 3px;
    line-height: 1.1;
  }

  p {
    margin-top: 6px;
    color: ${({ theme }) => theme.cores.textoSuave};
    font-size: 1rem;
  }
`;

const SecaoTitulo = styled.h2`
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-bottom: 20px;
`;

const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.cores.superficie},
    ${({ theme }) => theme.cores.fundoClaro}
  );
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.cores.primaria};
  }

  &.breve {
    opacity: 0.45;
    &:hover {
      transform: none;
      border-color: ${({ theme }) => theme.cores.borda};
    }
  }
`;

const CardIcone = styled.div`
  font-size: 2rem;
`;

const CardTitulo = styled.h3`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 1px;
`;

const CardDescricao = styled.p`
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: 0.9rem;
  line-height: 1.5;
  flex: 1;
`;

const CardPreview = styled.div`
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;

  .nome { color: ${({ theme }) => theme.cores.textoSuave}; font-size: 0.7rem; text-transform: uppercase; }
  .gols { font-size: 1.1rem; color: ${({ theme }) => theme.cores.texto}; }
  .tempo { font-size: 0.65rem; color: ${({ theme }) => theme.cores.primaria}; }
  .separador { color: ${({ theme }) => theme.cores.textoSuave}; font-size: 0.65rem; }

  &.broadcast {
    flex-direction: column;
    background: transparent;
    border: none;
    padding: 0;
    gap: 0;
    overflow: visible;
    border-radius: 0;
    .faixa {
      padding: 2px 16px;
      background: rgba(0,0,0,0.7);
      border-radius: 4px 4px 0 0;
      display: flex;
      gap: 8px;
      justify-content: center;
      font-size: 0.55rem;
      letter-spacing: 1px;
      span { color: #fff; }
      .p { color: rgba(255,255,255,0.7); }
    }
    .corpo {
      display: flex;
      border-radius: 0 0 4px 4px;
      overflow: hidden;
    }
    .bloco {
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.6rem;
      color: #fff;
      font-weight: 700;
      font-family: 'Inter', 'Roboto', sans-serif;
      letter-spacing: 0;
      .g { font-size: 0.85rem; font-weight: 700; }
    }
    .sep {
      padding: 6px 5px;
      background: rgba(0,0,0,0.85);
      font-size: 0.55rem;
      color: rgba(255,255,255,0.5);
      font-weight: 700;
    }
  }
`;

const CardAcoes = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

const Botao = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 11px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    filter 0.15s ease,
    background 0.15s ease;

  &.primario {
    background: ${({ theme }) => theme.cores.primaria};
    color: #052e13;
    &:hover {
      filter: brightness(1.1);
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
  padding: 24px;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: 0.8rem;
  letter-spacing: 1px;
`;

export default function Hub() {
  return (
    <Container>
      <Header />
      <Conteudo>
        <Hero>
          <img src={LOGO_URL} alt="Logo Pelotense Esportes" />
          <div>
            <h1>PELOTENSE ESPORTES</h1>
            <p>
              Central de overlays e placares ao vivo. Selecione um módulo para
              começar.
            </p>
          </div>
        </Hero>

        <SecaoTitulo>Módulos disponíveis</SecaoTitulo>
        <Grade>
          <Card>
            <CardIcone>🎬</CardIcone>
            <CardTitulo>PLACAR BROADCAST</CardTitulo>
            <CardDescricao>
              Placar compacto estilo broadcast esportivo. Design flat com
              siglas dos times, ideal para transmissões ao vivo e overlays
              profissionais.
            </CardDescricao>
            <CardPreview className="broadcast">
              <div className="faixa">
                <span className="p">1T</span>
                <span>00:00</span>
              </div>
              <div className="corpo">
                <div className="bloco" style={{ background: '#008F3D', borderLeft: '4px solid #006b2d' }}>
                  <span>PAL</span><span className="g">0</span>
                </div>
                <div className="sep">×</div>
                <div className="bloco" style={{ background: '#252525', borderRight: '4px solid #1a1a1a' }}>
                  <span className="g">0</span><span>BOT</span>
                </div>
              </div>
            </CardPreview>
            <CardAcoes>
              <Botao to="/placar-broadcast" className="primario">
                Abrir Broadcast
              </Botao>
              <Botao to="/placar-broadcast/controle" className="secundario">
                Controlar
              </Botao>
            </CardAcoes>
          </Card>

          <Card className="breve">
            <CardIcone>🏀</CardIcone>
            <CardTitulo>BASQUETE</CardTitulo>
            <CardDescricao>
              Placar de basquete com pontos, faltas e posse de bola. Em breve.
            </CardDescricao>
          </Card>

          <Card className="breve">
            <CardIcone>🏐</CardIcone>
            <CardTitulo>VÔLEI</CardTitulo>
            <CardDescricao>
              Placar de vôlei com sets e pontos por set. Em breve.
            </CardDescricao>
          </Card>
        </Grade>
      </Conteudo>
      <Rodape>
        PELOTENSE ESPORTES © {new Date().getFullYear()} — SISTEMA DE PLACARES AO
        VIVO
      </Rodape>
    </Container>
  );
}

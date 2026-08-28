import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Hub from './pages/Hub';
import LandingPage from './pages/LandingPage';
import PlacarBroadcast from './pages/PlacarBroadcast';
import ControlePlacarBroadcast from './pages/ControlePlacarBroadcast';
import PlacarBroadcastEscalacao from './pages/PlacarBroadcastEscalacao';
import ControlePlacarBroadcastEscalacao from './pages/ControlePlacarBroadcastEscalacao';
import PlacarBroadcastPL from './pages/PlacarBroadcastPL';
import ControlePlacarBroadcastPL from './pages/ControlePlacarBroadcastPL';
import PlacarBroadcastBL from './pages/PlacarBroadcastBL';
import ControlePlacarBroadcastBL from './pages/ControlePlacarBroadcastBL';
import PlacarBroadcastLL from './pages/PlacarBroadcastLL';
import ControlePlacarBroadcastLL from './pages/ControlePlacarBroadcastLL';
import PlacarNormal from './pages/PlacarNormal';
import ControlePlacarNormal from './pages/ControlePlacarNormal';
import PlacarModel from './pages/PlacarModel';
import ControlePlacarModel from './pages/ControlePlacarModel';
import PreJogo from './pages/PreJogo';
import ControlePreJogo from './pages/ControlePreJogo';
import Tabela from './pages/Tabela';
import ControleTabela from './pages/ControleTabela';
import TabelaCompacta from './pages/TabelaCompacta';
import ControleTabelaCompacta from './pages/ControleTabelaCompacta';
import MataMata from './pages/MataMata';
import ControleMataMata from './pages/ControleMataMata';
import FasesFinais from './pages/FasesFinais';
import Substituicao from './pages/Substituicao';
import ControleSubstituicao from './pages/ControleSubstituicao';
import Penaltis from './pages/Penaltis';
import ControlePenaltis from './pages/ControlePenaltis';
import Escalacao from './pages/Escalacao';
import ControleEscalacao from './pages/ControleEscalacao';
import UltimaRodada from './pages/UltimaRodada';
import ControleUltimaRodada from './pages/ControleUltimaRodada';
import Artilheiros from './pages/Artilheiros';
import ControleArtilheiros from './pages/ControleArtilheiros';
import ProximasRodadas from './pages/ProximasRodadas';
import ControleProximasRodadas from './pages/ControleProximasRodadas';
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/placar-broadcast" element={<PlacarBroadcast />} />
          <Route
            path="/placar-broadcast/controle"
            element={<ControlePlacarBroadcast />}
          />
          <Route
            path="/placar-broadcast-escalacao"
            element={<PlacarBroadcastEscalacao />}
          />
          <Route
            path="/placar-broadcast-escalacao/controle"
            element={<ControlePlacarBroadcastEscalacao />}
          />
          <Route path="/placar-pl" element={<PlacarBroadcastPL />} />
          <Route
            path="/placar-pl/controle"
            element={<ControlePlacarBroadcastPL />}
          />
          <Route path="/placar-bl" element={<PlacarBroadcastBL />} />
          <Route
            path="/placar-bl/controle"
            element={<ControlePlacarBroadcastBL />}
          />
          <Route path="/placar-ll" element={<PlacarBroadcastLL />} />
          <Route
            path="/placar-ll/controle"
            element={<ControlePlacarBroadcastLL />}
          />
          <Route path="/placar-normal" element={<PlacarNormal />} />
          <Route
            path="/placar-normal/controle"
            element={<ControlePlacarNormal />}
          />
          <Route path="/placar-model" element={<PlacarModel />} />
          <Route
            path="/placar-model/controle"
            element={<ControlePlacarModel />}
          />
          <Route path="/tabela" element={<Tabela />} />
          <Route path="/tabela/controle" element={<ControleTabela />} />
          <Route path="/tabela-compacta" element={<TabelaCompacta />} />
          <Route
            path="/tabela-compacta/controle"
            element={<ControleTabelaCompacta />}
          />
          <Route path="/mata-mata" element={<MataMata />} />
          <Route path="/mata-mata/controle" element={<ControleMataMata />} />
          <Route path="/fases-finais" element={<FasesFinais />} />
          <Route path="/substituicao" element={<Substituicao />} />
          <Route
            path="/substituicao/controle"
            element={<ControleSubstituicao />}
          />
          <Route path="/penaltis" element={<Penaltis />} />
          <Route path="/penaltis/controle" element={<ControlePenaltis />} />
          <Route path="/escalacao" element={<Escalacao />} />
          <Route path="/escalacao/controle" element={<ControleEscalacao />} />
          <Route path="/ultima-rodada" element={<UltimaRodada />} />
          <Route
            path="/ultima-rodada/controle"
            element={<ControleUltimaRodada />}
          />
          <Route path="/artilheiros" element={<Artilheiros />} />
          <Route
            path="/artilheiros/controle"
            element={<ControleArtilheiros />}
          />
          <Route path="/proximas-rodadas" element={<ProximasRodadas />} />
          <Route
            path="/proximas-rodadas/controle"
            element={<ControleProximasRodadas />}
          />
          <Route path="/pre-jogo" element={<PreJogo />} />
          <Route path="/pre-jogo/controle" element={<ControlePreJogo />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

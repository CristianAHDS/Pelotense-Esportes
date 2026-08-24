import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import { GlobalStyle } from './styles/GlobalStyle'
import Hub from './pages/Hub'
import LandingPage from './pages/LandingPage'
import PlacarBroadcast from './pages/PlacarBroadcast'
import ControlePlacarBroadcast from './pages/ControlePlacarBroadcast'
import PlacarBroadcastPL from './pages/PlacarBroadcastPL'
import ControlePlacarBroadcastPL from './pages/ControlePlacarBroadcastPL'
import PlacarBroadcastBL from './pages/PlacarBroadcastBL'
import ControlePlacarBroadcastBL from './pages/ControlePlacarBroadcastBL'
import PlacarBroadcastLL from './pages/PlacarBroadcastLL'
import ControlePlacarBroadcastLL from './pages/ControlePlacarBroadcastLL'
import Tabela from './pages/Tabela'
import ControleTabela from './pages/ControleTabela'
import MataMata from './pages/MataMata'
import ControleMataMata from './pages/ControleMataMata'
import FasesFinais from './pages/FasesFinais'
import Substituicao from './pages/Substituicao'
import ControleSubstituicao from './pages/ControleSubstituicao'
import Penaltis from './pages/Penaltis'
import ControlePenaltis from './pages/ControlePenaltis'
import Escalacao from './pages/Escalacao'
import ControleEscalacao from './pages/ControleEscalacao'
import UltimaRodada from './pages/UltimaRodada'
import ControleUltimaRodada from './pages/ControleUltimaRodada'
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/placar-broadcast" element={<PlacarBroadcast />} />
          <Route path="/placar-broadcast/controle" element={<ControlePlacarBroadcast />} />
          <Route path="/placar-pl" element={<PlacarBroadcastPL />} />
          <Route path="/placar-pl/controle" element={<ControlePlacarBroadcastPL />} />
          <Route path="/placar-bl" element={<PlacarBroadcastBL />} />
          <Route path="/placar-bl/controle" element={<ControlePlacarBroadcastBL />} />
          <Route path="/placar-ll" element={<PlacarBroadcastLL />} />
          <Route path="/placar-ll/controle" element={<ControlePlacarBroadcastLL />} />
          <Route path="/tabela" element={<Tabela />} />
          <Route path="/tabela/controle" element={<ControleTabela />} />
          <Route path="/mata-mata" element={<MataMata />} />
          <Route path="/mata-mata/controle" element={<ControleMataMata />} />
          <Route path="/fases-finais" element={<FasesFinais />} />
          <Route path="/substituicao" element={<Substituicao />} />
          <Route path="/substituicao/controle" element={<ControleSubstituicao />} />
          <Route path="/penaltis" element={<Penaltis />} />
          <Route path="/penaltis/controle" element={<ControlePenaltis />} />
          <Route path="/escalacao" element={<Escalacao />} />
          <Route path="/escalacao/controle" element={<ControleEscalacao />} />
          <Route path="/ultima-rodada" element={<UltimaRodada />} />
          <Route path="/ultima-rodada/controle" element={<ControleUltimaRodada />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

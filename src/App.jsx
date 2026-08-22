import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import { GlobalStyle } from './styles/GlobalStyle'
import Hub from './pages/Hub'
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
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Hub />} />
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
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}

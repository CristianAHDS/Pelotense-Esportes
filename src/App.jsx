import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import { GlobalStyle } from './styles/GlobalStyle'
import Hub from './pages/Hub'
import PlacarBroadcast from './pages/PlacarBroadcast'
import ControlePlacarBroadcast from './pages/ControlePlacarBroadcast'
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/placar-broadcast" element={<PlacarBroadcast />} />
          <Route path="/placar-broadcast/controle" element={<ControlePlacarBroadcast />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import GeneratorPage from './pages/GeneratorPage'
import DashboardPage from './pages/DashboardPage'
import StatsPage from './pages/StatsPage'
import WorldMapPage from './pages/WorldMapPage'
import { SeasonProvider } from './context/SeasonContext'

export default function App() {
  return (
    <SeasonProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<GeneratorPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/stats/world-map" element={<WorldMapPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SeasonProvider>
  )
}

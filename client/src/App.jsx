import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import GeneratorPage from './pages/GeneratorPage'
import DashboardPage from './pages/DashboardPage'
import StatsPage from './pages/StatsPage'
import WorldMapPage from './pages/WorldMapPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { SeasonProvider } from './context/SeasonContext'

export default function App() {
  return (
    <SeasonProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/travel" element={<GeneratorPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/stats/world-map" element={<WorldMapPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </SeasonProvider>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import GeneratorPage from './pages/GeneratorPage'
import DestinationResultPage from './pages/DestinationResultPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import StatsPage from './pages/StatsPage'
import WorldMapPage from './pages/WorldMapPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { SeasonProvider } from './context/SeasonContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <SeasonProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/travel" element={<GeneratorPage />} />
              <Route path="/travel/result" element={<DestinationResultPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/stats/world-map" element={<WorldMapPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </SeasonProvider>
    </AuthProvider>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoadingSpinner from './components/ui/LoadingSpinner'
import LoginPage  from './pages/LoginPage'
import Dashboard  from './pages/Dashboard'
import Rankings   from './pages/Rankings'
import Analytics  from './pages/Analytics'
import Settings   from './pages/Settings'

export default function App() {
  const { isLoading } = useAuth0()

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/"          element={<Dashboard />} />
                <Route path="/rankings"  element={<Rankings />}  />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings"  element={<Settings />}  />
                <Route path="*"          element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

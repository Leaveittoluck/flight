import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Renders children only when the authenticated user has one of the allowed roles.
 * Redirects to /login if unauthenticated, or to / if the role doesn't match.
 *
 * Usage:
 *   <RequireRole role="admin">
 *     <AdminPage />
 *   </RequireRole>
 *
 *   <RequireRole role={['admin', 'moderator']}>
 *     <ModPage />
 *   </RequireRole>
 */
export default function RequireRole({ role, children }) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  const allowed = Array.isArray(role) ? role : [role]
  if (!allowed.includes(user.role)) return <Navigate to="/" replace />

  return children
}

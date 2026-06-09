import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Mirrors the server-side PLAN_ORDER for client-side hierarchy checks.
const PLAN_ORDER = ['free', 'pro', 'adventurer']

/**
 * Renders children only when the authenticated user's plan meets the minimum tier.
 * Plan hierarchy: free < pro < adventurer.
 * A user on 'adventurer' satisfies minimumPlan="pro".
 *
 * Redirects to /login if unauthenticated, or to / if the plan is insufficient.
 *
 * Usage:
 *   <RequirePlan minimumPlan="pro">
 *     <ProFeature />
 *   </RequirePlan>
 */
export default function RequirePlan({ minimumPlan, children }) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  const userIndex = PLAN_ORDER.indexOf(user.plan)
  const minIndex  = PLAN_ORDER.indexOf(minimumPlan)
  if (userIndex < minIndex) return <Navigate to="/" replace />

  return children
}

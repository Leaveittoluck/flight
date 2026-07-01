import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Mirrors the server-side PLAN_ORDER for client-side hierarchy checks.
// 'explorer' sits between free and the legacy paid tiers so a minimumPlan="explorer"
// check also admits legacy pro/adventurer users.
const PLAN_ORDER = ['free', 'explorer', 'pro', 'adventurer']

/**
 * Renders children only when the authenticated user's plan meets the minimum tier.
 * Plan hierarchy: free < explorer < pro < adventurer (pro/adventurer are legacy).
 * A user on 'pro' or 'adventurer' satisfies minimumPlan="explorer".
 *
 * Redirects to /login if unauthenticated, or to / if the plan is insufficient.
 *
 * Usage:
 *   <RequirePlan minimumPlan="explorer">
 *     <ExplorerFeature />
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

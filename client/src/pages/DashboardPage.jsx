import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProfile } from '../services/profileApi'
import { fetchUsage } from '../services/usageApi'
import { fetchDiscoveries } from '../services/discoveriesApi'

const PLAN_LABELS = {
  free:       { label: 'Free',       className: 'bg-blue-100 text-blue-700' },
  pro:        { label: 'Pro',        className: 'bg-violet-100 text-violet-700' },
  adventurer: { label: 'Adventurer', className: 'bg-amber-100 text-amber-700' },
}

function DashboardCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  )
}

function CardLabel({ children }) {
  return (
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  )
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatLabel(slug) {
  if (!slug) return ''
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
}

function calcFavoriteTripType(discoveries) {
  if (!discoveries?.length) return null
  const counts = {}
  for (const d of discoveries) {
    if (d.trip_type) counts[d.trip_type] = (counts[d.trip_type] ?? 0) + 1
  }
  const entries = Object.entries(counts)
  if (!entries.length) return null
  return entries.reduce((best, curr) => (curr[1] > best[1] ? curr : best))[0]
}

export default function DashboardPage() {
  const [profile,     setProfile]     = useState(null)
  const [usage,       setUsage]       = useState(null)
  const [discoveries, setDiscoveries] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [profileErr,  setProfileErr]  = useState(false)

  useEffect(() => {
    const profileReq = fetchProfile()
      .then(setProfile)
      .catch(() => setProfileErr(true))

    const usageReq = fetchUsage()
      .then(setUsage)
      .catch(() => {})

    const discoReq = fetchDiscoveries()
      .then(setDiscoveries)
      .catch(() => {})

    Promise.all([profileReq, usageReq, discoReq]).finally(() => setLoading(false))
  }, [])

  const planConfig = profile
    ? (PLAN_LABELS[profile.plan] ?? { label: profile.plan, className: 'bg-slate-100 text-slate-600' })
    : null

  const recentDiscoveries = discoveries?.slice(0, 3) ?? []
  const favoriteTripType  = calcFavoriteTripType(discoveries)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {profile
              ? <>Welcome back, <span className="font-semibold text-slate-700">{profile.display_name}</span></>
              : 'Your plan, usage, and discoveries'}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">

        {/* Loading */}
        {loading && (
          <DashboardCard>
            <p className="text-sm text-slate-400">Loading dashboard…</p>
          </DashboardCard>
        )}

        {/* Profile fetch failed entirely */}
        {!loading && profileErr && !profile && (
          <DashboardCard>
            <p className="text-sm text-red-500">
              Could not load dashboard data. Please refresh the page.
            </p>
          </DashboardCard>
        )}

        {/* ── Stats grid ── */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            <DashboardCard>
              <CardLabel>Discoveries</CardLabel>
              <p className="text-3xl font-extrabold text-slate-900">
                {discoveries !== null ? discoveries.length : '—'}
              </p>
              <p className="text-xs text-slate-400 mt-1">total generated</p>
            </DashboardCard>

            <DashboardCard>
              <CardLabel>Plan</CardLabel>
              {planConfig ? (
                <>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${planConfig.className}`}>
                    {planConfig.label}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">current plan</p>
                </>
              ) : (
                <p className="text-3xl font-extrabold text-slate-900">—</p>
              )}
            </DashboardCard>

            <DashboardCard>
              <CardLabel>Clicks used</CardLabel>
              <p className="text-3xl font-extrabold text-slate-900">
                {usage !== null ? usage.clicksUsed : '—'}
              </p>
              <p className="text-xs text-slate-400 mt-1">this month</p>
            </DashboardCard>

            <DashboardCard>
              <CardLabel>Remaining</CardLabel>
              <p className="text-3xl font-extrabold text-slate-900">
                {usage === null
                  ? '—'
                  : usage.clicksRemaining === null
                    ? '∞'
                    : usage.clicksRemaining}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {usage?.clicksRemaining === null ? 'unlimited' : 'clicks left'}
              </p>
            </DashboardCard>

          </div>
        )}

        {/* ── Recent discoveries ── */}
        {!loading && (
          <DashboardCard>
            <div className="flex items-center justify-between mb-3">
              <CardLabel>Recent discoveries</CardLabel>
              {discoveries !== null && discoveries.length > 0 && (
                <Link
                  to="/discoveries"
                  className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  View all →
                </Link>
              )}
            </div>

            {/* Empty state */}
            {(discoveries === null || discoveries.length === 0) && (
              <div className="py-8 text-center">
                <p
                  className="text-3xl mb-3 font-black"
                  style={{ color: 'rgba(234,88,12,0.2)' }}
                >
                  ✦
                </p>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  No discoveries yet
                </p>
                <p className="text-sm text-slate-400 mb-5">
                  Your discoveries will appear here once you generate your first destination.
                </p>
                <Link
                  to="/travel"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #ea580c, #f97316)',
                    boxShadow: '0 3px 12px rgba(234,88,12,0.25)',
                  }}
                >
                  Leave It To Luck ✦
                </Link>
              </div>
            )}

            {/* List — latest 3 */}
            {recentDiscoveries.length > 0 && (
              <div className="divide-y divide-slate-100">
                {recentDiscoveries.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 leading-tight">
                        {item.city}
                        {item.city && item.country && (
                          <span className="text-slate-400 font-normal">, </span>
                        )}
                        <span className="font-semibold text-slate-600">{item.country}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                        {item.trip_type && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{
                              backgroundColor: 'rgba(249,115,22,0.1)',
                              color: '#ea580c',
                              border: '1px solid rgba(249,115,22,0.2)',
                            }}
                          >
                            {formatLabel(item.trip_type)}
                          </span>
                        )}
                        {item.season && (
                          <span className="text-xs text-slate-400">
                            {formatLabel(item.season)}
                          </span>
                        )}
                        {item.travellers && (
                          <span className="text-xs text-slate-400">
                            {item.travellers} traveller{item.travellers !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 shrink-0 pt-0.5 tabular-nums whitespace-nowrap">
                      {formatDate(item.generated_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        )}

        {/* ── Favourite trip type ── */}
        {!loading && (
          <DashboardCard>
            <CardLabel>Favourite trip type</CardLabel>
            {favoriteTripType ? (
              <>
                <p className="text-xl font-bold text-slate-900">
                  {formatLabel(favoriteTripType)}
                </p>
                <p className="text-xs text-slate-400 mt-1.5">
                  Based on {discoveries.length} discover{discoveries.length === 1 ? 'y' : 'ies'}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400">Not enough data yet.</p>
            )}
          </DashboardCard>
        )}

      </main>
    </div>
  )
}

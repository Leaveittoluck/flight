import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchProfile, patchProfile } from '../services/profileApi'
import { fetchUsage } from '../services/usageApi'

const PLAN_LABELS = {
  free:       { label: 'Free',            className: 'bg-blue-100 text-blue-700' },
  explorer:   { label: 'Explorer Member', className: 'bg-amber-100 text-amber-700' },
  pro:        { label: 'Explorer Member', className: 'bg-amber-100 text-amber-700' }, // legacy
  adventurer: { label: 'Explorer Member', className: 'bg-amber-100 text-amber-700' }, // legacy
}

function DashboardCard({ children, className = '' }) {
  return (
    <div className={`litl-card ${className}`}>
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

function formatMemberSince(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
}

export default function ProfilePage() {
  const { setUser } = useAuth()

  const [profile, setProfile]       = useState(null)
  const [usage, setUsage]           = useState(null)
  const [loading, setLoading]       = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const [editing, setEditing]     = useState(false)
  const [editName, setEditName]   = useState('')
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    const profileReq = fetchProfile()
      .then((data) => {
        setProfile(data)
        setEditName(data.display_name)
      })
      .catch(() => setFetchError('Could not load profile. Please try again.'))

    const usageReq = fetchUsage()
      .then(setUsage)
      .catch(() => {}) // usage silently fails — profile still renders

    Promise.all([profileReq, usageReq]).finally(() => setLoading(false))
  }, [])

  function startEditing() {
    setSaveError(null)
    setEditName(profile.display_name)
    setEditing(true)
  }

  function cancelEditing() {
    setEditing(false)
    setSaveError(null)
  }

  async function handleSave() {
    const trimmed = editName.trim()
    if (!trimmed) {
      setSaveError('Name cannot be empty.')
      return
    }
    if (trimmed.length > 100) {
      setSaveError('Name must be 100 characters or fewer.')
      return
    }
    if (trimmed === profile.display_name) {
      setEditing(false)
      return
    }

    setSaving(true)
    setSaveError(null)
    try {
      const updated = await patchProfile({ display_name: trimmed })
      setProfile(updated)
      setUser((prev) => ({ ...prev, display_name: updated.display_name }))
      setEditing(false)
    } catch (err) {
      setSaveError(err?.response?.data?.message ?? 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const planConfig = profile
    ? (PLAN_LABELS[profile.plan] ?? { label: profile.plan, className: 'bg-slate-100 text-slate-600' })
    : null

  const usagePercent = usage?.clicksLimit
    ? Math.min(100, Math.round((usage.clicksUsed / usage.clicksLimit) * 100))
    : 0

  return (
    <div className="min-h-screen">
      <header className="litl-page-header">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your account details</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        {loading && (
          <DashboardCard>
            <p className="text-sm text-slate-400">Loading profile…</p>
          </DashboardCard>
        )}

        {!loading && fetchError && (
          <DashboardCard>
            <p className="text-sm text-red-500">{fetchError}</p>
          </DashboardCard>
        )}

        {/* ── Account card ── */}
        {!loading && profile && (
          <DashboardCard>
            <CardLabel>Account</CardLabel>
            <div className="flex items-start gap-5">
              {/* Avatar */}
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-slate-400">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Display name */}
                <div>
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave()
                          if (e.key === 'Escape') cancelEditing()
                        }}
                        maxLength={100}
                        autoFocus
                        className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      />
                      {saveError && (
                        <p className="text-xs text-red-500">{saveError}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-200 disabled:opacity-50"
                          style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
                        >
                          {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900 truncate">
                        {profile.display_name}
                      </span>
                      <button
                        onClick={startEditing}
                        className="text-xs font-semibold text-stone-400 hover:text-orange-600 transition-colors duration-200 shrink-0"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <p className="text-sm text-slate-500">{profile.email}</p>

                {/* Plan badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${planConfig.className}`}
                >
                  {planConfig.label} plan
                </span>

                {/* Member since */}
                <p className="text-xs text-slate-400">
                  Member since {formatMemberSince(profile.created_at)}
                </p>
              </div>
            </div>
          </DashboardCard>
        )}

        {/* ── Usage card ── */}
        {!loading && usage && (
          <DashboardCard>
            <CardLabel>Monthly usage</CardLabel>

            <div className="flex items-end gap-8">
              <div>
                <p className="text-xs text-slate-500 mb-1">Clicks used</p>
                <p className="text-2xl font-extrabold text-slate-900">{usage.clicksUsed}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Remaining</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  {usage.clicksRemaining === null ? '∞' : usage.clicksRemaining}
                </p>
              </div>

              {usage.clicksLimit !== null && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Limit</p>
                  <p className="text-2xl font-extrabold text-slate-400">{usage.clicksLimit}</p>
                </div>
              )}
            </div>

            {/* Progress bar — only for plans with a limit */}
            {usage.clicksLimit !== null && (
              <div className="mt-4">
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${usagePercent}%`,
                      background: usagePercent >= 100
                        ? 'linear-gradient(90deg, #ea580c, #f97316)'
                        : 'linear-gradient(90deg, #f97316, #fb923c)',
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {usage.clicksUsed} / {usage.clicksLimit} clicks this month
                </p>
              </div>
            )}

            {usage.clicksRemaining === null && (
              <p className="text-xs text-slate-400 mt-3">
                Unlimited clicks on your plan
              </p>
            )}
          </DashboardCard>
        )}
      </main>
    </div>
  )
}

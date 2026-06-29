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

// Matches PLAN_LIMITS in server/src/constants/auth.js — kept in sync manually
// since there is no public "plan catalog" endpoint yet.
const PLAN_BENEFITS = [
  { key: 'free',       label: 'Free',       clicks: '5 clicks / month' },
  { key: 'pro',        label: 'Pro',        clicks: '50 clicks / month' },
  { key: 'adventurer', label: 'Adventurer', clicks: 'Unlimited clicks' },
]

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'travel',   label: 'Travel' },
  { id: 'rewards',  label: 'Rewards' },
  { id: 'growth',   label: 'Growth' },
  { id: 'history',  label: 'History' },
]

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

function SummaryItem({ label, value }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
  )
}

function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-400 border border-slate-200">
      Coming soon
    </span>
  )
}

function GroupHeading({ children, subtitle }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide">{children}</h2>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  )
}

// Compact jump-to-section nav. Plain anchor links (graceful no-JS fallback,
// keyboard/right-click friendly) with a click handler that does the smooth
// scroll itself, so it can also track which pill to highlight.
//
// Sticky positioning only holds an element within its own parent's box, so
// this must render as a direct sibling of the 5 <section> elements (not
// nested inside one of them) — otherwise it would unstick the moment the
// user scrolls past whichever section it lived in. top-16 matches the site
// Navbar's h-16 exactly, so it docks directly below it with no gap/overlap.
function SectionNav({ activeSection, onNavigate }) {
  return (
    <nav
      aria-label="Account Center sections"
      className="sticky top-16 z-30 flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm p-2 -mx-1 px-1 sm:mx-0 sm:px-2"
    >
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          onClick={(e) => onNavigate(e, section.id)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
            activeSection === section.id
              ? 'bg-orange-100 text-orange-700 border-orange-200'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          {section.label}
        </a>
      ))}
    </nav>
  )
}

// Looks and behaves like a normal button — opens an informational modal
// instead of being disabled, so the interaction feels intentional rather
// than broken. No backend call, no routing.
function InfoButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
    >
      {children}
    </button>
  )
}

function InfoModal({ modal, onClose }) {
  useEffect(() => {
    if (!modal) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [modal, onClose])

  if (!modal) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-slate-900 mb-2">{modal.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-5">{modal.body}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

const MODAL_COPY = {
  subscription: {
    title: 'Coming Soon',
    body: "Subscription plans are currently in development. You'll be able to upgrade your account once payments launch.",
  },
  referral: {
    title: 'Coming Soon',
    body: "Referral rewards are currently in development. You'll be able to invite friends and earn rewards once this launches.",
  },
  rewards: {
    title: 'Coming Soon',
    body: "Redeeming coins for discounts is currently in development. You'll be able to redeem your balance once the rewards system launches.",
  },
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

function calcCountriesExplored(discoveries) {
  if (!discoveries?.length) return 0
  return new Set(discoveries.map((d) => d.country).filter(Boolean)).size
}

function getFirstName(displayName) {
  if (!displayName) return null
  return displayName.trim().split(/\s+/)[0]
}

function formatMemberSince(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
}

// Ordered by what's most useful to surface right now: onboarding nudge for
// brand-new users outranks plan-tier messaging, then usage urgency, then a
// general recap. Falls back to a neutral line while data is still loading.
function getTravelMessage({ discoveries, usage }) {
  if (discoveries === null || usage === null) {
    return "Here's an overview of your travel journey."
  }
  if (discoveries.length === 0) {
    return "Let's discover your first destination."
  }
  if (usage.clicksRemaining === 0) {
    return "You've used all your destination generations this month."
  }
  if (usage.clicksRemaining === 1) {
    return 'Only one destination generation remaining this month.'
  }
  if (usage.clicksRemaining === null) {
    return 'Enjoy unlimited destination discoveries.'
  }
  return `You've already discovered ${discoveries.length} destination${discoveries.length === 1 ? '' : 's'}.`
}

export default function DashboardPage() {
  const [profile,     setProfile]     = useState(null)
  const [usage,       setUsage]       = useState(null)
  const [discoveries, setDiscoveries] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [profileErr,  setProfileErr]  = useState(false)
  const [modal,       setModal]       = useState(null)
  const [activeSection, setActiveSection] = useState('overview')

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

  const recentDiscoveries  = discoveries?.slice(0, 3) ?? []
  const favoriteTripType   = calcFavoriteTripType(discoveries)
  const countriesExplored  = calcCountriesExplored(discoveries)

  const usagePercent = usage?.clicksLimit
    ? Math.min(100, Math.round((usage.clicksUsed / usage.clicksLimit) * 100))
    : 0

  const canUpgrade = profile && profile.plan !== 'adventurer'

  const greetingName  = getFirstName(profile?.display_name)
  const travelMessage = getTravelMessage({ discoveries, usage })
  const memberSince    = formatMemberSince(profile?.created_at)

  function openModal(key) {
    setModal(MODAL_COPY[key])
  }
  function closeModal() {
    setModal(null)
  }

  function scrollToSection(e, id) {
    e.preventDefault()
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {greetingName ?? 'Traveller'} <span aria-hidden="true">👋</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">{travelMessage}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-12">

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

        {!loading && (
          <>
            {/* ── Quick account summary ── */}
            <DashboardCard>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <SummaryItem label="Current plan" value={planConfig?.label ?? '—'} />
                <SummaryItem
                  label="Generations left"
                  value={usage === null ? '—' : usage.clicksRemaining === null ? '∞' : usage.clicksRemaining}
                />
                <SummaryItem
                  label="Total discoveries"
                  value={discoveries !== null ? discoveries.length : '—'}
                />
                <SummaryItem label="Member since" value={memberSince ?? '—'} />
              </div>
            </DashboardCard>

            {/*
              Jump-to-section nav — rendered as a sibling of the 5 <section>
              elements below (not nested inside one), so its sticky containing
              block spans the whole page and it stays docked through Travel /
              Rewards / Growth / History too, not just within Overview.
            */}
            <SectionNav activeSection={activeSection} onNavigate={scrollToSection} />

            {/* ══════════════ 1. Overview ══════════════ */}
            <section id="overview" className="space-y-4 scroll-mt-32">
              <GroupHeading subtitle="Your current plan, usage, and account status">
                Overview
              </GroupHeading>

              {/* ── Click usage detail ── */}
              <DashboardCard>
                <div className="flex items-center justify-between mb-3">
                  <CardLabel>Click usage</CardLabel>
                  {usage?.clicksLimit != null && (
                    <span className="text-xs text-slate-400 tabular-nums">
                      {usage.clicksUsed} / {usage.clicksLimit} this month
                    </span>
                  )}
                </div>

                {usage?.clicksLimit != null && (
                  <>
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
                    <p className="text-xs text-slate-400 mt-2">
                      The {planConfig?.label ?? 'Free'} plan includes {usage.clicksLimit} destination clicks
                      per month. Usage resets {formatDate(usage.resetDate)}.
                    </p>
                  </>
                )}

                {usage && usage.clicksLimit === null && (
                  <p className="text-sm text-slate-500">
                    Unlimited clicks on your plan — explore freely.
                  </p>
                )}

                {usage === null && (
                  <p className="text-sm text-slate-400">Usage data is unavailable right now.</p>
                )}

                {canUpgrade && usage?.clicksLimit != null && (
                  <div className="mt-4">
                    <InfoButton onClick={() => openModal('subscription')}>
                      Upgrade for more clicks
                    </InfoButton>
                  </div>
                )}
              </DashboardCard>

              {/* ── Subscription status ── */}
              <DashboardCard>
                <CardLabel>Subscription</CardLabel>

                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${planConfig?.className ?? 'bg-blue-100 text-blue-700'}`}>
                    {planConfig?.label ?? 'Free'} plan
                  </span>
                  <span className="text-xs text-slate-400">
                    {usage?.clicksLimit == null ? 'Unlimited clicks' : `${usage.clicksLimit} clicks / month`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PLAN_BENEFITS.map((plan) => {
                    const isCurrent = profile?.plan === plan.key
                    return (
                      <div
                        key={plan.key}
                        className={`rounded-xl border p-4 ${
                          isCurrent ? 'border-orange-300 bg-orange-50' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-900">{plan.label}</p>
                          {isCurrent && (
                            <span className="text-[10px] font-bold uppercase tracking-wide text-orange-600">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{plan.clicks}</p>
                      </div>
                    )
                  })}
                </div>

                {canUpgrade && (
                  <div className="mt-4">
                    <InfoButton onClick={() => openModal('subscription')}>
                      Upgrade plan
                    </InfoButton>
                  </div>
                )}
              </DashboardCard>
            </section>

            {/* ══════════════ 2. Travel ══════════════ */}
            <section id="travel" className="space-y-4 scroll-mt-32">
              <GroupHeading subtitle="Where you've explored so far">
                Travel
              </GroupHeading>

              {/* ── Travel statistics ── */}
              <DashboardCard>
                <CardLabel>Travel statistics</CardLabel>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">
                      {discoveries !== null ? discoveries.length : '—'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">destinations discovered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">
                      {discoveries !== null ? countriesExplored : '—'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">countries explored</p>
                  </div>
                </div>
              </DashboardCard>

              {/* ── Recent discoveries ── */}
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

              {/* ── Favourite trip type ── */}
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
            </section>

            {/* ══════════════ 3. Rewards ══════════════ */}
            <section id="rewards" className="space-y-4 scroll-mt-32">
              <GroupHeading subtitle="Your future coins and perks">
                Rewards
              </GroupHeading>

              {/* ── Coin balance / reward progress / expiry (placeholder) ── */}
              <DashboardCard className="border-dashed bg-slate-50/60">
                <div className="flex items-center justify-between mb-3">
                  <CardLabel>Coin balance</CardLabel>
                  <ComingSoonBadge />
                </div>

                <p className="text-2xl font-extrabold text-slate-300 mb-1">0 coins</p>
                <p className="text-sm text-slate-400 mb-4">
                  No coins yet. You'll earn coins for bookings and referrals once the rewards
                  system launches.
                </p>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Reward progress
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-bold text-slate-500">50 coins</p>
                    <p className="text-xs text-slate-400">Future 5% discount</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-bold text-slate-500">200 coins</p>
                    <p className="text-xs text-slate-400">Future 10% discount</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4">No expiring coins yet</p>

                <InfoButton onClick={() => openModal('rewards')}>Redeem rewards</InfoButton>
              </DashboardCard>
            </section>

            {/* ══════════════ 4. Growth ══════════════ */}
            <section id="growth" className="space-y-4 scroll-mt-32">
              <GroupHeading subtitle="Grow your travel circle">
                Growth
              </GroupHeading>

              {/* ── Referrals (placeholder) ── */}
              <DashboardCard className="border-dashed bg-slate-50/60">
                <div className="flex items-center justify-between mb-3">
                  <CardLabel>Referral program</CardLabel>
                  <ComingSoonBadge />
                </div>

                <p className="text-sm text-slate-400 mb-4">
                  Referral rewards are coming soon. Invite friends and earn rewards once this
                  launches.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value="Referral link coming soon"
                    disabled
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
                  />
                  <InfoButton onClick={() => openModal('referral')}>Copy</InfoButton>
                </div>
              </DashboardCard>
            </section>

            {/* ══════════════ 5. History ══════════════ */}
            <section id="history" className="space-y-4 scroll-mt-32">
              <GroupHeading subtitle="Your future activity record">
                History
              </GroupHeading>

              {/* ── Booking history (placeholder) ── */}
              <DashboardCard className="border-dashed bg-slate-50/60">
                <div className="flex items-center justify-between mb-3">
                  <CardLabel>Booking history</CardLabel>
                  <ComingSoonBadge />
                </div>
                <p className="text-sm text-slate-400">
                  Booking rewards will appear here after verified bookings are added. This is
                  separate from your discovery history above.
                </p>
              </DashboardCard>

              {/* ── Reward history (placeholder) ── */}
              <DashboardCard className="border-dashed bg-slate-50/60">
                <div className="flex items-center justify-between mb-3">
                  <CardLabel>Reward history</CardLabel>
                  <ComingSoonBadge />
                </div>
                <p className="text-sm text-slate-400">
                  Your coin earning and redemption history will appear here once the rewards
                  system launches.
                </p>
              </DashboardCard>
            </section>
          </>
        )}

      </main>

      <InfoModal modal={modal} onClose={closeModal} />
    </div>
  )
}

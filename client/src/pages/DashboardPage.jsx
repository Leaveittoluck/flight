import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProfile } from '../services/profileApi'
import { fetchUsage } from '../services/usageApi'
import { fetchDiscoveries } from '../services/discoveriesApi'
import { isExplorer } from '../utils/planUtils'
import Card from '../components/ui/Card'
import CardLabel from '../components/ui/CardLabel'
import EmptyState from '../components/ui/EmptyState'

const PLAN_LABELS = {
  free:       { label: 'Free',            className: 'bg-blue-100 text-blue-700' },
  explorer:   { label: 'Explorer Member', className: 'bg-amber-100 text-amber-700' },
  pro:        { label: 'Explorer Member', className: 'bg-amber-100 text-amber-700' },
  adventurer: { label: 'Explorer Member', className: 'bg-amber-100 text-amber-700' },
}

const PLAN_BENEFITS = [
  {
    key:         'free',
    label:       'Free',
    description: 'Generate destinations, save discoveries, view travel history',
  },
  {
    key:         'explorer',
    label:       'Explorer Member',
    description: 'Full destination guide, no ads, unlimited favourites',
  },
]

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'travel',   label: 'Travel' },
  { id: 'rewards',  label: 'Rewards' },
  { id: 'growth',   label: 'Growth' },
  { id: 'history',  label: 'History' },
]

// ─── Inline SVG icons for summary stat cards ───────────────────────────────

function PlanIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M8 2L9.5 6.5H14L10.5 9L11.5 13.5L8 11L4.5 13.5L5.5 9L2 6.5H6.5L8 2Z" fill="#ea580c" opacity="0.75"/>
    </svg>
  )
}

function GenIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M9 1.5L4 9h4l-1 5.5 5-7.5H8L9 1.5z" fill="#ea580c" opacity="0.75"/>
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 1a5 5 0 00-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 00-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#ea580c" opacity="0.75"/>
    </svg>
  )
}

function CalIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#ea580c" strokeWidth="1.5" opacity="0.75"/>
      <path d="M5 1.5v3M11 1.5v3M2 7h12" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" opacity="0.75"/>
    </svg>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SummaryItem({ icon, label, value }) {
  return (
    <Card variant="tertiary" className="flex flex-col gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(234,88,12,0.08)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-extrabold text-slate-900 leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
      </div>
    </Card>
  )
}

function ComingSoonBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{
        background: 'rgba(251,146,60,0.1)',
        color: '#ea580c',
        border: '1px solid rgba(251,146,60,0.2)',
      }}
    >
      <span className="text-[8px]">✦</span> Coming soon
    </span>
  )
}

function GroupHeading({ children, subtitle }) {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] font-black" style={{ color: 'rgba(234,88,12,0.35)' }}>✦</span>
        <h2 className="litl-serif text-2xl font-bold text-slate-800 italic tracking-tight">{children}</h2>
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1 ml-5">{subtitle}</p>}
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
      className="sticky top-16 z-30 flex items-center gap-1.5 overflow-x-auto rounded-2xl p-1.5 -mx-1 px-1 sm:mx-0 sm:px-1.5"
      style={{
        background: '#ffffff',
        border: '1.5px solid rgba(251,146,60,0.14)',
        boxShadow: '0 2px 12px rgba(249,115,22,0.07)',
      }}
    >
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          onClick={(e) => onNavigate(e, section.id)}
          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 ${
            activeSection === section.id
              ? 'bg-orange-100 text-orange-700'
              : 'text-slate-400 hover:bg-orange-50 hover:text-slate-700'
          }`}
        >
          {section.label}
        </a>
      ))}
    </nav>
  )
}

function InfoButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
      style={{
        background: 'linear-gradient(135deg, #ea580c, #f97316)',
        boxShadow: '0 3px 14px rgba(234,88,12,0.28)',
      }}
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
        className="litl-card-primary max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-3">
          Leave It To Luck
        </p>
        <h3 className="litl-serif text-3xl font-bold text-slate-900 italic leading-tight mb-3">
          {modal.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">{modal.body}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #ea580c, #f97316)',
            boxShadow: '0 3px 14px rgba(234,88,12,0.28)',
          }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}

const MODAL_COPY = {
  subscription: {
    title: 'Become an Explorer',
    body: 'Explorer Membership unlocks the full destination guide — hidden gems, fun facts, local recommendations, weather insights, packing tips — plus an ad-free experience. Payments are coming soon.',
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
  if (usage.generationsRemaining === null) {
    return 'Enjoy unlimited destination discoveries.'
  }
  if (usage.generationsRemaining === 0) {
    return "You've used all your destination generations this month."
  }
  if (usage.generationsRemaining === 1) {
    return 'Only one destination generation remaining this month.'
  }
  return `You've already discovered ${discoveries.length} destination${discoveries.length === 1 ? '' : 's'}.`
}

export default function DashboardPage() {
  const [profile,       setProfile]       = useState(null)
  const [usage,         setUsage]         = useState(null)
  const [discoveries,   setDiscoveries]   = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [profileErr,    setProfileErr]    = useState(false)
  const [modal,         setModal]         = useState(null)
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

  const recentDiscoveries = discoveries?.slice(0, 3) ?? []
  const favoriteTripType  = calcFavoriteTripType(discoveries)
  const countriesExplored = calcCountriesExplored(discoveries)

  const usagePercent = usage?.clicksLimit
    ? Math.min(100, Math.round((usage.clicksUsed / usage.clicksLimit) * 100))
    : 0

  const canUpgrade   = profile && !isExplorer(profile.plan)
  const greetingName = getFirstName(profile?.display_name)
  const travelMessage = getTravelMessage({ discoveries, usage })
  const memberSince   = formatMemberSince(profile?.created_at)

  function openModal(key) { setModal(MODAL_COPY[key]) }
  function closeModal()   { setModal(null) }

  function scrollToSection(e, id) {
    e.preventDefault()
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="min-h-screen">

      {/* ── Editorial header (custom — not shared PageHeader) ── */}
      <header className="litl-page-header">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-4">
            Account Center
          </p>
          <h1
            className="litl-serif font-bold text-slate-900 leading-[1.05]"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 4.5rem)' }}
          >
            Welcome back,{' '}
            <span style={{ color: '#ea580c' }}>{greetingName ?? 'Traveller'}</span>
          </h1>
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">{travelMessage}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-12">

        {/* Loading */}
        {loading && (
          <Card>
            <p className="text-sm text-slate-400">Loading dashboard…</p>
          </Card>
        )}

        {/* Profile fetch failed entirely */}
        {!loading && profileErr && !profile && (
          <Card>
            <p className="text-sm text-red-500">
              Could not load dashboard data. Please refresh the page.
            </p>
          </Card>
        )}

        {!loading && (
          <>
            {/* ── Quick account summary — 4 individual stat cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <SummaryItem
                icon={<PlanIcon />}
                label="Current plan"
                value={planConfig?.label ?? '—'}
              />
              <SummaryItem
                icon={<GenIcon />}
                label="Generations left"
                value={
                  usage === null
                    ? '—'
                    : usage.generationsRemaining === null
                      ? '∞'
                      : (usage.generationsRemaining ?? '—')
                }
              />
              <SummaryItem
                icon={<PinIcon />}
                label="Total discoveries"
                value={discoveries !== null ? discoveries.length : '—'}
              />
              <SummaryItem
                icon={<CalIcon />}
                label="Member since"
                value={memberSince ?? '—'}
              />
            </div>

            {/*
              Jump-to-section nav — rendered as a direct sibling of the 5 <section>
              elements below (not nested inside one), so its sticky containing block
              spans the whole page. top-16 matches the Navbar h-16 exactly.
            */}
            <SectionNav activeSection={activeSection} onNavigate={scrollToSection} />

            {/* ══════════════ 1. Overview ══════════════ */}
            <section id="overview" className="space-y-4 scroll-mt-32">
              <GroupHeading subtitle="Your current plan, usage, and account status">
                Overview
              </GroupHeading>

              {/* ── Click usage ── */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <CardLabel>Click usage</CardLabel>
                  {usage?.clicksLimit != null && (
                    <span className="text-xs text-slate-400 tabular-nums bg-orange-50 px-2.5 py-0.5 rounded-full font-semibold">
                      {usage.clicksUsed} / {usage.clicksLimit}
                    </span>
                  )}
                </div>

                {usage?.clicksLimit != null && (
                  <>
                    <div className="w-full bg-orange-50 rounded-full h-1.5">
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
                      Your plan includes {usage.clicksLimit} destination clicks per month.
                      Usage resets {formatDate(usage.resetDate)}.
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
                  <div className="mt-5">
                    <InfoButton onClick={() => openModal('subscription')}>
                      Become an Explorer ✦
                    </InfoButton>
                  </div>
                )}
              </Card>

              {/* ── Membership ── */}
              <Card>
                <CardLabel>Membership</CardLabel>

                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${planConfig?.className ?? 'bg-blue-100 text-blue-700'}`}
                  >
                    {planConfig?.label ?? 'Free'}
                  </span>
                  {usage?.clicksLimit == null ? (
                    <span className="text-xs text-slate-400">Ad-free · unlimited clicks</span>
                  ) : (
                    <span className="text-xs text-slate-400">{usage.clicksLimit} clicks / month</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLAN_BENEFITS.map((plan) => {
                    const isCurrent = plan.key === 'explorer'
                      ? isExplorer(profile?.plan)
                      : profile?.plan === plan.key
                    return (
                      <div
                        key={plan.key}
                        className="litl-card-sm"
                        style={isCurrent ? {
                          borderColor: 'rgba(249,115,22,0.30)',
                          background: 'rgba(255,247,237,0.6)',
                        } : {}}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-sm font-bold text-slate-900">{plan.label}</p>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">
                              ✦ Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{plan.description}</p>
                      </div>
                    )
                  })}
                </div>

                {canUpgrade && (
                  <div className="mt-5">
                    <InfoButton onClick={() => openModal('subscription')}>
                      Become an Explorer ✦
                    </InfoButton>
                  </div>
                )}
              </Card>
            </section>

            {/* ══════════════ 2. Travel ══════════════ */}
            <section id="travel" className="space-y-4 scroll-mt-32">
              <GroupHeading subtitle="Where you've explored so far">Travel</GroupHeading>

              {/* ── Travel statistics — primary feature card ── */}
              <Card variant="primary">
                <CardLabel>Travel statistics</CardLabel>
                <div className="grid grid-cols-2 gap-8 mt-4">
                  <div>
                    <p
                      className="litl-serif font-bold text-slate-900 leading-none"
                      style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}
                    >
                      {discoveries !== null ? discoveries.length : '—'}
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3">
                      destinations discovered
                    </p>
                  </div>
                  <div>
                    <p
                      className="litl-serif font-bold text-slate-900 leading-none"
                      style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}
                    >
                      {discoveries !== null ? countriesExplored : '—'}
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3">
                      countries explored
                    </p>
                  </div>
                </div>
              </Card>

              {/* ── Recent discoveries ── */}
              <Card>
                <div className="flex items-center justify-between mb-4">
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
                  <EmptyState
                    title="No discoveries yet"
                    body="Your discoveries will appear here once you generate your first destination."
                    ctaTo="/travel"
                  />
                )}

                {/* List — latest 3 */}
                {recentDiscoveries.length > 0 && (
                  <div className="divide-y divide-orange-50">
                    {recentDiscoveries.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                            style={{ background: 'rgba(234,88,12,0.08)' }}
                          >
                            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8 1a5 5 0 00-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 00-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                                fill="#ea580c"
                                opacity=".7"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 leading-tight">
                              {item.city}
                              {item.city && item.country && (
                                <span className="text-slate-400 font-normal">, </span>
                              )}
                              <span className="font-semibold text-slate-600">{item.country}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
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
                                <span className="text-xs text-slate-400">{formatLabel(item.season)}</span>
                              )}
                              {item.travellers && (
                                <span className="text-xs text-slate-400">
                                  {item.travellers} traveller{item.travellers !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 shrink-0 pt-0.5 tabular-nums whitespace-nowrap">
                          {formatDate(item.generated_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* ── Favourite trip type ── */}
              <Card>
                <CardLabel>Favourite trip type</CardLabel>
                {favoriteTripType ? (
                  <div className="flex items-end gap-3 mt-3">
                    <p className="litl-serif text-4xl font-bold text-slate-900 italic leading-none">
                      {formatLabel(favoriteTripType)}
                    </p>
                    <p className="text-xs text-slate-400 mb-0.5">
                      based on {discoveries.length} discover{discoveries.length === 1 ? 'y' : 'ies'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mt-2">Not enough data yet.</p>
                )}
              </Card>
            </section>

            {/* ══════════════ 3. Rewards ══════════════ */}
            <section id="rewards" className="space-y-4 scroll-mt-32">
              <GroupHeading subtitle="Your future coins and perks">Rewards</GroupHeading>

              <Card dashed>
                <div className="flex items-center justify-between mb-3">
                  <CardLabel>Coin balance</CardLabel>
                  <ComingSoonBadge />
                </div>

                <p
                  className="litl-serif font-bold italic leading-none mb-3"
                  style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', color: 'rgba(234,88,12,0.18)' }}
                >
                  0 coins
                </p>
                <p className="text-sm text-slate-400 mb-5">
                  No coins yet. You'll earn coins for bookings and referrals once the rewards
                  system launches.
                </p>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Reward progress
                </p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="litl-card-sm">
                    <p className="text-xs font-bold text-slate-500">50 coins</p>
                    <p className="text-xs text-slate-400">Future 5% discount</p>
                  </div>
                  <div className="litl-card-sm">
                    <p className="text-xs font-bold text-slate-500">200 coins</p>
                    <p className="text-xs text-slate-400">Future 10% discount</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5">No expiring coins yet</p>

                <InfoButton onClick={() => openModal('rewards')}>Redeem rewards</InfoButton>
              </Card>
            </section>

            {/* ══════════════ 4. Growth ══════════════ */}
            <section id="growth" className="space-y-4 scroll-mt-32">
              <GroupHeading subtitle="Grow your travel circle">Growth</GroupHeading>

              <Card dashed>
                <div className="flex items-center justify-between mb-3">
                  <CardLabel>Referral program</CardLabel>
                  <ComingSoonBadge />
                </div>

                <p className="text-sm text-slate-400 mb-5">
                  Referral rewards are coming soon. Invite friends and earn rewards once this
                  launches.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value="Referral link coming soon"
                    disabled
                    className="flex-1 rounded-lg border border-orange-100 bg-amber-50/40 px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
                  />
                  <InfoButton onClick={() => openModal('referral')}>Copy</InfoButton>
                </div>
              </Card>
            </section>

            {/* ══════════════ 5. History ══════════════ */}
            <section id="history" className="space-y-4 scroll-mt-32">
              <GroupHeading subtitle="Your future activity record">History</GroupHeading>

              <Card dashed>
                <div className="flex items-center justify-between mb-3">
                  <CardLabel>Booking history</CardLabel>
                  <ComingSoonBadge />
                </div>
                <p className="text-sm text-slate-400">
                  Booking rewards will appear here after verified bookings are added. This is
                  separate from your discovery history above.
                </p>
              </Card>

              <Card dashed>
                <div className="flex items-center justify-between mb-3">
                  <CardLabel>Reward history</CardLabel>
                  <ComingSoonBadge />
                </div>
                <p className="text-sm text-slate-400">
                  Your coin earning and redemption history will appear here once the rewards
                  system launches.
                </p>
              </Card>
            </section>
          </>
        )}

      </main>

      <InfoModal modal={modal} onClose={closeModal} />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { fetchProfile } from '../services/profileApi'
import { fetchUsage } from '../services/usageApi'
import { fetchDiscoveries } from '../services/discoveriesApi'
import { fetchDestinationImage } from '../services/imagesApi'
import { getDestinationImage } from '../data/destinationImages'
import { isExplorer } from '../utils/planUtils'
import { useAuth } from '../context/AuthContext'
import EmptyState from '../components/ui/EmptyState'

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAN_LABELS = {
  free:       { label: 'Free',            className: 'bg-blue-100 text-blue-700' },
  explorer:   { label: 'Explorer Member', className: 'bg-amber-100 text-amber-700' },
  pro:        { label: 'Explorer Member', className: 'bg-amber-100 text-amber-700' },
  adventurer: { label: 'Explorer Member', className: 'bg-amber-100 text-amber-700' },
}

const PLAN_BENEFITS = [
  { key: 'free',     label: 'Free',            description: 'Generate destinations, save discoveries, view travel history' },
  { key: 'explorer', label: 'Explorer Member', description: 'Full destination guide, no ads, unlimited favourites' },
]

const TRIP_TYPE_EMOJI = {
  beach: '😎', adventure: '🧗', cultural: '🏛️', 'city-break': '🌆',
  city: '🌆', relaxation: '😌', skiing: '⛷️', nature: '🌿',
  food: '🍜', romantic: '💕',
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

// ─── Inline SVG icons (thin outline, 1.75px stroke) ──────────────────────────

const IC = 'w-5 h-5'

function IcHome()      { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5l7-7 7 7M5 8v9a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8"/></svg> }
function IcSparkle()   { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M10 2.5l1.8 5.5H17l-4.3 3.2 1.7 5.3L10 13.5l-4.4 3 1.7-5.3L3 8h5.2L10 2.5z"/></svg> }
function IcGlobe()     { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="10" cy="10" r="7.5"/><path strokeLinecap="round" d="M2.5 10h15M10 2.5c-2 2.5-3 4.8-3 7.5s1 5 3 7.5M10 2.5c2 2.5 3 4.8 3 7.5s-1 5-3 7.5"/></svg> }
function IcBookmark()  { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M5 2h10a1 1 0 011 1v14l-6-4-6 4V3a1 1 0 011-1z"/></svg> }
function IcChart()     { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15.5h14M6 15.5V10M10 15.5V5.5M14 15.5V8.5"/></svg> }
function IcUser()      { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="10" cy="7" r="3.5"/><path strokeLinecap="round" d="M3 18c0-3.9 3.1-6 7-6s7 2.1 7 6"/></svg> }
function IcCrown()     { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M2 15.5h16M3 15.5l2-9 4 4 3-7.5 3 7.5 4-4 2 9"/></svg> }
function IcPin()       { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" d="M10 2.5A5.5 5.5 0 004.5 8c0 4.5 5.5 10 5.5 10s5.5-5.5 5.5-10A5.5 5.5 0 0010 2.5z"/><circle cx="10" cy="8" r="1.75"/></svg> }
function IcLightning() { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M11.5 2L6 11h5L9.5 18l7.5-10h-5L13 2h-1.5z"/></svg> }
function IcCalendar()  { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="2.5" y="4" width="15" height="13" rx="2"/><path strokeLinecap="round" d="M6.5 2.5v3M13.5 2.5v3M2.5 9h15"/></svg> }
function IcPlane()     { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M18 10L2 4l3 6-3 6 16-6z"/></svg> }
function IcMap()       { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><polyline strokeLinejoin="round" points="1.5,3 7,1.5 13,4 18.5,2.5 18.5,17.5 13,16 7,18.5 1.5,17"/><line x1="7" y1="1.5" x2="7" y2="18.5"/><line x1="13" y1="4" x2="13" y2="16"/></svg> }
function IcChevron()   { return <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 12l4-4-4-4"/></svg> }
function IcMenu()      { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M3 5h14M3 10h14M3 15h14"/></svg> }
function IcX()         { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M5 15L15 5M5 5l10 10"/></svg> }
function IcBell()      { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8a5 5 0 0110 0c0 3.2 1 4.5 1.5 5.2a.8.8 0 01-.65 1.3H4.15a.8.8 0 01-.65-1.3C4 12.5 5 11.2 5 8z"/><path strokeLinecap="round" d="M8.2 16.5a1.8 1.8 0 003.6 0"/></svg> }
function IcCompass()   { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l-2 5-4 1 2-5 4-1z"/></svg> }

// ─── Helper functions ─────────────────────────────────────────────────────────

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
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

function calcTripTypeMood(discoveries) {
  if (!discoveries?.length) return []
  const counts = {}
  for (const d of discoveries) {
    if (d.trip_type) counts[d.trip_type] = (counts[d.trip_type] ?? 0) + 1
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  if (!total) return []
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => ({ type, pct: Math.round((count / total) * 100) }))
}

function getFirstName(displayName) {
  if (!displayName) return null
  return displayName.trim().split(/\s+/)[0]
}

function formatMemberSince(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
}

function calcDaysExploring(dateStr) {
  if (!dateStr) return null
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  return days > 0 ? days : 1
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getTravelMessage({ discoveries, usage }) {
  if (discoveries === null || usage === null) return "Here's an overview of your travel journey."
  if (discoveries.length === 0) return "Let's discover your first destination."
  if (usage.generationsRemaining === null) return 'Enjoy unlimited destination discoveries.'
  if (usage.generationsRemaining === 0) return "You've used all your destination generations this month."
  if (usage.generationsRemaining === 1) return 'Only one destination generation remaining this month.'
  return `You've already discovered ${discoveries.length} destination${discoveries.length === 1 ? '' : 's'}.`
}

function getUserHandle(displayName) {
  if (!displayName) return ''
  return '@' + displayName.toLowerCase().replace(/\s+/g, '').substring(0, 14)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ComingSoonBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{ background: 'rgba(251,146,60,0.1)', color: '#ea580c', border: '1px solid rgba(251,146,60,0.2)' }}
    >
      <span className="text-[8px]">✦</span> Coming soon
    </span>
  )
}

function InfoButton({ children, onClick, className = '', wide = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] ${wide ? 'w-full justify-center' : ''} ${className}`}
      style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 3px 14px rgba(234,88,12,0.28)' }}
    >
      {children}
    </button>
  )
}

function InfoModal({ modal, onClose }) {
  useEffect(() => {
    if (!modal) return
    function onKeyDown(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [modal, onClose])

  if (!modal) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="litl-card-primary max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-3">Leave It To Luck</p>
        <h3 className="litl-serif text-3xl font-bold text-slate-900 italic leading-tight mb-3">{modal.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">{modal.body}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 3px 14px rgba(234,88,12,0.28)' }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}

function SidebarNavItem({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center gap-3 pl-3 pr-3 py-2.5 my-0.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
          isActive
            ? 'text-orange-700'
            : 'text-slate-500 hover:bg-orange-50/60 hover:text-slate-700'
        }`
      }
      style={({ isActive }) => isActive
        ? { background: 'linear-gradient(90deg, rgba(251,146,60,0.16), rgba(251,146,60,0.05))' }
        : {}
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full"
              style={{ background: 'linear-gradient(180deg, #ea580c, #fb923c)' }}
            />
          )}
          <Icon />
          {children}
        </>
      )}
    </NavLink>
  )
}

function StatChip({ icon: Icon, value, label, helper }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl p-5"
      style={{
        background: '#ffffff',
        border: '1.5px dashed rgba(251,146,60,0.24)',
        boxShadow: '0 1px 6px rgba(249,115,22,0.04)',
      }}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'rgba(234,88,12,0.07)', border: '1px solid rgba(234,88,12,0.12)' }}
      >
        <Icon />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-slate-900 leading-none tabular-nums">{value}</p>
        <p className="text-xs font-semibold text-slate-600 mt-1 leading-tight">{label}</p>
        {helper && <p className="text-[10px] text-slate-400 mt-0.5">{helper}</p>}
      </div>
    </div>
  )
}

function TravelMoodBar({ type, pct }) {
  const emoji = TRIP_TYPE_EMOJI[type] || '🌍'
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-sm w-5 shrink-0 text-center">{emoji}</span>
      <span className="text-xs font-medium text-slate-600 w-20 shrink-0 truncate">{formatLabel(type)}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(251,146,60,0.1)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #f97316, #fb923c)' }}
        />
      </div>
      <span className="text-xs font-bold text-slate-500 w-7 text-right tabular-nums">{pct}%</span>
    </div>
  )
}

function TravelStamp({ label }) {
  return (
    <div
      className="w-16 h-[4.5rem] rounded-md flex flex-col items-center justify-center gap-1 select-none shrink-0"
      style={{ border: '2px dashed rgba(234,88,12,0.22)', transform: 'rotate(7deg)', opacity: 0.6 }}
      aria-hidden="true"
    >
      <IcPlane />
      <span className="text-[6.5px] font-bold uppercase tracking-widest text-orange-700/70 text-center px-1 leading-tight">
        {label || 'Travel'}
      </span>
    </div>
  )
}

// ─── IconBadge helper ─────────────────────────────────────────────────────────

function IconBadge({ children }) {
  return (
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
      style={{ background: 'rgba(234,88,12,0.08)' }}
    >
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth()

  const [profile,     setProfile]     = useState(null)
  const [usage,       setUsage]       = useState(null)
  const [discoveries, setDiscoveries] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [profileErr,  setProfileErr]  = useState(false)
  const [modal,       setModal]       = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [discoveryImageUrl, setDiscoveryImageUrl] = useState(null)

  useEffect(() => {
    const profileReq = fetchProfile().then(setProfile).catch(() => setProfileErr(true))
    const usageReq   = fetchUsage().then(setUsage).catch(() => {})
    const discoReq   = fetchDiscoveries().then(setDiscoveries).catch(() => {})
    Promise.all([profileReq, usageReq, discoReq]).finally(() => setLoading(false))
  }, [])

  const recentDiscoveryId = discoveries?.[0]?.id ?? null

  useEffect(() => {
    const latest = discoveries?.[0]
    if (!latest) return
    let cancelled = false
    fetchDestinationImage(latest.city, latest.country).then((url) => {
      if (cancelled) return
      setDiscoveryImageUrl(url || getDestinationImage(latest))
    })
    return () => { cancelled = true }
  }, [recentDiscoveryId]) // eslint-disable-line react-hooks/exhaustive-deps

  const planConfig        = profile
    ? (PLAN_LABELS[profile.plan] ?? { label: profile.plan, className: 'bg-slate-100 text-slate-600' })
    : null
  const recentDiscovery   = discoveries?.[0] ?? null
  const favoriteTripType  = calcFavoriteTripType(discoveries)
  const countriesExplored = calcCountriesExplored(discoveries)
  const tripMood          = calcTripTypeMood(discoveries)
  const usagePercent      = usage?.clicksLimit
    ? Math.min(100, Math.round((usage.clicksUsed / usage.clicksLimit) * 100))
    : 0
  const canUpgrade    = profile && !isExplorer(profile.plan)
  const greetingName  = getFirstName(profile?.display_name) ?? getFirstName(user?.display_name) ?? 'Traveller'
  const travelMessage = getTravelMessage({ discoveries, usage })
  const daysExploring = calcDaysExploring(profile?.created_at)

  function openModal(key) { setModal(MODAL_COPY[key]) }
  function closeModal()   { setModal(null) }

  const displayName = profile?.display_name ?? user?.display_name ?? '—'

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{ background: '#faf8f5' }}>

      {/* ── Mobile sidebar backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-60 shrink-0 flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ background: '#ffffff', borderRight: '1px solid rgba(251,146,60,0.16)' }}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(251,146,60,0.12)' }}>
          <Link to="/" className="flex flex-col gap-1 group" onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-2">
              <span className="litl-serif text-3xl font-bold tracking-tight text-slate-900 italic">LITL</span>
              <span className="text-xl font-black" style={{ color: '#ea580c' }}>✦</span>
            </div>
            <span className="text-[10px] font-bold tracking-[0.22em] text-slate-400 uppercase">Leave It To Luck</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <SidebarNavItem to="/dashboard"      icon={IcHome}>Dashboard</SidebarNavItem>
          <SidebarNavItem to="/travel"         icon={IcSparkle}>Generate Trip</SidebarNavItem>
          <SidebarNavItem to="/stats/world-map" icon={IcGlobe}>World Map</SidebarNavItem>
          <SidebarNavItem to="/discoveries"    icon={IcBookmark}>Discoveries</SidebarNavItem>
          <SidebarNavItem to="/stats"          icon={IcChart}>Statistics</SidebarNavItem>
          <SidebarNavItem to="/profile"        icon={IcUser}>Profile</SidebarNavItem>
        </nav>

        {/* Explorer Plan card — premium travel-pass styling */}
        <div className="mx-3 mb-3">
          <div
            className="relative rounded-2xl p-4 overflow-hidden"
            style={{ background: '#fffbf5', border: '1.5px solid rgba(251,146,60,0.28)', boxShadow: '0 3px 14px rgba(249,115,22,0.09), inset 0 1px 0 rgba(255,255,255,0.9)' }}
          >
            {/* inner dashed matting — passport / boarding-pass feel */}
            <div className="absolute inset-1.5 rounded-xl pointer-events-none" style={{ border: '1px dashed rgba(251,146,60,0.22)' }} aria-hidden="true" />
            {/* corner glow */}
            <div
              className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.16) 0%, transparent 72%)' }}
              aria-hidden="true"
            />

            <div className="relative flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(234,88,12,0.12)', border: '1px solid rgba(234,88,12,0.16)' }}>
                  <IcCrown />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {loading ? '—' : (planConfig?.label ?? 'Free')}
                </span>
              </div>
              {isExplorer(profile?.plan) && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(234,88,12,0.12)', color: '#c2410c' }}
                >
                  Active
                </span>
              )}
            </div>
            <p className="relative text-[11px] text-slate-500 mb-3 leading-relaxed">
              {isExplorer(profile?.plan)
                ? 'Unlimited adventures. No ads. All features.'
                : 'Upgrade for full destination guides.'}
            </p>
            <button
              type="button"
              onClick={() => openModal('subscription')}
              className="relative w-full py-2 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 2px 10px rgba(234,88,12,0.25)' }}
            >
              {isExplorer(profile?.plan) ? 'View Membership Benefits →' : 'Become an Explorer'}
            </button>
          </div>
        </div>

        {/* Profile card */}
        <div className="mx-3 mb-3">
          <div
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl transition-colors hover:bg-orange-50/50"
            style={{ background: '#fffdf9', border: '1px solid rgba(251,146,60,0.16)' }}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-orange-200 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-orange-600">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400 truncate">{getUserHandle(displayName)}</p>
            </div>
            <span className="text-slate-300"><IcChevron /></span>
          </div>
        </div>
      </aside>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header bar */}
        <div
          className="flex items-center gap-3 px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(251,146,60,0.12)', background: '#ffffff' }}
        >
          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-700 shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <IcMenu />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="litl-serif font-bold text-slate-900 leading-none"
                style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)' }}
              >
                {getGreeting()}, <span style={{ color: '#ea580c' }}>{greetingName}</span>!
              </h1>
              <span className="text-base font-black" style={{ color: '#ea580c' }}>✦</span>
            </div>
            <p className="text-sm text-slate-400 mt-1 truncate">{travelMessage}</p>
          </div>

          <Link
            to="/travel"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white shrink-0 transition-all duration-200 hover:-translate-y-px active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 3px 14px rgba(234,88,12,0.28)' }}
          >
            <span className="text-xs opacity-80">✦</span>
            Generate New Trip
          </Link>

          <button
            type="button"
            aria-label="Notifications"
            className="relative shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 transition-all duration-200 hover:-translate-y-px hover:text-orange-600"
            style={{ background: '#fffdf9', border: '1.5px solid rgba(251,146,60,0.2)', boxShadow: '0 2px 10px rgba(249,115,22,0.06)' }}
          >
            <IcBell />
            <span
              className="absolute top-2 right-2.5 w-2 h-2 rounded-full"
              style={{ background: '#ea580c', boxShadow: '0 0 0 2px #fffdf9' }}
            />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">

            {/* Loading */}
            {loading && (
              <div className="litl-card">
                <p className="text-sm text-slate-400">Loading dashboard…</p>
              </div>
            )}

            {/* Profile error */}
            {!loading && profileErr && !profile && (
              <div className="litl-card">
                <p className="text-sm text-red-500">Could not load dashboard data. Please refresh the page.</p>
              </div>
            )}

            {!loading && (
              <>
                {/* ── Row 1: 4 stat chips ─────────────────────────── */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatChip
                    icon={IcMap}
                    value={discoveries !== null ? discoveries.length : '—'}
                    label="Trips Generated"
                    helper="keep exploring!"
                  />
                  <StatChip
                    icon={IcPin}
                    value={discoveries !== null ? countriesExplored : '—'}
                    label="Countries Explored"
                    helper="and counting"
                  />
                  <StatChip
                    icon={IcLightning}
                    value={
                      usage === null
                        ? '—'
                        : usage.generationsRemaining === null
                          ? '∞'
                          : (usage.generationsRemaining ?? '—')
                    }
                    label="Trips Left"
                    helper="this month"
                  />
                  <StatChip
                    icon={IcCalendar}
                    value={daysExploring !== null ? daysExploring : '—'}
                    label="Days Exploring"
                    helper="days of adventure!"
                  />
                </div>

                {/* ── Row 2: Adventure Awaits | Recent Discovery ───── */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

                  {/* Adventure Awaits — airmail postcard styling */}
                  <div
                    className="md:col-span-2 rounded-2xl p-6 pt-7 flex flex-col gap-5 relative overflow-hidden"
                    style={{
                      background: '#fffdf9',
                      border: '2px dashed rgba(234,88,12,0.25)',
                      boxShadow: '0 4px 20px rgba(234,88,12,0.06)',
                    }}
                  >
                    {/* Airmail stripe — diagonal orange/ink accent along the top edge */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5 opacity-50 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(-45deg, #ea580c 0 8px, transparent 8px 16px, #1e293b 16px 24px, transparent 24px 32px)' }}
                      aria-hidden="true"
                    />
                    {/* Decorative glow */}
                    <div
                      className="absolute top-0 right-0 w-36 h-36 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(251,146,60,0.09) 0%, transparent 70%)',
                        transform: 'translate(30%, -30%)',
                      }}
                    />
                    {/* Compass rose line-art — subtle, low opacity */}
                    <div className="absolute bottom-3 right-3 pointer-events-none" style={{ opacity: 0.08, color: '#ea580c' }} aria-hidden="true">
                      <svg viewBox="0 0 64 64" width="72" height="72" fill="none" stroke="currentColor" strokeWidth="1.25">
                        <circle cx="32" cy="32" r="26" />
                        <circle cx="32" cy="32" r="19" />
                        <path strokeLinecap="round" d="M32 6v8M32 50v8M6 32h8M50 32h8" />
                        <path strokeLinecap="round" strokeLinejoin="round" fill="currentColor" d="M32 18l6 14-6 14-6-14z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3 relative">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(234,88,12,0.08)' }}
                      >
                        <IcPlane />
                      </div>
                      <h2 className="litl-serif text-xl font-bold text-slate-900 italic leading-tight">
                        Your Next Adventure Awaits
                      </h2>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed relative">
                      Still feeling spontaneous?<br />
                      Let luck choose your next unforgettable destination.
                    </p>
                    <div className="relative mt-auto">
                      <Link
                        to="/travel"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                        style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 3px 14px rgba(234,88,12,0.28)' }}
                      >
                        <span className="text-xs opacity-80">✦</span> Surprise Me!
                      </Link>
                    </div>
                  </div>

                  {/* Recent Discovery — visual hero of the dashboard */}
                  <div
                    className="md:col-span-3 rounded-2xl p-5 relative overflow-hidden"
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid rgba(251,146,60,0.16)',
                      boxShadow: '0 4px 22px rgba(249,115,22,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                    }}
                  >
                    {/* Inner dashed matting — postcard frame */}
                    <div className="absolute inset-2 rounded-xl pointer-events-none" style={{ border: '1px dashed rgba(251,146,60,0.14)' }} aria-hidden="true" />

                    <div className="relative flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <IconBadge><IcPin /></IconBadge>
                        <p className="text-sm font-bold text-slate-800">Recent Discovery</p>
                      </div>
                      {discoveries !== null && discoveries.length > 0 && (
                        <Link
                          to="/discoveries"
                          className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          View all →
                        </Link>
                      )}
                    </div>

                    {recentDiscovery ? (
                      <div className="relative flex flex-col sm:flex-row items-stretch gap-5">
                        {/* Destination photo — real image with styled fallback */}
                        <div
                          className="relative w-full sm:w-40 md:w-48 h-40 sm:h-auto rounded-2xl shrink-0 overflow-hidden"
                          style={{ boxShadow: '0 8px 24px rgba(120,53,15,0.18)' }}
                        >
                          {discoveryImageUrl ? (
                            <img
                              src={discoveryImageUrl}
                              alt={`${recentDiscovery.city ?? 'Destination'} landscape`}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                if (!e.currentTarget.dataset.fallbackUsed) {
                                  e.currentTarget.dataset.fallbackUsed = '1'
                                  e.currentTarget.src = '/images/destinations/_fallback.jpg'
                                }
                              }}
                            />
                          ) : (
                            <div
                              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
                              style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.10) 0%, rgba(251,146,60,0.18) 100%)' }}
                            >
                              <IcGlobe />
                              <span className="text-[9px] font-bold text-orange-700/50 uppercase tracking-widest text-center px-2">
                                {recentDiscovery.country ?? 'Destination'}
                              </span>
                            </div>
                          )}
                          {/* Darken bottom edge slightly so any badge/text reads well */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 45%)' }}
                            aria-hidden="true"
                          />
                          {recentDiscovery.trip_type && (
                            <span
                              className="absolute top-2.5 left-2.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide text-white"
                              style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}
                            >
                              {formatLabel(recentDiscovery.trip_type)}
                            </span>
                          )}
                        </div>

                        {/* Destination details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="litl-serif text-2xl font-bold text-slate-900 italic leading-tight mb-1">
                            {[recentDiscovery.city, recentDiscovery.country].filter(Boolean).join(', ')}
                          </h3>
                          <div className="flex items-center gap-1.5 mb-3">
                            <IcCalendar />
                            <span className="text-[11px] text-slate-400">
                              Generated on {formatDate(recentDiscovery.generated_at)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentDiscovery.season && (
                              <span
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                style={{ background: 'rgba(34,197,94,0.08)', color: '#15803d', border: '1px solid rgba(34,197,94,0.18)' }}
                              >
                                🌿 {formatLabel(recentDiscovery.season)}
                              </span>
                            )}
                            {recentDiscovery.travellers && (
                              <span
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                style={{ background: 'rgba(59,130,246,0.07)', color: '#1d4ed8', border: '1px solid rgba(59,130,246,0.14)' }}
                              >
                                👥 {recentDiscovery.travellers} traveller{recentDiscovery.travellers !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Decorative travel stamp */}
                        <div className="hidden md:flex items-start justify-end pt-1 shrink-0" aria-hidden="true">
                          <TravelStamp label={recentDiscovery.country ?? recentDiscovery.city} />
                        </div>
                      </div>
                    ) : (
                      <EmptyState
                        title="No discoveries yet"
                        body="Generate your first destination to see it here."
                        ctaTo="/travel"
                      />
                    )}
                  </div>
                </div>

                {/* ── Row 3: Membership | Travel Mood | Quick Links ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  {/* Membership / Overview */}
                  <div
                    className="litl-card flex flex-col gap-4 relative overflow-hidden rounded-[1.25rem]"
                    style={{ boxShadow: '0 3px 18px rgba(249,115,22,0.08), inset 0 1px 0 rgba(255,255,255,0.9)' }}
                  >
                    <div className="absolute inset-2 rounded-2xl pointer-events-none" style={{ border: '1px dashed rgba(251,146,60,0.10)' }} aria-hidden="true" />
                    <div className="relative flex items-center gap-2">
                      <IconBadge><IcCrown /></IconBadge>
                      <p className="text-sm font-bold text-slate-800">Membership</p>
                    </div>

                    <div className="relative flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${planConfig?.className ?? 'bg-blue-100 text-blue-700'}`}>
                        {planConfig?.label ?? 'Free'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {usage?.clicksLimit == null ? 'Ad-free · unlimited' : `${usage.clicksLimit} clicks/mo`}
                      </span>
                    </div>

                    {/* Plan comparison chips */}
                    <div className="space-y-2">
                      {PLAN_BENEFITS.map((plan) => {
                        const isCurrent = plan.key === 'explorer'
                          ? isExplorer(profile?.plan)
                          : profile?.plan === plan.key
                        return (
                          <div
                            key={plan.key}
                            className="litl-card-sm"
                            style={isCurrent ? { borderColor: 'rgba(249,115,22,0.30)', background: 'rgba(255,247,237,0.6)' } : {}}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-bold text-slate-900">{plan.label}</p>
                              {isCurrent && (
                                <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wide">✦ Current</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{plan.description}</p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Click usage bar */}
                    {usage?.clicksLimit != null && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usage</p>
                          <span className="text-[10px] text-slate-400 tabular-nums">{usage.clicksUsed} / {usage.clicksLimit}</span>
                        </div>
                        <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(251,146,60,0.12)' }}>
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
                        <p className="text-[10px] text-slate-400 mt-1">
                          Resets {formatDate(usage.resetDate)}
                        </p>
                      </div>
                    )}

                    {usage && usage.clicksLimit === null && (
                      <p className="text-xs text-slate-500">Unlimited clicks — explore freely.</p>
                    )}

                    {canUpgrade && (
                      <InfoButton onClick={() => openModal('subscription')} wide>
                        Become an Explorer ✦
                      </InfoButton>
                    )}
                  </div>

                  {/* Travel Mood */}
                  <div
                    className="litl-card flex flex-col gap-4 relative overflow-hidden rounded-[1.25rem]"
                    style={{ boxShadow: '0 3px 18px rgba(249,115,22,0.08), inset 0 1px 0 rgba(255,255,255,0.9)' }}
                  >
                    <div className="absolute inset-2 rounded-2xl pointer-events-none" style={{ border: '1px dashed rgba(251,146,60,0.10)' }} aria-hidden="true" />
                    <div className="relative flex items-start gap-2">
                      <IconBadge><IcSparkle /></IconBadge>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Your Travel Mood</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">What kind of adventure are you seeking?</p>
                      </div>
                    </div>

                    {tripMood.length > 0 ? (
                      <>
                        <div className="space-y-3">
                          {tripMood.map(({ type, pct }) => (
                            <TravelMoodBar key={type} type={type} pct={pct} />
                          ))}
                        </div>
                        {favoriteTripType && (
                          <div className="pt-1" style={{ borderTop: '1px solid rgba(251,146,60,0.1)' }}>
                            <p className="text-[10px] text-slate-400">
                              Favourite: <span className="font-bold text-slate-600">{formatLabel(favoriteTripType)}</span>
                              {' · '}Based on {discoveries.length} discover{discoveries.length === 1 ? 'y' : 'ies'}
                            </p>
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400">Based on your recent activity</p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-400">Generate some trips to see your travel mood.</p>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div
                    className="litl-card flex flex-col gap-1.5 relative overflow-hidden rounded-[1.25rem]"
                    style={{ boxShadow: '0 3px 18px rgba(249,115,22,0.08), inset 0 1px 0 rgba(255,255,255,0.9)' }}
                  >
                    <div className="absolute inset-2 rounded-2xl pointer-events-none" style={{ border: '1px dashed rgba(251,146,60,0.10)' }} aria-hidden="true" />
                    <div className="relative flex items-center gap-2 mb-1">
                      <IconBadge><IcMap /></IconBadge>
                      <p className="text-sm font-bold text-slate-800">Quick Links</p>
                    </div>
                    {[
                      { label: 'Generate New Trip',  sub: 'Let luck decide',      to: '/travel',          Icon: IcSparkle },
                      { label: 'View World Map',     sub: 'See your travels',     to: '/stats/world-map', Icon: IcGlobe },
                      { label: 'Browse Discoveries', sub: 'Your saved places',    to: '/discoveries',     Icon: IcBookmark },
                      { label: 'View Statistics',    sub: 'Your travel insights', to: '/stats',           Icon: IcChart },
                    ].map(({ label, sub, to, Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className="relative flex items-center gap-3 group px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-orange-50/80 hover:-translate-y-px"
                        style={{ borderBottom: '1px solid rgba(251,146,60,0.08)' }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150 group-hover:bg-orange-100"
                          style={{ background: 'rgba(234,88,12,0.07)', border: '1px solid rgba(234,88,12,0.1)' }}
                        >
                          <Icon />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-orange-700 transition-colors">{label}</p>
                          <p className="text-[10px] text-slate-400">{sub}</p>
                        </div>
                        <span className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all">
                          <IcChevron />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* ── Row 4: Coming soon (Rewards | Referral | History) ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                  {/* Coin Balance */}
                  <div className="litl-card-dashed">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Coin Balance</p>
                      <ComingSoonBadge />
                    </div>
                    <p
                      className="litl-serif font-bold italic leading-none mb-2"
                      style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'rgba(234,88,12,0.18)' }}
                    >
                      0 coins
                    </p>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      Earn coins for bookings and referrals once rewards launch.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="litl-card-sm">
                        <p className="text-xs font-bold text-slate-500">50 coins</p>
                        <p className="text-xs text-slate-400">5% discount</p>
                      </div>
                      <div className="litl-card-sm">
                        <p className="text-xs font-bold text-slate-500">200 coins</p>
                        <p className="text-xs text-slate-400">10% discount</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">No expiring coins yet</p>
                    <InfoButton onClick={() => openModal('rewards')}>Redeem rewards</InfoButton>
                  </div>

                  {/* Referral Program */}
                  <div className="litl-card-dashed">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Referral Program</p>
                      <ComingSoonBadge />
                    </div>
                    <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                      Referral rewards are coming soon. Invite friends and earn rewards once this launches.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value="Referral link coming soon"
                        disabled
                        className="flex-1 rounded-xl border border-orange-100 bg-amber-50/40 px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
                      />
                      <InfoButton onClick={() => openModal('referral')}>Copy</InfoButton>
                    </div>
                  </div>

                  {/* Booking History */}
                  <div className="litl-card-dashed space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Booking History</p>
                      <ComingSoonBadge />
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Booking rewards will appear here after verified bookings are added.
                    </p>
                    <div style={{ borderTop: '1px dashed rgba(251,146,60,0.2)', paddingTop: '0.75rem' }}>
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Reward History</p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Your coin earning and redemption history will appear here once the rewards system launches.
                      </p>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <InfoModal modal={modal} onClose={closeModal} />
    </div>
  )
}

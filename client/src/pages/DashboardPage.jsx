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
function IcMap()       { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><polyline strokeLinejoin="round" points="1.5,3 7,1.5 13,4 18.5,2.5 18.5,17.5 13,16 7,18.5 1.5,17"/><line x1="7" y1="1.5" x2="7" y2="18.5"/><line x1="13" y1="4" x2="13" y2="16"/></svg> }
function IcChevron()   { return <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 12l4-4-4-4"/></svg> }
function IcMenu()      { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M3 5h14M3 10h14M3 15h14"/></svg> }
function IcX()         { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M5 15L15 5M5 5l10 10"/></svg> }
function IcBell()      { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8a5 5 0 0110 0c0 3.2 1 4.5 1.5 5.2a.8.8 0 01-.65 1.3H4.15a.8.8 0 01-.65-1.3C4 12.5 5 11.2 5 8z"/><path strokeLinecap="round" d="M8.2 16.5a1.8 1.8 0 003.6 0"/></svg> }
function IcCompass()   { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l-2 5-4 1 2-5 4-1z"/></svg> }
function IcLogout()    { return <svg viewBox="0 0 20 20" className={IC} fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17H4.5a1.5 1.5 0 01-1.5-1.5v-11A1.5 1.5 0 014.5 3H8M13.5 14l4-4-4-4M17 10H7.5"/></svg> }

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

function getWeekId(dateStr) {
  const date = new Date(dateStr)
  const onejan = new Date(date.getFullYear(), 0, 1)
  const week = Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7)
  return date.getFullYear() * 100 + week
}

function calcWeekStreak(discoveries) {
  if (!discoveries?.length) return 0
  const weekIds = new Set(discoveries.map((d) => getWeekId(d.generated_at)))
  let streak = 0
  let cursor = getWeekId(new Date())
  while (weekIds.has(cursor)) {
    streak += 1
    cursor -= 1
  }
  return streak
}

function buildSparklineCounts(discoveries, buckets = 7) {
  const counts = Array(buckets).fill(0)
  if (!discoveries?.length) return counts
  const now = Date.now()
  const bucketMs = 7 * 86400000
  for (const d of discoveries) {
    const diff = now - new Date(d.generated_at).getTime()
    const idx = buckets - 1 - Math.floor(diff / bucketMs)
    if (idx >= 0 && idx < buckets) counts[idx] += 1
  }
  return counts
}

function describeDiscovery(d) {
  if (!d) return ''
  const parts = []
  const article = (word) => (/^[aeiou]/i.test(word) ? 'An' : 'A')
  if (d.season) parts.push(`${article(d.season)} ${formatLabel(d.season)}`)
  if (d.trip_type) parts.push(parts.length ? formatLabel(d.trip_type).toLowerCase() + ' getaway' : `${article(d.trip_type)} ${formatLabel(d.trip_type)} getaway`)
  const base = parts.length ? parts.join(' ') : 'A destination'
  if (d.travellers) return `${base} for ${d.travellers} traveller${d.travellers !== 1 ? 's' : ''}.`
  return `${base}, chosen just for you.`
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
        `relative flex items-center gap-3 pl-3.5 pr-3 py-2.5 my-0.5 rounded-full text-sm font-semibold transition-all duration-150 ${
          isActive
            ? 'text-white'
            : 'text-white/55 hover:bg-white/8 hover:text-white/85'
        }`
      }
      style={({ isActive }) => isActive
        ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 3px 12px rgba(234,88,12,0.35)' }
        : {}
      }
    >
      <Icon />
      {children}
    </NavLink>
  )
}

function StatChip({ icon: Icon, value, label, helper }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl p-5"
      style={{
        background: '#fffdf9',
        border: '1.5px solid rgba(251,146,60,0.16)',
        boxShadow: '0 2px 12px rgba(249,115,22,0.06)',
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

/** Circular customs/passport stamp for the hero banner — hand-authored outline
    + circular textPath, adapted from HomePage's TravelStamp for a dark photo bg. */
function HeroStamp({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 140 140" className={className} style={style} aria-hidden="true">
      <path
        d="M70 6 C97 5 124 20 132 46 C139 68 133 96 112 114 C93 130 62 133 40 121 C17 109 5 83 9 58 C13 33 39 8 70 6 Z"
        fill="none" stroke="#fff7ed" strokeWidth="2.4" opacity="0.9"
      />
      <path
        d="M70 18 C92 17 113 30 119 50 C125 68 120 89 103 103 C88 115 63 118 45 108 C27 98 18 78 22 59 C26 39 47 19 70 18 Z"
        fill="none" stroke="#fff7ed" strokeWidth="1" strokeDasharray="2 3.5" opacity="0.65"
      />
      <path id="hero-stamp-top" d="M 24 52 A 48 48 0 0 1 116 52" fill="none" />
      <text fontSize="8" fontWeight="700" letterSpacing="2.2" fill="#fff7ed" opacity="0.9">
        <textPath href="#hero-stamp-top" startOffset="50%" textAnchor="middle">LEAVE IT TO LUCK</textPath>
      </text>
      <path id="hero-stamp-bottom" d="M 116 88 A 48 48 0 0 1 24 88" fill="none" />
      <text fontSize="7.5" fontWeight="700" letterSpacing="2.6" fill="#fff7ed" opacity="0.9">
        <textPath href="#hero-stamp-bottom" startOffset="50%" textAnchor="middle">LITL · EST 2024</textPath>
      </text>
      <g transform="translate(70,70) rotate(-32)" opacity="0.9">
        <path d="M-18 2 L-3 2 L5 -13 L9 -13 L6 2 L18 2 L22 -4 L25 -4 L22 4 L25 12 L22 12 L18 6 L6 6 L9 21 L5 21 L-3 6 L-18 6 Z" fill="#fff7ed" />
      </g>
    </svg>
  )
}

/** Compact ring progress indicator — dependency-free inline SVG. */
function RingStat({ percent, size = 44, stroke = 5, color = '#ea580c', track = 'rgba(234,88,12,0.14)' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, percent))
  const offset = c - (clamped / 100) * c
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

/** Small dependency-free trend line for the Journey Overview card. */
function Sparkline({ counts, color = '#f97316' }) {
  const max = Math.max(1, ...counts)
  const w = 200, h = 56, pad = 4
  const step = counts.length > 1 ? (w - pad * 2) / (counts.length - 1) : 0
  const points = counts
    .map((v, i) => `${pad + i * step},${h - pad - (v / max) * (h - pad * 2)}`)
    .join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {counts.map((v, i) => (
        <circle key={i} cx={pad + i * step} cy={h - pad - (v / max) * (h - pad * 2)} r="2.5" fill={color} />
      ))}
    </svg>
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
  const { user, logout } = useAuth()

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
  const weekStreak    = discoveries !== null ? calcWeekStreak(discoveries) : null
  const sparklineCounts = discoveries !== null ? buildSparklineCounts(discoveries) : Array(7).fill(0)

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
          w-64 shrink-0 flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ background: '#1c1917' }}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-5">
          <Link to="/" className="flex flex-col gap-1 group" onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-2">
              <span className="litl-serif text-3xl font-bold tracking-tight text-white italic">LITL</span>
              <span className="text-xl font-black" style={{ color: '#f97316' }}>✦</span>
            </div>
            <span className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase">Leave It To Luck</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <SidebarNavItem to="/dashboard"      icon={IcHome}>Dashboard</SidebarNavItem>
          <SidebarNavItem to="/travel"         icon={IcSparkle}>Generate Trip</SidebarNavItem>
          <SidebarNavItem to="/stats/world-map" icon={IcGlobe}>World Map</SidebarNavItem>
          <SidebarNavItem to="/discoveries"    icon={IcBookmark}>Discoveries</SidebarNavItem>
          <SidebarNavItem to="/stats"          icon={IcChart}>Statistics</SidebarNavItem>
          <SidebarNavItem to="/profile"        icon={IcUser}>Profile</SidebarNavItem>
        </nav>

        {/* Profile row + Logout */}
        <div className="px-3 pb-3 space-y-0.5">
          <Link
            to="/profile"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-full transition-colors hover:bg-white/8"
            onClick={() => setSidebarOpen(false)}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover border-2 border-white/15 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <span className="text-xs font-bold text-white/80">{displayName.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white/85 truncate">{displayName}</p>
              <p className="text-[10px] text-white/35 truncate">{getUserHandle(displayName)}</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-semibold text-white/50 hover:bg-white/8 hover:text-white/85 transition-all duration-150"
          >
            <IcLogout />
            Logout
          </button>
        </div>

        {/* Torn-edge quote footer */}
        <div
          className="relative shrink-0 sidebar-footer-torn px-6 pt-9 pb-6 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #7c2d12 0%, #c2410c 55%, #ea580c 100%)' }}
        >
          <svg
            viewBox="0 0 240 90"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 w-full h-16 pointer-events-none"
            style={{ opacity: 0.22 }}
            aria-hidden="true"
          >
            <path d="M0 90 L40 35 L70 60 L100 20 L135 65 L165 40 L200 70 L240 30 L240 90 Z" fill="#1c1917" />
          </svg>
          <p className="relative litl-serif italic text-sm text-white/90 leading-snug">
            "The world is a book and those who do not travel read only one page."
          </p>
          <p className="relative text-[10px] font-semibold text-white/55 uppercase tracking-widest mt-2">
            — St. Augustine
          </p>
        </div>
      </aside>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Hero banner */}
          <div className="relative overflow-hidden" style={{ minHeight: '15rem' }}>
            <img
              src="/images/marketing/coastal-cliffs.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(28,25,23,0.55) 0%, rgba(28,25,23,0.25) 45%, #faf8f5 100%)' }}
              aria-hidden="true"
            />

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden absolute top-4 left-4 z-10 p-2 rounded-full text-white"
              style={{ background: 'rgba(28,25,23,0.4)', backdropFilter: 'blur(6px)' }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <IcMenu />
            </button>

            {/* Circular customs stamp */}
            <HeroStamp
              className="absolute top-5 right-5 w-16 h-16 sm:w-20 sm:h-20"
              style={{ opacity: 0.85 }}
            />

            {/* Heading block */}
            <div className="relative px-5 sm:px-8 pt-16 sm:pt-20 pb-8 max-w-xl">
              <h1
                className="litl-serif italic font-bold text-white leading-none"
                style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)' }}
              >
                Welcome back, <span style={{ color: '#fdba74' }}>{greetingName}</span>!
              </h1>
              <p className="text-sm text-white/80 mt-2 max-w-sm">{travelMessage}</p>

              <div className="flex items-center gap-3 mt-5">
                <Link
                  to="/travel"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-200 hover:-translate-y-px active:scale-[0.97]"
                  style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 3px 14px rgba(234,88,12,0.35)' }}
                >
                  <span className="text-xs opacity-80">✦</span>
                  Generate New Trip
                </Link>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-px"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)' }}
                >
                  <IcBell />
                  <span
                    className="absolute top-2 right-2.5 w-2 h-2 rounded-full"
                    style={{ background: '#f97316', boxShadow: '0 0 0 2px rgba(28,25,23,0.6)' }}
                  />
                </button>
              </div>
            </div>
          </div>

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
                {/* ── Row 1: 4 stat cards ─────────────────────────── */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatChip
                    icon={IcMap}
                    value={discoveries !== null ? discoveries.length : '—'}
                    label="Destinations Discovered"
                  />
                  <StatChip
                    icon={IcPin}
                    value={discoveries !== null ? countriesExplored : '—'}
                    label="Countries Explored"
                  />
                  <StatChip
                    icon={IcLightning}
                    value={weekStreak !== null ? weekStreak : '—'}
                    label="Week Streak"
                  />
                  <div
                    className="flex items-center gap-4 rounded-2xl p-5"
                    style={{ background: '#fffdf9', border: '1.5px solid rgba(251,146,60,0.16)', boxShadow: '0 2px 12px rgba(249,115,22,0.06)' }}
                  >
                    <div className="relative shrink-0 flex items-center justify-center">
                      <RingStat percent={usagePercent} />
                      <span className="absolute text-xs font-extrabold text-slate-900 tabular-nums">{usagePercent}%</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-600 leading-tight">Goal Progress</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {usage?.generationsRemaining == null ? 'Unlimited trips left' : `${usage.generationsRemaining} trips left`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Latest Discovery ────────────────────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="litl-serif italic text-xl font-bold text-slate-900">Latest Discovery</h2>
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
                    <div
                      className="flex flex-col sm:flex-row rounded-2xl"
                      style={{ boxShadow: '0 4px 22px rgba(249,115,22,0.1)' }}
                    >
                      {/* Destination photo — real image with styled fallback */}
                      <div className="relative w-full sm:w-2/5 h-48 sm:h-auto shrink-0 overflow-hidden rounded-2xl sm:rounded-r-none">
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
                        {recentDiscovery.trip_type && (
                          <span
                            className="absolute top-2.5 left-2.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide text-white"
                            style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}
                          >
                            {formatLabel(recentDiscovery.trip_type)}
                          </span>
                        )}
                      </div>

                      {/* Ticket panel */}
                      <div
                        className="litl-ticket flex-1 p-6 pl-8 flex flex-col justify-center gap-2 rounded-2xl sm:rounded-l-none"
                        style={{ background: '#fff7ed', '--litl-ticket-punch': '#faf8f5' }}
                      >
                        <h3 className="litl-serif text-2xl font-bold text-slate-900 italic leading-tight">
                          {[recentDiscovery.city, recentDiscovery.country].filter(Boolean).join(', ')}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <IcCalendar />
                          <span className="text-[11px] text-slate-400">
                            Discovered on {formatDate(recentDiscovery.generated_at)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mt-1">
                          {describeDiscovery(recentDiscovery)}
                        </p>
                        <div className="mt-3">
                          <Link
                            to="/discoveries"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-200 hover:-translate-y-px active:scale-[0.97]"
                            style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 3px 14px rgba(234,88,12,0.28)' }}
                          >
                            View Details →
                          </Link>
                        </div>
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

                {/* ── Your Journey Overview ───────────────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="litl-serif italic text-xl font-bold text-slate-900">Your Journey Overview</h2>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">This Month</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Clicks Used */}
                    <div className="litl-card">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Clicks Used</p>
                      {usage?.clicksLimit != null ? (
                        <>
                          <p className="litl-serif text-3xl font-bold italic text-slate-900 mb-3">
                            {usage.clicksUsed} <span className="text-base text-slate-400 not-italic">/ {usage.clicksLimit}</span>
                          </p>
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
                          <p className="text-[10px] text-slate-400 mt-2">Resets {formatDate(usage.resetDate)}</p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-500">Unlimited clicks — explore freely.</p>
                      )}
                    </div>

                    {/* Sparkline */}
                    <div className="litl-card">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Discovery Activity</p>
                      <Sparkline counts={sparklineCounts} />
                      <p className="text-[10px] text-slate-400 mt-2">Destinations discovered per week, last 7 weeks</p>
                    </div>
                  </div>
                </div>

                {/* ── Explorer Membership ─────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8" style={{ background: '#1c1917' }}>
                  {/* geometric watermark — not a hand-drawn illustration, purely outline geometry */}
                  <svg
                    viewBox="0 0 200 200"
                    className="absolute -right-6 -top-6 w-56 h-56 pointer-events-none"
                    style={{ opacity: 0.08, color: '#fbbf24' }}
                    aria-hidden="true" fill="none" stroke="currentColor"
                  >
                    <circle cx="100" cy="100" r="96" strokeWidth="1" />
                    <circle cx="100" cy="100" r="72" strokeWidth="0.75" />
                    <g fill="currentColor" stroke="none">
                      <path d="M100 10 L109 92 L100 101 L91 92 Z" />
                      <path d="M100 190 L109 108 L100 99 L91 108 Z" opacity="0.55" />
                      <path d="M10 100 L92 91 L101 100 L92 109 Z" opacity="0.55" />
                      <path d="M190 100 L108 91 L99 100 L108 109 Z" opacity="0.55" />
                      <circle cx="100" cy="100" r="4" />
                    </g>
                  </svg>

                  <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.14)', color: '#fbbf24' }}>
                          <IcCrown />
                        </div>
                        <h2 className="litl-serif italic text-2xl font-bold text-white">Explorer Membership</h2>
                        {isExplorer(profile?.plan) && (
                          <span
                            className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(251,191,36,0.16)', color: '#fbbf24' }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 mb-4 max-w-md">
                        Unlock unlimited destinations, advanced features and an ad-free experience.
                      </p>
                      <ul className="space-y-1.5 mb-5">
                        {['Unlimited destination generations', 'Full destination guides & local tips', 'No ads, priority support'].map((line) => (
                          <li key={line} className="flex items-center gap-2 text-sm text-white/75">
                            <span style={{ color: '#fbbf24' }}>✓</span> {line}
                          </li>
                        ))}
                      </ul>
                      {canUpgrade ? (
                        <button
                          type="button"
                          onClick={() => openModal('subscription')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                          style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#1c1917', boxShadow: '0 3px 14px rgba(251,191,36,0.3)' }}
                        >
                          Upgrade Now
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openModal('subscription')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                          View Membership Benefits →
                        </button>
                      )}
                    </div>

                    {/* Plan comparison chips */}
                    <div className="w-full md:w-64 shrink-0 space-y-2">
                      {PLAN_BENEFITS.map((plan) => {
                        const isCurrent = plan.key === 'explorer'
                          ? isExplorer(profile?.plan)
                          : profile?.plan === plan.key
                        return (
                          <div
                            key={plan.key}
                            className="rounded-xl p-3"
                            style={{
                              background: isCurrent ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.05)',
                              border: isCurrent ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-xs font-bold text-white">{plan.label}</p>
                              {isCurrent && (
                                <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: '#fbbf24' }}>✦ Current</span>
                              )}
                            </div>
                            <p className="text-[11px] text-white/50 leading-relaxed">{plan.description}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* ── More about your travel: Travel Mood | Quick Links ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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

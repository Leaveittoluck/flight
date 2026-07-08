import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

/* ─── Decorative SVG helpers ─── */

function ArrowRight({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
    </svg>
  )
}

function CheckIcon({ className = 'w-4 h-4 text-orange-500 mt-0.5 shrink-0' }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  )
}

/** Authentic-feeling customs/immigration stamp — hand-stamped outline, coordinate
    arc, entry-point arc and a diagonal plane mark, inspired by real passport stamps
    rather than a logo-in-a-circle. */
function TravelStamp({ className = '', style = {}, id = 'litl-stamp' }) {
  const topArc = `${id}-top`
  const bottomArc = `${id}-bottom`
  return (
    <svg viewBox="0 0 140 140" className={className} style={style} aria-hidden="true">
      {/* hand-stamped outer boundary — deliberately not a perfect circle */}
      <path
        d="M70 6 C97 5 124 20 132 46 C139 68 133 96 112 114 C93 130 62 133 40 121 C17 109 5 83 9 58 C13 33 39 8 70 6 Z"
        fill="none" stroke="#ea580c" strokeWidth="2.4" opacity="0.85"
      />
      <path
        d="M70 18 C92 17 113 30 119 50 C125 68 120 89 103 103 C88 115 63 118 45 108 C27 98 18 78 22 59 C26 39 47 19 70 18 Z"
        fill="none" stroke="#ea580c" strokeWidth="1" strokeDasharray="2 3.5" opacity="0.6"
      />

      <path id={topArc} d="M 24 52 A 48 48 0 0 1 116 52" fill="none" />
      <text fontSize="8" fontWeight="700" letterSpacing="2.2" fill="#ea580c" opacity="0.85">
        <textPath href={`#${topArc}`} startOffset="50%" textAnchor="middle">41°N · 12°E</textPath>
      </text>

      <path id={bottomArc} d="M 116 88 A 48 48 0 0 1 24 88" fill="none" />
      <text fontSize="7.5" fontWeight="700" letterSpacing="2.6" fill="#ea580c" opacity="0.85">
        <textPath href={`#${bottomArc}`} startOffset="50%" textAnchor="middle">LEAVE IT TO LUCK</textPath>
      </text>

      {/* diagonal arrival mark, like an airport customs plane stamp */}
      <g transform="translate(70,70) rotate(-32)" opacity="0.9">
        <path d="M-18 2 L-3 2 L5 -13 L9 -13 L6 2 L18 2 L22 -4 L25 -4 L22 4 L25 12 L22 12 L18 6 L6 6 L9 21 L5 21 L-3 6 L-18 6 Z" fill="#ea580c" />
      </g>

      {/* faint ink imperfections for authenticity */}
      <circle cx="28" cy="98" r="1.4" fill="#ea580c" opacity="0.4" />
      <circle cx="110" cy="40" r="1" fill="#ea580c" opacity="0.35" />
      <circle cx="98" cy="108" r="1.6" fill="#ea580c" opacity="0.3" />
      <circle cx="20" cy="45" r="0.9" fill="#ea580c" opacity="0.3" />
    </svg>
  )
}

/** Very low-opacity watermark used to fill hero whitespace without distracting. */
function CompassRose({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true" fill="none" stroke="currentColor">
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
  )
}

/** Thin dashed route-line divider with a small travelling plane, used between sections. */
function RouteDivider({ className = '' }) {
  return (
    <div className={`relative w-full ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="w-full h-6" style={{ opacity: 0.3 }}>
        <line x1="0" y1="12" x2="400" y2="12" stroke="#ea580c" strokeWidth="1" strokeDasharray="1 9" strokeLinecap="round" />
        <path d="M193 5 L193 19 L208 12 Z" fill="#ea580c" />
      </svg>
    </div>
  )
}

/** A short strip of "masking tape" — a clean rounded rectangle with a soft
    diagonal sheen and drop shadow, used to pin the collage photos down. */
function WashiTape({ style = {}, width = 56, height = 20, rotate = 8, tint = 'rgba(253,186,116,0.85)' }) {
  return (
    <div
      aria-hidden="true"
      className="absolute z-30 rounded-[3px]"
      style={{
        width,
        height,
        background: `linear-gradient(105deg, ${tint} 0%, rgba(255,255,255,0.4) 48%, ${tint} 100%)`,
        boxShadow: '0 2px 4px rgba(60,25,0,0.18)',
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    />
  )
}

/** Tiny folded-corner ("dog-ear") detail for otherwise-flat white cards — a
    small, low-opacity paper realism touch, not a functional element. */
function FoldedCorner({ size = 26 }) {
  return (
    <div aria-hidden="true" className="absolute top-0 right-0 pointer-events-none overflow-hidden" style={{ width: size, height: size }}>
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, transparent 52%, #fdf0e2 52.5%, #fdf0e2 100%)',
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
          boxShadow: 'inset -1px 1px 3px rgba(124,45,18,0.18)',
        }}
      />
    </div>
  )
}

function MapMarker({ label, style }) {
  return (
    <div className="absolute hidden sm:flex items-center gap-1.5" style={style}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
      </span>
      <span className="text-[11px] font-semibold text-white/90 tracking-wide" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
        {label}
      </span>
    </div>
  )
}

/* ─── Feature strip icons — one consistent premium travel icon family
   (passport / compass / boarding pass / globe), thin outline, matched stroke ─── */

function IconPassportBook({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <rect x="5" y="3" width="14" height="18" rx="1.8" />
      <circle cx="12" cy="9.4" r="2.6" />
      <path strokeLinecap="round" d="M9 15.2h6M9.8 17.4h4.4" />
    </svg>
  )
}

function IconCompassNeedle({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.2 8.8l-2.1 5-5 2.1 2.1-5z" />
      <path strokeLinecap="round" d="M12 3.6v1.5M12 18.9v1.5M3.6 12h1.5M18.9 12h1.5" />
    </svg>
  )
}

function IconBoardingPass({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path strokeLinejoin="round" d="M3 8.2a1.8 1.8 0 011.8-1.8h14.4A1.8 1.8 0 0121 8.2v1.3a1.4 1.4 0 000 2.6v1.3a1.8 1.8 0 01-1.8 1.8H4.8A1.8 1.8 0 013 13.4v-1.3a1.4 1.4 0 000-2.6z" />
      <path strokeLinecap="round" strokeDasharray="1.6 2.2" d="M9.2 6.8v10.4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10.4l4.3 1.6-4.3 1.6v-1.1h-2v-1z" />
    </svg>
  )
}

function IconGlobeRoute({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.5 3.7 6 3.7 9s-1.3 6.5-3.7 9c-2.4-2.5-3.7-6-3.7-9S9.6 5.5 12 3z" />
    </svg>
  )
}

const FEATURES = [
  { title: 'Personalised', desc: 'Just for you', Icon: IconPassportBook },
  { title: 'Surprise', desc: 'Something new', Icon: IconCompassNeedle },
  { title: 'Trusted', desc: 'Real experiences', Icon: IconBoardingPass },
  { title: 'Simple', desc: 'In just one click', Icon: IconGlobeRoute },
]

/* ─── How it works icons ─── */

function IconMoodBudget({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M8.5 14.2c1 1.1 2.1 1.7 3.5 1.7s2.5-.6 3.5-1.7" />
      <path strokeLinecap="round" d="M9 9.5h.01M15 9.5h.01" />
    </svg>
  )
}

function IconSearchDestinations({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path strokeLinecap="round" d="M15.3 15.3L20 20" />
    </svg>
  )
}

function IconDiscoverPlace({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.1-7-11.5A7 7 0 0119 9.5C19 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  )
}

function IconPlanTrip({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <rect x="4" y="7.5" width="16" height="11.5" rx="2" />
      <path strokeLinecap="round" d="M9 7.5V5.8a1.8 1.8 0 011.8-1.8h2.4A1.8 1.8 0 0116 5.8v1.7" />
      <path strokeLinecap="round" d="M4 12.5h16" />
    </svg>
  )
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'You tell us your mood and budget',
    desc: 'Adventure, relaxation, culture — pick how you want to feel and what you can spend.',
    Icon: IconMoodBudget,
  },
  {
    step: '02',
    title: 'We search the best destinations',
    desc: 'Leave It To Luck scans real flights and destination profiles that fit your brief.',
    Icon: IconSearchDestinations,
  },
  {
    step: '03',
    title: 'You discover a place you’ll love',
    desc: 'Get a matched destination you’d never have searched for yourself — with the details to prove it.',
    Icon: IconDiscoverPlace,
  },
  {
    step: '04',
    title: 'You plan your next adventure',
    desc: 'Review the guide, save your favourites, and book directly through trusted platforms.',
    Icon: IconPlanTrip,
  },
]

/* ─── Photography ───────────────────────────────────────────────────────────
   Real travel photography sourced through the project's existing Pexels
   integration (server/src/services/images.service.js — the same API already
   used by DiscoveriesPage/DashboardPage). Resolved once and hardcoded here
   rather than fetched client-side, so the homepage stays free of extra
   network round-trips and loading states. `&fm=jpg` forces a compressed
   JPEG response even for source PNGs; gallery thumbnails request a smaller
   `w=480` render since they never display larger than a few hundred px. ─── */

const PHOTOS = {
  cliffs: '/images/marketing/coastal-cliffs.jpg',
  travelFlatlay: '/images/marketing/newsletter-flatlay.jpg',
  oiaSantorini: 'https://images.pexels.com/photos/15532995/pexels-photo-15532995.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940&fm=jpg',
  cinqueTerre: 'https://images.pexels.com/photos/31117323/pexels-photo-31117323.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940&fm=jpg',
  airplaneWindow: 'https://images.pexels.com/photos/1363794/pexels-photo-1363794.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940&fm=jpg',
  reykjavik: 'https://images.pexels.com/photos/20165201/pexels-photo-20165201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940&fm=jpg',
  lisbon: 'https://images.pexels.com/photos/26824153/pexels-photo-26824153.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940&fm=jpg',
  marrakech: 'https://images.pexels.com/photos/15260622/pexels-photo-15260622.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940&fm=jpg',
  faroeIslands: 'https://images.pexels.com/photos/5132694/pexels-photo-5132694.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940&fm=jpg',
  kyoto: 'https://images.pexels.com/photos/2641279/pexels-photo-2641279.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=480&fm=jpg',
  lakeBled: 'https://images.pexels.com/photos/11003575/pexels-photo-11003575.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=480&fm=jpg',
  saharaDunes: 'https://images.pexels.com/photos/10790260/pexels-photo-10790260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=480&fm=jpg',
  balloons: 'https://images.pexels.com/photos/27260270/pexels-photo-27260270.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=480&fm=jpg',
  ceskyKrumlov: 'https://images.pexels.com/photos/15220305/pexels-photo-15220305.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=480&fm=jpg',
  boraBora: 'https://images.pexels.com/photos/15420532/pexels-photo-15420532.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=480&fm=jpg',
  torresDelPaine: 'https://images.pexels.com/photos/30359266/pexels-photo-30359266.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=480&fm=jpg',
}

const GALLERY = [
  { place: 'Kyoto', tag: 'Japan · lantern-lit alleys', src: PHOTOS.kyoto },
  { place: 'Lake Bled', tag: 'Slovenia · mountain lake', src: PHOTOS.lakeBled },
  { place: 'Sahara', tag: 'Morocco · desert dunes', src: PHOTOS.saharaDunes },
  { place: 'Cappadocia', tag: 'Türkiye · hot air balloons', src: PHOTOS.balloons },
  { place: 'Český Krumlov', tag: 'Czechia · old town', src: PHOTOS.ceskyKrumlov },
  { place: 'Bora Bora', tag: 'French Polynesia · lagoon', src: PHOTOS.boraBora },
  { place: 'Torres del Paine', tag: 'Chile · adventure hiking', src: PHOTOS.torresDelPaine },
]

/* ─── Data ─── */

const MOCK_DESTINATIONS = [
  {
    city: 'Reykjavik',
    country: 'Iceland',
    tagline: 'Northern lights, volcanic craters & thermal hot springs',
    mood: 'Adventure',
    price: '£420',
    accentColor: '#7dd3fc',
    photo: PHOTOS.reykjavik,
  },
  {
    city: 'Lisbon',
    country: 'Portugal',
    tagline: 'Golden trams, ocean breeze & sun-warmed pastel tiles',
    mood: 'Cultural',
    price: '£290',
    accentColor: '#fbbf24',
    photo: PHOTOS.lisbon,
  },
  {
    city: 'Marrakech',
    country: 'Morocco',
    tagline: 'Spice markets, ancient riads & warm desert air',
    mood: 'Exotic',
    price: '£310',
    accentColor: '#fb923c',
    photo: PHOTOS.marrakech,
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    features: [
      'Generate destinations',
      'Save discoveries',
      'Travel history & statistics',
      'Basic destination card',
    ],
    cta: 'Start Free',
    ctaTo: '/travel',
    highlight: false,
  },
  {
    name: 'Explorer Member',
    price: '£9.99',
    period: 'per month',
    features: [
      'Full destination guide',
      'Hidden gems & fun facts',
      'Local recommendations',
      'Weather insights & packing tips',
      'Ad-free experience',
      'Unlimited favourites',
    ],
    cta: 'Become an Explorer',
    ctaTo: '/register',
    highlight: true,
  },
]

const STATS = [
  { value: '2,400+', label: 'Destinations generated' },
  { value: '94', label: 'Countries covered' },
  { value: '12', label: 'Trip moods' },
  { value: '1,800+', label: 'Travellers inspired' },
]

const TRUST_MARKS = ['WANDERLIST', 'WAYPOINT JOURNAL', 'TRAILHEAD', 'ATLAS & CO.', 'THE DRIFTER']

/* ─── Component ─── */

export default function HomePage() {
  const [howRef,       howVisible]       = useReveal(0.1)
  const [galleryRef,   galleryVisible]   = useReveal(0.08)
  const [destRef,      destVisible]      = useReveal(0.08)
  const [mapRef,       mapVisible]       = useReveal(0.1)
  const [pricingRef,   pricingVisible]   = useReveal(0.08)
  const [trustRef,     trustVisible]     = useReveal(0.1)
  const [statsRef,     statsVisible]     = useReveal(0.12)
  const [newsletterRef, newsletterVisible] = useReveal(0.1)
  const [subscribed, setSubscribed] = useState(false)

  function handleNewsletterSubmit(e) {
    e.preventDefault()
    setSubscribed(true)
  }

  return (
    <div style={{ backgroundColor: '#fff7ed' }}>

      {/* ══════════════════════════════
          HERO — cream paper, editorial split layout
      ══════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 lg:pt-24 pb-24 sm:pb-28 lg:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left: headline + copy + CTA */}
          <div className="relative" style={{ animation: 'fadeInUp 0.7s ease forwards' }}>
            <CompassRose
              className="hidden lg:block absolute w-96 h-96 pointer-events-none text-orange-900"
              style={{ top: '-70px', left: '-140px', opacity: 0.045 }}
            />

            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-7"
              style={{ backgroundColor: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.18)', color: '#c2410c' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
              Let luck choose
            </div>

            <h1 className="relative litl-serif text-5xl sm:text-6xl font-semibold text-stone-900 leading-[1.1] mb-7">
              Don&rsquo;t overthink it.
              <br />
              <span style={{ color: '#ea580c' }}>Leave it to luck.</span>
            </h1>

            <p className="relative text-base sm:text-lg text-stone-500 max-w-md leading-relaxed mb-10">
              We&rsquo;ll find a destination that fits your mood, your budget and your sense of adventure — no endless tab-hopping required.
            </p>

            <Link
              to="/travel"
              className="relative inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 2px 8px rgba(234,88,12,0.2)' }}
            >
              Find My Destination
              <ArrowRight />
            </Link>

            {/* Boarding-pass flourish — quiet travel detail, fills the whitespace under the CTA */}
            <div
              className="relative mt-10 pt-4 flex items-center gap-3 max-w-xs"
              style={{ borderTop: '1px dashed rgba(234,88,12,0.25)' }}
            >
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-400">Anywhere</span>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#fb923c" aria-hidden="true">
                <path d="M3 11h13.5l-4-4 1.4-1.4L21 12l-7.1 6.4-1.4-1.4 4-4H3z" />
              </svg>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-400">Somewhere lucky</span>
            </div>
          </div>

          {/* Right: curated photo collage — 4 overlapping prints, calm rotation/depth,
              generous margin below reserved for the travel stamp so it never
              touches the photos (see safe-zone note on the stamp itself). */}
          <div className="relative mx-auto w-full max-w-md h-[420px] sm:h-[480px] lg:h-[520px]">

            {/* Photo 1 — airplane window, smallest, peeking from behind top-left, furthest back */}
            <div
              className="absolute top-0 left-0 w-[36%] h-[30%] overflow-hidden border-[6px] border-white z-0"
              style={{
                borderRadius: '16px 20px 14px 18px',
                transform: 'rotate(7deg)',
                boxShadow: '0 2px 4px rgba(60,25,0,0.1), 0 10px 18px rgba(60,25,0,0.16)',
              }}
            >
              <img
                src={PHOTOS.airplaneWindow}
                alt="View of clouds through an airplane window"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            {/* Photo 2 — Cinque Terre, largest, top-right, the "hero" print of the collage */}
            <div
              className="absolute top-[6%] right-0 w-[66%] h-[50%] overflow-hidden border-[6px] border-white z-10"
              style={{
                borderRadius: '20px 24px 18px 22px',
                transform: 'rotate(-3deg)',
                boxShadow: '0 2px 4px rgba(60,25,0,0.12), 0 14px 26px rgba(60,25,0,0.2)',
              }}
            >
              <img
                src={PHOTOS.cinqueTerre}
                alt="Colourful cliffside village of Manarola, Cinque Terre"
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 35%' }}
                loading="eager"
              />
            </div>

            {/* Photo 3 — coastal cliffs, staggered lower-left, mid-depth */}
            <div
              className="absolute bottom-[14%] left-[2%] w-[50%] h-[36%] overflow-hidden border-[6px] border-white z-20"
              style={{
                borderRadius: '18px 22px 24px 16px',
                transform: 'rotate(5deg)',
                boxShadow: '0 2px 4px rgba(60,25,0,0.12), 0 12px 22px rgba(60,25,0,0.2)',
              }}
            >
              <img
                src={PHOTOS.cliffs}
                alt="Turquoise coastline with sea cliffs"
                className="w-full h-full object-cover"
                style={{ objectPosition: '55% 35%' }}
                loading="eager"
              />
            </div>

            {/* Photo 4 — Oia, Santorini, frontmost, same border treatment as the rest */}
            <div
              className="absolute bottom-[-3%] right-[3%] w-[34%] h-[32%] overflow-hidden border-[6px] border-white z-30"
              style={{
                borderRadius: '16px 20px 18px 22px',
                transform: 'rotate(-7deg)',
                boxShadow: '0 3px 6px rgba(60,25,0,0.14), 0 14px 24px rgba(60,25,0,0.22)',
              }}
            >
              <img
                src={PHOTOS.oiaSantorini}
                alt="Blue-domed church overlooking the Santorini caldera"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            {/* Masking tape, pinning just two photos — restrained, not scattered */}
            <WashiTape style={{ top: '3%', left: '28%' }} rotate={-12} width={50} height={18} tint="rgba(253,186,116,0.85)" />
            <WashiTape style={{ top: '42%', right: '10%' }} rotate={10} width={44} height={16} tint="rgba(251,146,60,0.6)" />

            {/* Travel stamp — anchored to a fixed offset below the collage box (not a
                percentage) so it always clears the frontmost photo's bottom edge,
                regardless of breakpoint. Never overlaps photo content. */}
            <TravelStamp
              className="absolute z-0"
              style={{ top: 'calc(100% + 22px)', right: '10%', width: '62px', height: '62px', transform: 'rotate(9deg)', opacity: 0.85 }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FEATURE STRIP — full-width, clipped into an irregular torn band
          via CSS clip-path (see .feature-strip-torn in index.css) instead
          of layered SVG edge overlays.
      ══════════════════════════════ */}
      <section className="relative isolate overflow-hidden bg-[#f45a0a] text-white feature-strip-torn">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4 sm:px-8">
          {FEATURES.map(({ title, desc, Icon }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 text-white">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ border: '1.5px solid rgba(255,255,255,0.55)' }}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold">{title}</p>
              <p className="text-xs text-white/75">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          HOW LITL WORKS — boarding-pass styled steps
      ══════════════════════════════ */}
      <section id="how-it-works" className="py-24" style={{ backgroundColor: '#fff7ed' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div ref={howRef} className={`reveal ${howVisible ? 'visible' : ''}`}>

            <div className="text-center mb-16">
              <p className="text-xs tracking-widest uppercase font-bold mb-3" style={{ color: '#f97316' }}>
                How LITL works
              </p>
              <h2 className="litl-serif text-4xl sm:text-5xl font-semibold text-stone-900">
                A smarter way to travel
              </h2>
              <p className="litl-serif italic text-stone-400 text-lg mt-3">
                Four small steps between here and somewhere new.
              </p>
            </div>

            {/* Steps with connecting route line (desktop only) */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute hidden lg:block"
                style={{
                  top: '20px',
                  left: 'calc(12.5% + 20px)',
                  right: 'calc(12.5% + 20px)',
                  height: '2px',
                  background: 'repeating-linear-gradient(90deg, rgba(249,115,22,0.35) 0px, rgba(249,115,22,0.35) 8px, transparent 8px, transparent 18px)',
                  backgroundSize: '18px 2px',
                  animation: 'slideDash 1.4s linear infinite',
                  zIndex: 0,
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
                {HOW_IT_WORKS.map((item, i) => (
                  <div
                    key={item.step}
                    className={`reveal reveal-delay-${i + 1} ${howVisible ? 'visible' : ''} flex flex-col gap-3`}
                  >
                    <div
                      className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 mb-1"
                      style={{ backgroundColor: '#fff7ed', border: '1.5px solid #fdba74', color: '#f97316', boxShadow: '0 0 0 5px #fff7ed' }}
                    >
                      <item.Icon className="w-5 h-5" />
                    </div>

                    <div className="litl-ticket bg-white rounded-2xl rounded-l-md p-5 pl-6 flex flex-col gap-2 shadow-sm">
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em]" style={{ color: '#fb923c' }}>
                        BOARDING · {item.step}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 leading-snug">{item.title}</h3>
                      <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          EDITORIAL GALLERY — horizontal scroll photo strip
      ══════════════════════════════ */}
      <section className="py-20 overflow-hidden" style={{ backgroundColor: '#fffaf3', borderTop: '1px dashed rgba(251,146,60,0.25)', borderBottom: '1px dashed rgba(251,146,60,0.25)' }}>
        <div ref={galleryRef} className={`reveal ${galleryVisible ? 'visible' : ''}`}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 mb-10">
            <p className="text-xs tracking-widest uppercase font-bold mb-3" style={{ color: '#f97316' }}>
              The world, one page at a time
            </p>
            <h2 className="litl-serif text-4xl sm:text-5xl font-semibold text-stone-900">
              A world worth discovering
            </h2>
            <p className="litl-serif italic text-stone-400 text-lg mt-3 max-w-lg">
              A few of the places luck has sent travellers before.
            </p>
          </div>

          <div className="litl-scroll-x overflow-x-auto pb-3">
            <div className="flex gap-5 px-6 sm:px-8" style={{ width: 'max-content' }}>
              {GALLERY.map((item, i) => (
                <figure
                  key={item.place}
                  className={`reveal reveal-delay-${(i % 4) + 1} ${galleryVisible ? 'visible' : ''} relative w-52 sm:w-60 aspect-[3/4] rounded-3xl overflow-hidden shrink-0 shadow-lg transition-transform duration-300 hover:-translate-y-1`}
                >
                  <img src={item.src} alt={`${item.place} — ${item.tag}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(12,5,0,0.78) 0%, rgba(12,5,0,0.05) 55%, transparent 70%)' }} />
                  <figcaption className="absolute bottom-4 left-4 right-4">
                    <p className="litl-serif italic text-white text-xl leading-tight">{item.place}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/70 mt-1">{item.tag}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SAMPLE DISCOVERIES — gallery-style destination cards
      ══════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: '#fff7ed' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div ref={destRef} className={`reveal ${destVisible ? 'visible' : ''}`}>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-xs tracking-widest uppercase font-bold mb-3" style={{ color: '#f97316' }}>
                  Where could you go?
                </p>
                <h2 className="litl-serif text-4xl sm:text-5xl font-semibold text-stone-900">
                  Sample discoveries
                </h2>
              </div>
              <Link to="/travel" className="inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80 shrink-0" style={{ color: '#f97316' }}>
                Unlock yours <ArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {MOCK_DESTINATIONS.map((dest, i) => (
                <div
                  key={dest.city}
                  className={`reveal reveal-delay-${i + 1} ${destVisible ? 'visible' : ''} relative rounded-3xl overflow-hidden h-96 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer shadow-lg`}
                >
                  <img src={dest.photo} alt={`${dest.city}, ${dest.country}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(10,5,0,0.85) 0%, rgba(10,5,0,0.3) 50%, rgba(10,5,0,0.05) 70%)' }} />

                  <div className="relative h-full flex flex-col justify-end p-5">
                    <span
                      className="inline-flex items-center gap-1.5 w-fit text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider text-white"
                      style={{ backgroundColor: 'rgba(10,5,0,0.5)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: dest.accentColor }} />
                      {dest.mood}
                    </span>

                    <h3 className="litl-serif text-3xl font-semibold text-white mb-0.5">{dest.city}</h3>
                    <p className="text-sm text-white/60 mb-3">{dest.country}</p>
                    <p className="text-sm text-white/80 leading-relaxed mb-5">{dest.tagline}</p>

                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                      <span className="text-xs text-white/50">From</span>
                      <span className="text-base font-bold px-3 py-1 rounded-full bg-white/15 text-white">
                        {dest.price} <span className="text-xs font-normal opacity-70">/ person</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          EXPLORE THE WORLD — panoramic highlight section
      ══════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: '#fff7ed' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div
            ref={mapRef}
            className={`reveal ${mapVisible ? 'visible' : ''} relative rounded-4xl overflow-hidden h-130 sm:h-120`}
            style={{ border: '1px solid rgba(251,146,60,0.2)', boxShadow: '0 16px 48px rgba(120,53,15,0.2)' }}
          >
            <img
              src={PHOTOS.faroeIslands}
              alt="Panoramic fjord landscape in the Faroe Islands"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(10,15,20,0.75) 0%, rgba(10,15,20,0.2) 50%, rgba(10,15,20,0.05) 70%)' }} />

            {/* Floating destination markers — a sense of the wider world, not literal pins on this photo */}
            <MapMarker label="Reykjavik" style={{ top: '20%', left: '14%' }} />
            <MapMarker label="Lisbon" style={{ top: '32%', right: '22%' }} />
            <MapMarker label="Kyoto" style={{ top: '14%', right: '38%' }} />
            <MapMarker label="Cappadocia" style={{ top: '44%', left: '38%' }} />

            <div className="relative h-full flex flex-col justify-end p-8 sm:p-12 max-w-lg">
              <h2 className="litl-serif text-4xl sm:text-5xl font-semibold text-white mb-3 leading-tight">
                Explore the world from a new perspective
              </h2>
              <p className="text-sm sm:text-base text-white/80 mb-7 leading-relaxed">
                Every discovery drops a pin. Watch your own map of the world fill in, one lucky trip at a time.
              </p>
              <Link
                to="/stats/world-map"
                className="inline-flex items-center gap-2 w-fit px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: 'white', color: '#ea580c' }}
              >
                Explore the map
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <RouteDivider />
      </div>

      {/* ══════════════════════════════
          ADVENTURE PASSES (PRICING)
      ══════════════════════════════ */}
      <section id="pricing" className="py-24" style={{ backgroundColor: '#fffaf3' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div ref={pricingRef} className={`reveal ${pricingVisible ? 'visible' : ''}`}>

            <div className="text-center mb-16">
              <p className="text-xs tracking-widest uppercase font-bold mb-3" style={{ color: '#f97316' }}>
                Adventure Passes
              </p>
              <h2 className="litl-serif text-4xl sm:text-5xl font-semibold text-stone-900">
                Choose your level of discovery
              </h2>
              <p className="text-stone-500 mt-3 text-sm">Start free. Upgrade when the wanderlust kicks in.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {PLANS.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`reveal reveal-delay-${i + 1} ${pricingVisible ? 'visible' : ''} rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                  style={plan.highlight ? {
                    background: 'linear-gradient(160deg, #ea580c 0%, #f97316 60%, #fb923c 100%)',
                    boxShadow: '0 8px 32px rgba(234,88,12,0.35)',
                  } : {
                    backgroundColor: '#ffffff',
                    border: '1px solid #fed7aa',
                    boxShadow: '0 2px 12px rgba(249,115,22,0.08)',
                  }}
                >
                  {plan.highlight ? (
                    <>
                      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,255,255,0.12) 0%, transparent 70%)' }} />
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-yellow-300 text-orange-900 shadow-sm whitespace-nowrap">
                          Most Popular
                        </span>
                      </div>
                    </>
                  ) : (
                    <FoldedCorner />
                  )}

                  <div className="relative">
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${plan.highlight ? 'text-orange-100' : 'text-stone-400'}`}>
                      {plan.name}
                    </p>
                    <p className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-stone-900'}`}>
                      {plan.price}
                      <span className={`text-sm font-normal ml-1 ${plan.highlight ? 'text-orange-100/70' : 'text-stone-400'}`}>{plan.period}</span>
                    </p>
                  </div>

                  <ul className="flex flex-col gap-2.5 flex-1 relative">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckIcon className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-yellow-300' : 'text-orange-500'}`} />
                        <span className={plan.highlight ? 'text-orange-50' : 'text-stone-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.ctaTo}
                    className={`relative w-full text-center py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                      plan.highlight
                        ? 'bg-white text-orange-600 hover:bg-orange-50'
                        : 'text-white'
                    }`}
                    style={plan.highlight ? {} : {
                      background: 'linear-gradient(135deg, #ea580c, #f97316)',
                      boxShadow: '0 2px 8px rgba(234,88,12,0.2)',
                    }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          TRUST STRIP
      ══════════════════════════════ */}
      <section className="py-14" style={{ backgroundColor: '#fff7ed' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div ref={trustRef} className={`reveal ${trustVisible ? 'visible' : ''} text-center`}>
            <p className="text-xs tracking-widest uppercase font-bold mb-7" style={{ color: '#c2410c', opacity: 0.7 }}>
              Inspired by travellers everywhere
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {TRUST_MARKS.map((mark) => (
                <span key={mark} className="litl-serif text-lg sm:text-xl font-semibold text-stone-400 tracking-wide">
                  {mark}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          STATS
      ══════════════════════════════ */}
      <section className="py-20" style={{ backgroundColor: '#fffaf3', borderTop: '1px dashed rgba(251,146,60,0.25)', borderBottom: '1px dashed rgba(251,146,60,0.25)' }}>
        <div ref={statsRef} className={`reveal ${statsVisible ? 'visible' : ''} max-w-6xl mx-auto px-6 sm:px-8`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`reveal reveal-delay-${i + 1} ${statsVisible ? 'visible' : ''}`}>
                <p className="litl-serif text-3xl sm:text-4xl font-semibold tabular-nums mb-1" style={{ color: '#ea580c' }}>
                  {stat.value}
                </p>
                <p className="text-sm text-stone-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/stats" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80" style={{ color: '#ea580c' }}>
              Explore the full stats <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          NEWSLETTER / FINAL CTA
      ══════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: '#fff7ed' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div
            ref={newsletterRef}
            className={`reveal ${newsletterVisible ? 'visible' : ''} relative rounded-4xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-8 sm:p-12 overflow-hidden`}
            style={{ backgroundColor: '#fffaf3', border: '1px solid rgba(251,146,60,0.25)', boxShadow: '0 8px 32px rgba(249,115,22,0.1)' }}
          >
            {/* Postmark micro-detail — very low opacity, purely decorative */}
            <div
              aria-hidden="true"
              className="hidden sm:flex absolute items-center justify-center rounded-full"
              style={{ top: '18px', right: '18px', width: '84px', height: '84px', border: '1.5px dashed rgba(234,88,12,0.25)', color: '#ea580c', opacity: 0.35 }}
            >
              <span className="litl-serif italic text-[10px] tracking-widest -rotate-12">PAR AVION</span>
            </div>

            <div className="relative">
              <p className="text-xs tracking-widest uppercase font-bold mb-3" style={{ color: '#f97316' }}>
                Stay inspired
              </p>
              <h2 className="litl-serif text-4xl sm:text-5xl font-semibold text-stone-900 mb-4">
                Get travel inspiration to your inbox
              </h2>
              <p className="text-sm text-stone-500 mb-7 leading-relaxed max-w-md">
                Tips, hidden gems and lucky destinations — straight to you. Newsletter coming soon; sign up to be first in line.
              </p>

              {subscribed ? (
                <p className="text-sm font-semibold" style={{ color: '#ea580c' }}>
                  Thanks — we'll let you know when it launches. ✦
                </p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    aria-label="Email address"
                    className="flex-1 px-4 py-3 rounded-2xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none"
                    style={{ backgroundColor: 'white', border: '1px solid rgba(251,146,60,0.3)' }}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 2px 8px rgba(234,88,12,0.2)' }}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            <div className="hidden lg:block relative w-72 shrink-0 justify-self-end">
              <div className="rounded-3xl overflow-hidden border-[6px] border-white" style={{ boxShadow: '0 4px 8px rgba(60,25,0,0.1), 0 16px 32px rgba(60,25,0,0.18)' }}>
                <img
                  src={PHOTOS.travelFlatlay}
                  alt="Camera, compass, world map and a stamped passport cover laid out on a table"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer style={{ backgroundColor: '#0c0500' }} className="py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="border-t border-dashed mb-8" style={{ borderColor: 'rgba(251,146,60,0.15)' }} />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight" style={{ color: 'rgba(255,255,255,0.7)' }}>Leave It To Luck</span>
              <span className="font-mono text-xs" style={{ color: 'rgba(251,146,60,0.3)' }}>· LITL</span>
            </div>
            <div className="flex items-center gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
              {[['/', 'Home'], ['/travel', 'Travel'], ['/stats', 'Statistics'], ['/#pricing', 'Pricing'], ['/login', 'Sign In']].map(([href, label]) =>
                href.startsWith('#') || href === '/#pricing'
                  ? <a key={label} href={href} className="hover:text-orange-400 transition-colors">{label}</a>
                  : <Link key={label} to={href} className="hover:text-orange-400 transition-colors">{label}</Link>
              )}
            </div>
            <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.18)' }}>© 2026 LITL</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

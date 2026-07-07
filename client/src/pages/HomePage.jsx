import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

/* ─── Decorative SVG helpers ─── */

function Sparkle({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="#fde68a"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <polygon points="8,0.5 9.8,5.8 15.5,5.8 11,9.2 12.8,14.5 8,11 3.2,14.5 5,9.2 0.5,5.8 6.2,5.8" />
    </svg>
  )
}

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

/** Passport-stamp style decoration for the hero collage. */
function PassportStamp({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="4 5" opacity="0.8" />
      <circle cx="60" cy="60" r="41" fill="none" stroke="#ea580c" strokeWidth="1.2" opacity="0.55" />
      <text x="60" y="40" textAnchor="middle" fill="#ea580c" fontSize="9" fontWeight="700" letterSpacing="2" opacity="0.85">LITL</text>
      <path
        d="M46 66l9-3 3-8 4 6 8-9 -3 10 8 2 -8 5 2 8 -8-3-3 7-4-6-9 3z"
        fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinejoin="round" opacity="0.9"
      />
      <text x="60" y="90" textAnchor="middle" fill="#ea580c" fontSize="8" fontWeight="700" letterSpacing="3" opacity="0.85">LUCK</text>
    </svg>
  )
}

function SuitcaseIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 160 140" className={className} aria-hidden="true">
      <rect x="18" y="42" width="124" height="86" rx="14" fill="#fff7ed" stroke="#ea580c" strokeWidth="3" />
      <rect x="60" y="22" width="40" height="22" rx="6" fill="none" stroke="#ea580c" strokeWidth="3" />
      <line x1="18" y1="76" x2="142" y2="76" stroke="#fdba74" strokeWidth="2.5" />
      <rect x="70" y="66" width="20" height="20" rx="4" fill="#f97316" opacity="0.9" />
      <circle cx="40" cy="58" r="4" fill="#fb923c" />
      <circle cx="120" cy="100" r="3" fill="#fb923c" />
      <path d="M30 100c4-6 10-6 14 0" stroke="#fb923c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M108 58c4-6 10-6 14 0" stroke="#fb923c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
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

/* ─── Feature strip icons (thin outline, single color) ─── */

function IconPersonalised({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
      <path strokeLinecap="round" d="M9 9.75h.01M15 9.75h.01" />
    </svg>
  )
}

function IconSurprise({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6" />
      <circle cx="12" cy="12" r="3.4" />
    </svg>
  )
}

function IconTrusted({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5l7 2.7v5.1c0 4.4-2.9 7.9-7 9.2-4.1-1.3-7-4.8-7-9.2V6.2l7-2.7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.2l2.1 2.1 3.9-4.3" />
    </svg>
  )
}

function IconSimple({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L4.5 13.5H11L10 21l8.5-10.5H12L13 3z" />
    </svg>
  )
}

const FEATURES = [
  { title: 'Personalised', desc: 'Just for you', Icon: IconPersonalised },
  { title: 'Surprise', desc: 'Something new', Icon: IconSurprise },
  { title: 'Trusted', desc: 'Real experiences', Icon: IconTrusted },
  { title: 'Simple', desc: 'In just one click', Icon: IconSimple },
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
  oiaSantorini: 'https://images.pexels.com/photos/15532995/pexels-photo-15532995.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940&fm=jpg',
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
        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left: headline + copy + CTA */}
          <div className="relative" style={{ animation: 'fadeInUp 0.7s ease forwards' }}>
            <CompassRose
              className="hidden lg:block absolute w-96 h-96 pointer-events-none text-orange-900"
              style={{ top: '-70px', left: '-140px', opacity: 0.045 }}
            />

            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ backgroundColor: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.18)', color: '#c2410c' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
              Let luck choose
            </div>

            <h1 className="relative litl-serif text-5xl sm:text-6xl font-semibold text-stone-900 leading-[1.08] mb-6">
              Don&rsquo;t overthink it.
              <br />
              <span style={{ color: '#ea580c' }}>Leave it to luck.</span>
            </h1>

            <p className="relative text-base sm:text-lg text-stone-500 max-w-md leading-relaxed mb-9">
              We&rsquo;ll find a destination that fits your mood, your budget and your sense of adventure — no endless tab-hopping required.
            </p>

            <Link
              to="/travel"
              className="relative inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 3px 14px rgba(234,88,12,0.28)' }}
            >
              Find My Destination
              <ArrowRight />
            </Link>

            {/* Boarding-pass flourish — quiet travel detail, fills the whitespace under the CTA */}
            <div
              className="relative mt-9 pt-4 flex items-center gap-3 max-w-xs"
              style={{ borderTop: '1px dashed rgba(234,88,12,0.25)' }}
            >
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-400">Anywhere</span>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#fb923c" aria-hidden="true">
                <path d="M3 11h13.5l-4-4 1.4-1.4L21 12l-7.1 6.4-1.4-1.4 4-4H3z" />
              </svg>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-400">Somewhere lucky</span>
            </div>
          </div>

          {/* Right: layered postcard photo collage */}
          <div className="relative mx-auto w-full max-w-sm h-[380px] sm:h-[440px] lg:h-[460px]">
            {/* Dashed route line drifting behind the photos */}
            <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)] pointer-events-none" style={{ opacity: 0.35 }}>
              <path
                d="M10 340 C 90 260 60 160 150 120 S 300 90 380 40"
                stroke="#ea580c" strokeWidth="2" fill="none" strokeDasharray="2 10" strokeLinecap="round"
              />
              <path d="M370 30 l10 10 -14 4 4-14z" fill="#ea580c" />
            </svg>

            {/* Main photo */}
            <div
              className="absolute top-2 right-0 w-[78%] h-[72%] rounded-[26px] overflow-hidden border-[6px] border-white shadow-2xl"
              style={{ transform: 'rotate(-4deg)' }}
            >
              <img
                src={PHOTOS.cliffs}
                alt="Turquoise coastline with sea cliffs"
                className="w-full h-full object-cover"
                style={{ objectPosition: '55% 35%' }}
                loading="eager"
              />
            </div>

            {/* Secondary photo, peeking bottom-left */}
            <div
              className="absolute bottom-0 left-0 w-[52%] h-[46%] rounded-[20px] overflow-hidden border-[6px] border-white shadow-xl z-10"
              style={{ transform: 'rotate(6deg)' }}
            >
              <img
                src={PHOTOS.oiaSantorini}
                alt="Blue-domed church overlooking the Santorini caldera"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            {/* Washi-tape accents */}
            <div aria-hidden="true" className="absolute -top-2 right-10 w-14 h-5 rounded-sm shadow-sm z-20" style={{ background: 'rgba(253,186,116,0.75)', transform: 'rotate(10deg)' }} />
            <div aria-hidden="true" className="absolute bottom-[42%] left-4 w-12 h-5 rounded-sm shadow-sm z-20" style={{ background: 'rgba(251,146,60,0.6)', transform: 'rotate(-8deg)' }} />

            {/* Passport stamp */}
            <PassportStamp className="absolute -bottom-6 -right-4 w-28 h-28 z-20" style={{ transform: 'rotate(8deg)' }} />

            <Sparkle className="absolute w-4 h-4 pointer-events-none z-20" style={{ top: '4%', left: '8%', animation: 'sparkle 4s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FEATURE STRIP
      ══════════════════════════════ */}
      <section className="py-10" style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
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
                  {plan.highlight && (
                    <>
                      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,255,255,0.12) 0%, transparent 70%)' }} />
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-yellow-300 text-orange-900 shadow-sm whitespace-nowrap">
                          Most Popular
                        </span>
                      </div>
                    </>
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
                      boxShadow: '0 2px 10px rgba(234,88,12,0.3)',
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
                    style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 3px 14px rgba(234,88,12,0.28)' }}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            <div className="hidden lg:flex justify-center relative">
              <SuitcaseIllustration className="w-56 h-48" />
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

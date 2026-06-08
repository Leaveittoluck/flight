import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

/* ─── Decorative SVG helpers ─── */

function Cloud({ opacity = 0.12, className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 200 70"
      fill="white"
      aria-hidden="true"
      className={className}
      style={{ opacity, ...style }}
    >
      <ellipse cx="70" cy="58" rx="55" ry="14" />
      <ellipse cx="110" cy="52" rx="60" ry="20" />
      <ellipse cx="148" cy="58" rx="44" ry="13" />
      <ellipse cx="88" cy="38" rx="36" ry="28" />
      <ellipse cx="130" cy="32" rx="38" ry="32" />
    </svg>
  )
}

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

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500 mt-0.5 shrink-0">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  )
}

/* ─── Data ─── */

const MOCK_DESTINATIONS = [
  {
    city: 'Reykjavik',
    country: 'Iceland',
    tagline: 'Northern lights, volcanic craters & thermal hot springs',
    mood: 'Adventure',
    price: '£420',
    accentColor: '#38bdf8',
    bgColor: '#f0f9ff',
  },
  {
    city: 'Lisbon',
    country: 'Portugal',
    tagline: 'Golden trams, ocean breeze & sun-warmed pastel tiles',
    mood: 'Cultural',
    price: '£290',
    accentColor: '#f59e0b',
    bgColor: '#fffbeb',
  },
  {
    city: 'Marrakech',
    country: 'Morocco',
    tagline: 'Spice markets, ancient riads & warm desert air',
    mood: 'Exotic',
    price: '£310',
    accentColor: '#f97316',
    bgColor: '#fff7ed',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Set Your Mood & Budget',
    desc: 'Tell us how you want to feel and what you can spend. Adventure, relaxation, culture — your call.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Luck Does the Work',
    desc: 'Leave It To Luck scans real flights and destination profiles to find somewhere unexpected — somewhere you\'d never have searched for yourself.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Discover & Book',
    desc: 'Review your matched destinations, explore the details, and book directly through trusted platforms.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    features: ['5 discoveries / month', 'Basic mood filters', 'Community stats'],
    cta: 'Start Free',
    ctaTo: '/travel',
    highlight: false,
  },
  {
    name: 'Explorer',
    price: '£9.99',
    period: 'per month',
    features: ['Unlimited discoveries', 'Advanced filters', 'Seasonal insights', 'Priority results'],
    cta: 'Start Exploring',
    ctaTo: '/register',
    highlight: true,
  },
  {
    name: 'Nomad',
    price: '£24.99',
    period: 'per month',
    features: ['Everything in Explorer', 'Concierge matching', 'Exclusive destinations', 'Rewards'],
    cta: 'Go Nomad',
    ctaTo: '/register',
    highlight: false,
  },
]

const STATS = [
  { value: '2,400+', label: 'Destinations generated' },
  { value: '94', label: 'Countries covered' },
  { value: '12', label: 'Trip moods' },
  { value: '1,800+', label: 'Travellers inspired' },
]

const HERO_BG = 'linear-gradient(160deg, #1c0f00 0%, #92400e 22%, #c2410c 45%, #f97316 68%, #fbbf24 92%)'
const CTA_BG  = 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fbbf24 100%)'

/* ─── Component ─── */

export default function HomePage() {
  const [howRef,     howVisible]     = useReveal(0.1)
  const [destRef,    destVisible]    = useReveal(0.08)
  const [pricingRef, pricingVisible] = useReveal(0.08)
  const [statsRef,   statsVisible]   = useReveal(0.12)

  return (
    <div style={{ backgroundColor: '#fff7ed' }}>

      {/* ══════════════════════════════
          HERO — sunset gradient
      ══════════════════════════════ */}
      <section className="relative min-h-[94vh] flex items-center overflow-hidden" style={{ background: HERO_BG }}>

        {/* Sun glow blob */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none rounded-full"
          style={{
            top: '8%', right: '12%',
            width: '340px', height: '340px',
            background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(251,146,60,0.18) 40%, transparent 70%)',
            animation: 'sunGlow 9s ease-in-out infinite',
          }}
        />

        {/* Floating clouds */}
        <Cloud
          className="absolute w-52 sm:w-72 pointer-events-none"
          style={{ top: '10%', left: '6%', animation: 'cloudDrift 30s ease-in-out infinite' }}
          opacity={0.1}
        />
        <Cloud
          className="absolute w-36 sm:w-48 pointer-events-none"
          style={{ top: '35%', right: '4%', animation: 'cloudDriftLeft 24s ease-in-out infinite 5s' }}
          opacity={0.08}
        />
        <Cloud
          className="absolute w-44 sm:w-56 pointer-events-none"
          style={{ bottom: '22%', left: '20%', animation: 'cloudDrift 38s ease-in-out infinite 12s' }}
          opacity={0.07}
        />

        {/* Sparkles */}
        <Sparkle className="absolute w-4 h-4 pointer-events-none" style={{ top: '18%', left: '30%', animation: 'sparkle 3.5s ease-in-out infinite' }} />
        <Sparkle className="absolute w-3 h-3 pointer-events-none" style={{ top: '55%', right: '22%', animation: 'sparkle 4.2s ease-in-out infinite 1.2s' }} />
        <Sparkle className="absolute w-5 h-5 pointer-events-none" style={{ bottom: '30%', right: '38%', animation: 'sparkle 3s ease-in-out infinite 2.4s' }} />
        <Sparkle className="absolute w-3 h-3 pointer-events-none" style={{ top: '70%', left: '12%', animation: 'sparkle 4.8s ease-in-out infinite 0.8s' }} />

        {/* Animated route line */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <path
            d="M -50 340 C 200 315 450 360 700 325 S 1050 295 1300 315"
            stroke="#fde68a"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="6 12"
            opacity="0.2"
            style={{ animation: 'drawRoute 6s ease forwards' }}
          />
        </svg>

        {/* Hero content */}
        <div
          className="relative w-full max-w-5xl mx-auto px-6 sm:px-8 py-24 text-center"
          style={{ animation: 'fadeInUp 0.7s ease forwards' }}
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 inline-block" />
            ✦ Let luck choose.
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-5">
            Leave It
            <br />
            <span className="text-yellow-300">To Luck.</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-lg mx-auto leading-relaxed mb-10 font-light" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Stop overthinking your next trip. Tell us your mood and budget — we'll find a destination you'd never have chosen yourself.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/travel"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 20px rgba(234,88,12,0.45)' }}
            >
              Start Exploring
              <ArrowRight />
            </Link>
            <Link
              to="/stats"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}
            >
              Explore the Map
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════
          HOW IT WORKS — journey path
      ══════════════════════════════ */}
      <section id="how-it-works" className="py-24" style={{ backgroundColor: '#fff7ed' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div ref={howRef} className={`reveal ${howVisible ? 'visible' : ''}`}>

            <div className="text-center mb-16">
              <p className="text-xs tracking-widest uppercase font-bold mb-3" style={{ color: '#f97316' }}>
                The Journey
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                How it works
              </h2>
            </div>

            {/* Steps with connecting animated line */}
            <div className="relative">
              {/* Desktop animated dashed connector */}
              <div
                aria-hidden="true"
                className="absolute hidden md:block"
                style={{
                  top: '28px',
                  left: 'calc(16.67% + 30px)',
                  right: 'calc(16.67% + 30px)',
                  height: '2px',
                  background: 'repeating-linear-gradient(90deg, rgba(249,115,22,0.45) 0px, rgba(249,115,22,0.45) 8px, transparent 8px, transparent 18px)',
                  backgroundSize: '18px 2px',
                  animation: 'slideDash 1.2s linear infinite',
                  zIndex: 0,
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {HOW_IT_WORKS.map((item, i) => (
                  <div
                    key={item.step}
                    className={`reveal reveal-delay-${i + 1} ${howVisible ? 'visible' : ''} flex flex-col gap-4`}
                  >
                    {/* Circular icon — sits on the connecting line on desktop */}
                    <div
                      className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: '#fff7ed',
                        border: '2px solid #fdba74',
                        color: '#f97316',
                        boxShadow: '0 0 0 6px rgba(249,115,22,0.08)',
                      }}
                    >
                      {item.icon}
                    </div>

                    <div className="rounded-2xl p-5 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-1"
                      style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #fed7aa', boxShadow: '0 2px 12px rgba(249,115,22,0.08)' }}>
                      <p className="text-xs font-mono font-bold tracking-widest" style={{ color: '#fb923c' }}>{item.step}</p>
                      <h3 className="text-base font-bold text-stone-900">{item.title}</h3>
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
          SAMPLE DISCOVERIES
      ══════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: '#fef3c7' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div ref={destRef} className={`reveal ${destVisible ? 'visible' : ''}`}>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-xs tracking-widest uppercase font-bold mb-3" style={{ color: '#f97316' }}>
                  Where could you go?
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
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
                  className={`reveal reveal-delay-${i + 1} ${destVisible ? 'visible' : ''} rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer`}
                  style={{
                    backgroundColor: dest.bgColor,
                    border: `1px solid ${dest.accentColor}30`,
                    boxShadow: `0 2px 16px ${dest.accentColor}18`,
                  }}
                >
                  {/* Colored top accent */}
                  <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${dest.accentColor}, transparent)` }} />

                  <div className="p-5">
                    {/* Mood badge */}
                    <span
                      className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider"
                      style={{ backgroundColor: `${dest.accentColor}20`, color: dest.accentColor }}
                    >
                      {dest.mood}
                    </span>

                    <h3 className="text-2xl font-bold text-stone-900 mb-0.5">{dest.city}</h3>
                    <p className="text-sm text-stone-500 mb-3">{dest.country}</p>
                    <p className="text-sm text-stone-600 leading-relaxed mb-5">{dest.tagline}</p>

                    <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${dest.accentColor}25` }}>
                      <span className="text-xs text-stone-400">From</span>
                      <span
                        className="text-base font-bold px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${dest.accentColor}15`, color: dest.accentColor }}
                      >
                        {dest.price} <span className="text-xs font-normal opacity-70">/ person</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/travel"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 16px rgba(234,88,12,0.35)' }}
              >
                Discover your destinations
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          ADVENTURE PASSES (PRICING)
      ══════════════════════════════ */}
      <section id="pricing" className="py-24" style={{ backgroundColor: '#fff7ed' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div ref={pricingRef} className={`reveal ${pricingVisible ? 'visible' : ''}`}>

            <div className="text-center mb-16">
              <p className="text-xs tracking-widest uppercase font-bold mb-3" style={{ color: '#f97316' }}>
                Adventure Passes
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Choose your level of discovery
              </h2>
              <p className="text-stone-500 mt-3 text-sm">Start free. Upgrade when the wanderlust kicks in.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLANS.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`reveal reveal-delay-${i + 1} ${pricingVisible ? 'visible' : ''} rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                  style={plan.highlight ? {
                    background: 'linear-gradient(160deg, #ea580c 0%, #f97316 60%, #fb923c 100%)',
                    boxShadow: '0 8px 32px rgba(234,88,12,0.35)',
                  } : {
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    border: '1px solid #fed7aa',
                    boxShadow: '0 2px 12px rgba(249,115,22,0.08)',
                  }}
                >
                  {plan.highlight && (
                    <>
                      {/* Inner glow */}
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
                        <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-yellow-300' : 'text-orange-500'}`}>
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
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
          STATS — dark explorer atlas
      ══════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#1c0f00' }}>
        {/* Atlas map grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(251,146,60,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Warm center glow */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(234,88,12,0.12) 0%, transparent 70%)' }} />

        <div ref={statsRef} className={`reveal ${statsVisible ? 'visible' : ''} relative max-w-5xl mx-auto px-6 sm:px-8`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`reveal reveal-delay-${i + 1} ${statsVisible ? 'visible' : ''}`}>
                <p className="text-3xl sm:text-4xl font-bold tabular-nums mb-1" style={{ color: '#fb923c' }}>
                  {stat.value}
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/stats" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-100"
              style={{ color: 'rgba(251,146,60,0.55)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fb923c')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(251,146,60,0.55)')}
            >
              Explore the full stats <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FINAL CTA — orange invitation
      ══════════════════════════════ */}
      <section className="py-24 text-center relative overflow-hidden" style={{ background: CTA_BG }}>
        {/* Background sparkles */}
        <Sparkle className="absolute w-5 h-5 pointer-events-none" style={{ top: '20%', left: '8%', animation: 'sparkle 3s ease-in-out infinite', color: 'rgba(255,255,255,0.3)' }} />
        <Sparkle className="absolute w-4 h-4 pointer-events-none" style={{ bottom: '25%', right: '10%', animation: 'sparkle 4s ease-in-out infinite 1.5s', color: 'rgba(255,255,255,0.25)' }} />
        <Sparkle className="absolute w-3 h-3 pointer-events-none" style={{ top: '60%', left: '22%', animation: 'sparkle 3.5s ease-in-out infinite 2s', color: 'rgba(255,255,255,0.2)' }} />

        <div className="relative max-w-xl mx-auto px-6 sm:px-8">
          <p className="text-xs tracking-widest uppercase font-bold mb-4 text-white/70">
            Ready for adventure?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Where will luck take you?
          </h2>
          <p className="text-orange-100/75 text-sm mb-8 leading-relaxed">
            Set your budget. Pick your mood. Leave the rest to Leave It To Luck.
          </p>
          <Link
            to="/travel"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{ backgroundColor: 'white', color: '#ea580c', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
          >
            Start for free
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer style={{ backgroundColor: '#0c0500' }} className="py-10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
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

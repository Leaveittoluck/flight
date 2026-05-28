import { Link } from 'react-router-dom'

const MOCK_DESTINATIONS = [
  {
    city: 'Reykjavik',
    country: 'Iceland',
    tagline: 'Northern lights, volcanic craters & thermal springs',
    mood: 'Adventure',
    price: '£420',
    accent: 'linear-gradient(to right, #bae6fd, #7dd3fc)',
  },
  {
    city: 'Lisbon',
    country: 'Portugal',
    tagline: 'Golden trams, ocean breeze & sun-warmed pastel tiles',
    mood: 'Cultural',
    price: '£290',
    accent: 'linear-gradient(to right, #fde68a, #fbbf24)',
  },
  {
    city: 'Marrakech',
    country: 'Morocco',
    tagline: 'Spice markets, ancient riads & warm desert air',
    mood: 'Exotic',
    price: '£310',
    accent: 'linear-gradient(to right, #fed7aa, #fb923c)',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Set Your Mood & Budget',
    desc: 'Tell us how you want to feel and what you want to spend. Adventure, relaxation, culture — your call.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
        />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'We Map Your Match',
    desc: 'Our platform searches real flight data and destination profiles to surface your perfect escape.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
        />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Discover & Book',
    desc: 'Review your matched destinations, explore details, and book directly with trusted travel platforms.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
        />
      </svg>
    ),
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    features: [
      '5 destination discoveries / month',
      'Basic mood filters',
      'Community statistics',
    ],
    cta: 'Get Started',
    ctaTo: '/travel',
    highlight: false,
  },
  {
    name: 'Explorer',
    price: '£9.99',
    period: 'per month',
    features: [
      'Unlimited discoveries',
      'Advanced mood & season filters',
      'Seasonal destination insights',
      'Priority results',
    ],
    cta: 'Start Exploring',
    ctaTo: '/register',
    highlight: true,
  },
  {
    name: 'Nomad',
    price: '£24.99',
    period: 'per month',
    features: [
      'Everything in Explorer',
      'Concierge destination matching',
      'Exclusive hidden gems',
      'Rewards & travel discounts',
    ],
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

function ArrowRight({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-500 mt-0.5 shrink-0">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className="bg-stone-50">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-stone-950">
        {/* Warm atmospheric ambient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 65% 35%, rgba(180,120,40,0.2) 0%, transparent 65%), radial-gradient(ellipse 50% 45% at 10% 75%, rgba(80,50,160,0.1) 0%, transparent 60%)',
          }}
        />
        {/* Film grain texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative w-full max-w-5xl mx-auto px-6 sm:px-8 py-24 text-center">
          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/60 text-xs tracking-widest uppercase font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Travel Discovery Platform
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white tracking-tight leading-[1.07] mb-5">
            Let the world
            <br />
            <span className="text-amber-400">surprise you.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-white/55 max-w-lg mx-auto leading-relaxed mb-10 font-light">
            Tell us your mood and budget — we'll surface destinations you'd never have chosen yourself.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/travel"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold transition-colors shadow-lg shadow-amber-900/25"
            >
              Start Exploring
              <ArrowRight />
            </Link>
            <Link
              to="/stats"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-medium transition-colors"
            >
              Explore the Map
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/25">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-5 h-5 animate-bounce"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-amber-600 font-medium mb-3">
              The Experience
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-stone-300 font-mono text-xs tracking-widest">
                    {item.step}
                  </span>
                  <div className="h-px flex-1 bg-stone-100" />
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 w-fit">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Destinations Preview ─── */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs tracking-widest uppercase text-amber-600 font-medium mb-3">
                Where could you go?
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
                Sample discoveries
              </h2>
            </div>
            <Link
              to="/travel"
              className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-amber-600 transition-colors font-medium shrink-0"
            >
              Unlock yours <ArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {MOCK_DESTINATIONS.map((dest) => (
              <div
                key={dest.city}
                className="relative rounded-2xl border border-stone-200 bg-white p-5 overflow-hidden shadow-sm"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: dest.accent }}
                />
                <div className="mb-3">
                  <span className="text-xs text-stone-400 uppercase tracking-wider font-medium">
                    {dest.mood}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-0.5">{dest.city}</h3>
                <p className="text-sm text-stone-400 mb-4">{dest.country}</p>
                <p className="text-sm text-stone-600 leading-relaxed mb-5">{dest.tagline}</p>
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <span className="text-xs text-stone-400">From</span>
                  <span className="text-base font-semibold text-stone-900">
                    {dest.price}{' '}
                    <span className="text-xs font-normal text-stone-400">/ person</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/travel"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors"
            >
              Discover your destinations
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Subscription Plans ─── */}
      <section id="pricing" className="py-24 bg-white border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-amber-600 font-medium mb-3">
              Plans
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Find your level of discovery
            </h2>
            <p className="text-stone-500 mt-3 text-sm">
              Start free. Upgrade when you're ready to explore further.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 flex flex-col gap-5 relative ${
                  plan.highlight
                    ? 'border-amber-300 bg-amber-50 shadow-md shadow-amber-100/80'
                    : 'border-stone-200 bg-white'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold tracking-wide whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-stone-500 mb-1">{plan.name}</p>
                  <p className="text-3xl font-semibold text-stone-900">
                    {plan.price}
                    <span className="text-sm font-normal text-stone-400 ml-1">
                      {plan.period}
                    </span>
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.ctaTo}
                  className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-amber-500 hover:bg-amber-400 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-900'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Preview ─── */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-semibold text-amber-400 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-white/45">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/stats"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors"
            >
              Explore the full stats
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-24 bg-white border-t border-stone-100 text-center">
        <div className="max-w-xl mx-auto px-6 sm:px-8">
          <p className="text-xs tracking-widest uppercase text-amber-600 font-medium mb-4">
            Ready?
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight mb-4">
            Where will luck take you?
          </h2>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">
            Set your budget. Pick your mood. Let our platform find a destination that surprises you.
          </p>
          <Link
            to="/travel"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition-colors"
          >
            Start for free
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-stone-950 py-10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <span className="text-white/70 font-semibold text-sm tracking-tight">
              Leave It To Luck
            </span>
            <div className="flex items-center gap-5 text-xs text-white/35">
              <Link to="/" className="hover:text-white/60 transition-colors">
                Home
              </Link>
              <Link to="/travel" className="hover:text-white/60 transition-colors">
                Travel
              </Link>
              <Link to="/stats" className="hover:text-white/60 transition-colors">
                Statistics
              </Link>
              <a href="/#pricing" className="hover:text-white/60 transition-colors">
                Pricing
              </a>
              <Link to="/login" className="hover:text-white/60 transition-colors">
                Sign In
              </Link>
            </div>
            <span className="text-xs text-white/25">© 2026 Leave It To Luck</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

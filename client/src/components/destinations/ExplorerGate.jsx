import { Link } from 'react-router-dom'

const FEATURES = [
  'Hidden Gems',
  'Local Recommendations',
  'Complete Destination Guide',
  'Weather Insights',
  'Packing Tips',
  'Ad-Free Experience',
]

export default function ExplorerGate() {
  return (
    <section
      className="reveal reveal-delay-3 pt-8 pb-10"
      style={{ borderBottom: '1px solid rgba(231,229,228,0.7)' }}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{ border: '1.5px solid rgba(217,119,6,0.22)' }}
      >
        {/* Accent stripe */}
        <div
          aria-hidden="true"
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #c2410c, #ea580c, #f97316, #fbbf24)',
          }}
        />

        <div className="px-6 py-8 sm:px-10" style={{ backgroundColor: '#fffbeb' }}>
          {/* Lock icon */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(234,88,12,0.08), rgba(251,191,36,0.12))',
              border: '1.5px solid rgba(217,119,6,0.2)',
            }}
          >
            <span role="img" aria-label="locked" style={{ fontSize: '1rem' }}>🔒</span>
          </div>

          {/* Heading */}
          <h3
            className="text-xl sm:text-2xl font-bold mb-2"
            style={{ color: '#1c1917' }}
          >
            Continue Exploring
          </h3>

          {/* Subtitle */}
          <p
            className="text-sm leading-relaxed mb-7"
            style={{ color: '#78716c', maxWidth: '480px' }}
          >
            Become an Explorer to unlock the complete destination guide.
          </p>

          {/* Feature list */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 mb-8">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2.5 text-sm font-medium"
                style={{ color: '#1c1917' }}
              >
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black text-white leading-none"
                  style={{ background: 'linear-gradient(135deg, #c2410c, #f97316)' }}
                >
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          {/* Primary CTA */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            style={{
              background: 'linear-gradient(135deg, #ea580c, #f97316)',
              boxShadow: '0 4px 14px rgba(234,88,12,0.28)',
            }}
          >
            Become an Explorer
          </Link>

          {/* Secondary note */}
          <p className="mt-5 text-xs" style={{ color: '#a8a29e' }}>
            Already an Explorer?{' '}
            <span style={{ color: '#78716c', fontWeight: 500 }}>
              You're seeing the full guide automatically.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

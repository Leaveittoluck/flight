import {
  REGIONS,
  HOT_DESTINATIONS,
  EXPLORATION_METRICS,
  ROUTE_DOTS,
  ROUTE_PATHS,
} from '../../data/statsData'

export default function WorldExploration({ countriesCount }) {
  return (
    <div className="rounded-2xl overflow-hidden relative" style={{ backgroundColor: '#0f172a' }}>

      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Ambient centre glow — slow pulse */}
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 38%, rgba(59,130,246,0.07) 0%, transparent 70%)',
          animationDuration: '4s',
        }}
      />

      {/* SVG travel route layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 700 260"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {ROUTE_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="rgba(96,165,250,0.11)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 6"
            />
          ))}
          {ROUTE_DOTS.map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="7"   fill="rgba(59,130,246,0.07)" />
              <circle cx={cx} cy={cy} r="2.5" fill="rgba(96,165,250,0.5)"  />
            </g>
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">

        {/* Header row: title + metrics */}
        <div className="flex items-start justify-between gap-6 flex-wrap mb-7">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              World Exploration
            </p>
            <p className="text-3xl font-extrabold text-white mb-1">
              {countriesCount} Countries
            </p>
            <p className="text-sm text-slate-400">
              Destinations discovered by LITL travelers — growing every day
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {EXPLORATION_METRICS.map((m) => (
              <div key={m.label} className="flex items-center gap-2 text-xs">
                <span>{m.icon}</span>
                <span className="text-slate-500">{m.label}:</span>
                <span className="text-slate-300 font-semibold">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div className="space-y-5">
          {REGIONS.map((region) => (
            <div key={region.label}>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2.5">
                {region.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {region.destinations.map((d) => {
                  const isHot = HOT_DESTINATIONS.has(d)
                  return (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 cursor-default"
                      style={{
                        backgroundColor: isHot ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.18)',
                        border: `1px solid ${isHot ? 'rgba(96,165,250,0.55)' : 'rgba(59,130,246,0.3)'}`,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 12px rgba(59,130,246,0.4)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '' }}
                    >
                      {isHot ? '🔥' : '📍'} {d}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 mt-7">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <p className="text-xs text-slate-600">Interactive world map · Phase 3</p>
        </div>

      </div>
    </div>
  )
}

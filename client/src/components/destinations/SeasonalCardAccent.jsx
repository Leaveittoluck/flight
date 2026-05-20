/**
 * Lightweight seasonal SVG accent for destination card heroes.
 * Positioned absolutely in the top-right corner of the hero section.
 * Very low opacity — purely atmospheric, never distracting.
 */

function SpringAccent({ color }) {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <ellipse cx="24" cy="30" rx="9" ry="14" transform="rotate(-25 24 30)" fill={color} />
      <ellipse cx="30" cy="26" rx="9" ry="14" transform="rotate(20 30 26)" fill={color} opacity="0.7" />
      <ellipse cx="19" cy="22" rx="7" ry="11" transform="rotate(-55 19 22)" fill={color} opacity="0.5" />
      <line x1="25" y1="45" x2="23" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SummerAccent({ color }) {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="26" cy="26" r="9" fill={color} />
      <line x1="26" y1="4"  x2="26" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="39" x2="26" y2="48" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="4"  y1="26" x2="13" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="39" y1="26" x2="48" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="10" x2="16" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="36" x2="42" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="10" x2="36" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="36" x2="10" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function AutumnAccent({ color }) {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path
        d="M26 5 L22 15 L13 13 L18 21 L7 23 L16 28 L12 36 L22 31 L24 48 L26 44 L28 48 L30 31 L40 36 L36 28 L45 23 L34 21 L39 13 L30 15 Z"
        fill={color}
      />
    </svg>
  )
}

function WinterAccent({ color }) {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <line x1="26" y1="4"    x2="26" y2="48"   stroke={color} strokeWidth="2"   strokeLinecap="round" />
      <line x1="4"  y1="26"   x2="48" y2="26"   stroke={color} strokeWidth="2"   strokeLinecap="round" />
      <line x1="9"  y1="9"    x2="43" y2="43"   stroke={color} strokeWidth="2"   strokeLinecap="round" />
      <line x1="43" y1="9"    x2="9"  y2="43"   stroke={color} strokeWidth="2"   strokeLinecap="round" />
      {/* branch ticks on the vertical arm */}
      <line x1="26" y1="13" x2="20" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="13" x2="32" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="39" x2="20" y2="33" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="39" x2="32" y2="33" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* branch ticks on the horizontal arm */}
      <line x1="13" y1="26" x2="19" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="26" x2="19" y2="32" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="39" y1="26" x2="33" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="39" y1="26" x2="33" y2="32" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="22" y="22" width="8" height="8" transform="rotate(45 26 26)" fill={color} />
    </svg>
  )
}

const ACCENT_COMPONENTS = {
  spring: SpringAccent,
  summer: SummerAccent,
  autumn: AutumnAccent,
  winter: WinterAccent,
}

export default function SeasonalCardAccent({ season, color }) {
  const Accent = ACCENT_COMPONENTS[season]
  if (!Accent || !color) return null

  return (
    <div
      aria-hidden="true"
      className="absolute top-4 right-4 pointer-events-none select-none"
      style={{ opacity: 0.13 }}
    >
      <Accent color={color} />
    </div>
  )
}

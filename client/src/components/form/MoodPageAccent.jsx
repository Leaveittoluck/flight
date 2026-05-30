/* ──────────────────────────────────────────────────────────────────────
   MoodPageAccent
   External mood illustration rendered OUTSIDE the form card.
   Enters from the left page edge and settles behind the form's
   upper-left corner (form card has a higher z-index and sits on top).

   Visible zone inside this component:
   - Container positioned at left:-70px → first ~70px sticks out left.
   - Container width ~165px → visible zone = left < ~42%.
   - Container positioned at top:50px → no "above form" zone.
   - All particles / key SVG elements placed at left < 42%.

   Mood values come from MOOD_OPTIONS (moodOptions.js):
     beach | city_break | adventure | cultural | skiing | relaxation
   ────────────────────────────────────────────────────────────────────── */

/* ── Shared particle helpers ─────────────────────────────────────────── */

function GlowStar({ top, left, delay, size, color }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', top, left, animation: `sparkle 3.5s ease-in-out infinite ${delay}` }}
    >
      <svg viewBox="0 0 16 16" fill={color} style={{ width: size, height: size, display: 'block' }}>
        <polygon points="8,0.5 9.8,5.8 15.5,5.8 11,9.2 12.8,14.5 8,11 3.2,14.5 5,9.2 0.5,5.8 6.2,5.8" />
      </svg>
    </div>
  )
}

function Flake({ top, left, delay, dur, size }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', top, left, animation: `snowFall ${dur} ease-in-out infinite ${delay}` }}
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"
        style={{ width: size, height: size, display: 'block' }}>
        <line x1="10" y1="1"  x2="10" y2="19" />
        <line x1="1"  y1="10" x2="19" y2="10" />
        <line x1="3"  y1="3"  x2="17" y2="17" />
        <line x1="17" y1="3"  x2="3"  y2="17" />
        <circle cx="10" cy="10" r="2.2" fill="#93c5fd" stroke="none" />
      </svg>
    </div>
  )
}

/* ── Beach & Sun ──────────────────────────────────────────────────────── */

function BeachVisual() {
  return (
    <>
      <svg viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" style={{ width: '90px', height: '110px', display: 'block' }}>
        {/* Sun — upper right, adds depth even if partially behind form */}
        <circle cx="70" cy="18" r="14" fill="#fde68a" opacity="0.25" />
        <circle cx="70" cy="18" r="9"  fill="#fbbf24" opacity="0.85" />
        {/* Palm trunk curving up to ~mid */}
        <path d="M8 110 Q14 82 38 60"
          stroke="#92400e" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Fronds from trunk tip — spread in all directions */}
        <path d="M38 60 Q22 42 6  44" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M38 60 Q32 38 30 24" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M38 60 Q50 40 66 45" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M38 60 Q54 52 72 56" stroke="#16a34a" strokeWidth="2"   strokeLinecap="round" fill="none" />
        {/* Coconuts */}
        <circle cx="37" cy="63" r="3"   fill="#78350f" />
        <circle cx="40" cy="61" r="2.8" fill="#92400e" />
        {/* Waves */}
        <path d="M0 90 Q11 84 22 90 Q33 96 44 90 Q55 84 66 90 Q75 94 84 90"
          stroke="#0ea5e9" strokeWidth="2.2" fill="none" strokeLinecap="round"
          style={{ animation: 'waveDrift 3s ease-in-out infinite' }} />
        <path d="M0 104 Q11 98 22 104 Q33 110 44 104 Q55 98 66 104 Q75 108 84 104"
          stroke="#7dd3fc" strokeWidth="1.8" fill="none" strokeLinecap="round"
          style={{ animation: 'waveDrift 3.8s ease-in-out infinite 0.9s' }} />
      </svg>

      {/* Sparkles — all in left < 42% */}
      <GlowStar top="6%"  left="8%"  delay="0s"   size="10px" color="#fbbf24" />
      <GlowStar top="16%" left="26%" delay="1.1s" size="8px"  color="#fde68a" />
      <GlowStar top="24%" left="10%" delay="2.3s" size="9px"  color="#fbbf24" />
      {/* Water drops */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '62%', left: '6%',
        width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#bae6fd',
        animation: 'heartFloat 2.8s ease-in-out infinite 0.4s' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '55%', left: '20%',
        width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#7dd3fc',
        animation: 'heartFloat 3.4s ease-in-out infinite 1.5s' }} />
    </>
  )
}

/* ── City Break ───────────────────────────────────────────────────────── */

function CityBreakVisual() {
  return (
    <>
      <svg viewBox="0 0 90 105" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" style={{ width: '90px', height: '105px', display: 'block' }}>
        {/* Ground line */}
        <line x1="0" y1="102" x2="90" y2="102" stroke="#64748b" strokeWidth="1.5" />
        {/* Buildings — vary heights, left-leaning so ~70px are visible */}
        <rect x="0"  y="72" width="14" height="30" rx="1" fill="#6366f1" opacity="0.6" />
        <rect x="16" y="54" width="18" height="48" rx="1" fill="#4f46e5" opacity="0.7" />
        <rect x="36" y="30" width="22" height="72" rx="1" fill="#4338ca" opacity="0.82" />
        <rect x="60" y="46" width="18" height="56" rx="1" fill="#3730a3" opacity="0.75" />
        <rect x="80" y="64" width="10" height="38" rx="1" fill="#4338ca" opacity="0.65" />
        {/* Windows on central tower — cityTwinkle */}
        <rect x="40" y="36" width="4" height="4" rx="0.5" fill="#fde68a"
          style={{ animation: 'cityTwinkle 2.1s ease-in-out infinite' }} />
        <rect x="48" y="36" width="4" height="4" rx="0.5" fill="#fde68a"
          style={{ animation: 'cityTwinkle 2.1s ease-in-out infinite 0.4s' }} />
        <rect x="40" y="44" width="4" height="4" rx="0.5" fill="#fde68a"
          style={{ animation: 'cityTwinkle 2.8s ease-in-out infinite 0.8s' }} />
        <rect x="48" y="44" width="4" height="4" rx="0.5" fill="#fde68a"
          style={{ animation: 'cityTwinkle 2.3s ease-in-out infinite 1.2s' }} />
        <rect x="40" y="52" width="4" height="4" rx="0.5" fill="#fde68a"
          style={{ animation: 'cityTwinkle 1.9s ease-in-out infinite 0.2s' }} />
        <rect x="48" y="52" width="4" height="4" rx="0.5" fill="#fde68a"
          style={{ animation: 'cityTwinkle 2.5s ease-in-out infinite 1.6s' }} />
        {/* Windows left building */}
        <rect x="19" y="60" width="4" height="4" rx="0.5" fill="#fde68a"
          style={{ animation: 'cityTwinkle 2.4s ease-in-out infinite 0.6s' }} />
        <rect x="26" y="60" width="4" height="4" rx="0.5" fill="#fde68a"
          style={{ animation: 'cityTwinkle 3.0s ease-in-out infinite 1.0s' }} />
        <rect x="19" y="68" width="4" height="4" rx="0.5" fill="#fde68a"
          style={{ animation: 'cityTwinkle 2.2s ease-in-out infinite 1.8s' }} />
        {/* Moon — upper left, fully in visible zone */}
        <circle cx="14" cy="18" r="11" fill="#fef9c3" opacity="0.55" />
        <circle cx="19" cy="13" r="9"  fill="#fff7ed" opacity="0.82" />
      </svg>

      {/* Star particles — left < 42% */}
      <GlowStar top="5%"  left="5%"  delay="0s"   size="8px"  color="#fde68a" />
      <GlowStar top="13%" left="32%" delay="1.0s" size="7px"  color="#fef9c3" />
      <GlowStar top="22%" left="12%" delay="2.1s" size="9px"  color="#fbbf24" />
      <GlowStar top="30%" left="38%" delay="0.7s" size="7px"  color="#fde68a" />
    </>
  )
}

/* ── Adventure ────────────────────────────────────────────────────────── */

function AdventureVisual() {
  return (
    <>
      <svg viewBox="0 0 90 105" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" style={{ width: '90px', height: '105px', display: 'block' }}>
        {/* Mountains */}
        <path d="M0 105 L34 28 L68 105 Z"  fill="#16a34a" opacity="0.65" />
        <path d="M24 105 L54 46 L84 105 Z" fill="#15803d" opacity="0.82" />
        {/* Snow caps */}
        <path d="M34 28 L27 50 L41 50 Z"   fill="white" opacity="0.9" />
        <path d="M54 46 L48 64 L60 64 Z"   fill="white" opacity="0.85" />
        {/* Compass background */}
        <circle cx="18" cy="22" r="14" fill="white" opacity="0.88"
          stroke="#d97706" strokeWidth="1.5" />
        <circle cx="18" cy="22" r="2.5" fill="#d97706" />
        {/* Tick marks */}
        <line x1="18" y1="9"  x2="18" y2="12" stroke="#d97706" strokeWidth="1.2" />
        <line x1="18" y1="32" x2="18" y2="35" stroke="#d97706" strokeWidth="1.2" />
        <line x1="5"  y1="22" x2="8"  y2="22" stroke="#d97706" strokeWidth="1.2" />
        <line x1="28" y1="22" x2="31" y2="22" stroke="#d97706" strokeWidth="1.2" />
        {/* Compass needle — rotates around centre (18,22) */}
        <g style={{ transformOrigin: '18px 22px', animation: 'compassSpin 5s ease-in-out infinite' }}>
          <line x1="18" y1="10" x2="18" y2="22"
            stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="18" y1="22" x2="18" y2="34"
            stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Dotted route */}
        <path d="M42 78 Q52 64 60 70 Q68 76 74 58"
          stroke="#d97706" strokeWidth="1.5" fill="none"
          strokeDasharray="4 4" strokeLinecap="round"
          style={{ animation: 'drawRoute 2.5s ease forwards' }} />
        <circle cx="42" cy="78" r="2.5" fill="#d97706" />
        <circle cx="74" cy="58" r="2.5" fill="#dc2626" />
      </svg>

      {/* Particles — left < 42% */}
      <GlowStar top="5%"  left="4%"  delay="0s"   size="9px"  color="#d97706" />
      <GlowStar top="16%" left="30%" delay="1.2s" size="8px"  color="#fbbf24" />
      <GlowStar top="24%" left="8%"  delay="2.4s" size="10px" color="#d97706" />
      <div aria-hidden="true" style={{ position: 'absolute', top: '40%', left: '6%',
        width: '8px', height: '8px', borderRadius: '50%',
        backgroundColor: 'rgba(22,163,74,0.45)',
        animation: 'heartFloat 3s ease-in-out infinite 0.5s' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '52%', left: '22%',
        width: '6px', height: '6px', borderRadius: '50%',
        backgroundColor: 'rgba(21,128,61,0.4)',
        animation: 'heartFloat 3.6s ease-in-out infinite 1.4s' }} />
    </>
  )
}

/* ── Cultural ─────────────────────────────────────────────────────────── */

function CulturalVisual() {
  return (
    <>
      <svg viewBox="0 0 88 108" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" style={{ width: '88px', height: '108px', display: 'block' }}>
        {/* Soft golden halo */}
        <ellipse cx="44" cy="68" rx="30" ry="18" fill="#fde68a" opacity="0.12" />
        {/* Steps */}
        <rect x="10" y="98" width="68" height="6" rx="1" fill="#92400e" opacity="0.65" />
        <rect x="14" y="93" width="60" height="5" rx="1" fill="#a16207" opacity="0.60" />
        {/* Four columns */}
        <rect x="16" y="38" width="8" height="55" rx="2" fill="#d97706" opacity="0.78" />
        <rect x="30" y="38" width="8" height="55" rx="2" fill="#b45309" opacity="0.82" />
        <rect x="44" y="38" width="8" height="55" rx="2" fill="#d97706" opacity="0.78" />
        <rect x="58" y="38" width="8" height="55" rx="2" fill="#b45309" opacity="0.78" />
        {/* Column capitals */}
        <rect x="12" y="34" width="16" height="5" rx="1" fill="#b45309" />
        <rect x="26" y="34" width="16" height="5" rx="1" fill="#92400e" />
        <rect x="40" y="34" width="16" height="5" rx="1" fill="#b45309" />
        <rect x="54" y="34" width="16" height="5" rx="1" fill="#92400e" />
        {/* Entablature */}
        <rect x="10" y="26" width="68" height="8" rx="1" fill="#a16207" opacity="0.88" />
        {/* Pediment */}
        <path d="M10 26 L44 8 L78 26 Z"   fill="#d97706" opacity="0.72" />
        <path d="M16 26 L44 11 L72 26 Z"  fill="#fbbf24" opacity="0.55" />
        {/* Pediment star */}
        <circle cx="44" cy="19" r="3" fill="#fde68a" opacity="0.92"
          style={{ animation: 'sparkle 3.2s ease-in-out infinite' }} />
        {/* Steam wisps from columns */}
        <path d="M20 37 Q22 30 20 24" stroke="#fde68a" strokeWidth="1.5" fill="none"
          strokeLinecap="round" opacity="0.5"
          style={{ animation: 'steamRise 2.4s ease-in-out infinite' }} />
        <path d="M34 37 Q36 29 34 22" stroke="#fde68a" strokeWidth="1.5" fill="none"
          strokeLinecap="round" opacity="0.45"
          style={{ animation: 'steamRise 2.8s ease-in-out infinite 0.6s' }} />
      </svg>

      {/* Glow particles — left < 42% */}
      <GlowStar top="4%"  left="7%"  delay="0s"   size="10px" color="#fbbf24" />
      <GlowStar top="14%" left="30%" delay="0.9s" size="8px"  color="#fde68a" />
      <GlowStar top="22%" left="6%"  delay="1.9s" size="9px"  color="#d97706" />
      <GlowStar top="30%" left="36%" delay="1.3s" size="7px"  color="#fbbf24" />
    </>
  )
}

/* ── Skiing ───────────────────────────────────────────────────────────── */

function SkiingVisual() {
  return (
    <>
      <svg viewBox="0 0 86 112" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" style={{ width: '86px', height: '112px', display: 'block' }}>
        {/* Sky wash */}
        <rect x="0" y="0" width="86" height="56" fill="#dbeafe" opacity="0.2" />
        {/* Mountain */}
        <path d="M0 112 L43 16 L86 112 Z"   fill="#1d4ed8" opacity="0.55" />
        <path d="M18 112 L43 16 L68 112 Z"  fill="#1e40af" opacity="0.48" />
        {/* Snow cap */}
        <path d="M43 16 L34 44 L52 44 Z"    fill="white" opacity="0.92" />
        {/* Ski trail — S-curve drawn with skiGlide animation */}
        <path d="M43 44 Q52 57 38 70 Q24 83 32 98"
          stroke="#60a5fa" strokeWidth="2.4" fill="none" strokeLinecap="round"
          strokeDasharray="160"
          style={{ animation: 'skiGlide 3s ease-in-out infinite' }} />
        {/* Pine trees at base */}
        <line x1="8"  y1="112" x2="8"  y2="94" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />
        <polygon points="8,92 2,103 14,103" fill="#1e3a8a" opacity="0.65" />
        <line x1="74" y1="112" x2="74" y2="90" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />
        <polygon points="74,88 68,100 80,100" fill="#1e3a8a" opacity="0.65" />
      </svg>

      {/* Snowflakes — left < 42% */}
      <Flake top="5%"  left="6%"  delay="0s"   dur="3.4s" size="10px" />
      <Flake top="13%" left="28%" delay="0.7s" dur="3.8s" size="9px"  />
      <Flake top="22%" left="10%" delay="1.5s" dur="3.1s" size="11px" />
      <Flake top="30%" left="36%" delay="2.2s" dur="4.0s" size="8px"  />
      <Flake top="38%" left="18%" delay="0.4s" dur="3.6s" size="9px"  />
    </>
  )
}

/* ── Relaxation ───────────────────────────────────────────────────────── */

function RelaxationVisual() {
  return (
    <>
      <svg viewBox="0 0 90 108" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" style={{ width: '90px', height: '108px', display: 'block' }}>
        {/* Moon */}
        <circle cx="68" cy="18" r="13" fill="#fef9c3" opacity="0.6" />
        <circle cx="73" cy="13" r="10" fill="#fff7ed" opacity="0.88" />
        {/* Left tree */}
        <rect x="10" y="54" width="7" height="54" rx="3" fill="#92400e" opacity="0.78" />
        <circle cx="13" cy="50" r="12" fill="#15803d" opacity="0.72" />
        <circle cx="7"  cy="56" r="8"  fill="#16a34a" opacity="0.62" />
        {/* Right tree */}
        <rect x="72" y="54" width="7" height="54" rx="3" fill="#92400e" opacity="0.78" />
        <circle cx="76" cy="50" r="12" fill="#15803d" opacity="0.72" />
        <circle cx="82" cy="56" r="8"  fill="#16a34a" opacity="0.62" />
        {/* Ropes */}
        <line x1="14" y1="54" x2="34" y2="68" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="76" y1="54" x2="56" y2="68" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
        {/* Hammock */}
        <path d="M34 68 Q45 86 56 68"
          stroke="#0d9488" strokeWidth="5" fill="none" strokeLinecap="round"
          style={{ transformBox: 'fill-box', transformOrigin: 'center',
            animation: 'calmBreathe 4s ease-in-out infinite' }} />
        <path d="M36 72 Q45 86 54 72"
          stroke="#14b8a6" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.55" />
        {/* Tiny stars */}
        <circle cx="26" cy="12" r="1.5" fill="#fde68a" opacity="0.7"
          style={{ animation: 'sparkle 3s ease-in-out infinite' }} />
        <circle cx="40" cy="6"  r="1.5" fill="#fde68a" opacity="0.6"
          style={{ animation: 'sparkle 4.2s ease-in-out infinite 0.8s' }} />
        <circle cx="54" cy="15" r="1.5" fill="#fde68a" opacity="0.65"
          style={{ animation: 'sparkle 3.6s ease-in-out infinite 1.5s' }} />
      </svg>

      {/* Breathing rings — left < 42% */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '32%', left: '8%',
        width: '16px', height: '16px', borderRadius: '50%',
        border: '1.5px solid rgba(13,148,136,0.5)',
        animation: 'calmBreathe 3.5s ease-in-out infinite' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '42%', left: '24%',
        width: '11px', height: '11px', borderRadius: '50%',
        border: '1.5px solid rgba(94,234,212,0.4)',
        animation: 'calmBreathe 4.5s ease-in-out infinite 1s' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '52%', left: '6%',
        width: '8px', height: '8px', borderRadius: '50%',
        border: '1px solid rgba(13,148,136,0.32)',
        animation: 'calmBreathe 5s ease-in-out infinite 2s' }} />
      <GlowStar top="5%"  left="8%"  delay="0s"   size="9px" color="#fde68a" />
      <GlowStar top="17%" left="28%" delay="1.4s" size="7px" color="#fef9c3" />
    </>
  )
}

/* ── Sizes ────────────────────────────────────────────────────────────── */

const SIZES = {
  beach:       { w: '162px', h: '188px' },
  city_break:  { w: '168px', h: '195px' },
  adventure:   { w: '165px', h: '190px' },
  cultural:    { w: '160px', h: '192px' },
  skiing:      { w: '160px', h: '198px' },
  relaxation:  { w: '164px', h: '192px' },
}

/* ── Export ───────────────────────────────────────────────────────────── */

export default function MoodPageAccent({ mood }) {
  if (!mood) return null
  const size = SIZES[mood]
  if (!size) return null

  return (
    <div
      aria-hidden="true"
      className="mood-page-enter-left pointer-events-none"
      style={{ width: size.w, height: size.h, position: 'relative' }}
    >
      {mood === 'beach'      && <BeachVisual />}
      {mood === 'city_break' && <CityBreakVisual />}
      {mood === 'adventure'  && <AdventureVisual />}
      {mood === 'cultural'   && <CulturalVisual />}
      {mood === 'skiing'     && <SkiingVisual />}
      {mood === 'relaxation' && <RelaxationVisual />}
    </div>
  )
}

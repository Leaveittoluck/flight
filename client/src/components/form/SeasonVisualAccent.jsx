/* ──────────────────────────────────────────────────────────────────────
   SeasonVisualAccent
   Absolutely-positioned decorative illustration that appears when the
   user selects a season in the generator form.

   The wrapper uses the CSS class .season-enter which animates from
   translate(22px,22px) → translate(-20%,-20%), making the illustration
   slide toward the card's top-left corner. The parent form body has
   overflow:hidden, so the protruding portion is clipped — creating a
   premium "peeking from the corner" effect.

   Parent container requirements:
     - position: relative
     - overflow: hidden
   ────────────────────────────────────────────────────────────────────── */

/* ── Spring: blossoming cherry tree ───────────────────────────────────── */

const SPRING_PETALS = [
  { top: '24%', left: '52%', delay: '0s',   dur: '3.1s', color: '#f9a8d4' },
  { top: '14%', left: '70%', delay: '0.7s', dur: '2.8s', color: '#fbcfe8' },
  { top: '38%', left: '62%', delay: '1.3s', dur: '3.4s', color: '#f9a8d4' },
  { top: '10%', left: '40%', delay: '2.0s', dur: '2.7s', color: '#fce7f3' },
  { top: '42%', left: '77%', delay: '2.6s', dur: '3.2s', color: '#f9a8d4' },
]

function SpringVisual() {
  return (
    <>
      <svg
        viewBox="0 0 84 98"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: '84px', height: '98px', display: 'block' }}
      >
        {/* Trunk */}
        <rect x="36" y="60" width="10" height="36" rx="4" fill="#92400e" />
        {/* Root hints */}
        <path d="M35 91 Q29 95 23 93" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M47 91 Q53 95 59 93" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
        {/* Blossom body — layered circles for depth */}
        <circle cx="41" cy="40" r="26" fill="#fbcfe8" opacity="0.92" />
        <circle cx="20" cy="50" r="17" fill="#f9a8d4" opacity="0.88" />
        <circle cx="62" cy="50" r="17" fill="#f9a8d4" opacity="0.88" />
        <circle cx="30" cy="26" r="15" fill="#fce7f3" opacity="0.85" />
        <circle cx="54" cy="25" r="15" fill="#fce7f3" opacity="0.85" />
        <circle cx="41" cy="17" r="13" fill="#fdf4ff" opacity="0.8" />
        {/* Small white blossom highlights */}
        <circle cx="25" cy="37" r="4.5" fill="white" opacity="0.85" />
        <circle cx="57" cy="36" r="4.5" fill="white" opacity="0.85" />
        <circle cx="41" cy="30" r="4"   fill="white" opacity="0.8" />
        <circle cx="34" cy="47" r="3.5" fill="white" opacity="0.75" />
        <circle cx="50" cy="46" r="3.5" fill="white" opacity="0.75" />
      </svg>

      {/* Floating petals */}
      {SPRING_PETALS.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: '7px',
            height: '11px',
            backgroundColor: p.color,
            borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
            animation: `petalDrift ${p.dur} ease-in-out infinite ${p.delay}`,
          }}
        />
      ))}
    </>
  )
}

/* ── Summer: shining sun ──────────────────────────────────────────────── */

function SummerVisual() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100px', height: '100px', display: 'block' }}
    >
      {/* Outer glow rings — opacity-breathing */}
      <circle cx="50" cy="50" r="46" fill="rgba(251,191,36,0.1)"  className="sun-glow-ring-1" />
      <circle cx="50" cy="50" r="38" fill="rgba(251,191,36,0.16)" className="sun-glow-ring-2" />

      {/* Rays — slow spin */}
      <g className="sun-rays-spin">
        <line x1="50" y1="2"  x2="50" y2="14" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="50" y1="86" x2="50" y2="98" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="2"  y1="50" x2="14" y2="50" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="86" y1="50" x2="98" y2="50" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="15.1" y1="15.1" x2="22.9" y2="22.9" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <line x1="77.1" y1="77.1" x2="84.9" y2="84.9" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <line x1="84.9" y1="15.1" x2="77.1" y2="22.9" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <line x1="15.1" y1="84.9" x2="22.9" y2="77.1" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Sun body */}
      <circle cx="50" cy="50" r="22" fill="#fbbf24" />
      {/* Inner warm glow */}
      <circle cx="50" cy="50" r="15" fill="#fde047" opacity="0.55" />
      {/* Highlight */}
      <circle cx="43" cy="43" r="6" fill="rgba(255,255,255,0.28)" />
    </svg>
  )
}

/* ── Autumn: fall tree with coloured leaf clusters ────────────────────── */

const AUTUMN_LEAVES = [
  { top: '20%', left: '53%', delay: '0s',   dur: '3.3s', color: '#f97316' },
  { top: '12%', left: '72%', delay: '0.8s', dur: '2.9s', color: '#dc2626' },
  { top: '34%', left: '66%', delay: '1.6s', dur: '3.6s', color: '#f59e0b' },
  { top: '8%',  left: '44%', delay: '2.4s', dur: '3.1s', color: '#ea580c' },
]

function AutumnVisual() {
  return (
    <>
      <svg
        viewBox="0 0 88 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: '88px', height: '100px', display: 'block' }}
      >
        {/* Trunk */}
        <rect x="38" y="58" width="12" height="40" rx="4" fill="#78350f" />
        {/* Root hints */}
        <path d="M37 93 Q31 97 25 95" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M51 93 Q57 97 63 95" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        {/* Main branches */}
        <path d="M44 58 Q28 44 12 28" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M44 58 Q60 44 76 28" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M44 58 Q44 40 44 22"  stroke="#78350f" strokeWidth="3"   strokeLinecap="round" />
        {/* Sub-branches */}
        <path d="M28 44 Q18 36 10 26" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M60 44 Q70 36 78 26" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
        {/* Leaf clusters — warm autumn palette */}
        <circle cx="12"  cy="24" r="14" fill="#dc2626" opacity="0.88" />
        <circle cx="28"  cy="13" r="14" fill="#f97316" opacity="0.92" />
        <circle cx="44"  cy="9"  r="16" fill="#ea580c" opacity="0.90" />
        <circle cx="60"  cy="13" r="14" fill="#f59e0b" opacity="0.92" />
        <circle cx="76"  cy="24" r="14" fill="#dc2626" opacity="0.88" />
        <circle cx="19"  cy="35" r="10" fill="#f97316" opacity="0.72" />
        <circle cx="69"  cy="35" r="10" fill="#f59e0b" opacity="0.72" />
      </svg>

      {/* Falling leaves (simple oval shapes with rotation) */}
      {AUTUMN_LEAVES.map((l, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: l.top,
            left: l.left,
            width: '10px',
            height: '14px',
            backgroundColor: l.color,
            borderRadius: '50% 5% 50% 5%',
            animation: `leafFall ${l.dur} ease-in-out infinite ${l.delay}`,
          }}
        />
      ))}
    </>
  )
}

/* ── Winter: snowman ──────────────────────────────────────────────────── */

const WINTER_FLAKES = [
  { top: '6%',   left: '56%', delay: '0s',   dur: '3.6s', size: '10px' },
  { top: '0%',   left: '74%', delay: '0.6s', dur: '3.1s', size: '8px'  },
  { top: '14%',  left: '38%', delay: '1.2s', dur: '4.0s', size: '9px'  },
  { top: '-2%',  left: '62%', delay: '1.9s', dur: '3.3s', size: '7px'  },
  { top: '20%',  left: '80%', delay: '2.5s', dur: '3.8s', size: '8px'  },
  { top: '4%',   left: '48%', delay: '3.1s', dur: '3.5s', size: '9px'  },
]

function SnowflakeSVG({ size }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="#93c5fd"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ width: size, height: size, display: 'block' }}
    >
      <line x1="10" y1="1"  x2="10" y2="19" />
      <line x1="1"  y1="10" x2="19" y2="10" />
      <line x1="3"  y1="3"  x2="17" y2="17" />
      <line x1="17" y1="3"  x2="3"  y2="17" />
      <circle cx="10" cy="10" r="2.2" fill="#93c5fd" stroke="none" />
    </svg>
  )
}

function WinterVisual() {
  return (
    <>
      <svg
        viewBox="0 0 80 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: '80px', height: '112px', display: 'block' }}
      >
        {/* Body (bottom) */}
        <circle cx="40" cy="82"  r="26"  fill="white" stroke="#bae6fd" strokeWidth="1.5" />
        {/* Middle */}
        <circle cx="40" cy="52"  r="19"  fill="white" stroke="#bae6fd" strokeWidth="1.5" />
        {/* Head */}
        <circle cx="40" cy="26"  r="14"  fill="white" stroke="#bae6fd" strokeWidth="1.5" />
        {/* Hat brim */}
        <rect x="27" y="13" width="26" height="3"  rx="1.5" fill="#1e3a8a" />
        {/* Hat body */}
        <rect x="30" y="2"  width="20" height="12" rx="2"   fill="#1e3a8a" />
        {/* Eyes */}
        <circle cx="34.5" cy="22" r="2.2" fill="#1e3a8a" />
        <circle cx="45.5" cy="22" r="2.2" fill="#1e3a8a" />
        {/* Carrot nose */}
        <path d="M40 25 L48 28 L40 28 Z" fill="#f97316" />
        {/* Smile */}
        <circle cx="35"   cy="31" r="1.4" fill="#1e3a8a" />
        <circle cx="38.5" cy="33" r="1.4" fill="#1e3a8a" />
        <circle cx="42"   cy="33" r="1.4" fill="#1e3a8a" />
        <circle cx="45.5" cy="31" r="1.4" fill="#1e3a8a" />
        {/* Scarf */}
        <path d="M23 42 Q40 37 57 42 Q51 47 40 45 Q29 47 23 42 Z" fill="#f97316" opacity="0.88" />
        <path d="M42 45 L38 53 Q40 55 42 53 Z" fill="#ea580c" opacity="0.85" />
        {/* Buttons */}
        <circle cx="40" cy="58" r="2.5" fill="#93c5fd" />
        <circle cx="40" cy="67" r="2.5" fill="#93c5fd" />
        <circle cx="40" cy="76" r="2.5" fill="#93c5fd" />
        {/* Arms */}
        <path d="M21 56 Q11 46 6  36" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M25 53 Q17 45 15 38" stroke="#78350f" strokeWidth="2"   strokeLinecap="round" />
        <path d="M59 56 Q69 46 74 36" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M55 53 Q63 45 65 38" stroke="#78350f" strokeWidth="2"   strokeLinecap="round" />
      </svg>

      {/* Snowflakes */}
      {WINTER_FLAKES.map((f, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: f.top,
            left: f.left,
            animation: `snowFall ${f.dur} ease-in-out infinite ${f.delay}`,
          }}
        >
          <SnowflakeSVG size={f.size} />
        </div>
      ))}
    </>
  )
}

/* ── Main export ──────────────────────────────────────────────────────── */

const SEASON_SIZES = {
  spring: { w: '120px', h: '140px' },
  summer: { w: '130px', h: '130px' },
  autumn: { w: '120px', h: '140px' },
  winter: { w: '110px', h: '150px' },
}

export default function SeasonVisualAccent({ season }) {
  if (!season) return null

  const size = SEASON_SIZES[season]
  if (!size) return null

  return (
    <div
      aria-hidden="true"
      className="season-enter absolute top-0 left-0 pointer-events-none"
      style={{ width: size.w, height: size.h, zIndex: 1 }}
    >
      {season === 'spring' && <SpringVisual />}
      {season === 'summer' && <SummerVisual />}
      {season === 'autumn' && <AutumnVisual />}
      {season === 'winter' && <WinterVisual />}
    </div>
  )
}

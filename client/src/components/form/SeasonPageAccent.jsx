/* ──────────────────────────────────────────────────────────────────────
   SeasonPageAccent
   External seasonal illustration rendered OUTSIDE the form card.
   Enters from the left page edge and settles behind the form's
   upper-left corner (form card has a higher z-index and sits on top).

   Usage in GeneratorPage:
     <div className="relative" style={{ overflow:'visible' }}>
       {formSeason && (
         <div
           className="absolute hidden sm:block pointer-events-none"
           style={{ top:'-60px', left:'-70px', zIndex: 8 }}
         >
           <SeasonPageAccent key={formSeason} season={formSeason} />
         </div>
       )}
       <div style={{ position:'relative', zIndex:20 }}>
         <GeneratorForm … />
       </div>
     </div>

   Visible zone:
   - Wrapper at left:-70px → ~70px of the container sticks out left of form.
   - Container widths ~165-170px → ~42% of illustration is visible.
   - Everything at top < ~30% of container height is ABOVE the form top
     edge and visible at any x.
   - Particles are placed in these two zones to remain visible.
   ────────────────────────────────────────────────────────────────────── */

/* ── Shared particle helpers ──────────────────────────────────────────── */

function Petal({ top, left, delay, dur, color }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top, left,
        width: '9px',
        height: '13px',
        backgroundColor: color,
        borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
        animation: `petalDrift ${dur} ease-in-out infinite ${delay}`,
      }}
    />
  )
}

function Leaf({ top, left, delay, dur, color }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top, left,
        width: '12px',
        height: '16px',
        backgroundColor: color,
        borderRadius: '50% 5% 50% 5%',
        animation: `leafFall ${dur} ease-in-out infinite ${delay}`,
      }}
    />
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

/* ── Spring: cherry blossom tree + petals + breeze lines ──────────────── */

function SpringVisual() {
  return (
    <>
      <svg viewBox="0 0 90 105" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" style={{ width: '90px', height: '105px', display: 'block' }}>
        <rect x="39" y="65" width="11" height="38" rx="4" fill="#92400e" />
        <path d="M38 97 Q31 101 25 99" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M51 97 Q58 101 64 99" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="44" cy="44" r="28" fill="#fbcfe8" opacity="0.92" />
        <circle cx="22" cy="55" r="19" fill="#f9a8d4" opacity="0.88" />
        <circle cx="66" cy="55" r="19" fill="#f9a8d4" opacity="0.88" />
        <circle cx="32" cy="28" r="16" fill="#fce7f3" opacity="0.85" />
        <circle cx="58" cy="27" r="16" fill="#fce7f3" opacity="0.85" />
        <circle cx="44" cy="18" r="14" fill="#fdf4ff" opacity="0.82" />
        <circle cx="26" cy="40" r="5"  fill="white"  opacity="0.85" />
        <circle cx="62" cy="39" r="5"  fill="white"  opacity="0.85" />
        <circle cx="44" cy="32" r="4.5" fill="white" opacity="0.8" />
        <circle cx="36" cy="51" r="4"  fill="white"  opacity="0.75" />
        <circle cx="53" cy="50" r="4"  fill="white"  opacity="0.75" />
      </svg>

      {/* Petals — above-form zone (top < 32%): any x OK
                   side zone (top ≥ 32%): left must be < 42% */}
      <Petal top="8%"  left="58%" delay="0s"   dur="3.1s" color="#f9a8d4" />
      <Petal top="18%" left="74%" delay="0.7s" dur="2.8s" color="#fbcfe8" />
      <Petal top="25%" left="46%" delay="1.4s" dur="3.4s" color="#f9a8d4" />
      <Petal top="38%" left="16%" delay="2.0s" dur="2.7s" color="#fce7f3" />
      <Petal top="52%" left="28%" delay="2.7s" dur="3.2s" color="#f9a8d4" />
      <Petal top="66%" left="10%" delay="1.0s" dur="3.0s" color="#fbcfe8" />

      {/* Breeze lines — above zone & left side */}
      <svg aria-hidden="true" style={{ position:'absolute', top:'20%', left:'48%', width:'55px', height:'22px',
        animation:'windSweep 4s ease-in-out infinite', overflow:'visible' }}>
        <path d="M0 11 Q14 3 28 11 Q42 19 55 11"
          stroke="#f9a8d4" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeDasharray="3 5" />
      </svg>
      <svg aria-hidden="true" style={{ position:'absolute', top:'60%', left:'5%', width:'40px', height:'16px',
        animation:'windSweep 5s ease-in-out infinite 1.5s', overflow:'visible' }}>
        <path d="M0 8 Q10 2 20 8 Q30 14 40 8"
          stroke="#fce7f3" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="2 4" />
      </svg>
    </>
  )
}

/* ── Summer: sun + sparkles ───────────────────────────────────────────── */

function SummerVisual() {
  return (
    <>
      <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" style={{ width: '110px', height: '110px', display: 'block' }}>
        <circle cx="55" cy="55" r="50" fill="rgba(251,191,36,0.10)" className="sun-glow-ring-1" />
        <circle cx="55" cy="55" r="42" fill="rgba(251,191,36,0.16)" className="sun-glow-ring-2" />
        <g className="sun-rays-spin">
          <line x1="55" y1="3"  x2="55" y2="16" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <line x1="55" y1="94" x2="55" y2="107" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <line x1="3"  y1="55" x2="16" y2="55" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <line x1="94" y1="55" x2="107" y2="55" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <line x1="16" y1="16" x2="25" y2="25" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="85" y1="85" x2="94" y2="94" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="94" y1="16" x2="85" y2="25" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="16" y1="94" x2="25" y2="85" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <circle cx="55" cy="55" r="24" fill="#fbbf24" />
        <circle cx="55" cy="55" r="16" fill="#fde047" opacity="0.5" />
        <circle cx="47" cy="47" r="6.5" fill="rgba(255,255,255,0.28)" />
      </svg>

      {/* Sparkles — above-form zone (top < 36%): any x
                    side zone (top ≥ 36%): left < 41% */}
      <GlowStar top="8%"  left="62%" delay="0s"   size="13px" color="#fde68a" />
      <GlowStar top="22%" left="80%" delay="0.8s" size="11px" color="#fde68a" />
      <GlowStar top="15%" left="35%" delay="1.5s" size="15px" color="#fbbf24" />
      <GlowStar top="72%" left="14%" delay="2.2s" size="10px" color="#fde68a" />
      <GlowStar top="82%" left="5%"  delay="2.9s" size="12px" color="#fde68a" />
    </>
  )
}

/* ── Autumn: fall tree + leaves + wind gust ───────────────────────────── */

function AutumnVisual() {
  return (
    <>
      <svg viewBox="0 0 95 108" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" style={{ width: '95px', height: '108px', display: 'block' }}>
        <rect x="41" y="63" width="13" height="43" rx="4" fill="#78350f" />
        <path d="M40 98 Q33 103 27 101" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M54 98 Q61 103 67 101" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M47 63 Q30 48 13 30" stroke="#78350f" strokeWidth="4"   strokeLinecap="round" />
        <path d="M47 63 Q64 48 82 30" stroke="#78350f" strokeWidth="4"   strokeLinecap="round" />
        <path d="M47 63 Q47 43 47 22"  stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M30 47 Q18 37 10 26"  stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M64 47 Q76 37 85 26"  stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="13" cy="26" r="15" fill="#dc2626" opacity="0.88" />
        <circle cx="30" cy="14" r="15" fill="#f97316" opacity="0.92" />
        <circle cx="47" cy="9"  r="17" fill="#ea580c" opacity="0.90" />
        <circle cx="64" cy="14" r="15" fill="#f59e0b" opacity="0.92" />
        <circle cx="82" cy="26" r="15" fill="#dc2626" opacity="0.88" />
        <circle cx="21" cy="37" r="11" fill="#f97316" opacity="0.72" />
        <circle cx="73" cy="37" r="11" fill="#f59e0b" opacity="0.72" />
      </svg>

      {/* Leaves — above-form zone (top < 31%): any x
                   side zone (top ≥ 31%): left < 42% */}
      <Leaf top="10%" left="60%" delay="0s"   dur="3.3s" color="#f97316" />
      <Leaf top="22%" left="76%" delay="0.8s" dur="2.9s" color="#dc2626" />
      <Leaf top="28%" left="82%" delay="0.4s" dur="3.8s" color="#f59e0b" />
      <Leaf top="12%" left="40%" delay="2.4s" dur="3.1s" color="#ea580c" />
      <Leaf top="40%" left="18%" delay="1.6s" dur="3.6s" color="#f59e0b" />
      <Leaf top="55%" left="8%"  delay="3.0s" dur="3.4s" color="#f97316" />

      {/* Wind gust — above zone */}
      <svg aria-hidden="true" style={{ position:'absolute', top:'18%', left:'44%', width:'60px', height:'24px',
        animation:'windSweep 3.5s ease-in-out infinite', overflow:'visible' }}>
        <path d="M0 12 Q15 3 30 12 Q45 21 60 12"
          stroke="#f97316" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeDasharray="4 6" opacity="0.7" />
      </svg>
      <svg aria-hidden="true" style={{ position:'absolute', top:'8%', left:'58%', width:'44px', height:'16px',
        animation:'windSweep 4.5s ease-in-out infinite 1.2s', overflow:'visible' }}>
        <path d="M0 8 Q11 2 22 8 Q33 14 44 8"
          stroke="#ea580c" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="3 5" opacity="0.6" />
      </svg>
    </>
  )
}

/* ── Winter: snowman + snowflakes + cold wind streaks ─────────────────── */

function WinterVisual() {
  return (
    <>
      <svg viewBox="0 0 85 120" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" style={{ width: '85px', height: '120px', display: 'block' }}>
        <circle cx="42" cy="88" r="28"  fill="white" stroke="#bae6fd" strokeWidth="1.5" />
        <circle cx="42" cy="56" r="21"  fill="white" stroke="#bae6fd" strokeWidth="1.5" />
        <circle cx="42" cy="28" r="15"  fill="white" stroke="#bae6fd" strokeWidth="1.5" />
        <rect x="29" y="14" width="26" height="3"  rx="1.5" fill="#1e3a8a" />
        <rect x="32" y="3"  width="20" height="12" rx="2"   fill="#1e3a8a" />
        <circle cx="36" cy="24" r="2.3" fill="#1e3a8a" />
        <circle cx="48" cy="24" r="2.3" fill="#1e3a8a" />
        <path d="M42 27 L50 30 L42 30 Z" fill="#f97316" />
        <circle cx="36.5" cy="33" r="1.5" fill="#1e3a8a" />
        <circle cx="40"   cy="35" r="1.5" fill="#1e3a8a" />
        <circle cx="43.5" cy="35" r="1.5" fill="#1e3a8a" />
        <circle cx="47"   cy="33" r="1.5" fill="#1e3a8a" />
        <path d="M24 43 Q42 38 60 43 Q54 49 42 47 Q30 49 24 43 Z" fill="#f97316" opacity="0.88" />
        <path d="M44 47 L40 55 Q42 57 44 55 Z" fill="#ea580c" opacity="0.85" />
        <circle cx="42" cy="62" r="2.5" fill="#93c5fd" />
        <circle cx="42" cy="71" r="2.5" fill="#93c5fd" />
        <circle cx="42" cy="80" r="2.5" fill="#93c5fd" />
        <path d="M22 60 Q11 50 6  39" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 57 Q17 48 15 41" stroke="#78350f" strokeWidth="2"   strokeLinecap="round" />
        <path d="M62 60 Q73 50 79 39" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M58 57 Q67 48 70 41" stroke="#78350f" strokeWidth="2"   strokeLinecap="round" />
      </svg>

      {/* Snowflakes — above-form zone (top < 29%): any x
                      side zone (top ≥ 29%): left < 45% */}
      <Flake top="5%"  left="55%" delay="0s"   dur="3.6s" size="11px" />
      <Flake top="0%"  left="72%" delay="0.6s" dur="3.1s" size="9px"  />
      <Flake top="15%" left="38%" delay="1.3s" dur="4.0s" size="10px" />
      <Flake top="24%" left="78%" delay="1.9s" dur="3.3s" size="8px"  />
      <Flake top="36%" left="32%" delay="2.5s" dur="3.8s" size="9px"  />
      <Flake top="8%"  left="18%" delay="3.1s" dur="3.5s" size="10px" />
      <Flake top="48%" left="12%" delay="0.3s" dur="4.2s" size="8px"  />
      <Flake top="62%" left="40%" delay="1.7s" dur="3.9s" size="9px"  />

      {/* Cold wind streaks — side zone */}
      <div aria-hidden="true" style={{ position:'absolute', top:'65%', left:'15%', width:'48px', height:'2px',
        backgroundColor:'#bae6fd', borderRadius:'999px',
        animation:'windSweep 3s ease-in-out infinite', opacity:0.7 }} />
      <div aria-hidden="true" style={{ position:'absolute', top:'74%', left:'5%', width:'32px', height:'1.5px',
        backgroundColor:'#bae6fd', borderRadius:'999px',
        animation:'windSweep 3.8s ease-in-out infinite 1.2s', opacity:0.55 }} />
      <div aria-hidden="true" style={{ position:'absolute', top:'52%', left:'25%', width:'26px', height:'1.5px',
        backgroundColor:'#93c5fd', borderRadius:'999px',
        animation:'windSweep 4.5s ease-in-out infinite 2.4s', opacity:0.5 }} />
    </>
  )
}

/* ── Sizes ────────────────────────────────────────────────────────────── */

const SIZES = {
  spring: { w: '165px', h: '190px' },
  summer: { w: '170px', h: '165px' },
  autumn: { w: '168px', h: '195px' },
  winter: { w: '155px', h: '205px' },
}

/* ── Export ───────────────────────────────────────────────────────────── */

export default function SeasonPageAccent({ season }) {
  if (!season) return null
  const size = SIZES[season]
  if (!size) return null

  return (
    <div
      aria-hidden="true"
      className="season-page-enter pointer-events-none"
      style={{ width: size.w, height: size.h, position: 'relative' }}
    >
      {season === 'spring' && <SpringVisual />}
      {season === 'summer' && <SummerVisual />}
      {season === 'autumn' && <AutumnVisual />}
      {season === 'winter' && <WinterVisual />}
    </div>
  )
}

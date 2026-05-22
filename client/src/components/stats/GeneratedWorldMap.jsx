import { useState, useRef, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { WORLD_MAP_DESTINATIONS, MOOD_COLORS } from '../../data/worldMapStats'

const GEO_URL   = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const MAX_COUNT = Math.max(...WORLD_MAP_DESTINATIONS.map(d => d.generatedCount))

const W = 800
const H = 400

const MIN_K   = 0.5
const MAX_K   = 8
const INITIAL = { k: 1, x: 0, y: 0 }

function markerR(count) { return 3.5 + (count / MAX_COUNT) * 7 }

const BTN_CLS = [
  'w-8 h-8 rounded-lg',
  'bg-white/80 backdrop-blur-sm border border-stone-200 shadow-sm',
  'flex items-center justify-center',
  'text-stone-500 hover:bg-white hover:scale-110',
  'cursor-pointer transition-all duration-150',
].join(' ')

export default function GeneratedWorldMap({ highlightCity, onMarkerHover }) {
  const [tf,         setTf]         = useState(INITIAL)
  const [dragging,   setDragging]   = useState(false)
  const [countryTip, setCountryTip] = useState(null)

  const containerRef = useRef(null)
  const drag = useRef(null)
  const tfRef = useRef(tf)
  tfRef.current = tf

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const svgEl = el.querySelector('svg')
      if (!svgEl) return
      const rect = svgEl.getBoundingClientRect()
      const cx = (e.clientX - rect.left) * (W / rect.width)
      const cy = (e.clientY - rect.top)  * (H / rect.height)
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
      setTf(t => {
        const newK = Math.max(MIN_K, Math.min(MAX_K, t.k * factor))
        const r    = newK / t.k
        return { k: newK, x: cx - r * (cx - t.x), y: cy - r * (cy - t.y) }
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const release = () => { drag.current = null; setDragging(false) }
    window.addEventListener('mouseup', release)
    return () => window.removeEventListener('mouseup', release)
  }, [])

  const onMouseDown = (e) => {
    if (e.button !== 0 || e.target.closest('button')) return
    drag.current = { sx: e.clientX, sy: e.clientY, bx: tfRef.current.x, by: tfRef.current.y }
    setDragging(true)
  }
  const onMouseMove = (e) => {
    if (!drag.current) return
    const svgEl = containerRef.current?.querySelector('svg')
    const rect  = svgEl?.getBoundingClientRect()
    const sx = rect ? W / rect.width  : 1
    const sy = rect ? H / rect.height : 1
    setTf(t => ({
      ...t,
      x: drag.current.bx + (e.clientX - drag.current.sx) * sx,
      y: drag.current.by + (e.clientY - drag.current.sy) * sy,
    }))
  }
  const onDragEnd = () => { drag.current = null; setDragging(false) }

  const zoomBtn = (factor) => setTf(t => {
    const newK = Math.max(MIN_K, Math.min(MAX_K, t.k * factor))
    const r    = newK / t.k
    return { k: newK, x: W / 2 - r * (W / 2 - t.x), y: H / 2 - r * (H / 2 - t.y) }
  })

  const tfStr = `translate(${tf.x}, ${tf.y}) scale(${tf.k})`
  const invK  = 1 / tf.k

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
    >
      <ComposableMap
        width={W}
        height={H}
        projectionConfig={{ scale: 150, center: [10, 48] }}
        style={{ width: '100%', height: 'auto' }}
      >
        {/* ── Atmospheric SVG overlays (outside the panning <g>) ── */}
        <defs>
          {/* Subtle paper grain for tactile texture */}
          <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise"/>
          </filter>
          {/* Soft edge vignette */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
            <stop offset="0%"   stopColor="transparent" stopOpacity="0"/>
            <stop offset="100%" stopColor="#2a1f0e"     stopOpacity="0.18"/>
          </radialGradient>
        </defs>

        {/* Paper grain overlay — very low opacity, purely textural */}
        <rect width={W} height={H} filter="url(#paper-grain)" opacity={0.04} style={{ pointerEvents: 'none' }}/>
        {/* Warm edge vignette */}
        <rect width={W} height={H} fill="url(#vignette)" style={{ pointerEvents: 'none' }}/>

        {/* ── Geography + Markers inside the pan/zoom transform ── */}
        <g transform={tfStr}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.NAME || geo.properties.name
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#e8dfc8"
                    stroke="#b8a880"
                    strokeWidth={0.3}
                    style={{
                      default: { outline: 'none' },
                      hover:   { outline: 'none', fill: '#d4c9ae' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(e) => {
                      if (drag.current) return
                      name && setCountryTip({ name, x: e.clientX, y: e.clientY })
                    }}
                    onMouseMove={(e) => {
                      if (drag.current) return
                      setCountryTip(c => c ? { ...c, x: e.clientX, y: e.clientY } : null)
                    }}
                    onMouseLeave={() => setCountryTip(null)}
                  />
                )
              })
            }
          </Geographies>

          {WORLD_MAP_DESTINATIONS.map((dest) => {
            const r      = markerR(dest.generatedCount)
            const active = highlightCity === dest.city
            const color  = MOOD_COLORS[dest.topMood] ?? '#3b82f6'
            return (
              <Marker
                key={dest.city}
                coordinates={[dest.lng, dest.lat]}
                onMouseEnter={(e) => {
                  if (drag.current) return
                  setCountryTip(null)
                  onMarkerHover(dest, e)
                }}
                onMouseMove={(e) => {
                  if (drag.current) return
                  onMarkerHover(dest, e)
                }}
                onMouseLeave={() => onMarkerHover(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Three-ring glow — diffuse halo, soft ring, solid core */}
                <circle r={(active ? r + 16 : r + 8)  * invK} fill={color} opacity={active ? 0.10 : 0.06} />
                <circle r={(active ? r + 9  : r + 4)  * invK} fill={color} opacity={active ? 0.24 : 0.15} />
                <circle r={(active ? r * 1.5 : r)      * invK} fill={color} opacity={active ? 1   : 0.86} />
              </Marker>
            )
          })}
        </g>
      </ComposableMap>

      {/* Zoom + Reset controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
        <button onClick={() => zoomBtn(1.5)}   aria-label="Zoom in"    className={`${BTN_CLS} text-lg font-light`}>+</button>
        <button onClick={() => zoomBtn(1/1.5)} aria-label="Zoom out"   className={`${BTN_CLS} text-lg font-light`}>−</button>
        <div className="h-px bg-stone-200/80 mx-0.5 my-0.5" />
        <button onClick={() => setTf(INITIAL)} aria-label="Reset view" title="Reset view" className={`${BTN_CLS} text-base`}>↺</button>
      </div>

      {/* Minimal compass — bottom-left, static overlay */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none opacity-30">
        <svg width="30" height="30" viewBox="-15 -15 30 30">
          <line x1="0" y1="-13" x2="0" y2="-6"  stroke="#5c4a30" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="0" y1="6"   x2="0" y2="13"  stroke="#5c4a30" strokeWidth="0.9" strokeLinecap="round"/>
          <line x1="-13" y1="0" x2="-6" y2="0"  stroke="#5c4a30" strokeWidth="0.9" strokeLinecap="round"/>
          <line x1="6"   y1="0" x2="13" y2="0"  stroke="#5c4a30" strokeWidth="0.9" strokeLinecap="round"/>
          <polygon points="0,-15 -3,-9 3,-9" fill="#5c4a30"/>
          <circle cx="0" cy="0" r="2.2" fill="#5c4a30" opacity="0.7"/>
          <circle cx="0" cy="0" r="0.9" fill="white"   opacity="0.8"/>
          <text y="-18" textAnchor="middle" fontSize="7" fill="#5c4a30" fontFamily="Georgia, serif" fontWeight="bold">N</text>
        </svg>
      </div>

      {/* Country name tooltip */}
      {countryTip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: countryTip.x + 12, top: countryTip.y - 36 }}
        >
          <div className="bg-stone-800/85 backdrop-blur-sm text-stone-100 text-xs font-medium rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap tracking-wide">
            {countryTip.name}
          </div>
        </div>
      )}
    </div>
  )
}

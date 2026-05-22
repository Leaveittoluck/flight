import { useState, useRef, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { WORLD_MAP_DESTINATIONS, MOOD_COLORS } from '../../data/worldMapStats'

const GEO_URL   = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const MAX_COUNT = Math.max(...WORLD_MAP_DESTINATIONS.map(d => d.generatedCount))

// SVG canvas size — 2:1 matches the Equal Earth projection's natural aspect ratio
const W = 800
const H = 400

const MIN_K   = 0.5
const MAX_K   = 8
const INITIAL = { k: 1, x: 0, y: 0 }

function markerR(count) { return 3.5 + (count / MAX_COUNT) * 7 }

const BTN_CLS = [
  'w-8 h-8 rounded-lg',
  'bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm',
  'flex items-center justify-center',
  'text-slate-600 hover:bg-white hover:scale-110',
  'cursor-pointer transition-all duration-150',
].join(' ')

export default function GeneratedWorldMap({ highlightCity, onMarkerHover }) {
  const [tf,         setTf]         = useState(INITIAL)
  const [dragging,   setDragging]   = useState(false)
  const [countryTip, setCountryTip] = useState(null)

  const containerRef = useRef(null)
  const drag = useRef(null)   // { sx, sy, bx, by } set while mouse is held
  const tfRef = useRef(tf)
  tfRef.current = tf

  // ── Wheel zoom ──────────────────────────────────────────────────────────
  // Non-passive so we can call preventDefault and stop page scroll while
  // the cursor is inside the map container.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const svgEl = el.querySelector('svg')
      if (!svgEl) return
      const rect = svgEl.getBoundingClientRect()
      // Cursor position in SVG user-space
      const cx = (e.clientX - rect.left) * (W / rect.width)
      const cy = (e.clientY - rect.top)  * (H / rect.height)
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
      setTf(t => {
        const newK = Math.max(MIN_K, Math.min(MAX_K, t.k * factor))
        const r    = newK / t.k
        // Zoom toward cursor: keep the point under the cursor stationary
        return { k: newK, x: cx - r * (cx - t.x), y: cy - r * (cy - t.y) }
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Release drag if the mouse exits the browser window
  useEffect(() => {
    const release = () => { drag.current = null; setDragging(false) }
    window.addEventListener('mouseup', release)
    return () => window.removeEventListener('mouseup', release)
  }, [])

  // ── Pan (drag) ──────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    if (e.button !== 0 || e.target.closest('button')) return
    drag.current = { sx: e.clientX, sy: e.clientY, bx: tfRef.current.x, by: tfRef.current.y }
    setDragging(true)
  }
  const onMouseMove = (e) => {
    if (!drag.current) return
    const svgEl = containerRef.current?.querySelector('svg')
    const rect  = svgEl?.getBoundingClientRect()
    // Scale screen-pixel delta to SVG-user-space delta
    const sx = rect ? W / rect.width  : 1
    const sy = rect ? H / rect.height : 1
    setTf(t => ({
      ...t,
      x: drag.current.bx + (e.clientX - drag.current.sx) * sx,
      y: drag.current.by + (e.clientY - drag.current.sy) * sy,
    }))
  }
  const onDragEnd = () => { drag.current = null; setDragging(false) }

  // ── Button zoom (toward viewport center, no recentering snap) ──────────
  const zoomBtn = (factor) => setTf(t => {
    const newK = Math.max(MIN_K, Math.min(MAX_K, t.k * factor))
    const r    = newK / t.k
    // Zoom toward the center of the visible area
    return { k: newK, x: W / 2 - r * (W / 2 - t.x), y: H / 2 - r * (H / 2 - t.y) }
  })

  const tfStr = `translate(${tf.x}, ${tf.y}) scale(${tf.k})`
  const invK  = 1 / tf.k  // keeps markers the same visual size regardless of zoom

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
        <g transform={tfStr}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.NAME || geo.properties.name
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#dde3ed"
                    stroke="#b4bece"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none' },
                      hover:   { outline: 'none', fill: '#c8d2e0' },
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
                <circle r={(active ? r + 9   : r + 5) * invK} fill={color} opacity={active ? 0.28 : 0.18} />
                <circle r={(active ? r * 1.5 : r)     * invK} fill={color} opacity={active ? 1   : 0.88} />
              </Marker>
            )
          })}
        </g>
      </ComposableMap>

      {/* Zoom + Reset controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
        <button onClick={() => zoomBtn(1.5)}   aria-label="Zoom in"    className={`${BTN_CLS} text-lg font-light`}>+</button>
        <button onClick={() => zoomBtn(1/1.5)} aria-label="Zoom out"   className={`${BTN_CLS} text-lg font-light`}>−</button>
        <div className="h-px bg-slate-200/80 mx-0.5 my-0.5" />
        <button onClick={() => setTf(INITIAL)} aria-label="Reset view" title="Reset view" className={`${BTN_CLS} text-base`}>↺</button>
      </div>

      {/* Country name tooltip */}
      {countryTip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: countryTip.x + 12, top: countryTip.y - 36 }}
        >
          <div className="bg-slate-800/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap">
            {countryTip.name}
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { WORLD_MAP_DESTINATIONS, MOOD_COLORS } from '../../data/worldMapStats'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const MAX_COUNT = Math.max(...WORLD_MAP_DESTINATIONS.map(d => d.generatedCount))

const INITIAL_ZOOM   = 1
const INITIAL_CENTER = [10, 48]

// react-simple-maps v1: ZoomableGroup only zooms on Ctrl+wheel via a native SVG
// listener. Plain wheel events are ignored by the library.
//
// Our wheel handler:
//   - calls preventDefault() on every wheel over the container → no page scroll
//   - if not Ctrl+wheel, forwards a synthetic Ctrl+wheel to the SVG so
//     ZoomableGroup handles it natively (smooth zoom, pan preserved, no remount)
//
// Button zoom uses key={resetKey} to force a ZoomableGroup remount at the new
// zoom level; this resets the pan center to INITIAL_CENTER.

function markerR(count) {
  return 3.5 + (count / MAX_COUNT) * 7
}

const BTN = [
  'w-8 h-8 rounded-lg',
  'bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm',
  'flex items-center justify-center',
  'text-slate-600 hover:bg-white hover:scale-110',
  'cursor-pointer transition-all duration-150',
].join(' ')

export default function GeneratedWorldMap({ highlightCity, onMarkerHover }) {
  const [zoom,     setZoom]     = useState(INITIAL_ZOOM)
  const [resetKey, setResetKey] = useState(0)
  const [countryTip, setCountryTip] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e) => {
      e.preventDefault() // always block page scroll / browser Ctrl+zoom

      if (!e.ctrlKey) {
        // Forward as Ctrl+wheel so ZoomableGroup's native SVG listener zooms smoothly
        const svg = el.querySelector('svg')
        svg?.dispatchEvent(new WheelEvent('wheel', {
          deltaY: e.deltaY,
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
        }))
      }
      // Real Ctrl+wheel: already handled by ZoomableGroup's SVG listener before
      // this handler fires; we just needed to prevent browser page-zoom above.
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const zoomIn    = () => { setZoom(z => Math.min(z * 1.6, 6));   setResetKey(k => k + 1) }
  const zoomOut   = () => { setZoom(z => Math.max(z / 1.6, 0.5)); setResetKey(k => k + 1) }
  const resetView = () => { setZoom(INITIAL_ZOOM);                  setResetKey(k => k + 1) }

  return (
    <div ref={containerRef} className="relative">
      <ComposableMap
        width={800}
        height={400}
        projectionConfig={{ scale: 150 }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup
          key={resetKey}
          zoom={zoom}
          center={INITIAL_CENTER}
          minZoom={0.5}
          maxZoom={6}
        >
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
                    onMouseEnter={(e) => name && setCountryTip({ name, x: e.clientX, y: e.clientY })}
                    onMouseMove={(e)  => setCountryTip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                    onMouseLeave={()  => setCountryTip(null)}
                  />
                )
              })
            }
          </Geographies>

          {WORLD_MAP_DESTINATIONS.map((dest) => {
            const r = markerR(dest.generatedCount)
            const active = highlightCity === dest.city
            const color  = MOOD_COLORS[dest.topMood] ?? '#3b82f6'
            return (
              <Marker
                key={dest.city}
                coordinates={[dest.lng, dest.lat]}
                onMouseEnter={(e) => onMarkerHover(dest, e)}
                onMouseMove={(e)  => onMarkerHover(dest, e)}
                onMouseLeave={()  => onMarkerHover(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle r={active ? r + 9   : r + 5} fill={color} opacity={active ? 0.28 : 0.18} />
                <circle r={active ? r * 1.5 : r}     fill={color} opacity={active ? 1   : 0.88} />
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom + Reset controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
        <button onClick={zoomIn}    aria-label="Zoom in"    className={`${BTN} text-lg font-light`}>+</button>
        <button onClick={zoomOut}   aria-label="Zoom out"   className={`${BTN} text-lg font-light`}>−</button>
        <div className="h-px bg-slate-200/80 mx-0.5 my-0.5" />
        <button onClick={resetView} aria-label="Reset view" title="Reset view" className={`${BTN} text-base`}>↺</button>
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

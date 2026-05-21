import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { WORLD_MAP_DESTINATIONS, MOOD_COLORS } from '../../data/worldMapStats'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const MAX_COUNT = Math.max(...WORLD_MAP_DESTINATIONS.map(d => d.generatedCount))

function markerR(count) {
  return 3.5 + (count / MAX_COUNT) * 7
}

export default function GeneratedWorldMap({ highlightCity, onMarkerHover }) {
  return (
    <ComposableMap
      projectionConfig={{ scale: 200, center: [5, 40] }}
      style={{ width: '100%', height: 'auto' }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#1e293b"
              stroke="#334155"
              strokeWidth={0.3}
              style={{
                default: { outline: 'none' },
                hover:   { outline: 'none', fill: '#263348' },
                pressed: { outline: 'none' },
              }}
            />
          ))
        }
      </Geographies>

      {WORLD_MAP_DESTINATIONS.map((dest) => {
        const r = markerR(dest.generatedCount)
        const active = highlightCity === dest.city
        const color = MOOD_COLORS[dest.topMood] ?? '#3b82f6'

        return (
          <Marker
            key={dest.city}
            coordinates={[dest.lng, dest.lat]}
            onMouseEnter={(e) => onMarkerHover(dest, e)}
            onMouseMove={(e)  => onMarkerHover(dest, e)}
            onMouseLeave={()  => onMarkerHover(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle r={active ? r + 9  : r + 5} fill={color} opacity={active ? 0.22 : 0.1 } />
            <circle r={active ? r * 1.5 : r}    fill={color} opacity={active ? 1   : 0.72} />
          </Marker>
        )
      })}
    </ComposableMap>
  )
}

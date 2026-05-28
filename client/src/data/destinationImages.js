/* ──────────────────────────────────────────────────────────────────────
   destinationImages.js
   Maps destination city names to representative background images.

   Strategy:
   - Major test cities: specific Unsplash photo ID (city-specific photo)
   - All other cities:  picsum.photos with a city-name seed
     → always loads, consistent per city, beautiful landscape/travel photo
   - Fallback: picsum seed "travel-destination" (for unknown cities)

   getDestinationImage(destination) → string URL, always resolves.
   ────────────────────────────────────────────────────────────────────── */

const UNS_BASE   = 'https://images.unsplash.com/photo-'
const UNS_PARAMS = '?auto=format&fit=crop&w=1200&q=80'

/** Specific Unsplash photo by ID (city-representative, may fail → onError handles) */
const uns = id => `${UNS_BASE}${id}${UNS_PARAMS}`

/** Picsum with seeded slug — always loads, consistent per seed */
const pic = seed => `https://picsum.photos/seed/${seed}/1600/900`

/* ── Image map ──────────────────────────────────────────────────────── */

const IMAGES = {

  // ── Specific Unsplash photos for top test cities ─────────────────────
  // These may show the real landmark if the photo ID is valid.
  // If they 404, the <img onError> in DestinationResultPage falls back
  // to picsum with the city name as seed (always loads).
  paris:     uns('1502602898657-3e91760cbb34'),  // Eiffel Tower
  rome:      uns('1552832230-c0197dd311b5'),      // Colosseum
  barcelona: uns('1539037116277-4db20889f2d4'),   // Sagrada Familia / skyline
  amsterdam: uns('1534351590666-13e3e96b5017'),   // Canal / bridge
  santorini: uns('1570077188670-e3a8d69ac5ff'),   // Blue domes / cliffs

  // ── Reliable picsum for all other cities ─────────────────────────────
  // Seed = city slug → same photo every time for each city (not city-specific
  // but guaranteed to be a beautiful travel/landscape/architecture photo).

  // UK & Ireland
  london:       pic('london-city'),
  edinburgh:    pic('edinburgh-scotland'),
  dublin:       pic('dublin-ireland'),

  // France
  nice:         pic('nice-france'),
  marseille:    pic('marseille-france'),
  lyon:         pic('lyon-france'),

  // Spain
  madrid:       pic('madrid-spain'),
  seville:      pic('seville-spain'),
  alicante:     pic('alicante-coast'),
  malaga:       pic('malaga-coast'),
  palma:        pic('palma-mallorca'),
  ibiza:        pic('ibiza-island'),
  granada:      pic('granada-spain'),
  bilbao:       pic('bilbao-spain'),
  tenerife:     pic('tenerife-island'),
  lanzarote:    pic('lanzarote-island'),
  fuerteventura:pic('fuerteventura-island'),

  // Portugal
  lisbon:       pic('lisbon-portugal'),
  porto:        pic('porto-portugal'),
  faro:         pic('faro-portugal'),

  // Italy
  venice:       uns('1523906834658-6e24ef2386f9'),  // Venice canal (high-confidence ID)
  milan:        pic('milan-italy'),
  naples:       pic('naples-italy'),
  florence:     pic('florence-italy'),
  amalfi:       pic('amalfi-coast'),
  bologna:      pic('bologna-italy'),
  turin:        pic('turin-italy'),
  verona:       pic('verona-italy'),

  // Greece
  athens:       pic('athens-greece'),
  mykonos:      pic('mykonos-greece'),
  thessaloniki: pic('thessaloniki-greece'),
  corfu:        pic('corfu-island'),
  rhodes:       pic('rhodes-greece'),
  crete:        pic('crete-island'),
  heraklion:    pic('heraklion-crete'),

  // Netherlands
  // (amsterdam handled above with specific photo)

  // Germany
  berlin:       pic('berlin-germany'),
  munich:       pic('munich-germany'),
  hamburg:      pic('hamburg-germany'),
  frankfurt:    pic('frankfurt-germany'),
  cologne:      pic('cologne-germany'),

  // Czech Republic
  prague:       uns('1541849546-216549ae216d'),  // Prague old town (high-confidence)

  // Austria
  vienna:       pic('vienna-austria'),
  salzburg:     pic('salzburg-austria'),
  innsbruck:    pic('innsbruck-austria'),

  // Hungary
  budapest:     pic('budapest-hungary'),

  // Poland
  krakow:       pic('krakow-poland'),
  warsaw:       pic('warsaw-poland'),
  gdansk:       pic('gdansk-poland'),

  // Croatia
  dubrovnik:    pic('dubrovnik-croatia'),
  split:        pic('split-croatia'),
  zagreb:       pic('zagreb-croatia'),

  // Turkey
  istanbul:     pic('istanbul-turkey'),
  antalya:      pic('antalya-turkey'),
  bodrum:       pic('bodrum-turkey'),

  // Scandinavia
  copenhagen:   pic('copenhagen-denmark'),
  stockholm:    pic('stockholm-sweden'),
  oslo:         pic('oslo-norway'),
  reykjavik:    pic('reykjavik-iceland'),
  helsinki:     pic('helsinki-finland'),
  bergen:       pic('bergen-norway'),
  gothenburg:   pic('gothenburg-sweden'),

  // Eastern Europe
  sofia:        pic('sofia-bulgaria'),
  bucharest:    pic('bucharest-romania'),
  riga:         pic('riga-latvia'),
  tallinn:      pic('tallinn-estonia'),
  vilnius:      pic('vilnius-lithuania'),
  bratislava:   pic('bratislava-slovakia'),
  ljubljana:    pic('ljubljana-slovenia'),
  belgrade:     pic('belgrade-serbia'),
  sarajevo:     pic('sarajevo-bosnia'),
  skopje:       pic('skopje-macedonia'),

  // Malta
  malta:        pic('malta-island'),
  valletta:     pic('valletta-malta'),

  // Morocco
  marrakech:    pic('marrakech-morocco'),
  casablanca:   pic('casablanca-morocco'),
  fez:          pic('fez-morocco'),

  // Middle East
  dubai:        pic('dubai-cityscape'),
  'abu dhabi':  pic('abudhabi-uae'),

  // Cyprus
  cyprus:       pic('cyprus-island'),
  paphos:       pic('paphos-cyprus'),

}

/* Always-works global fallback */
const FALLBACK = pic('travel-destination-landscape')

/* ── Normalise helpers ──────────────────────────────────────────────── */

function removeAccents(str) {
  try {
    return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
  } catch {
    return str
  }
}

function toKey(raw) {
  return removeAccents(raw)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/* ── Public API ─────────────────────────────────────────────────────── */

/**
 * Returns a background image URL for the given destination.
 * Always returns a valid URL — falls back to a generic travel photo.
 *
 * Logs the lookup to the console for debugging (remove once confirmed).
 */
export function getDestinationImage(destination) {
  if (!destination) return FALLBACK

  const rawName =
    destination.city ||
    destination.name ||
    destination.destination_name ||
    ''

  if (!rawName) return FALLBACK

  const key = toKey(rawName)
  console.log('[destinationImages] rawName:', rawName, '→ key:', `"${key}"`)

  // Exact match
  if (IMAGES[key]) {
    console.log('[destinationImages] exact match →', IMAGES[key])
    return IMAGES[key]
  }

  // Partial match: our slug is contained in the key (or vice versa)
  for (const [slug, url] of Object.entries(IMAGES)) {
    if (key.includes(slug) || slug.includes(key)) {
      console.log('[destinationImages] partial match:', slug, '→', url)
      return url
    }
  }

  // No match — return picsum seeded with the city name for a consistent photo
  const seed = key.replace(/\s/g, '-') || 'travel'
  const fallbackUrl = pic(seed)
  console.log('[destinationImages] no match, seed fallback →', fallbackUrl)
  return fallbackUrl
}

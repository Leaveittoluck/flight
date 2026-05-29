/* ──────────────────────────────────────────────────────────────────────
   destinationImages.js
   Maps every seeded destination city → a local image path.

   All images live under:  client/public/images/destinations/

   To add a real photo:
     1. Drop <key>.jpg into client/public/images/destinations/
        (e.g.  paris.jpg,  gran-canaria.jpg,  sharm-el-sheikh.jpg)
     2. No code change needed — the path is already wired here.

   If the file is absent the <img onError> in DestinationResultPage falls
   back to  _fallback.jpg  in the same folder.  Drop one good landscape
   photo there to cover any gaps.

   Keys are produced by normalizeDestinationKey() — lowercase, accents
   stripped, spaces → hyphens, punctuation removed.
   ────────────────────────────────────────────────────────────────────── */

const BASE = '/images/destinations'

function local(key) {
  return `${BASE}/${key}.jpg`
}

/* ── Normalise ──────────────────────────────────────────────────────── */

function stripAccents(str) {
  try { return str.normalize('NFD').replace(/[̀-ͯ]/g, '') }
  catch { return str }
}

/**
 * Normalise a city name to a stable map key.
 * "Gran Canaria" → "gran-canaria"
 * "Sharm El Sheikh" → "sharm-el-sheikh"
 * "Cluj-Napoca" → "cluj-napoca"
 */
export function normalizeDestinationKey(raw) {
  return stripAccents(raw || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/* ── Image map ──────────────────────────────────────────────────────── */

const IMAGES = {

  // ── Major landmarks ───────────────────────────────────────────────
  'paris':                      local('paris'),          // Eiffel Tower
  'rome':                       local('rome'),           // Colosseum
  'barcelona':                  local('barcelona'),      // Sagrada Família
  'amsterdam':                  local('amsterdam'),      // Canals
  'santorini':                  local('santorini'),      // Blue domes
  'venice':                     local('venice'),         // Grand Canal
  'prague':                     local('prague'),         // Charles Bridge / Old Town
  'athens':                     local('athens'),         // Acropolis
  'dubrovnik':                  local('dubrovnik'),      // Old town walls
  'lisbon':                     local('lisbon'),         // Tram / Alfama
  'istanbul':                   local('istanbul'),       // Hagia Sophia / Bosphorus
  'budapest':                   local('budapest'),       // Parliament

  // ── Spain ──────────────────────────────────────────────────────────
  'alicante':                   local('alicante'),
  'malaga':                     local('malaga'),
  'palma':                      local('palma'),
  'ibiza':                      local('ibiza'),
  'lanzarote':                  local('lanzarote'),
  'fuerteventura':              local('fuerteventura'),
  'gran-canaria':               local('gran-canaria'),
  'tenerife':                   local('tenerife'),
  'valencia':                   local('valencia'),
  'seville':                    local('seville'),
  'madrid':                     local('madrid'),
  'menorca':                    local('menorca'),
  'almeria':                    local('almeria'),
  'girona':                     local('girona'),
  'santander':                  local('santander'),
  'santiago-de-compostela':     local('santiago-de-compostela'),
  'zaragoza':                   local('zaragoza'),

  // ── Portugal ───────────────────────────────────────────────────────
  'faro':                       local('faro'),
  'porto':                      local('porto'),
  'ponta-delgada':              local('ponta-delgada'),

  // ── France ─────────────────────────────────────────────────────────
  'nice':                       local('nice'),
  'marseille':                  local('marseille'),
  'biarritz':                   local('biarritz'),
  'toulouse':                   local('toulouse'),

  // ── Italy ──────────────────────────────────────────────────────────
  'milan':                      local('milan'),
  'naples':                     local('naples'),
  'pisa':                       local('pisa'),
  'bologna':                    local('bologna'),
  'florence':                   local('florence'),
  'verona':                     local('verona'),
  'turin':                      local('turin'),
  'cagliari':                   local('cagliari'),
  'olbia':                      local('olbia'),
  'alghero':                    local('alghero'),
  'catania':                    local('catania'),
  'palermo':                    local('palermo'),
  'rimini':                     local('rimini'),
  'trapani':                    local('trapani'),
  'reggio-calabria':            local('reggio-calabria'),
  'lamezia-terme':              local('lamezia-terme'),

  // ── Greece ─────────────────────────────────────────────────────────
  'corfu':                      local('corfu'),
  'rhodes':                     local('rhodes'),
  'zakynthos':                  local('zakynthos'),
  'thessaloniki':               local('thessaloniki'),
  'heraklion':                  local('heraklion'),
  'chania':                     local('chania'),
  'kalamata':                   local('kalamata'),
  'skiathos':                   local('skiathos'),
  'preveza':                    local('preveza'),
  'kos':                        local('kos'),
  'kefalonia':                  local('kefalonia'),
  'aarhus':                     local('aarhus'),

  // ── Croatia ────────────────────────────────────────────────────────
  'split':                      local('split'),
  'zadar':                      local('zadar'),
  'pula':                       local('pula'),
  'zagreb':                     local('zagreb'),

  // ── Turkey ─────────────────────────────────────────────────────────
  'antalya':                    local('antalya'),
  'dalaman':                    local('dalaman'),
  'bodrum':                     local('bodrum'),
  'kayseri':                    local('kayseri'),

  // ── Germany ────────────────────────────────────────────────────────
  'berlin':                     local('berlin'),
  'munich':                     local('munich'),
  'hamburg':                    local('hamburg'),
  'cologne':                    local('cologne'),
  'bremen':                     local('bremen'),

  // ── Austria ────────────────────────────────────────────────────────
  'vienna':                     local('vienna'),
  'salzburg':                   local('salzburg'),
  'innsbruck':                  local('innsbruck'),

  // ── Switzerland ────────────────────────────────────────────────────
  'zurich':                     local('zurich'),
  'geneva':                     local('geneva'),

  // ── Czech Republic ─────────────────────────────────────────────────
  'brno':                       local('brno'),

  // ── Poland ─────────────────────────────────────────────────────────
  'krakow':                     local('krakow'),
  'warsaw':                     local('warsaw'),
  'wroclaw':                    local('wroclaw'),

  // ── Slovakia ───────────────────────────────────────────────────────
  'bratislava':                 local('bratislava'),
  'poprad':                     local('poprad'),

  // ── Romania ────────────────────────────────────────────────────────
  'bucharest':                  local('bucharest'),
  'cluj-napoca':                local('cluj-napoca'),

  // ── Bulgaria ───────────────────────────────────────────────────────
  'sofia':                      local('sofia'),
  'plovdiv':                    local('plovdiv'),

  // ── Baltic States ──────────────────────────────────────────────────
  'tallinn':                    local('tallinn'),
  'riga':                       local('riga'),
  'vilnius':                    local('vilnius'),

  // ── Scandinavia ────────────────────────────────────────────────────
  'oslo':                       local('oslo'),
  'bergen':                     local('bergen'),
  'reykjavik':                  local('reykjavik'),
  'copenhagen':                 local('copenhagen'),
  'helsinki':                   local('helsinki'),

  // ── Netherlands ────────────────────────────────────────────────────
  'eindhoven':                  local('eindhoven'),
  'rotterdam':                  local('rotterdam'),

  // ── Belgium ────────────────────────────────────────────────────────
  'brussels':                   local('brussels'),

  // ── UK & Ireland ───────────────────────────────────────────────────
  'edinburgh':                  local('edinburgh'),
  'dublin':                     local('dublin'),
  'belfast':                    local('belfast'),
  'cork':                       local('cork'),
  'kerry':                      local('kerry'),

  // ── Malta ──────────────────────────────────────────────────────────
  'malta':                      local('malta'),

  // ── Luxembourg ─────────────────────────────────────────────────────
  'luxembourg':                 local('luxembourg'),

  // ── Albania ────────────────────────────────────────────────────────
  'tirana':                     local('tirana'),

  // ── Bosnia ─────────────────────────────────────────────────────────
  'sarajevo':                   local('sarajevo'),

  // ── Moldova ────────────────────────────────────────────────────────
  'chisinau':                   local('chisinau'),

  // ── Morocco ────────────────────────────────────────────────────────
  'marrakech':                  local('marrakech'),
  'agadir':                     local('agadir'),
  'essaouira':                  local('essaouira'),
  'ouarzazate':                 local('ouarzazate'),
  'tangier':                    local('tangier'),
  'casablanca':                 local('casablanca'),
  'rabat':                      local('rabat'),
  'fes':                        local('fes'),

  // ── Egypt ──────────────────────────────────────────────────────────
  'sharm-el-sheikh':            local('sharm-el-sheikh'),

  // ── Cyprus ─────────────────────────────────────────────────────────
  'paphos':                     local('paphos'),
  'larnaca':                    local('larnaca'),

  // ── Jordan ─────────────────────────────────────────────────────────
  'amman':                      local('amman'),

  // ── Israel ─────────────────────────────────────────────────────────
  'tel-aviv':                   local('tel-aviv'),
}

const FALLBACK_PATH = `${BASE}/_fallback.jpg`

/* ── Public API ─────────────────────────────────────────────────────── */

/**
 * Returns the local image path for the given destination.
 * The path is always returned regardless of whether the file exists —
 * the <img onError> handler in DestinationResultPage catches missing files.
 *
 * Drop  client/public/images/destinations/<key>.jpg  to activate an image.
 * Drop  client/public/images/destinations/_fallback.jpg  as a catch-all.
 */
export function getDestinationImage(destination) {
  if (!destination) return FALLBACK_PATH

  const rawName =
    destination.city ||
    destination.name ||
    destination.destination_name ||
    ''

  if (!rawName) return FALLBACK_PATH

  const key = normalizeDestinationKey(rawName)
  const path = IMAGES[key]

  if (!path) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[LITL] No curated image found for destination:', rawName, '(key:', `"${key}"` + ')')
    }
    return FALLBACK_PATH
  }

  return path
}

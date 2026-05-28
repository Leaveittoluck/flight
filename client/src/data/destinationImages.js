/* ──────────────────────────────────────────────────────────────────────
   destinationImages.js
   Maps seed destination city names → representative background photos.

   All 126 seed destinations are mapped. Keys are produced by
   normalizeDestinationKey(): lowercase, accents stripped, spaces → hyphens,
   punctuation removed. The same function is used to build keys AND to look
   up incoming city names, so they always match exactly.

   URL strategy per city:
   ▸ Unsplash photo ID  — city-representative landmark photo.
     If the photo ID is wrong, the <img onError> in DestinationResultPage
     falls back to a picsum seed (guaranteed to load).
   ▸ picsum seed URL    — consistent, beautiful travel photo per city.
     Same photo every time for the same seed; not city-specific but always
     loads and never fails.
   ────────────────────────────────────────────────────────────────────── */

const UNS = id   => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`
const PIC = seed => `https://picsum.photos/seed/${seed}/1600/900`

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
    .replace(/[^a-z0-9\s]/g, '')  // strip punctuation (keeps spaces)
    .replace(/\s+/g, '-')          // spaces → hyphens
    .replace(/-+/g, '-')           // collapse consecutive hyphens
    .replace(/^-|-$/g, '')         // trim leading/trailing hyphens
}

/* ── Image map ──────────────────────────────────────────────────────── */
// Keys: normalizeDestinationKey(city) for every seed destination.
// Exact match only — no fuzzy/partial logic to avoid wrong matches.

const IMAGES = {

  // ── Landmark photos (Unsplash photo IDs) ─────────────────────────────
  // onError in DestinationResultPage falls back to picsum if ID is wrong.
  'paris':       UNS('1499856608851-79397a83c21f'),  // Eiffel Tower
  'rome':        UNS('1552832230-c0197dd311b5'),      // Colosseum
  'barcelona':   UNS('1539037116277-4db20889f2d4'),   // Sagrada Família
  'amsterdam':   UNS('1534351590666-13e3e96b5017'),   // Canals
  'santorini':   UNS('1570077188670-e3a8d69ac5ff'),   // Blue domes
  'venice':      UNS('1523906834658-6e24ef2386f9'),   // Grand Canal
  'prague':      UNS('1541849546-216549ae216d'),      // Old Town Square
  'athens':      UNS('1533105079-a84978a59ab4'),      // Acropolis
  'dubrovnik':   UNS('1555990538-1db75e95a571'),      // Old town walls
  'lisbon':      UNS('1548707668-7b9b57d03d76'),      // Tram / Alfama
  'istanbul':    UNS('1524231757912-21f4fe3a7200'),   // Hagia Sophia
  'budapest':    UNS('1549737221-bef65e2b2061'),      // Parliament

  // ── Spain ────────────────────────────────────────────────────────────
  'alicante':                  PIC('alicante-spain-coast'),
  'malaga':                    PIC('malaga-costa-del-sol'),
  'palma':                     PIC('palma-mallorca-cathedral'),
  'ibiza':                     PIC('ibiza-dalt-vila-sunset'),
  'lanzarote':                 PIC('lanzarote-volcanic-landscape'),
  'fuerteventura':             PIC('fuerteventura-white-dunes-canary'),
  'gran-canaria':              PIC('gran-canaria-maspalomas-dunes'),
  'tenerife':                  PIC('tenerife-teide-volcano-canary'),
  'valencia':                  PIC('valencia-city-arts-sciences'),
  'seville':                   PIC('seville-alcazar-andalusia'),
  'madrid':                    PIC('madrid-prado-gran-via'),
  'menorca':                   PIC('menorca-cala-macarella-cove'),
  'almeria':                   PIC('almeria-tabernas-desert-spain'),
  'girona':                    PIC('girona-medieval-walls-cathedral'),
  'santander':                 PIC('santander-bay-cantabria'),
  'santiago-de-compostela':    PIC('santiago-compostela-cathedral'),
  'zaragoza':                  PIC('zaragoza-basilica-pilar'),

  // ── Portugal ─────────────────────────────────────────────────────────
  'faro':                      PIC('faro-algarve-cliffs-portugal'),
  'porto':                     PIC('porto-ribeira-douro-valley'),
  'ponta-delgada':             PIC('ponta-delgada-azores-crater'),

  // ── France ───────────────────────────────────────────────────────────
  'nice':                      PIC('nice-promenade-cote-azur'),
  'marseille':                 PIC('marseille-vieux-port-calanques'),
  'biarritz':                  PIC('biarritz-beach-basque-coast'),
  'toulouse':                  PIC('toulouse-pink-city-garonne'),

  // ── Italy ────────────────────────────────────────────────────────────
  'milan':                     PIC('milan-duomo-galleria-italy'),
  'naples':                    PIC('naples-vesuvius-bay-italy'),
  'pisa':                      PIC('pisa-leaning-tower-tuscany'),
  'bologna':                   PIC('bologna-two-towers-italy'),
  'florence':                  PIC('florence-duomo-ponte-vecchio'),
  'verona':                    PIC('verona-arena-amphitheatre'),
  'turin':                     PIC('turin-piazza-castello-italy'),
  'cagliari':                  PIC('cagliari-sardinia-castle'),
  'olbia':                     PIC('olbia-costa-smeralda-sardinia'),
  'alghero':                   PIC('alghero-sardinia-sea-walls'),
  'catania':                   PIC('catania-etna-volcano-sicily'),
  'palermo':                   PIC('palermo-sicily-market-cathedral'),
  'rimini':                    PIC('rimini-adriatic-roman-arch'),
  'trapani':                   PIC('trapani-salt-pans-windmills'),
  'reggio-calabria':           PIC('reggio-calabria-strait-messina'),
  'lamezia-terme':             PIC('tropea-calabria-clifftop-sea'),

  // ── Greece ───────────────────────────────────────────────────────────
  'corfu':                     PIC('corfu-ionian-venetian-fortress'),
  'rhodes':                    PIC('rhodes-walled-city-colossus'),
  'zakynthos':                 PIC('zakynthos-navagio-shipwreck'),
  'thessaloniki':              PIC('thessaloniki-white-tower-waterfront'),
  'heraklion':                 PIC('heraklion-knossos-palace-crete'),
  'chania':                    PIC('chania-venetian-harbour-crete'),
  'kalamata':                  PIC('kalamata-mani-peninsula-greece'),
  'skiathos':                  PIC('skiathos-pine-beach-greece'),
  'preveza':                   PIC('preveza-ionian-nikopolis'),
  'kos':                       PIC('kos-aegean-greece-hippocrates'),
  'kefalonia':                 PIC('kefalonia-myrtos-beach-ionian'),
  'aarhus':                    PIC('aarhus-aros-rainbow-museum'),

  // ── Croatia ──────────────────────────────────────────────────────────
  'split':                     PIC('split-diocletian-palace-croatia'),
  'zadar':                     PIC('zadar-sea-organ-sunset'),
  'pula':                      PIC('pula-roman-arena-istria'),
  'zagreb':                    PIC('zagreb-cathedral-upper-town'),

  // ── Turkey ───────────────────────────────────────────────────────────
  'antalya':                   PIC('antalya-harbour-taurus-mountains'),
  'dalaman':                   PIC('dalaman-oludeniz-blue-lagoon'),
  'bodrum':                    PIC('bodrum-castle-aegean-turkey'),
  'kayseri':                   PIC('kayseri-cappadocia-hot-air-balloons'),

  // ── Germany ──────────────────────────────────────────────────────────
  'berlin':                    PIC('berlin-brandenburger-tor'),
  'munich':                    PIC('munich-marienplatz-beer-garden'),
  'hamburg':                   PIC('hamburg-elbphilharmonie-speicherstadt'),
  'cologne':                   PIC('cologne-dom-cathedral-rhine'),
  'bremen':                    PIC('bremen-marktplatz-roland'),

  // ── Austria ──────────────────────────────────────────────────────────
  'vienna':                    PIC('vienna-schonbrunn-opera'),
  'salzburg':                  PIC('salzburg-fortress-alps-mozart'),
  'innsbruck':                 PIC('innsbruck-golden-roof-alps'),

  // ── Switzerland ──────────────────────────────────────────────────────
  'zurich':                    PIC('zurich-lake-old-town-alps'),
  'geneva':                    PIC('geneva-jet-deau-lake-alps'),

  // ── Czech Republic ────────────────────────────────────────────────────
  'brno':                      PIC('brno-spilberk-castle-moravia'),

  // ── Poland ────────────────────────────────────────────────────────────
  'krakow':                    PIC('krakow-wawel-cloth-hall'),
  'warsaw':                    PIC('warsaw-old-town-rebuilt'),
  'wroclaw':                   PIC('wroclaw-market-square-gnomes'),

  // ── Slovakia ─────────────────────────────────────────────────────────
  'bratislava':                PIC('bratislava-castle-danube'),
  'poprad':                    PIC('poprad-high-tatras-peaks'),

  // ── Romania ───────────────────────────────────────────────────────────
  'bucharest':                 PIC('bucharest-parliament-palace'),
  'cluj-napoca':               PIC('cluj-napoca-unirii-transylvania'),

  // ── Bulgaria ──────────────────────────────────────────────────────────
  'sofia':                     PIC('sofia-nevsky-cathedral-vitosha'),
  'plovdiv':                   PIC('plovdiv-roman-amphitheatre-bulgaria'),

  // ── Baltic States ─────────────────────────────────────────────────────
  'tallinn':                   PIC('tallinn-medieval-towers-estonia'),
  'riga':                      PIC('riga-art-nouveau-latvia'),
  'vilnius':                   PIC('vilnius-baroque-gediminas-castle'),

  // ── Scandinavia ───────────────────────────────────────────────────────
  'oslo':                      PIC('oslo-fjord-opera-house'),
  'bergen':                    PIC('bergen-bryggen-wharf-fjord'),
  'reykjavik':                 PIC('reykjavik-hallgrimskirkja-iceland'),
  'copenhagen':                PIC('copenhagen-nyhavn-colourful-canal'),
  'helsinki':                  PIC('helsinki-cathedral-market-harbour'),

  // ── Netherlands ───────────────────────────────────────────────────────
  'eindhoven':                 PIC('eindhoven-design-strijp-netherlands'),
  'rotterdam':                 PIC('rotterdam-markthal-cube-houses'),

  // ── Belgium ───────────────────────────────────────────────────────────
  'brussels':                  PIC('brussels-grand-place-guilds'),

  // ── UK & Ireland ──────────────────────────────────────────────────────
  'edinburgh':                 PIC('edinburgh-castle-royal-mile'),
  'dublin':                    PIC('dublin-temple-bar-trinity'),
  'belfast':                   PIC('belfast-titanic-quarter-museum'),
  'cork':                      PIC('cork-english-market-ireland'),
  'kerry':                     PIC('kerry-ring-skellig-atlantic'),

  // ── Malta ─────────────────────────────────────────────────────────────
  'malta':                     PIC('malta-valletta-grand-harbour'),

  // ── Luxembourg ────────────────────────────────────────────────────────
  'luxembourg':                PIC('luxembourg-casemates-gorge'),

  // ── Albania ───────────────────────────────────────────────────────────
  'tirana':                    PIC('tirana-skanderbeg-square'),

  // ── Bosnia ────────────────────────────────────────────────────────────
  'sarajevo':                  PIC('sarajevo-latin-bridge-bazaar'),

  // ── Moldova ───────────────────────────────────────────────────────────
  'chisinau':                  PIC('chisinau-moldova-wine-cellars'),

  // ── Morocco ───────────────────────────────────────────────────────────
  'marrakech':                 PIC('marrakech-jemaa-djemaa-fna'),
  'agadir':                    PIC('agadir-atlantic-beach-morocco'),
  'essaouira':                 PIC('essaouira-blue-medina-atlantic'),
  'ouarzazate':                PIC('ouarzazate-ait-benhaddou-kasbah'),
  'tangier':                   PIC('tangier-strait-casbah-morocco'),
  'casablanca':                PIC('casablanca-hassan-ii-mosque'),
  'rabat':                     PIC('rabat-hassan-tower-kasbah'),
  'fes':                       PIC('fes-medina-tannery-morocco'),

  // ── Egypt ─────────────────────────────────────────────────────────────
  'sharm-el-sheikh':           PIC('sharm-el-sheikh-red-sea-coral'),

  // ── Cyprus ────────────────────────────────────────────────────────────
  'paphos':                    PIC('paphos-aphrodite-rock-cyprus'),
  'larnaca':                   PIC('larnaca-salt-lake-flamingos'),

  // ── Jordan ────────────────────────────────────────────────────────────
  'amman':                     PIC('amman-petra-jordan-citadel'),

  // ── Israel ────────────────────────────────────────────────────────────
  'tel-aviv':                  PIC('tel-aviv-beach-bauhaus-israel'),
}

const FALLBACK = PIC('travel-golden-hour-landscape')

/* ── Public API ─────────────────────────────────────────────────────── */

/**
 * Returns a background image URL for the given destination object.
 * Always returns a valid URL. Logs a warning in development for unknown cities.
 */
export function getDestinationImage(destination) {
  if (!destination) return FALLBACK

  const rawName =
    destination.city ||
    destination.name ||
    destination.destination_name ||
    ''

  if (!rawName) return FALLBACK

  const key = normalizeDestinationKey(rawName)
  const url = IMAGES[key]

  if (url) return url

  if (process.env.NODE_ENV !== 'production') {
    console.warn('[LITL] Missing destination image for:', rawName, '(key:', `"${key}"` + ')')
  }

  // City not in map — use picsum seeded with the normalised city name.
  // Consistent per city: same photo every time, always loads.
  return PIC(key || 'travel')
}

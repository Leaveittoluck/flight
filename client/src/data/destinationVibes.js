/**
 * Static destination vibe enrichment keyed by IATA code.
 * Covers all seeded STN destinations — no live API required.
 *
 * Shape:
 *   tags          — 2–4 short personality labels
 *   travelStyle   — one-line trip archetype
 *   bestFor       — who this trip suits
 *   atmosphere    — short evocative sentence about the travel personality
 */
export const destinationVibes = {
  // ── Beach & Sun ──────────────────────────────────────────────────────────
  ALC: {
    tags: ['Coastal', 'Relaxed', 'Foodie'],
    travelStyle: 'Sun-soaked beach escape',
    bestFor: 'Beach lovers and sun-seekers',
    atmosphere: 'Golden beaches, waterfront tapas, and evenings that stretch until midnight.',
  },
  AGP: {
    tags: ['Coastal', 'Cultural', 'Foodie'],
    travelStyle: 'Art-filled coastal city break',
    bestFor: 'Culture lovers who want the beach nearby',
    atmosphere: "Moorish history meets Costa del Sol beach culture — Picasso's city by the sea.",
  },
  PMI: {
    tags: ['Coastal', 'Foodie', 'Scenic'],
    travelStyle: 'Mediterranean island escape',
    bestFor: 'Foodies and beach romantics',
    atmosphere: 'A medieval cathedral at sunrise, cobblestone courtyards by day, cove-hopping by boat.',
  },
  IBZ: {
    tags: ['Nightlife', 'Coastal', 'Island'],
    travelStyle: 'Vibrant island getaway',
    bestFor: 'Night owls, sunset chasers, and free spirits',
    atmosphere: 'Hidden coves by day, electric terrace bars by night — Ibiza has two faces and both are worth knowing.',
  },
  FAO: {
    tags: ['Coastal', 'Nature', 'Relaxed'],
    travelStyle: 'Slow Algarve escape',
    bestFor: 'Nature lovers and couples',
    atmosphere: 'Clifftop walks, sea caves, and fresh seafood at a table with an Atlantic view.',
  },
  ACE: {
    tags: ['Adventure', 'Nature', 'Scenic'],
    travelStyle: 'Volcanic island adventure',
    bestFor: 'Nature lovers and winter sun seekers',
    atmosphere: 'Lava fields, lunar landscapes, and the warmest winter sun in Europe.',
  },
  FUE: {
    tags: ['Coastal', 'Adventure', 'Relaxed'],
    travelStyle: 'Wide-open Atlantic escape',
    bestFor: 'Watersports fans and beach devotees',
    atmosphere: 'Endless white-sand dunes, world-class windsurfing, and a pace of life that slows right down.',
  },
  LPA: {
    tags: ['Coastal', 'Nature', 'Scenic'],
    travelStyle: 'Island adventure for all seasons',
    bestFor: 'All-round travellers and winter sun seekers',
    atmosphere: 'Desert dunes meet pine forests — Gran Canaria packs a whole continent into one island.',
  },
  TFS: {
    tags: ['Adventure', 'Coastal', 'Scenic'],
    travelStyle: 'Volcanic island exploration',
    bestFor: 'Nature adventurers and beach lovers',
    atmosphere: 'Teide looming on the horizon, black sand beaches, and whale watching off the southern coast.',
  },
  CFU: {
    tags: ['Coastal', 'Romantic', 'Scenic'],
    travelStyle: 'Romantic Ionian island escape',
    bestFor: 'Couples and slow-travel enthusiasts',
    atmosphere: 'Turquoise coves framed by olive groves, Venetian fortresses, and long lazy lunches in the shade.',
  },
  RHO: {
    tags: ['Historic', 'Coastal', 'Cultural'],
    travelStyle: 'History-meets-beach Mediterranean break',
    bestFor: 'History buffs and beach lovers',
    atmosphere: 'Crusader walls, medieval cobblestones, and a beach around every corner.',
  },
  ZTH: {
    tags: ['Island', 'Scenic', 'Relaxed'],
    travelStyle: 'Idyllic Greek island retreat',
    bestFor: 'Beach romantics and nature lovers',
    atmosphere: 'Shipwrecks on white sand beaches, sea turtle sightings, and electric-blue caves.',
  },

  // ── City Breaks ──────────────────────────────────────────────────────────
  VLC: {
    tags: ['Foodie', 'Coastal', 'Cultural'],
    travelStyle: 'City break with a beach bonus',
    bestFor: 'Foodies and city explorers',
    atmosphere: 'Futuristic architecture, the birthplace of paella, and a beach a tram ride from the old town.',
  },
  SVQ: {
    tags: ['Cultural', 'Romantic', 'Foodie'],
    travelStyle: 'Flamenco and history city break',
    bestFor: 'Romantics and culture lovers',
    atmosphere: 'Flamenco echoing through orange-blossom streets, Moorish palaces, and tapas crawls that last the evening.',
  },
  DUB: {
    tags: ['Nightlife', 'Cultural', 'Walkable'],
    travelStyle: 'Literary pub culture city break',
    bestFor: 'Sociable travellers and culture lovers',
    atmosphere: 'Georgian squares, legendary pubs, and a literary heritage that fills every bookshop and bar stool.',
  },
  AMS: {
    tags: ['Cultural', 'Scenic', 'Walkable'],
    travelStyle: 'Canal city cultural escape',
    bestFor: 'Art lovers and curious explorers',
    atmosphere: 'Bicycles, bridge-lined canals, world-class museums, and a city that rewards wandering.',
  },
  BVA: {
    tags: ['Romantic', 'Cultural', 'Foodie'],
    travelStyle: 'Classic romantic city break',
    bestFor: 'Couples and culture lovers',
    atmosphere: 'Spring blossom on the boulevards, the Louvre at opening time, and café au lait at a pavement table.',
  },
  CRL: {
    tags: ['Foodie', 'Cultural', 'Hidden Gem'],
    travelStyle: 'Underrated European city break',
    bestFor: 'Beer lovers, foodies, and curious travellers',
    atmosphere: 'Art Nouveau grandeur, 1,500 beers, and a city that rewards those who look past the EU buildings.',
  },
  BCN: {
    tags: ['Cultural', 'Coastal', 'Nightlife', 'Foodie'],
    travelStyle: 'Architecture and beach city break',
    bestFor: 'Everyone — Barcelona has no wrong type of traveller',
    atmosphere: 'Gaudí by morning, beach by afternoon, pintxos and terrace bars by night.',
  },
  MAD: {
    tags: ['Cultural', 'Foodie', 'Nightlife'],
    travelStyle: 'World-class art and late-night city break',
    bestFor: 'Art lovers, night owls, and serious eaters',
    atmosphere: 'Three world-class museums in one district, tapas that start at 9pm, and a city that genuinely never sleeps.',
  },
  LIS: {
    tags: ['Foodie', 'Coastal', 'Romantic'],
    travelStyle: 'Relaxed city escape',
    bestFor: 'Couples and long weekenders',
    atmosphere: 'Tram rides up sun-warmed hills, fado in the doorways, and a custard tart that changes your benchmark forever.',
  },
  OPO: {
    tags: ['Foodie', 'Scenic', 'Romantic'],
    travelStyle: 'Riverside foodie city break',
    bestFor: 'Wine lovers and riverside wanderers',
    atmosphere: "Port wine cellars, azulejo-tiled churches, and a river city Lonely Planet voted Europe's best.",
  },
  CIA: {
    tags: ['Historic', 'Cultural', 'Foodie'],
    travelStyle: 'Epic history city break',
    bestFor: 'History lovers and passionate eaters',
    atmosphere: "Two thousand years of history in one city — and you still can't get a bad meal.",
  },
  BGY: {
    tags: ['Luxury', 'Cultural', 'Foodie'],
    travelStyle: 'Fashion-forward cultural city break',
    bestFor: 'Fashion lovers, art enthusiasts, and aperitivo devotees',
    atmosphere: "Da Vinci's Last Supper, Prada on the doorstep, and an aperitivo hour that lasts until dinner.",
  },
  NAP: {
    tags: ['Foodie', 'Cultural', 'Adventure'],
    travelStyle: 'Raw, real Italian city break',
    bestFor: 'Food pilgrims and history seekers',
    atmosphere: 'The city that invented pizza, Vesuvius on the horizon, and Pompeii thirty minutes away.',
  },
  TSF: {
    tags: ['Romantic', 'Scenic', 'Cultural'],
    travelStyle: 'Once-in-a-lifetime romantic escape',
    bestFor: 'Couples and photography enthusiasts',
    atmosphere: "No roads, 118 islands, and a city that shouldn't exist — magical at dawn before the day begins.",
  },
  PSA: {
    tags: ['Historic', 'Cultural', 'Walkable'],
    travelStyle: 'Tuscany gateway city break',
    bestFor: 'Day-trippers and Tuscany explorers',
    atmosphere: "The tower is just the start — Tuscany's rolling hills and hilltop towns are an hour in any direction.",
  },
  BLQ: {
    tags: ['Foodie', 'Cultural', 'Hidden Gem'],
    travelStyle: 'Italian food capital city break',
    bestFor: 'Serious foodies and slow travellers',
    atmosphere: 'Porticoed streets designed for eating and strolling — the food capital of a country famous for its food.',
  },
  PRG: {
    tags: ['Historic', 'Cultural', 'Romantic'],
    travelStyle: 'Fairy-tale architecture city break',
    bestFor: 'History lovers and couples',
    atmosphere: 'Medieval spires, Charles Bridge at dawn, and a beer culture that takes itself seriously.',
  },
  BUD: {
    tags: ['Cultural', 'Nightlife', 'Romantic'],
    travelStyle: 'Thermal spa and ruin bar city break',
    bestFor: 'Wellness seekers and night owls',
    atmosphere: 'Thermal baths steaming at dawn, ruin bars humming at midnight, and a city that is hard to leave.',
  },
  KRK: {
    tags: ['Historic', 'Cultural', 'Budget-friendly'],
    travelStyle: 'History-rich budget city break',
    bestFor: 'History enthusiasts and value travellers',
    atmosphere: 'Medieval squares, salt mine cathedrals, and a nightlife in Kazimierz that earns its reputation.',
  },
  WMI: {
    tags: ['Historic', 'Cultural', 'Hidden Gem'],
    travelStyle: 'Resilient city history break',
    bestFor: 'History buffs and urban explorers',
    atmosphere: "Rebuilt from ashes after WWII, Warsaw's story is written in its streets — and its future in its rooftop bars.",
  },
  WRO: {
    tags: ['Walkable', 'Hidden Gem', 'Scenic'],
    travelStyle: 'Charming canal city break',
    bestFor: 'Explorers seeking something off the beaten path',
    atmosphere: "Canal islands, gnome statues around every corner, and a market square that rivals Prague without the crowds.",
  },
  BER: {
    tags: ['Nightlife', 'Cultural', 'Adventure'],
    travelStyle: 'History and nightlife city break',
    bestFor: 'Night owls, history seekers, and art lovers',
    atmosphere: 'History you can touch on every corner, the world\'s best nightlife, and street food from every continent.',
  },
  ATH: {
    tags: ['Historic', 'Cultural', 'Foodie'],
    travelStyle: 'Ancient history city break',
    bestFor: 'History enthusiasts and food lovers',
    atmosphere: "The cradle of democracy, the Parthenon at sunset, and a street food scene that never sleeps.",
  },
  SKG: {
    tags: ['Foodie', 'Cultural', 'Hidden Gem'],
    travelStyle: 'Under-the-radar Greek city break',
    bestFor: "Food lovers and explorers who've done Athens",
    atmosphere: "Greece's food capital — louder and more local than Athens, with a waterfront that's pure Aegean magic.",
  },
  TLL: {
    tags: ['Historic', 'Scenic', 'Hidden Gem'],
    travelStyle: 'Medieval old town discovery break',
    bestFor: 'History lovers and off-the-beaten-path seekers',
    atmosphere: "The best-preserved medieval old town in Northern Europe — like a fairy tale, but 800 years old.",
  },
  RIX: {
    tags: ['Cultural', 'Historic', 'Walkable'],
    travelStyle: 'Art Nouveau architecture city break',
    bestFor: 'Architecture lovers and curious explorers',
    atmosphere: "World-class Art Nouveau streets, a Baltic old town, and a warmth that defies the northern latitude.",
  },
  VNO: {
    tags: ['Hidden Gem', 'Romantic', 'Cultural'],
    travelStyle: "Europe's most overlooked baroque city",
    bestFor: 'Couples and explorers tired of overtourism',
    atmosphere: 'A UNESCO baroque old town that feels like a discovery — barely touched by mass tourism.',
  },

  // ── Cultural ─────────────────────────────────────────────────────────────
  MLA: {
    tags: ['Historic', 'Coastal', 'Cultural'],
    travelStyle: 'Ancient history island break',
    bestFor: 'History buffs and sea swimmers',
    atmosphere: '7,000 years of history on a sun-drenched island — megalithic temples older than Stonehenge.',
  },
  DBV: {
    tags: ['Scenic', 'Historic', 'Romantic'],
    travelStyle: 'Walled city coastal escape',
    bestFor: 'Romantics, history lovers, and city walkers',
    atmosphere: 'Walk the walls at sunrise, swim in the Adriatic, and still catch the best sunset views in Europe.',
  },
  SPU: {
    tags: ['Historic', 'Coastal', 'Cultural'],
    travelStyle: 'Living Roman history coastal break',
    bestFor: 'History lovers and island hoppers',
    atmosphere: "A Roman emperor's retirement home turned living city — 1,700 years of history you can have dinner inside.",
  },
  RAK: {
    tags: ['Cultural', 'Adventure', 'Foodie'],
    travelStyle: 'Sensory overload cultural escape',
    bestFor: 'Culture seekers and adventure travellers',
    atmosphere: 'Spice-scented souks, rooftop riads, and a medina that needs no map and wants none.',
  },

  // ── Skiing ────────────────────────────────────────────────────────────────
  SZG: {
    tags: ['Ski', 'Cultural', 'Scenic'],
    travelStyle: 'Alpine winter city break',
    bestFor: 'Ski lovers and classical music fans',
    atmosphere: "Mozart's city in the snow — baroque spires, Alpine air, and world-class ski slopes 45 minutes away.",
  },
  GVA: {
    tags: ['Ski', 'Luxury', 'Scenic'],
    travelStyle: 'Upscale Alpine ski gateway',
    bestFor: 'Luxury seekers and serious skiers',
    atmosphere: 'Lake, mountains, and effortless Swiss elegance — Chamonix an hour away, fondue tonight.',
  },

  // ── Adventure ────────────────────────────────────────────────────────────
  EDI: {
    tags: ['Adventure', 'Cultural', 'Scenic'],
    travelStyle: 'Dramatic Scottish city break',
    bestFor: 'Hikers, history lovers, and whisky enthusiasts',
    atmosphere: "A castle on a volcano, Arthur's Seat at dawn, and a pub culture that needs no justification.",
  },
  TLV: {
    tags: ['Nightlife', 'Coastal', 'Foodie'],
    travelStyle: 'Non-stop Mediterranean city break',
    bestFor: 'Night owls, beach lovers, and food explorers',
    atmosphere: "Beach by morning, Bauhaus streets by afternoon, hummus at 2am — Tel Aviv doesn't really stop.",
  },
}

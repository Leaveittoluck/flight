/**
 * Seed: London Stansted (STN) direct-flight destinations
 *
 * Idempotent — safe to run multiple times.
 * - Trip types are upserted by slug.
 * - Destinations are upserted by (city, departure_airport_id).
 * - All associations are replaced cleanly on each run.
 *
 * Usage:
 *   cd server && npm run db:seed:stansted
 *
 * Requires DATABASE_URL and DB_SCHEMA=flight in server/.env
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { Pool } = require("pg");

const SCHEMA = "flight";
const DEPARTURE_AIRPORT_ID = 1;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ---------------------------------------------------------------------------
// TRIP TYPES
// ---------------------------------------------------------------------------

const TRIP_TYPES = [
  { slug: "beach",      label: "Beach & Sun"       },
  { slug: "city_break", label: "City Break"        },
  { slug: "adventure",  label: "Adventure"         },
  { slug: "cultural",   label: "Cultural"          },
  { slug: "skiing",     label: "Skiing"            },
  { slug: "relaxation", label: "Relaxation"        },
];

// Pairs that are similar enough to trigger fallback (score >= 6 in the service)
const SIMILARITY_PAIRS = [
  { a: "city_break", b: "cultural",   score: 9 },
  { a: "beach",      b: "relaxation", score: 8 },
  { a: "skiing",     b: "adventure",  score: 7 },
  { a: "beach",      b: "adventure",  score: 6 },
  { a: "city_break", b: "adventure",  score: 6 },
  { a: "cultural",   b: "relaxation", score: 6 },
];

// ---------------------------------------------------------------------------
// DESTINATIONS
// Each trip_types entry: { slug, is_primary }
// places: up to 3 recommended_places per destination
// ---------------------------------------------------------------------------

const DESTINATIONS = [
  // ── BEACH & SUN ──────────────────────────────────────────────────────────

  {
    city: "Alicante", country: "Spain", iata_code: "ALC",
    hook: "Golden beaches, year-round sun, and tapas that taste better by the sea",
    fun_fact: "Santa Bárbara Castle has guarded Alicante from its hilltop for over 1,000 years",
    weather_summary: "300 days of sunshine; 25°C+ from June to October",
    flight_cost_per_person_gbp: 42, hotel_cost_per_night_gbp: 65, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Postiguet Beach", description: "City beach with clear water right in the centre" },
      { name: "Santa Bárbara Castle", description: "Hilltop fortress with sweeping coastal views" },
      { name: "El Barrio Quarter", description: "Narrow old-town lanes packed with tapas bars" },
    ],
  },
  {
    city: "Malaga", country: "Spain", iata_code: "AGP",
    hook: "Picasso's birthplace — art, Moorish history, and the Costa del Sol right on the doorstep",
    fun_fact: "Malaga is one of the oldest cities in the world, founded by the Phoenicians around 770 BC",
    weather_summary: "Mild winters, blazing summers; beach weather from April to November",
    flight_cost_per_person_gbp: 44, hotel_cost_per_night_gbp: 72, default_duration_nights: 5,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "city_break", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Alcazaba", description: "Moorish fortress with stunning city and sea views" },
      { name: "Malagueta Beach", description: "Central sandy beach with excellent chiringuitos" },
      { name: "Picasso Museum", description: "Dedicated to the city's most famous son" },
    ],
  },
  {
    city: "Palma", country: "Spain", iata_code: "PMI",
    hook: "Medieval cathedral, turquoise coves, and a foodie scene that punches above its weight",
    fun_fact: "Mallorca produces roughly 2.5 million litres of olive oil per year",
    weather_summary: "Hot dry summers, pleasant springs and autumns; ideal April–October",
    flight_cost_per_person_gbp: 48, hotel_cost_per_night_gbp: 80, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "city_break", is_primary: false }, { slug: "adventure", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "La Seu Cathedral", description: "Gothic masterpiece rising above the harbour" },
      { name: "Caló des Moro", description: "Postcard-perfect cove with crystal-clear water" },
      { name: "Old Town Palma", description: "Cafés, boutiques, and courtyard patios" },
    ],
  },
  {
    city: "Ibiza", country: "Spain", iata_code: "IBZ",
    hook: "More than just clubs — hidden coves, hippy markets, and Dalt Vila by sunset",
    fun_fact: "Ibiza's Dalt Vila (old city) is a UNESCO World Heritage Site",
    weather_summary: "Hot and sunny May–October; quieter and cheaper in shoulder season",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 90, default_duration_nights: 5,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Dalt Vila", description: "Walled hilltop old town with panoramic views" },
      { name: "Cala Conta", description: "Stunning west-facing beach famous for sunsets" },
      { name: "Las Dalias Hippy Market", description: "Colourful open-air market every Saturday" },
    ],
  },
  {
    city: "Faro", country: "Portugal", iata_code: "FAO",
    hook: "Gateway to the Algarve — dramatic cliffs, sea caves, and 300km of Atlantic coastline",
    fun_fact: "The Algarve's golden cliffs are made of soft sandstone sculpted by the Atlantic over millions of years",
    weather_summary: "Warm and sunny year-round; peak beach season June–September",
    flight_cost_per_person_gbp: 46, hotel_cost_per_night_gbp: 68, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }, { slug: "adventure", is_primary: false }],
    places: [
      { name: "Praia da Marinha", description: "One of Portugal's most photographed clifftop beaches" },
      { name: "Ria Formosa Natural Park", description: "Lagoon system with birdlife and quiet barrier islands" },
      { name: "Faro Old Town", description: "Walled historic centre with a Roman-era arch" },
    ],
  },
  {
    city: "Lanzarote", country: "Spain", iata_code: "ACE",
    hook: "Volcanic landscapes unlike anywhere in Europe — black beaches, lava caves, and César Manrique's art",
    fun_fact: "Lanzarote has over 300 volcanic cones and last erupted as recently as 1824",
    weather_summary: "Year-round mild temperatures; rarely below 17°C even in winter",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 75, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Timanfaya National Park", description: "Otherworldly volcanic landscape, geothermal demonstrations" },
      { name: "Playa Papagayo", description: "Secluded golden-sand beach in a protected bay" },
      { name: "Jameos del Agua", description: "Lava tube cave with a concert hall and unique albino crabs" },
    ],
  },
  {
    city: "Fuerteventura", country: "Spain", iata_code: "FUE",
    hook: "Europe's windsurf capital — endless white-sand dunes and the clearest Atlantic waters",
    fun_fact: "Fuerteventura is the second largest and oldest of the Canary Islands",
    weather_summary: "Warm and windy year-round; the best climate in Europe for winter sun",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 72, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Corralejo Dunes Natural Park", description: "Vast white dunes stretching to turquoise lagoons" },
      { name: "Sotavento Beach", description: "World-class kite and windsurf beach" },
      { name: "Betancuria", description: "Charming former capital in a lush mountain valley" },
    ],
  },
  {
    city: "Gran Canaria", country: "Spain", iata_code: "LPA",
    hook: "A continent in miniature — sand dunes, pine forests, and a year-round carnival vibe",
    fun_fact: "Gran Canaria has 236km of coastline and more than 50 beaches",
    weather_summary: "Eternal spring; average temperature of 21°C throughout the year",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 72, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Maspalomas Dunes", description: "Sahara-like dunes meeting the Atlantic — a natural reserve" },
      { name: "Las Palmas Old Town", description: "Columbus's house, art museums, and a city beach" },
      { name: "Roque Nublo", description: "Volcanic monolith with views across the whole island" },
    ],
  },
  {
    city: "Tenerife", country: "Spain", iata_code: "TFS",
    hook: "Spain's highest peak, whale watching, and beaches that range from black sand to golden",
    fun_fact: "Mount Teide is Spain's highest peak and the world's third tallest volcanic structure",
    weather_summary: "Warm and sunny all year; south of the island stays drier",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 74, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }, { slug: "adventure", is_primary: false }],
    places: [
      { name: "Teide National Park", description: "UNESCO volcano park with cable car and lunar scenery" },
      { name: "Playa de las Teresitas", description: "Golden Saharan sand beach north of Santa Cruz" },
      { name: "Siam Park", description: "Consistently rated Europe's best water park" },
    ],
  },
  {
    city: "Corfu", country: "Greece", iata_code: "CFU",
    hook: "Venetian fortresses, lush olive groves, and Ionian waters in every shade of blue",
    fun_fact: "Corfu Old Town was built by the Venetians and is the only fortress city in Greece",
    weather_summary: "Hot summers, mild winters; best from May to October",
    flight_cost_per_person_gbp: 58, hotel_cost_per_night_gbp: 75, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Paleokastritsa", description: "Stunning bay with turquoise water and clifftop monastery" },
      { name: "Corfu Old Town", description: "UNESCO-listed Venetian architecture and lively esplanade" },
      { name: "Canal d'Amour", description: "Romantic sea channel carved through golden rock at Sidari" },
    ],
  },
  {
    city: "Rhodes", country: "Greece", iata_code: "RHO",
    hook: "Crusader castles, medieval alleyways, and some of the most reliably sunny days in Europe",
    fun_fact: "The medieval walled city of Rhodes has been inhabited continuously for over 2,400 years",
    weather_summary: "One of Greece's sunniest islands; beach season runs April to November",
    flight_cost_per_person_gbp: 62, hotel_cost_per_night_gbp: 78, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "cultural", is_primary: false }, { slug: "adventure", is_primary: false }],
    places: [
      { name: "Rhodes Old Town", description: "UNESCO walled city with cobbled streets and a Knights' Palace" },
      { name: "Lindos", description: "Hilltop acropolis above a whitewashed village and azure bay" },
      { name: "Anthony Quinn Bay", description: "Scenic cove named after the actor who fell in love with it" },
    ],
  },
  {
    city: "Zakynthos", country: "Greece", iata_code: "ZTH",
    hook: "Home to the iconic Blue Caves, the shipwreck beach, and caretta sea turtles",
    fun_fact: "The famous Navagio (Shipwreck) Beach is only accessible by boat and has no road access",
    weather_summary: "Long hot summers; warm and sunny from late April through October",
    flight_cost_per_person_gbp: 60, hotel_cost_per_night_gbp: 70, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }, { slug: "adventure", is_primary: false }],
    places: [
      { name: "Navagio Beach", description: "The most photographed beach in Greece — rusty shipwreck included" },
      { name: "Blue Caves", description: "Sea caves where sunlight turns the water an electric blue" },
      { name: "Laganas Bay", description: "Protected nesting beach for loggerhead sea turtles" },
    ],
  },
  {
    city: "Valencia", country: "Spain", iata_code: "VLC",
    hook: "Birthplace of paella, City of Arts and Sciences, and beaches a tram ride from the old town",
    fun_fact: "Valencia invented paella — the authentic version uses rabbit and snails, not seafood",
    weather_summary: "Over 300 sunny days a year; perfect beach weather May to October",
    flight_cost_per_person_gbp: 45, hotel_cost_per_night_gbp: 70, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "beach", is_primary: false }],
    places: [
      { name: "City of Arts and Sciences", description: "Futuristic Calatrava complex with science museum and aquarium" },
      { name: "Malvarrosa Beach", description: "Long city beach with great seafood restaurants" },
      { name: "Central Market", description: "Europe's largest covered fresh food market" },
    ],
  },
  {
    city: "Seville", country: "Spain", iata_code: "SVQ",
    hook: "Flamenco, the Alcázar, and tapas hopping through streets that smell of orange blossom",
    fun_fact: "Seville's Alcázar is the oldest royal palace still in use in Europe",
    weather_summary: "Europe's hottest city in summer; spring and autumn are ideal for exploring",
    flight_cost_per_person_gbp: 46, hotel_cost_per_night_gbp: 78, default_duration_nights: 4,
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Real Alcázar", description: "Stunning Moorish palace complex still used by the Spanish royal family" },
      { name: "Seville Cathedral", description: "The world's largest Gothic cathedral with Columbus's tomb" },
      { name: "Triana District", description: "Flamenco bars, ceramic tiles, and the city's best tapas" },
    ],
  },

  // ── CITY BREAKS ──────────────────────────────────────────────────────────

  {
    city: "Dublin", country: "Ireland", iata_code: "DUB",
    hook: "Literary pubs, Georgian squares, and craic that genuinely lives up to its reputation",
    fun_fact: "Dublin has more bookshops per capita than any other city in the world",
    weather_summary: "Mild year-round with frequent showers; layers always a good idea",
    flight_cost_per_person_gbp: 28, hotel_cost_per_night_gbp: 95, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Temple Bar", description: "Cobbled cultural quarter with live music in every pub" },
      { name: "Trinity College", description: "Home to the Book of Kells and a beautiful Long Room library" },
      { name: "Guinness Storehouse", description: "Seven floors of brewing history with a 360° rooftop bar" },
    ],
  },
  {
    city: "Amsterdam", country: "Netherlands", iata_code: "AMS",
    hook: "Canals, Rembrandts, cycling culture, and a tolerance for joy in all its forms",
    fun_fact: "Amsterdam has more bicycles than residents — roughly 900,000 bikes in the city",
    weather_summary: "Warm summers, cold winters; spring tulip season is spectacular",
    flight_cost_per_person_gbp: 32, hotel_cost_per_night_gbp: 105, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Rijksmuseum", description: "Dutch masters — Rembrandt's Night Watch and Vermeer's Milkmaid" },
      { name: "Anne Frank House", description: "The hidden annex where Anne Frank wrote her diary" },
      { name: "Jordaan District", description: "Narrow canal streets with independent cafés and galleries" },
    ],
  },
  {
    city: "Paris", country: "France", iata_code: "BVA",
    hook: "Every cliché about Paris is true — and it's still not enough to prepare you",
    fun_fact: "Paris has only one stop sign in the entire city",
    weather_summary: "Four distinct seasons; spring and autumn are the most romantic",
    flight_cost_per_person_gbp: 30, hotel_cost_per_night_gbp: 115, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "The Louvre", description: "The world's most visited museum, home to the Mona Lisa" },
      { name: "Montmartre", description: "Hilltop artists' quarter with the Sacré-Cœur and local bistros" },
      { name: "Le Marais", description: "Trendy district with galleries, falafel, and the Place des Vosges" },
    ],
  },
  {
    city: "Brussels", country: "Belgium", iata_code: "CRL",
    hook: "The beating heart of Europe — Art Nouveau architecture, world-class beer, and the best chips you'll ever eat",
    fun_fact: "Belgium has over 1,500 different types of beer, more varieties per capita than any country",
    weather_summary: "Mild and often rainy; indoor culture (beer halls, museums) is year-round",
    flight_cost_per_person_gbp: 30, hotel_cost_per_night_gbp: 85, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Grand-Place", description: "UNESCO-listed square surrounded by gilded guild houses" },
      { name: "Cantillon Brewery", description: "Living museum of lambic beer production since 1900" },
      { name: "Magritte Museum", description: "World's largest collection of the surrealist master's work" },
    ],
  },
  {
    city: "Barcelona", country: "Spain", iata_code: "BCN",
    hook: "Gaudí's surreal architecture, a beach within walking distance of the Gothic Quarter, and the best food market in Europe",
    fun_fact: "The Sagrada Família has been under construction since 1882 and is still not finished",
    weather_summary: "Hot Mediterranean summers; mild and pleasant year-round",
    flight_cost_per_person_gbp: 42, hotel_cost_per_night_gbp: 98, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }, { slug: "beach", is_primary: false }],
    places: [
      { name: "Sagrada Família", description: "Gaudí's unfinished masterpiece — book tickets well in advance" },
      { name: "La Boqueria Market", description: "Vibrant food market off La Rambla with fresh produce and tapas" },
      { name: "Park Güell", description: "Mosaic terraces and Hansel-and-Gretel gatehouses above the city" },
    ],
  },
  {
    city: "Madrid", country: "Spain", iata_code: "MAD",
    hook: "World-class art, a tapas scene that goes until 3am, and the Prado — one of the planet's great museums",
    fun_fact: "Madrid is the highest capital city in the European Union, sitting at 667m above sea level",
    weather_summary: "Hot dry summers, cool winters; spring and autumn are ideal",
    flight_cost_per_person_gbp: 42, hotel_cost_per_night_gbp: 85, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Prado Museum", description: "Velázquez, Goya, El Greco — one of the world's finest collections" },
      { name: "Retiro Park", description: "Beautiful city park with a crystal palace and rowing lake" },
      { name: "Malasaña", description: "Bohemian neighbourhood with indie bars and vintage shops" },
    ],
  },
  {
    city: "Lisbon", country: "Portugal", iata_code: "LIS",
    hook: "Trams rattling through tilework-covered hills, fado drifting from open doors, and the best custard tarts on earth",
    fun_fact: "Lisbon is one of the oldest cities in the world, predating Rome by centuries",
    weather_summary: "Europe's sunniest capital; warm and pleasant most of the year",
    flight_cost_per_person_gbp: 46, hotel_cost_per_night_gbp: 78, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Alfama District", description: "Moorish quarter of winding streets and fado houses" },
      { name: "Belém Tower", description: "16th-century riverside fortification and UNESCO landmark" },
      { name: "Time Out Market", description: "Iconic food hall showcasing Lisbon's best chefs" },
    ],
  },
  {
    city: "Porto", country: "Portugal", iata_code: "OPO",
    hook: "Port wine cellars, azulejo-tiled churches, and a river city that Lonely Planet voted best in Europe",
    fun_fact: "Port wine can only be produced in Portugal's Douro Valley and aged in Porto's Vila Nova de Gaia",
    weather_summary: "Mild Atlantic climate; warm summers, rainy winters, and beautiful springs",
    flight_cost_per_person_gbp: 44, hotel_cost_per_night_gbp: 72, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Ribeira Waterfront", description: "UNESCO riverside district of colourful houses and wine bars" },
      { name: "Livraria Lello", description: "Possibly the world's most beautiful bookshop" },
      { name: "Vila Nova de Gaia", description: "Port wine lodge tours with tastings above the Douro" },
    ],
  },
  {
    city: "Rome", country: "Italy", iata_code: "CIA",
    hook: "Two thousand years of history in one city — and you still can't get a bad meal",
    fun_fact: "Rome has more fountains than any other city in the world — over 2,000",
    weather_summary: "Hot summers, mild winters; spring and autumn are the golden times to visit",
    flight_cost_per_person_gbp: 46, hotel_cost_per_night_gbp: 82, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Colosseum", description: "Ancient amphitheatre that once held 80,000 spectators" },
      { name: "Vatican Museums", description: "Sistine Chapel, St Peter's Basilica, and 7km of galleries" },
      { name: "Trastevere", description: "Cobblestone neighbourhood with ivy-covered restaurants" },
    ],
  },
  {
    city: "Milan", country: "Italy", iata_code: "BGY",
    hook: "Fashion capital, da Vinci's Last Supper, and a Spritz culture that begins at noon",
    fun_fact: "Milan's Galleria Vittorio Emanuele II is the world's oldest shopping mall, opened in 1877",
    weather_summary: "Hot summers, cold foggy winters; spring and autumn are most enjoyable",
    flight_cost_per_person_gbp: 44, hotel_cost_per_night_gbp: 88, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "The Last Supper", description: "Da Vinci's mural — entry is strictly timed, book months ahead" },
      { name: "Duomo di Milano", description: "Gothic cathedral with a rooftop terrace above the city" },
      { name: "Brera District", description: "Arty neighbourhood with galleries, jazz bars, and aperitivo" },
    ],
  },
  {
    city: "Naples", country: "Italy", iata_code: "NAP",
    hook: "The city that invented pizza, with Vesuvius brooding overhead and Pompeii just 30 minutes away",
    fun_fact: "Pizza Margherita was created in Naples in 1889 for the Queen of Italy",
    weather_summary: "Warm Mediterranean climate; great year-round, especially spring and autumn",
    flight_cost_per_person_gbp: 48, hotel_cost_per_night_gbp: 72, default_duration_nights: 4,
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Pompeii", description: "Roman city frozen in time by the 79 AD eruption of Vesuvius" },
      { name: "Spaccanapoli", description: "Arrow-straight street slicing through the historic centre" },
      { name: "National Archaeological Museum", description: "Greatest collection of Roman art in the world" },
    ],
  },
  {
    city: "Venice", country: "Italy", iata_code: "TSF",
    hook: "No cars, no roads — just 118 islands, 400 bridges, and a city that shouldn't exist but does",
    fun_fact: "Venice is built on over 1.5 million wooden piles driven into the lagoon mud over a thousand years ago",
    weather_summary: "Best in spring and autumn; summer is hot and crowded, winter is atmospheric and foggy",
    flight_cost_per_person_gbp: 48, hotel_cost_per_night_gbp: 115, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "St Mark's Basilica", description: "Byzantine masterpiece encrusted with mosaics and marble" },
      { name: "Cannaregio", description: "Authentic neighbourhood away from the tourist trail" },
      { name: "Burano", description: "Island of brightly painted fishermen's houses 40 minutes by boat" },
    ],
  },
  {
    city: "Pisa", country: "Italy", iata_code: "PSA",
    hook: "Yes, there's a leaning tower — and yes, the rest of Tuscany is even better",
    fun_fact: "Galileo Galilei was born in Pisa and allegedly used the Leaning Tower for his gravity experiments",
    weather_summary: "Hot summers, mild winters; Tuscany is beautiful in spring and autumn",
    flight_cost_per_person_gbp: 46, hotel_cost_per_night_gbp: 70, default_duration_nights: 4,
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Field of Miracles", description: "Cathedral, Baptistery, and the famous leaning campanile" },
      { name: "Florence", description: "Birthplace of the Renaissance, 1 hour by train" },
      { name: "Cinque Terre", description: "Five pastel cliff villages on the Ligurian coast, 1.5 hours away" },
    ],
  },
  {
    city: "Bologna", country: "Italy", iata_code: "BLQ",
    hook: "The food capital of Italy (and Italy is the food capital of the world)",
    fun_fact: "Bologna's university, founded in 1088, is the oldest university in the Western world",
    weather_summary: "Hot summers, cold winters; spring is lovely for outdoor dining",
    flight_cost_per_person_gbp: 46, hotel_cost_per_night_gbp: 75, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Quadrilatero Market", description: "Ancient food market with porchetta, mortadella, and fresh pasta" },
      { name: "Two Towers", description: "Medieval towers leaning at the heart of the old city" },
      { name: "Sanctuary of San Luca", description: "Hilltop basilica reached via the world's longest portico" },
    ],
  },
  {
    city: "Prague", country: "Czech Republic", iata_code: "PRG",
    hook: "A fairy-tale city that escaped World War II bombing — medieval spires, beer halls, and film-set squares",
    fun_fact: "Prague Castle is the largest ancient castle complex in the world at 70,000 sq m",
    weather_summary: "Cold winters, warm summers; spring and autumn are ideal",
    flight_cost_per_person_gbp: 36, hotel_cost_per_night_gbp: 62, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Old Town Square", description: "Medieval square with the Gothic church and 15th-century Astronomical Clock" },
      { name: "Charles Bridge", description: "14th-century bridge lined with 30 Baroque statues" },
      { name: "Prague Castle", description: "Hilltop complex with St Vitus Cathedral and royal palaces" },
    ],
  },
  {
    city: "Budapest", country: "Hungary", iata_code: "BUD",
    hook: "Thermal baths, ruin pubs, and the most beautiful parliament building in the world — all obscenely affordable",
    fun_fact: "Budapest has the oldest metro line in continental Europe, opened in 1896",
    weather_summary: "Hot summers, cold winters; best in spring and early autumn",
    flight_cost_per_person_gbp: 36, hotel_cost_per_night_gbp: 60, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Széchenyi Thermal Bath", description: "Grand neo-baroque outdoor baths open year-round" },
      { name: "Hungarian Parliament", description: "Neo-Gothic riverside masterpiece, best seen at night" },
      { name: "Ruin Bars", description: "Eclectic bars built inside crumbling courtyards in the Jewish Quarter" },
    ],
  },
  {
    city: "Krakow", country: "Poland", iata_code: "KRK",
    hook: "Unmatched medieval architecture, the weight of history, and a stag-do nightlife that keeps going till dawn",
    fun_fact: "Krakow's Cloth Hall is one of the oldest shopping malls in the world, operating since the 13th century",
    weather_summary: "Cold winters, warm summers; Jewish Quarter and old town are stunning in all seasons",
    flight_cost_per_person_gbp: 32, hotel_cost_per_night_gbp: 52, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Wawel Castle", description: "Royal castle and cathedral on a limestone hill above the Vistula" },
      { name: "Kazimierz", description: "Historic Jewish Quarter now buzzing with galleries and jazz bars" },
      { name: "Wieliczka Salt Mine", description: "Underground cathedral carved entirely from salt — UNESCO site" },
    ],
  },
  {
    city: "Warsaw", country: "Poland", iata_code: "WMI",
    hook: "A city reborn from ashes — rebuilt from scratch after WWII and now one of Europe's most dynamic capitals",
    fun_fact: "Warsaw's Old Town was completely destroyed in WWII and meticulously rebuilt brick by brick from 18th-century paintings",
    weather_summary: "Cold winters, warm summers; spring and autumn are most pleasant",
    flight_cost_per_person_gbp: 34, hotel_cost_per_night_gbp: 58, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Old Town Market Square", description: "Reconstructed medieval square now a UNESCO World Heritage Site" },
      { name: "Warsaw Rising Museum", description: "Deeply moving tribute to the 1944 uprising against Nazi occupation" },
      { name: "Łazienki Park", description: "Romantic palace-on-water surrounded by peacocks and Chopin concerts" },
    ],
  },
  {
    city: "Wroclaw", country: "Poland", iata_code: "WRO",
    hook: "A canal city of islands, gnome statues, and a market square that rivals Prague — without the crowds",
    fun_fact: "Wroclaw has over 300 miniature gnome statues hidden throughout the city streets",
    weather_summary: "Cold winters, warm summers; central European continental climate",
    flight_cost_per_person_gbp: 34, hotel_cost_per_night_gbp: 52, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Wroclaw Market Square", description: "One of the largest and most beautiful in Europe — lively year-round" },
      { name: "Centennial Hall", description: "Groundbreaking 1913 UNESCO concrete dome, predecessor to the O2" },
      { name: "Cathedral Island", description: "Gothic cathedral and ancient footbridges on the oldest part of the city" },
    ],
  },
  {
    city: "Berlin", country: "Germany", iata_code: "BER",
    hook: "History you can touch on every corner, the world's best nightlife, and street food from every continent",
    fun_fact: "Berlin has more museums than rainy days per year — over 170 of them",
    weather_summary: "Cold winters, warm summers; famous for summer festivals and outdoor culture",
    flight_cost_per_person_gbp: 38, hotel_cost_per_night_gbp: 82, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Brandenburg Gate", description: "Neoclassical symbol of German unity at the heart of the city" },
      { name: "East Side Gallery", description: "1.3km of preserved Berlin Wall covered in murals" },
      { name: "Museum Island", description: "UNESCO complex housing five world-class museums on a river island" },
    ],
  },
  {
    city: "Athens", country: "Greece", iata_code: "ATH",
    hook: "The cradle of democracy, the Parthenon at sunset, and a street food scene that never sleeps",
    fun_fact: "The Acropolis has been continuously inhabited for over 5,000 years",
    weather_summary: "Hot dry summers, mild winters; spring and autumn are ideal for sightseeing",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 72, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Acropolis", description: "The Parthenon and ancient monuments overlooking the city" },
      { name: "Monastiraki Flea Market", description: "Chaotic and brilliant Sunday market below the Acropolis" },
      { name: "Plaka District", description: "Neoclassical neighbourhood with tavernas under the ancient walls" },
    ],
  },
  {
    city: "Thessaloniki", country: "Greece", iata_code: "SKG",
    hook: "Greece's second city — louder, more local, and with food even Athenians admit is better",
    fun_fact: "Thessaloniki has the best street food in Greece, including the bougatsa pastry invented here",
    weather_summary: "Warm Mediterranean climate; hot summers, mild winters, wonderful autumn",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 62, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "White Tower", description: "Byzantine landmark on the waterfront promenade" },
      { name: "Ladadika District", description: "Former warehouse quarter now packed with tavernas and bars" },
      { name: "Archaeological Museum", description: "Gold artefacts from Alexander the Great's Macedonia" },
    ],
  },
  {
    city: "Tallinn", country: "Estonia", iata_code: "TLL",
    hook: "The best-preserved medieval old town in Northern Europe — like a Disney castle, but actually 800 years old",
    fun_fact: "Tallinn's medieval town hall has been in continuous use since 1322, making it the oldest in Northern Europe",
    weather_summary: "Cold snowy winters (magical), warm summers; Old Town is beautiful in all seasons",
    flight_cost_per_person_gbp: 38, hotel_cost_per_night_gbp: 62, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Toompea Castle Hill", description: "Upper old town with Gothic towers and panoramic views" },
      { name: "Town Hall Square", description: "Medieval square lined with merchants' houses and a 15th-century pharmacy" },
      { name: "Telliskivi Creative City", description: "Former factory complex now home to the city's coolest cafés and shops" },
    ],
  },
  {
    city: "Riga", country: "Latvia", iata_code: "RIX",
    hook: "Europe's finest collection of Art Nouveau buildings, a magnificent old town, and Baltic warmth",
    fun_fact: "Riga has the largest collection of Art Nouveau architecture in the world — over 800 buildings",
    weather_summary: "Cold winters, warm summers; midsummer is long-lit and lively",
    flight_cost_per_person_gbp: 38, hotel_cost_per_night_gbp: 58, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Art Nouveau District", description: "Entire streets of ornate Jugendstil facades — a UNESCO highlight" },
      { name: "Central Market", description: "Europe's largest market in five converted WWI zeppelin hangars" },
      { name: "Old Town", description: "UNESCO medieval streets with lively bars and Latvian folk restaurants" },
    ],
  },
  {
    city: "Vilnius", country: "Lithuania", iata_code: "VNO",
    hook: "Europe's most overlooked baroque city — a UNESCO old town barely touched by mass tourism",
    fun_fact: "Vilnius has the largest surviving Baroque old town in Northern Europe",
    weather_summary: "Cold continental winters, warm summers; spring brings blossom to cobbled courtyards",
    flight_cost_per_person_gbp: 38, hotel_cost_per_night_gbp: 55, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Gediminas Castle Tower", description: "Hilltop ruin overlooking the old town and two rivers" },
      { name: "Užupis", description: "Self-declared artists' republic with its own constitution and anthem" },
      { name: "Gates of Dawn", description: "Medieval gate chapel housing a revered icon drawing pilgrims daily" },
    ],
  },

  // ── CULTURAL ─────────────────────────────────────────────────────────────

  {
    city: "Malta", country: "Malta", iata_code: "MLA",
    hook: "7,000 years of history on a sun-drenched island — megalithic temples, crusader bastions, and crystal waters",
    fun_fact: "Malta's Ħaġar Qim temples are over 5,500 years old — older than Stonehenge and the Egyptian pyramids",
    weather_summary: "300 days of sunshine; warm enough to swim from May to November",
    flight_cost_per_person_gbp: 52, hotel_cost_per_night_gbp: 76, default_duration_nights: 5,
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "city_break", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Valletta", description: "Europe's smallest capital and an open-air baroque museum" },
      { name: "Ħaġar Qim Temples", description: "Neolithic stone temples predating the Egyptian pyramids" },
      { name: "Blue Lagoon, Comino", description: "Impossibly turquoise lagoon reached by short ferry" },
    ],
  },
  {
    city: "Dubrovnik", country: "Croatia", iata_code: "DBV",
    hook: "Walk the city walls at sunrise before the cruise ships arrive and it's the most beautiful city on Earth",
    fun_fact: "Dubrovnik was one of the first cities in the world to abolish slavery, in 1418",
    weather_summary: "Hot Mediterranean summers, mild winters; spring is uncrowded and beautiful",
    flight_cost_per_person_gbp: 54, hotel_cost_per_night_gbp: 90, default_duration_nights: 5,
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Old City Walls", description: "2km walk around the medieval ramparts above the Adriatic" },
      { name: "Lokrum Island", description: "Forest island 5 minutes by boat with peacocks and a saltwater lake" },
      { name: "Cable Car", description: "Rides to Mount Srđ for views across the old town and coast" },
    ],
  },
  {
    city: "Split", country: "Croatia", iata_code: "SPU",
    hook: "A Roman palace turned living city — people actually live inside a 1,700-year-old emperor's retirement home",
    fun_fact: "Split's city centre is built inside Diocletian's Palace, a Roman emperor's retirement home from 305 AD",
    weather_summary: "Hot sunny summers, mild winters; Dalmatian coast is best May to September",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 80, default_duration_nights: 5,
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "relaxation", is_primary: false }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Diocletian's Palace", description: "Roman palace complex where people still live and work" },
      { name: "Hvar Island", description: "Glamorous island with lavender fields, 1 hour by catamaran" },
      { name: "Bačvice Beach", description: "Sandy city beach where locals play picigin, a traditional water sport" },
    ],
  },
  {
    city: "Marrakech", country: "Morocco", iata_code: "RAK",
    hook: "Spice-scented souks, rooftop riads, and the most thrilling medina in North Africa",
    fun_fact: "Marrakech's medina has been continuously inhabited for over 1,000 years and has no street plan",
    weather_summary: "Very hot in summer; spring and autumn are ideal; mild winters with occasional cold snaps",
    flight_cost_per_person_gbp: 58, hotel_cost_per_night_gbp: 62, default_duration_nights: 4,
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Djemaa el-Fna", description: "Unesco-listed square transforming nightly into open-air theatre" },
      { name: "Majorelle Garden", description: "Yves Saint Laurent's cobalt-blue botanical garden oasis" },
      { name: "Souk districts", description: "Labyrinthine markets of leather, spices, lanterns, and ceramics" },
    ],
  },

  // ── SKIING ────────────────────────────────────────────────────────────────

  {
    city: "Salzburg", country: "Austria", iata_code: "SZG",
    hook: "Mozart's birthplace, a baroque old town, and gateway to some of the Alps' finest ski terrain",
    fun_fact: "Salzburg's old town is a UNESCO World Heritage Site and inspired the setting for The Sound of Music",
    weather_summary: "Cold snowy winters perfect for skiing; beautiful all year round",
    flight_cost_per_person_gbp: 56, hotel_cost_per_night_gbp: 92, default_duration_nights: 5,
    trip_types: [{ slug: "skiing", is_primary: true }, { slug: "cultural", is_primary: false }, { slug: "adventure", is_primary: false }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Hohensalzburg Fortress", description: "One of Europe's largest medieval castles above the old town" },
      { name: "Ski Amadé", description: "One of Europe's largest ski areas just 45 minutes from the city" },
      { name: "Mozart's Birthplace", description: "Museum in the apartment where the composer was born in 1756" },
    ],
  },
  {
    city: "Geneva", country: "Switzerland", iata_code: "GVA",
    hook: "Pristine lake, jet d'eau, world's best watchmakers, and the French Alps a bus ride away",
    fun_fact: "Geneva is home to more international organisations than any other city, including the UN and Red Cross",
    weather_summary: "Cold crisp winters ideal for skiing; warm pleasant summers on the lake",
    flight_cost_per_person_gbp: 58, hotel_cost_per_night_gbp: 148, default_duration_nights: 4,
    trip_types: [{ slug: "skiing", is_primary: true }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Chamonix & Mont Blanc", description: "World-famous ski resort and highest peak in the Alps, 1 hour away" },
      { name: "Jet d'Eau", description: "140m water fountain shooting from Lake Geneva — the city's icon" },
      { name: "Old Town (Vieille Ville)", description: "Cathedral, cobbled squares, and the Reformation Wall" },
    ],
  },

  // ── ADVENTURE ────────────────────────────────────────────────────────────

  {
    city: "Edinburgh", country: "Scotland", iata_code: "EDI",
    hook: "A castle on an ancient volcano, Arthur's Seat to hike at dawn, and a pub for every mood",
    fun_fact: "Edinburgh's Old Town sits on an extinct volcano that erupted 350 million years ago",
    weather_summary: "Cool and often rainy year-round; layers are essential but summer is genuinely lovely",
    flight_cost_per_person_gbp: 28, hotel_cost_per_night_gbp: 88, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Edinburgh Castle", description: "Fortress on volcanic rock with the Scottish Crown Jewels" },
      { name: "Arthur's Seat", description: "Ancient volcano in Holyrood Park — a 45-minute hike from the city centre" },
      { name: "Royal Mile", description: "Medieval spine from castle to Holyrood with closes, whisky shops, and history" },
    ],
  },
  // ── ADVENTURE & NATURE (additional) ─────────────────────────────────────

  {
    city: "Antalya", country: "Turkey", iata_code: "AYT",
    hook: "Where the Taurus Mountains meet the turquoise Mediterranean — ancient ruins, dramatic canyons, and a coast that dazzles",
    fun_fact: "Antalya's old harbour, Kaleiçi, has been in continuous use for over 2,000 years since it was built by the Attalid Kings",
    weather_summary: "Hot and sunny May–October; mild winters; one of Turkey's sunniest cities",
    flight_cost_per_person_gbp: 75, hotel_cost_per_night_gbp: 55, default_duration_nights: 7,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Kaleiçi Old City", description: "Roman harbour district of winding lanes, Ottoman houses, and a Byzantine clock tower" },
      { name: "Düden Waterfalls", description: "Cascading falls that plunge directly into the Mediterranean" },
      { name: "Aspendos Theatre", description: "The best-preserved Roman amphitheatre in the world, still used for performances" },
    ],
  },
  {
    city: "Dalaman", country: "Turkey", iata_code: "DLM",
    hook: "Gateway to the Turquoise Coast — paragliding over Ölüdeniz, ancient Lycian ruins, and boat trips in crystalline coves",
    fun_fact: "The Blue Lagoon at Ölüdeniz is one of the most photographed beaches in the world and a natural protected area",
    weather_summary: "Very hot July–August; warm and dry May–October; mild winters",
    flight_cost_per_person_gbp: 75, hotel_cost_per_night_gbp: 50, default_duration_nights: 7,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Ölüdeniz Blue Lagoon", description: "Iconic turquoise lagoon framed by pine-forested cliffs" },
      { name: "Saklıkent Gorge", description: "Europe's second-longest gorge — wade through icy water between towering walls" },
      { name: "Tlos Ancient City", description: "Lycian rock tombs carved into cliffsides above a spectacular valley" },
    ],
  },
  {
    city: "Menorca", country: "Spain", iata_code: "MAH",
    hook: "The Balearic island that kept its soul — prehistoric monuments, hidden coves, and a pace of life that refuses to hurry",
    fun_fact: "Menorca has over 1,500 megalithic monuments — more prehistoric sites per square kilometre than almost anywhere in the world",
    weather_summary: "Warm and sunny May–October; cooler and quieter in winter; far less crowded than Mallorca or Ibiza",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 72, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Cala Macarella", description: "Postcard-perfect cove of turquoise water and white sand ringed by pine trees" },
      { name: "Monte Toro", description: "Island's highest point with a monastery and 360° views of the whole island" },
      { name: "Naveta d'Es Tudons", description: "A 3,500-year-old megalithic funerary chamber, the oldest roofed building in Spain" },
    ],
  },
  {
    city: "Kos", country: "Greece", iata_code: "KGS",
    hook: "Ancient temples, bicycle-friendly villages, and some of the clearest Aegean waters in Greece",
    fun_fact: "Hippocrates, the father of medicine, was born on Kos around 460 BC and is said to have taught under the island's ancient Plane Tree",
    weather_summary: "Long hot summers; warm from May to October; excellent for watersports and cycling",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 65, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Hippocrates Plane Tree", description: "Ancient tree where the father of medicine reputedly taught his students" },
      { name: "Castle of the Knights", description: "15th-century crusader castle guarding the harbour entrance" },
      { name: "Tigaki Beach", description: "Long sandy beach with shallow water ideal for kite-surfing" },
    ],
  },
  {
    city: "Kefalonia", country: "Greece", iata_code: "EFL",
    hook: "The wild Ionian island — vertiginous cliffs, an underground lake, and beaches that look like a screen saver made real",
    fun_fact: "Myrtos Beach on Kefalonia is consistently voted one of the most beautiful beaches in the world by travel publications",
    weather_summary: "Hot dry summers; best from May to October; cooler in spring with dramatic mountain scenery",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 70, default_duration_nights: 7,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Myrtos Beach", description: "White pebble beach at the foot of sheer limestone cliffs, Ionian blue below" },
      { name: "Melissani Cave Lake", description: "Underground lake illuminated by a collapsed ceiling open to the sky" },
      { name: "Assos Village", description: "Pastel-painted village on a narrow isthmus with a Venetian fort above" },
    ],
  },
  {
    city: "Heraklion", country: "Greece", iata_code: "HER",
    hook: "The cradle of Minoan civilisation — 4,000-year-old palaces, gorge hikes, and Cretan hospitality that earns its reputation",
    fun_fact: "The Palace of Knossos, just outside Heraklion, is Europe's oldest city and the heart of the ancient Minoan civilisation",
    weather_summary: "Very hot summers; warm spring and autumn; one of Greece's sunniest and driest regions",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 68, default_duration_nights: 7,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "cultural", is_primary: false }, { slug: "beach", is_primary: false }],
    places: [
      { name: "Palace of Knossos", description: "Europe's first urban civilisation — Minoan frescoes and labyrinthine corridors" },
      { name: "Samaria Gorge", description: "Europe's longest gorge — a 16km hike through towering limestone walls" },
      { name: "Heraklion Archaeological Museum", description: "The world's finest collection of Minoan art and artefacts" },
    ],
  },
  {
    city: "Kerry", country: "Ireland", iata_code: "KIR",
    hook: "Ireland's wild southwestern corner — the Ring of Kerry, sea cliffs, and ancient monastic islands in the Atlantic",
    fun_fact: "Skellig Michael, a dramatic sea stack off Kerry's coast, is a UNESCO World Heritage Site used as Luke Skywalker's island in Star Wars",
    weather_summary: "Cool and often rainy year-round; stunning in all weathers; summer is the warmest and driest",
    flight_cost_per_person_gbp: 35, hotel_cost_per_night_gbp: 78, default_duration_nights: 4,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Ring of Kerry", description: "Scenic 179km coastal drive through mountains, sea cliffs, and ancient ruins" },
      { name: "Skellig Michael", description: "Dramatic UNESCO sea stack with a 6th-century monastic settlement, boat access only" },
      { name: "Killarney National Park", description: "Ireland's oldest national park — lakes, mountains, and red deer" },
    ],
  },
  {
    city: "Almeria", country: "Spain", iata_code: "LEI",
    hook: "Spain's most overlooked province — Europe's only true desert, unspoiled beaches, and more sunshine than anywhere on the continent",
    fun_fact: "Almeria's Tabernas Desert is the only true desert in Europe and has been the backdrop for hundreds of Spaghetti Westerns since the 1960s",
    weather_summary: "Europe's sunniest city; over 3,000 hours of sunshine a year; warm beaches from April to November",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 58, default_duration_nights: 5,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Tabernas Desert & Mini Hollywood", description: "The only desert in Europe — film set tours amid Clint Eastwood's landscapes" },
      { name: "Cabo de Gata Natural Park", description: "Volcanic coastline of black sand beaches and deserted coves" },
      { name: "Almeria Alcazaba", description: "Moorish fortress with sweeping views over the city and sea" },
    ],
  },
  {
    city: "Catania", country: "Italy", iata_code: "CTA",
    hook: "Baroque piazzas in the shadow of an active volcano — Etna looms over Catania and makes everything feel electric",
    fun_fact: "Mount Etna is Europe's largest active volcano and has been erupting almost continuously for 500,000 years",
    weather_summary: "Hot Mediterranean summers; mild winters; ideal spring and autumn for hiking Etna",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 65, default_duration_nights: 5,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "cultural", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Mount Etna", description: "Hike or cable-car to the summit craters of Europe's most active volcano" },
      { name: "Catania's Piazza del Duomo", description: "Baroque square built on top of ancient lava flows, centred on the Liotru elephant fountain" },
      { name: "Valle del Bove", description: "Vast depression on Etna's eastern flank — lava fields and otherworldly terrain" },
    ],
  },
  {
    city: "Santorini", country: "Greece", iata_code: "JTR",
    hook: "The most photographed caldera in the world — perched whitewashed villages, blood-red beaches, and sunsets that justify every cliché",
    fun_fact: "Santorini was formed by one of history's largest volcanic eruptions around 1600 BC, which may have inspired the Atlantis legend",
    weather_summary: "Hot and sunny May–October; quieter and romantic in shoulder seasons",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 110, default_duration_nights: 5,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }, { slug: "adventure", is_primary: false }],
    places: [
      { name: "Oia Sunset Point", description: "The iconic blue-domed village famous for the most celebrated sunset in Greece" },
      { name: "Red Beach", description: "Dramatic volcanic beach of red and black rock below towering ochre cliffs" },
      { name: "Akrotiri Archaeological Site", description: "A Minoan city frozen in time by the volcanic eruption — the Pompeii of the Aegean" },
    ],
  },
  {
    city: "Aarhus", country: "Denmark", iata_code: "AAR",
    hook: "Denmark's second city and its most fun — a vibrant arts scene, Viking heritage, and a food culture that punches above its weight",
    fun_fact: "Aarhus has one of Europe's oldest Viking settlements, with artefacts at Moesgaard dating back over 2,000 years",
    weather_summary: "Cool northern climate; lovely in summer; colourful autumn foliage; cold winters",
    flight_cost_per_person_gbp: 42, hotel_cost_per_night_gbp: 88, default_duration_nights: 3,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "city_break", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "ARoS Art Museum", description: "Top-floor rainbow panorama walkway with sweeping city views" },
      { name: "Moesgaard Museum", description: "World-class Viking and prehistoric artefacts in a grass-roofed building" },
      { name: "Den Gamle By", description: "Open-air museum of a complete 18th-century Danish town" },
    ],
  },
  {
    city: "Chania", country: "Greece", iata_code: "CHQ",
    hook: "Western Crete's jewel — a Venetian harbour with minarets, gorge hikes, and beaches ranging from pink to golden",
    fun_fact: "Chania's covered market, built in 1913, is modelled on the Mercato Centrale in Florence",
    weather_summary: "Long hot summers; best from May to October; milder and greener than eastern Crete",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 68, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Venetian Harbour", description: "16th-century harbour with a lighthouse, mosques, and the best waterfront in Crete" },
      { name: "Samaria Gorge", description: "Europe's longest gorge — a dramatic 16km hike from the White Mountains to the sea" },
      { name: "Elafonisi Pink Sand Beach", description: "A tidal lagoon with blush-pink sand caused by crushed shells" },
    ],
  },
  {
    city: "Bergen", country: "Norway", iata_code: "BGO",
    hook: "Norway's gateway city — colourful wooden wharves, fjord boat trips, and a funicular to views that explain why people write poems about Norway",
    fun_fact: "Bergen is surrounded by seven mountains and receives over 240 days of rain per year — locals carry umbrellas like a badge of honour",
    weather_summary: "Norway's rainiest city; layers essential; summer is long-lit and beautiful; fjords are magical year-round",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 105, default_duration_nights: 4,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Bryggen Wharf", description: "UNESCO-listed row of medieval Hanseatic wooden buildings on the harbour" },
      { name: "Fløibanen Funicular", description: "Mountain railway to the top of Mount Fløyen for panoramic city and fjord views" },
      { name: "Hardangerfjord", description: "Day trips to Norway's second-longest fjord — waterfalls, orchards, and silence" },
    ],
  },
  {
    city: "Ponta Delgada", country: "Portugal", iata_code: "PDL",
    hook: "Volcanic craters, hot springs, whale watching, and the most dramatic green island scenery in the Atlantic",
    fun_fact: "The Azores are one of the few places on earth where you can reliably swim with wild sperm whales",
    weather_summary: "Mild and green year-round; can be showery; best May–September; dramatic in all seasons",
    flight_cost_per_person_gbp: 75, hotel_cost_per_night_gbp: 72, default_duration_nights: 5,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Sete Cidades", description: "Twin volcanic crater lakes — one blue, one green — surrounded by mist and forest" },
      { name: "Furnas Hot Springs", description: "Volcanic thermal pools where locals cook food underground in geothermal vents" },
      { name: "Whale Watching", description: "Year-round access to sperm whales, blue whales, and dolphins in their natural habitat" },
    ],
  },
  {
    city: "Pula", country: "Croatia", iata_code: "PUY",
    hook: "A Roman amphitheatre still hosting concerts after 2,000 years, backed by an Istrian coast of pine-fringed coves",
    fun_fact: "Pula's Roman Arena, built in the 1st century AD, is one of the six largest surviving Roman amphitheatres in the world",
    weather_summary: "Hot Mediterranean summers; warm spring and autumn; mild winters on the Istrian coast",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 68, default_duration_nights: 5,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "cultural", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Pula Roman Arena", description: "One of the world's best-preserved Roman amphitheatres — still hosting events" },
      { name: "Cape Kamenjak", description: "Wild nature reserve of sea cliffs, hidden coves, and crystal-clear swimming" },
      { name: "Brijuni National Park", description: "Island national park with Roman ruins, safari animals, and Tito's summer residence" },
    ],
  },
  {
    city: "Zadar", country: "Croatia", iata_code: "ZAD",
    hook: "Alfred Hitchcock called it the most beautiful sunset in the world, and Zadar's Sea Organ will make you believe him",
    fun_fact: "Zadar's Sea Organ uses underwater pipes and Adriatic tides to create continuous natural music — the world's first such instrument",
    weather_summary: "Hot dry summers; mild and beautiful in spring and autumn; one of the most authentic Dalmatian cities",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 65, default_duration_nights: 5,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "cultural", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Sea Organ", description: "Tidal instrument built into the quayside — waves play music through marble steps" },
      { name: "Roman Forum", description: "The largest Roman forum on the eastern Adriatic, still at the heart of the old town" },
      { name: "Plitvice Lakes", description: "UNESCO turquoise travertine lake system — one of Europe's greatest natural wonders, 1.5 hours away" },
    ],
  },
  {
    city: "Poprad", country: "Slovakia", iata_code: "TAT",
    hook: "Gateway to the High Tatras — hiking and skiing in Slovakia's most dramatic mountains at prices that make the Alps feel expensive",
    fun_fact: "The High Tatras are the smallest alpine mountain range in the world yet contain over 200 mountain lakes",
    weather_summary: "Cold snowy winters ideal for skiing; beautiful summer hiking; crisp and dramatic year-round",
    flight_cost_per_person_gbp: 45, hotel_cost_per_night_gbp: 55, default_duration_nights: 5,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "skiing", is_primary: false }],
    places: [
      { name: "High Tatras Mountain Range", description: "Alpine peaks and glacial lakes with hut-to-hut hiking trails" },
      { name: "Štrbské Pleso Lake", description: "Glacial lake at 1,346m with mountain reflections and cross-country skiing" },
      { name: "Ždiar Village", description: "Traditional Gorał mountain village at the foot of the Belianske Tatry" },
    ],
  },
  {
    city: "Innsbruck", country: "Austria", iata_code: "INN",
    hook: "The Olympic city in the Alps — ski runs from your doorstep, a golden roof in the old town, and the whole Tyrolean world at your feet",
    fun_fact: "Innsbruck hosted the Winter Olympics twice — in 1964 and 1976 — and still uses the same ski runs",
    weather_summary: "Cold snowy winters perfect for skiing; warm sunny summers ideal for hiking; beautiful year-round",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 85, default_duration_nights: 4,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "skiing", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Golden Roof (Goldenes Dachl)", description: "15th-century balcony covered in 2,657 fire-gilded copper tiles at the heart of the old town" },
      { name: "Nordkette Mountain Railway", description: "Cable car from city centre to 2,256m — skiing and hiking from the rooftops" },
      { name: "Ambras Castle", description: "Renaissance castle above the city with Habsburg art collections" },
    ],
  },
  {
    city: "Reykjavik", country: "Iceland", iata_code: "KEF",
    hook: "The world's northernmost capital — Northern Lights, geysers, black sand beaches, and a nightlife that goes until the sun forgets to set",
    fun_fact: "Reykjavik runs almost entirely on geothermal energy, making it one of the cleanest and most sustainable capitals on earth",
    weather_summary: "Cold and changeable year-round; summer has 24-hour daylight; winter has Northern Lights; always dramatic",
    flight_cost_per_person_gbp: 75, hotel_cost_per_night_gbp: 115, default_duration_nights: 4,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "city_break", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Blue Lagoon", description: "Geothermal spa of milky-blue water — the most visited attraction in Iceland" },
      { name: "Golden Circle", description: "Geysir hot springs, Gullfoss waterfall, and Þingvellir — Iceland's trio of wonders" },
      { name: "Northern Lights Tours", description: "September–April hunting for the aurora borealis outside the city lights" },
    ],
  },
  {
    city: "Ouarzazate", country: "Morocco", iata_code: "OZZ",
    hook: "The door of the desert — Saharan kasbahs, the Atlas Mountains on the horizon, and film sets that span continents",
    fun_fact: "Ouarzazate is known as the Hollywood of Africa; Lawrence of Arabia, Gladiator, and Game of Thrones were all filmed here",
    weather_summary: "Very hot in summer; warm spring and autumn; cold desert nights year-round; best October–April",
    flight_cost_per_person_gbp: 75, hotel_cost_per_night_gbp: 45, default_duration_nights: 4,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Aït Benhaddou", description: "UNESCO World Heritage kasbah — one of Morocco's most iconic earthen citadels" },
      { name: "Atlas Studios", description: "Africa's largest film studio — tour the sets of Gladiator and Game of Thrones" },
      { name: "Draa Valley Palmeries", description: "100km of date palms lining a river oasis between the Atlas and the Sahara" },
    ],
  },
  {
    city: "Essaouira", country: "Morocco", iata_code: "ESU",
    hook: "A blue-and-white medina on the Atlantic wind — world-class kite-surfing, Jimi Hendrix's inspiration, and fish grilled on the harbour wall",
    fun_fact: "Essaouira's winds are so reliable it hosted the Kitesurfing World Championship — it's known as Wind City of Africa",
    weather_summary: "Windy and mild year-round; cooler than Marrakech; misty and atmospheric in winter",
    flight_cost_per_person_gbp: 70, hotel_cost_per_night_gbp: 55, default_duration_nights: 4,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "relaxation", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Medina Ramparts", description: "UNESCO-listed sea bastions with cannons facing the Atlantic" },
      { name: "Moulay Hassan Square", description: "Lively main square flanked by blue fishing boats and argan oil stalls" },
      { name: "Beach Kitesurfing", description: "Miles of Atlantic beach consistently rated one of the world's best kite spots" },
    ],
  },
  {
    city: "Trapani", country: "Italy", iata_code: "TPS",
    hook: "Salt pans, ancient windmills, and the Egadi Islands just offshore — western Sicily's hidden gem",
    fun_fact: "Trapani's salt pans have produced sea salt since Phoenician times and are now a nature reserve for migratory pink flamingos",
    weather_summary: "Hot Mediterranean summers; mild and sunny winter; far less touristy than Palermo or Catania",
    flight_cost_per_person_gbp: 60, hotel_cost_per_night_gbp: 60, default_duration_nights: 5,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "cultural", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Saline dello Stagnone", description: "Ancient salt pans with traditional windmills and flamingo sightings at sunset" },
      { name: "Erice", description: "Medieval hilltop town at 750m — cobblestones, Norman castle, and sea views" },
      { name: "Egadi Islands", description: "Three islands reached by hydrofoil — clear water, Roman wreck dives, and tuna history" },
    ],
  },
  {
    city: "Kalamata", country: "Greece", iata_code: "KLX",
    hook: "Named for its olives, Kalamata surprises — Byzantine ruins, the dramatic Mani Peninsula, and beaches the package-tour crowds haven't found",
    fun_fact: "The Kalamata olive has PDO protected status and has been cultivated continuously in the Messenia region since ancient times",
    weather_summary: "Very hot summers; mild winters; one of Greece's sunniest regions; uncrowded compared to the islands",
    flight_cost_per_person_gbp: 62, hotel_cost_per_night_gbp: 58, default_duration_nights: 5,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Ancient Messene", description: "One of Greece's best-preserved ancient cities — theatre, stadium, and temples in situ" },
      { name: "Mani Peninsula", description: "Rugged finger of land with Byzantine tower villages and the deepest cave in Greece" },
      { name: "Voidokilia Beach", description: "Perfect omega-shaped bay ringed by dunes and ancient ruins" },
    ],
  },
  {
    city: "Kayseri", country: "Turkey", iata_code: "ASR",
    hook: "Gateway to Cappadocia and the slopes of Mount Erciyes — fairy chimneys, hot air balloons, and ancient underground cities",
    fun_fact: "The underground city of Derinkuyu near Kayseri could house up to 20,000 people and descends 85 metres underground",
    weather_summary: "Cold snowy winters with skiing on Erciyes; hot dry summers; spring ideal for balloon flights",
    flight_cost_per_person_gbp: 80, hotel_cost_per_night_gbp: 52, default_duration_nights: 5,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "skiing", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Cappadocia Fairy Chimneys", description: "Volcanic rock formations sculpted over millennia — sunrise balloon flights above them are unmissable" },
      { name: "Erciyes Ski Resort", description: "Modern ski resort on the slopes of a 3,917m extinct volcano" },
      { name: "Derinkuyu Underground City", description: "Multi-storey ancient city carved into volcanic rock, used for shelter and storage" },
    ],
  },
  {
    city: "Biarritz", country: "France", iata_code: "BIQ",
    hook: "Europe's surf capital — where the Basque Country meets the Atlantic, Art Deco architecture overlooks powerful breaks",
    fun_fact: "Biarritz was the playground of Napoleon III and Empress Eugénie, who made it the fashionable resort of 19th-century Europe",
    weather_summary: "Mild Atlantic climate year-round; famous for powerful surf from autumn to spring; warm beach summers",
    flight_cost_per_person_gbp: 48, hotel_cost_per_night_gbp: 85, default_duration_nights: 4,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Grande Plage", description: "Main beach flanked by the casino — the heart of Biarritz's Belle Époque identity" },
      { name: "Rocher de la Vierge", description: "Sea stack with a walkway to a statue of the Virgin — crashing waves on three sides" },
      { name: "Cité de l'Océan", description: "Award-winning surf and ocean museum on the beachfront" },
    ],
  },
  {
    city: "Preveza", country: "Greece", iata_code: "PVK",
    hook: "The gateway to the Ionian — a charming fishing port, Roman ruins, and access to some of Greece's least-visited coastline",
    fun_fact: "The Battle of Actium, fought near Preveza in 31 BC, was one of history's most decisive — Octavian's victory over Antony and Cleopatra changed the world",
    weather_summary: "Hot sunny summers; warm spring and autumn; mild winters; the Epirus coast is often overlooked",
    flight_cost_per_person_gbp: 60, hotel_cost_per_night_gbp: 58, default_duration_nights: 7,
    trip_types: [{ slug: "adventure", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Nicopolis Ancient City", description: "Octavian's victory city — vast Roman ruins including a theatre and city walls" },
      { name: "Lefkada Island", description: "Ionian island accessible by bridge with dramatic cliffs and turquoise beaches" },
      { name: "Parga Town", description: "Pastel-painted town spilling down a hillside above a turquoise bay" },
    ],
  },
  {
    city: "Olbia", country: "Italy", iata_code: "OLB",
    hook: "The gateway to the Costa Smeralda — granite boulders, water that turns turquoise, and Sardinian cooking that makes you question everything else",
    fun_fact: "The Costa Smeralda near Olbia was developed in the 1960s by the Aga Khan and became one of the world's most exclusive resorts",
    weather_summary: "Hot dry summers; mild and beautiful in spring and autumn; excellent beach season May–October",
    flight_cost_per_person_gbp: 60, hotel_cost_per_night_gbp: 75, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "relaxation", is_primary: false }],
    places: [
      { name: "Costa Smeralda", description: "Emerald-coast coves, gin-clear water, and granite headlands north of Olbia" },
      { name: "Maddalena Archipelago", description: "7-island national park with boat trips through some of Italy's finest waters" },
      { name: "Tavolara Island", description: "Dramatic limestone island rising 565m from the sea — day trips by boat" },
    ],
  },
  {
    city: "Alghero", country: "Italy", iata_code: "AHO",
    hook: "Sardinia's Catalan city — Gothic churches, coral jewellery, and Neptune's Grotto reached by cliff staircase or boat",
    fun_fact: "Alghero has spoken Catalan since 1353 when Catalans repopulated the city — the language is still officially recognised and taught today",
    weather_summary: "Hot Mediterranean summers; mild and uncrowded in spring and autumn; perfect for coastal cycling",
    flight_cost_per_person_gbp: 60, hotel_cost_per_night_gbp: 68, default_duration_nights: 7,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Neptune's Grotto", description: "Dramatic sea cave reached by 654 steps cut into the cliff face or by boat" },
      { name: "Alghero Old Town Walls", description: "16th-century sea bastions forming a promenade above the harbour" },
      { name: "Capo Caccia Cliffs", description: "Towering white limestone headland with vertical sea cliffs and falcon nests" },
    ],
  },
  {
    city: "Cagliari", country: "Italy", iata_code: "CAG",
    hook: "Sardinia's ancient capital — Roman ruins, a pink flamingo lagoon, and white-sand beaches a bus ride from the city centre",
    fun_fact: "Cagliari's Molentargius lagoon attracts over 15,000 flamingos each year migrating from the Camargue in France",
    weather_summary: "Very hot summers; mild winters; excellent beach season; spring flamingo sightings are spectacular",
    flight_cost_per_person_gbp: 58, hotel_cost_per_night_gbp: 65, default_duration_nights: 5,
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Poetto Beach", description: "8km of golden sand beach a short bus ride from the historic centre" },
      { name: "Nora Archaeological Site", description: "Phoenician and Roman ruins on a headland jutting into the Mediterranean" },
      { name: "Castello Quarter", description: "Medieval walled hilltop with panoramic sea views and Pisan towers" },
    ],
  },

  // ── RELAXATION (additional) ───────────────────────────────────────────────

  {
    city: "Sharm El Sheikh", country: "Egypt", iata_code: "SSH",
    hook: "World-class coral reefs, year-round Red Sea sunshine, and resort luxury at prices that still feel implausible",
    fun_fact: "Ras Mohammed National Park near Sharm el-Sheikh has over 220 species of coral and 1,000 species of fish",
    weather_summary: "Sunny and warm year-round; almost never rains; sea temperature stays above 20°C even in winter",
    flight_cost_per_person_gbp: 90, hotel_cost_per_night_gbp: 52, default_duration_nights: 7,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "adventure", is_primary: false }],
    places: [
      { name: "Ras Mohammed National Park", description: "Egypt's finest diving and snorkelling — sharks, rays, and walls of coral" },
      { name: "Blue Hole", description: "Legendary Red Sea dive site — a 100m vertical shaft through a coral reef" },
      { name: "Naama Bay", description: "Horseshoe-shaped bay of calm shallow water ideal for snorkelling from the beach" },
    ],
  },
  {
    city: "Agadir", country: "Morocco", iata_code: "AGA",
    hook: "Morocco's beach resort on the Atlantic — reliable sunshine, a crescent bay, and the Atlas Mountains on the horizon",
    fun_fact: "Agadir was entirely destroyed by an earthquake in 1960 and rebuilt from scratch — almost the whole city is less than 70 years old",
    weather_summary: "Warm and sunny year-round; rarely above 28°C; one of Morocco's most reliable beach destinations",
    flight_cost_per_person_gbp: 72, hotel_cost_per_night_gbp: 55, default_duration_nights: 7,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "adventure", is_primary: false }],
    places: [
      { name: "Agadir Beach", description: "10km of Atlantic beach with calm surf and promenade cafés" },
      { name: "Souk El Had", description: "Agadir's vast market — spices, argan oil, leather, and Moroccan ceramics" },
      { name: "Paradise Valley", description: "Natural gorge with rock pools and palm trees, 1 hour inland" },
    ],
  },
  {
    city: "Skiathos", country: "Greece", iata_code: "JSI",
    hook: "The Mamma Mia island — pine trees tumbling to turquoise water, and the legendary Lalaria Beach only reachable by boat",
    fun_fact: "Skiathos has over 60 beaches squeezed into an island just 12km long — one of the highest ratios of beach to land in Greece",
    weather_summary: "Hot sunny summers; green and lush compared to drier Greek islands; best May–September",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 72, default_duration_nights: 7,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "beach", is_primary: false }],
    places: [
      { name: "Koukounaries Beach", description: "Pine-backed golden beach consistently ranked among Greece's finest" },
      { name: "Lalaria Beach", description: "White marble pebble beach accessible only by boat, with natural rock arches" },
      { name: "Skiathos Old Town", description: "Lively harbour town with tavernas, bars, and a colourful evening promenade" },
    ],
  },
  {
    city: "Santander", country: "Spain", iata_code: "SDR",
    hook: "Northern Spain's elegant beach city — fin de siècle promenades, surfable Atlantic waves, and pintxos at every corner",
    fun_fact: "Santander was once the summer residence of the Spanish royal family, with Alfonso XIII building his summer palace here in 1908",
    weather_summary: "Cooler than southern Spain; green and fresh; good surf year-round; warm beach season July–August",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 70, default_duration_nights: 4,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Palacio de la Magdalena", description: "Romantic royal summer palace on its own peninsula above the sea" },
      { name: "El Sardinero Beach", description: "Belle Époque resort beach with a grand casino and wide Atlantic views" },
      { name: "Centro Botín", description: "Renzo Piano arts centre cantilevered over the bay — Cantabrian art and culture" },
    ],
  },
  {
    city: "Tangier", country: "Morocco", iata_code: "TNG",
    hook: "Where Africa meets Europe — a port city of Casbah mystery, literary ghosts, and panoramic views of two continents",
    fun_fact: "Tangier was an International Zone controlled by multiple nations until 1956, attracting writers including Burroughs, Kerouac, and Tennessee Williams",
    weather_summary: "Mild Mediterranean climate; rarely extreme; breezy year-round; pleasant spring and autumn",
    flight_cost_per_person_gbp: 68, hotel_cost_per_night_gbp: 52, default_duration_nights: 3,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "cultural", is_primary: false }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Kasbah Museum", description: "17th-century palace with Moroccan artefacts and a garden terrace over the Strait" },
      { name: "Cap Spartel", description: "Africa's northwestern tip — the point where the Atlantic meets the Mediterranean" },
      { name: "Grand Socco", description: "Main square linking the medina to the modern city, lively with market traders" },
    ],
  },
  {
    city: "Nice", country: "France", iata_code: "NCE",
    hook: "The queen of the Côte d'Azur — the Promenade des Anglais, old-town colour, and the Alps rising behind the Riviera",
    fun_fact: "Nice was part of Italy until 1860 when it was ceded to France — Niçois cooking still reflects this Italian heritage",
    weather_summary: "300 days of sunshine; mild winters; hot summers; the most reliable weather on the French Riviera",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 95, default_duration_nights: 4,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "city_break", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Promenade des Anglais", description: "The iconic seafront boulevard stretching 7km along the Baie des Anges" },
      { name: "Vieux Nice", description: "Baroque old town of Italian-influenced alleyways, markets, and restaurants" },
      { name: "Cours Saleya Flower Market", description: "Daily flower and produce market in the heart of the old town" },
    ],
  },
  {
    city: "Paphos", country: "Cyprus", iata_code: "PFO",
    hook: "Where Aphrodite was born — UNESCO archaeological mosaics, a castle on the harbour, and the warmest winter sun in Europe",
    fun_fact: "Paphos's floor mosaics, discovered in 1962, are considered among the finest in the world and cover 2,000 square metres",
    weather_summary: "The sunniest part of Cyprus; warm enough to swim April–November; a popular mild-winter retreat",
    flight_cost_per_person_gbp: 70, hotel_cost_per_night_gbp: 65, default_duration_nights: 7,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Paphos Archaeological Park", description: "UNESCO site of Roman villas with extraordinary floor mosaics depicting mythology" },
      { name: "Aphrodite's Rock", description: "Sea stack where the goddess of love is said to have risen from the foam" },
      { name: "Paphos Harbour Castle", description: "Medieval castle at the end of the fishing harbour with panoramic sea views" },
    ],
  },
  {
    city: "Larnaca", country: "Cyprus", iata_code: "LCA",
    hook: "Cyprus's beach gateway — the island's longest sandy shore, a medieval salt lake with flamingos, and the church of Lazarus",
    fun_fact: "Larnaca's Salt Lake attracts thousands of flamingos each winter — one of the largest migratory bird habitats in the eastern Mediterranean",
    weather_summary: "Very sunny and hot in summer; warm and pleasant winters; ideal year-round beach weather",
    flight_cost_per_person_gbp: 68, hotel_cost_per_night_gbp: 62, default_duration_nights: 7,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Mackenzie Beach", description: "Long sandy beach flanked by seafood restaurants and shaded tavernas" },
      { name: "Church of Saint Lazarus", description: "9th-century Byzantine church said to contain the tomb of the resurrected Lazarus" },
      { name: "Hala Sultan Tekke Mosque", description: "17th-century mosque on the shore of the Salt Lake — one of Islam's holiest sites" },
    ],
  },
  {
    city: "Bodrum", country: "Turkey", iata_code: "BJV",
    hook: "The St Tropez of Turkey — white cube houses tumbling to a crusader castle, yacht-filled bays, and Aegean evenings that last forever",
    fun_fact: "The Mausoleum at Halicarnassus, one of the Seven Wonders of the Ancient World, was built in what is now Bodrum in 353 BC",
    weather_summary: "Very hot July–August; warm and lovely May–June and September–October; mild winters",
    flight_cost_per_person_gbp: 75, hotel_cost_per_night_gbp: 70, default_duration_nights: 7,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Bodrum Castle", description: "15th-century crusader fortress housing the Museum of Underwater Archaeology" },
      { name: "Mausoleum of Halicarnassus", description: "Ruins of one of the Seven Wonders of the Ancient World in the town centre" },
      { name: "Gümüşlük Village", description: "Bohemian fishing village with seafood restaurants built over ancient ruins" },
    ],
  },
  {
    city: "Rimini", country: "Italy", iata_code: "RMI",
    hook: "Italy's Adriatic playground — 15km of sandy beach with Roman arches at the end of the street",
    fun_fact: "Rimini was founded by the Romans in 268 BC and still has the oldest surviving Roman bridge in the world — the Ponte di Tiberio",
    weather_summary: "Hot Adriatic summers; mild winters; beach season June–September; accessible year-round",
    flight_cost_per_person_gbp: 52, hotel_cost_per_night_gbp: 65, default_duration_nights: 5,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Ponte di Tiberio", description: "The oldest surviving Roman bridge in the world, still in daily use after 2,000 years" },
      { name: "Arch of Augustus", description: "1st-century BC triumphal arch marking the beginning of the Via Flaminia" },
      { name: "Rimini Beach", description: "Miles of organised Adriatic beach clubs — lidos, umbrellas, and Spritz at sunset" },
    ],
  },
  {
    city: "Reggio Calabria", country: "Italy", iata_code: "REG",
    hook: "Italy's toe, facing Sicily across the Strait of Messina — home to the world's most perfect bronze statues and views that rearrange your sense of beauty",
    fun_fact: "The Riace Bronzes, discovered off Reggio's coast in 1972, are the finest surviving examples of ancient Greek bronze sculpture in existence",
    weather_summary: "Very hot summers; mild winters; one of Italy's sunniest regions; far off the tourist trail",
    flight_cost_per_person_gbp: 62, hotel_cost_per_night_gbp: 55, default_duration_nights: 4,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Riace Bronzes", description: "5th-century BC Greek bronze warriors at the National Museum — the finest ancient bronzes in the world" },
      { name: "Lungomare Falcomatà", description: "D'Annunzio's 'most beautiful kilometre in Italy' — promenade with views to Mount Etna" },
      { name: "Strait of Messina Views", description: "Sicily rising across 3km of water — a view that has awed travellers since antiquity" },
    ],
  },
  {
    city: "Palermo", country: "Italy", iata_code: "PMO",
    hook: "Sicily's chaotic, magnificent capital — Arab-Norman churches, the oldest food market in Europe, and street food that turns strangers into friends",
    fun_fact: "Palermo's Ballarò market has been running since the 10th century, making it one of the oldest continuously operating street markets in the world",
    weather_summary: "Hot Mediterranean summers; mild winters; excellent spring and autumn for food and culture",
    flight_cost_per_person_gbp: 58, hotel_cost_per_night_gbp: 62, default_duration_nights: 4,
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "relaxation", is_primary: false }, { slug: "city_break", is_primary: false }],
    places: [
      { name: "Ballarò Market", description: "Chaotic, aromatic street market of Arab origin — arancini, seafood, and vendor calls" },
      { name: "Cappella Palatina", description: "Arab-Norman palace chapel with the finest Byzantine mosaics outside Istanbul" },
      { name: "Catacombe dei Cappuccini", description: "Catacombs housing 8,000 clothed and displayed mummies — macabre and unmissable" },
    ],
  },
  {
    city: "Lamezia Terme", country: "Italy", iata_code: "SUF",
    hook: "Gateway to the toe of Italy's boot — rugged mountains, crystal Tyrrhenian coves, and Greek temples older than Rome",
    fun_fact: "Calabria was the heart of Magna Graecia — it has more ancient Greek ruins than anywhere outside Greece itself",
    weather_summary: "Very hot summers; mild winters; beaches June–October; uncrowded mountain hiking year-round",
    flight_cost_per_person_gbp: 62, hotel_cost_per_night_gbp: 55, default_duration_nights: 7,
    trip_types: [{ slug: "relaxation", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "adventure", is_primary: false }],
    places: [
      { name: "Tropea", description: "Italy's most dramatic cliff-top village — a red-rock promontory above turquoise sea" },
      { name: "Capo Vaticano Beach", description: "Wild crystalline beach with views to the Aeolian Islands on clear days" },
      { name: "Locri Archaeological Park", description: "Ancient Greek colony with temples, a theatre, and a rich museum" },
    ],
  },

  // ── CITY & CULTURE (additional) ──────────────────────────────────────────

  {
    city: "Istanbul", country: "Turkey", iata_code: "IST",
    hook: "The city where continents collide — a skyline of minarets, a bazaar that never sleeps, and Bosphorus sunsets that rearrange your sense of beauty",
    fun_fact: "Istanbul is the only city in the world that straddles two continents, with Europe on the west bank and Asia on the east",
    weather_summary: "Four seasons; best in spring (May) and autumn (September–October); hot summers, cold winters with occasional snow",
    flight_cost_per_person_gbp: 75, hotel_cost_per_night_gbp: 68, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Hagia Sophia", description: "Justinian's 6th-century cathedral turned mosque — the greatest surviving Byzantine building" },
      { name: "Grand Bazaar", description: "4,000 shops in a covered labyrinth operating continuously since 1461" },
      { name: "Bosphorus Cruise", description: "Boat trip through the strait dividing two continents, past palaces and fortresses" },
    ],
  },
  {
    city: "Belfast", country: "Northern Ireland", iata_code: "BFS",
    hook: "A city reborn from its troubled past — Titanic quarter, murals on every peace wall, and a pub warmth unmatched in the British Isles",
    fun_fact: "The RMS Titanic was built in Belfast's Harland and Wolff shipyard and launched in 1911 — the city has fully reclaimed its most famous ship",
    weather_summary: "Mild but rainy year-round; layers essential; enjoyable in any weather with the right company",
    flight_cost_per_person_gbp: 28, hotel_cost_per_night_gbp: 78, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Titanic Belfast Museum", description: "World's largest Titanic visitor experience in the shipyard where she was built" },
      { name: "Cathedral Quarter", description: "Victorian linen warehouses turned into the best bar and arts scene in Ireland" },
      { name: "Giant's Causeway", description: "UNESCO volcanic hexagonal columns on the Antrim coast — 1 hour by bus" },
    ],
  },
  {
    city: "Bucharest", country: "Romania", iata_code: "OTP",
    hook: "Europe's most underrated capital — Belle Époque boulevards, Ceaușescu's insane palace, and a nightlife that gives Ibiza pause for thought",
    fun_fact: "Bucharest's Palace of Parliament is the world's second-largest administrative building, with 1,100 rooms and 12 floors",
    weather_summary: "Hot summers, cold winters; best in spring and early autumn; continental climate",
    flight_cost_per_person_gbp: 48, hotel_cost_per_night_gbp: 52, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Palace of Parliament", description: "Ceaușescu's megalomaniacal project — the second-heaviest building on earth" },
      { name: "Old Town (Lipscani)", description: "Medieval merchant quarter now packed with rooftop bars and street art" },
      { name: "Herăstrău Park", description: "Vast lake park with a village museum of traditional Romanian architecture" },
    ],
  },
  {
    city: "Copenhagen", country: "Denmark", iata_code: "CPH",
    hook: "The world's happiest city — Noma's neighbourhood, harbour baths, and a hygge culture that makes you want to move in",
    fun_fact: "Copenhagen's Noma restaurant has been named the world's best restaurant multiple times, sparking the entire New Nordic cuisine movement",
    weather_summary: "Cool summers, cold winters; best June–August; famous for cycling infrastructure and long summer evenings",
    flight_cost_per_person_gbp: 42, hotel_cost_per_night_gbp: 108, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Nyhavn Harbour", description: "Candy-coloured 17th-century townhouses lining a canal thick with sailing ships" },
      { name: "Tivoli Gardens", description: "World's second-oldest amusement park — romantic, illuminated, and timeless" },
      { name: "The Little Mermaid & Kastellet", description: "Iconic bronze statue and star-shaped Renaissance fortress on the harbour" },
    ],
  },
  {
    city: "Eindhoven", country: "Netherlands", iata_code: "EIN",
    hook: "Europe's design capital — Philips's hometown reinvented as a playground of innovation, street art, and the world's best design week",
    fun_fact: "Eindhoven hosts Dutch Design Week every October — the largest design event in Northern Europe with over 350,000 visitors",
    weather_summary: "Mild Atlantic climate; four seasons; slightly warmer than Amsterdam; popular year-round for short breaks",
    flight_cost_per_person_gbp: 32, hotel_cost_per_night_gbp: 78, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Dutch Design Foundation", description: "Hub of the global design industry — exhibitions, talks, and installations year-round" },
      { name: "Strijp-S", description: "Vast former Philips factory complex turned into Eindhoven's most creative district" },
      { name: "Van Abbemuseum", description: "One of Europe's finest collections of modern and contemporary art" },
    ],
  },
  {
    city: "Cork", country: "Ireland", iata_code: "ORK",
    hook: "Ireland's food capital and rebel city — the English Market, the world's oldest jazz festival, and Kinsale around the corner",
    fun_fact: "Cork's English Market has been operating since 1788 and was visited by Queen Elizabeth II in 2011 — her first visit to the Republic of Ireland",
    weather_summary: "Mild and rainy year-round; slightly warmer than Dublin; beautiful in all seasons",
    flight_cost_per_person_gbp: 30, hotel_cost_per_night_gbp: 82, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "English Market", description: "18th-century indoor food market — artisan cheese, fresh fish, and tripe at 7am" },
      { name: "Blarney Castle", description: "Medieval castle with the famous Blarney Stone that confers the gift of eloquence" },
      { name: "Kinsale", description: "Gourmet capital of Ireland — colourful fishing port 30 minutes south of the city" },
    ],
  },
  {
    city: "Vienna", country: "Austria", iata_code: "VIE",
    hook: "The city of music, coffee houses, and a grandeur that makes other capitals feel like they're still trying",
    fun_fact: "Vienna has topped the Mercer Quality of Living Survey as the world's most liveable city for over a decade running",
    weather_summary: "Hot summers, cold winters with snow; spring and autumn are golden; Christmas markets are legendary",
    flight_cost_per_person_gbp: 52, hotel_cost_per_night_gbp: 88, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Schönbrunn Palace", description: "Habsburg summer palace with 1,441 rooms and formal gardens open to all" },
      { name: "Vienna State Opera", description: "One of the world's great opera houses — standing tickets available daily" },
      { name: "Naschmarkt", description: "Vienna's historic outdoor market — stalls of cheese, spice, and Viennese coffee culture" },
    ],
  },
  {
    city: "Tirana", country: "Albania", iata_code: "TIA",
    hook: "Europe's most surprising capital — pastel-painted buildings, a bunker turned art gallery, and prices that make you check the exchange rate twice",
    fun_fact: "Albania has more than 173,000 concrete bunkers built by communist dictator Enver Hoxha — one for every four people in the country",
    weather_summary: "Hot Mediterranean summers; mild winters; close to Adriatic beaches; pleasant spring and autumn",
    flight_cost_per_person_gbp: 58, hotel_cost_per_night_gbp: 42, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Bunk'Art Museum", description: "Cold War nuclear bunker converted into a museum of Albanian communist history" },
      { name: "Skanderbeg Square", description: "Vast central square — rebuilt in 2017 as a pedestrian cultural hub" },
      { name: "Blloku District", description: "Former communist elite neighbourhood, now Tirana's liveliest café and bar quarter" },
    ],
  },
  {
    city: "Cologne", country: "Germany", iata_code: "CGN",
    hook: "Gothic cathedral, Rhenish beer halls, and a carnival that transforms the city into Europe's most raucous street party",
    fun_fact: "Cologne's cathedral took 632 years to build — from 1248 to 1880 — and is the most visited landmark in Germany",
    weather_summary: "Mild four-season climate; cold winters; warm and lively summers; Cologne Carnival in February is unmissable",
    flight_cost_per_person_gbp: 35, hotel_cost_per_night_gbp: 78, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Cologne Cathedral", description: "Gothic masterpiece containing the Shrine of the Three Kings — 632 years in the building" },
      { name: "Cologne Carnival", description: "Three days in February when 1 million people in costumes take over the city" },
      { name: "Rhine Riverfront & Altstadt", description: "Colourful old town alongside the Rhine — Kölsch beer in every brewery tap room" },
    ],
  },
  {
    city: "Sofia", country: "Bulgaria", iata_code: "SOF",
    hook: "The Balkans' most dynamic capital — Soviet mosaics beside Orthodox gold domes, mountains 30 minutes away, and prices that feel like 2005",
    fun_fact: "Sofia is one of Europe's oldest cities with settlements dating back 8,000 years — older than Rome or Athens",
    weather_summary: "Hot summers, cold and occasionally snowy winters; Vitosha mountain provides year-round hiking from the city",
    flight_cost_per_person_gbp: 45, hotel_cost_per_night_gbp: 45, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Alexander Nevsky Cathedral", description: "One of the largest Eastern Orthodox cathedrals in the world — gilt domes and Byzantine interior" },
      { name: "National Palace of Culture", description: "Communist-era brutalist mega-structure at the heart of the city" },
      { name: "Vitosha Mountain", description: "National park rising to 2,290m on Sofia's doorstep — hiking, skiing, and city views" },
    ],
  },
  {
    city: "Marseille", country: "France", iata_code: "MRS",
    hook: "France's most underrated city — bouillabaisse in a port that's been feeding sailors for 2,600 years, wild calanques, and a raw electric energy",
    fun_fact: "Marseille is France's oldest city, founded by Greek sailors from Phocaea in 600 BC — older than Rome",
    weather_summary: "Mediterranean climate; hot sunny summers; mild winters; the mistral wind makes it feel even more alive",
    flight_cost_per_person_gbp: 52, hotel_cost_per_night_gbp: 78, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Vieux-Port", description: "The ancient harbour — fishing boats unloading at dawn, bouillabaisse by noon" },
      { name: "Les Calanques National Park", description: "White limestone fjords plunging into turquoise water — boat or hiking access" },
      { name: "MuCEM", description: "Museum of European and Mediterranean Civilisations — spectacular architecture on the harbour" },
    ],
  },
  {
    city: "Girona", country: "Spain", iata_code: "GRO",
    hook: "Game of Thrones' King's Landing in real life — a medieval old town that earns every comparison, one hour from Barcelona",
    fun_fact: "Girona's Jewish Quarter (El Call) is one of the best-preserved medieval Jewish quarters in Europe, untouched since the expulsion of 1492",
    weather_summary: "Hot Mediterranean summers; mild winters; perfect year-round; gateway to Pyrenees and Costa Brava",
    flight_cost_per_person_gbp: 42, hotel_cost_per_night_gbp: 68, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Girona Cathedral", description: "Romanesque-Gothic cathedral with the widest Gothic nave in the world" },
      { name: "El Call", description: "Medieval Jewish quarter — labyrinthine lanes, the Nahmanides Institute, and history in every stone" },
      { name: "City Walls Walk", description: "2km promenade along the medieval ramparts with views over terracotta rooftops" },
    ],
  },
  {
    city: "Hamburg", country: "Germany", iata_code: "HAM",
    hook: "Germany's coolest port city — the Elbphilharmonie, a harbour district that never really closed, and a nightlife that runs a close second only to Berlin",
    fun_fact: "Hamburg has more bridges than any other city in Europe — over 2,500, more than Amsterdam, London, and Venice combined",
    weather_summary: "Cool northern climate; warm and lively summers; cold winters; Reeperbahn buzzes year-round",
    flight_cost_per_person_gbp: 38, hotel_cost_per_night_gbp: 88, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Elbphilharmonie", description: "Herzog & de Meuron's concert hall rising from a 19th-century warehouse on the Elbe" },
      { name: "Speicherstadt", description: "UNESCO red-brick warehouse district — now galleries, museums, and design agencies" },
      { name: "Reeperbahn & St Pauli", description: "Hamburg's legendary red-light and entertainment quarter where The Beatles first performed" },
    ],
  },
  {
    city: "Turin", country: "Italy", iata_code: "TRN",
    hook: "Italy's most underrated city — Baroque piazzas, the Shroud, and a chocolate and vermouth culture that Milan quietly envies",
    fun_fact: "Turin was the first capital of unified Italy in 1861 and is home to the Holy Shroud — the most scientifically studied artefact in history",
    weather_summary: "Hot summers, cold snowy winters with the Alps visible from the city; beautiful in spring and autumn",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 72, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Egyptian Museum", description: "The world's second-largest collection of Egyptian antiquities, after Cairo" },
      { name: "Mole Antonelliana", description: "Turin's symbol — a 167m 19th-century spire housing the National Cinema Museum" },
      { name: "Piazza Castello", description: "Baroque heart of the city with the Royal Palace, opera house, and the Shroud Chapel" },
    ],
  },
  {
    city: "Bremen", country: "Germany", iata_code: "BRE",
    hook: "A Hanseatic fairy tale — the Brothers Grimm musicians in bronze, medieval guild houses, and a beer culture you'll struggle to leave behind",
    fun_fact: "Bremen is home to the Beck's brewery, which has been producing Germany's most internationally recognised beer since 1873",
    weather_summary: "Cool northern European climate; pleasant summers; cold winters; compact and walkable in all seasons",
    flight_cost_per_person_gbp: 42, hotel_cost_per_night_gbp: 72, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Böttcherstraße", description: "Expressionist red-brick lane of galleries, a glockenspiel, and craft workshops" },
      { name: "Market Square", description: "UNESCO Roland Statue and Town Hall — 600 years of Hanseatic power in stone" },
      { name: "Beck's Brewery", description: "Tour the brewery that made German beer internationally famous since 1873" },
    ],
  },
  {
    city: "Oslo", country: "Norway", iata_code: "OSL",
    hook: "The world's most outdoors-obsessed capital — ski jumps visible from the city, a fjord for swimming, and Viking ships that stop you in your tracks",
    fun_fact: "Oslo's opera house roof is designed to be walked on — locals ski, sunbathe, and commute across it as part of daily city life",
    weather_summary: "Cold snowy winters (skiing minutes away); beautiful long summer days; one of Europe's greenest capitals",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 112, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Viking Ship Museum", description: "Three 9th-century Viking ships recovered from burial mounds — breathtaking originals" },
      { name: "Vigeland Sculpture Park", description: "The world's largest sculpture park by a single artist — 200 figures in granite and bronze" },
      { name: "Holmenkollen Ski Jump", description: "Iconic ski jump above the city with a ski museum and panoramic Oslo views" },
    ],
  },
  {
    city: "Toulouse", country: "France", iata_code: "TLS",
    hook: "The Pink City — warm brick, Airbus factories, and a student energy that makes the whole city feel perpetually young",
    fun_fact: "Toulouse is the European capital of aerospace — Airbus assembles its A380s just outside the city at Blagnac",
    weather_summary: "Warm southern French climate; very hot summers; mild pleasant winters; gateway to the Pyrenees",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 72, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Cité de l'Espace", description: "Space science museum with an Ariane rocket and a replica of the Mir station" },
      { name: "Basilica of Saint-Sernin", description: "The largest Romanesque church in Europe and a UNESCO pilgrimage landmark" },
      { name: "Garonne Riverfront", description: "Pink-brick quaysides and the Pont Neuf — the city's heartbeat at sunset" },
    ],
  },
  {
    city: "Zagreb", country: "Croatia", iata_code: "ZAG",
    hook: "Croatia's overlooked capital — Habsburg elegance, a museum of broken relationships, and a café culture that ignores every deadline",
    fun_fact: "Zagreb's Museum of Broken Relationships, displaying donated objects from failed romances worldwide, won the Council of Europe Museum Prize",
    weather_summary: "Continental climate; hot summers, cold winters with snow; beautiful spring and autumn colours",
    flight_cost_per_person_gbp: 52, hotel_cost_per_night_gbp: 62, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Museum of Broken Relationships", description: "Quirky, moving museum of donated objects from failed romances around the world" },
      { name: "Gornji Grad (Upper Town)", description: "Medieval quarter of cobbled lanes, the cathedral, and the Lotrščak Tower" },
      { name: "Dolac Market", description: "Zagreb's daily outdoor market — the city's stomach and social heart" },
    ],
  },
  {
    city: "Luxembourg", country: "Luxembourg", iata_code: "LUX",
    hook: "A UNESCO capital wedged in gorges — the most dramatic city centre in Europe, multilingual locals, and a Michelin density that should be illegal",
    fun_fact: "Luxembourg City is one of only three cities declared a UNESCO World Heritage Site in its entirety, including its entire fortification system",
    weather_summary: "Mild four-season climate; cold winters; warm summers; small enough to explore fully in a weekend",
    flight_cost_per_person_gbp: 38, hotel_cost_per_night_gbp: 88, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Casemates du Bock", description: "23km of tunnels carved into the cliff — Cold War bunkers beneath a medieval fortress" },
      { name: "Grand Ducal Palace", description: "Renaissance palace in the city centre — the working residence of the Grand Duke" },
      { name: "Grund Quarter", description: "Village-in-a-city at the bottom of the gorge — restaurants, bars, and ancient bridges" },
    ],
  },
  {
    city: "Santiago de Compostela", country: "Spain", iata_code: "SCQ",
    hook: "The end of the road for 300,000 pilgrims a year — a baroque cathedral, an atmosphere of arrival, and a city that makes you want to walk there",
    fun_fact: "The Camino de Santiago is the world's most walked long-distance route, with over 300,000 pilgrims completing it every year",
    weather_summary: "Green and often rainy (it's Galicia); mild year-round; the arrival square is most electric in summer",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 68, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Cathedral of Santiago de Compostela", description: "The spiritual destination of the Camino — Romanesque towers and a vast baroque façade" },
      { name: "Praza do Obradoiro", description: "The arrival square where pilgrims complete their journey — one of Europe's finest plazas" },
      { name: "Mercado de Abastos", description: "Galicia's finest food market — percebes, octopus, and Galician cheese under granite arches" },
    ],
  },
  {
    city: "Chisinau", country: "Moldova", iata_code: "KIV",
    hook: "Europe's least-visited capital and one of its most surprising — Soviet architecture, extraordinary wine cellars, and warmth that feels entirely unperformed",
    fun_fact: "Cricova wine cellars outside Chisinau have 120km of underground galleries so vast that wine tourists drive through them in small electric cars",
    weather_summary: "Continental climate; very hot summers; cold winters; spring and autumn are pleasant; excellent year-round for wine tourism",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 38, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Cricova Wine Cellars", description: "120km of underground tunnels filled with millions of ageing bottles — drive-through wine tourism" },
      { name: "Central Market", description: "Vast Soviet-era market overflowing with local produce, pickles, and Moldovan cheeses" },
      { name: "Milestii Mici", description: "The world's largest wine collection by number of bottles — 2 million and counting" },
    ],
  },
  {
    city: "Verona", country: "Italy", iata_code: "VRN",
    hook: "Romeo and Juliet's city — a Roman amphitheatre still hosting opera, pink marble piazzas, and the most romantic balcony in the world",
    fun_fact: "Verona's Arena, built in the 1st century AD, seats 15,000 people and still hosts world-class opera productions every summer",
    weather_summary: "Hot Italian summers; cold winters; spring and autumn ideal for exploring on foot",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 75, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Verona Arena", description: "1st-century Roman amphitheatre — opera under the stars every summer since 1913" },
      { name: "Juliet's House", description: "Medieval courtyard with the famous bronze balcony — and 3 million love notes on the walls" },
      { name: "Piazza delle Erbe", description: "Verona's main square on the ancient Roman forum — markets, frescoed palaces, and cafés" },
    ],
  },
  {
    city: "Florence", country: "Italy", iata_code: "FLR",
    hook: "The birthplace of the Renaissance — Michelangelo's David, the Uffizi, and a gelato culture representing civilisation's peak achievement",
    fun_fact: "Florence's Uffizi Gallery is considered the world's first modern museum, opened to the public in 1769 by Grand Duke Peter Leopold",
    weather_summary: "Hot summers; mild winters; spring and autumn are golden for art and food without the crowds",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 85, default_duration_nights: 4,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Uffizi Gallery", description: "Botticelli, Leonardo, Michelangelo — the greatest collection of Renaissance art in the world" },
      { name: "Michelangelo's David", description: "The 5.17-metre marble original at the Accademia — reserve well in advance" },
      { name: "Ponte Vecchio & Oltrarno", description: "Medieval bridge of goldsmiths leading to Florence's most authentic neighbourhood" },
    ],
  },
  {
    city: "Helsinki", country: "Finland", iata_code: "HEL",
    hook: "The Nordic capital with no ego — design museums, a market hall on the harbour, and a sauna culture that is genuinely non-negotiable",
    fun_fact: "Finland has more saunas than cars — over 3 million for a population of 5.5 million, a ratio that surprises every visitor",
    weather_summary: "Cold winters with snow and Northern Lights; beautiful long summer days; best June–August or December for Christmas markets",
    flight_cost_per_person_gbp: 52, hotel_cost_per_night_gbp: 92, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Helsinki Market Hall", description: "19th-century market on the harbour — Finnish salmon, cloudberries, and reindeer" },
      { name: "Temppeliaukio Church", description: "A church blasted directly into the bedrock — natural light through a copper spiral roof" },
      { name: "Suomenlinna Sea Fortress", description: "UNESCO island fortress 15 minutes by ferry — museums, walks, and Helsinki views" },
    ],
  },
  {
    city: "Bratislava", country: "Slovakia", iata_code: "BTS",
    hook: "Europe's smallest major capital with the biggest personality — a compact old town, a castle above the Danube, and Vienna an hour away",
    fun_fact: "Bratislava is so close to Austria and Hungary that it is the only capital city in the world that borders two other sovereign states",
    weather_summary: "Continental climate; hot summers, cold winters; most pleasant in spring and autumn",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 55, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Bratislava Castle", description: "Square white castle on a hill above the Danube — views across three countries" },
      { name: "Old Town (Staré Mesto)", description: "Pastel baroque streets, Franciscan churches, and the best craft beer scene in Slovakia" },
      { name: "UFO Bridge Observation Deck", description: "Futuristic disc perched on a single pylon above the Danube — panoramic restaurant" },
    ],
  },
  {
    city: "Brno", country: "Czech Republic", iata_code: "BRQ",
    hook: "Prague without the crowds — Czechia's second city has Functionalist architecture, ancient catacombs, and a student energy that stays up later",
    fun_fact: "Brno's Capuchin Monastery crypt contains naturally mummified monks and aristocrats — open to visitors since the 18th century",
    weather_summary: "Continental climate; warm summers, cold winters; more affordable than Prague in every respect",
    flight_cost_per_person_gbp: 42, hotel_cost_per_night_gbp: 52, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Špilberk Castle", description: "Medieval fortress with Habsburg dungeons and panoramic views over Moravia" },
      { name: "Capuchin Monastery Crypt", description: "Naturally mummified monks in habits — macabre, unique, and strangely peaceful" },
      { name: "Vila Tugendhat", description: "UNESCO Functionalist masterpiece by Mies van der Rohe — minimalism at its most radical" },
    ],
  },
  {
    city: "Rotterdam", country: "Netherlands", iata_code: "RTM",
    hook: "Europe's most modern city — bombed flat in 1940 and rebuilt as an architecture manifesto, with the continent's busiest port and a food market like no other",
    fun_fact: "Rotterdam's Markthal, opened in 2014, is the Netherlands' first indoor market hall — the ceiling artwork covers 11,000 square metres",
    weather_summary: "Mild Atlantic climate; similar to Amsterdam but warmer; pleasant year-round; water-taxi culture is a year-round pleasure",
    flight_cost_per_person_gbp: 32, hotel_cost_per_night_gbp: 85, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Markthal", description: "Indoor food market beneath a horseshoe arch painted with the world's largest artwork" },
      { name: "Cube Houses", description: "Piet Blom's tilted yellow cubes — one of the most photographed buildings in Europe" },
      { name: "Erasmus Bridge", description: "Iconic cable-stayed bridge nicknamed 'The Swan' — the symbol of modern Rotterdam" },
    ],
  },
  {
    city: "Rabat", country: "Morocco", iata_code: "RBA",
    hook: "Morocco's overlooked capital — a UNESCO medina, a half-finished Hassan Tower, and none of the hard sell of Marrakech",
    fun_fact: "Rabat's medina, kasbah, and Hassan Tower are all UNESCO World Heritage Sites — making it Morocco's most officially recognised historic city",
    weather_summary: "Mild Atlantic climate; cooler than Marrakech; pleasant year-round; best spring and autumn",
    flight_cost_per_person_gbp: 68, hotel_cost_per_night_gbp: 52, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Hassan Tower & Mausoleum", description: "Unfinished 12th-century minaret beside Mohammed V's ornate royal mausoleum" },
      { name: "Udayas Kasbah", description: "12th-century fortified citadel with blue-and-white lanes above the Atlantic" },
      { name: "Chellah Necropolis", description: "Roman and Merenid ruins overgrown with storks' nests — hauntingly beautiful" },
    ],
  },
  {
    city: "Cluj-Napoca", country: "Romania", iata_code: "CLJ",
    hook: "Transylvania's capital and Romania's coolest city — a thriving tech scene, baroque squares, and a music festival that runs for seven days straight",
    fun_fact: "UNTOLD Festival in Cluj is one of Europe's fastest-growing music events, drawing over 350,000 attendees each year to Transylvania",
    weather_summary: "Continental climate; warm summers, cold winters; Transylvania is beautiful in autumn and spring",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 48, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Unirii Square", description: "Baroque heart of the city with the Gothic St Michael's Church and outdoor terraces" },
      { name: "UNTOLD Festival", description: "One of Europe's great electronic music festivals — held in August in Transylvania" },
      { name: "Bran Castle", description: "Dracula's Castle — Gothic hilltop fortress 2 hours away in the Carpathian Mountains" },
    ],
  },
  {
    city: "Zaragoza", country: "Spain", iata_code: "ZAZ",
    hook: "Spain's most underrated city — a riverside basilica, Mudéjar architecture at every turn, and pintxos that give San Sebastián competition",
    fun_fact: "Zaragoza's UNESCO Mudéjar architecture combines Islamic and Gothic styles in a way found nowhere else on earth",
    weather_summary: "Hot and dry in summer; cold and windy in winter; spring and autumn are perfect; more sunshine than Madrid",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 62, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Basilica del Pilar", description: "Baroque basilica on the Ebro riverbank — one of Spain's great pilgrimage churches" },
      { name: "Aljafería Palace", description: "11th-century Moorish palace — Andalusia-level Islamic architecture in Aragon" },
      { name: "Mudéjar Architecture Route", description: "UNESCO towers blending Gothic and Islamic styles, unique to Aragon" },
    ],
  },
  {
    city: "Sarajevo", country: "Bosnia and Herzegovina", iata_code: "SJJ",
    hook: "The city where World War I started — Ottoman bazaars, Austro-Hungarian cafés, and a resilience that will leave you genuinely humbled",
    fun_fact: "Sarajevo was under siege for 1,425 days from 1992–1995 — the longest siege of a capital city in the history of modern warfare",
    weather_summary: "Continental mountain climate; hot summers, cold snowy winters with ski mountains nearby; beautiful in all seasons",
    flight_cost_per_person_gbp: 65, hotel_cost_per_night_gbp: 48, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Latin Bridge", description: "Ottoman bridge where Archduke Franz Ferdinand was assassinated, triggering World War I" },
      { name: "Baščaršija Bazaar", description: "16th-century Ottoman quarter of copper workshops, kebab houses, and tea rooms" },
      { name: "Tunnel of Hope Museum", description: "The 800m tunnel used to supply the city during the 1990s siege" },
    ],
  },
  {
    city: "Plovdiv", country: "Bulgaria", iata_code: "PDV",
    hook: "Europe's oldest continuously inhabited city — Roman amphitheatres, colourful National Revival houses, and a creative scene that chose here to bloom",
    fun_fact: "Plovdiv was European Capital of Culture 2019 and is the oldest continuously inhabited city in Europe, settled since 4000 BC",
    weather_summary: "Hot dry summers; cold winters; most pleasant in spring and autumn; wine country surrounds the city",
    flight_cost_per_person_gbp: 50, hotel_cost_per_night_gbp: 42, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Roman Amphitheatre", description: "2nd-century theatre carved into a hillside — still hosting performances today" },
      { name: "Kapana Creative District", description: "Former artisan quarter revived with galleries, street art, and craft breweries" },
      { name: "Old Town (Trimontium)", description: "Colourful Bulgarian National Revival houses on three hills above the city" },
    ],
  },
  {
    city: "Fes", country: "Morocco", iata_code: "FEZ",
    hook: "The world's largest car-free medieval city — 9,000 lanes and a tannery that smells of the 11th century and looks like a living carpet",
    fun_fact: "The University of Al Quaraouiyine in Fes, founded in 859 AD, is recognised by UNESCO as the world's oldest continuously operating university",
    weather_summary: "Hot in summer; mild and pleasant in spring and autumn; cooler than Marrakech; best October–April",
    flight_cost_per_person_gbp: 68, hotel_cost_per_night_gbp: 48, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Chouara Tannery", description: "Medieval leather tannery unchanged since the 11th century — vivid dye vats and medieval smells" },
      { name: "Al-Attarine Madrasa", description: "14th-century Quranic school of breathtaking carved cedar and tilework" },
      { name: "Bab Bou Jeloud", description: "The Blue Gate — ornate Moorish gateway into the medina, tiled in blue and green" },
    ],
  },
  {
    city: "Zurich", country: "Switzerland", iata_code: "ZRH",
    hook: "Europe's most liveable city and surprisingly fun — a medieval old town by the lake, world-class art, and fondue that justifies the exchange rate",
    fun_fact: "Zurich consistently tops global quality-of-life rankings and pipes drinking water directly from the Alps through its tap system",
    weather_summary: "Warm summers, cold snowy winters; beautiful in all seasons; world-class skiing within 90 minutes",
    flight_cost_per_person_gbp: 55, hotel_cost_per_night_gbp: 145, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Kunsthaus Zürich", description: "Switzerland's most important art collection — Monet, Munch, Picasso, and Giacometti" },
      { name: "Altstadt (Old Town)", description: "Cobbled medieval streets on both sides of the Limmat — guild houses and church spires" },
      { name: "Lake Zurich", description: "Swimming from the quaysides in summer — a summer institution for locals" },
    ],
  },
  {
    city: "Munich", country: "Germany", iata_code: "MUC",
    hook: "Bavaria's finest export — a world-class art museum, a park bigger than Central Park, and beer garden culture as a legitimate civic institution",
    fun_fact: "Munich's English Garden is larger than Central Park in New York and has its own urban surfers — riding an artificial wave since the 1970s",
    weather_summary: "Hot summers (beer garden season); cold snowy winters; Oktoberfest in late September; beautiful year-round",
    flight_cost_per_person_gbp: 42, hotel_cost_per_night_gbp: 92, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "English Garden & Eisbach", description: "Urban park bigger than Central Park — surfers on an artificial river wave year-round" },
      { name: "Deutsches Museum", description: "The world's largest science and technology museum — you could spend three days here" },
      { name: "Marienplatz & Glockenspiel", description: "Munich's medieval heart — daily Glockenspiel performance and rooftop views" },
    ],
  },
  {
    city: "Amman", country: "Jordan", iata_code: "AMM",
    hook: "The gateway to Petra and Wadi Rum — a modern Arab capital built on seven hills with Roman columns in the city centre and extraordinary food",
    fun_fact: "Amman's Citadel has been inhabited for at least 8,500 years and the Temple of Hercules on the hill is one of the best-preserved Roman temples in the Middle East",
    weather_summary: "Very hot dry summers; mild pleasant winters; spring and autumn ideal for sightseeing; Petra accessible year-round",
    flight_cost_per_person_gbp: 90, hotel_cost_per_night_gbp: 65, default_duration_nights: 5,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }, { slug: "adventure", is_primary: false }],
    places: [
      { name: "Amman Citadel", description: "Hilltop complex of Roman, Byzantine, and Umayyad ruins overlooking the whole city" },
      { name: "Petra", description: "The rose-red Nabataean city carved from cliffsides — 2.5 hours south, unmissable" },
      { name: "Wadi Rum", description: "The Valley of the Moon — vast red desert landscape for jeep safaris and stargazing" },
    ],
  },
  {
    city: "Casablanca", country: "Morocco", iata_code: "CMN",
    hook: "Humphrey Bogart's city, Hassan II's mosque, and a French Art Deco quarter that doesn't know it's a gem — Morocco's economic engine is also its most surprising city",
    fun_fact: "The Hassan II Mosque in Casablanca has the world's tallest minaret at 210 metres and is partly built over the Atlantic Ocean",
    weather_summary: "Mild Atlantic climate; rarely extreme; good year-round; best spring and autumn; cooler than inland Morocco",
    flight_cost_per_person_gbp: 68, hotel_cost_per_night_gbp: 55, default_duration_nights: 3,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Hassan II Mosque", description: "The world's tallest minaret — a mosque built over the Atlantic with a glass floor" },
      { name: "Art Deco Quartier des Habous", description: "French colonial-era neighbourhood of Moroccan-Art Deco hybrid architecture" },
      { name: "Corniche Ain Diab", description: "Atlantic seafront promenade with beach clubs, cafés, and the city's social heart" },
    ],
  },

  // ── ADVENTURE (continued) ─────────────────────────────────────────────────

  {
    city: "Tel Aviv", country: "Israel", iata_code: "TLV",
    hook: "Non-stop city on the Mediterranean — beaches, Bauhaus architecture, and the world's best hummus at 2am",
    fun_fact: "Tel Aviv has the second largest concentration of Bauhaus (International Style) architecture in the world after Berlin",
    weather_summary: "Hot Mediterranean summers; warm and pleasant October to May",
    flight_cost_per_person_gbp: 75, hotel_cost_per_night_gbp: 95, default_duration_nights: 5,
    trip_types: [{ slug: "city_break", is_primary: true }, { slug: "adventure", is_primary: false }, { slug: "cultural", is_primary: false }],
    places: [
      { name: "Jaffa Old City", description: "Ancient port city with galleries, flea market, and sea views" },
      { name: "Carmel Market", description: "Bustling shuk with fresh produce, street food, and spices" },
      { name: "Jerusalem", description: "One of the world's most sacred cities, 1 hour by train" },
    ],
  },
];

// ---------------------------------------------------------------------------
// SEED LOGIC
// ---------------------------------------------------------------------------

async function run() {
  const client = await pool.connect();
  const counts = { tripTypes: 0, destinations: 0, associations: 0, places: 0 };

  try {
    await client.query("BEGIN");

    // ── 1. Upsert trip types ─────────────────────────────────────────────
    console.log("Seeding trip types…");
    const tripTypeIdBySlug = {};

    for (const tt of TRIP_TYPES) {
      const existing = await client.query(
        `SELECT id FROM ${SCHEMA}.trip_types WHERE slug = $1`,
        [tt.slug]
      );
      if (existing.rows.length) {
        await client.query(
          `UPDATE ${SCHEMA}.trip_types SET label = $1, is_active = true WHERE slug = $2`,
          [tt.label, tt.slug]
        );
        tripTypeIdBySlug[tt.slug] = existing.rows[0].id;
      } else {
        const ins = await client.query(
          `INSERT INTO ${SCHEMA}.trip_types (slug, label, is_active) VALUES ($1, $2, true) RETURNING id`,
          [tt.slug, tt.label]
        );
        tripTypeIdBySlug[tt.slug] = ins.rows[0].id;
        counts.tripTypes++;
      }
    }
    console.log(`  ✓ ${Object.keys(tripTypeIdBySlug).length} trip types ready (${counts.tripTypes} new)`);

    // ── 2. Upsert trip type similarity ───────────────────────────────────
    console.log("Seeding trip type similarity…");
    for (const pair of SIMILARITY_PAIRS) {
      const aId = tripTypeIdBySlug[pair.a];
      const bId = tripTypeIdBySlug[pair.b];
      if (!aId || !bId) continue;

      // Insert both directions so the fallback query finds matches either way
      for (const [from, to] of [[aId, bId], [bId, aId]]) {
        const ex = await client.query(
          `SELECT 1 FROM ${SCHEMA}.trip_type_similarity WHERE trip_type_id = $1 AND similar_to_id = $2`,
          [from, to]
        );
        if (ex.rows.length) {
          await client.query(
            `UPDATE ${SCHEMA}.trip_type_similarity SET similarity_score = $1 WHERE trip_type_id = $2 AND similar_to_id = $3`,
            [pair.score, from, to]
          );
        } else {
          await client.query(
            `INSERT INTO ${SCHEMA}.trip_type_similarity (trip_type_id, similar_to_id, similarity_score) VALUES ($1, $2, $3)`,
            [from, to, pair.score]
          );
        }
      }
    }
    console.log(`  ✓ ${SIMILARITY_PAIRS.length} similarity pairs seeded`);

    // ── 3. Upsert destinations ────────────────────────────────────────────
    console.log(`Seeding ${DESTINATIONS.length} destinations…`);

    for (const dest of DESTINATIONS) {
      // Find existing destination by (city, departure_airport_id)
      const existing = await client.query(
        `SELECT id FROM ${SCHEMA}.destinations WHERE city = $1 AND departure_airport_id = $2`,
        [dest.city, DEPARTURE_AIRPORT_ID]
      );

      let destId;
      if (existing.rows.length) {
        destId = existing.rows[0].id;
        await client.query(
          `UPDATE ${SCHEMA}.destinations SET
             country                    = $1,
             iata_code                  = $2,
             hook                       = $3,
             fun_fact                   = $4,
             weather_summary            = $5,
             flight_cost_per_person_gbp = $6,
             hotel_cost_per_night_gbp   = $7,
             default_duration_nights    = $8,
             is_active                  = true
           WHERE id = $9`,
          [
            dest.country, dest.iata_code, dest.hook, dest.fun_fact,
            dest.weather_summary, dest.flight_cost_per_person_gbp,
            dest.hotel_cost_per_night_gbp, dest.default_duration_nights,
            destId,
          ]
        );
      } else {
        const ins = await client.query(
          `INSERT INTO ${SCHEMA}.destinations
             (city, country, iata_code, departure_airport_id, hook, fun_fact,
              weather_summary, flight_cost_per_person_gbp, hotel_cost_per_night_gbp,
              default_duration_nights, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
           RETURNING id`,
          [
            dest.city, dest.country, dest.iata_code, DEPARTURE_AIRPORT_ID,
            dest.hook, dest.fun_fact, dest.weather_summary,
            dest.flight_cost_per_person_gbp, dest.hotel_cost_per_night_gbp,
            dest.default_duration_nights,
          ]
        );
        destId = ins.rows[0].id;
        counts.destinations++;
      }

      // ── 3a. Replace trip type associations ──────────────────────────────
      await client.query(
        `DELETE FROM ${SCHEMA}.destination_trip_types WHERE destination_id = $1`,
        [destId]
      );
      for (const tt of dest.trip_types) {
        const ttId = tripTypeIdBySlug[tt.slug];
        if (!ttId) {
          console.warn(`    ⚠ Unknown trip type slug "${tt.slug}" for ${dest.city} — skipping`);
          continue;
        }
        await client.query(
          `INSERT INTO ${SCHEMA}.destination_trip_types (destination_id, trip_type_id, is_primary)
           VALUES ($1, $2, $3)`,
          [destId, ttId, tt.is_primary]
        );
        counts.associations++;
      }

      // ── 3b. Replace recommended places ──────────────────────────────────
      await client.query(
        `DELETE FROM ${SCHEMA}.recommended_places WHERE destination_id = $1`,
        [destId]
      );
      for (let i = 0; i < dest.places.length; i++) {
        const p = dest.places[i];
        await client.query(
          `INSERT INTO ${SCHEMA}.recommended_places (destination_id, name, description, sort_order)
           VALUES ($1, $2, $3, $4)`,
          [destId, p.name, p.description, i + 1]
        );
        counts.places++;
      }
    }

    await client.query("COMMIT");

    console.log("\n✅ Seed complete:");
    console.log(`   ${counts.destinations} new destinations inserted`);
    console.log(`   ${DESTINATIONS.length - counts.destinations} existing destinations updated`);
    console.log(`   ${counts.associations} trip type associations written`);
    console.log(`   ${counts.places} recommended places written`);
    console.log(`   ${counts.tripTypes} new trip types created`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n❌ Seed failed — all changes rolled back");
    console.error(err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();

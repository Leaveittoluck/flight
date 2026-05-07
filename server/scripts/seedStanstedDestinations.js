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
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "city_break", is_primary: false }],
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
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "city_break", is_primary: false }],
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
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }],
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
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "adventure", is_primary: false }],
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
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }],
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
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "cultural", is_primary: false }],
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
    trip_types: [{ slug: "beach", is_primary: true }, { slug: "relaxation", is_primary: false }],
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
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "beach", is_primary: false }, { slug: "city_break", is_primary: false }],
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
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "beach", is_primary: false }],
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
    trip_types: [{ slug: "cultural", is_primary: true }, { slug: "adventure", is_primary: false }],
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
    trip_types: [{ slug: "skiing", is_primary: true }, { slug: "cultural", is_primary: false }],
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

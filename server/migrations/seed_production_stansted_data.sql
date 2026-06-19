-- =============================================================================
-- LITL — Production seed data (Stansted destinations)
-- Mechanically generated from server/scripts/seedStanstedDestinations.js
-- Do NOT hand-edit — regenerate from the source file if destination data changes.
--
-- Column set verified against server/migrations/production_full_migration.sql,
-- which matches the real production schema (flight.departure_airports, and
-- flight.destinations with NO created_at/updated_at columns). Local dev Postgres
-- has since diverged (extra columns/tables) and is NOT used as the source of
-- truth here.
--
-- Idempotent: safe to run multiple times.
--   trip_types             -> INSERT ... ON CONFLICT (slug)              [UNIQUE column constraint]
--   trip_type_similarity    -> INSERT ... ON CONFLICT (trip_type_id, similar_to_id) [composite PRIMARY KEY]
--   destinations            -> UPDATE-if-exists, then INSERT-if-still-missing
--                              (no ON CONFLICT — no unique constraint on
--                              (city, departure_airport_id) is assumed to exist)
--   destination_trip_types  -> DELETE-then-INSERT per destination (full replace)
--   recommended_places      -> DELETE-then-INSERT per destination (full replace)
--
-- Assumes flight.departure_airports row id=1 (London Stansted) already exists.
-- =============================================================================

BEGIN;

-- ── 1. Trip types ──────────────────────────────────────────────────────────
INSERT INTO flight.trip_types (slug, label, is_active) VALUES ('beach', 'Beach & Sun', true) ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, is_active = true;
INSERT INTO flight.trip_types (slug, label, is_active) VALUES ('city_break', 'City Break', true) ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, is_active = true;
INSERT INTO flight.trip_types (slug, label, is_active) VALUES ('adventure', 'Adventure', true) ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, is_active = true;
INSERT INTO flight.trip_types (slug, label, is_active) VALUES ('cultural', 'Cultural', true) ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, is_active = true;
INSERT INTO flight.trip_types (slug, label, is_active) VALUES ('skiing', 'Skiing', true) ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, is_active = true;
INSERT INTO flight.trip_types (slug, label, is_active) VALUES ('relaxation', 'Relaxation', true) ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, is_active = true;

-- ── 2. Trip type similarity (both directions) ─────────────────────────────
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 9 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'city_break' AND b.slug = 'cultural'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 9 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'cultural' AND b.slug = 'city_break'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 8 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'beach' AND b.slug = 'relaxation'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 8 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'relaxation' AND b.slug = 'beach'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 7 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'skiing' AND b.slug = 'adventure'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 7 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'adventure' AND b.slug = 'skiing'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 6 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'beach' AND b.slug = 'adventure'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 6 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'adventure' AND b.slug = 'beach'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 6 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'city_break' AND b.slug = 'adventure'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 6 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'adventure' AND b.slug = 'city_break'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 6 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'cultural' AND b.slug = 'relaxation'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;
INSERT INTO flight.trip_type_similarity (trip_type_id, similar_to_id, similarity_score)
  SELECT a.id, b.id, 6 FROM flight.trip_types a, flight.trip_types b
  WHERE a.slug = 'relaxation' AND b.slug = 'cultural'
  ON CONFLICT (trip_type_id, similar_to_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score;

-- ── 3. Destinations + trip type links + recommended places ───────────────
UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'ALC', hook = 'Golden beaches, year-round sun, and tapas that taste better by the sea',
    fun_fact = 'Santa Bárbara Castle has guarded Alicante from its hilltop for over 1,000 years', weather_summary = '300 days of sunshine; 25°C+ from June to October',
    flight_cost_per_person_gbp = 42,
    hotel_cost_per_night_gbp = 65,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Alicante' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Alicante', 'Spain', 'ALC', 1, 'Golden beaches, year-round sun, and tapas that taste better by the sea', 'Santa Bárbara Castle has guarded Alicante from its hilltop for over 1,000 years',
    '300 days of sunshine; 25°C+ from June to October', 42, 65,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Alicante' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Alicante' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Alicante' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Alicante' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Alicante' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Postiguet Beach', 'City beach with clear water right in the centre', 1 FROM flight.destinations
  WHERE city = 'Alicante' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Santa Bárbara Castle', 'Hilltop fortress with sweeping coastal views', 2 FROM flight.destinations
  WHERE city = 'Alicante' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'El Barrio Quarter', 'Narrow old-town lanes packed with tapas bars', 3 FROM flight.destinations
  WHERE city = 'Alicante' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'AGP', hook = 'Picasso''s birthplace — art, Moorish history, and the Costa del Sol right on the doorstep',
    fun_fact = 'Malaga is one of the oldest cities in the world, founded by the Phoenicians around 770 BC', weather_summary = 'Mild winters, blazing summers; beach weather from April to November',
    flight_cost_per_person_gbp = 44,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Malaga' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Malaga', 'Spain', 'AGP', 1, 'Picasso''s birthplace — art, Moorish history, and the Costa del Sol right on the doorstep', 'Malaga is one of the oldest cities in the world, founded by the Phoenicians around 770 BC',
    'Mild winters, blazing summers; beach weather from April to November', 44, 72,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Malaga' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Malaga' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Malaga' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Malaga' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Malaga' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Malaga' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Alcazaba', 'Moorish fortress with stunning city and sea views', 1 FROM flight.destinations
  WHERE city = 'Malaga' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Malagueta Beach', 'Central sandy beach with excellent chiringuitos', 2 FROM flight.destinations
  WHERE city = 'Malaga' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Picasso Museum', 'Dedicated to the city''s most famous son', 3 FROM flight.destinations
  WHERE city = 'Malaga' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'PMI', hook = 'Medieval cathedral, turquoise coves, and a foodie scene that punches above its weight',
    fun_fact = 'Mallorca produces roughly 2.5 million litres of olive oil per year', weather_summary = 'Hot dry summers, pleasant springs and autumns; ideal April–October',
    flight_cost_per_person_gbp = 48,
    hotel_cost_per_night_gbp = 80,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Palma' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Palma', 'Spain', 'PMI', 1, 'Medieval cathedral, turquoise coves, and a foodie scene that punches above its weight', 'Mallorca produces roughly 2.5 million litres of olive oil per year',
    'Hot dry summers, pleasant springs and autumns; ideal April–October', 48, 80,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Palma' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Palma' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Palma' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Palma' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Palma' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Palma' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Palma' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'La Seu Cathedral', 'Gothic masterpiece rising above the harbour', 1 FROM flight.destinations
  WHERE city = 'Palma' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Caló des Moro', 'Postcard-perfect cove with crystal-clear water', 2 FROM flight.destinations
  WHERE city = 'Palma' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Old Town Palma', 'Cafés, boutiques, and courtyard patios', 3 FROM flight.destinations
  WHERE city = 'Palma' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'IBZ', hook = 'More than just clubs — hidden coves, hippy markets, and Dalt Vila by sunset',
    fun_fact = 'Ibiza''s Dalt Vila (old city) is a UNESCO World Heritage Site', weather_summary = 'Hot and sunny May–October; quieter and cheaper in shoulder season',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 90,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Ibiza' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Ibiza', 'Spain', 'IBZ', 1, 'More than just clubs — hidden coves, hippy markets, and Dalt Vila by sunset', 'Ibiza''s Dalt Vila (old city) is a UNESCO World Heritage Site',
    'Hot and sunny May–October; quieter and cheaper in shoulder season', 50, 90,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Ibiza' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Ibiza' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Ibiza' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Ibiza' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Ibiza' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Dalt Vila', 'Walled hilltop old town with panoramic views', 1 FROM flight.destinations
  WHERE city = 'Ibiza' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cala Conta', 'Stunning west-facing beach famous for sunsets', 2 FROM flight.destinations
  WHERE city = 'Ibiza' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Las Dalias Hippy Market', 'Colourful open-air market every Saturday', 3 FROM flight.destinations
  WHERE city = 'Ibiza' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Portugal', iata_code = 'FAO', hook = 'Gateway to the Algarve — dramatic cliffs, sea caves, and 300km of Atlantic coastline',
    fun_fact = 'The Algarve''s golden cliffs are made of soft sandstone sculpted by the Atlantic over millions of years', weather_summary = 'Warm and sunny year-round; peak beach season June–September',
    flight_cost_per_person_gbp = 46,
    hotel_cost_per_night_gbp = 68,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Faro' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Faro', 'Portugal', 'FAO', 1, 'Gateway to the Algarve — dramatic cliffs, sea caves, and 300km of Atlantic coastline', 'The Algarve''s golden cliffs are made of soft sandstone sculpted by the Atlantic over millions of years',
    'Warm and sunny year-round; peak beach season June–September', 46, 68,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Faro' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Faro' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Faro' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Faro' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Faro' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Faro' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Praia da Marinha', 'One of Portugal''s most photographed clifftop beaches', 1 FROM flight.destinations
  WHERE city = 'Faro' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ria Formosa Natural Park', 'Lagoon system with birdlife and quiet barrier islands', 2 FROM flight.destinations
  WHERE city = 'Faro' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Faro Old Town', 'Walled historic centre with a Roman-era arch', 3 FROM flight.destinations
  WHERE city = 'Faro' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'ACE', hook = 'Volcanic landscapes unlike anywhere in Europe — black beaches, lava caves, and César Manrique''s art',
    fun_fact = 'Lanzarote has over 300 volcanic cones and last erupted as recently as 1824', weather_summary = 'Year-round mild temperatures; rarely below 17°C even in winter',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 75,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Lanzarote' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Lanzarote', 'Spain', 'ACE', 1, 'Volcanic landscapes unlike anywhere in Europe — black beaches, lava caves, and César Manrique''s art', 'Lanzarote has over 300 volcanic cones and last erupted as recently as 1824',
    'Year-round mild temperatures; rarely below 17°C even in winter', 65, 75,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Lanzarote' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Lanzarote' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Lanzarote' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Lanzarote' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Lanzarote' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Lanzarote' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Timanfaya National Park', 'Otherworldly volcanic landscape, geothermal demonstrations', 1 FROM flight.destinations
  WHERE city = 'Lanzarote' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Playa Papagayo', 'Secluded golden-sand beach in a protected bay', 2 FROM flight.destinations
  WHERE city = 'Lanzarote' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Jameos del Agua', 'Lava tube cave with a concert hall and unique albino crabs', 3 FROM flight.destinations
  WHERE city = 'Lanzarote' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'FUE', hook = 'Europe''s windsurf capital — endless white-sand dunes and the clearest Atlantic waters',
    fun_fact = 'Fuerteventura is the second largest and oldest of the Canary Islands', weather_summary = 'Warm and windy year-round; the best climate in Europe for winter sun',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Fuerteventura' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Fuerteventura', 'Spain', 'FUE', 1, 'Europe''s windsurf capital — endless white-sand dunes and the clearest Atlantic waters', 'Fuerteventura is the second largest and oldest of the Canary Islands',
    'Warm and windy year-round; the best climate in Europe for winter sun', 65, 72,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Fuerteventura' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Fuerteventura' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Fuerteventura' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Fuerteventura' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Fuerteventura' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Corralejo Dunes Natural Park', 'Vast white dunes stretching to turquoise lagoons', 1 FROM flight.destinations
  WHERE city = 'Fuerteventura' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Sotavento Beach', 'World-class kite and windsurf beach', 2 FROM flight.destinations
  WHERE city = 'Fuerteventura' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Betancuria', 'Charming former capital in a lush mountain valley', 3 FROM flight.destinations
  WHERE city = 'Fuerteventura' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'LPA', hook = 'A continent in miniature — sand dunes, pine forests, and a year-round carnival vibe',
    fun_fact = 'Gran Canaria has 236km of coastline and more than 50 beaches', weather_summary = 'Eternal spring; average temperature of 21°C throughout the year',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Gran Canaria' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Gran Canaria', 'Spain', 'LPA', 1, 'A continent in miniature — sand dunes, pine forests, and a year-round carnival vibe', 'Gran Canaria has 236km of coastline and more than 50 beaches',
    'Eternal spring; average temperature of 21°C throughout the year', 65, 72,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Gran Canaria' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Gran Canaria' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Gran Canaria' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Gran Canaria' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Gran Canaria' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Maspalomas Dunes', 'Sahara-like dunes meeting the Atlantic — a natural reserve', 1 FROM flight.destinations
  WHERE city = 'Gran Canaria' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Las Palmas Old Town', 'Columbus''s house, art museums, and a city beach', 2 FROM flight.destinations
  WHERE city = 'Gran Canaria' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Roque Nublo', 'Volcanic monolith with views across the whole island', 3 FROM flight.destinations
  WHERE city = 'Gran Canaria' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'TFS', hook = 'Spain''s highest peak, whale watching, and beaches that range from black sand to golden',
    fun_fact = 'Mount Teide is Spain''s highest peak and the world''s third tallest volcanic structure', weather_summary = 'Warm and sunny all year; south of the island stays drier',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 74,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Tenerife' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Tenerife', 'Spain', 'TFS', 1, 'Spain''s highest peak, whale watching, and beaches that range from black sand to golden', 'Mount Teide is Spain''s highest peak and the world''s third tallest volcanic structure',
    'Warm and sunny all year; south of the island stays drier', 65, 74,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Tenerife' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Tenerife' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tenerife' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tenerife' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tenerife' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Tenerife' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Teide National Park', 'UNESCO volcano park with cable car and lunar scenery', 1 FROM flight.destinations
  WHERE city = 'Tenerife' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Playa de las Teresitas', 'Golden Saharan sand beach north of Santa Cruz', 2 FROM flight.destinations
  WHERE city = 'Tenerife' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Siam Park', 'Consistently rated Europe''s best water park', 3 FROM flight.destinations
  WHERE city = 'Tenerife' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'CFU', hook = 'Venetian fortresses, lush olive groves, and Ionian waters in every shade of blue',
    fun_fact = 'Corfu Old Town was built by the Venetians and is the only fortress city in Greece', weather_summary = 'Hot summers, mild winters; best from May to October',
    flight_cost_per_person_gbp = 58,
    hotel_cost_per_night_gbp = 75,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Corfu' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Corfu', 'Greece', 'CFU', 1, 'Venetian fortresses, lush olive groves, and Ionian waters in every shade of blue', 'Corfu Old Town was built by the Venetians and is the only fortress city in Greece',
    'Hot summers, mild winters; best from May to October', 58, 75,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Corfu' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Corfu' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Corfu' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Corfu' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Corfu' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Paleokastritsa', 'Stunning bay with turquoise water and clifftop monastery', 1 FROM flight.destinations
  WHERE city = 'Corfu' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Corfu Old Town', 'UNESCO-listed Venetian architecture and lively esplanade', 2 FROM flight.destinations
  WHERE city = 'Corfu' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Canal d''Amour', 'Romantic sea channel carved through golden rock at Sidari', 3 FROM flight.destinations
  WHERE city = 'Corfu' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'RHO', hook = 'Crusader castles, medieval alleyways, and some of the most reliably sunny days in Europe',
    fun_fact = 'The medieval walled city of Rhodes has been inhabited continuously for over 2,400 years', weather_summary = 'One of Greece''s sunniest islands; beach season runs April to November',
    flight_cost_per_person_gbp = 62,
    hotel_cost_per_night_gbp = 78,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Rhodes' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Rhodes', 'Greece', 'RHO', 1, 'Crusader castles, medieval alleyways, and some of the most reliably sunny days in Europe', 'The medieval walled city of Rhodes has been inhabited continuously for over 2,400 years',
    'One of Greece''s sunniest islands; beach season runs April to November', 62, 78,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Rhodes' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Rhodes' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rhodes' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rhodes' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rhodes' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Rhodes' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Rhodes Old Town', 'UNESCO walled city with cobbled streets and a Knights'' Palace', 1 FROM flight.destinations
  WHERE city = 'Rhodes' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Lindos', 'Hilltop acropolis above a whitewashed village and azure bay', 2 FROM flight.destinations
  WHERE city = 'Rhodes' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Anthony Quinn Bay', 'Scenic cove named after the actor who fell in love with it', 3 FROM flight.destinations
  WHERE city = 'Rhodes' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'ZTH', hook = 'Home to the iconic Blue Caves, the shipwreck beach, and caretta sea turtles',
    fun_fact = 'The famous Navagio (Shipwreck) Beach is only accessible by boat and has no road access', weather_summary = 'Long hot summers; warm and sunny from late April through October',
    flight_cost_per_person_gbp = 60,
    hotel_cost_per_night_gbp = 70,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Zakynthos' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Zakynthos', 'Greece', 'ZTH', 1, 'Home to the iconic Blue Caves, the shipwreck beach, and caretta sea turtles', 'The famous Navagio (Shipwreck) Beach is only accessible by boat and has no road access',
    'Long hot summers; warm and sunny from late April through October', 60, 70,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Zakynthos' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Zakynthos' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zakynthos' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zakynthos' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zakynthos' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Zakynthos' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Navagio Beach', 'The most photographed beach in Greece — rusty shipwreck included', 1 FROM flight.destinations
  WHERE city = 'Zakynthos' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Blue Caves', 'Sea caves where sunlight turns the water an electric blue', 2 FROM flight.destinations
  WHERE city = 'Zakynthos' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Laganas Bay', 'Protected nesting beach for loggerhead sea turtles', 3 FROM flight.destinations
  WHERE city = 'Zakynthos' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'VLC', hook = 'Birthplace of paella, City of Arts and Sciences, and beaches a tram ride from the old town',
    fun_fact = 'Valencia invented paella — the authentic version uses rabbit and snails, not seafood', weather_summary = 'Over 300 sunny days a year; perfect beach weather May to October',
    flight_cost_per_person_gbp = 45,
    hotel_cost_per_night_gbp = 70,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Valencia' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Valencia', 'Spain', 'VLC', 1, 'Birthplace of paella, City of Arts and Sciences, and beaches a tram ride from the old town', 'Valencia invented paella — the authentic version uses rabbit and snails, not seafood',
    'Over 300 sunny days a year; perfect beach weather May to October', 45, 70,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Valencia' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Valencia' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Valencia' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Valencia' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Valencia' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'City of Arts and Sciences', 'Futuristic Calatrava complex with science museum and aquarium', 1 FROM flight.destinations
  WHERE city = 'Valencia' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Malvarrosa Beach', 'Long city beach with great seafood restaurants', 2 FROM flight.destinations
  WHERE city = 'Valencia' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Central Market', 'Europe''s largest covered fresh food market', 3 FROM flight.destinations
  WHERE city = 'Valencia' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'SVQ', hook = 'Flamenco, the Alcázar, and tapas hopping through streets that smell of orange blossom',
    fun_fact = 'Seville''s Alcázar is the oldest royal palace still in use in Europe', weather_summary = 'Europe''s hottest city in summer; spring and autumn are ideal for exploring',
    flight_cost_per_person_gbp = 46,
    hotel_cost_per_night_gbp = 78,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Seville' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Seville', 'Spain', 'SVQ', 1, 'Flamenco, the Alcázar, and tapas hopping through streets that smell of orange blossom', 'Seville''s Alcázar is the oldest royal palace still in use in Europe',
    'Europe''s hottest city in summer; spring and autumn are ideal for exploring', 46, 78,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Seville' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Seville' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Seville' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Seville' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Seville' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Real Alcázar', 'Stunning Moorish palace complex still used by the Spanish royal family', 1 FROM flight.destinations
  WHERE city = 'Seville' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Seville Cathedral', 'The world''s largest Gothic cathedral with Columbus''s tomb', 2 FROM flight.destinations
  WHERE city = 'Seville' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Triana District', 'Flamenco bars, ceramic tiles, and the city''s best tapas', 3 FROM flight.destinations
  WHERE city = 'Seville' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Ireland', iata_code = 'DUB', hook = 'Literary pubs, Georgian squares, and craic that genuinely lives up to its reputation',
    fun_fact = 'Dublin has more bookshops per capita than any other city in the world', weather_summary = 'Mild year-round with frequent showers; layers always a good idea',
    flight_cost_per_person_gbp = 28,
    hotel_cost_per_night_gbp = 95,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Dublin' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Dublin', 'Ireland', 'DUB', 1, 'Literary pubs, Georgian squares, and craic that genuinely lives up to its reputation', 'Dublin has more bookshops per capita than any other city in the world',
    'Mild year-round with frequent showers; layers always a good idea', 28, 95,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Dublin' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Dublin' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Dublin' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Dublin' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Dublin' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Temple Bar', 'Cobbled cultural quarter with live music in every pub', 1 FROM flight.destinations
  WHERE city = 'Dublin' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Trinity College', 'Home to the Book of Kells and a beautiful Long Room library', 2 FROM flight.destinations
  WHERE city = 'Dublin' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Guinness Storehouse', 'Seven floors of brewing history with a 360° rooftop bar', 3 FROM flight.destinations
  WHERE city = 'Dublin' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Netherlands', iata_code = 'AMS', hook = 'Canals, Rembrandts, cycling culture, and a tolerance for joy in all its forms',
    fun_fact = 'Amsterdam has more bicycles than residents — roughly 900,000 bikes in the city', weather_summary = 'Warm summers, cold winters; spring tulip season is spectacular',
    flight_cost_per_person_gbp = 32,
    hotel_cost_per_night_gbp = 105,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Amsterdam' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Amsterdam', 'Netherlands', 'AMS', 1, 'Canals, Rembrandts, cycling culture, and a tolerance for joy in all its forms', 'Amsterdam has more bicycles than residents — roughly 900,000 bikes in the city',
    'Warm summers, cold winters; spring tulip season is spectacular', 32, 105,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Amsterdam' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Amsterdam' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Amsterdam' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Amsterdam' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Amsterdam' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Rijksmuseum', 'Dutch masters — Rembrandt''s Night Watch and Vermeer''s Milkmaid', 1 FROM flight.destinations
  WHERE city = 'Amsterdam' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Anne Frank House', 'The hidden annex where Anne Frank wrote her diary', 2 FROM flight.destinations
  WHERE city = 'Amsterdam' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Jordaan District', 'Narrow canal streets with independent cafés and galleries', 3 FROM flight.destinations
  WHERE city = 'Amsterdam' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'France', iata_code = 'BVA', hook = 'Every cliché about Paris is true — and it''s still not enough to prepare you',
    fun_fact = 'Paris has only one stop sign in the entire city', weather_summary = 'Four distinct seasons; spring and autumn are the most romantic',
    flight_cost_per_person_gbp = 30,
    hotel_cost_per_night_gbp = 115,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Paris' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Paris', 'France', 'BVA', 1, 'Every cliché about Paris is true — and it''s still not enough to prepare you', 'Paris has only one stop sign in the entire city',
    'Four distinct seasons; spring and autumn are the most romantic', 30, 115,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Paris' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Paris' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Paris' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Paris' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Paris' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'The Louvre', 'The world''s most visited museum, home to the Mona Lisa', 1 FROM flight.destinations
  WHERE city = 'Paris' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Montmartre', 'Hilltop artists'' quarter with the Sacré-Cœur and local bistros', 2 FROM flight.destinations
  WHERE city = 'Paris' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Le Marais', 'Trendy district with galleries, falafel, and the Place des Vosges', 3 FROM flight.destinations
  WHERE city = 'Paris' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Belgium', iata_code = 'CRL', hook = 'The beating heart of Europe — Art Nouveau architecture, world-class beer, and the best chips you''ll ever eat',
    fun_fact = 'Belgium has over 1,500 different types of beer, more varieties per capita than any country', weather_summary = 'Mild and often rainy; indoor culture (beer halls, museums) is year-round',
    flight_cost_per_person_gbp = 30,
    hotel_cost_per_night_gbp = 85,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Brussels' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Brussels', 'Belgium', 'CRL', 1, 'The beating heart of Europe — Art Nouveau architecture, world-class beer, and the best chips you''ll ever eat', 'Belgium has over 1,500 different types of beer, more varieties per capita than any country',
    'Mild and often rainy; indoor culture (beer halls, museums) is year-round', 30, 85,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Brussels' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Brussels' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Brussels' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Brussels' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Brussels' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Grand-Place', 'UNESCO-listed square surrounded by gilded guild houses', 1 FROM flight.destinations
  WHERE city = 'Brussels' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cantillon Brewery', 'Living museum of lambic beer production since 1900', 2 FROM flight.destinations
  WHERE city = 'Brussels' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Magritte Museum', 'World''s largest collection of the surrealist master''s work', 3 FROM flight.destinations
  WHERE city = 'Brussels' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'BCN', hook = 'Gaudí''s surreal architecture, a beach within walking distance of the Gothic Quarter, and the best food market in Europe',
    fun_fact = 'The Sagrada Família has been under construction since 1882 and is still not finished', weather_summary = 'Hot Mediterranean summers; mild and pleasant year-round',
    flight_cost_per_person_gbp = 42,
    hotel_cost_per_night_gbp = 98,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Barcelona' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Barcelona', 'Spain', 'BCN', 1, 'Gaudí''s surreal architecture, a beach within walking distance of the Gothic Quarter, and the best food market in Europe', 'The Sagrada Família has been under construction since 1882 and is still not finished',
    'Hot Mediterranean summers; mild and pleasant year-round', 42, 98,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Barcelona' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Barcelona' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Barcelona' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Barcelona' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Barcelona' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Barcelona' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Sagrada Família', 'Gaudí''s unfinished masterpiece — book tickets well in advance', 1 FROM flight.destinations
  WHERE city = 'Barcelona' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'La Boqueria Market', 'Vibrant food market off La Rambla with fresh produce and tapas', 2 FROM flight.destinations
  WHERE city = 'Barcelona' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Park Güell', 'Mosaic terraces and Hansel-and-Gretel gatehouses above the city', 3 FROM flight.destinations
  WHERE city = 'Barcelona' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'MAD', hook = 'World-class art, a tapas scene that goes until 3am, and the Prado — one of the planet''s great museums',
    fun_fact = 'Madrid is the highest capital city in the European Union, sitting at 667m above sea level', weather_summary = 'Hot dry summers, cool winters; spring and autumn are ideal',
    flight_cost_per_person_gbp = 42,
    hotel_cost_per_night_gbp = 85,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Madrid' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Madrid', 'Spain', 'MAD', 1, 'World-class art, a tapas scene that goes until 3am, and the Prado — one of the planet''s great museums', 'Madrid is the highest capital city in the European Union, sitting at 667m above sea level',
    'Hot dry summers, cool winters; spring and autumn are ideal', 42, 85,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Madrid' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Madrid' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Madrid' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Madrid' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Madrid' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Prado Museum', 'Velázquez, Goya, El Greco — one of the world''s finest collections', 1 FROM flight.destinations
  WHERE city = 'Madrid' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Retiro Park', 'Beautiful city park with a crystal palace and rowing lake', 2 FROM flight.destinations
  WHERE city = 'Madrid' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Malasaña', 'Bohemian neighbourhood with indie bars and vintage shops', 3 FROM flight.destinations
  WHERE city = 'Madrid' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Portugal', iata_code = 'LIS', hook = 'Trams rattling through tilework-covered hills, fado drifting from open doors, and the best custard tarts on earth',
    fun_fact = 'Lisbon is one of the oldest cities in the world, predating Rome by centuries', weather_summary = 'Europe''s sunniest capital; warm and pleasant most of the year',
    flight_cost_per_person_gbp = 46,
    hotel_cost_per_night_gbp = 78,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Lisbon' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Lisbon', 'Portugal', 'LIS', 1, 'Trams rattling through tilework-covered hills, fado drifting from open doors, and the best custard tarts on earth', 'Lisbon is one of the oldest cities in the world, predating Rome by centuries',
    'Europe''s sunniest capital; warm and pleasant most of the year', 46, 78,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Lisbon' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Lisbon' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Lisbon' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Lisbon' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Lisbon' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Alfama District', 'Moorish quarter of winding streets and fado houses', 1 FROM flight.destinations
  WHERE city = 'Lisbon' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Belém Tower', '16th-century riverside fortification and UNESCO landmark', 2 FROM flight.destinations
  WHERE city = 'Lisbon' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Time Out Market', 'Iconic food hall showcasing Lisbon''s best chefs', 3 FROM flight.destinations
  WHERE city = 'Lisbon' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Portugal', iata_code = 'OPO', hook = 'Port wine cellars, azulejo-tiled churches, and a river city that Lonely Planet voted best in Europe',
    fun_fact = 'Port wine can only be produced in Portugal''s Douro Valley and aged in Porto''s Vila Nova de Gaia', weather_summary = 'Mild Atlantic climate; warm summers, rainy winters, and beautiful springs',
    flight_cost_per_person_gbp = 44,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Porto' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Porto', 'Portugal', 'OPO', 1, 'Port wine cellars, azulejo-tiled churches, and a river city that Lonely Planet voted best in Europe', 'Port wine can only be produced in Portugal''s Douro Valley and aged in Porto''s Vila Nova de Gaia',
    'Mild Atlantic climate; warm summers, rainy winters, and beautiful springs', 44, 72,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Porto' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Porto' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Porto' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Porto' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Porto' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ribeira Waterfront', 'UNESCO riverside district of colourful houses and wine bars', 1 FROM flight.destinations
  WHERE city = 'Porto' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Livraria Lello', 'Possibly the world''s most beautiful bookshop', 2 FROM flight.destinations
  WHERE city = 'Porto' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Vila Nova de Gaia', 'Port wine lodge tours with tastings above the Douro', 3 FROM flight.destinations
  WHERE city = 'Porto' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'CIA', hook = 'Two thousand years of history in one city — and you still can''t get a bad meal',
    fun_fact = 'Rome has more fountains than any other city in the world — over 2,000', weather_summary = 'Hot summers, mild winters; spring and autumn are the golden times to visit',
    flight_cost_per_person_gbp = 46,
    hotel_cost_per_night_gbp = 82,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Rome' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Rome', 'Italy', 'CIA', 1, 'Two thousand years of history in one city — and you still can''t get a bad meal', 'Rome has more fountains than any other city in the world — over 2,000',
    'Hot summers, mild winters; spring and autumn are the golden times to visit', 46, 82,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Rome' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Rome' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rome' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rome' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Rome' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Colosseum', 'Ancient amphitheatre that once held 80,000 spectators', 1 FROM flight.destinations
  WHERE city = 'Rome' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Vatican Museums', 'Sistine Chapel, St Peter''s Basilica, and 7km of galleries', 2 FROM flight.destinations
  WHERE city = 'Rome' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Trastevere', 'Cobblestone neighbourhood with ivy-covered restaurants', 3 FROM flight.destinations
  WHERE city = 'Rome' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'BGY', hook = 'Fashion capital, da Vinci''s Last Supper, and a Spritz culture that begins at noon',
    fun_fact = 'Milan''s Galleria Vittorio Emanuele II is the world''s oldest shopping mall, opened in 1877', weather_summary = 'Hot summers, cold foggy winters; spring and autumn are most enjoyable',
    flight_cost_per_person_gbp = 44,
    hotel_cost_per_night_gbp = 88,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Milan' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Milan', 'Italy', 'BGY', 1, 'Fashion capital, da Vinci''s Last Supper, and a Spritz culture that begins at noon', 'Milan''s Galleria Vittorio Emanuele II is the world''s oldest shopping mall, opened in 1877',
    'Hot summers, cold foggy winters; spring and autumn are most enjoyable', 44, 88,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Milan' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Milan' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Milan' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Milan' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Milan' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'The Last Supper', 'Da Vinci''s mural — entry is strictly timed, book months ahead', 1 FROM flight.destinations
  WHERE city = 'Milan' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Duomo di Milano', 'Gothic cathedral with a rooftop terrace above the city', 2 FROM flight.destinations
  WHERE city = 'Milan' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Brera District', 'Arty neighbourhood with galleries, jazz bars, and aperitivo', 3 FROM flight.destinations
  WHERE city = 'Milan' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'NAP', hook = 'The city that invented pizza, with Vesuvius brooding overhead and Pompeii just 30 minutes away',
    fun_fact = 'Pizza Margherita was created in Naples in 1889 for the Queen of Italy', weather_summary = 'Warm Mediterranean climate; great year-round, especially spring and autumn',
    flight_cost_per_person_gbp = 48,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Naples' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Naples', 'Italy', 'NAP', 1, 'The city that invented pizza, with Vesuvius brooding overhead and Pompeii just 30 minutes away', 'Pizza Margherita was created in Naples in 1889 for the Queen of Italy',
    'Warm Mediterranean climate; great year-round, especially spring and autumn', 48, 72,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Naples' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Naples' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Naples' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Naples' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Naples' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Pompeii', 'Roman city frozen in time by the 79 AD eruption of Vesuvius', 1 FROM flight.destinations
  WHERE city = 'Naples' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Spaccanapoli', 'Arrow-straight street slicing through the historic centre', 2 FROM flight.destinations
  WHERE city = 'Naples' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'National Archaeological Museum', 'Greatest collection of Roman art in the world', 3 FROM flight.destinations
  WHERE city = 'Naples' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'TSF', hook = 'No cars, no roads — just 118 islands, 400 bridges, and a city that shouldn''t exist but does',
    fun_fact = 'Venice is built on over 1.5 million wooden piles driven into the lagoon mud over a thousand years ago', weather_summary = 'Best in spring and autumn; summer is hot and crowded, winter is atmospheric and foggy',
    flight_cost_per_person_gbp = 48,
    hotel_cost_per_night_gbp = 115,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Venice' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Venice', 'Italy', 'TSF', 1, 'No cars, no roads — just 118 islands, 400 bridges, and a city that shouldn''t exist but does', 'Venice is built on over 1.5 million wooden piles driven into the lagoon mud over a thousand years ago',
    'Best in spring and autumn; summer is hot and crowded, winter is atmospheric and foggy', 48, 115,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Venice' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Venice' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Venice' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Venice' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Venice' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'St Mark''s Basilica', 'Byzantine masterpiece encrusted with mosaics and marble', 1 FROM flight.destinations
  WHERE city = 'Venice' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cannaregio', 'Authentic neighbourhood away from the tourist trail', 2 FROM flight.destinations
  WHERE city = 'Venice' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Burano', 'Island of brightly painted fishermen''s houses 40 minutes by boat', 3 FROM flight.destinations
  WHERE city = 'Venice' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'PSA', hook = 'Yes, there''s a leaning tower — and yes, the rest of Tuscany is even better',
    fun_fact = 'Galileo Galilei was born in Pisa and allegedly used the Leaning Tower for his gravity experiments', weather_summary = 'Hot summers, mild winters; Tuscany is beautiful in spring and autumn',
    flight_cost_per_person_gbp = 46,
    hotel_cost_per_night_gbp = 70,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Pisa' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Pisa', 'Italy', 'PSA', 1, 'Yes, there''s a leaning tower — and yes, the rest of Tuscany is even better', 'Galileo Galilei was born in Pisa and allegedly used the Leaning Tower for his gravity experiments',
    'Hot summers, mild winters; Tuscany is beautiful in spring and autumn', 46, 70,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Pisa' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Pisa' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Pisa' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Pisa' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Pisa' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Field of Miracles', 'Cathedral, Baptistery, and the famous leaning campanile', 1 FROM flight.destinations
  WHERE city = 'Pisa' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Florence', 'Birthplace of the Renaissance, 1 hour by train', 2 FROM flight.destinations
  WHERE city = 'Pisa' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cinque Terre', 'Five pastel cliff villages on the Ligurian coast, 1.5 hours away', 3 FROM flight.destinations
  WHERE city = 'Pisa' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'BLQ', hook = 'The food capital of Italy (and Italy is the food capital of the world)',
    fun_fact = 'Bologna''s university, founded in 1088, is the oldest university in the Western world', weather_summary = 'Hot summers, cold winters; spring is lovely for outdoor dining',
    flight_cost_per_person_gbp = 46,
    hotel_cost_per_night_gbp = 75,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Bologna' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Bologna', 'Italy', 'BLQ', 1, 'The food capital of Italy (and Italy is the food capital of the world)', 'Bologna''s university, founded in 1088, is the oldest university in the Western world',
    'Hot summers, cold winters; spring is lovely for outdoor dining', 46, 75,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Bologna' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bologna' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bologna' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bologna' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bologna' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Quadrilatero Market', 'Ancient food market with porchetta, mortadella, and fresh pasta', 1 FROM flight.destinations
  WHERE city = 'Bologna' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Two Towers', 'Medieval towers leaning at the heart of the old city', 2 FROM flight.destinations
  WHERE city = 'Bologna' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Sanctuary of San Luca', 'Hilltop basilica reached via the world''s longest portico', 3 FROM flight.destinations
  WHERE city = 'Bologna' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Czech Republic', iata_code = 'PRG', hook = 'A fairy-tale city that escaped World War II bombing — medieval spires, beer halls, and film-set squares',
    fun_fact = 'Prague Castle is the largest ancient castle complex in the world at 70,000 sq m', weather_summary = 'Cold winters, warm summers; spring and autumn are ideal',
    flight_cost_per_person_gbp = 36,
    hotel_cost_per_night_gbp = 62,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Prague' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Prague', 'Czech Republic', 'PRG', 1, 'A fairy-tale city that escaped World War II bombing — medieval spires, beer halls, and film-set squares', 'Prague Castle is the largest ancient castle complex in the world at 70,000 sq m',
    'Cold winters, warm summers; spring and autumn are ideal', 36, 62,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Prague' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Prague' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Prague' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Prague' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Prague' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Old Town Square', 'Medieval square with the Gothic church and 15th-century Astronomical Clock', 1 FROM flight.destinations
  WHERE city = 'Prague' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Charles Bridge', '14th-century bridge lined with 30 Baroque statues', 2 FROM flight.destinations
  WHERE city = 'Prague' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Prague Castle', 'Hilltop complex with St Vitus Cathedral and royal palaces', 3 FROM flight.destinations
  WHERE city = 'Prague' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Hungary', iata_code = 'BUD', hook = 'Thermal baths, ruin pubs, and the most beautiful parliament building in the world — all obscenely affordable',
    fun_fact = 'Budapest has the oldest metro line in continental Europe, opened in 1896', weather_summary = 'Hot summers, cold winters; best in spring and early autumn',
    flight_cost_per_person_gbp = 36,
    hotel_cost_per_night_gbp = 60,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Budapest' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Budapest', 'Hungary', 'BUD', 1, 'Thermal baths, ruin pubs, and the most beautiful parliament building in the world — all obscenely affordable', 'Budapest has the oldest metro line in continental Europe, opened in 1896',
    'Hot summers, cold winters; best in spring and early autumn', 36, 60,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Budapest' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Budapest' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Budapest' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Budapest' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Budapest' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Széchenyi Thermal Bath', 'Grand neo-baroque outdoor baths open year-round', 1 FROM flight.destinations
  WHERE city = 'Budapest' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Hungarian Parliament', 'Neo-Gothic riverside masterpiece, best seen at night', 2 FROM flight.destinations
  WHERE city = 'Budapest' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ruin Bars', 'Eclectic bars built inside crumbling courtyards in the Jewish Quarter', 3 FROM flight.destinations
  WHERE city = 'Budapest' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Poland', iata_code = 'KRK', hook = 'Unmatched medieval architecture, the weight of history, and a stag-do nightlife that keeps going till dawn',
    fun_fact = 'Krakow''s Cloth Hall is one of the oldest shopping malls in the world, operating since the 13th century', weather_summary = 'Cold winters, warm summers; Jewish Quarter and old town are stunning in all seasons',
    flight_cost_per_person_gbp = 32,
    hotel_cost_per_night_gbp = 52,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Krakow' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Krakow', 'Poland', 'KRK', 1, 'Unmatched medieval architecture, the weight of history, and a stag-do nightlife that keeps going till dawn', 'Krakow''s Cloth Hall is one of the oldest shopping malls in the world, operating since the 13th century',
    'Cold winters, warm summers; Jewish Quarter and old town are stunning in all seasons', 32, 52,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Krakow' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Krakow' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Krakow' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Krakow' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Krakow' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Wawel Castle', 'Royal castle and cathedral on a limestone hill above the Vistula', 1 FROM flight.destinations
  WHERE city = 'Krakow' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Kazimierz', 'Historic Jewish Quarter now buzzing with galleries and jazz bars', 2 FROM flight.destinations
  WHERE city = 'Krakow' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Wieliczka Salt Mine', 'Underground cathedral carved entirely from salt — UNESCO site', 3 FROM flight.destinations
  WHERE city = 'Krakow' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Poland', iata_code = 'WMI', hook = 'A city reborn from ashes — rebuilt from scratch after WWII and now one of Europe''s most dynamic capitals',
    fun_fact = 'Warsaw''s Old Town was completely destroyed in WWII and meticulously rebuilt brick by brick from 18th-century paintings', weather_summary = 'Cold winters, warm summers; spring and autumn are most pleasant',
    flight_cost_per_person_gbp = 34,
    hotel_cost_per_night_gbp = 58,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Warsaw' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Warsaw', 'Poland', 'WMI', 1, 'A city reborn from ashes — rebuilt from scratch after WWII and now one of Europe''s most dynamic capitals', 'Warsaw''s Old Town was completely destroyed in WWII and meticulously rebuilt brick by brick from 18th-century paintings',
    'Cold winters, warm summers; spring and autumn are most pleasant', 34, 58,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Warsaw' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Warsaw' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Warsaw' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Warsaw' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Warsaw' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Old Town Market Square', 'Reconstructed medieval square now a UNESCO World Heritage Site', 1 FROM flight.destinations
  WHERE city = 'Warsaw' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Warsaw Rising Museum', 'Deeply moving tribute to the 1944 uprising against Nazi occupation', 2 FROM flight.destinations
  WHERE city = 'Warsaw' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Łazienki Park', 'Romantic palace-on-water surrounded by peacocks and Chopin concerts', 3 FROM flight.destinations
  WHERE city = 'Warsaw' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Poland', iata_code = 'WRO', hook = 'A canal city of islands, gnome statues, and a market square that rivals Prague — without the crowds',
    fun_fact = 'Wroclaw has over 300 miniature gnome statues hidden throughout the city streets', weather_summary = 'Cold winters, warm summers; central European continental climate',
    flight_cost_per_person_gbp = 34,
    hotel_cost_per_night_gbp = 52,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Wroclaw' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Wroclaw', 'Poland', 'WRO', 1, 'A canal city of islands, gnome statues, and a market square that rivals Prague — without the crowds', 'Wroclaw has over 300 miniature gnome statues hidden throughout the city streets',
    'Cold winters, warm summers; central European continental climate', 34, 52,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Wroclaw' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Wroclaw' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Wroclaw' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Wroclaw' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Wroclaw' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Wroclaw Market Square', 'One of the largest and most beautiful in Europe — lively year-round', 1 FROM flight.destinations
  WHERE city = 'Wroclaw' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Centennial Hall', 'Groundbreaking 1913 UNESCO concrete dome, predecessor to the O2', 2 FROM flight.destinations
  WHERE city = 'Wroclaw' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cathedral Island', 'Gothic cathedral and ancient footbridges on the oldest part of the city', 3 FROM flight.destinations
  WHERE city = 'Wroclaw' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Germany', iata_code = 'BER', hook = 'History you can touch on every corner, the world''s best nightlife, and street food from every continent',
    fun_fact = 'Berlin has more museums than rainy days per year — over 170 of them', weather_summary = 'Cold winters, warm summers; famous for summer festivals and outdoor culture',
    flight_cost_per_person_gbp = 38,
    hotel_cost_per_night_gbp = 82,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Berlin' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Berlin', 'Germany', 'BER', 1, 'History you can touch on every corner, the world''s best nightlife, and street food from every continent', 'Berlin has more museums than rainy days per year — over 170 of them',
    'Cold winters, warm summers; famous for summer festivals and outdoor culture', 38, 82,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Berlin' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Berlin' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Berlin' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Berlin' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Berlin' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Brandenburg Gate', 'Neoclassical symbol of German unity at the heart of the city', 1 FROM flight.destinations
  WHERE city = 'Berlin' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'East Side Gallery', '1.3km of preserved Berlin Wall covered in murals', 2 FROM flight.destinations
  WHERE city = 'Berlin' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Museum Island', 'UNESCO complex housing five world-class museums on a river island', 3 FROM flight.destinations
  WHERE city = 'Berlin' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'ATH', hook = 'The cradle of democracy, the Parthenon at sunset, and a street food scene that never sleeps',
    fun_fact = 'The Acropolis has been continuously inhabited for over 5,000 years', weather_summary = 'Hot dry summers, mild winters; spring and autumn are ideal for sightseeing',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Athens' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Athens', 'Greece', 'ATH', 1, 'The cradle of democracy, the Parthenon at sunset, and a street food scene that never sleeps', 'The Acropolis has been continuously inhabited for over 5,000 years',
    'Hot dry summers, mild winters; spring and autumn are ideal for sightseeing', 55, 72,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Athens' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Athens' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Athens' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Athens' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Athens' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Acropolis', 'The Parthenon and ancient monuments overlooking the city', 1 FROM flight.destinations
  WHERE city = 'Athens' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Monastiraki Flea Market', 'Chaotic and brilliant Sunday market below the Acropolis', 2 FROM flight.destinations
  WHERE city = 'Athens' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Plaka District', 'Neoclassical neighbourhood with tavernas under the ancient walls', 3 FROM flight.destinations
  WHERE city = 'Athens' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'SKG', hook = 'Greece''s second city — louder, more local, and with food even Athenians admit is better',
    fun_fact = 'Thessaloniki has the best street food in Greece, including the bougatsa pastry invented here', weather_summary = 'Warm Mediterranean climate; hot summers, mild winters, wonderful autumn',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 62,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Thessaloniki' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Thessaloniki', 'Greece', 'SKG', 1, 'Greece''s second city — louder, more local, and with food even Athenians admit is better', 'Thessaloniki has the best street food in Greece, including the bougatsa pastry invented here',
    'Warm Mediterranean climate; hot summers, mild winters, wonderful autumn', 55, 62,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Thessaloniki' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Thessaloniki' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Thessaloniki' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Thessaloniki' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Thessaloniki' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'White Tower', 'Byzantine landmark on the waterfront promenade', 1 FROM flight.destinations
  WHERE city = 'Thessaloniki' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ladadika District', 'Former warehouse quarter now packed with tavernas and bars', 2 FROM flight.destinations
  WHERE city = 'Thessaloniki' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Archaeological Museum', 'Gold artefacts from Alexander the Great''s Macedonia', 3 FROM flight.destinations
  WHERE city = 'Thessaloniki' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Estonia', iata_code = 'TLL', hook = 'The best-preserved medieval old town in Northern Europe — like a Disney castle, but actually 800 years old',
    fun_fact = 'Tallinn''s medieval town hall has been in continuous use since 1322, making it the oldest in Northern Europe', weather_summary = 'Cold snowy winters (magical), warm summers; Old Town is beautiful in all seasons',
    flight_cost_per_person_gbp = 38,
    hotel_cost_per_night_gbp = 62,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Tallinn' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Tallinn', 'Estonia', 'TLL', 1, 'The best-preserved medieval old town in Northern Europe — like a Disney castle, but actually 800 years old', 'Tallinn''s medieval town hall has been in continuous use since 1322, making it the oldest in Northern Europe',
    'Cold snowy winters (magical), warm summers; Old Town is beautiful in all seasons', 38, 62,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Tallinn' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Tallinn' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tallinn' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tallinn' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Tallinn' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Toompea Castle Hill', 'Upper old town with Gothic towers and panoramic views', 1 FROM flight.destinations
  WHERE city = 'Tallinn' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Town Hall Square', 'Medieval square lined with merchants'' houses and a 15th-century pharmacy', 2 FROM flight.destinations
  WHERE city = 'Tallinn' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Telliskivi Creative City', 'Former factory complex now home to the city''s coolest cafés and shops', 3 FROM flight.destinations
  WHERE city = 'Tallinn' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Latvia', iata_code = 'RIX', hook = 'Europe''s finest collection of Art Nouveau buildings, a magnificent old town, and Baltic warmth',
    fun_fact = 'Riga has the largest collection of Art Nouveau architecture in the world — over 800 buildings', weather_summary = 'Cold winters, warm summers; midsummer is long-lit and lively',
    flight_cost_per_person_gbp = 38,
    hotel_cost_per_night_gbp = 58,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Riga' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Riga', 'Latvia', 'RIX', 1, 'Europe''s finest collection of Art Nouveau buildings, a magnificent old town, and Baltic warmth', 'Riga has the largest collection of Art Nouveau architecture in the world — over 800 buildings',
    'Cold winters, warm summers; midsummer is long-lit and lively', 38, 58,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Riga' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Riga' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Riga' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Riga' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Riga' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Art Nouveau District', 'Entire streets of ornate Jugendstil facades — a UNESCO highlight', 1 FROM flight.destinations
  WHERE city = 'Riga' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Central Market', 'Europe''s largest market in five converted WWI zeppelin hangars', 2 FROM flight.destinations
  WHERE city = 'Riga' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Old Town', 'UNESCO medieval streets with lively bars and Latvian folk restaurants', 3 FROM flight.destinations
  WHERE city = 'Riga' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Lithuania', iata_code = 'VNO', hook = 'Europe''s most overlooked baroque city — a UNESCO old town barely touched by mass tourism',
    fun_fact = 'Vilnius has the largest surviving Baroque old town in Northern Europe', weather_summary = 'Cold continental winters, warm summers; spring brings blossom to cobbled courtyards',
    flight_cost_per_person_gbp = 38,
    hotel_cost_per_night_gbp = 55,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Vilnius' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Vilnius', 'Lithuania', 'VNO', 1, 'Europe''s most overlooked baroque city — a UNESCO old town barely touched by mass tourism', 'Vilnius has the largest surviving Baroque old town in Northern Europe',
    'Cold continental winters, warm summers; spring brings blossom to cobbled courtyards', 38, 55,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Vilnius' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Vilnius' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Vilnius' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Vilnius' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Vilnius' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Gediminas Castle Tower', 'Hilltop ruin overlooking the old town and two rivers', 1 FROM flight.destinations
  WHERE city = 'Vilnius' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Užupis', 'Self-declared artists'' republic with its own constitution and anthem', 2 FROM flight.destinations
  WHERE city = 'Vilnius' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Gates of Dawn', 'Medieval gate chapel housing a revered icon drawing pilgrims daily', 3 FROM flight.destinations
  WHERE city = 'Vilnius' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Malta', iata_code = 'MLA', hook = '7,000 years of history on a sun-drenched island — megalithic temples, crusader bastions, and crystal waters',
    fun_fact = 'Malta''s Ħaġar Qim temples are over 5,500 years old — older than Stonehenge and the Egyptian pyramids', weather_summary = '300 days of sunshine; warm enough to swim from May to November',
    flight_cost_per_person_gbp = 52,
    hotel_cost_per_night_gbp = 76,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Malta' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Malta', 'Malta', 'MLA', 1, '7,000 years of history on a sun-drenched island — megalithic temples, crusader bastions, and crystal waters', 'Malta''s Ħaġar Qim temples are over 5,500 years old — older than Stonehenge and the Egyptian pyramids',
    '300 days of sunshine; warm enough to swim from May to November', 52, 76,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Malta' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Malta' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Malta' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Malta' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Malta' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Malta' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Malta' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Valletta', 'Europe''s smallest capital and an open-air baroque museum', 1 FROM flight.destinations
  WHERE city = 'Malta' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ħaġar Qim Temples', 'Neolithic stone temples predating the Egyptian pyramids', 2 FROM flight.destinations
  WHERE city = 'Malta' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Blue Lagoon, Comino', 'Impossibly turquoise lagoon reached by short ferry', 3 FROM flight.destinations
  WHERE city = 'Malta' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Croatia', iata_code = 'DBV', hook = 'Walk the city walls at sunrise before the cruise ships arrive and it''s the most beautiful city on Earth',
    fun_fact = 'Dubrovnik was one of the first cities in the world to abolish slavery, in 1418', weather_summary = 'Hot Mediterranean summers, mild winters; spring is uncrowded and beautiful',
    flight_cost_per_person_gbp = 54,
    hotel_cost_per_night_gbp = 90,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Dubrovnik' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Dubrovnik', 'Croatia', 'DBV', 1, 'Walk the city walls at sunrise before the cruise ships arrive and it''s the most beautiful city on Earth', 'Dubrovnik was one of the first cities in the world to abolish slavery, in 1418',
    'Hot Mediterranean summers, mild winters; spring is uncrowded and beautiful', 54, 90,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Dubrovnik' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Dubrovnik' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Dubrovnik' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Dubrovnik' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Dubrovnik' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Dubrovnik' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Old City Walls', '2km walk around the medieval ramparts above the Adriatic', 1 FROM flight.destinations
  WHERE city = 'Dubrovnik' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Lokrum Island', 'Forest island 5 minutes by boat with peacocks and a saltwater lake', 2 FROM flight.destinations
  WHERE city = 'Dubrovnik' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cable Car', 'Rides to Mount Srđ for views across the old town and coast', 3 FROM flight.destinations
  WHERE city = 'Dubrovnik' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Croatia', iata_code = 'SPU', hook = 'A Roman palace turned living city — people actually live inside a 1,700-year-old emperor''s retirement home',
    fun_fact = 'Split''s city centre is built inside Diocletian''s Palace, a Roman emperor''s retirement home from 305 AD', weather_summary = 'Hot sunny summers, mild winters; Dalmatian coast is best May to September',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 80,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Split' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Split', 'Croatia', 'SPU', 1, 'A Roman palace turned living city — people actually live inside a 1,700-year-old emperor''s retirement home', 'Split''s city centre is built inside Diocletian''s Palace, a Roman emperor''s retirement home from 305 AD',
    'Hot sunny summers, mild winters; Dalmatian coast is best May to September', 50, 80,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Split' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Split' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Split' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Split' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Split' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Split' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Split' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Diocletian''s Palace', 'Roman palace complex where people still live and work', 1 FROM flight.destinations
  WHERE city = 'Split' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Hvar Island', 'Glamorous island with lavender fields, 1 hour by catamaran', 2 FROM flight.destinations
  WHERE city = 'Split' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Bačvice Beach', 'Sandy city beach where locals play picigin, a traditional water sport', 3 FROM flight.destinations
  WHERE city = 'Split' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Morocco', iata_code = 'RAK', hook = 'Spice-scented souks, rooftop riads, and the most thrilling medina in North Africa',
    fun_fact = 'Marrakech''s medina has been continuously inhabited for over 1,000 years and has no street plan', weather_summary = 'Very hot in summer; spring and autumn are ideal; mild winters with occasional cold snaps',
    flight_cost_per_person_gbp = 58,
    hotel_cost_per_night_gbp = 62,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Marrakech' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Marrakech', 'Morocco', 'RAK', 1, 'Spice-scented souks, rooftop riads, and the most thrilling medina in North Africa', 'Marrakech''s medina has been continuously inhabited for over 1,000 years and has no street plan',
    'Very hot in summer; spring and autumn are ideal; mild winters with occasional cold snaps', 58, 62,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Marrakech' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Marrakech' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Marrakech' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Marrakech' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Marrakech' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Marrakech' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Djemaa el-Fna', 'Unesco-listed square transforming nightly into open-air theatre', 1 FROM flight.destinations
  WHERE city = 'Marrakech' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Majorelle Garden', 'Yves Saint Laurent''s cobalt-blue botanical garden oasis', 2 FROM flight.destinations
  WHERE city = 'Marrakech' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Souk districts', 'Labyrinthine markets of leather, spices, lanterns, and ceramics', 3 FROM flight.destinations
  WHERE city = 'Marrakech' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Austria', iata_code = 'SZG', hook = 'Mozart''s birthplace, a baroque old town, and gateway to some of the Alps'' finest ski terrain',
    fun_fact = 'Salzburg''s old town is a UNESCO World Heritage Site and inspired the setting for The Sound of Music', weather_summary = 'Cold snowy winters perfect for skiing; beautiful all year round',
    flight_cost_per_person_gbp = 56,
    hotel_cost_per_night_gbp = 92,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Salzburg' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Salzburg', 'Austria', 'SZG', 1, 'Mozart''s birthplace, a baroque old town, and gateway to some of the Alps'' finest ski terrain', 'Salzburg''s old town is a UNESCO World Heritage Site and inspired the setting for The Sound of Music',
    'Cold snowy winters perfect for skiing; beautiful all year round', 56, 92,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Salzburg' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Salzburg' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Salzburg' AND dst.departure_airport_id = 1 AND tt.slug = 'skiing';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Salzburg' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Salzburg' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Salzburg' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Salzburg' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Hohensalzburg Fortress', 'One of Europe''s largest medieval castles above the old town', 1 FROM flight.destinations
  WHERE city = 'Salzburg' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ski Amadé', 'One of Europe''s largest ski areas just 45 minutes from the city', 2 FROM flight.destinations
  WHERE city = 'Salzburg' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Mozart''s Birthplace', 'Museum in the apartment where the composer was born in 1756', 3 FROM flight.destinations
  WHERE city = 'Salzburg' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Switzerland', iata_code = 'GVA', hook = 'Pristine lake, jet d''eau, world''s best watchmakers, and the French Alps a bus ride away',
    fun_fact = 'Geneva is home to more international organisations than any other city, including the UN and Red Cross', weather_summary = 'Cold crisp winters ideal for skiing; warm pleasant summers on the lake',
    flight_cost_per_person_gbp = 58,
    hotel_cost_per_night_gbp = 148,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Geneva' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Geneva', 'Switzerland', 'GVA', 1, 'Pristine lake, jet d''eau, world''s best watchmakers, and the French Alps a bus ride away', 'Geneva is home to more international organisations than any other city, including the UN and Red Cross',
    'Cold crisp winters ideal for skiing; warm pleasant summers on the lake', 58, 148,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Geneva' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Geneva' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Geneva' AND dst.departure_airport_id = 1 AND tt.slug = 'skiing';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Geneva' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Geneva' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Chamonix & Mont Blanc', 'World-famous ski resort and highest peak in the Alps, 1 hour away', 1 FROM flight.destinations
  WHERE city = 'Geneva' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Jet d''Eau', '140m water fountain shooting from Lake Geneva — the city''s icon', 2 FROM flight.destinations
  WHERE city = 'Geneva' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Old Town (Vieille Ville)', 'Cathedral, cobbled squares, and the Reformation Wall', 3 FROM flight.destinations
  WHERE city = 'Geneva' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Scotland', iata_code = 'EDI', hook = 'A castle on an ancient volcano, Arthur''s Seat to hike at dawn, and a pub for every mood',
    fun_fact = 'Edinburgh''s Old Town sits on an extinct volcano that erupted 350 million years ago', weather_summary = 'Cool and often rainy year-round; layers are essential but summer is genuinely lovely',
    flight_cost_per_person_gbp = 28,
    hotel_cost_per_night_gbp = 88,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Edinburgh' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Edinburgh', 'Scotland', 'EDI', 1, 'A castle on an ancient volcano, Arthur''s Seat to hike at dawn, and a pub for every mood', 'Edinburgh''s Old Town sits on an extinct volcano that erupted 350 million years ago',
    'Cool and often rainy year-round; layers are essential but summer is genuinely lovely', 28, 88,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Edinburgh' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Edinburgh' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Edinburgh' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Edinburgh' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Edinburgh' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Edinburgh' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Edinburgh Castle', 'Fortress on volcanic rock with the Scottish Crown Jewels', 1 FROM flight.destinations
  WHERE city = 'Edinburgh' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Arthur''s Seat', 'Ancient volcano in Holyrood Park — a 45-minute hike from the city centre', 2 FROM flight.destinations
  WHERE city = 'Edinburgh' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Royal Mile', 'Medieval spine from castle to Holyrood with closes, whisky shops, and history', 3 FROM flight.destinations
  WHERE city = 'Edinburgh' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Turkey', iata_code = 'AYT', hook = 'Where the Taurus Mountains meet the turquoise Mediterranean — ancient ruins, dramatic canyons, and a coast that dazzles',
    fun_fact = 'Antalya''s old harbour, Kaleiçi, has been in continuous use for over 2,000 years since it was built by the Attalid Kings', weather_summary = 'Hot and sunny May–October; mild winters; one of Turkey''s sunniest cities',
    flight_cost_per_person_gbp = 75,
    hotel_cost_per_night_gbp = 55,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Antalya' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Antalya', 'Turkey', 'AYT', 1, 'Where the Taurus Mountains meet the turquoise Mediterranean — ancient ruins, dramatic canyons, and a coast that dazzles', 'Antalya''s old harbour, Kaleiçi, has been in continuous use for over 2,000 years since it was built by the Attalid Kings',
    'Hot and sunny May–October; mild winters; one of Turkey''s sunniest cities', 75, 55,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Antalya' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Antalya' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Antalya' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Antalya' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Antalya' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Antalya' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Kaleiçi Old City', 'Roman harbour district of winding lanes, Ottoman houses, and a Byzantine clock tower', 1 FROM flight.destinations
  WHERE city = 'Antalya' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Düden Waterfalls', 'Cascading falls that plunge directly into the Mediterranean', 2 FROM flight.destinations
  WHERE city = 'Antalya' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Aspendos Theatre', 'The best-preserved Roman amphitheatre in the world, still used for performances', 3 FROM flight.destinations
  WHERE city = 'Antalya' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Turkey', iata_code = 'DLM', hook = 'Gateway to the Turquoise Coast — paragliding over Ölüdeniz, ancient Lycian ruins, and boat trips in crystalline coves',
    fun_fact = 'The Blue Lagoon at Ölüdeniz is one of the most photographed beaches in the world and a natural protected area', weather_summary = 'Very hot July–August; warm and dry May–October; mild winters',
    flight_cost_per_person_gbp = 75,
    hotel_cost_per_night_gbp = 50,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Dalaman' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Dalaman', 'Turkey', 'DLM', 1, 'Gateway to the Turquoise Coast — paragliding over Ölüdeniz, ancient Lycian ruins, and boat trips in crystalline coves', 'The Blue Lagoon at Ölüdeniz is one of the most photographed beaches in the world and a natural protected area',
    'Very hot July–August; warm and dry May–October; mild winters', 75, 50,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Dalaman' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Dalaman' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Dalaman' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Dalaman' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Dalaman' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Dalaman' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ölüdeniz Blue Lagoon', 'Iconic turquoise lagoon framed by pine-forested cliffs', 1 FROM flight.destinations
  WHERE city = 'Dalaman' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Saklıkent Gorge', 'Europe''s second-longest gorge — wade through icy water between towering walls', 2 FROM flight.destinations
  WHERE city = 'Dalaman' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Tlos Ancient City', 'Lycian rock tombs carved into cliffsides above a spectacular valley', 3 FROM flight.destinations
  WHERE city = 'Dalaman' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'MAH', hook = 'The Balearic island that kept its soul — prehistoric monuments, hidden coves, and a pace of life that refuses to hurry',
    fun_fact = 'Menorca has over 1,500 megalithic monuments — more prehistoric sites per square kilometre than almost anywhere in the world', weather_summary = 'Warm and sunny May–October; cooler and quieter in winter; far less crowded than Mallorca or Ibiza',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Menorca' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Menorca', 'Spain', 'MAH', 1, 'The Balearic island that kept its soul — prehistoric monuments, hidden coves, and a pace of life that refuses to hurry', 'Menorca has over 1,500 megalithic monuments — more prehistoric sites per square kilometre than almost anywhere in the world',
    'Warm and sunny May–October; cooler and quieter in winter; far less crowded than Mallorca or Ibiza', 55, 72,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Menorca' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Menorca' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Menorca' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Menorca' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Menorca' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Menorca' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cala Macarella', 'Postcard-perfect cove of turquoise water and white sand ringed by pine trees', 1 FROM flight.destinations
  WHERE city = 'Menorca' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Monte Toro', 'Island''s highest point with a monastery and 360° views of the whole island', 2 FROM flight.destinations
  WHERE city = 'Menorca' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Naveta d''Es Tudons', 'A 3,500-year-old megalithic funerary chamber, the oldest roofed building in Spain', 3 FROM flight.destinations
  WHERE city = 'Menorca' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'KGS', hook = 'Ancient temples, bicycle-friendly villages, and some of the clearest Aegean waters in Greece',
    fun_fact = 'Hippocrates, the father of medicine, was born on Kos around 460 BC and is said to have taught under the island''s ancient Plane Tree', weather_summary = 'Long hot summers; warm from May to October; excellent for watersports and cycling',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 65,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Kos' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Kos', 'Greece', 'KGS', 1, 'Ancient temples, bicycle-friendly villages, and some of the clearest Aegean waters in Greece', 'Hippocrates, the father of medicine, was born on Kos around 460 BC and is said to have taught under the island''s ancient Plane Tree',
    'Long hot summers; warm from May to October; excellent for watersports and cycling', 65, 65,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Kos' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Kos' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kos' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kos' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kos' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Kos' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Hippocrates Plane Tree', 'Ancient tree where the father of medicine reputedly taught his students', 1 FROM flight.destinations
  WHERE city = 'Kos' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Castle of the Knights', '15th-century crusader castle guarding the harbour entrance', 2 FROM flight.destinations
  WHERE city = 'Kos' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Tigaki Beach', 'Long sandy beach with shallow water ideal for kite-surfing', 3 FROM flight.destinations
  WHERE city = 'Kos' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'EFL', hook = 'The wild Ionian island — vertiginous cliffs, an underground lake, and beaches that look like a screen saver made real',
    fun_fact = 'Myrtos Beach on Kefalonia is consistently voted one of the most beautiful beaches in the world by travel publications', weather_summary = 'Hot dry summers; best from May to October; cooler in spring with dramatic mountain scenery',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 70,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Kefalonia' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Kefalonia', 'Greece', 'EFL', 1, 'The wild Ionian island — vertiginous cliffs, an underground lake, and beaches that look like a screen saver made real', 'Myrtos Beach on Kefalonia is consistently voted one of the most beautiful beaches in the world by travel publications',
    'Hot dry summers; best from May to October; cooler in spring with dramatic mountain scenery', 65, 70,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Kefalonia' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Kefalonia' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kefalonia' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kefalonia' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kefalonia' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Kefalonia' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Myrtos Beach', 'White pebble beach at the foot of sheer limestone cliffs, Ionian blue below', 1 FROM flight.destinations
  WHERE city = 'Kefalonia' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Melissani Cave Lake', 'Underground lake illuminated by a collapsed ceiling open to the sky', 2 FROM flight.destinations
  WHERE city = 'Kefalonia' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Assos Village', 'Pastel-painted village on a narrow isthmus with a Venetian fort above', 3 FROM flight.destinations
  WHERE city = 'Kefalonia' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'HER', hook = 'The cradle of Minoan civilisation — 4,000-year-old palaces, gorge hikes, and Cretan hospitality that earns its reputation',
    fun_fact = 'The Palace of Knossos, just outside Heraklion, is Europe''s oldest city and the heart of the ancient Minoan civilisation', weather_summary = 'Very hot summers; warm spring and autumn; one of Greece''s sunniest and driest regions',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 68,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Heraklion' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Heraklion', 'Greece', 'HER', 1, 'The cradle of Minoan civilisation — 4,000-year-old palaces, gorge hikes, and Cretan hospitality that earns its reputation', 'The Palace of Knossos, just outside Heraklion, is Europe''s oldest city and the heart of the ancient Minoan civilisation',
    'Very hot summers; warm spring and autumn; one of Greece''s sunniest and driest regions', 65, 68,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Heraklion' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Heraklion' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Heraklion' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Heraklion' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Heraklion' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Heraklion' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Palace of Knossos', 'Europe''s first urban civilisation — Minoan frescoes and labyrinthine corridors', 1 FROM flight.destinations
  WHERE city = 'Heraklion' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Samaria Gorge', 'Europe''s longest gorge — a 16km hike through towering limestone walls', 2 FROM flight.destinations
  WHERE city = 'Heraklion' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Heraklion Archaeological Museum', 'The world''s finest collection of Minoan art and artefacts', 3 FROM flight.destinations
  WHERE city = 'Heraklion' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Ireland', iata_code = 'KIR', hook = 'Ireland''s wild southwestern corner — the Ring of Kerry, sea cliffs, and ancient monastic islands in the Atlantic',
    fun_fact = 'Skellig Michael, a dramatic sea stack off Kerry''s coast, is a UNESCO World Heritage Site used as Luke Skywalker''s island in Star Wars', weather_summary = 'Cool and often rainy year-round; stunning in all weathers; summer is the warmest and driest',
    flight_cost_per_person_gbp = 35,
    hotel_cost_per_night_gbp = 78,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Kerry' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Kerry', 'Ireland', 'KIR', 1, 'Ireland''s wild southwestern corner — the Ring of Kerry, sea cliffs, and ancient monastic islands in the Atlantic', 'Skellig Michael, a dramatic sea stack off Kerry''s coast, is a UNESCO World Heritage Site used as Luke Skywalker''s island in Star Wars',
    'Cool and often rainy year-round; stunning in all weathers; summer is the warmest and driest', 35, 78,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Kerry' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Kerry' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kerry' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kerry' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Kerry' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ring of Kerry', 'Scenic 179km coastal drive through mountains, sea cliffs, and ancient ruins', 1 FROM flight.destinations
  WHERE city = 'Kerry' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Skellig Michael', 'Dramatic UNESCO sea stack with a 6th-century monastic settlement, boat access only', 2 FROM flight.destinations
  WHERE city = 'Kerry' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Killarney National Park', 'Ireland''s oldest national park — lakes, mountains, and red deer', 3 FROM flight.destinations
  WHERE city = 'Kerry' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'LEI', hook = 'Spain''s most overlooked province — Europe''s only true desert, unspoiled beaches, and more sunshine than anywhere on the continent',
    fun_fact = 'Almeria''s Tabernas Desert is the only true desert in Europe and has been the backdrop for hundreds of Spaghetti Westerns since the 1960s', weather_summary = 'Europe''s sunniest city; over 3,000 hours of sunshine a year; warm beaches from April to November',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 58,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Almeria' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Almeria', 'Spain', 'LEI', 1, 'Spain''s most overlooked province — Europe''s only true desert, unspoiled beaches, and more sunshine than anywhere on the continent', 'Almeria''s Tabernas Desert is the only true desert in Europe and has been the backdrop for hundreds of Spaghetti Westerns since the 1960s',
    'Europe''s sunniest city; over 3,000 hours of sunshine a year; warm beaches from April to November', 55, 58,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Almeria' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Almeria' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Almeria' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Almeria' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Almeria' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Almeria' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Tabernas Desert & Mini Hollywood', 'The only desert in Europe — film set tours amid Clint Eastwood''s landscapes', 1 FROM flight.destinations
  WHERE city = 'Almeria' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cabo de Gata Natural Park', 'Volcanic coastline of black sand beaches and deserted coves', 2 FROM flight.destinations
  WHERE city = 'Almeria' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Almeria Alcazaba', 'Moorish fortress with sweeping views over the city and sea', 3 FROM flight.destinations
  WHERE city = 'Almeria' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'CTA', hook = 'Baroque piazzas in the shadow of an active volcano — Etna looms over Catania and makes everything feel electric',
    fun_fact = 'Mount Etna is Europe''s largest active volcano and has been erupting almost continuously for 500,000 years', weather_summary = 'Hot Mediterranean summers; mild winters; ideal spring and autumn for hiking Etna',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 65,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Catania' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Catania', 'Italy', 'CTA', 1, 'Baroque piazzas in the shadow of an active volcano — Etna looms over Catania and makes everything feel electric', 'Mount Etna is Europe''s largest active volcano and has been erupting almost continuously for 500,000 years',
    'Hot Mediterranean summers; mild winters; ideal spring and autumn for hiking Etna', 55, 65,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Catania' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Catania' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Catania' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Catania' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Catania' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Catania' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Mount Etna', 'Hike or cable-car to the summit craters of Europe''s most active volcano', 1 FROM flight.destinations
  WHERE city = 'Catania' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Catania''s Piazza del Duomo', 'Baroque square built on top of ancient lava flows, centred on the Liotru elephant fountain', 2 FROM flight.destinations
  WHERE city = 'Catania' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Valle del Bove', 'Vast depression on Etna''s eastern flank — lava fields and otherworldly terrain', 3 FROM flight.destinations
  WHERE city = 'Catania' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'JTR', hook = 'The most photographed caldera in the world — perched whitewashed villages, blood-red beaches, and sunsets that justify every cliché',
    fun_fact = 'Santorini was formed by one of history''s largest volcanic eruptions around 1600 BC, which may have inspired the Atlantis legend', weather_summary = 'Hot and sunny May–October; quieter and romantic in shoulder seasons',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 110,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Santorini' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Santorini', 'Greece', 'JTR', 1, 'The most photographed caldera in the world — perched whitewashed villages, blood-red beaches, and sunsets that justify every cliché', 'Santorini was formed by one of history''s largest volcanic eruptions around 1600 BC, which may have inspired the Atlantis legend',
    'Hot and sunny May–October; quieter and romantic in shoulder seasons', 65, 110,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Santorini' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Santorini' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Santorini' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Santorini' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Santorini' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Santorini' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Oia Sunset Point', 'The iconic blue-domed village famous for the most celebrated sunset in Greece', 1 FROM flight.destinations
  WHERE city = 'Santorini' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Red Beach', 'Dramatic volcanic beach of red and black rock below towering ochre cliffs', 2 FROM flight.destinations
  WHERE city = 'Santorini' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Akrotiri Archaeological Site', 'A Minoan city frozen in time by the volcanic eruption — the Pompeii of the Aegean', 3 FROM flight.destinations
  WHERE city = 'Santorini' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Denmark', iata_code = 'AAR', hook = 'Denmark''s second city and its most fun — a vibrant arts scene, Viking heritage, and a food culture that punches above its weight',
    fun_fact = 'Aarhus has one of Europe''s oldest Viking settlements, with artefacts at Moesgaard dating back over 2,000 years', weather_summary = 'Cool northern climate; lovely in summer; colourful autumn foliage; cold winters',
    flight_cost_per_person_gbp = 42,
    hotel_cost_per_night_gbp = 88,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Aarhus' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Aarhus', 'Denmark', 'AAR', 1, 'Denmark''s second city and its most fun — a vibrant arts scene, Viking heritage, and a food culture that punches above its weight', 'Aarhus has one of Europe''s oldest Viking settlements, with artefacts at Moesgaard dating back over 2,000 years',
    'Cool northern climate; lovely in summer; colourful autumn foliage; cold winters', 42, 88,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Aarhus' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Aarhus' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Aarhus' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Aarhus' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Aarhus' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Aarhus' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'ARoS Art Museum', 'Top-floor rainbow panorama walkway with sweeping city views', 1 FROM flight.destinations
  WHERE city = 'Aarhus' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Moesgaard Museum', 'World-class Viking and prehistoric artefacts in a grass-roofed building', 2 FROM flight.destinations
  WHERE city = 'Aarhus' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Den Gamle By', 'Open-air museum of a complete 18th-century Danish town', 3 FROM flight.destinations
  WHERE city = 'Aarhus' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'CHQ', hook = 'Western Crete''s jewel — a Venetian harbour with minarets, gorge hikes, and beaches ranging from pink to golden',
    fun_fact = 'Chania''s covered market, built in 1913, is modelled on the Mercato Centrale in Florence', weather_summary = 'Long hot summers; best from May to October; milder and greener than eastern Crete',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 68,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Chania' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Chania', 'Greece', 'CHQ', 1, 'Western Crete''s jewel — a Venetian harbour with minarets, gorge hikes, and beaches ranging from pink to golden', 'Chania''s covered market, built in 1913, is modelled on the Mercato Centrale in Florence',
    'Long hot summers; best from May to October; milder and greener than eastern Crete', 65, 68,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Chania' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Chania' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Chania' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Chania' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Chania' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Chania' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Venetian Harbour', '16th-century harbour with a lighthouse, mosques, and the best waterfront in Crete', 1 FROM flight.destinations
  WHERE city = 'Chania' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Samaria Gorge', 'Europe''s longest gorge — a dramatic 16km hike from the White Mountains to the sea', 2 FROM flight.destinations
  WHERE city = 'Chania' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Elafonisi Pink Sand Beach', 'A tidal lagoon with blush-pink sand caused by crushed shells', 3 FROM flight.destinations
  WHERE city = 'Chania' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Norway', iata_code = 'BGO', hook = 'Norway''s gateway city — colourful wooden wharves, fjord boat trips, and a funicular to views that explain why people write poems about Norway',
    fun_fact = 'Bergen is surrounded by seven mountains and receives over 240 days of rain per year — locals carry umbrellas like a badge of honour', weather_summary = 'Norway''s rainiest city; layers essential; summer is long-lit and beautiful; fjords are magical year-round',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 105,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Bergen' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Bergen', 'Norway', 'BGO', 1, 'Norway''s gateway city — colourful wooden wharves, fjord boat trips, and a funicular to views that explain why people write poems about Norway', 'Bergen is surrounded by seven mountains and receives over 240 days of rain per year — locals carry umbrellas like a badge of honour',
    'Norway''s rainiest city; layers essential; summer is long-lit and beautiful; fjords are magical year-round', 55, 105,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Bergen' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bergen' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bergen' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bergen' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bergen' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Bryggen Wharf', 'UNESCO-listed row of medieval Hanseatic wooden buildings on the harbour', 1 FROM flight.destinations
  WHERE city = 'Bergen' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Fløibanen Funicular', 'Mountain railway to the top of Mount Fløyen for panoramic city and fjord views', 2 FROM flight.destinations
  WHERE city = 'Bergen' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Hardangerfjord', 'Day trips to Norway''s second-longest fjord — waterfalls, orchards, and silence', 3 FROM flight.destinations
  WHERE city = 'Bergen' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Portugal', iata_code = 'PDL', hook = 'Volcanic craters, hot springs, whale watching, and the most dramatic green island scenery in the Atlantic',
    fun_fact = 'The Azores are one of the few places on earth where you can reliably swim with wild sperm whales', weather_summary = 'Mild and green year-round; can be showery; best May–September; dramatic in all seasons',
    flight_cost_per_person_gbp = 75,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Ponta Delgada' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Ponta Delgada', 'Portugal', 'PDL', 1, 'Volcanic craters, hot springs, whale watching, and the most dramatic green island scenery in the Atlantic', 'The Azores are one of the few places on earth where you can reliably swim with wild sperm whales',
    'Mild and green year-round; can be showery; best May–September; dramatic in all seasons', 75, 72,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Ponta Delgada' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Ponta Delgada' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Ponta Delgada' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Ponta Delgada' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Ponta Delgada' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Sete Cidades', 'Twin volcanic crater lakes — one blue, one green — surrounded by mist and forest', 1 FROM flight.destinations
  WHERE city = 'Ponta Delgada' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Furnas Hot Springs', 'Volcanic thermal pools where locals cook food underground in geothermal vents', 2 FROM flight.destinations
  WHERE city = 'Ponta Delgada' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Whale Watching', 'Year-round access to sperm whales, blue whales, and dolphins in their natural habitat', 3 FROM flight.destinations
  WHERE city = 'Ponta Delgada' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Croatia', iata_code = 'PUY', hook = 'A Roman amphitheatre still hosting concerts after 2,000 years, backed by an Istrian coast of pine-fringed coves',
    fun_fact = 'Pula''s Roman Arena, built in the 1st century AD, is one of the six largest surviving Roman amphitheatres in the world', weather_summary = 'Hot Mediterranean summers; warm spring and autumn; mild winters on the Istrian coast',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 68,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Pula' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Pula', 'Croatia', 'PUY', 1, 'A Roman amphitheatre still hosting concerts after 2,000 years, backed by an Istrian coast of pine-fringed coves', 'Pula''s Roman Arena, built in the 1st century AD, is one of the six largest surviving Roman amphitheatres in the world',
    'Hot Mediterranean summers; warm spring and autumn; mild winters on the Istrian coast', 55, 68,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Pula' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Pula' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Pula' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Pula' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Pula' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Pula' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Pula Roman Arena', 'One of the world''s best-preserved Roman amphitheatres — still hosting events', 1 FROM flight.destinations
  WHERE city = 'Pula' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cape Kamenjak', 'Wild nature reserve of sea cliffs, hidden coves, and crystal-clear swimming', 2 FROM flight.destinations
  WHERE city = 'Pula' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Brijuni National Park', 'Island national park with Roman ruins, safari animals, and Tito''s summer residence', 3 FROM flight.destinations
  WHERE city = 'Pula' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Croatia', iata_code = 'ZAD', hook = 'Alfred Hitchcock called it the most beautiful sunset in the world, and Zadar''s Sea Organ will make you believe him',
    fun_fact = 'Zadar''s Sea Organ uses underwater pipes and Adriatic tides to create continuous natural music — the world''s first such instrument', weather_summary = 'Hot dry summers; mild and beautiful in spring and autumn; one of the most authentic Dalmatian cities',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 65,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Zadar' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Zadar', 'Croatia', 'ZAD', 1, 'Alfred Hitchcock called it the most beautiful sunset in the world, and Zadar''s Sea Organ will make you believe him', 'Zadar''s Sea Organ uses underwater pipes and Adriatic tides to create continuous natural music — the world''s first such instrument',
    'Hot dry summers; mild and beautiful in spring and autumn; one of the most authentic Dalmatian cities', 55, 65,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Zadar' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Zadar' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zadar' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zadar' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zadar' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Zadar' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Sea Organ', 'Tidal instrument built into the quayside — waves play music through marble steps', 1 FROM flight.destinations
  WHERE city = 'Zadar' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Roman Forum', 'The largest Roman forum on the eastern Adriatic, still at the heart of the old town', 2 FROM flight.destinations
  WHERE city = 'Zadar' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Plitvice Lakes', 'UNESCO turquoise travertine lake system — one of Europe''s greatest natural wonders, 1.5 hours away', 3 FROM flight.destinations
  WHERE city = 'Zadar' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Slovakia', iata_code = 'TAT', hook = 'Gateway to the High Tatras — hiking and skiing in Slovakia''s most dramatic mountains at prices that make the Alps feel expensive',
    fun_fact = 'The High Tatras are the smallest alpine mountain range in the world yet contain over 200 mountain lakes', weather_summary = 'Cold snowy winters ideal for skiing; beautiful summer hiking; crisp and dramatic year-round',
    flight_cost_per_person_gbp = 45,
    hotel_cost_per_night_gbp = 55,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Poprad' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Poprad', 'Slovakia', 'TAT', 1, 'Gateway to the High Tatras — hiking and skiing in Slovakia''s most dramatic mountains at prices that make the Alps feel expensive', 'The High Tatras are the smallest alpine mountain range in the world yet contain over 200 mountain lakes',
    'Cold snowy winters ideal for skiing; beautiful summer hiking; crisp and dramatic year-round', 45, 55,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Poprad' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Poprad' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Poprad' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Poprad' AND dst.departure_airport_id = 1 AND tt.slug = 'skiing';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Poprad' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'High Tatras Mountain Range', 'Alpine peaks and glacial lakes with hut-to-hut hiking trails', 1 FROM flight.destinations
  WHERE city = 'Poprad' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Štrbské Pleso Lake', 'Glacial lake at 1,346m with mountain reflections and cross-country skiing', 2 FROM flight.destinations
  WHERE city = 'Poprad' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ždiar Village', 'Traditional Gorał mountain village at the foot of the Belianske Tatry', 3 FROM flight.destinations
  WHERE city = 'Poprad' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Austria', iata_code = 'INN', hook = 'The Olympic city in the Alps — ski runs from your doorstep, a golden roof in the old town, and the whole Tyrolean world at your feet',
    fun_fact = 'Innsbruck hosted the Winter Olympics twice — in 1964 and 1976 — and still uses the same ski runs', weather_summary = 'Cold snowy winters perfect for skiing; warm sunny summers ideal for hiking; beautiful year-round',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 85,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Innsbruck' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Innsbruck', 'Austria', 'INN', 1, 'The Olympic city in the Alps — ski runs from your doorstep, a golden roof in the old town, and the whole Tyrolean world at your feet', 'Innsbruck hosted the Winter Olympics twice — in 1964 and 1976 — and still uses the same ski runs',
    'Cold snowy winters perfect for skiing; warm sunny summers ideal for hiking; beautiful year-round', 55, 85,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Innsbruck' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Innsbruck' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Innsbruck' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Innsbruck' AND dst.departure_airport_id = 1 AND tt.slug = 'skiing';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Innsbruck' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Innsbruck' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Golden Roof (Goldenes Dachl)', '15th-century balcony covered in 2,657 fire-gilded copper tiles at the heart of the old town', 1 FROM flight.destinations
  WHERE city = 'Innsbruck' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Nordkette Mountain Railway', 'Cable car from city centre to 2,256m — skiing and hiking from the rooftops', 2 FROM flight.destinations
  WHERE city = 'Innsbruck' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ambras Castle', 'Renaissance castle above the city with Habsburg art collections', 3 FROM flight.destinations
  WHERE city = 'Innsbruck' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Iceland', iata_code = 'KEF', hook = 'The world''s northernmost capital — Northern Lights, geysers, black sand beaches, and a nightlife that goes until the sun forgets to set',
    fun_fact = 'Reykjavik runs almost entirely on geothermal energy, making it one of the cleanest and most sustainable capitals on earth', weather_summary = 'Cold and changeable year-round; summer has 24-hour daylight; winter has Northern Lights; always dramatic',
    flight_cost_per_person_gbp = 75,
    hotel_cost_per_night_gbp = 115,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Reykjavik' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Reykjavik', 'Iceland', 'KEF', 1, 'The world''s northernmost capital — Northern Lights, geysers, black sand beaches, and a nightlife that goes until the sun forgets to set', 'Reykjavik runs almost entirely on geothermal energy, making it one of the cleanest and most sustainable capitals on earth',
    'Cold and changeable year-round; summer has 24-hour daylight; winter has Northern Lights; always dramatic', 75, 115,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Reykjavik' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Reykjavik' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Reykjavik' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Reykjavik' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Reykjavik' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Reykjavik' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Blue Lagoon', 'Geothermal spa of milky-blue water — the most visited attraction in Iceland', 1 FROM flight.destinations
  WHERE city = 'Reykjavik' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Golden Circle', 'Geysir hot springs, Gullfoss waterfall, and Þingvellir — Iceland''s trio of wonders', 2 FROM flight.destinations
  WHERE city = 'Reykjavik' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Northern Lights Tours', 'September–April hunting for the aurora borealis outside the city lights', 3 FROM flight.destinations
  WHERE city = 'Reykjavik' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Morocco', iata_code = 'OZZ', hook = 'The door of the desert — Saharan kasbahs, the Atlas Mountains on the horizon, and film sets that span continents',
    fun_fact = 'Ouarzazate is known as the Hollywood of Africa; Lawrence of Arabia, Gladiator, and Game of Thrones were all filmed here', weather_summary = 'Very hot in summer; warm spring and autumn; cold desert nights year-round; best October–April',
    flight_cost_per_person_gbp = 75,
    hotel_cost_per_night_gbp = 45,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Ouarzazate' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Ouarzazate', 'Morocco', 'OZZ', 1, 'The door of the desert — Saharan kasbahs, the Atlas Mountains on the horizon, and film sets that span continents', 'Ouarzazate is known as the Hollywood of Africa; Lawrence of Arabia, Gladiator, and Game of Thrones were all filmed here',
    'Very hot in summer; warm spring and autumn; cold desert nights year-round; best October–April', 75, 45,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Ouarzazate' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Ouarzazate' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Ouarzazate' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Ouarzazate' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Ouarzazate' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Aït Benhaddou', 'UNESCO World Heritage kasbah — one of Morocco''s most iconic earthen citadels', 1 FROM flight.destinations
  WHERE city = 'Ouarzazate' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Atlas Studios', 'Africa''s largest film studio — tour the sets of Gladiator and Game of Thrones', 2 FROM flight.destinations
  WHERE city = 'Ouarzazate' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Draa Valley Palmeries', '100km of date palms lining a river oasis between the Atlas and the Sahara', 3 FROM flight.destinations
  WHERE city = 'Ouarzazate' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Morocco', iata_code = 'ESU', hook = 'A blue-and-white medina on the Atlantic wind — world-class kite-surfing, Jimi Hendrix''s inspiration, and fish grilled on the harbour wall',
    fun_fact = 'Essaouira''s winds are so reliable it hosted the Kitesurfing World Championship — it''s known as Wind City of Africa', weather_summary = 'Windy and mild year-round; cooler than Marrakech; misty and atmospheric in winter',
    flight_cost_per_person_gbp = 70,
    hotel_cost_per_night_gbp = 55,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Essaouira' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Essaouira', 'Morocco', 'ESU', 1, 'A blue-and-white medina on the Atlantic wind — world-class kite-surfing, Jimi Hendrix''s inspiration, and fish grilled on the harbour wall', 'Essaouira''s winds are so reliable it hosted the Kitesurfing World Championship — it''s known as Wind City of Africa',
    'Windy and mild year-round; cooler than Marrakech; misty and atmospheric in winter', 70, 55,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Essaouira' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Essaouira' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Essaouira' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Essaouira' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Essaouira' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Essaouira' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Medina Ramparts', 'UNESCO-listed sea bastions with cannons facing the Atlantic', 1 FROM flight.destinations
  WHERE city = 'Essaouira' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Moulay Hassan Square', 'Lively main square flanked by blue fishing boats and argan oil stalls', 2 FROM flight.destinations
  WHERE city = 'Essaouira' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Beach Kitesurfing', 'Miles of Atlantic beach consistently rated one of the world''s best kite spots', 3 FROM flight.destinations
  WHERE city = 'Essaouira' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'TPS', hook = 'Salt pans, ancient windmills, and the Egadi Islands just offshore — western Sicily''s hidden gem',
    fun_fact = 'Trapani''s salt pans have produced sea salt since Phoenician times and are now a nature reserve for migratory pink flamingos', weather_summary = 'Hot Mediterranean summers; mild and sunny winter; far less touristy than Palermo or Catania',
    flight_cost_per_person_gbp = 60,
    hotel_cost_per_night_gbp = 60,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Trapani' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Trapani', 'Italy', 'TPS', 1, 'Salt pans, ancient windmills, and the Egadi Islands just offshore — western Sicily''s hidden gem', 'Trapani''s salt pans have produced sea salt since Phoenician times and are now a nature reserve for migratory pink flamingos',
    'Hot Mediterranean summers; mild and sunny winter; far less touristy than Palermo or Catania', 60, 60,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Trapani' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Trapani' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Trapani' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Trapani' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Trapani' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Trapani' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Saline dello Stagnone', 'Ancient salt pans with traditional windmills and flamingo sightings at sunset', 1 FROM flight.destinations
  WHERE city = 'Trapani' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Erice', 'Medieval hilltop town at 750m — cobblestones, Norman castle, and sea views', 2 FROM flight.destinations
  WHERE city = 'Trapani' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Egadi Islands', 'Three islands reached by hydrofoil — clear water, Roman wreck dives, and tuna history', 3 FROM flight.destinations
  WHERE city = 'Trapani' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'KLX', hook = 'Named for its olives, Kalamata surprises — Byzantine ruins, the dramatic Mani Peninsula, and beaches the package-tour crowds haven''t found',
    fun_fact = 'The Kalamata olive has PDO protected status and has been cultivated continuously in the Messenia region since ancient times', weather_summary = 'Very hot summers; mild winters; one of Greece''s sunniest regions; uncrowded compared to the islands',
    flight_cost_per_person_gbp = 62,
    hotel_cost_per_night_gbp = 58,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Kalamata' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Kalamata', 'Greece', 'KLX', 1, 'Named for its olives, Kalamata surprises — Byzantine ruins, the dramatic Mani Peninsula, and beaches the package-tour crowds haven''t found', 'The Kalamata olive has PDO protected status and has been cultivated continuously in the Messenia region since ancient times',
    'Very hot summers; mild winters; one of Greece''s sunniest regions; uncrowded compared to the islands', 62, 58,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Kalamata' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Kalamata' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kalamata' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kalamata' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kalamata' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Kalamata' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ancient Messene', 'One of Greece''s best-preserved ancient cities — theatre, stadium, and temples in situ', 1 FROM flight.destinations
  WHERE city = 'Kalamata' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Mani Peninsula', 'Rugged finger of land with Byzantine tower villages and the deepest cave in Greece', 2 FROM flight.destinations
  WHERE city = 'Kalamata' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Voidokilia Beach', 'Perfect omega-shaped bay ringed by dunes and ancient ruins', 3 FROM flight.destinations
  WHERE city = 'Kalamata' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Turkey', iata_code = 'ASR', hook = 'Gateway to Cappadocia and the slopes of Mount Erciyes — fairy chimneys, hot air balloons, and ancient underground cities',
    fun_fact = 'The underground city of Derinkuyu near Kayseri could house up to 20,000 people and descends 85 metres underground', weather_summary = 'Cold snowy winters with skiing on Erciyes; hot dry summers; spring ideal for balloon flights',
    flight_cost_per_person_gbp = 80,
    hotel_cost_per_night_gbp = 52,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Kayseri' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Kayseri', 'Turkey', 'ASR', 1, 'Gateway to Cappadocia and the slopes of Mount Erciyes — fairy chimneys, hot air balloons, and ancient underground cities', 'The underground city of Derinkuyu near Kayseri could house up to 20,000 people and descends 85 metres underground',
    'Cold snowy winters with skiing on Erciyes; hot dry summers; spring ideal for balloon flights', 80, 52,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Kayseri' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Kayseri' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kayseri' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kayseri' AND dst.departure_airport_id = 1 AND tt.slug = 'skiing';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Kayseri' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Kayseri' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cappadocia Fairy Chimneys', 'Volcanic rock formations sculpted over millennia — sunrise balloon flights above them are unmissable', 1 FROM flight.destinations
  WHERE city = 'Kayseri' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Erciyes Ski Resort', 'Modern ski resort on the slopes of a 3,917m extinct volcano', 2 FROM flight.destinations
  WHERE city = 'Kayseri' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Derinkuyu Underground City', 'Multi-storey ancient city carved into volcanic rock, used for shelter and storage', 3 FROM flight.destinations
  WHERE city = 'Kayseri' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'France', iata_code = 'BIQ', hook = 'Europe''s surf capital — where the Basque Country meets the Atlantic, Art Deco architecture overlooks powerful breaks',
    fun_fact = 'Biarritz was the playground of Napoleon III and Empress Eugénie, who made it the fashionable resort of 19th-century Europe', weather_summary = 'Mild Atlantic climate year-round; famous for powerful surf from autumn to spring; warm beach summers',
    flight_cost_per_person_gbp = 48,
    hotel_cost_per_night_gbp = 85,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Biarritz' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Biarritz', 'France', 'BIQ', 1, 'Europe''s surf capital — where the Basque Country meets the Atlantic, Art Deco architecture overlooks powerful breaks', 'Biarritz was the playground of Napoleon III and Empress Eugénie, who made it the fashionable resort of 19th-century Europe',
    'Mild Atlantic climate year-round; famous for powerful surf from autumn to spring; warm beach summers', 48, 85,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Biarritz' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Biarritz' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Biarritz' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Biarritz' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Biarritz' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Biarritz' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Grande Plage', 'Main beach flanked by the casino — the heart of Biarritz''s Belle Époque identity', 1 FROM flight.destinations
  WHERE city = 'Biarritz' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Rocher de la Vierge', 'Sea stack with a walkway to a statue of the Virgin — crashing waves on three sides', 2 FROM flight.destinations
  WHERE city = 'Biarritz' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cité de l''Océan', 'Award-winning surf and ocean museum on the beachfront', 3 FROM flight.destinations
  WHERE city = 'Biarritz' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'PVK', hook = 'The gateway to the Ionian — a charming fishing port, Roman ruins, and access to some of Greece''s least-visited coastline',
    fun_fact = 'The Battle of Actium, fought near Preveza in 31 BC, was one of history''s most decisive — Octavian''s victory over Antony and Cleopatra changed the world', weather_summary = 'Hot sunny summers; warm spring and autumn; mild winters; the Epirus coast is often overlooked',
    flight_cost_per_person_gbp = 60,
    hotel_cost_per_night_gbp = 58,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Preveza' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Preveza', 'Greece', 'PVK', 1, 'The gateway to the Ionian — a charming fishing port, Roman ruins, and access to some of Greece''s least-visited coastline', 'The Battle of Actium, fought near Preveza in 31 BC, was one of history''s most decisive — Octavian''s victory over Antony and Cleopatra changed the world',
    'Hot sunny summers; warm spring and autumn; mild winters; the Epirus coast is often overlooked', 60, 58,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Preveza' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Preveza' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Preveza' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Preveza' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Preveza' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Preveza' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Nicopolis Ancient City', 'Octavian''s victory city — vast Roman ruins including a theatre and city walls', 1 FROM flight.destinations
  WHERE city = 'Preveza' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Lefkada Island', 'Ionian island accessible by bridge with dramatic cliffs and turquoise beaches', 2 FROM flight.destinations
  WHERE city = 'Preveza' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Parga Town', 'Pastel-painted town spilling down a hillside above a turquoise bay', 3 FROM flight.destinations
  WHERE city = 'Preveza' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'OLB', hook = 'The gateway to the Costa Smeralda — granite boulders, water that turns turquoise, and Sardinian cooking that makes you question everything else',
    fun_fact = 'The Costa Smeralda near Olbia was developed in the 1960s by the Aga Khan and became one of the world''s most exclusive resorts', weather_summary = 'Hot dry summers; mild and beautiful in spring and autumn; excellent beach season May–October',
    flight_cost_per_person_gbp = 60,
    hotel_cost_per_night_gbp = 75,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Olbia' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Olbia', 'Italy', 'OLB', 1, 'The gateway to the Costa Smeralda — granite boulders, water that turns turquoise, and Sardinian cooking that makes you question everything else', 'The Costa Smeralda near Olbia was developed in the 1960s by the Aga Khan and became one of the world''s most exclusive resorts',
    'Hot dry summers; mild and beautiful in spring and autumn; excellent beach season May–October', 60, 75,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Olbia' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Olbia' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Olbia' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Olbia' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Olbia' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Olbia' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Costa Smeralda', 'Emerald-coast coves, gin-clear water, and granite headlands north of Olbia', 1 FROM flight.destinations
  WHERE city = 'Olbia' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Maddalena Archipelago', '7-island national park with boat trips through some of Italy''s finest waters', 2 FROM flight.destinations
  WHERE city = 'Olbia' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Tavolara Island', 'Dramatic limestone island rising 565m from the sea — day trips by boat', 3 FROM flight.destinations
  WHERE city = 'Olbia' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'AHO', hook = 'Sardinia''s Catalan city — Gothic churches, coral jewellery, and Neptune''s Grotto reached by cliff staircase or boat',
    fun_fact = 'Alghero has spoken Catalan since 1353 when Catalans repopulated the city — the language is still officially recognised and taught today', weather_summary = 'Hot Mediterranean summers; mild and uncrowded in spring and autumn; perfect for coastal cycling',
    flight_cost_per_person_gbp = 60,
    hotel_cost_per_night_gbp = 68,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Alghero' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Alghero', 'Italy', 'AHO', 1, 'Sardinia''s Catalan city — Gothic churches, coral jewellery, and Neptune''s Grotto reached by cliff staircase or boat', 'Alghero has spoken Catalan since 1353 when Catalans repopulated the city — the language is still officially recognised and taught today',
    'Hot Mediterranean summers; mild and uncrowded in spring and autumn; perfect for coastal cycling', 60, 68,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Alghero' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Alghero' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Alghero' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Alghero' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Alghero' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Alghero' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Neptune''s Grotto', 'Dramatic sea cave reached by 654 steps cut into the cliff face or by boat', 1 FROM flight.destinations
  WHERE city = 'Alghero' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Alghero Old Town Walls', '16th-century sea bastions forming a promenade above the harbour', 2 FROM flight.destinations
  WHERE city = 'Alghero' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Capo Caccia Cliffs', 'Towering white limestone headland with vertical sea cliffs and falcon nests', 3 FROM flight.destinations
  WHERE city = 'Alghero' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'CAG', hook = 'Sardinia''s ancient capital — Roman ruins, a pink flamingo lagoon, and white-sand beaches a bus ride from the city centre',
    fun_fact = 'Cagliari''s Molentargius lagoon attracts over 15,000 flamingos each year migrating from the Camargue in France', weather_summary = 'Very hot summers; mild winters; excellent beach season; spring flamingo sightings are spectacular',
    flight_cost_per_person_gbp = 58,
    hotel_cost_per_night_gbp = 65,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Cagliari' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Cagliari', 'Italy', 'CAG', 1, 'Sardinia''s ancient capital — Roman ruins, a pink flamingo lagoon, and white-sand beaches a bus ride from the city centre', 'Cagliari''s Molentargius lagoon attracts over 15,000 flamingos each year migrating from the Camargue in France',
    'Very hot summers; mild winters; excellent beach season; spring flamingo sightings are spectacular', 58, 65,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Cagliari' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Cagliari' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Cagliari' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Cagliari' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Cagliari' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Cagliari' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Poetto Beach', '8km of golden sand beach a short bus ride from the historic centre', 1 FROM flight.destinations
  WHERE city = 'Cagliari' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Nora Archaeological Site', 'Phoenician and Roman ruins on a headland jutting into the Mediterranean', 2 FROM flight.destinations
  WHERE city = 'Cagliari' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Castello Quarter', 'Medieval walled hilltop with panoramic sea views and Pisan towers', 3 FROM flight.destinations
  WHERE city = 'Cagliari' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Egypt', iata_code = 'SSH', hook = 'World-class coral reefs, year-round Red Sea sunshine, and resort luxury at prices that still feel implausible',
    fun_fact = 'Ras Mohammed National Park near Sharm el-Sheikh has over 220 species of coral and 1,000 species of fish', weather_summary = 'Sunny and warm year-round; almost never rains; sea temperature stays above 20°C even in winter',
    flight_cost_per_person_gbp = 90,
    hotel_cost_per_night_gbp = 52,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Sharm El Sheikh' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Sharm El Sheikh', 'Egypt', 'SSH', 1, 'World-class coral reefs, year-round Red Sea sunshine, and resort luxury at prices that still feel implausible', 'Ras Mohammed National Park near Sharm el-Sheikh has over 220 species of coral and 1,000 species of fish',
    'Sunny and warm year-round; almost never rains; sea temperature stays above 20°C even in winter', 90, 52,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Sharm El Sheikh' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Sharm El Sheikh' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Sharm El Sheikh' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Sharm El Sheikh' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Sharm El Sheikh' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Sharm El Sheikh' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ras Mohammed National Park', 'Egypt''s finest diving and snorkelling — sharks, rays, and walls of coral', 1 FROM flight.destinations
  WHERE city = 'Sharm El Sheikh' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Blue Hole', 'Legendary Red Sea dive site — a 100m vertical shaft through a coral reef', 2 FROM flight.destinations
  WHERE city = 'Sharm El Sheikh' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Naama Bay', 'Horseshoe-shaped bay of calm shallow water ideal for snorkelling from the beach', 3 FROM flight.destinations
  WHERE city = 'Sharm El Sheikh' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Morocco', iata_code = 'AGA', hook = 'Morocco''s beach resort on the Atlantic — reliable sunshine, a crescent bay, and the Atlas Mountains on the horizon',
    fun_fact = 'Agadir was entirely destroyed by an earthquake in 1960 and rebuilt from scratch — almost the whole city is less than 70 years old', weather_summary = 'Warm and sunny year-round; rarely above 28°C; one of Morocco''s most reliable beach destinations',
    flight_cost_per_person_gbp = 72,
    hotel_cost_per_night_gbp = 55,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Agadir' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Agadir', 'Morocco', 'AGA', 1, 'Morocco''s beach resort on the Atlantic — reliable sunshine, a crescent bay, and the Atlas Mountains on the horizon', 'Agadir was entirely destroyed by an earthquake in 1960 and rebuilt from scratch — almost the whole city is less than 70 years old',
    'Warm and sunny year-round; rarely above 28°C; one of Morocco''s most reliable beach destinations', 72, 55,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Agadir' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Agadir' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Agadir' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Agadir' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Agadir' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Agadir' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Agadir Beach', '10km of Atlantic beach with calm surf and promenade cafés', 1 FROM flight.destinations
  WHERE city = 'Agadir' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Souk El Had', 'Agadir''s vast market — spices, argan oil, leather, and Moroccan ceramics', 2 FROM flight.destinations
  WHERE city = 'Agadir' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Paradise Valley', 'Natural gorge with rock pools and palm trees, 1 hour inland', 3 FROM flight.destinations
  WHERE city = 'Agadir' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Greece', iata_code = 'JSI', hook = 'The Mamma Mia island — pine trees tumbling to turquoise water, and the legendary Lalaria Beach only reachable by boat',
    fun_fact = 'Skiathos has over 60 beaches squeezed into an island just 12km long — one of the highest ratios of beach to land in Greece', weather_summary = 'Hot sunny summers; green and lush compared to drier Greek islands; best May–September',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Skiathos' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Skiathos', 'Greece', 'JSI', 1, 'The Mamma Mia island — pine trees tumbling to turquoise water, and the legendary Lalaria Beach only reachable by boat', 'Skiathos has over 60 beaches squeezed into an island just 12km long — one of the highest ratios of beach to land in Greece',
    'Hot sunny summers; green and lush compared to drier Greek islands; best May–September', 65, 72,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Skiathos' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Skiathos' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Skiathos' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Skiathos' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Skiathos' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Koukounaries Beach', 'Pine-backed golden beach consistently ranked among Greece''s finest', 1 FROM flight.destinations
  WHERE city = 'Skiathos' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Lalaria Beach', 'White marble pebble beach accessible only by boat, with natural rock arches', 2 FROM flight.destinations
  WHERE city = 'Skiathos' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Skiathos Old Town', 'Lively harbour town with tavernas, bars, and a colourful evening promenade', 3 FROM flight.destinations
  WHERE city = 'Skiathos' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'SDR', hook = 'Northern Spain''s elegant beach city — fin de siècle promenades, surfable Atlantic waves, and pintxos at every corner',
    fun_fact = 'Santander was once the summer residence of the Spanish royal family, with Alfonso XIII building his summer palace here in 1908', weather_summary = 'Cooler than southern Spain; green and fresh; good surf year-round; warm beach season July–August',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 70,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Santander' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Santander', 'Spain', 'SDR', 1, 'Northern Spain''s elegant beach city — fin de siècle promenades, surfable Atlantic waves, and pintxos at every corner', 'Santander was once the summer residence of the Spanish royal family, with Alfonso XIII building his summer palace here in 1908',
    'Cooler than southern Spain; green and fresh; good surf year-round; warm beach season July–August', 50, 70,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Santander' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Santander' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Santander' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Santander' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Santander' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Santander' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Palacio de la Magdalena', 'Romantic royal summer palace on its own peninsula above the sea', 1 FROM flight.destinations
  WHERE city = 'Santander' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'El Sardinero Beach', 'Belle Époque resort beach with a grand casino and wide Atlantic views', 2 FROM flight.destinations
  WHERE city = 'Santander' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Centro Botín', 'Renzo Piano arts centre cantilevered over the bay — Cantabrian art and culture', 3 FROM flight.destinations
  WHERE city = 'Santander' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Morocco', iata_code = 'TNG', hook = 'Where Africa meets Europe — a port city of Casbah mystery, literary ghosts, and panoramic views of two continents',
    fun_fact = 'Tangier was an International Zone controlled by multiple nations until 1956, attracting writers including Burroughs, Kerouac, and Tennessee Williams', weather_summary = 'Mild Mediterranean climate; rarely extreme; breezy year-round; pleasant spring and autumn',
    flight_cost_per_person_gbp = 68,
    hotel_cost_per_night_gbp = 52,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Tangier' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Tangier', 'Morocco', 'TNG', 1, 'Where Africa meets Europe — a port city of Casbah mystery, literary ghosts, and panoramic views of two continents', 'Tangier was an International Zone controlled by multiple nations until 1956, attracting writers including Burroughs, Kerouac, and Tennessee Williams',
    'Mild Mediterranean climate; rarely extreme; breezy year-round; pleasant spring and autumn', 68, 52,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Tangier' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Tangier' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tangier' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tangier' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tangier' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Tangier' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Kasbah Museum', '17th-century palace with Moroccan artefacts and a garden terrace over the Strait', 1 FROM flight.destinations
  WHERE city = 'Tangier' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cap Spartel', 'Africa''s northwestern tip — the point where the Atlantic meets the Mediterranean', 2 FROM flight.destinations
  WHERE city = 'Tangier' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Grand Socco', 'Main square linking the medina to the modern city, lively with market traders', 3 FROM flight.destinations
  WHERE city = 'Tangier' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'France', iata_code = 'NCE', hook = 'The queen of the Côte d''Azur — the Promenade des Anglais, old-town colour, and the Alps rising behind the Riviera',
    fun_fact = 'Nice was part of Italy until 1860 when it was ceded to France — Niçois cooking still reflects this Italian heritage', weather_summary = '300 days of sunshine; mild winters; hot summers; the most reliable weather on the French Riviera',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 95,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Nice' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Nice', 'France', 'NCE', 1, 'The queen of the Côte d''Azur — the Promenade des Anglais, old-town colour, and the Alps rising behind the Riviera', 'Nice was part of Italy until 1860 when it was ceded to France — Niçois cooking still reflects this Italian heritage',
    '300 days of sunshine; mild winters; hot summers; the most reliable weather on the French Riviera', 55, 95,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Nice' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Nice' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Nice' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Nice' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Nice' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Nice' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Promenade des Anglais', 'The iconic seafront boulevard stretching 7km along the Baie des Anges', 1 FROM flight.destinations
  WHERE city = 'Nice' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Vieux Nice', 'Baroque old town of Italian-influenced alleyways, markets, and restaurants', 2 FROM flight.destinations
  WHERE city = 'Nice' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cours Saleya Flower Market', 'Daily flower and produce market in the heart of the old town', 3 FROM flight.destinations
  WHERE city = 'Nice' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Cyprus', iata_code = 'PFO', hook = 'Where Aphrodite was born — UNESCO archaeological mosaics, a castle on the harbour, and the warmest winter sun in Europe',
    fun_fact = 'Paphos''s floor mosaics, discovered in 1962, are considered among the finest in the world and cover 2,000 square metres', weather_summary = 'The sunniest part of Cyprus; warm enough to swim April–November; a popular mild-winter retreat',
    flight_cost_per_person_gbp = 70,
    hotel_cost_per_night_gbp = 65,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Paphos' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Paphos', 'Cyprus', 'PFO', 1, 'Where Aphrodite was born — UNESCO archaeological mosaics, a castle on the harbour, and the warmest winter sun in Europe', 'Paphos''s floor mosaics, discovered in 1962, are considered among the finest in the world and cover 2,000 square metres',
    'The sunniest part of Cyprus; warm enough to swim April–November; a popular mild-winter retreat', 70, 65,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Paphos' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Paphos' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Paphos' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Paphos' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Paphos' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Paphos' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Paphos Archaeological Park', 'UNESCO site of Roman villas with extraordinary floor mosaics depicting mythology', 1 FROM flight.destinations
  WHERE city = 'Paphos' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Aphrodite''s Rock', 'Sea stack where the goddess of love is said to have risen from the foam', 2 FROM flight.destinations
  WHERE city = 'Paphos' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Paphos Harbour Castle', 'Medieval castle at the end of the fishing harbour with panoramic sea views', 3 FROM flight.destinations
  WHERE city = 'Paphos' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Cyprus', iata_code = 'LCA', hook = 'Cyprus''s beach gateway — the island''s longest sandy shore, a medieval salt lake with flamingos, and the church of Lazarus',
    fun_fact = 'Larnaca''s Salt Lake attracts thousands of flamingos each winter — one of the largest migratory bird habitats in the eastern Mediterranean', weather_summary = 'Very sunny and hot in summer; warm and pleasant winters; ideal year-round beach weather',
    flight_cost_per_person_gbp = 68,
    hotel_cost_per_night_gbp = 62,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Larnaca' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Larnaca', 'Cyprus', 'LCA', 1, 'Cyprus''s beach gateway — the island''s longest sandy shore, a medieval salt lake with flamingos, and the church of Lazarus', 'Larnaca''s Salt Lake attracts thousands of flamingos each winter — one of the largest migratory bird habitats in the eastern Mediterranean',
    'Very sunny and hot in summer; warm and pleasant winters; ideal year-round beach weather', 68, 62,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Larnaca' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Larnaca' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Larnaca' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Larnaca' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Larnaca' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Larnaca' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Mackenzie Beach', 'Long sandy beach flanked by seafood restaurants and shaded tavernas', 1 FROM flight.destinations
  WHERE city = 'Larnaca' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Church of Saint Lazarus', '9th-century Byzantine church said to contain the tomb of the resurrected Lazarus', 2 FROM flight.destinations
  WHERE city = 'Larnaca' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Hala Sultan Tekke Mosque', '17th-century mosque on the shore of the Salt Lake — one of Islam''s holiest sites', 3 FROM flight.destinations
  WHERE city = 'Larnaca' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Turkey', iata_code = 'BJV', hook = 'The St Tropez of Turkey — white cube houses tumbling to a crusader castle, yacht-filled bays, and Aegean evenings that last forever',
    fun_fact = 'The Mausoleum at Halicarnassus, one of the Seven Wonders of the Ancient World, was built in what is now Bodrum in 353 BC', weather_summary = 'Very hot July–August; warm and lovely May–June and September–October; mild winters',
    flight_cost_per_person_gbp = 75,
    hotel_cost_per_night_gbp = 70,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Bodrum' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Bodrum', 'Turkey', 'BJV', 1, 'The St Tropez of Turkey — white cube houses tumbling to a crusader castle, yacht-filled bays, and Aegean evenings that last forever', 'The Mausoleum at Halicarnassus, one of the Seven Wonders of the Ancient World, was built in what is now Bodrum in 353 BC',
    'Very hot July–August; warm and lovely May–June and September–October; mild winters', 75, 70,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Bodrum' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bodrum' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bodrum' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bodrum' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bodrum' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bodrum' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Bodrum Castle', '15th-century crusader fortress housing the Museum of Underwater Archaeology', 1 FROM flight.destinations
  WHERE city = 'Bodrum' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Mausoleum of Halicarnassus', 'Ruins of one of the Seven Wonders of the Ancient World in the town centre', 2 FROM flight.destinations
  WHERE city = 'Bodrum' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Gümüşlük Village', 'Bohemian fishing village with seafood restaurants built over ancient ruins', 3 FROM flight.destinations
  WHERE city = 'Bodrum' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'RMI', hook = 'Italy''s Adriatic playground — 15km of sandy beach with Roman arches at the end of the street',
    fun_fact = 'Rimini was founded by the Romans in 268 BC and still has the oldest surviving Roman bridge in the world — the Ponte di Tiberio', weather_summary = 'Hot Adriatic summers; mild winters; beach season June–September; accessible year-round',
    flight_cost_per_person_gbp = 52,
    hotel_cost_per_night_gbp = 65,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Rimini' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Rimini', 'Italy', 'RMI', 1, 'Italy''s Adriatic playground — 15km of sandy beach with Roman arches at the end of the street', 'Rimini was founded by the Romans in 268 BC and still has the oldest surviving Roman bridge in the world — the Ponte di Tiberio',
    'Hot Adriatic summers; mild winters; beach season June–September; accessible year-round', 52, 65,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Rimini' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Rimini' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rimini' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rimini' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rimini' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Rimini' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ponte di Tiberio', 'The oldest surviving Roman bridge in the world, still in daily use after 2,000 years', 1 FROM flight.destinations
  WHERE city = 'Rimini' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Arch of Augustus', '1st-century BC triumphal arch marking the beginning of the Via Flaminia', 2 FROM flight.destinations
  WHERE city = 'Rimini' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Rimini Beach', 'Miles of organised Adriatic beach clubs — lidos, umbrellas, and Spritz at sunset', 3 FROM flight.destinations
  WHERE city = 'Rimini' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'REG', hook = 'Italy''s toe, facing Sicily across the Strait of Messina — home to the world''s most perfect bronze statues and views that rearrange your sense of beauty',
    fun_fact = 'The Riace Bronzes, discovered off Reggio''s coast in 1972, are the finest surviving examples of ancient Greek bronze sculpture in existence', weather_summary = 'Very hot summers; mild winters; one of Italy''s sunniest regions; far off the tourist trail',
    flight_cost_per_person_gbp = 62,
    hotel_cost_per_night_gbp = 55,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Reggio Calabria' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Reggio Calabria', 'Italy', 'REG', 1, 'Italy''s toe, facing Sicily across the Strait of Messina — home to the world''s most perfect bronze statues and views that rearrange your sense of beauty', 'The Riace Bronzes, discovered off Reggio''s coast in 1972, are the finest surviving examples of ancient Greek bronze sculpture in existence',
    'Very hot summers; mild winters; one of Italy''s sunniest regions; far off the tourist trail', 62, 55,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Reggio Calabria' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Reggio Calabria' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Reggio Calabria' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Reggio Calabria' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Reggio Calabria' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Riace Bronzes', '5th-century BC Greek bronze warriors at the National Museum — the finest ancient bronzes in the world', 1 FROM flight.destinations
  WHERE city = 'Reggio Calabria' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Lungomare Falcomatà', 'D''Annunzio''s ''most beautiful kilometre in Italy'' — promenade with views to Mount Etna', 2 FROM flight.destinations
  WHERE city = 'Reggio Calabria' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Strait of Messina Views', 'Sicily rising across 3km of water — a view that has awed travellers since antiquity', 3 FROM flight.destinations
  WHERE city = 'Reggio Calabria' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'PMO', hook = 'Sicily''s chaotic, magnificent capital — Arab-Norman churches, the oldest food market in Europe, and street food that turns strangers into friends',
    fun_fact = 'Palermo''s Ballarò market has been running since the 10th century, making it one of the oldest continuously operating street markets in the world', weather_summary = 'Hot Mediterranean summers; mild winters; excellent spring and autumn for food and culture',
    flight_cost_per_person_gbp = 58,
    hotel_cost_per_night_gbp = 62,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Palermo' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Palermo', 'Italy', 'PMO', 1, 'Sicily''s chaotic, magnificent capital — Arab-Norman churches, the oldest food market in Europe, and street food that turns strangers into friends', 'Palermo''s Ballarò market has been running since the 10th century, making it one of the oldest continuously operating street markets in the world',
    'Hot Mediterranean summers; mild winters; excellent spring and autumn for food and culture', 58, 62,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Palermo' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Palermo' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Palermo' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Palermo' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Palermo' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Palermo' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ballarò Market', 'Chaotic, aromatic street market of Arab origin — arancini, seafood, and vendor calls', 1 FROM flight.destinations
  WHERE city = 'Palermo' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cappella Palatina', 'Arab-Norman palace chapel with the finest Byzantine mosaics outside Istanbul', 2 FROM flight.destinations
  WHERE city = 'Palermo' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Catacombe dei Cappuccini', 'Catacombs housing 8,000 clothed and displayed mummies — macabre and unmissable', 3 FROM flight.destinations
  WHERE city = 'Palermo' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'SUF', hook = 'Gateway to the toe of Italy''s boot — rugged mountains, crystal Tyrrhenian coves, and Greek temples older than Rome',
    fun_fact = 'Calabria was the heart of Magna Graecia — it has more ancient Greek ruins than anywhere outside Greece itself', weather_summary = 'Very hot summers; mild winters; beaches June–October; uncrowded mountain hiking year-round',
    flight_cost_per_person_gbp = 62,
    hotel_cost_per_night_gbp = 55,
    default_duration_nights = 7, is_active = true
  WHERE city = 'Lamezia Terme' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Lamezia Terme', 'Italy', 'SUF', 1, 'Gateway to the toe of Italy''s boot — rugged mountains, crystal Tyrrhenian coves, and Greek temples older than Rome', 'Calabria was the heart of Magna Graecia — it has more ancient Greek ruins than anywhere outside Greece itself',
    'Very hot summers; mild winters; beaches June–October; uncrowded mountain hiking year-round', 62, 55,
    7, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Lamezia Terme' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Lamezia Terme' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Lamezia Terme' AND dst.departure_airport_id = 1 AND tt.slug = 'relaxation';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Lamezia Terme' AND dst.departure_airport_id = 1 AND tt.slug = 'beach';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Lamezia Terme' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Lamezia Terme' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Tropea', 'Italy''s most dramatic cliff-top village — a red-rock promontory above turquoise sea', 1 FROM flight.destinations
  WHERE city = 'Lamezia Terme' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Capo Vaticano Beach', 'Wild crystalline beach with views to the Aeolian Islands on clear days', 2 FROM flight.destinations
  WHERE city = 'Lamezia Terme' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Locri Archaeological Park', 'Ancient Greek colony with temples, a theatre, and a rich museum', 3 FROM flight.destinations
  WHERE city = 'Lamezia Terme' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Turkey', iata_code = 'IST', hook = 'The city where continents collide — a skyline of minarets, a bazaar that never sleeps, and Bosphorus sunsets that rearrange your sense of beauty',
    fun_fact = 'Istanbul is the only city in the world that straddles two continents, with Europe on the west bank and Asia on the east', weather_summary = 'Four seasons; best in spring (May) and autumn (September–October); hot summers, cold winters with occasional snow',
    flight_cost_per_person_gbp = 75,
    hotel_cost_per_night_gbp = 68,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Istanbul' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Istanbul', 'Turkey', 'IST', 1, 'The city where continents collide — a skyline of minarets, a bazaar that never sleeps, and Bosphorus sunsets that rearrange your sense of beauty', 'Istanbul is the only city in the world that straddles two continents, with Europe on the west bank and Asia on the east',
    'Four seasons; best in spring (May) and autumn (September–October); hot summers, cold winters with occasional snow', 75, 68,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Istanbul' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Istanbul' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Istanbul' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Istanbul' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Istanbul' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Hagia Sophia', 'Justinian''s 6th-century cathedral turned mosque — the greatest surviving Byzantine building', 1 FROM flight.destinations
  WHERE city = 'Istanbul' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Grand Bazaar', '4,000 shops in a covered labyrinth operating continuously since 1461', 2 FROM flight.destinations
  WHERE city = 'Istanbul' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Bosphorus Cruise', 'Boat trip through the strait dividing two continents, past palaces and fortresses', 3 FROM flight.destinations
  WHERE city = 'Istanbul' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Northern Ireland', iata_code = 'BFS', hook = 'A city reborn from its troubled past — Titanic quarter, murals on every peace wall, and a pub warmth unmatched in the British Isles',
    fun_fact = 'The RMS Titanic was built in Belfast''s Harland and Wolff shipyard and launched in 1911 — the city has fully reclaimed its most famous ship', weather_summary = 'Mild but rainy year-round; layers essential; enjoyable in any weather with the right company',
    flight_cost_per_person_gbp = 28,
    hotel_cost_per_night_gbp = 78,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Belfast' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Belfast', 'Northern Ireland', 'BFS', 1, 'A city reborn from its troubled past — Titanic quarter, murals on every peace wall, and a pub warmth unmatched in the British Isles', 'The RMS Titanic was built in Belfast''s Harland and Wolff shipyard and launched in 1911 — the city has fully reclaimed its most famous ship',
    'Mild but rainy year-round; layers essential; enjoyable in any weather with the right company', 28, 78,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Belfast' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Belfast' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Belfast' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Belfast' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Belfast' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Titanic Belfast Museum', 'World''s largest Titanic visitor experience in the shipyard where she was built', 1 FROM flight.destinations
  WHERE city = 'Belfast' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cathedral Quarter', 'Victorian linen warehouses turned into the best bar and arts scene in Ireland', 2 FROM flight.destinations
  WHERE city = 'Belfast' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Giant''s Causeway', 'UNESCO volcanic hexagonal columns on the Antrim coast — 1 hour by bus', 3 FROM flight.destinations
  WHERE city = 'Belfast' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Romania', iata_code = 'OTP', hook = 'Europe''s most underrated capital — Belle Époque boulevards, Ceaușescu''s insane palace, and a nightlife that gives Ibiza pause for thought',
    fun_fact = 'Bucharest''s Palace of Parliament is the world''s second-largest administrative building, with 1,100 rooms and 12 floors', weather_summary = 'Hot summers, cold winters; best in spring and early autumn; continental climate',
    flight_cost_per_person_gbp = 48,
    hotel_cost_per_night_gbp = 52,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Bucharest' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Bucharest', 'Romania', 'OTP', 1, 'Europe''s most underrated capital — Belle Époque boulevards, Ceaușescu''s insane palace, and a nightlife that gives Ibiza pause for thought', 'Bucharest''s Palace of Parliament is the world''s second-largest administrative building, with 1,100 rooms and 12 floors',
    'Hot summers, cold winters; best in spring and early autumn; continental climate', 48, 52,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Bucharest' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bucharest' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bucharest' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bucharest' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bucharest' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Palace of Parliament', 'Ceaușescu''s megalomaniacal project — the second-heaviest building on earth', 1 FROM flight.destinations
  WHERE city = 'Bucharest' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Old Town (Lipscani)', 'Medieval merchant quarter now packed with rooftop bars and street art', 2 FROM flight.destinations
  WHERE city = 'Bucharest' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Herăstrău Park', 'Vast lake park with a village museum of traditional Romanian architecture', 3 FROM flight.destinations
  WHERE city = 'Bucharest' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Denmark', iata_code = 'CPH', hook = 'The world''s happiest city — Noma''s neighbourhood, harbour baths, and a hygge culture that makes you want to move in',
    fun_fact = 'Copenhagen''s Noma restaurant has been named the world''s best restaurant multiple times, sparking the entire New Nordic cuisine movement', weather_summary = 'Cool summers, cold winters; best June–August; famous for cycling infrastructure and long summer evenings',
    flight_cost_per_person_gbp = 42,
    hotel_cost_per_night_gbp = 108,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Copenhagen' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Copenhagen', 'Denmark', 'CPH', 1, 'The world''s happiest city — Noma''s neighbourhood, harbour baths, and a hygge culture that makes you want to move in', 'Copenhagen''s Noma restaurant has been named the world''s best restaurant multiple times, sparking the entire New Nordic cuisine movement',
    'Cool summers, cold winters; best June–August; famous for cycling infrastructure and long summer evenings', 42, 108,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Copenhagen' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Copenhagen' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Copenhagen' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Copenhagen' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Copenhagen' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Nyhavn Harbour', 'Candy-coloured 17th-century townhouses lining a canal thick with sailing ships', 1 FROM flight.destinations
  WHERE city = 'Copenhagen' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Tivoli Gardens', 'World''s second-oldest amusement park — romantic, illuminated, and timeless', 2 FROM flight.destinations
  WHERE city = 'Copenhagen' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'The Little Mermaid & Kastellet', 'Iconic bronze statue and star-shaped Renaissance fortress on the harbour', 3 FROM flight.destinations
  WHERE city = 'Copenhagen' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Netherlands', iata_code = 'EIN', hook = 'Europe''s design capital — Philips''s hometown reinvented as a playground of innovation, street art, and the world''s best design week',
    fun_fact = 'Eindhoven hosts Dutch Design Week every October — the largest design event in Northern Europe with over 350,000 visitors', weather_summary = 'Mild Atlantic climate; four seasons; slightly warmer than Amsterdam; popular year-round for short breaks',
    flight_cost_per_person_gbp = 32,
    hotel_cost_per_night_gbp = 78,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Eindhoven' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Eindhoven', 'Netherlands', 'EIN', 1, 'Europe''s design capital — Philips''s hometown reinvented as a playground of innovation, street art, and the world''s best design week', 'Eindhoven hosts Dutch Design Week every October — the largest design event in Northern Europe with over 350,000 visitors',
    'Mild Atlantic climate; four seasons; slightly warmer than Amsterdam; popular year-round for short breaks', 32, 78,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Eindhoven' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Eindhoven' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Eindhoven' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Eindhoven' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Eindhoven' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Dutch Design Foundation', 'Hub of the global design industry — exhibitions, talks, and installations year-round', 1 FROM flight.destinations
  WHERE city = 'Eindhoven' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Strijp-S', 'Vast former Philips factory complex turned into Eindhoven''s most creative district', 2 FROM flight.destinations
  WHERE city = 'Eindhoven' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Van Abbemuseum', 'One of Europe''s finest collections of modern and contemporary art', 3 FROM flight.destinations
  WHERE city = 'Eindhoven' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Ireland', iata_code = 'ORK', hook = 'Ireland''s food capital and rebel city — the English Market, the world''s oldest jazz festival, and Kinsale around the corner',
    fun_fact = 'Cork''s English Market has been operating since 1788 and was visited by Queen Elizabeth II in 2011 — her first visit to the Republic of Ireland', weather_summary = 'Mild and rainy year-round; slightly warmer than Dublin; beautiful in all seasons',
    flight_cost_per_person_gbp = 30,
    hotel_cost_per_night_gbp = 82,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Cork' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Cork', 'Ireland', 'ORK', 1, 'Ireland''s food capital and rebel city — the English Market, the world''s oldest jazz festival, and Kinsale around the corner', 'Cork''s English Market has been operating since 1788 and was visited by Queen Elizabeth II in 2011 — her first visit to the Republic of Ireland',
    'Mild and rainy year-round; slightly warmer than Dublin; beautiful in all seasons', 30, 82,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Cork' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Cork' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Cork' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Cork' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Cork' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'English Market', '18th-century indoor food market — artisan cheese, fresh fish, and tripe at 7am', 1 FROM flight.destinations
  WHERE city = 'Cork' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Blarney Castle', 'Medieval castle with the famous Blarney Stone that confers the gift of eloquence', 2 FROM flight.destinations
  WHERE city = 'Cork' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Kinsale', 'Gourmet capital of Ireland — colourful fishing port 30 minutes south of the city', 3 FROM flight.destinations
  WHERE city = 'Cork' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Austria', iata_code = 'VIE', hook = 'The city of music, coffee houses, and a grandeur that makes other capitals feel like they''re still trying',
    fun_fact = 'Vienna has topped the Mercer Quality of Living Survey as the world''s most liveable city for over a decade running', weather_summary = 'Hot summers, cold winters with snow; spring and autumn are golden; Christmas markets are legendary',
    flight_cost_per_person_gbp = 52,
    hotel_cost_per_night_gbp = 88,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Vienna' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Vienna', 'Austria', 'VIE', 1, 'The city of music, coffee houses, and a grandeur that makes other capitals feel like they''re still trying', 'Vienna has topped the Mercer Quality of Living Survey as the world''s most liveable city for over a decade running',
    'Hot summers, cold winters with snow; spring and autumn are golden; Christmas markets are legendary', 52, 88,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Vienna' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Vienna' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Vienna' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Vienna' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Vienna' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Schönbrunn Palace', 'Habsburg summer palace with 1,441 rooms and formal gardens open to all', 1 FROM flight.destinations
  WHERE city = 'Vienna' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Vienna State Opera', 'One of the world''s great opera houses — standing tickets available daily', 2 FROM flight.destinations
  WHERE city = 'Vienna' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Naschmarkt', 'Vienna''s historic outdoor market — stalls of cheese, spice, and Viennese coffee culture', 3 FROM flight.destinations
  WHERE city = 'Vienna' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Albania', iata_code = 'TIA', hook = 'Europe''s most surprising capital — pastel-painted buildings, a bunker turned art gallery, and prices that make you check the exchange rate twice',
    fun_fact = 'Albania has more than 173,000 concrete bunkers built by communist dictator Enver Hoxha — one for every four people in the country', weather_summary = 'Hot Mediterranean summers; mild winters; close to Adriatic beaches; pleasant spring and autumn',
    flight_cost_per_person_gbp = 58,
    hotel_cost_per_night_gbp = 42,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Tirana' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Tirana', 'Albania', 'TIA', 1, 'Europe''s most surprising capital — pastel-painted buildings, a bunker turned art gallery, and prices that make you check the exchange rate twice', 'Albania has more than 173,000 concrete bunkers built by communist dictator Enver Hoxha — one for every four people in the country',
    'Hot Mediterranean summers; mild winters; close to Adriatic beaches; pleasant spring and autumn', 58, 42,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Tirana' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Tirana' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tirana' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tirana' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Tirana' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Bunk''Art Museum', 'Cold War nuclear bunker converted into a museum of Albanian communist history', 1 FROM flight.destinations
  WHERE city = 'Tirana' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Skanderbeg Square', 'Vast central square — rebuilt in 2017 as a pedestrian cultural hub', 2 FROM flight.destinations
  WHERE city = 'Tirana' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Blloku District', 'Former communist elite neighbourhood, now Tirana''s liveliest café and bar quarter', 3 FROM flight.destinations
  WHERE city = 'Tirana' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Germany', iata_code = 'CGN', hook = 'Gothic cathedral, Rhenish beer halls, and a carnival that transforms the city into Europe''s most raucous street party',
    fun_fact = 'Cologne''s cathedral took 632 years to build — from 1248 to 1880 — and is the most visited landmark in Germany', weather_summary = 'Mild four-season climate; cold winters; warm and lively summers; Cologne Carnival in February is unmissable',
    flight_cost_per_person_gbp = 35,
    hotel_cost_per_night_gbp = 78,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Cologne' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Cologne', 'Germany', 'CGN', 1, 'Gothic cathedral, Rhenish beer halls, and a carnival that transforms the city into Europe''s most raucous street party', 'Cologne''s cathedral took 632 years to build — from 1248 to 1880 — and is the most visited landmark in Germany',
    'Mild four-season climate; cold winters; warm and lively summers; Cologne Carnival in February is unmissable', 35, 78,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Cologne' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Cologne' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Cologne' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Cologne' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Cologne' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cologne Cathedral', 'Gothic masterpiece containing the Shrine of the Three Kings — 632 years in the building', 1 FROM flight.destinations
  WHERE city = 'Cologne' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cologne Carnival', 'Three days in February when 1 million people in costumes take over the city', 2 FROM flight.destinations
  WHERE city = 'Cologne' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Rhine Riverfront & Altstadt', 'Colourful old town alongside the Rhine — Kölsch beer in every brewery tap room', 3 FROM flight.destinations
  WHERE city = 'Cologne' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Bulgaria', iata_code = 'SOF', hook = 'The Balkans'' most dynamic capital — Soviet mosaics beside Orthodox gold domes, mountains 30 minutes away, and prices that feel like 2005',
    fun_fact = 'Sofia is one of Europe''s oldest cities with settlements dating back 8,000 years — older than Rome or Athens', weather_summary = 'Hot summers, cold and occasionally snowy winters; Vitosha mountain provides year-round hiking from the city',
    flight_cost_per_person_gbp = 45,
    hotel_cost_per_night_gbp = 45,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Sofia' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Sofia', 'Bulgaria', 'SOF', 1, 'The Balkans'' most dynamic capital — Soviet mosaics beside Orthodox gold domes, mountains 30 minutes away, and prices that feel like 2005', 'Sofia is one of Europe''s oldest cities with settlements dating back 8,000 years — older than Rome or Athens',
    'Hot summers, cold and occasionally snowy winters; Vitosha mountain provides year-round hiking from the city', 45, 45,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Sofia' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Sofia' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Sofia' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Sofia' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Sofia' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Alexander Nevsky Cathedral', 'One of the largest Eastern Orthodox cathedrals in the world — gilt domes and Byzantine interior', 1 FROM flight.destinations
  WHERE city = 'Sofia' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'National Palace of Culture', 'Communist-era brutalist mega-structure at the heart of the city', 2 FROM flight.destinations
  WHERE city = 'Sofia' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Vitosha Mountain', 'National park rising to 2,290m on Sofia''s doorstep — hiking, skiing, and city views', 3 FROM flight.destinations
  WHERE city = 'Sofia' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'France', iata_code = 'MRS', hook = 'France''s most underrated city — bouillabaisse in a port that''s been feeding sailors for 2,600 years, wild calanques, and a raw electric energy',
    fun_fact = 'Marseille is France''s oldest city, founded by Greek sailors from Phocaea in 600 BC — older than Rome', weather_summary = 'Mediterranean climate; hot sunny summers; mild winters; the mistral wind makes it feel even more alive',
    flight_cost_per_person_gbp = 52,
    hotel_cost_per_night_gbp = 78,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Marseille' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Marseille', 'France', 'MRS', 1, 'France''s most underrated city — bouillabaisse in a port that''s been feeding sailors for 2,600 years, wild calanques, and a raw electric energy', 'Marseille is France''s oldest city, founded by Greek sailors from Phocaea in 600 BC — older than Rome',
    'Mediterranean climate; hot sunny summers; mild winters; the mistral wind makes it feel even more alive', 52, 78,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Marseille' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Marseille' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Marseille' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Marseille' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Marseille' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Vieux-Port', 'The ancient harbour — fishing boats unloading at dawn, bouillabaisse by noon', 1 FROM flight.destinations
  WHERE city = 'Marseille' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Les Calanques National Park', 'White limestone fjords plunging into turquoise water — boat or hiking access', 2 FROM flight.destinations
  WHERE city = 'Marseille' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'MuCEM', 'Museum of European and Mediterranean Civilisations — spectacular architecture on the harbour', 3 FROM flight.destinations
  WHERE city = 'Marseille' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'GRO', hook = 'Game of Thrones'' King''s Landing in real life — a medieval old town that earns every comparison, one hour from Barcelona',
    fun_fact = 'Girona''s Jewish Quarter (El Call) is one of the best-preserved medieval Jewish quarters in Europe, untouched since the expulsion of 1492', weather_summary = 'Hot Mediterranean summers; mild winters; perfect year-round; gateway to Pyrenees and Costa Brava',
    flight_cost_per_person_gbp = 42,
    hotel_cost_per_night_gbp = 68,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Girona' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Girona', 'Spain', 'GRO', 1, 'Game of Thrones'' King''s Landing in real life — a medieval old town that earns every comparison, one hour from Barcelona', 'Girona''s Jewish Quarter (El Call) is one of the best-preserved medieval Jewish quarters in Europe, untouched since the expulsion of 1492',
    'Hot Mediterranean summers; mild winters; perfect year-round; gateway to Pyrenees and Costa Brava', 42, 68,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Girona' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Girona' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Girona' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Girona' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Girona' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Girona Cathedral', 'Romanesque-Gothic cathedral with the widest Gothic nave in the world', 1 FROM flight.destinations
  WHERE city = 'Girona' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'El Call', 'Medieval Jewish quarter — labyrinthine lanes, the Nahmanides Institute, and history in every stone', 2 FROM flight.destinations
  WHERE city = 'Girona' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'City Walls Walk', '2km promenade along the medieval ramparts with views over terracotta rooftops', 3 FROM flight.destinations
  WHERE city = 'Girona' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Germany', iata_code = 'HAM', hook = 'Germany''s coolest port city — the Elbphilharmonie, a harbour district that never really closed, and a nightlife that runs a close second only to Berlin',
    fun_fact = 'Hamburg has more bridges than any other city in Europe — over 2,500, more than Amsterdam, London, and Venice combined', weather_summary = 'Cool northern climate; warm and lively summers; cold winters; Reeperbahn buzzes year-round',
    flight_cost_per_person_gbp = 38,
    hotel_cost_per_night_gbp = 88,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Hamburg' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Hamburg', 'Germany', 'HAM', 1, 'Germany''s coolest port city — the Elbphilharmonie, a harbour district that never really closed, and a nightlife that runs a close second only to Berlin', 'Hamburg has more bridges than any other city in Europe — over 2,500, more than Amsterdam, London, and Venice combined',
    'Cool northern climate; warm and lively summers; cold winters; Reeperbahn buzzes year-round', 38, 88,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Hamburg' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Hamburg' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Hamburg' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Hamburg' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Hamburg' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Elbphilharmonie', 'Herzog & de Meuron''s concert hall rising from a 19th-century warehouse on the Elbe', 1 FROM flight.destinations
  WHERE city = 'Hamburg' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Speicherstadt', 'UNESCO red-brick warehouse district — now galleries, museums, and design agencies', 2 FROM flight.destinations
  WHERE city = 'Hamburg' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Reeperbahn & St Pauli', 'Hamburg''s legendary red-light and entertainment quarter where The Beatles first performed', 3 FROM flight.destinations
  WHERE city = 'Hamburg' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'TRN', hook = 'Italy''s most underrated city — Baroque piazzas, the Shroud, and a chocolate and vermouth culture that Milan quietly envies',
    fun_fact = 'Turin was the first capital of unified Italy in 1861 and is home to the Holy Shroud — the most scientifically studied artefact in history', weather_summary = 'Hot summers, cold snowy winters with the Alps visible from the city; beautiful in spring and autumn',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Turin' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Turin', 'Italy', 'TRN', 1, 'Italy''s most underrated city — Baroque piazzas, the Shroud, and a chocolate and vermouth culture that Milan quietly envies', 'Turin was the first capital of unified Italy in 1861 and is home to the Holy Shroud — the most scientifically studied artefact in history',
    'Hot summers, cold snowy winters with the Alps visible from the city; beautiful in spring and autumn', 50, 72,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Turin' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Turin' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Turin' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Turin' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Turin' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Egyptian Museum', 'The world''s second-largest collection of Egyptian antiquities, after Cairo', 1 FROM flight.destinations
  WHERE city = 'Turin' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Mole Antonelliana', 'Turin''s symbol — a 167m 19th-century spire housing the National Cinema Museum', 2 FROM flight.destinations
  WHERE city = 'Turin' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Piazza Castello', 'Baroque heart of the city with the Royal Palace, opera house, and the Shroud Chapel', 3 FROM flight.destinations
  WHERE city = 'Turin' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Germany', iata_code = 'BRE', hook = 'A Hanseatic fairy tale — the Brothers Grimm musicians in bronze, medieval guild houses, and a beer culture you''ll struggle to leave behind',
    fun_fact = 'Bremen is home to the Beck''s brewery, which has been producing Germany''s most internationally recognised beer since 1873', weather_summary = 'Cool northern European climate; pleasant summers; cold winters; compact and walkable in all seasons',
    flight_cost_per_person_gbp = 42,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Bremen' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Bremen', 'Germany', 'BRE', 1, 'A Hanseatic fairy tale — the Brothers Grimm musicians in bronze, medieval guild houses, and a beer culture you''ll struggle to leave behind', 'Bremen is home to the Beck''s brewery, which has been producing Germany''s most internationally recognised beer since 1873',
    'Cool northern European climate; pleasant summers; cold winters; compact and walkable in all seasons', 42, 72,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Bremen' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bremen' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bremen' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bremen' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bremen' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Böttcherstraße', 'Expressionist red-brick lane of galleries, a glockenspiel, and craft workshops', 1 FROM flight.destinations
  WHERE city = 'Bremen' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Market Square', 'UNESCO Roland Statue and Town Hall — 600 years of Hanseatic power in stone', 2 FROM flight.destinations
  WHERE city = 'Bremen' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Beck''s Brewery', 'Tour the brewery that made German beer internationally famous since 1873', 3 FROM flight.destinations
  WHERE city = 'Bremen' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Norway', iata_code = 'OSL', hook = 'The world''s most outdoors-obsessed capital — ski jumps visible from the city, a fjord for swimming, and Viking ships that stop you in your tracks',
    fun_fact = 'Oslo''s opera house roof is designed to be walked on — locals ski, sunbathe, and commute across it as part of daily city life', weather_summary = 'Cold snowy winters (skiing minutes away); beautiful long summer days; one of Europe''s greenest capitals',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 112,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Oslo' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Oslo', 'Norway', 'OSL', 1, 'The world''s most outdoors-obsessed capital — ski jumps visible from the city, a fjord for swimming, and Viking ships that stop you in your tracks', 'Oslo''s opera house roof is designed to be walked on — locals ski, sunbathe, and commute across it as part of daily city life',
    'Cold snowy winters (skiing minutes away); beautiful long summer days; one of Europe''s greenest capitals', 55, 112,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Oslo' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Oslo' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Oslo' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Oslo' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Oslo' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Oslo' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Viking Ship Museum', 'Three 9th-century Viking ships recovered from burial mounds — breathtaking originals', 1 FROM flight.destinations
  WHERE city = 'Oslo' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Vigeland Sculpture Park', 'The world''s largest sculpture park by a single artist — 200 figures in granite and bronze', 2 FROM flight.destinations
  WHERE city = 'Oslo' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Holmenkollen Ski Jump', 'Iconic ski jump above the city with a ski museum and panoramic Oslo views', 3 FROM flight.destinations
  WHERE city = 'Oslo' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'France', iata_code = 'TLS', hook = 'The Pink City — warm brick, Airbus factories, and a student energy that makes the whole city feel perpetually young',
    fun_fact = 'Toulouse is the European capital of aerospace — Airbus assembles its A380s just outside the city at Blagnac', weather_summary = 'Warm southern French climate; very hot summers; mild pleasant winters; gateway to the Pyrenees',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 72,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Toulouse' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Toulouse', 'France', 'TLS', 1, 'The Pink City — warm brick, Airbus factories, and a student energy that makes the whole city feel perpetually young', 'Toulouse is the European capital of aerospace — Airbus assembles its A380s just outside the city at Blagnac',
    'Warm southern French climate; very hot summers; mild pleasant winters; gateway to the Pyrenees', 50, 72,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Toulouse' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Toulouse' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Toulouse' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Toulouse' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Toulouse' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cité de l''Espace', 'Space science museum with an Ariane rocket and a replica of the Mir station', 1 FROM flight.destinations
  WHERE city = 'Toulouse' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Basilica of Saint-Sernin', 'The largest Romanesque church in Europe and a UNESCO pilgrimage landmark', 2 FROM flight.destinations
  WHERE city = 'Toulouse' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Garonne Riverfront', 'Pink-brick quaysides and the Pont Neuf — the city''s heartbeat at sunset', 3 FROM flight.destinations
  WHERE city = 'Toulouse' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Croatia', iata_code = 'ZAG', hook = 'Croatia''s overlooked capital — Habsburg elegance, a museum of broken relationships, and a café culture that ignores every deadline',
    fun_fact = 'Zagreb''s Museum of Broken Relationships, displaying donated objects from failed romances worldwide, won the Council of Europe Museum Prize', weather_summary = 'Continental climate; hot summers, cold winters with snow; beautiful spring and autumn colours',
    flight_cost_per_person_gbp = 52,
    hotel_cost_per_night_gbp = 62,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Zagreb' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Zagreb', 'Croatia', 'ZAG', 1, 'Croatia''s overlooked capital — Habsburg elegance, a museum of broken relationships, and a café culture that ignores every deadline', 'Zagreb''s Museum of Broken Relationships, displaying donated objects from failed romances worldwide, won the Council of Europe Museum Prize',
    'Continental climate; hot summers, cold winters with snow; beautiful spring and autumn colours', 52, 62,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Zagreb' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Zagreb' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zagreb' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zagreb' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Zagreb' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Museum of Broken Relationships', 'Quirky, moving museum of donated objects from failed romances around the world', 1 FROM flight.destinations
  WHERE city = 'Zagreb' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Gornji Grad (Upper Town)', 'Medieval quarter of cobbled lanes, the cathedral, and the Lotrščak Tower', 2 FROM flight.destinations
  WHERE city = 'Zagreb' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Dolac Market', 'Zagreb''s daily outdoor market — the city''s stomach and social heart', 3 FROM flight.destinations
  WHERE city = 'Zagreb' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Luxembourg', iata_code = 'LUX', hook = 'A UNESCO capital wedged in gorges — the most dramatic city centre in Europe, multilingual locals, and a Michelin density that should be illegal',
    fun_fact = 'Luxembourg City is one of only three cities declared a UNESCO World Heritage Site in its entirety, including its entire fortification system', weather_summary = 'Mild four-season climate; cold winters; warm summers; small enough to explore fully in a weekend',
    flight_cost_per_person_gbp = 38,
    hotel_cost_per_night_gbp = 88,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Luxembourg' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Luxembourg', 'Luxembourg', 'LUX', 1, 'A UNESCO capital wedged in gorges — the most dramatic city centre in Europe, multilingual locals, and a Michelin density that should be illegal', 'Luxembourg City is one of only three cities declared a UNESCO World Heritage Site in its entirety, including its entire fortification system',
    'Mild four-season climate; cold winters; warm summers; small enough to explore fully in a weekend', 38, 88,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Luxembourg' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Luxembourg' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Luxembourg' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Luxembourg' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Luxembourg' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Casemates du Bock', '23km of tunnels carved into the cliff — Cold War bunkers beneath a medieval fortress', 1 FROM flight.destinations
  WHERE city = 'Luxembourg' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Grand Ducal Palace', 'Renaissance palace in the city centre — the working residence of the Grand Duke', 2 FROM flight.destinations
  WHERE city = 'Luxembourg' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Grund Quarter', 'Village-in-a-city at the bottom of the gorge — restaurants, bars, and ancient bridges', 3 FROM flight.destinations
  WHERE city = 'Luxembourg' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'SCQ', hook = 'The end of the road for 300,000 pilgrims a year — a baroque cathedral, an atmosphere of arrival, and a city that makes you want to walk there',
    fun_fact = 'The Camino de Santiago is the world''s most walked long-distance route, with over 300,000 pilgrims completing it every year', weather_summary = 'Green and often rainy (it''s Galicia); mild year-round; the arrival square is most electric in summer',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 68,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Santiago de Compostela' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Santiago de Compostela', 'Spain', 'SCQ', 1, 'The end of the road for 300,000 pilgrims a year — a baroque cathedral, an atmosphere of arrival, and a city that makes you want to walk there', 'The Camino de Santiago is the world''s most walked long-distance route, with over 300,000 pilgrims completing it every year',
    'Green and often rainy (it''s Galicia); mild year-round; the arrival square is most electric in summer', 50, 68,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Santiago de Compostela' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Santiago de Compostela' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Santiago de Compostela' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Santiago de Compostela' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Santiago de Compostela' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cathedral of Santiago de Compostela', 'The spiritual destination of the Camino — Romanesque towers and a vast baroque façade', 1 FROM flight.destinations
  WHERE city = 'Santiago de Compostela' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Praza do Obradoiro', 'The arrival square where pilgrims complete their journey — one of Europe''s finest plazas', 2 FROM flight.destinations
  WHERE city = 'Santiago de Compostela' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Mercado de Abastos', 'Galicia''s finest food market — percebes, octopus, and Galician cheese under granite arches', 3 FROM flight.destinations
  WHERE city = 'Santiago de Compostela' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Moldova', iata_code = 'KIV', hook = 'Europe''s least-visited capital and one of its most surprising — Soviet architecture, extraordinary wine cellars, and warmth that feels entirely unperformed',
    fun_fact = 'Cricova wine cellars outside Chisinau have 120km of underground galleries so vast that wine tourists drive through them in small electric cars', weather_summary = 'Continental climate; very hot summers; cold winters; spring and autumn are pleasant; excellent year-round for wine tourism',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 38,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Chisinau' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Chisinau', 'Moldova', 'KIV', 1, 'Europe''s least-visited capital and one of its most surprising — Soviet architecture, extraordinary wine cellars, and warmth that feels entirely unperformed', 'Cricova wine cellars outside Chisinau have 120km of underground galleries so vast that wine tourists drive through them in small electric cars',
    'Continental climate; very hot summers; cold winters; spring and autumn are pleasant; excellent year-round for wine tourism', 65, 38,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Chisinau' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Chisinau' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Chisinau' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Chisinau' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Chisinau' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cricova Wine Cellars', '120km of underground tunnels filled with millions of ageing bottles — drive-through wine tourism', 1 FROM flight.destinations
  WHERE city = 'Chisinau' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Central Market', 'Vast Soviet-era market overflowing with local produce, pickles, and Moldovan cheeses', 2 FROM flight.destinations
  WHERE city = 'Chisinau' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Milestii Mici', 'The world''s largest wine collection by number of bottles — 2 million and counting', 3 FROM flight.destinations
  WHERE city = 'Chisinau' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'VRN', hook = 'Romeo and Juliet''s city — a Roman amphitheatre still hosting opera, pink marble piazzas, and the most romantic balcony in the world',
    fun_fact = 'Verona''s Arena, built in the 1st century AD, seats 15,000 people and still hosts world-class opera productions every summer', weather_summary = 'Hot Italian summers; cold winters; spring and autumn ideal for exploring on foot',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 75,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Verona' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Verona', 'Italy', 'VRN', 1, 'Romeo and Juliet''s city — a Roman amphitheatre still hosting opera, pink marble piazzas, and the most romantic balcony in the world', 'Verona''s Arena, built in the 1st century AD, seats 15,000 people and still hosts world-class opera productions every summer',
    'Hot Italian summers; cold winters; spring and autumn ideal for exploring on foot', 50, 75,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Verona' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Verona' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Verona' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Verona' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Verona' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Verona Arena', '1st-century Roman amphitheatre — opera under the stars every summer since 1913', 1 FROM flight.destinations
  WHERE city = 'Verona' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Juliet''s House', 'Medieval courtyard with the famous bronze balcony — and 3 million love notes on the walls', 2 FROM flight.destinations
  WHERE city = 'Verona' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Piazza delle Erbe', 'Verona''s main square on the ancient Roman forum — markets, frescoed palaces, and cafés', 3 FROM flight.destinations
  WHERE city = 'Verona' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Italy', iata_code = 'FLR', hook = 'The birthplace of the Renaissance — Michelangelo''s David, the Uffizi, and a gelato culture representing civilisation''s peak achievement',
    fun_fact = 'Florence''s Uffizi Gallery is considered the world''s first modern museum, opened to the public in 1769 by Grand Duke Peter Leopold', weather_summary = 'Hot summers; mild winters; spring and autumn are golden for art and food without the crowds',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 85,
    default_duration_nights = 4, is_active = true
  WHERE city = 'Florence' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Florence', 'Italy', 'FLR', 1, 'The birthplace of the Renaissance — Michelangelo''s David, the Uffizi, and a gelato culture representing civilisation''s peak achievement', 'Florence''s Uffizi Gallery is considered the world''s first modern museum, opened to the public in 1769 by Grand Duke Peter Leopold',
    'Hot summers; mild winters; spring and autumn are golden for art and food without the crowds', 50, 85,
    4, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Florence' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Florence' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Florence' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Florence' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Florence' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Uffizi Gallery', 'Botticelli, Leonardo, Michelangelo — the greatest collection of Renaissance art in the world', 1 FROM flight.destinations
  WHERE city = 'Florence' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Michelangelo''s David', 'The 5.17-metre marble original at the Accademia — reserve well in advance', 2 FROM flight.destinations
  WHERE city = 'Florence' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Ponte Vecchio & Oltrarno', 'Medieval bridge of goldsmiths leading to Florence''s most authentic neighbourhood', 3 FROM flight.destinations
  WHERE city = 'Florence' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Finland', iata_code = 'HEL', hook = 'The Nordic capital with no ego — design museums, a market hall on the harbour, and a sauna culture that is genuinely non-negotiable',
    fun_fact = 'Finland has more saunas than cars — over 3 million for a population of 5.5 million, a ratio that surprises every visitor', weather_summary = 'Cold winters with snow and Northern Lights; beautiful long summer days; best June–August or December for Christmas markets',
    flight_cost_per_person_gbp = 52,
    hotel_cost_per_night_gbp = 92,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Helsinki' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Helsinki', 'Finland', 'HEL', 1, 'The Nordic capital with no ego — design museums, a market hall on the harbour, and a sauna culture that is genuinely non-negotiable', 'Finland has more saunas than cars — over 3 million for a population of 5.5 million, a ratio that surprises every visitor',
    'Cold winters with snow and Northern Lights; beautiful long summer days; best June–August or December for Christmas markets', 52, 92,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Helsinki' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Helsinki' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Helsinki' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Helsinki' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Helsinki' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Helsinki Market Hall', '19th-century market on the harbour — Finnish salmon, cloudberries, and reindeer', 1 FROM flight.destinations
  WHERE city = 'Helsinki' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Temppeliaukio Church', 'A church blasted directly into the bedrock — natural light through a copper spiral roof', 2 FROM flight.destinations
  WHERE city = 'Helsinki' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Suomenlinna Sea Fortress', 'UNESCO island fortress 15 minutes by ferry — museums, walks, and Helsinki views', 3 FROM flight.destinations
  WHERE city = 'Helsinki' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Slovakia', iata_code = 'BTS', hook = 'Europe''s smallest major capital with the biggest personality — a compact old town, a castle above the Danube, and Vienna an hour away',
    fun_fact = 'Bratislava is so close to Austria and Hungary that it is the only capital city in the world that borders two other sovereign states', weather_summary = 'Continental climate; hot summers, cold winters; most pleasant in spring and autumn',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 55,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Bratislava' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Bratislava', 'Slovakia', 'BTS', 1, 'Europe''s smallest major capital with the biggest personality — a compact old town, a castle above the Danube, and Vienna an hour away', 'Bratislava is so close to Austria and Hungary that it is the only capital city in the world that borders two other sovereign states',
    'Continental climate; hot summers, cold winters; most pleasant in spring and autumn', 50, 55,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Bratislava' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bratislava' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bratislava' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Bratislava' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Bratislava' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Bratislava Castle', 'Square white castle on a hill above the Danube — views across three countries', 1 FROM flight.destinations
  WHERE city = 'Bratislava' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Old Town (Staré Mesto)', 'Pastel baroque streets, Franciscan churches, and the best craft beer scene in Slovakia', 2 FROM flight.destinations
  WHERE city = 'Bratislava' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'UFO Bridge Observation Deck', 'Futuristic disc perched on a single pylon above the Danube — panoramic restaurant', 3 FROM flight.destinations
  WHERE city = 'Bratislava' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Czech Republic', iata_code = 'BRQ', hook = 'Prague without the crowds — Czechia''s second city has Functionalist architecture, ancient catacombs, and a student energy that stays up later',
    fun_fact = 'Brno''s Capuchin Monastery crypt contains naturally mummified monks and aristocrats — open to visitors since the 18th century', weather_summary = 'Continental climate; warm summers, cold winters; more affordable than Prague in every respect',
    flight_cost_per_person_gbp = 42,
    hotel_cost_per_night_gbp = 52,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Brno' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Brno', 'Czech Republic', 'BRQ', 1, 'Prague without the crowds — Czechia''s second city has Functionalist architecture, ancient catacombs, and a student energy that stays up later', 'Brno''s Capuchin Monastery crypt contains naturally mummified monks and aristocrats — open to visitors since the 18th century',
    'Continental climate; warm summers, cold winters; more affordable than Prague in every respect', 42, 52,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Brno' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Brno' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Brno' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Brno' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Brno' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Špilberk Castle', 'Medieval fortress with Habsburg dungeons and panoramic views over Moravia', 1 FROM flight.destinations
  WHERE city = 'Brno' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Capuchin Monastery Crypt', 'Naturally mummified monks in habits — macabre, unique, and strangely peaceful', 2 FROM flight.destinations
  WHERE city = 'Brno' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Vila Tugendhat', 'UNESCO Functionalist masterpiece by Mies van der Rohe — minimalism at its most radical', 3 FROM flight.destinations
  WHERE city = 'Brno' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Netherlands', iata_code = 'RTM', hook = 'Europe''s most modern city — bombed flat in 1940 and rebuilt as an architecture manifesto, with the continent''s busiest port and a food market like no other',
    fun_fact = 'Rotterdam''s Markthal, opened in 2014, is the Netherlands'' first indoor market hall — the ceiling artwork covers 11,000 square metres', weather_summary = 'Mild Atlantic climate; similar to Amsterdam but warmer; pleasant year-round; water-taxi culture is a year-round pleasure',
    flight_cost_per_person_gbp = 32,
    hotel_cost_per_night_gbp = 85,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Rotterdam' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Rotterdam', 'Netherlands', 'RTM', 1, 'Europe''s most modern city — bombed flat in 1940 and rebuilt as an architecture manifesto, with the continent''s busiest port and a food market like no other', 'Rotterdam''s Markthal, opened in 2014, is the Netherlands'' first indoor market hall — the ceiling artwork covers 11,000 square metres',
    'Mild Atlantic climate; similar to Amsterdam but warmer; pleasant year-round; water-taxi culture is a year-round pleasure', 32, 85,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Rotterdam' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Rotterdam' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rotterdam' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rotterdam' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Rotterdam' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Markthal', 'Indoor food market beneath a horseshoe arch painted with the world''s largest artwork', 1 FROM flight.destinations
  WHERE city = 'Rotterdam' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Cube Houses', 'Piet Blom''s tilted yellow cubes — one of the most photographed buildings in Europe', 2 FROM flight.destinations
  WHERE city = 'Rotterdam' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Erasmus Bridge', 'Iconic cable-stayed bridge nicknamed ''The Swan'' — the symbol of modern Rotterdam', 3 FROM flight.destinations
  WHERE city = 'Rotterdam' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Morocco', iata_code = 'RBA', hook = 'Morocco''s overlooked capital — a UNESCO medina, a half-finished Hassan Tower, and none of the hard sell of Marrakech',
    fun_fact = 'Rabat''s medina, kasbah, and Hassan Tower are all UNESCO World Heritage Sites — making it Morocco''s most officially recognised historic city', weather_summary = 'Mild Atlantic climate; cooler than Marrakech; pleasant year-round; best spring and autumn',
    flight_cost_per_person_gbp = 68,
    hotel_cost_per_night_gbp = 52,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Rabat' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Rabat', 'Morocco', 'RBA', 1, 'Morocco''s overlooked capital — a UNESCO medina, a half-finished Hassan Tower, and none of the hard sell of Marrakech', 'Rabat''s medina, kasbah, and Hassan Tower are all UNESCO World Heritage Sites — making it Morocco''s most officially recognised historic city',
    'Mild Atlantic climate; cooler than Marrakech; pleasant year-round; best spring and autumn', 68, 52,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Rabat' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Rabat' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rabat' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Rabat' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Rabat' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Hassan Tower & Mausoleum', 'Unfinished 12th-century minaret beside Mohammed V''s ornate royal mausoleum', 1 FROM flight.destinations
  WHERE city = 'Rabat' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Udayas Kasbah', '12th-century fortified citadel with blue-and-white lanes above the Atlantic', 2 FROM flight.destinations
  WHERE city = 'Rabat' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Chellah Necropolis', 'Roman and Merenid ruins overgrown with storks'' nests — hauntingly beautiful', 3 FROM flight.destinations
  WHERE city = 'Rabat' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Romania', iata_code = 'CLJ', hook = 'Transylvania''s capital and Romania''s coolest city — a thriving tech scene, baroque squares, and a music festival that runs for seven days straight',
    fun_fact = 'UNTOLD Festival in Cluj is one of Europe''s fastest-growing music events, drawing over 350,000 attendees each year to Transylvania', weather_summary = 'Continental climate; warm summers, cold winters; Transylvania is beautiful in autumn and spring',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 48,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Cluj-Napoca' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Cluj-Napoca', 'Romania', 'CLJ', 1, 'Transylvania''s capital and Romania''s coolest city — a thriving tech scene, baroque squares, and a music festival that runs for seven days straight', 'UNTOLD Festival in Cluj is one of Europe''s fastest-growing music events, drawing over 350,000 attendees each year to Transylvania',
    'Continental climate; warm summers, cold winters; Transylvania is beautiful in autumn and spring', 55, 48,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Cluj-Napoca' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Cluj-Napoca' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Cluj-Napoca' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Cluj-Napoca' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Cluj-Napoca' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Unirii Square', 'Baroque heart of the city with the Gothic St Michael''s Church and outdoor terraces', 1 FROM flight.destinations
  WHERE city = 'Cluj-Napoca' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'UNTOLD Festival', 'One of Europe''s great electronic music festivals — held in August in Transylvania', 2 FROM flight.destinations
  WHERE city = 'Cluj-Napoca' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Bran Castle', 'Dracula''s Castle — Gothic hilltop fortress 2 hours away in the Carpathian Mountains', 3 FROM flight.destinations
  WHERE city = 'Cluj-Napoca' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Spain', iata_code = 'ZAZ', hook = 'Spain''s most underrated city — a riverside basilica, Mudéjar architecture at every turn, and pintxos that give San Sebastián competition',
    fun_fact = 'Zaragoza''s UNESCO Mudéjar architecture combines Islamic and Gothic styles in a way found nowhere else on earth', weather_summary = 'Hot and dry in summer; cold and windy in winter; spring and autumn are perfect; more sunshine than Madrid',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 62,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Zaragoza' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Zaragoza', 'Spain', 'ZAZ', 1, 'Spain''s most underrated city — a riverside basilica, Mudéjar architecture at every turn, and pintxos that give San Sebastián competition', 'Zaragoza''s UNESCO Mudéjar architecture combines Islamic and Gothic styles in a way found nowhere else on earth',
    'Hot and dry in summer; cold and windy in winter; spring and autumn are perfect; more sunshine than Madrid', 50, 62,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Zaragoza' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Zaragoza' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zaragoza' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zaragoza' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Zaragoza' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Basilica del Pilar', 'Baroque basilica on the Ebro riverbank — one of Spain''s great pilgrimage churches', 1 FROM flight.destinations
  WHERE city = 'Zaragoza' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Aljafería Palace', '11th-century Moorish palace — Andalusia-level Islamic architecture in Aragon', 2 FROM flight.destinations
  WHERE city = 'Zaragoza' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Mudéjar Architecture Route', 'UNESCO towers blending Gothic and Islamic styles, unique to Aragon', 3 FROM flight.destinations
  WHERE city = 'Zaragoza' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Bosnia and Herzegovina', iata_code = 'SJJ', hook = 'The city where World War I started — Ottoman bazaars, Austro-Hungarian cafés, and a resilience that will leave you genuinely humbled',
    fun_fact = 'Sarajevo was under siege for 1,425 days from 1992–1995 — the longest siege of a capital city in the history of modern warfare', weather_summary = 'Continental mountain climate; hot summers, cold snowy winters with ski mountains nearby; beautiful in all seasons',
    flight_cost_per_person_gbp = 65,
    hotel_cost_per_night_gbp = 48,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Sarajevo' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Sarajevo', 'Bosnia and Herzegovina', 'SJJ', 1, 'The city where World War I started — Ottoman bazaars, Austro-Hungarian cafés, and a resilience that will leave you genuinely humbled', 'Sarajevo was under siege for 1,425 days from 1992–1995 — the longest siege of a capital city in the history of modern warfare',
    'Continental mountain climate; hot summers, cold snowy winters with ski mountains nearby; beautiful in all seasons', 65, 48,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Sarajevo' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Sarajevo' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Sarajevo' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Sarajevo' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Sarajevo' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Latin Bridge', 'Ottoman bridge where Archduke Franz Ferdinand was assassinated, triggering World War I', 1 FROM flight.destinations
  WHERE city = 'Sarajevo' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Baščaršija Bazaar', '16th-century Ottoman quarter of copper workshops, kebab houses, and tea rooms', 2 FROM flight.destinations
  WHERE city = 'Sarajevo' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Tunnel of Hope Museum', 'The 800m tunnel used to supply the city during the 1990s siege', 3 FROM flight.destinations
  WHERE city = 'Sarajevo' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Bulgaria', iata_code = 'PDV', hook = 'Europe''s oldest continuously inhabited city — Roman amphitheatres, colourful National Revival houses, and a creative scene that chose here to bloom',
    fun_fact = 'Plovdiv was European Capital of Culture 2019 and is the oldest continuously inhabited city in Europe, settled since 4000 BC', weather_summary = 'Hot dry summers; cold winters; most pleasant in spring and autumn; wine country surrounds the city',
    flight_cost_per_person_gbp = 50,
    hotel_cost_per_night_gbp = 42,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Plovdiv' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Plovdiv', 'Bulgaria', 'PDV', 1, 'Europe''s oldest continuously inhabited city — Roman amphitheatres, colourful National Revival houses, and a creative scene that chose here to bloom', 'Plovdiv was European Capital of Culture 2019 and is the oldest continuously inhabited city in Europe, settled since 4000 BC',
    'Hot dry summers; cold winters; most pleasant in spring and autumn; wine country surrounds the city', 50, 42,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Plovdiv' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Plovdiv' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Plovdiv' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Plovdiv' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Plovdiv' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Roman Amphitheatre', '2nd-century theatre carved into a hillside — still hosting performances today', 1 FROM flight.destinations
  WHERE city = 'Plovdiv' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Kapana Creative District', 'Former artisan quarter revived with galleries, street art, and craft breweries', 2 FROM flight.destinations
  WHERE city = 'Plovdiv' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Old Town (Trimontium)', 'Colourful Bulgarian National Revival houses on three hills above the city', 3 FROM flight.destinations
  WHERE city = 'Plovdiv' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Morocco', iata_code = 'FEZ', hook = 'The world''s largest car-free medieval city — 9,000 lanes and a tannery that smells of the 11th century and looks like a living carpet',
    fun_fact = 'The University of Al Quaraouiyine in Fes, founded in 859 AD, is recognised by UNESCO as the world''s oldest continuously operating university', weather_summary = 'Hot in summer; mild and pleasant in spring and autumn; cooler than Marrakech; best October–April',
    flight_cost_per_person_gbp = 68,
    hotel_cost_per_night_gbp = 48,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Fes' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Fes', 'Morocco', 'FEZ', 1, 'The world''s largest car-free medieval city — 9,000 lanes and a tannery that smells of the 11th century and looks like a living carpet', 'The University of Al Quaraouiyine in Fes, founded in 859 AD, is recognised by UNESCO as the world''s oldest continuously operating university',
    'Hot in summer; mild and pleasant in spring and autumn; cooler than Marrakech; best October–April', 68, 48,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Fes' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Fes' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Fes' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Fes' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Fes' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Chouara Tannery', 'Medieval leather tannery unchanged since the 11th century — vivid dye vats and medieval smells', 1 FROM flight.destinations
  WHERE city = 'Fes' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Al-Attarine Madrasa', '14th-century Quranic school of breathtaking carved cedar and tilework', 2 FROM flight.destinations
  WHERE city = 'Fes' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Bab Bou Jeloud', 'The Blue Gate — ornate Moorish gateway into the medina, tiled in blue and green', 3 FROM flight.destinations
  WHERE city = 'Fes' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Switzerland', iata_code = 'ZRH', hook = 'Europe''s most liveable city and surprisingly fun — a medieval old town by the lake, world-class art, and fondue that justifies the exchange rate',
    fun_fact = 'Zurich consistently tops global quality-of-life rankings and pipes drinking water directly from the Alps through its tap system', weather_summary = 'Warm summers, cold snowy winters; beautiful in all seasons; world-class skiing within 90 minutes',
    flight_cost_per_person_gbp = 55,
    hotel_cost_per_night_gbp = 145,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Zurich' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Zurich', 'Switzerland', 'ZRH', 1, 'Europe''s most liveable city and surprisingly fun — a medieval old town by the lake, world-class art, and fondue that justifies the exchange rate', 'Zurich consistently tops global quality-of-life rankings and pipes drinking water directly from the Alps through its tap system',
    'Warm summers, cold snowy winters; beautiful in all seasons; world-class skiing within 90 minutes', 55, 145,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Zurich' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Zurich' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zurich' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Zurich' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Zurich' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Kunsthaus Zürich', 'Switzerland''s most important art collection — Monet, Munch, Picasso, and Giacometti', 1 FROM flight.destinations
  WHERE city = 'Zurich' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Altstadt (Old Town)', 'Cobbled medieval streets on both sides of the Limmat — guild houses and church spires', 2 FROM flight.destinations
  WHERE city = 'Zurich' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Lake Zurich', 'Swimming from the quaysides in summer — a summer institution for locals', 3 FROM flight.destinations
  WHERE city = 'Zurich' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Germany', iata_code = 'MUC', hook = 'Bavaria''s finest export — a world-class art museum, a park bigger than Central Park, and beer garden culture as a legitimate civic institution',
    fun_fact = 'Munich''s English Garden is larger than Central Park in New York and has its own urban surfers — riding an artificial wave since the 1970s', weather_summary = 'Hot summers (beer garden season); cold snowy winters; Oktoberfest in late September; beautiful year-round',
    flight_cost_per_person_gbp = 42,
    hotel_cost_per_night_gbp = 92,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Munich' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Munich', 'Germany', 'MUC', 1, 'Bavaria''s finest export — a world-class art museum, a park bigger than Central Park, and beer garden culture as a legitimate civic institution', 'Munich''s English Garden is larger than Central Park in New York and has its own urban surfers — riding an artificial wave since the 1970s',
    'Hot summers (beer garden season); cold snowy winters; Oktoberfest in late September; beautiful year-round', 42, 92,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Munich' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Munich' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Munich' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Munich' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Munich' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'English Garden & Eisbach', 'Urban park bigger than Central Park — surfers on an artificial river wave year-round', 1 FROM flight.destinations
  WHERE city = 'Munich' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Deutsches Museum', 'The world''s largest science and technology museum — you could spend three days here', 2 FROM flight.destinations
  WHERE city = 'Munich' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Marienplatz & Glockenspiel', 'Munich''s medieval heart — daily Glockenspiel performance and rooftop views', 3 FROM flight.destinations
  WHERE city = 'Munich' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Jordan', iata_code = 'AMM', hook = 'The gateway to Petra and Wadi Rum — a modern Arab capital built on seven hills with Roman columns in the city centre and extraordinary food',
    fun_fact = 'Amman''s Citadel has been inhabited for at least 8,500 years and the Temple of Hercules on the hill is one of the best-preserved Roman temples in the Middle East', weather_summary = 'Very hot dry summers; mild pleasant winters; spring and autumn ideal for sightseeing; Petra accessible year-round',
    flight_cost_per_person_gbp = 90,
    hotel_cost_per_night_gbp = 65,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Amman' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Amman', 'Jordan', 'AMM', 1, 'The gateway to Petra and Wadi Rum — a modern Arab capital built on seven hills with Roman columns in the city centre and extraordinary food', 'Amman''s Citadel has been inhabited for at least 8,500 years and the Temple of Hercules on the hill is one of the best-preserved Roman temples in the Middle East',
    'Very hot dry summers; mild pleasant winters; spring and autumn ideal for sightseeing; Petra accessible year-round', 90, 65,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Amman' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Amman' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Amman' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Amman' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Amman' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Amman' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Amman Citadel', 'Hilltop complex of Roman, Byzantine, and Umayyad ruins overlooking the whole city', 1 FROM flight.destinations
  WHERE city = 'Amman' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Petra', 'The rose-red Nabataean city carved from cliffsides — 2.5 hours south, unmissable', 2 FROM flight.destinations
  WHERE city = 'Amman' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Wadi Rum', 'The Valley of the Moon — vast red desert landscape for jeep safaris and stargazing', 3 FROM flight.destinations
  WHERE city = 'Amman' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Morocco', iata_code = 'CMN', hook = 'Humphrey Bogart''s city, Hassan II''s mosque, and a French Art Deco quarter that doesn''t know it''s a gem — Morocco''s economic engine is also its most surprising city',
    fun_fact = 'The Hassan II Mosque in Casablanca has the world''s tallest minaret at 210 metres and is partly built over the Atlantic Ocean', weather_summary = 'Mild Atlantic climate; rarely extreme; good year-round; best spring and autumn; cooler than inland Morocco',
    flight_cost_per_person_gbp = 68,
    hotel_cost_per_night_gbp = 55,
    default_duration_nights = 3, is_active = true
  WHERE city = 'Casablanca' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Casablanca', 'Morocco', 'CMN', 1, 'Humphrey Bogart''s city, Hassan II''s mosque, and a French Art Deco quarter that doesn''t know it''s a gem — Morocco''s economic engine is also its most surprising city', 'The Hassan II Mosque in Casablanca has the world''s tallest minaret at 210 metres and is partly built over the Atlantic Ocean',
    'Mild Atlantic climate; rarely extreme; good year-round; best spring and autumn; cooler than inland Morocco', 68, 55,
    3, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Casablanca' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Casablanca' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Casablanca' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Casablanca' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Casablanca' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Hassan II Mosque', 'The world''s tallest minaret — a mosque built over the Atlantic with a glass floor', 1 FROM flight.destinations
  WHERE city = 'Casablanca' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Art Deco Quartier des Habous', 'French colonial-era neighbourhood of Moroccan-Art Deco hybrid architecture', 2 FROM flight.destinations
  WHERE city = 'Casablanca' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Corniche Ain Diab', 'Atlantic seafront promenade with beach clubs, cafés, and the city''s social heart', 3 FROM flight.destinations
  WHERE city = 'Casablanca' AND departure_airport_id = 1;

UPDATE flight.destinations SET
    country = 'Israel', iata_code = 'TLV', hook = 'Non-stop city on the Mediterranean — beaches, Bauhaus architecture, and the world''s best hummus at 2am',
    fun_fact = 'Tel Aviv has the second largest concentration of Bauhaus (International Style) architecture in the world after Berlin', weather_summary = 'Hot Mediterranean summers; warm and pleasant October to May',
    flight_cost_per_person_gbp = 75,
    hotel_cost_per_night_gbp = 95,
    default_duration_nights = 5, is_active = true
  WHERE city = 'Tel Aviv' AND departure_airport_id = 1;
INSERT INTO flight.destinations
  (city, country, iata_code, departure_airport_id, hook, fun_fact, weather_summary,
   flight_cost_per_person_gbp, hotel_cost_per_night_gbp, default_duration_nights, is_active)
  SELECT 'Tel Aviv', 'Israel', 'TLV', 1, 'Non-stop city on the Mediterranean — beaches, Bauhaus architecture, and the world''s best hummus at 2am', 'Tel Aviv has the second largest concentration of Bauhaus (International Style) architecture in the world after Berlin',
    'Hot Mediterranean summers; warm and pleasant October to May', 75, 95,
    5, true
  WHERE NOT EXISTS (
    SELECT 1 FROM flight.destinations WHERE city = 'Tel Aviv' AND departure_airport_id = 1
  );
DELETE FROM flight.destination_trip_types WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Tel Aviv' AND departure_airport_id = 1);
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, true FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tel Aviv' AND dst.departure_airport_id = 1 AND tt.slug = 'city_break';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tel Aviv' AND dst.departure_airport_id = 1 AND tt.slug = 'adventure';
INSERT INTO flight.destination_trip_types (destination_id, trip_type_id, is_primary)
  SELECT dst.id, tt.id, false FROM flight.destinations dst, flight.trip_types tt
  WHERE dst.city = 'Tel Aviv' AND dst.departure_airport_id = 1 AND tt.slug = 'cultural';
DELETE FROM flight.recommended_places WHERE destination_id =
  (SELECT id FROM flight.destinations WHERE city = 'Tel Aviv' AND departure_airport_id = 1);
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Jaffa Old City', 'Ancient port city with galleries, flea market, and sea views', 1 FROM flight.destinations
  WHERE city = 'Tel Aviv' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Carmel Market', 'Bustling shuk with fresh produce, street food, and spices', 2 FROM flight.destinations
  WHERE city = 'Tel Aviv' AND departure_airport_id = 1;
INSERT INTO flight.recommended_places (destination_id, name, description, sort_order)
  SELECT id, 'Jerusalem', 'One of the world''s most sacred cities, 1 hour by train', 3 FROM flight.destinations
  WHERE city = 'Tel Aviv' AND departure_airport_id = 1;

COMMIT;

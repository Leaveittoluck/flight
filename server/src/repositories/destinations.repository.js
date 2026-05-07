const pool = require("../db/pool");

async function getTripTypeBySlug(slug) {
  const result = await pool.query(
    "SELECT id, slug, label FROM flight.trip_types WHERE slug = $1 AND is_active = true",
    [slug]
  );
  return result.rows[0] || null;
}

async function getSimilarTripTypeIds(tripTypeId, minScore) {
  const result = await pool.query(
    `SELECT similar_to_id
     FROM flight.trip_type_similarity
     WHERE trip_type_id = $1 AND similarity_score >= $2`,
    [tripTypeId, minScore]
  );
  return result.rows.map((r) => r.similar_to_id);
}

// excludeIds may be empty — `id != ALL('{}'::int[])` safely returns true for all rows
async function getCandidateDestinations(tripTypeIds, departureAirportId, excludeIds) {
  if (!tripTypeIds.length) return [];

  const result = await pool.query(
    `SELECT DISTINCT d.id, d.city, d.country, d.hook, d.fun_fact, d.weather_summary,
            d.flight_cost_per_person_gbp, d.hotel_cost_per_night_gbp, d.default_duration_nights,
            d.iata_code, d.skyscanner_url, d.booking_com_url
     FROM flight.destinations d
     JOIN flight.destination_trip_types dtt ON dtt.destination_id = d.id
     WHERE d.departure_airport_id = $1
       AND dtt.trip_type_id = ANY($2::int[])
       AND d.is_active = true
       AND d.id != ALL($3::int[])`,
    [departureAirportId, tripTypeIds, excludeIds]
  );
  return result.rows;
}

async function getTripTypesForDestinationIds(destinationIds) {
  if (!destinationIds.length) return [];

  const result = await pool.query(
    `SELECT dtt.destination_id, tt.id, tt.slug, tt.label, dtt.is_primary
     FROM flight.destination_trip_types dtt
     JOIN flight.trip_types tt ON tt.id = dtt.trip_type_id
     WHERE dtt.destination_id = ANY($1::int[])
     ORDER BY dtt.destination_id, dtt.is_primary DESC`,
    [destinationIds]
  );
  return result.rows;
}

async function getRecommendedPlacesForDestinationIds(destinationIds) {
  if (!destinationIds.length) return [];

  const result = await pool.query(
    `SELECT destination_id, name, description
     FROM flight.recommended_places
     WHERE destination_id = ANY($1::int[])
     ORDER BY destination_id, sort_order`,
    [destinationIds]
  );
  return result.rows;
}

module.exports = {
  getTripTypeBySlug,
  getSimilarTripTypeIds,
  getCandidateDestinations,
  getTripTypesForDestinationIds,
  getRecommendedPlacesForDestinationIds,
};

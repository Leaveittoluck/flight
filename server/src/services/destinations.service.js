const repo = require("../repositories/destinations.repository");

const MAX_RESULTS = 3;
const SIMILARITY_MIN_SCORE = 6;
const BUDGET_FLEX = 1.1;

// estimated_total_cost = (flight * travellers) + (ceil(travellers/2) * hotel * nights)
function computeCost(dest, travellers) {
  const flights = parseFloat(dest.flight_cost_per_person_gbp) * travellers;
  const rooms = Math.ceil(travellers / 2);
  const hotel = rooms * parseFloat(dest.hotel_cost_per_night_gbp) * dest.default_duration_nights;
  return Math.round((flights + hotel) * 100) / 100;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function filterByBudget(candidates, travellers, budgetLimit) {
  return candidates
    .map((d) => ({ ...d, estimated_total_cost: computeCost(d, travellers) }))
    .filter((d) => d.estimated_total_cost <= budgetLimit);
}

async function generateDestinations({ departure_airport_id, budget, travellers, trip_type_slug, departure_date, return_date }) {
  const emptyResult = (meta = {}) => ({
    request: { departure_airport_id, budget, travellers, trip_type_slug, departure_date, return_date },
    meta: { results_count: 0, fallback_used: false, tiers_hit: [], ...meta },
    destinations: [],
  });

  const tripType = await repo.getTripTypeBySlug(trip_type_slug);
  if (!tripType) return emptyResult({ unknown_slug: true });

  const similarTypeIds = await repo.getSimilarTripTypeIds(tripType.id, SIMILARITY_MIN_SCORE);

  const tiers = [
    { label: "tier1_exact",        typeIds: [tripType.id],  limit: budget            },
    { label: "tier2_exact_flex",   typeIds: [tripType.id],  limit: budget * BUDGET_FLEX },
    { label: "tier3_similar",      typeIds: similarTypeIds, limit: budget            },
    { label: "tier4_similar_flex", typeIds: similarTypeIds, limit: budget * BUDGET_FLEX },
  ];

  const selected = [];
  const tiersHit = [];

  for (const tier of tiers) {
    if (selected.length >= MAX_RESULTS) break;
    if (!tier.typeIds.length) continue;

    const candidates = await repo.getCandidateDestinations(
      tier.typeIds,
      departure_airport_id,
      selected.map((d) => d.id)
    );

    const affordable = filterByBudget(candidates, travellers, tier.limit);
    if (!affordable.length) continue;

    tiersHit.push(tier.label);
    const picks = shuffle(affordable).slice(0, MAX_RESULTS - selected.length);
    selected.push(...picks);
  }

  if (!selected.length) return emptyResult({ tiers_hit: tiersHit });

  const ids = selected.map((d) => d.id);
  const [tripTypesRows, placesRows] = await Promise.all([
    repo.getTripTypesForDestinationIds(ids),
    repo.getRecommendedPlacesForDestinationIds(ids),
  ]);

  // Group by destination_id
  const tripTypesByDest = {};
  for (const row of tripTypesRows) {
    if (!tripTypesByDest[row.destination_id]) tripTypesByDest[row.destination_id] = [];
    tripTypesByDest[row.destination_id].push({
      id: row.id,
      slug: row.slug,
      label: row.label,
      is_primary: row.is_primary,
    });
  }

  const placesByDest = {};
  for (const row of placesRows) {
    if (!placesByDest[row.destination_id]) placesByDest[row.destination_id] = [];
    placesByDest[row.destination_id].push({ name: row.name, description: row.description });
  }

  const destinations = selected.map((d) => ({
    destination_id: d.id,
    city: d.city,
    country: d.country,
    hook: d.hook,
    fun_fact: d.fun_fact,
    weather_summary: d.weather_summary,
    flight_cost_per_person_gbp: parseFloat(d.flight_cost_per_person_gbp),
    hotel_cost_per_night_gbp: parseFloat(d.hotel_cost_per_night_gbp),
    default_duration_nights: d.default_duration_nights,
    estimated_total_cost: d.estimated_total_cost,
    iata_code: d.iata_code || null,
    trip_types: tripTypesByDest[d.id] || [],
    recommended_places: placesByDest[d.id] || [],
    skyscanner_url: d.skyscanner_url,
    booking_com_url: d.booking_com_url,
  }));

  return {
    request: { departure_airport_id, budget, travellers, trip_type_slug, departure_date, return_date },
    meta: {
      results_count: destinations.length,
      fallback_used: !tiersHit.includes("tier1_exact"),
      tiers_hit: tiersHit,
    },
    destinations,
  };
}

module.exports = { generateDestinations };

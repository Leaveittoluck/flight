const repo = require("../repositories/destinations.repository");

const MAX_RESULTS = 3;
const SIMILARITY_MIN_SCORE = 6;
const BUDGET_FLEX = 1.1;

function round2(n) {
  return Math.round(n * 100) / 100;
}

// Eligibility is based on flights only — hotel affordability is advisory.
function flightTotal(dest, travellers) {
  return round2(parseFloat(dest.flight_cost_per_person_gbp) * travellers);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Filter candidates where flight cost alone fits within budgetLimit.
// Attaches flight_total_cost so the final map doesn't recompute it.
function filterByBudget(candidates, travellers, budgetLimit) {
  return candidates
    .map((d) => ({ ...d, flight_total_cost: flightTotal(d, travellers) }))
    .filter((d) => d.flight_total_cost <= budgetLimit);
}

// Full cost breakdown attached to each destination in the response.
function buildCostBreakdown(d, travellers, budget) {
  const flightCostPerPerson = parseFloat(d.flight_cost_per_person_gbp);
  const hotelCostPerNight  = parseFloat(d.hotel_cost_per_night_gbp);
  const nights             = d.default_duration_nights;

  const flightTotalCost           = d.flight_total_cost; // pre-computed in filterByBudget
  const hotelRoomsNeeded          = Math.ceil(travellers / 2);
  const hotelTotalCost            = round2(hotelRoomsNeeded * hotelCostPerNight * nights);
  const remainingBudgetAfterFlight = round2(budget - flightTotalCost);
  const hotelAffordableAfterFlight = hotelTotalCost <= remainingBudgetAfterFlight;
  const totalTripCostEstimate      = round2(flightTotalCost + hotelTotalCost);

  return {
    flight_cost_per_person_gbp:   flightCostPerPerson,
    flight_total_cost:            flightTotalCost,
    hotel_cost_per_night_gbp:     hotelCostPerNight,
    hotel_rooms_needed:           hotelRoomsNeeded,
    default_duration_nights:      nights,
    hotel_total_cost:             hotelTotalCost,
    remaining_budget_after_flight: remainingBudgetAfterFlight,
    hotel_affordable_after_flight: hotelAffordableAfterFlight,
    total_trip_cost_estimate:     totalTripCostEstimate,
    // kept for any existing consumers
    estimated_total_cost:         totalTripCostEstimate,
  };
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
    iata_code: d.iata_code || null,
    ...buildCostBreakdown(d, travellers, budget),
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

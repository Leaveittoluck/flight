const repo = require("../repositories/destinations.repository");
const { generateTravelDatesForSeason } = require("../utils/seasonDates");

const MAX_RESULTS = 1;
const SIMILARITY_MIN_SCORE = 6;
const BUDGET_FLEX = 1.1;

function round2(n) {
  return Math.round(n * 100) / 100;
}

// Pre-compute all cost components so both filtering and the response shape
// share the same arithmetic with no duplication.
// Prefix _ marks fields that are internal to this module only.
function computeAllCosts(dest, travellers) {
  const flightTotal = round2(parseFloat(dest.flight_cost_per_person_gbp) * travellers);
  const hotelRooms  = Math.ceil(travellers / 2);
  const hotelTotal  = round2(hotelRooms * parseFloat(dest.hotel_cost_per_night_gbp) * dest.default_duration_nights);
  return {
    _flightTotal: flightTotal,
    _hotelRooms:  hotelRooms,
    _hotelTotal:  hotelTotal,
    _tripTotal:   round2(flightTotal + hotelTotal),
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A destination is eligible only when the full trip (flights + hotel) fits
// within budgetLimit. Attaches pre-computed cost fields for the response step.
function filterByBudget(candidates, travellers, budgetLimit) {
  return candidates
    .map((d) => ({ ...d, ...computeAllCosts(d, travellers) }))
    .filter((d) => d._tripTotal <= budgetLimit);
}

// Builds the cost breakdown object included in every destination response.
// Reads the _-prefixed fields attached by filterByBudget.
function buildCostBreakdown(d, budget) {
  const remaining = round2(budget - d._flightTotal);
  return {
    flight_cost_per_person_gbp:    parseFloat(d.flight_cost_per_person_gbp),
    flight_total_cost:             d._flightTotal,
    hotel_cost_per_night_gbp:      parseFloat(d.hotel_cost_per_night_gbp),
    hotel_rooms_needed:            d._hotelRooms,
    default_duration_nights:       d.default_duration_nights,
    hotel_total_cost:              d._hotelTotal,
    remaining_budget_after_flight: remaining,
    // Always true for tier 1/3 (strict budget); may be false for tier 2/4 (+10% flex)
    hotel_affordable_after_flight: d._hotelTotal <= remaining,
    total_trip_cost_estimate:      d._tripTotal,
    estimated_total_cost:          d._tripTotal,
  };
}

async function generateDestinations({ departure_airport_id, budget, budget_per_person, travellers, trip_type_slug, season }) {
  const requestMeta = {
    departure_airport_id, budget, travellers, trip_type_slug, season,
    ...(budget_per_person != null ? { budget_per_person } : {}),
  }
  const emptyResult = (meta = {}) => ({
    request: requestMeta,
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

  const destinations = selected.map((d) => {
    const { departure_date, return_date } = generateTravelDatesForSeason(
      season,
      d.default_duration_nights
    );
    return {
      destination_id: d.id,
      city: d.city,
      country: d.country,
      hook: d.hook,
      fun_fact: d.fun_fact,
      weather_summary: d.weather_summary,
      iata_code: d.iata_code || null,
      ...buildCostBreakdown(d, budget),
      departure_date,
      return_date,
      season,
      trip_types: tripTypesByDest[d.id] || [],
      recommended_places: placesByDest[d.id] || [],
      skyscanner_url: d.skyscanner_url,
      booking_com_url: d.booking_com_url,
    };
  });

  return {
    request: requestMeta,
    meta: {
      results_count: destinations.length,
      fallback_used: !tiersHit.includes("tier1_exact"),
      tiers_hit: tiersHit,
    },
    destinations,
  };
}

module.exports = { generateDestinations };

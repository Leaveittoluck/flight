/**
 * Normalize a raw backend destination object into a safe frontend shape.
 * Any field may be absent — defaults to null / empty array so components
 * can render defensively without extra null checks everywhere.
 */
export function normalizeDestination(dest = {}) {
  return {
    id: dest.destination_id,
    city: dest.city || null,
    country: dest.country || null,
    hook: dest.hook || null,
    fun_fact: dest.fun_fact || null,
    weather_summary: dest.weather_summary || null,
    estimated_total_cost: dest.estimated_total_cost ?? null,
    flight_cost_per_person_gbp: dest.flight_cost_per_person_gbp ?? null,
    hotel_cost_per_night_gbp: dest.hotel_cost_per_night_gbp ?? null,
    default_duration_nights: dest.default_duration_nights ?? null,
    iata_code: dest.iata_code || null,
    trip_types: Array.isArray(dest.trip_types) ? dest.trip_types : [],
    recommended_places: Array.isArray(dest.recommended_places) ? dest.recommended_places : [],
    skyscanner_url: dest.skyscanner_url || null,
    booking_com_url: dest.booking_com_url || null,
  }
}

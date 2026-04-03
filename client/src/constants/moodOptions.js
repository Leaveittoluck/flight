// Maps user-facing mood labels to backend trip_type_slug values.
//
// ⚠ IMPORTANT — SLUG VERIFICATION REQUIRED:
// These slugs were written without a DB seed file or migration to confirm them.
// They MUST match the `slug` column in the `flight.trip_types` table exactly.
//
// To verify, run this query against your database:
//   SELECT slug, label FROM flight.trip_types WHERE is_active = true ORDER BY slug;
//
// If any slug here doesn't exist in the DB, that mood option will silently return
// zero results. The safest long-term fix is a GET /api/trip-types endpoint that
// returns live slugs so this file can be auto-populated or validated at build time.
export const MOOD_OPTIONS = [
  { label: 'Beach & Sun', value: 'beach' },
  { label: 'City Break', value: 'city_break' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Skiing', value: 'skiing' },
  { label: 'Relaxation', value: 'relaxation' },
]

import { describe, it, expect } from 'vitest'
import { normalizeDestination } from './normalizeDestination'

describe('normalizeDestination', () => {
  it('maps destination_id to id and passes through known fields', () => {
    const result = normalizeDestination({
      destination_id: 7,
      city: 'Lisbon',
      country: 'Portugal',
    })
    expect(result.id).toBe(7)
    expect(result.city).toBe('Lisbon')
    expect(result.country).toBe('Portugal')
  })

  it('defaults missing string fields to null', () => {
    const result = normalizeDestination({})
    expect(result.city).toBeNull()
    expect(result.hook).toBeNull()
    expect(result.fun_fact).toBeNull()
    expect(result.weather_summary).toBeNull()
    expect(result.iata_code).toBeNull()
  })

  it('treats an empty string the same as a missing string field (falls back to null)', () => {
    const result = normalizeDestination({ city: '' })
    expect(result.city).toBeNull()
  })

  it('leaves id undefined when destination_id is missing, rather than defaulting it', () => {
    const result = normalizeDestination({})
    expect(result.id).toBeUndefined()
  })

  it('defaults trip_types and recommended_places to empty arrays when absent or not arrays', () => {
    expect(normalizeDestination({}).trip_types).toEqual([])
    expect(normalizeDestination({}).recommended_places).toEqual([])
    expect(normalizeDestination({ trip_types: 'not-an-array' }).trip_types).toEqual([])
  })

  it('preserves provided trip_types and recommended_places arrays', () => {
    const result = normalizeDestination({
      trip_types: [{ slug: 'beach' }],
      recommended_places: [{ name: 'Old Town' }],
    })
    expect(result.trip_types).toEqual([{ slug: 'beach' }])
    expect(result.recommended_places).toEqual([{ name: 'Old Town' }])
  })

  it('preserves a numeric 0 in nullish-coalesced cost fields instead of defaulting it', () => {
    const result = normalizeDestination({ flight_total_cost: 0, hotel_rooms_needed: 0 })
    expect(result.flight_total_cost).toBe(0)
    expect(result.hotel_rooms_needed).toBe(0)
  })

  it('preserves an explicit false in hotel_affordable_after_flight instead of defaulting it to null', () => {
    const result = normalizeDestination({ hotel_affordable_after_flight: false })
    expect(result.hotel_affordable_after_flight).toBe(false)
  })

  it('defaults nullish-coalesced cost fields to null when truly absent', () => {
    const result = normalizeDestination({})
    expect(result.flight_total_cost).toBeNull()
    expect(result.hotel_affordable_after_flight).toBeNull()
    expect(result.total_trip_cost_estimate).toBeNull()
  })
})

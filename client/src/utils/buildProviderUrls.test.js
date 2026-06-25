import { describe, it, expect, vi, afterEach } from 'vitest'
import { buildSkyscannerUrl, buildBookingUrl } from './buildProviderUrls'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('buildSkyscannerUrl', () => {
  it('builds a round-trip URL with correctly encoded dates and params', () => {
    const url = buildSkyscannerUrl({
      originIata: 'STN',
      destIata: 'BCN',
      departureDate: '2026-09-10',
      returnDate: '2026-09-17',
      adults: 2,
    })
    expect(url).toContain('/transport/flights/STN/BCN/260910/260917/')
    expect(url).toContain('adultsv2=2')
    expect(url).toContain('cabinclass=economy')
    expect(url).toContain('currency=GBP')
    expect(url).toContain('locale=en-GB')
    expect(url).toContain('market=UK')
  })

  it('builds a one-way URL without a second date segment', () => {
    const url = buildSkyscannerUrl({
      originIata: 'STN',
      destIata: 'BCN',
      departureDate: '2026-09-10',
      returnDate: null,
      adults: 1,
    })
    expect(url).toContain('/transport/flights/STN/BCN/260910/?')
    expect(url).not.toMatch(/260910\/\d{6}\//)
  })

  it('falls back to the static fallback URL when destIata is missing', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const url = buildSkyscannerUrl({
      originIata: 'STN',
      destIata: null,
      departureDate: '2026-09-10',
      adults: 1,
      fallbackUrl: 'https://example.com/static',
    })
    expect(url).toBe('https://example.com/static')
  })

  it('falls back to the generic skyscanner homepage when departureDate is missing and no fallbackUrl is given', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const url = buildSkyscannerUrl({
      originIata: 'STN',
      destIata: 'BCN',
      departureDate: null,
      adults: 1,
      fallbackUrl: null,
    })
    expect(url).toBe('https://www.skyscanner.net')
  })
})

describe('buildBookingUrl', () => {
  it('uses an explicit checkoutDate when provided, and combines city+country into ss', () => {
    const url = buildBookingUrl({
      city: 'Barcelona',
      country: 'Spain',
      checkinDate: '2026-09-10',
      checkoutDate: '2026-09-20',
      durationNights: 3,
      adults: 2,
    })
    const params = new URL(url).searchParams
    expect(params.get('checkin')).toBe('2026-09-10')
    expect(params.get('checkout')).toBe('2026-09-20')
    expect(params.get('ss')).toBe('Barcelona, Spain')
  })

  it('derives checkout from durationNights when checkoutDate is not given', () => {
    const url = buildBookingUrl({
      city: 'Barcelona',
      country: 'Spain',
      checkinDate: '2026-09-10',
      checkoutDate: null,
      durationNights: 5,
      adults: 2,
    })
    expect(url).toContain('checkin=2026-09-10')
    expect(url).toContain('checkout=2026-09-15')
  })

  it('defaults checkout to 7 nights when neither checkoutDate nor durationNights is given', () => {
    const url = buildBookingUrl({
      city: 'Barcelona',
      country: 'Spain',
      checkinDate: '2026-09-10',
      checkoutDate: null,
      durationNights: null,
      adults: 2,
    })
    expect(url).toContain('checkout=2026-09-17')
  })

  it('omits the country from the search string when country is not given', () => {
    const url = buildBookingUrl({
      city: 'Barcelona',
      country: null,
      checkinDate: '2026-09-10',
      checkoutDate: '2026-09-12',
      adults: 1,
    })
    const params = new URL(url).searchParams
    expect(params.get('ss')).toBe('Barcelona')
  })

  it.each([
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 2],
  ])('rounds %i adults up to %i rooms', (adults, expectedRooms) => {
    const url = buildBookingUrl({
      city: 'Barcelona',
      country: 'Spain',
      checkinDate: '2026-09-10',
      checkoutDate: '2026-09-12',
      adults,
    })
    const params = new URL(url).searchParams
    expect(params.get('no_rooms')).toBe(String(expectedRooms))
  })

  it('falls back to the static fallback URL when city is missing', () => {
    const url = buildBookingUrl({
      city: null,
      checkinDate: '2026-09-10',
      adults: 1,
      fallbackUrl: 'https://example.com/static-hotel',
    })
    expect(url).toBe('https://example.com/static-hotel')
  })

  it('falls back to the generic booking.com homepage when checkinDate is missing and no fallbackUrl is given', () => {
    const url = buildBookingUrl({
      city: 'Barcelona',
      checkinDate: null,
      adults: 1,
      fallbackUrl: null,
    })
    expect(url).toBe('https://www.booking.com')
  })
})

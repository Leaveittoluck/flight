// Converts a YYYY-MM-DD string to Skyscanner's 6-digit YYMMDD path segment.
// e.g. '2025-06-15' → '250615'
function toSkyscannerDate(isoDate) {
  return isoDate.replace(/-/g, '').slice(2)
}

// Adds N days to a YYYY-MM-DD string, using UTC math to avoid timezone drift.
function addDays(isoDate, n) {
  const d = new Date(isoDate + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/**
 * Build a Skyscanner flight-search deep link.
 *
 * URL shape:
 *   /transport/flights/{from}/{to}/{dep_yymmdd}/[{ret_yymmdd}/]?adults=N&cabinclass=economy
 *
 * @param {object}      opts
 * @param {string}      opts.originIata    - departure airport IATA (e.g. 'STN')
 * @param {string|null} opts.destIata      - destination airport IATA (e.g. 'BCN'); populate via migration 003
 * @param {string}      opts.departureDate - YYYY-MM-DD
 * @param {string|null} opts.returnDate    - YYYY-MM-DD or null for one-way
 * @param {number}      opts.adults        - traveller count
 * @param {string|null} opts.fallbackUrl   - static skyscanner_url from DB; used when destIata is missing
 * @returns {string}
 */
export function buildSkyscannerUrl({ originIata, destIata, departureDate, returnDate, adults, fallbackUrl }) {
  if (!destIata || !departureDate) {
    // destIata not yet populated for this destination — fall back to DB URL
    return fallbackUrl || 'https://www.skyscanner.net'
  }

  const dep = toSkyscannerDate(departureDate)
  const basePath = `https://www.skyscanner.net/transport/flights/${originIata}/${destIata}/${dep}/`
  const path = returnDate ? `${basePath}${toSkyscannerDate(returnDate)}/` : basePath
  const params = new URLSearchParams({ adults: String(adults), cabinclass: 'economy' })
  return `${path}?${params}`
}

/**
 * Build a Booking.com hotel-search URL.
 *
 * Uses the city name for the `ss` (search string) param — no IATA code needed.
 * Checkout is derived from returnDate if provided, or from durationNights, or
 * falls back to a 7-night default.
 *
 * @param {object}      opts
 * @param {string}      opts.city          - destination city (e.g. 'Barcelona')
 * @param {string|null} opts.country       - destination country (e.g. 'Spain')
 * @param {string}      opts.checkinDate   - YYYY-MM-DD
 * @param {string|null} opts.checkoutDate  - YYYY-MM-DD, or null → derive from durationNights
 * @param {number|null} opts.durationNights - destination's default_duration_nights; used when checkoutDate is null
 * @param {number}      opts.adults        - traveller count
 * @param {string|null} opts.fallbackUrl   - static booking_com_url from DB; used when city is missing
 * @returns {string}
 */
export function buildBookingUrl({ city, country, checkinDate, checkoutDate, durationNights, adults, fallbackUrl }) {
  if (!city || !checkinDate) {
    return fallbackUrl || 'https://www.booking.com'
  }

  const checkout = checkoutDate
    || (durationNights ? addDays(checkinDate, durationNights) : addDays(checkinDate, 7))

  const params = new URLSearchParams({
    ss: country ? `${city}, ${country}` : city,
    checkin: checkinDate,
    checkout,
    group_adults: String(adults),
    no_rooms: String(Math.ceil(adults / 2)),
  })
  return `https://www.booking.com/searchresults.html?${params}`
}

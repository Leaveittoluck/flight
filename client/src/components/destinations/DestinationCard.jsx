import { useState } from 'react'
import { trackClick } from '../../services/clicksApi'
import { buildSkyscannerUrl, buildBookingUrl } from '../../utils/buildProviderUrls'
import DestinationWeather from './DestinationWeather'
import DestinationVibes from './DestinationVibes'
import SeasonalCardAccent from './SeasonalCardAccent'
import { weatherEnrichment } from '../../data/weatherEnrichment'
import { destinationVibes } from '../../data/destinationVibes'
import { useSeasonTheme } from '../../hooks/useSeasonTheme'

function formatGBP(amount) {
  if (amount == null) return null
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount)
}

function CtaTooltip({ message }) {
  return (
    <div
      role="tooltip"
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-white text-xs rounded-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      style={{ backgroundColor: '#431407', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
    >
      {message}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: '#431407' }} />
    </div>
  )
}

function resolveCtaError(err) {
  if (err?.response?.data?.code === 'CLICK_LIMIT_REACHED') {
    return "You've reached your monthly click limit. Upgrade to continue."
  }
  return 'Something went wrong. Try again in a moment.'
}

export default function DestinationCard({ destination: d, tripInput }) {
  const weather = weatherEnrichment[d.iata_code] ?? null
  const vibes = destinationVibes[d.iata_code] ?? null
  const theme = useSeasonTheme(d, tripInput)
  const resolvedSeason = (
    tripInput?.season?.toLowerCase?.() ||
    weather?.bestSeason?.toLowerCase?.() ||
    'spring'
  )

  // pending: null | 'flight' | 'hotel'
  const [pending, setPending] = useState(null)
  // ctaError: { type: null | 'flight' | 'hotel', message: string }
  const [ctaError, setCtaError] = useState({ type: null, message: '' })
  // Unlocked when the user opens the flight link for this destination
  const [flightClicked, setFlightClicked] = useState(false)
  // Set once the backend reports the monthly click quota is exhausted
  const [limitReached, setLimitReached] = useState(false)
  // Latest known usage snapshot from the backend — display only
  const [usage, setUsage] = useState(null)

  function resolveUrl(type) {
    if (type === 'flight') {
      return buildSkyscannerUrl({
        originIata: tripInput?.originIata ?? 'STN',
        destIata: d.iata_code,
        departureDate: tripInput?.departureDate ?? null,
        returnDate: tripInput?.returnDate ?? null,
        adults: tripInput?.travellers ?? 1,
        fallbackUrl: d.skyscanner_url,
      })
    }
    return buildBookingUrl({
      city: d.city,
      country: d.country,
      checkinDate: tripInput?.departureDate ?? null,
      checkoutDate: tripInput?.returnDate ?? null,
      durationNights: d.default_duration_nights,
      adults: tripInput?.travellers ?? 1,
      fallbackUrl: d.booking_com_url,
    })
  }

  async function handleCtaClick(type) {
    if (pending || limitReached) return
    if (type === 'hotel' && !flightClicked) return

    // Open a blank tab synchronously, within the click gesture, so popup
    // blockers don't interfere. Its destination is only filled in once the
    // backend confirms the click is allowed — the backend is the source of
    // truth on whether this click counts and may book.
    const tab = window.open('', '_blank', 'noopener,noreferrer')

    setPending(type)
    setCtaError({ type: null, message: '' })
    try {
      const res = await trackClick({ destination_id: d.id, click_type: type })
      const data = res.data?.data

      if (tab) tab.location = resolveUrl(type)
      else window.open(resolveUrl(type), '_blank', 'noopener,noreferrer')

      if (type === 'flight') setFlightClicked(true)
      setUsage(data)
      if (data?.clicksRemaining === 0) setLimitReached(true)
    } catch (err) {
      tab?.close()
      if (err?.response?.data?.code === 'CLICK_LIMIT_REACHED') {
        setLimitReached(true)
        setUsage(err.response.data.data)
      }
      setCtaError({ type, message: resolveCtaError(err) })
    } finally {
      setPending(null)
    }
  }

  const canSearchFlights = !!(d.iata_code || d.skyscanner_url)
  const canFindHotels    = !!(d.city || d.booking_com_url)

  // Static Skyscanner URL (no iata_code) does not carry the adults parameter.
  // Show a notice so the user knows to adjust headcount on the Skyscanner page.
  const skyscannerPassengerCaveat =
    !d.iata_code && (tripInput?.travellers ?? 1) > 1

  const hotelDisabled = !!pending || !flightClicked || limitReached
  const hotelTooltipMessage = !flightClicked
    ? 'Search flights first to unlock hotels'
    : "You've reached your monthly click limit"

  return (
    <article
      className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{
        backgroundColor: '#fff7ed',
        border: '1.5px solid rgba(251,146,60,0.2)',
        boxShadow: '0 2px 16px rgba(249,115,22,0.08)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 12px 36px rgba(249,115,22,0.18)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 16px rgba(249,115,22,0.08)')}
    >
      {/* ── SEASONAL ACCENT BAR ── */}
      <div
        aria-hidden="true"
        className="h-1 w-full"
        style={{ background: theme.accentGradient }}
      />

      {/* ── HERO: city, cost, hook ── */}
      <div className="p-6 pb-5 relative overflow-hidden">
        {/* Seasonal gradient wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: theme.heroGradient }}
        />
        <SeasonalCardAccent season={resolvedSeason} color={theme.color} />

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            {(d.city || d.country) && (
              <h3 className="text-2xl font-bold text-stone-900 leading-tight">
                {d.city && <span>{d.city}</span>}
                {d.city && d.country && (
                  <span className="text-stone-400 font-normal">, </span>
                )}
                {d.country && (
                  <span className="text-stone-500 font-semibold text-xl">{d.country}</span>
                )}
              </h3>
            )}
            {d.hook && (
              <p className="mt-2 text-stone-600 text-base leading-snug max-w-prose">
                {d.hook}
              </p>
            )}
          </div>

          {/* Price as vivid orange badge */}
          {d.total_trip_cost_estimate != null && (
            <div
              className="shrink-0 text-center px-4 py-3 rounded-2xl text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #ea580c, #f97316)',
                boxShadow: '0 4px 14px rgba(234,88,12,0.35)',
              }}
            >
              <div className="text-2xl font-bold leading-none">
                {formatGBP(Math.ceil(d.total_trip_cost_estimate / (tripInput?.travellers ?? 1)))}
              </div>
              <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                per person
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {formatGBP(d.total_trip_cost_estimate)} total
              </p>
            </div>
          )}
        </div>

        {/* Trip type tags */}
        {d.trip_types.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {d.trip_types.map((t) => (
              <span
                key={t.id ?? t.slug}
                className="text-xs px-3 py-1 rounded-full font-bold tracking-wide"
                style={
                  t.is_primary
                    ? { backgroundColor: 'rgba(249,115,22,0.12)', color: '#ea580c', border: '1px solid rgba(249,115,22,0.2)' }
                    : { backgroundColor: 'rgba(120,113,108,0.08)', color: '#78716c', border: '1px solid rgba(120,113,108,0.15)' }
                }
              >
                {t.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── COST BREAKDOWN ── */}
      {(d.flight_total_cost != null || d.hotel_total_cost != null) && (
        <div
          className="px-6 py-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600"
          style={{ borderTop: '1px solid rgba(251,146,60,0.15)', backgroundColor: 'rgba(254,243,199,0.5)' }}
        >
          {d.flight_total_cost != null && (
            <span className="flex items-center gap-1.5">
              <span className="text-base">✈</span>
              <span>
                <span className="font-semibold text-stone-800">{formatGBP(d.flight_total_cost)}</span>{' '}
                Estimated flights
                {d.flight_cost_per_person_gbp != null && tripInput?.travellers > 1 && (
                  <span className="text-stone-400"> ({formatGBP(d.flight_cost_per_person_gbp)}/person)</span>
                )}
              </span>
            </span>
          )}
          {d.hotel_total_cost != null && d.default_duration_nights != null && (
            <span className="flex items-center gap-1.5">
              <span className="text-base">🏨</span>
              <span>
                <span className="font-semibold text-stone-800">{formatGBP(d.hotel_total_cost)}</span>{' '}
                Estimated hotel &middot; {d.default_duration_nights} nights
                {d.hotel_rooms_needed > 1 && (
                  <span className="text-stone-400"> ({d.hotel_rooms_needed} rooms)</span>
                )}
              </span>
            </span>
          )}
        </div>
      )}

      {/* ── WEATHER ── */}
      <DestinationWeather weather={weather} fallbackSummary={d.weather_summary} />

      {/* ── VIBES ── */}
      <DestinationVibes vibes={vibes} />

      {/* ── FUN FACT ── */}
      {d.fun_fact && (
        <div style={{ borderTop: '1px solid rgba(251,146,60,0.15)', backgroundColor: '#fef9c3' }} className="px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#d97706' }}>
            Fun fact
          </p>
          <p className="text-sm text-amber-900">{d.fun_fact}</p>
        </div>
      )}

      {/* ── RECOMMENDED PLACES ── */}
      {d.recommended_places.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(251,146,60,0.12)' }} className="px-6 py-4">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
            Worth visiting
          </p>
          <ul className="space-y-2">
            {d.recommended_places.map((place, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="mt-0.5 shrink-0" style={{ color: '#f97316' }}>•</span>
                <span>
                  <span className="font-semibold text-stone-800">{place.name}</span>
                  {place.description && (
                    <span className="text-stone-500"> — {place.description}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── CTA BUTTONS ── */}
      {(canSearchFlights || canFindHotels) && (
        <div style={{ borderTop: '1px solid rgba(251,146,60,0.15)' }} className="px-6 py-4">
          <div className="flex gap-3">
            {canSearchFlights && (
              <div className="relative group">
                <button
                  onClick={() => handleCtaClick('flight')}
                  disabled={!!pending || limitReached}
                  title={limitReached ? "You've reached your monthly click limit" : undefined}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-white px-5 py-2.5 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #ea580c, #f97316)',
                    boxShadow: '0 3px 12px rgba(234,88,12,0.3)',
                  }}
                >
                  {pending === 'flight' ? 'Opening…' : flightClicked ? 'Search again →' : 'Search flights →'}
                </button>
              </div>
            )}
            {canFindHotels && (
              <div className={`relative group ${hotelDisabled ? 'cursor-not-allowed' : ''}`}>
                <button
                  onClick={() => handleCtaClick('hotel')}
                  disabled={hotelDisabled}
                  title={hotelDisabled ? hotelTooltipMessage : undefined}
                  className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'rgba(249,115,22,0.1)',
                    color: '#ea580c',
                    border: '1.5px solid rgba(249,115,22,0.25)',
                  }}
                >
                  {pending === 'hotel' ? 'Opening…' : 'Find hotels →'}
                </button>
                {hotelDisabled && <CtaTooltip message={hotelTooltipMessage} />}
              </div>
            )}
          </div>

          {/* Price estimate disclaimer */}
          <p className="mt-3 text-xs text-stone-400">
            Prices are estimates. Final live prices may vary on partner sites.
          </p>

          {skyscannerPassengerCaveat && (
            <p className="mt-1.5 text-xs text-stone-500">
              Adjust passenger count on Skyscanner before booking
            </p>
          )}

          {flightClicked && d.remaining_budget_after_flight != null && (
            d.hotel_affordable_after_flight ? (
              <p className="mt-2.5 text-xs text-green-700 font-semibold">
                {formatGBP(d.remaining_budget_after_flight)} left after flights — hotels fit your budget
              </p>
            ) : (
              <p className="mt-2.5 text-xs font-semibold" style={{ color: '#f97316' }}>
                {formatGBP(d.remaining_budget_after_flight)} left after flights — hotel cost may push over budget
              </p>
            )
          )}

          {usage && usage.clicksRemaining !== null && usage.clicksRemaining > 0 && (
            <p className="mt-2.5 text-xs text-stone-400">
              {usage.clicksRemaining} click{usage.clicksRemaining === 1 ? '' : 's'} remaining this month
            </p>
          )}

          {ctaError.message && (
            <p className="mt-2.5 text-xs text-red-600 font-semibold">{ctaError.message}</p>
          )}
        </div>
      )}
    </article>
  )
}

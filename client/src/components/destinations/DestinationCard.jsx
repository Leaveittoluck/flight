import { useState } from 'react'
import { trackClick } from '../../services/clicksApi'
import { buildSkyscannerUrl, buildBookingUrl } from '../../utils/buildProviderUrls'

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
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
    >
      {message}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
    </div>
  )
}

function resolveCtaError(err) {
  const status = err?.response?.status
  const code = err?.response?.data?.code
  if (status === 429 || code === 'LIMIT_REACHED') {
    return "You've reached your monthly limit. Upgrade to continue."
  }
  return "Click tracking failed — your link still opened."
}

export default function DestinationCard({ destination: d, clicksRemaining, onClickUsed, tripInput }) {
  // pending: null | 'flight' | 'hotel'
  const [pending, setPending] = useState(null)
  // ctaError: { type: null | 'flight' | 'hotel', message: string }
  const [ctaError, setCtaError] = useState({ type: null, message: '' })
  // Unlocked when the user opens the flight link for this destination
  const [flightClicked, setFlightClicked] = useState(false)

  const limitReached = clicksRemaining === 0

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

    // Open synchronously — before any await so popup blockers don't interfere
    // and so tracking failure can never block the redirect.
    window.open(resolveUrl(type), '_blank', 'noopener,noreferrer')

    // Unlock hotel button as soon as the flight link opens.
    if (type === 'flight') setFlightClicked(true)

    setPending(type)
    setCtaError({ type: null, message: '' })
    try {
      const res = await trackClick({ destination_id: d.id, click_type: type })
      onClickUsed(res.data?.data?.remaining_clicks ?? 0)
    } catch (err) {
      setCtaError({ type, message: resolveCtaError(err) })
    } finally {
      setPending(null)
    }
  }

  const canSearchFlights = !!(d.iata_code || d.skyscanner_url)
  const canFindHotels    = !!(d.city || d.booking_com_url)

  // Hotel button reasons for being disabled
  const hotelDisabledByQuota  = limitReached
  const hotelDisabledByOrder  = !flightClicked && !limitReached
  const hotelDisabled         = !!pending || hotelDisabledByQuota || hotelDisabledByOrder

  const hotelTooltipMessage = hotelDisabledByQuota
    ? 'Upgrade to continue booking'
    : 'Search flights first to unlock hotels'

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ── HERO: city, cost, hook ── */}
      <div className="p-6 pb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            {(d.city || d.country) && (
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                {d.city && <span>{d.city}</span>}
                {d.city && d.country && (
                  <span className="text-slate-400 font-normal">, </span>
                )}
                {d.country && (
                  <span className="text-slate-500 font-semibold text-xl">{d.country}</span>
                )}
              </h3>
            )}
            {d.hook && (
              <p className="mt-2 text-slate-600 text-base leading-snug max-w-prose">
                {d.hook}
              </p>
            )}
          </div>

          {d.total_trip_cost_estimate != null && (
            <div className="shrink-0 text-right">
              <div className="text-3xl font-extrabold text-blue-600 leading-none">
                {formatGBP(d.total_trip_cost_estimate)}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wide">
                est. total
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
                className={`text-xs px-3 py-1 rounded-full font-semibold tracking-wide ${
                  t.is_primary
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {t.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── COST BREAKDOWN ── */}
      {(d.flight_total_cost != null || d.hotel_total_cost != null || d.weather_summary) && (
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          {d.flight_total_cost != null && (
            <span className="flex items-center gap-1.5">
              <span className="text-base">✈</span>
              <span>
                <span className="font-semibold text-slate-800">
                  {formatGBP(d.flight_total_cost)}
                </span>{' '}
                flights
                {d.flight_cost_per_person_gbp != null && tripInput?.travellers > 1 && (
                  <span className="text-slate-400">
                    {' '}({formatGBP(d.flight_cost_per_person_gbp)}/person)
                  </span>
                )}
              </span>
            </span>
          )}
          {d.hotel_total_cost != null && d.default_duration_nights != null && (
            <span className="flex items-center gap-1.5">
              <span className="text-base">🏨</span>
              <span>
                <span className="font-semibold text-slate-800">
                  {formatGBP(d.hotel_total_cost)}
                </span>{' '}
                hotel &middot; {d.default_duration_nights} nights
                {d.hotel_rooms_needed > 1 && (
                  <span className="text-slate-400"> ({d.hotel_rooms_needed} rooms)</span>
                )}
              </span>
            </span>
          )}
          {d.weather_summary && (
            <span className="flex items-center gap-1.5">
              <span className="text-base">🌤</span>
              <span>{d.weather_summary}</span>
            </span>
          )}
        </div>
      )}

      {/* ── FUN FACT ── */}
      {d.fun_fact && (
        <div className="border-t border-amber-100 bg-amber-50 px-6 py-4">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            Fun fact
          </p>
          <p className="text-sm text-amber-900">{d.fun_fact}</p>
        </div>
      )}

      {/* ── RECOMMENDED PLACES ── */}
      {d.recommended_places.length > 0 && (
        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Worth visiting
          </p>
          <ul className="space-y-2">
            {d.recommended_places.map((place, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                <span>
                  <span className="font-semibold text-slate-800">{place.name}</span>
                  {place.description && (
                    <span className="text-slate-500"> — {place.description}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── CTA BUTTONS ── */}
      {(canSearchFlights || canFindHotels) && (
        <div className="border-t border-slate-100 px-6 py-4">
          <div className="flex gap-3">
            {canSearchFlights && (
              <div className={`relative group ${limitReached ? 'cursor-not-allowed' : ''}`}>
                <button
                  onClick={() => handleCtaClick('flight')}
                  disabled={!!pending || limitReached}
                  title={limitReached ? 'Upgrade to continue booking' : undefined}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  {pending === 'flight' ? 'Opening…' : flightClicked ? 'Search flights again →' : 'Search flights →'}
                </button>
                {limitReached && <CtaTooltip message="Upgrade to continue booking" />}
              </div>
            )}
            {canFindHotels && (
              <div className={`relative group ${hotelDisabled ? 'cursor-not-allowed' : ''}`}>
                <button
                  onClick={() => handleCtaClick('hotel')}
                  disabled={hotelDisabled}
                  title={hotelDisabled ? hotelTooltipMessage : undefined}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  {pending === 'hotel' ? 'Opening…' : 'Find hotels →'}
                </button>
                {hotelDisabled && <CtaTooltip message={hotelTooltipMessage} />}
              </div>
            )}
          </div>

          {/* Budget status after flight click */}
          {flightClicked && d.remaining_budget_after_flight != null && (
            d.hotel_affordable_after_flight ? (
              <p className="mt-2.5 text-xs text-green-700 font-medium">
                {formatGBP(d.remaining_budget_after_flight)} left after flights — hotels should fit your budget
              </p>
            ) : (
              <p className="mt-2.5 text-xs text-amber-600 font-medium">
                {formatGBP(d.remaining_budget_after_flight)} left after flights — hotels may exceed your remaining budget
              </p>
            )
          )}

          {limitReached && (
            <p className="mt-2.5 text-xs text-amber-600 font-medium">
              You've reached your limit. Upgrade to continue.
            </p>
          )}
          {!limitReached && ctaError.message && (
            <p className="mt-2.5 text-xs text-red-600 font-medium">{ctaError.message}</p>
          )}
        </div>
      )}
    </article>
  )
}

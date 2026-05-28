import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { trackClick } from '../services/clicksApi'
import { buildSkyscannerUrl, buildBookingUrl } from '../utils/buildProviderUrls'
import { weatherEnrichment } from '../data/weatherEnrichment'

const SESSION_KEY = 'litl_last_result'

/* ── Mood → cinematic gradient background ─────────────────────────────── */
const MOOD_BACKGROUNDS = {
  adventure:     'linear-gradient(160deg, #0c1a0c 0%, #1a3a1a 30%, #2d6a2d 60%, #c2410c 100%)',
  beach:         'linear-gradient(160deg, #0c1428 0%, #0e3060 35%, #0369a1 65%, #06b6d4 100%)',
  cultural:      'linear-gradient(160deg, #1c0f00 0%, #7c2d12 30%, #c2410c 55%, #f59e0b 100%)',
  romantic:      'linear-gradient(160deg, #1a0010 0%, #6b0f2d 40%, #be185d 70%, #ec4899 100%)',
  relaxation:    'linear-gradient(160deg, #001a20 0%, #0f4c5c 40%, #0891b2 70%, #06b6d4 100%)',
  nature:        'linear-gradient(160deg, #0a1a0a 0%, #1a3a1a 35%, #15803d 65%, #4ade80 100%)',
  foodie:        'linear-gradient(160deg, #1a0a00 0%, #7c2d12 40%, #d97706 70%, #fbbf24 100%)',
  'city-break':  'linear-gradient(160deg, #0a0a14 0%, #1e1b4b 40%, #3730a3 70%, #818cf8 100%)',
  city:          'linear-gradient(160deg, #0a0a14 0%, #1e1b4b 40%, #3730a3 70%, #818cf8 100%)',
  winter:        'linear-gradient(160deg, #0a1020 0%, #0f2a50 35%, #1e40af 65%, #38bdf8 100%)',
}
const DEFAULT_BG = 'linear-gradient(160deg, #1c0f00 0%, #7c2d12 30%, #c2410c 55%, #f97316 75%, #fbbf24 95%)'

function formatGBP(amount) {
  if (amount == null) return null
  return new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'GBP', maximumFractionDigits: 0,
  }).format(amount)
}

function resolveCtaError(err) {
  const code = err?.response?.data?.code
  if (err?.response?.status === 429 || code === 'LIMIT_REACHED') {
    return "You've reached your monthly limit. Upgrade to continue."
  }
  return "Click tracking failed — your link still opened."
}

export default function DestinationResultPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Prefer location state; fall back to sessionStorage (survives soft refresh)
  const [resultData] = useState(() => {
    if (location.state?.destination) return location.state
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  useEffect(() => {
    if (!resultData) navigate('/travel', { replace: true })
  }, [resultData, navigate])

  const [pending, setPending]           = useState(null)
  const [ctaError, setCtaError]         = useState({ type: null, message: '' })
  const [flightClicked, setFlightClicked] = useState(false)
  const [clicksRemaining, setClicksRemaining] = useState(null)

  if (!resultData) return null

  const { destination: d, tripInput } = resultData

  const weather      = weatherEnrichment[d.iata_code] ?? null
  const limitReached = clicksRemaining === 0
  const hotelDisabled = !!pending || limitReached || !flightClicked
  const canSearchFlights = !!(d.iata_code || d.skyscanner_url)
  const canFindHotels    = !!(d.city || d.booking_com_url)

  const primarySlug = d.trip_types?.find(t => t.is_primary)?.slug
                   ?? d.trip_types?.[0]?.slug
                   ?? 'default'
  const bgGradient = MOOD_BACKGROUNDS[primarySlug] ?? DEFAULT_BG

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

    // Open link synchronously so popup blockers don't interfere
    window.open(resolveUrl(type), '_blank', 'noopener,noreferrer')
    if (type === 'flight') setFlightClicked(true)

    setPending(type)
    setCtaError({ type: null, message: '' })
    try {
      const res = await trackClick({ destination_id: d.id, click_type: type })
      setClicksRemaining(res.data?.data?.remaining_clicks ?? 0)
    } catch (err) {
      setCtaError({ type, message: resolveCtaError(err) })
    } finally {
      setPending(null)
    }
  }

  const perPersonEst = d.total_trip_cost_estimate != null
    ? Math.ceil(d.total_trip_cost_estimate / (tripInput?.travellers ?? 1))
    : null

  const weatherText = d.weather_summary
    || (weather?.bestSeason ? `Best visited in ${weather.bestSeason}` : null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff7ed' }}>

      {/* ══════════ HERO ══════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: bgGradient, minHeight: '72vh' }}
      >
        {/* Atmospheric light overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 70% 25%, rgba(255,255,255,0.06) 0%, transparent 60%)',
          }}
        />
        {/* Text-readability gradient at bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.65) 100%)' }}
        />

        {/* Back button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/travel"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:-translate-y-px"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            ← Back to form
          </Link>
        </div>

        {/* Hero content */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 pb-10 max-w-4xl mx-auto"
          style={{ animation: 'fadeInUp 0.65s ease forwards' }}
        >
          {/* Trip type badges */}
          {d.trip_types?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {d.trip_types.map((t) => (
                <span
                  key={t.id ?? t.slug}
                  className="text-xs px-3 py-1 rounded-full font-bold tracking-widest uppercase"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: 'white',
                  }}
                >
                  {t.label}
                </span>
              ))}
            </div>
          )}

          {/* City + Country */}
          <h1 className="font-bold text-white tracking-tight leading-tight mb-1" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
            {d.city}
          </h1>
          {d.country && (
            <p
              className="text-xl sm:text-2xl font-semibold mb-5"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {d.country}
            </p>
          )}

          {/* Price badge + hook in a row */}
          <div className="flex flex-wrap items-start gap-4">
            {perPersonEst != null && (
              <div
                className="rounded-2xl px-4 py-3 text-white shadow-lg shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #ea580c, #f97316)',
                  boxShadow: '0 4px 16px rgba(234,88,12,0.45)',
                }}
              >
                <div className="text-2xl font-bold leading-none">{formatGBP(perPersonEst)}</div>
                <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  per person (est.)
                </p>
              </div>
            )}
            {d.hook && (
              <p
                className="text-base sm:text-lg italic flex-1 min-w-0 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '500px' }}
              >
                "{d.hook}"
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ══════════ DETAIL PANEL ══════════ */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-4">

        {/* Cost breakdown */}
        {(d.flight_total_cost != null || d.hotel_total_cost != null) && (
          <div
            className="rounded-2xl p-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600"
            style={{ backgroundColor: 'rgba(254,243,199,0.75)', border: '1px solid rgba(251,146,60,0.2)' }}
          >
            {d.flight_total_cost != null && (
              <span className="flex items-center gap-2">
                <span>✈</span>
                <span>
                  <span className="font-semibold text-stone-800">{formatGBP(d.flight_total_cost)}</span>
                  {' '}estimated flights
                  {d.flight_cost_per_person_gbp != null && tripInput?.travellers > 1 && (
                    <span className="text-stone-400"> ({formatGBP(d.flight_cost_per_person_gbp)}/person)</span>
                  )}
                </span>
              </span>
            )}
            {d.hotel_total_cost != null && d.default_duration_nights != null && (
              <span className="flex items-center gap-2">
                <span>🏨</span>
                <span>
                  <span className="font-semibold text-stone-800">{formatGBP(d.hotel_total_cost)}</span>
                  {' '}estimated hotel · {d.default_duration_nights} nights
                  {d.hotel_rooms_needed > 1 && (
                    <span className="text-stone-400"> ({d.hotel_rooms_needed} rooms)</span>
                  )}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Fun fact */}
        {d.fun_fact && (
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#fef9c3', border: '1px solid rgba(217,119,6,0.2)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#d97706' }}>
              Fun Fact
            </p>
            <p className="text-sm text-amber-900 leading-relaxed">{d.fun_fact}</p>
          </div>
        )}

        {/* Recommended places */}
        {d.recommended_places?.length > 0 && (
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid rgba(251,146,60,0.15)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-stone-400">
              Worth Visiting
            </p>
            <ul className="space-y-2.5">
              {d.recommended_places.slice(0, 5).map((place, i) => (
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

        {/* Weather */}
        {weatherText && (
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid rgba(251,146,60,0.15)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-stone-400">
              Weather
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">{weatherText}</p>
          </div>
        )}

        {/* CTA buttons */}
        {(canSearchFlights || canFindHotels) && (
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid rgba(251,146,60,0.15)' }}
          >
            <div className="flex flex-wrap gap-3 mb-3">
              {canSearchFlights && (
                <button
                  onClick={() => handleCtaClick('flight')}
                  disabled={!!pending || limitReached}
                  className="flex-1 min-w-[140px] py-3 px-5 rounded-2xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #ea580c, #f97316)',
                    boxShadow: '0 3px 12px rgba(234,88,12,0.3)',
                  }}
                >
                  {pending === 'flight' ? 'Opening…' : flightClicked ? 'Search flights again →' : 'Search flights →'}
                </button>
              )}
              {canFindHotels && (
                <button
                  onClick={() => handleCtaClick('hotel')}
                  disabled={hotelDisabled}
                  title={!flightClicked && !limitReached ? 'Search flights first to unlock hotels' : undefined}
                  className="flex-1 min-w-[140px] py-3 px-5 rounded-2xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'rgba(249,115,22,0.1)',
                    border: '1.5px solid rgba(249,115,22,0.25)',
                    color: '#ea580c',
                  }}
                >
                  {pending === 'hotel' ? 'Opening…' : 'Find hotels →'}
                </button>
              )}
            </div>

            <p className="text-xs text-stone-400">
              Prices are estimates. Final live prices may vary on partner sites.
            </p>

            {flightClicked && d.remaining_budget_after_flight != null && (
              d.hotel_affordable_after_flight ? (
                <p className="mt-2 text-xs text-green-700 font-semibold">
                  {formatGBP(d.remaining_budget_after_flight)} left after flights — hotels fit your budget
                </p>
              ) : (
                <p className="mt-2 text-xs font-semibold" style={{ color: '#f97316' }}>
                  {formatGBP(d.remaining_budget_after_flight)} left after flights — hotel may push over budget
                </p>
              )
            )}

            {limitReached && (
              <p className="mt-2 text-xs font-semibold" style={{ color: '#f97316' }}>
                You've reached your monthly limit. Upgrade to continue.
              </p>
            )}
            {!limitReached && ctaError.message && (
              <p className="mt-2 text-xs text-red-600 font-semibold">{ctaError.message}</p>
            )}
          </div>
        )}
      </div>

      {/* ══════════ TRY ANOTHER ══════════ */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10 text-center">
        <p className="text-sm text-stone-500 mb-3">Not feeling this destination?</p>
        <Link
          to="/travel"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #ea580c, #f97316)',
            boxShadow: '0 3px 12px rgba(234,88,12,0.25)',
          }}
        >
          ← Try another destination
        </Link>
      </div>

    </div>
  )
}

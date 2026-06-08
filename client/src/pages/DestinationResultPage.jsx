import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { trackClick } from '../services/clicksApi'
import { buildSkyscannerUrl, buildBookingUrl } from '../utils/buildProviderUrls'
import { weatherEnrichment } from '../data/weatherEnrichment'
import { destinationVibes } from '../data/destinationVibes'
import { getDestinationImage } from '../data/destinationImages'
import { fetchDestinationImage } from '../services/imagesApi'

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

function formatTripDate(isoString) {
  if (!isoString) return ''
  const [y, m, day] = isoString.split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(y, m - 1, day))
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

  // imageUrl: null while fetching → Pexels URL on success → local curated path on failure
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    if (!resultData?.destination) return
    const { city, country } = resultData.destination
    fetchDestinationImage(city, country).then((url) => {
      if (url) {
        setImageUrl(url)
      } else {
        setImageUrl(getDestinationImage(resultData.destination))
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll-reveal: add .visible when .reveal elements enter the viewport
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!resultData) return null

  const { destination: d, tripInput } = resultData

  const weather = weatherEnrichment[d.iata_code] ?? null
  const vibes   = destinationVibes[d.iata_code]  ?? null
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
        style={{ minHeight: '100vh', backgroundColor: '#1c1917' }}
      >
        {/* Background photo — hidden while Pexels URL is loading */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${d.city ?? 'destination'} landscape`}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
            onError={(e) => {
              if (!e.currentTarget.dataset.fallbackUsed) {
                e.currentTarget.dataset.fallbackUsed = '1'
                e.currentTarget.src = '/images/destinations/_fallback.jpg'
              }
            }}
          />
        )}

        {/* Layered overlays — keep the photo visible, darken bottom for text */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.28)', zIndex: 1 }} />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(160deg, rgba(120,53,15,0.32) 0%, transparent 52%)', zIndex: 1 }} />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 22%, rgba(0,0,0,0.6) 68%, rgba(0,0,0,0.88) 100%)', zIndex: 1 }} />

        {/* Back button — small glass pill, unobtrusive */}
        <div className="absolute top-5 left-5 sm:top-6 sm:left-7" style={{ zIndex: 20 }}>
          <Link
            to="/travel"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white transition-all hover:bg-white/20"
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(10px)',
            }}
          >
            ← Back
          </Link>
        </div>

        {/* Hero content — anchored to bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 sm:px-10 pb-12 sm:pb-16"
          style={{ zIndex: 20 }}
        >
          {/* Trip type badges — subtle, only primary types */}
          {d.trip_types?.length > 0 && (
            <div
              className="result-reveal flex flex-wrap gap-2 mb-4"
              style={{ animationDelay: '0.1s' }}
            >
              {d.trip_types.filter(t => t.is_primary).slice(0, 2).map((t) => (
                <span
                  key={t.id ?? t.slug}
                  className="text-xs px-2.5 py-1 rounded-full font-semibold tracking-widest uppercase"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'rgba(255,255,255,0.65)',
                  }}
                >
                  {t.label}
                </span>
              ))}
            </div>
          )}

          {/* Reveal label */}
          <p
            className="result-reveal text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'rgba(251,191,36,0.88)', animationDelay: '0.2s' }}
          >
            ✦ Your next adventure is
          </p>

          {/* City — the emotional centrepiece */}
          <h1
            className="result-reveal font-black text-white leading-none tracking-tight mb-2"
            style={{
              fontSize: 'clamp(3.2rem, 11vw, 6.5rem)',
              animationDelay: '0.38s',
              textShadow: '0 2px 32px rgba(0,0,0,0.45)',
            }}
          >
            {d.city}
          </h1>

          {/* Country */}
          {d.country && (
            <p
              className="result-reveal text-xl sm:text-2xl font-medium mb-5"
              style={{ color: 'rgba(255,255,255,0.52)', animationDelay: '0.52s' }}
            >
              <span style={{ color: 'rgba(251,191,36,0.65)', marginRight: '6px' }}>◦</span>
              {d.country}
            </p>
          )}

          {/* Hook — quote style */}
          {d.hook && (
            <p
              className="result-reveal text-base sm:text-lg italic leading-relaxed mb-6"
              style={{
                color: 'rgba(255,255,255,0.68)',
                maxWidth: '520px',
                animationDelay: '0.66s',
              }}
            >
              "{d.hook}"
            </p>
          )}

          {/* Price badge — premium standalone card */}
          {perPersonEst != null && (
            <div
              className="result-reveal inline-block mb-7"
              style={{ animationDelay: '0.82s' }}
            >
              <div
                className="rounded-2xl px-5 py-4 text-white shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #b91c1c 0%, #ea580c 50%, #f97316 100%)',
                  boxShadow: '0 6px 24px rgba(185,28,28,0.45)',
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  Estimated from
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black leading-none">
                    {formatGBP(perPersonEst)}
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    / person
                  </span>
                </div>
                {d.total_trip_cost_estimate != null && (tripInput?.travellers ?? 1) > 1 && (
                  <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {formatGBP(d.total_trip_cost_estimate)} total for {tripInput.travellers}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Scroll hint */}
          <div
            className="result-reveal flex items-center gap-2"
            style={{ animationDelay: '1.0s' }}
          >
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Explore your trip details
            </span>
            <span
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.3)', animation: 'float 2.2s ease-in-out infinite' }}
            >
              ↓
            </span>
          </div>
        </div>
      </section>

      {/* ══════════ STORY & DETAIL ══════════ */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8">

        {/* ── 1. DESTINATION STORY ── */}
        {(vibes?.atmosphere || d.hook) && (
          <section
            className="reveal pt-10 pb-9"
            style={{ borderBottom: '1px solid rgba(231,229,228,0.7)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#ea580c' }}>
              Destination Story
            </p>
            <div style={{ maxWidth: '620px' }}>
              <p
                className="text-xl sm:text-2xl font-medium leading-relaxed italic"
                style={{ color: '#1c1917' }}
              >
                "{vibes?.atmosphere || d.hook}"
              </p>
              {vibes?.travelStyle && (
                <p className="mt-5 text-sm font-semibold" style={{ color: '#78716c' }}>
                  {vibes.travelStyle}
                </p>
              )}
              {vibes?.bestFor && (
                <p className="mt-1 text-sm" style={{ color: '#a8a29e' }}>
                  Best for {vibes.bestFor}
                </p>
              )}
            </div>
            {vibes?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {vibes.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: 'rgba(234,88,12,0.07)',
                      color: '#c2410c',
                      border: '1px solid rgba(234,88,12,0.14)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── 2. FUN FACT ── */}
        {d.fun_fact && (
          <section
            className="reveal reveal-delay-1 pt-8 pb-9"
            style={{ borderBottom: '1px solid rgba(231,229,228,0.7)' }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1.5px solid rgba(217,119,6,0.18)' }}
            >
              {/* Accent stripe */}
              <div
                aria-hidden="true"
                style={{ height: '3px', background: 'linear-gradient(90deg, #c2410c, #ea580c, #f97316)' }}
              />
              <div className="px-6 py-5" style={{ backgroundColor: '#fffbeb' }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <span style={{ color: '#d97706', fontSize: '1.1rem' }}>✦</span>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#d97706' }}>
                    Did you know?
                  </p>
                </div>
                <p className="text-base leading-relaxed" style={{ color: '#78350f' }}>
                  {d.fun_fact}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── 3. PLACES TO EXPLORE ── */}
        {d.recommended_places?.length > 0 && (
          <section
            className="reveal reveal-delay-2 pt-8 pb-9"
            style={{ borderBottom: '1px solid rgba(231,229,228,0.7)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#ea580c' }}>
              Places to Explore
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {d.recommended_places.slice(0, 6).map((place, i) => (
                <div
                  key={i}
                  className="flex gap-3.5 rounded-xl p-4"
                  style={{ backgroundColor: '#fafaf9', border: '1px solid rgba(231,229,228,0.9)' }}
                >
                  <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #c2410c, #f97316)' }}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-stone-800 leading-snug">
                      {place.name}
                    </p>
                    {place.description && (
                      <p className="mt-0.5 text-xs leading-relaxed" style={{ color: '#78716c' }}>
                        {place.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 4. WEATHER & VIBE ── */}
        {(weather || weatherText) && (
          <section
            className="reveal reveal-delay-3 pt-8 pb-9"
            style={{ borderBottom: '1px solid rgba(231,229,228,0.7)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#ea580c' }}>
              What to Expect
            </p>
            {weather ? (
              <div>
                {weather.vibe && (
                  <p
                    className="text-base sm:text-lg font-medium leading-relaxed mb-4"
                    style={{ color: '#1c1917', maxWidth: '560px' }}
                  >
                    {weather.vibe}
                  </p>
                )}
                {!weather.vibe && weather.summary && (
                  <p
                    className="text-base font-medium leading-relaxed mb-4"
                    style={{ color: '#1c1917', maxWidth: '560px' }}
                  >
                    {weather.summary}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {weather.bestSeason && (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(14,165,233,0.09)',
                        color: '#0369a1',
                        border: '1px solid rgba(14,165,233,0.18)',
                      }}
                    >
                      ☀ Best in {weather.bestSeason}
                    </span>
                  )}
                  {weather.temperatureRange && (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(234,88,12,0.07)',
                        color: '#c2410c',
                        border: '1px solid rgba(234,88,12,0.14)',
                      }}
                    >
                      {weather.temperatureRange}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-base font-medium" style={{ color: '#1c1917', maxWidth: '560px' }}>
                {weatherText}
              </p>
            )}
          </section>
        )}

        {/* ── 5. PRACTICAL — trip dates, costs, CTAs ── */}
        <div className="space-y-4 pt-8 pb-10">

          {/* Trip dates */}
          {tripInput?.departureDate && (
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'rgba(234,88,12,0.06)', border: '1.5px solid rgba(234,88,12,0.18)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#ea580c' }}>
                Your trip dates
              </p>
              <p className="text-lg font-bold text-stone-800 leading-tight">
                {formatTripDate(tripInput.departureDate)}
                {tripInput.returnDate ? ` – ${formatTripDate(tripInput.returnDate)}` : ''}
              </p>
              <p className="mt-1.5 text-xs italic" style={{ color: '#a8a29e' }}>
                Dates chosen by Leave It To Luck
              </p>
            </div>
          )}

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

          {/* CTA buttons — unchanged */}
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
                    className="flex-1 min-w-35 py-3 px-5 rounded-2xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
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
                    className="flex-1 min-w-35 py-3 px-5 rounded-2xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
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

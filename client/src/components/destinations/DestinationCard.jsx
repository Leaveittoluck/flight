function formatGBP(amount) {
  if (amount == null) return null
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function DestinationCard({ destination: d }) {
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

          {d.estimated_total_cost != null && (
            <div className="shrink-0 text-right">
              <div className="text-3xl font-extrabold text-blue-600 leading-none">
                {formatGBP(d.estimated_total_cost)}
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

      {/* ── SUPPORTING INFO ── */}
      {(d.flight_cost_per_person_gbp != null ||
        d.hotel_cost_per_night_gbp != null ||
        d.weather_summary) && (
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          {d.flight_cost_per_person_gbp != null && (
            <span className="flex items-center gap-1.5">
              <span className="text-base">✈</span>
              <span>
                <span className="font-semibold text-slate-800">
                  {formatGBP(d.flight_cost_per_person_gbp)}
                </span>{' '}
                per person
              </span>
            </span>
          )}
          {d.hotel_cost_per_night_gbp != null && d.default_duration_nights != null && (
            <span className="flex items-center gap-1.5">
              <span className="text-base">🏨</span>
              <span>
                <span className="font-semibold text-slate-800">
                  {formatGBP(d.hotel_cost_per_night_gbp)}
                </span>{' '}
                / night &middot; {d.default_duration_nights} nights
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

      {/* ── CTA LINKS ── */}
      {(d.skyscanner_url || d.booking_com_url) && (
        <div className="border-t border-slate-100 px-6 py-4 flex gap-3">
          {d.skyscanner_url && (
            <a
              href={d.skyscanner_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Search flights →
            </a>
          )}
          {d.booking_com_url && (
            <a
              href={d.booking_com_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            >
              Find hotels →
            </a>
          )}
        </div>
      )}
    </article>
  )
}

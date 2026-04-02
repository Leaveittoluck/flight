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
    <article className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
      {/* Header: location + total cost */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {(d.city || d.country) && (
            <h3 className="text-xl font-semibold text-slate-900">
              {[d.city, d.country].filter(Boolean).join(', ')}
            </h3>
          )}
          {d.hook && (
            <p className="text-slate-600 text-sm mt-1 max-w-prose">{d.hook}</p>
          )}
        </div>
        {d.estimated_total_cost != null && (
          <div className="text-right flex-shrink-0">
            <span className="text-2xl font-bold text-blue-600">
              {formatGBP(d.estimated_total_cost)}
            </span>
            <p className="text-xs text-slate-500 mt-0.5">estimated total</p>
          </div>
        )}
      </div>

      {/* Trip type tags */}
      {d.trip_types.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {d.trip_types.map((t) => (
            <span
              key={t.id ?? t.slug}
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                t.is_primary
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {t.label}
            </span>
          ))}
        </div>
      )}

      {/* Cost breakdown */}
      {(d.flight_cost_per_person_gbp != null || d.hotel_cost_per_night_gbp != null) && (
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 bg-slate-50 rounded-lg px-4 py-3">
          {d.flight_cost_per_person_gbp != null && (
            <span>✈ {formatGBP(d.flight_cost_per_person_gbp)} / person</span>
          )}
          {d.hotel_cost_per_night_gbp != null && d.default_duration_nights != null && (
            <span>
              🏨 {formatGBP(d.hotel_cost_per_night_gbp)} / night &middot;{' '}
              {d.default_duration_nights} nights
            </span>
          )}
        </div>
      )}

      {/* Weather summary */}
      {d.weather_summary && (
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">Weather: </span>
          {d.weather_summary}
        </p>
      )}

      {/* Fun fact */}
      {d.fun_fact && (
        <div className="border-l-4 border-amber-300 pl-3">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-0.5">
            Fun fact
          </p>
          <p className="text-sm text-slate-700">{d.fun_fact}</p>
        </div>
      )}

      {/* Recommended places */}
      {d.recommended_places.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Recommended places
          </p>
          <ul className="space-y-1.5">
            {d.recommended_places.map((place, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium text-slate-800">{place.name}</span>
                {place.description && (
                  <span className="text-slate-500"> — {place.description}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA links */}
      {(d.skyscanner_url || d.booking_com_url) && (
        <div className="flex gap-4 pt-1 mt-auto border-t border-slate-100">
          {d.skyscanner_url && (
            <a
              href={d.skyscanner_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Search flights →
            </a>
          )}
          {d.booking_com_url && (
            <a
              href={d.booking_com_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Find hotels →
            </a>
          )}
        </div>
      )}
    </article>
  )
}

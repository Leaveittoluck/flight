const ICONS = {
  sun: '☀️',
  'cloud-sun': '⛅',
  'cloud-rain': '🌧️',
  snowflake: '❄️',
  wind: '💨',
}

export default function DestinationWeather({ weather, fallbackSummary }) {
  if (!weather && !fallbackSummary) return null

  if (!weather) {
    return (
      <div className="border-t border-slate-100 px-6 py-4">
        <span className="flex items-center gap-1.5 text-sm text-slate-600">
          <span className="text-base">🌤</span>
          <span>{fallbackSummary}</span>
        </span>
      </div>
    )
  }

  const icon = ICONS[weather.icon] ?? '🌤'

  return (
    <div className="border-t border-sky-100 bg-sky-50 px-6 py-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5" aria-hidden="true">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
              Weather
            </span>
            {weather.bestSeason && (
              <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                Best in {weather.bestSeason}
              </span>
            )}
            {weather.temperatureRange && (
              <span className="text-xs text-slate-500 font-medium">
                {weather.temperatureRange}
              </span>
            )}
          </div>
          {weather.summary && (
            <p className="text-sm font-medium text-slate-700 leading-snug">
              {weather.summary}
            </p>
          )}
          {weather.vibe && (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed italic">
              {weather.vibe}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

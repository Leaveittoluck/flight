export default function TrendingDestinationCard({ city, country, moods, price, emoji }) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50/30 px-4 py-3 transition-all duration-150 hover:bg-white hover:-translate-y-px hover:shadow-sm cursor-default">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {emoji} {city}
        </p>
        <p className="text-xs text-slate-400">{country}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-bold text-blue-600 transition-colors duration-150 group-hover:text-blue-700">
          {price}
        </span>
        <div className="flex gap-1 flex-wrap justify-end">
          {moods.map((m) => (
            <span
              key={m}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

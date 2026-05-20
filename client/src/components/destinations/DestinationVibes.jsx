export default function DestinationVibes({ vibes }) {
  if (!vibes) return null

  return (
    <div className="border-t border-rose-100 bg-rose-50 px-6 py-4">
      {vibes.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {vibes.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-rose-600 border border-rose-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-1">
        {vibes.travelStyle && (
          <p className="text-sm font-semibold text-slate-700 leading-snug">
            {vibes.travelStyle}
          </p>
        )}
        {vibes.bestFor && (
          <p className="text-xs text-slate-500">
            <span className="font-medium text-rose-400">Best for </span>
            {vibes.bestFor}
          </p>
        )}
        {vibes.atmosphere && (
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            {vibes.atmosphere}
          </p>
        )}
      </div>
    </div>
  )
}

const MAX_TRAVELLERS = 6

export default function TravellersSelect({ value, onChange, error }) {
  return (
    <div>
      <label htmlFor="travellers" className="block text-sm font-medium text-slate-700 mb-1">
        Travellers
      </label>
      <p className="text-xs text-slate-500 mb-2">Up to {MAX_TRAVELLERS} people</p>
      <select
        id="travellers"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-400' : 'border-slate-300'
        }`}
      >
        {Array.from({ length: MAX_TRAVELLERS }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n} {n === 1 ? 'person' : 'people'}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

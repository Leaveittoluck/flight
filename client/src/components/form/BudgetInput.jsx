function formatGBP(amount) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function BudgetInput({ value, onChange, error, travellers = 1 }) {
  const estimatedTotal =
    value && Number(value) > 0
      ? formatGBP(Math.round(Number(value) * travellers))
      : null

  return (
    <div>
      <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-1">
        Budget per person
      </label>
      <p className="text-xs text-slate-500 mb-2">
        Flights and hotel — estimates only
      </p>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm pointer-events-none">
          £
        </span>
        <input
          id="budget"
          type="number"
          min="1"
          step="1"
          value={value}
          onChange={(e) =>
            onChange(e.target.value === '' ? '' : Number(e.target.value))
          }
          onKeyDown={(e) => {
            if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault()
          }}
          placeholder="e.g. 350"
          className={`w-full pl-7 pr-4 py-3 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-400' : 'border-slate-300'
          }`}
        />
      </div>
      {estimatedTotal && !error && (
        <p className="mt-1.5 text-xs text-blue-600 font-medium">
          Estimated total: {estimatedTotal}
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

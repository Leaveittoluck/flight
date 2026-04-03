function formatGBP(amount) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function BudgetInput({ value, onChange, error, travellers = 1 }) {
  const perPerson =
    value && Number(value) > 0 && travellers > 1
      ? formatGBP(Math.round(Number(value) / travellers))
      : null

  return (
    <div>
      <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-1">
        Total budget
      </label>
      <p className="text-xs text-slate-500 mb-2">
        Your whole group's spend — flights and hotel combined
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
          placeholder="e.g. 2000"
          className={`w-full pl-7 pr-4 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-400' : 'border-slate-300'
          }`}
        />
      </div>
      {perPerson && !error && (
        <p className="mt-1.5 text-xs text-blue-600 font-medium">
          ≈ {perPerson} per person
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

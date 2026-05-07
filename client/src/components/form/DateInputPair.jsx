function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function addOneDayISO(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

const inputCls = (hasError) =>
  `w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    hasError ? 'border-red-400' : 'border-slate-300'
  }`

export default function DateInputPair({
  departureDate,
  returnDate,
  onDepartureChange,
  onReturnChange,
  errors = {},
}) {
  const today = todayISO()
  const minReturn = departureDate ? addOneDayISO(departureDate) : today

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <label htmlFor="departure_date" className="block text-sm font-medium text-slate-700 mb-1">
          Departure date
        </label>
        <input
          id="departure_date"
          type="date"
          min={today}
          value={departureDate}
          onChange={(e) => onDepartureChange(e.target.value)}
          className={inputCls(!!errors.departure_date)}
        />
        {errors.departure_date && (
          <p className="mt-1 text-xs text-red-600">{errors.departure_date}</p>
        )}
      </div>

      <div>
        <label htmlFor="return_date" className="block text-sm font-medium text-slate-700 mb-1">
          Return date{' '}
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          id="return_date"
          type="date"
          min={minReturn}
          value={returnDate}
          onChange={(e) => onReturnChange(e.target.value)}
          className={inputCls(!!errors.return_date)}
        />
        {errors.return_date ? (
          <p className="mt-1 text-xs text-red-600">{errors.return_date}</p>
        ) : (
          !returnDate && (
            <p className="mt-1 text-xs text-slate-500">
              Leave blank to use each destination's default stay
            </p>
          )
        )}
      </div>
    </div>
  )
}

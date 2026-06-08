import { SEASON_OPTIONS } from '../../constants/seasonOptions'
import { SEASON_THEMES } from '../../data/seasonThemes'

// Only the four real seasons — "Any season" is no longer offered because
// season is required and the backend generates the exact dates.
const SEASON_CHOICES = SEASON_OPTIONS.filter((o) => o.value !== '')

export default function SeasonSelect({ value, onChange, error }) {
  const seasonColor = value ? SEASON_THEMES[value.toLowerCase()]?.formFocusColor : undefined

  return (
    <div>
      <label htmlFor="season" className="block text-sm font-medium text-slate-700 mb-1">
        Season
      </label>
      <p className="text-xs text-slate-500 mb-2">Pick a season — we'll choose the dates</p>
      <select
        id="season"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-3 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        style={{ borderColor: error ? '#f87171' : (seasonColor ?? '#cbd5e1') }}
      >
        <option value="">Select a season…</option>
        {SEASON_CHOICES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

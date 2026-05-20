import { SEASON_OPTIONS } from '../../constants/seasonOptions'
import { SEASON_THEMES } from '../../data/seasonThemes'

export default function SeasonSelect({ value, onChange }) {
  const seasonColor = value ? SEASON_THEMES[value.toLowerCase()]?.formFocusColor : undefined

  return (
    <div>
      <label htmlFor="season" className="block text-sm font-medium text-slate-700 mb-1">
        Season{' '}
        <span className="text-slate-400 font-normal">(optional)</span>
      </label>
      <p className="text-xs text-slate-500 mb-2">When are you thinking of travelling?</p>
      <select
        id="season"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        style={{ borderColor: seasonColor ?? '#cbd5e1' }}
      >
        {SEASON_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

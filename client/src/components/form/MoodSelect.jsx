import { MOOD_OPTIONS } from '../../constants/moodOptions'

export default function MoodSelect({ value, onChange, error }) {
  return (
    <div>
      <label htmlFor="mood" className="block text-sm font-medium text-slate-700 mb-1">
        Trip mood
      </label>
      <p className="text-xs text-slate-500 mb-2">What kind of trip are you after?</p>
      <select
        id="mood"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-400' : 'border-slate-300'
        }`}
      >
        <option value="">Select a mood…</option>
        {MOOD_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

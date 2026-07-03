import { FILTER_OPTIONS } from '../../data/statsData'

export default function FilterBar({ active, onChange }) {
  return (
    <div className="flex gap-1 bg-orange-50/80 rounded-xl p-1 self-end shrink-0" style={{ border: '1px solid rgba(251,146,60,0.12)' }}>
      {FILTER_OPTIONS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
            active === key
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

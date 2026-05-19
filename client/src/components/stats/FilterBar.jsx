import { FILTER_OPTIONS } from '../../data/statsData'

export default function FilterBar({ active, onChange }) {
  return (
    <div className="flex gap-1 bg-slate-100 rounded-xl p-1 self-start">
      {FILTER_OPTIONS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
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

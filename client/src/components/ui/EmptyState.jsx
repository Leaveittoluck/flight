import { Link } from 'react-router-dom'

export default function EmptyState({ title, body, ctaTo, ctaLabel = 'Leave It To Luck ✦' }) {
  return (
    <div className="py-10 text-center">
      <p className="text-3xl mb-4 font-black" style={{ color: 'rgba(234,88,12,0.22)' }}>✦</p>
      <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
      {body && <p className="text-sm text-slate-400 mb-6">{body}</p>}
      {ctaTo && (
        <Link
          to={ctaTo}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #ea580c, #f97316)',
            boxShadow: '0 3px 12px rgba(234,88,12,0.25)',
          }}
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}

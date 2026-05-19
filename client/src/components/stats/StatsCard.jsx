export function StatsCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardLabel({ children }) {
  return (
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  )
}

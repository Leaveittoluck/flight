export function StatsCard({ children, className = '' }) {
  return (
    <div className={`litl-card ${className}`}>
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

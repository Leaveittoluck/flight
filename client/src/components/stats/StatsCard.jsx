import CardLabelBase from '../ui/CardLabel'

export function StatsCard({ children, className = '' }) {
  return (
    <div className={`litl-card ${className}`}>
      {children}
    </div>
  )
}

export { CardLabelBase as CardLabel }

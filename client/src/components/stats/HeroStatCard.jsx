import { StatsCard, CardLabel } from './StatsCard'

export default function HeroStatCard({ label, value, sub }) {
  return (
    <StatsCard className="flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default">
      <CardLabel>{label}</CardLabel>
      <p className="text-2xl font-extrabold text-slate-900 leading-tight">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </StatsCard>
  )
}

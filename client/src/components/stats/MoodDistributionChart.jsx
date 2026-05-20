import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { StatsCard, CardLabel } from './StatsCard'

const MOOD_COLORS = {
  'City Break': '#3b82f6',
  'Adventure':  '#f59e0b',
  'Relax':      '#14b8a6',
  'Culture':    '#8b5cf6',
}

function MoodTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-slate-700">{name}</p>
      <p className="font-bold" style={{ color: MOOD_COLORS[name] ?? '#94a3b8' }}>{value}%</p>
    </div>
  )
}

export default function MoodDistributionChart({ moods }) {
  return (
    <StatsCard>
      <CardLabel>Mood Distribution</CardLabel>
      <div className="flex items-center gap-4">
        <div className="shrink-0" style={{ width: 140, height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={moods}
                dataKey="pct"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={66}
                paddingAngle={3}
                strokeWidth={0}
              >
                {moods.map((m) => (
                  <Cell key={m.name} fill={MOOD_COLORS[m.name] ?? '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<MoodTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2.5">
          {moods.map((m) => (
            <div key={m.name} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: MOOD_COLORS[m.name] ?? '#94a3b8' }}
              />
              <span className="text-slate-600 flex-1">{m.name}</span>
              <span className="font-semibold text-slate-900">{m.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </StatsCard>
  )
}

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { StatsCard, CardLabel } from './StatsCard'

function ActivityTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl px-3 py-2 shadow-md text-xs" style={{ border: '1px solid rgba(251,146,60,0.18)' }}>
      <p className="font-semibold text-slate-700">{label}</p>
      <p className="text-blue-600 font-bold">{payload[0].value} trips</p>
    </div>
  )
}

export default function DiscoveryActivityChart({ data }) {
  return (
    <StatsCard>
      <CardLabel>Discovery Activity</CardLabel>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
          <defs>
            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<ActivityTooltip />} cursor={{ stroke: 'rgba(251,146,60,0.2)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#activityGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </StatsCard>
  )
}

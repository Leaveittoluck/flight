import { useEffect, useState } from 'react'

export default function MoodBar({ name, pct, color }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-700">{name}</span>
        <span className="text-xs font-semibold text-slate-400">{pct}%</span>
      </div>
      <div className="w-full bg-orange-50 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

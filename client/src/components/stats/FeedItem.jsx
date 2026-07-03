export default function FeedItem({ text, time, icon }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-orange-50 last:border-0 rounded-xl px-2 -mx-2 transition-colors duration-150 hover:bg-orange-50/30 cursor-default">
      <span className="text-base mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700">{text}</p>
        <p className="text-xs text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  )
}

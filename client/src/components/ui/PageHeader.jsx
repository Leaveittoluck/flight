export default function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <header className="litl-page-header">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {eyebrow && (
          <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-2">
            {eyebrow}
          </p>
        )}
        {children ? (
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-slate-600 mt-2">{subtitle}</p>}
            </div>
            {children}
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-slate-600 mt-2">{subtitle}</p>}
          </>
        )}
      </div>
    </header>
  )
}

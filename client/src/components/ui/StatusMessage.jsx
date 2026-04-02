// variant: 'info' | 'error' | 'empty'
export default function StatusMessage({ variant = 'info', title, body }) {
  const styles = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    empty: 'bg-slate-50 text-slate-600 border-slate-200',
  }

  return (
    <div className={`border rounded-xl p-8 text-center ${styles[variant] ?? styles.info}`}>
      {title && <p className="font-semibold text-base mb-1">{title}</p>}
      {body && <p className="text-sm opacity-80">{body}</p>}
    </div>
  )
}

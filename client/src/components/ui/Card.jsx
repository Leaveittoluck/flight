const VARIANTS = {
  primary:   'litl-card-primary',
  secondary: 'litl-card',
  tertiary:  'litl-card-sm',
}

export default function Card({ children, className = '', dashed = false, variant = 'secondary' }) {
  const base = dashed ? 'litl-card-dashed' : (VARIANTS[variant] ?? 'litl-card')
  return (
    <div className={`${base} ${className}`}>
      {children}
    </div>
  )
}

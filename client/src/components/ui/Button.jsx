export default function Button({
  children,
  type = 'button',
  disabled = false,
  variant = 'primary',
  onClick,
}) {
  const base =
    'inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary:
      'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] ?? variants.primary}`}
    >
      {children}
    </button>
  )
}

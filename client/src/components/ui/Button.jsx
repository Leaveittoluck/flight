export default function Button({
  children,
  type = 'button',
  disabled = false,
  variant = 'primary',
  onClick,
}) {
  const base =
    'inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0'

  const styles = {
    primary: {
      className: `${base} text-white focus-visible:ring-orange-500`,
      style: {
        background: 'linear-gradient(135deg, #ea580c, #f97316)',
        boxShadow: '0 3px 14px rgba(234,88,12,0.3)',
      },
    },
    secondary: {
      className: `${base} bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 focus-visible:ring-stone-400`,
      style: {},
    },
  }

  const resolved = styles[variant] ?? styles.primary

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={resolved.className}
      style={resolved.style}
    >
      {children}
    </button>
  )
}

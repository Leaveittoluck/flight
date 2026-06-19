/* ──────────────────────────────────────────────────────────────────────
   GenerationUsageBadge
   Small "travel fuel meter" pill showing how many destination reveals
   are left this month. Purely informational — never gates the form;
   the submit button's disabled state is driven entirely by the server.
   ────────────────────────────────────────────────────────────────────── */

const STATE_STYLES = {
  normal: {
    bg: '#fffdf7',
    border: 'rgba(217,119,6,0.25)',
    text: '#92400e',
    icon: '#f59e0b',
    bar: '#fb923c',
    barTrack: 'rgba(120,53,15,0.12)',
  },
  low: {
    bg: '#fff1e6',
    border: 'rgba(234,88,12,0.4)',
    text: '#c2410c',
    icon: '#ea580c',
    bar: '#ea580c',
    barTrack: 'rgba(194,65,12,0.15)',
  },
  zero: {
    bg: '#fff1e6',
    border: 'rgba(194,65,12,0.45)',
    text: '#9a3412',
    icon: '#c2410c',
    bar: '#c2410c',
    barTrack: 'rgba(154,52,18,0.15)',
  },
}

export default function GenerationUsageBadge({ remaining, limit }) {
  if (remaining == null) return null

  const safeLimit = limit > 0 ? limit : 5
  const pct = Math.max(0, Math.min(1, remaining / safeLimit))
  const tier = remaining <= 0 ? 'zero' : remaining === 1 ? 'low' : 'normal'
  const palette = STATE_STYLES[tier]

  const label = tier === 'zero'
    ? 'No destination reveals left this month'
    : `${remaining} destination reveal${remaining === 1 ? '' : 's'} left`

  return (
    <div
      className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold w-fit shadow-sm"
      style={{ backgroundColor: palette.bg, border: `1px solid ${palette.border}`, color: palette.text }}
    >
      <span
        aria-hidden="true"
        className="text-sm leading-none"
        style={{
          color: palette.icon,
          animation: tier !== 'normal' ? 'sunGlow 2.4s ease-in-out infinite' : 'none',
        }}
      >
        ✦
      </span>

      <span>{label}</span>

      {/* tiny fuel-meter */}
      <span
        aria-hidden="true"
        className="hidden sm:inline-block rounded-full overflow-hidden shrink-0"
        style={{ width: '38px', height: '4px', backgroundColor: palette.barTrack }}
      >
        <span
          className="block h-full rounded-full transition-all duration-500"
          style={{ width: `${pct * 100}%`, backgroundColor: palette.bar }}
        />
      </span>

      {tier === 'zero' && (
        <a
          href="/#pricing"
          className="underline underline-offset-2 hover:opacity-75 transition-opacity shrink-0"
        >
          Upgrade
        </a>
      )}
    </div>
  )
}

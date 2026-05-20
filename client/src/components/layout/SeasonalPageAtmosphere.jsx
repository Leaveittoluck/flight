import { SEASON_THEMES } from '../../data/seasonThemes'
import { resolvePageSeason } from '../../utils/resolvePageSeason'

/**
 * Renders fixed ambient corner glows that reflect the active season.
 * Purely decorative — pointer-events-none, aria-hidden.
 */
export default function SeasonalPageAtmosphere({ season }) {
  const key = resolvePageSeason(season)
  const theme = SEASON_THEMES[key]
  const hasSelection = Boolean(season)

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-72 h-72 -translate-x-1/3 -translate-y-1/3 z-0"
        style={{
          background: `radial-gradient(ellipse at top left, ${theme.glowColor} 0%, transparent 70%)`,
          opacity: hasSelection ? 1 : 0.55,
          transition: 'opacity 600ms ease',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 right-0 w-96 h-96 translate-x-1/4 translate-y-1/4 z-0"
        style={{
          background: `radial-gradient(ellipse at bottom right, ${theme.glowColor} 0%, transparent 70%)`,
          opacity: hasSelection ? 1 : 0.55,
          transition: 'opacity 600ms ease',
        }}
      />
    </>
  )
}

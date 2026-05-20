import { SEASON_THEMES } from '../data/seasonThemes'

const MONTH_TO_SEASON = {
  0: 'winter', 1: 'winter', 2: 'spring',
  3: 'spring', 4: 'spring', 5: 'summer',
  6: 'summer', 7: 'summer', 8: 'autumn',
  9: 'autumn', 10: 'autumn', 11: 'winter',
}

/**
 * Resolves a season key suitable for page-level theming.
 * Priority: explicit user selection → current calendar season
 */
export function resolvePageSeason(selectedSeason) {
  const key = selectedSeason?.toLowerCase?.().trim() || ''
  if (SEASON_THEMES[key]) return key
  return MONTH_TO_SEASON[new Date().getMonth()]
}

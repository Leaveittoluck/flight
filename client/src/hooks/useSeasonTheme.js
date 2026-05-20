import { weatherEnrichment } from '../data/weatherEnrichment'
import { SEASON_THEMES } from '../data/seasonThemes'

/**
 * Resolve the seasonal visual theme for a destination.
 *
 * Priority:
 *   1. tripInput.season — user's explicit season choice (applies cohesively across all results)
 *   2. weatherEnrichment[iata_code].bestSeason — the destination's natural season character
 *   3. 'spring' — neutral fallback
 *
 * @param {object} destination  - normalized destination object (needs iata_code)
 * @param {object} tripInput    - form state including season
 * @returns {object}            - season theme from SEASON_THEMES
 */
export function useSeasonTheme(destination, tripInput) {
  const userSeason = tripInput?.season?.toLowerCase?.() || ''
  const destSeason =
    weatherEnrichment[destination?.iata_code ?? '']?.bestSeason?.toLowerCase?.() || ''

  const resolved = userSeason || destSeason || 'spring'
  return SEASON_THEMES[resolved] ?? SEASON_THEMES.spring
}

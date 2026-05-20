/**
 * Central seasonal visual theme config.
 * Each theme is applied to destination cards to create atmospheric mood.
 *
 * Keys map to lowercase season names: spring | summer | autumn | winter
 *
 * accentGradient  — CSS gradient string for the thin top accent bar
 * heroGradient    — CSS gradient string for the faint hero background wash
 * color           — hex color for SVG fills and tinted accents
 */
export const SEASON_THEMES = {
  spring: {
    label: 'Spring',
    accentGradient: 'linear-gradient(to right, #a7f3d0, #6ee7b7, #99f6e4)',
    heroGradient:
      'linear-gradient(135deg, rgba(167,243,208,0.22) 0%, rgba(255,255,255,0) 58%)',
    color: '#10b981',
  },
  summer: {
    label: 'Summer',
    accentGradient: 'linear-gradient(to right, #fde68a, #fbbf24, #fed7aa)',
    heroGradient:
      'linear-gradient(135deg, rgba(253,230,138,0.26) 0%, rgba(255,255,255,0) 58%)',
    color: '#f59e0b',
  },
  autumn: {
    label: 'Autumn',
    accentGradient: 'linear-gradient(to right, #fed7aa, #fb923c, #fde68a)',
    heroGradient:
      'linear-gradient(135deg, rgba(253,186,116,0.24) 0%, rgba(255,255,255,0) 58%)',
    color: '#f97316',
  },
  winter: {
    label: 'Winter',
    accentGradient: 'linear-gradient(to right, #bae6fd, #7dd3fc, #c7d2fe)',
    heroGradient:
      'linear-gradient(135deg, rgba(186,230,253,0.26) 0%, rgba(255,255,255,0) 58%)',
    color: '#38bdf8',
  },
}

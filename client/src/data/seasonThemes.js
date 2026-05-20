/**
 * Central seasonal visual theme config.
 * Each theme is applied to destination cards and the wider page atmosphere.
 *
 * Keys map to lowercase season names: spring | summer | autumn | winter
 *
 * Card tokens:
 *   accentGradient  — CSS gradient for the thin top accent bar
 *   heroGradient    — CSS gradient for the faint hero background wash
 *   color           — hex color for SVG fills and tinted accents
 *
 * Page atmosphere tokens:
 *   pageGradient    — subtle full-page background gradient (layered over #f8fafc)
 *   glowColor       — rgba color for ambient corner radial glows
 *   navbarAccent    — CSS gradient for the navbar bottom accent line
 *   formFocusColor  — hex color for seasonal form input border
 *   ctaAccent       — hex color for subtle CTA accent hints
 */
export const SEASON_THEMES = {
  spring: {
    label: 'Spring',
    accentGradient: 'linear-gradient(to right, #a7f3d0, #6ee7b7, #99f6e4)',
    heroGradient:
      'linear-gradient(135deg, rgba(167,243,208,0.22) 0%, rgba(255,255,255,0) 58%)',
    color: '#10b981',
    pageGradient:
      'linear-gradient(160deg, rgba(167,243,208,0.13) 0%, rgba(240,253,244,0.06) 50%, transparent 75%)',
    glowColor: 'rgba(110,231,183,0.17)',
    navbarAccent: 'linear-gradient(to right, #a7f3d0, #6ee7b7, #99f6e4)',
    formFocusColor: '#10b981',
    ctaAccent: '#059669',
  },
  summer: {
    label: 'Summer',
    accentGradient: 'linear-gradient(to right, #fde68a, #fbbf24, #fed7aa)',
    heroGradient:
      'linear-gradient(135deg, rgba(253,230,138,0.26) 0%, rgba(255,255,255,0) 58%)',
    color: '#f59e0b',
    pageGradient:
      'linear-gradient(160deg, rgba(253,230,138,0.16) 0%, rgba(255,251,235,0.06) 50%, transparent 75%)',
    glowColor: 'rgba(251,191,36,0.15)',
    navbarAccent: 'linear-gradient(to right, #fde68a, #fbbf24, #fed7aa)',
    formFocusColor: '#f59e0b',
    ctaAccent: '#d97706',
  },
  autumn: {
    label: 'Autumn',
    accentGradient: 'linear-gradient(to right, #fed7aa, #fb923c, #fde68a)',
    heroGradient:
      'linear-gradient(135deg, rgba(253,186,116,0.24) 0%, rgba(255,255,255,0) 58%)',
    color: '#f97316',
    pageGradient:
      'linear-gradient(160deg, rgba(253,186,116,0.14) 0%, rgba(255,247,237,0.06) 50%, transparent 75%)',
    glowColor: 'rgba(249,115,22,0.13)',
    navbarAccent: 'linear-gradient(to right, #fed7aa, #fb923c, #fde68a)',
    formFocusColor: '#f97316',
    ctaAccent: '#ea580c',
  },
  winter: {
    label: 'Winter',
    accentGradient: 'linear-gradient(to right, #bae6fd, #7dd3fc, #c7d2fe)',
    heroGradient:
      'linear-gradient(135deg, rgba(186,230,253,0.26) 0%, rgba(255,255,255,0) 58%)',
    color: '#38bdf8',
    pageGradient:
      'linear-gradient(160deg, rgba(186,230,253,0.16) 0%, rgba(240,249,255,0.06) 50%, transparent 75%)',
    glowColor: 'rgba(125,211,252,0.17)',
    navbarAccent: 'linear-gradient(to right, #bae6fd, #7dd3fc, #c7d2fe)',
    formFocusColor: '#38bdf8',
    ctaAccent: '#0ea5e9',
  },
}

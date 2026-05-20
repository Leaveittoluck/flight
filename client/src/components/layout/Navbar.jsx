import { NavLink } from 'react-router-dom'
import { SEASON_THEMES } from '../../data/seasonThemes'
import { resolvePageSeason } from '../../utils/resolvePageSeason'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/stats', label: 'Stats' },
]

export default function Navbar({ season }) {
  const key = resolvePageSeason(season)
  const theme = SEASON_THEMES[key]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-white border-b border-slate-200">
      {/* Seasonal accent line — fades in when a season is selected */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: theme.navbarAccent,
          opacity: season ? 1 : 0,
          transition: 'opacity 600ms ease',
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <span className="text-base font-semibold text-slate-900 tracking-tight">
          Leave It To Luck
        </span>

        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

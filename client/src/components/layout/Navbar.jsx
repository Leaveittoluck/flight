import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { SEASON_THEMES } from '../../data/seasonThemes'
import { resolvePageSeason } from '../../utils/resolvePageSeason'
import { useAuth } from '../../context/AuthContext'

const pillLink = ({ isActive }) =>
  `px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
    isActive
      ? 'bg-orange-100 text-orange-700'
      : 'text-stone-600 hover:bg-orange-50 hover:text-orange-600'
  }`

const mobilePillLink = ({ isActive }) =>
  `block px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
    isActive
      ? 'bg-orange-100 text-orange-700'
      : 'text-stone-700 hover:bg-orange-50 hover:text-orange-600'
  }`

export default function Navbar({ season }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const key = resolvePageSeason(season)
  const theme = SEASON_THEMES[key]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50 h-16 border-b transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(255,247,237,0.92)' : '#fff7ed',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.3)' : 'none',
          borderBottomColor: scrolled ? 'rgba(251,146,60,0.25)' : 'rgba(251,146,60,0.15)',
          boxShadow: scrolled ? '0 2px 16px rgba(249,115,22,0.08)' : 'none',
        }}
      >
        {/* Seasonal accent line */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-0.5 pointer-events-none"
          style={{
            background: theme.navbarAccent,
            opacity: season ? 1 : 0,
            transition: 'opacity 600ms ease',
          }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Left: logo + nav */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 shrink-0 transition-opacity hover:opacity-80"
            >
              <span
                className="hidden md:block text-sm font-bold tracking-tight"
                style={{ color: '#ea580c' }}
              >
                Leave It To Luck
              </span>
              <span
                className="md:hidden text-sm font-bold tracking-tight"
                style={{ color: '#ea580c' }}
              >
                LITL
              </span>
              <span className="text-xs font-bold" style={{ color: 'rgba(234,88,12,0.4)' }}>✦</span>
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              <NavLink to="/" end className={pillLink}>Home</NavLink>
              <NavLink to="/stats" className={pillLink}>Statistics</NavLink>
              <a
                href="/#pricing"
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
              >
                Pricing
              </a>
            </div>
          </div>

          {/* Right: CTA + auth + hamburger */}
          <div className="flex items-center gap-2">
            <NavLink
              to="/travel"
              className={({ isActive }) =>
                `hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-all duration-200 ${
                  isActive ? 'scale-[0.97]' : 'hover:-translate-y-px'
                }`
              }
              style={({ isActive }) => ({
                background: isActive
                  ? 'linear-gradient(135deg, #c2410c, #ea580c)'
                  : 'linear-gradient(135deg, #ea580c, #f97316)',
                boxShadow: '0 2px 12px rgba(234,88,12,0.3)',
              })}
            >
              Start Exploring
            </NavLink>

            <div className="hidden md:flex items-center gap-1 ml-1">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-orange-50 transition-all duration-200"
                  >
                    {user.avatar_url && (
                      <img
                        src={user.avatar_url}
                        alt={user.display_name}
                        className="w-7 h-7 rounded-full object-cover border border-orange-200"
                      />
                    )}
                    <span className="text-sm font-medium text-stone-600 max-w-30 truncate">
                      {user.display_name}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-full text-sm font-semibold text-stone-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-full text-sm font-semibold text-stone-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-xl transition-colors"
              style={{ color: '#f97316' }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="fixed top-16 inset-x-0 z-40 border-b md:hidden"
          style={{
            backgroundColor: 'rgba(255,247,237,0.97)',
            backdropFilter: 'blur(16px)',
            borderBottomColor: 'rgba(251,146,60,0.2)',
            boxShadow: '0 4px 24px rgba(249,115,22,0.12)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-1">
            <NavLink to="/" end className={mobilePillLink}>Home</NavLink>
            <NavLink to="/travel" className={mobilePillLink}>Travel</NavLink>
            <NavLink to="/stats" className={mobilePillLink}>Statistics</NavLink>
            <a href="/#pricing" className="block px-4 py-3 rounded-2xl text-sm font-semibold text-stone-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200">
              Pricing
            </a>
            <div className="h-px my-1" style={{ borderTop: '1px dashed rgba(251,146,60,0.3)' }} />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2">
                  {user.avatar_url && (
                    <img
                      src={user.avatar_url}
                      alt={user.display_name}
                      className="w-7 h-7 rounded-full object-cover border border-orange-200"
                    />
                  )}
                  <span className="text-sm font-medium text-stone-700 truncate">{user.display_name}</span>
                </div>
                <NavLink to="/profile" className={mobilePillLink}>Profile</NavLink>
                <NavLink to="/discoveries" className={mobilePillLink}>Discoveries</NavLink>
                <button
                  onClick={() => { logout(); setMenuOpen(false) }}
                  className="block w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-3 rounded-2xl text-sm font-semibold text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
              >
                Sign in with Google
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}

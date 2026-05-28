import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { SEASON_THEMES } from '../../data/seasonThemes'
import { resolvePageSeason } from '../../utils/resolvePageSeason'

const navLinkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-slate-100 text-slate-900'
      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
  }`

const mobileNavLinkClass = ({ isActive }) =>
  `block px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${
    isActive
      ? 'bg-slate-100 text-slate-900'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
  }`

export default function Navbar({ season }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
        className={`fixed top-0 inset-x-0 z-50 h-16 border-b border-slate-200 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm shadow-slate-200/60' : 'bg-white'
        }`}
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
          {/* Left: Logo + desktop nav */}
          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-900 tracking-tight shrink-0"
            >
              LITL
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/stats" className={navLinkClass}>
                Statistics
              </NavLink>
              <a
                href="/#pricing"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Pricing
              </a>
            </div>
          </div>

          {/* Right: Travel CTA + auth + hamburger */}
          <div className="flex items-center gap-2">
            <NavLink
              to="/travel"
              className={({ isActive }) =>
                `hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-amber-200'
                    : 'bg-stone-900 hover:bg-stone-700 text-white'
                }`
              }
            >
              Start Exploring
            </NavLink>

            <div className="hidden md:flex items-center gap-1 ml-1">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
              >
                Register
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
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
          className="fixed top-16 inset-x-0 z-40 bg-white border-b border-slate-200 shadow-lg md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1">
            <NavLink to="/" end className={mobileNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/travel" className={mobileNavLinkClass}>
              Travel
            </NavLink>
            <NavLink to="/stats" className={mobileNavLinkClass}>
              Statistics
            </NavLink>
            <a
              href="/#pricing"
              className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Pricing
            </a>
            <div className="h-px bg-slate-100 my-1" />
            <Link
              to="/login"
              className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block px-4 py-3 rounded-xl text-sm font-semibold bg-stone-900 text-white text-center mt-0.5"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

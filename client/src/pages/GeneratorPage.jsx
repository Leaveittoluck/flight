import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GeneratorForm from '../components/form/GeneratorForm'
import SeasonPageAccent from '../components/form/SeasonPageAccent'
import { generateDestinations } from '../services/destinationsApi'
import { normalizeDestination } from '../utils/normalizeDestination'
import { useActiveSeason } from '../context/SeasonContext'
import { SEASON_THEMES } from '../data/seasonThemes'
import { resolvePageSeason } from '../utils/resolvePageSeason'

const DEPARTURE_AIRPORT_ID = 1
const DEPARTURE_AIRPORT_IATA = 'STN'
const SESSION_KEY = 'litl_last_result'

export default function GeneratorPage() {
  const navigate = useNavigate()

  const [status, setStatus]     = useState('idle') // idle | loading | error | empty
  const [errorMsg, setErrorMsg] = useState('')
  const [tripInput, setTripInput] = useState(null)

  // formSeason: tracks the season field from the form for SeasonPageAccent
  const [formSeason, setFormSeason] = useState('')

  const { season, setSeason } = useActiveSeason()
  const pageSeasonKey = resolvePageSeason(tripInput?.season || season)
  const pageTheme = SEASON_THEMES[pageSeasonKey]

  // Called by GeneratorForm when the season field changes
  function handleSeasonChange(s) {
    setSeason(s)       // keeps global season context in sync (drives page gradients)
    setFormSeason(s)   // drives SeasonPageAccent
  }

  async function handleSubmit(formValues) {
    setStatus('loading')
    setErrorMsg('')

    const tripInputData = {
      travellers: formValues.travellers,
      departureDate: formValues.departure_date,
      returnDate: formValues.return_date || null,
      originIata: DEPARTURE_AIRPORT_IATA,
      season: formValues.season || '',
    }
    setTripInput(tripInputData)

    try {
      const budgetPerPerson = Number(formValues.budget)
      const payload = {
        departure_airport_id: DEPARTURE_AIRPORT_ID,
        budget: budgetPerPerson * formValues.travellers,
        budget_per_person: budgetPerPerson,
        travellers: formValues.travellers,
        trip_type_slug: formValues.mood,
        departure_date: formValues.departure_date,
        ...(formValues.return_date ? { return_date: formValues.return_date } : {}),
        ...(formValues.season ? { season: formValues.season } : {}),
      }

      const res = await generateDestinations(payload)
      const dests = res.data?.data?.destinations ?? []

      if (dests.length === 0) {
        setStatus('empty')
        return
      }

      const firstDest = normalizeDestination(dests[0])

      // Persist to sessionStorage as fallback for page refresh on result page
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
          destination: firstDest,
          tripInput: tripInputData,
        }))
      } catch { /* ignore storage errors */ }

      // Navigate to dedicated result page
      navigate('/travel/result', {
        state: { destination: firstDest, tripInput: tripInputData },
      })
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || 'Something went wrong. Please try again.'
      )
      setStatus('error')
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: `${pageTheme.pageGradient}, #fff7ed` }}
    >
      {/* Orange gradient page header */}
      <header style={{ background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 45%, #f97316 80%, #fb923c 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -top-8 right-8 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
              animation: 'sunGlow 7s ease-in-out infinite',
            }}
          />
          <div className="relative">
            <h1 className="text-2xl font-bold text-white tracking-tight">Leave It To Luck</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Tell us your budget and vibe — we'll handle the rest
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6"
        style={{ animation: 'fadeInUp 0.45s ease forwards' }}
      >
        {/* Form section — seasonal illustration appears OUTSIDE this at top-left */}
        <div className="relative" style={{ overflow: 'visible' }}>

          {/* SeasonPageAccent: enters from left page edge, settles behind form corner.
              Form card (z-index:20) sits on top — illustration peeks from behind. */}
          {formSeason && (
            <div
              className="absolute hidden sm:block pointer-events-none"
              style={{ top: '-60px', left: '-70px', zIndex: 8 }}
            >
              <SeasonPageAccent key={formSeason} season={formSeason} />
            </div>
          )}

          <div style={{ position: 'relative', zIndex: 20 }}>
            <GeneratorForm
              onSubmit={handleSubmit}
              isLoading={status === 'loading'}
              onSeasonPreview={handleSeasonChange}
              activeSeason={season}
              pageTheme={pageTheme}
            />
          </div>
        </div>

        {/* Inline status messages — only for error/empty (success navigates away) */}
        {status === 'error' && (
          <div
            className="rounded-2xl p-4 text-sm font-medium"
            style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c' }}
          >
            {errorMsg || 'Something went wrong. Please try again.'}
          </div>
        )}
        {status === 'empty' && (
          <div
            className="rounded-2xl p-4 text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid rgba(251,146,60,0.2)', color: '#78716c' }}
          >
            No destinations found for your preferences. Try adjusting your budget, mood, or dates.
          </div>
        )}
      </main>
    </div>
  )
}

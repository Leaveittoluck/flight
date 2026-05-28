import { useState } from 'react'
import GeneratorForm from '../components/form/GeneratorForm'
import DestinationResults from '../components/destinations/DestinationResults'
import { generateDestinations } from '../services/destinationsApi'
import { normalizeDestination } from '../utils/normalizeDestination'
import { useActiveSeason } from '../context/SeasonContext'
import { SEASON_THEMES } from '../data/seasonThemes'
import { resolvePageSeason } from '../utils/resolvePageSeason'

// Hardcoded to London Stansted (airport id 1) until a departure selector is added.
const DEPARTURE_AIRPORT_ID = 1
const DEPARTURE_AIRPORT_IATA = 'STN'

export default function GeneratorPage() {
  const [status, setStatus] = useState('idle') // idle | loading | error | empty | success
  const [destinations, setDestinations] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [clicksRemaining, setClicksRemaining] = useState(null)
  const [tripInput, setTripInput] = useState(null)

  const { season, setSeason } = useActiveSeason()
  const pageSeasonKey = resolvePageSeason(tripInput?.season || season)
  const pageTheme = SEASON_THEMES[pageSeasonKey]

  function handleClickUsed(remaining) {
    setClicksRemaining(remaining)
  }

  async function handleSubmit(formValues) {
    setStatus('loading')
    setDestinations([])
    setErrorMsg('')
    setTripInput({
      travellers: formValues.travellers,
      departureDate: formValues.departure_date,
      returnDate: formValues.return_date || null,
      originIata: DEPARTURE_AIRPORT_IATA,
      season: formValues.season || '',
    })

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
      } else {
        setDestinations(dests.map(normalizeDestination))
        setStatus('success')
      }
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
          {/* Subtle sun glow in header */}
          <div
            aria-hidden="true"
            className="absolute -top-8 right-8 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
              animation: 'sunGlow 7s ease-in-out infinite',
            }}
          />
          <div className="relative">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Leave It To Luck
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Tell us your budget and vibe — we'll handle the rest
            </p>
          </div>
        </div>
      </header>

      {/* Main content — fades in on mount */}
      <main
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10"
        style={{ animation: 'fadeInUp 0.45s ease forwards' }}
      >
        <GeneratorForm
          onSubmit={handleSubmit}
          isLoading={status === 'loading'}
          onSeasonPreview={setSeason}
          activeSeason={season}
          pageTheme={pageTheme}
        />
        <DestinationResults
          status={status}
          destinations={destinations}
          errorMsg={errorMsg}
          clicksRemaining={clicksRemaining}
          onClickUsed={handleClickUsed}
          tripInput={tripInput}
        />
      </main>
    </div>
  )
}

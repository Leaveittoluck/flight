import { useState } from 'react'
import GeneratorForm from '../components/form/GeneratorForm'
import DestinationResults from '../components/destinations/DestinationResults'
import { generateDestinations } from '../services/destinationsApi'
import { normalizeDestination } from '../utils/normalizeDestination'

// Hardcoded to London Stansted (airport id 1) until a departure selector is added.
const DEPARTURE_AIRPORT_ID = 1
const DEPARTURE_AIRPORT_IATA = 'STN'

export default function GeneratorPage() {
  const [status, setStatus] = useState('idle') // idle | loading | error | empty | success
  const [destinations, setDestinations] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [clicksRemaining, setClicksRemaining] = useState(null) // null until first click response
  const [tripInput, setTripInput] = useState(null) // { travellers, departureDate, returnDate, originIata }

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
    })

    try {
      const payload = {
        departure_airport_id: DEPARTURE_AIRPORT_ID,
        budget: Number(formValues.budget),
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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Leave It To Luck
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Tell us your budget and vibe — we'll handle the rest
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <GeneratorForm onSubmit={handleSubmit} isLoading={status === 'loading'} />
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

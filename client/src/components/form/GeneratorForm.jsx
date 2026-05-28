import { useState } from 'react'
import BudgetInput from './BudgetInput'
import TravellersSelect from './TravellersSelect'
import MoodSelect from './MoodSelect'
import SeasonSelect from './SeasonSelect'
import DateInputPair from './DateInputPair'
import Button from '../ui/Button'

const DEFAULT_FORM = {
  budget: '',
  travellers: 2,
  mood: '',
  season: '',
  departure_date: '',
  return_date: '',
}

export default function GeneratorForm({ onSubmit, isLoading, onSeasonPreview, activeSeason, pageTheme }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})

  function set(field) {
    return (value) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
      if (field === 'season') onSeasonPreview?.(value)
    }
  }

  function validate() {
    const errs = {}
    if (!form.budget || Number(form.budget) <= 0) {
      errs.budget = 'Please enter a budget per person greater than £0'
    }
    if (!form.mood) {
      errs.mood = 'Please select a trip mood'
    }
    const todayISO = new Date().toISOString().slice(0, 10)
    if (!form.departure_date) {
      errs.departure_date = 'Please select a departure date'
    } else if (form.departure_date < todayISO) {
      errs.departure_date = 'Departure date cannot be in the past'
    }
    if (form.return_date && form.return_date <= form.departure_date) {
      errs.return_date = 'Return date must be after departure'
    }
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    onSubmit(form)
  }

  return (
    <section>
      <form onSubmit={handleSubmit} noValidate>
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            border: '1.5px solid rgba(251,146,60,0.25)',
            boxShadow: '0 4px 24px rgba(249,115,22,0.12)',
          }}
        >
          {/* Orange header strip */}
          <div
            className="px-6 py-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 60%, #fb923c 100%)' }}
          >
            <div
              aria-hidden="true"
              className="absolute -top-6 right-6 w-20 h-20 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)',
                animation: 'sunGlow 6s ease-in-out infinite',
              }}
            />
            <h2 className="text-base font-bold text-white relative">Where do you want to go?</h2>
            <p className="text-sm mt-0.5 relative" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Set your preferences and let luck find your perfect destination
            </p>
          </div>

          {/* Form body */}
          <div style={{ backgroundColor: '#fff7ed' }}>

            {/* Budget + travellers */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <BudgetInput
                value={form.budget}
                onChange={set('budget')}
                error={errors.budget}
                travellers={form.travellers}
              />
              <TravellersSelect value={form.travellers} onChange={set('travellers')} />
            </div>

            <div className="border-t border-dashed" style={{ borderColor: 'rgba(251,146,60,0.2)' }} />

            {/* Mood + season */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <MoodSelect value={form.mood} onChange={set('mood')} error={errors.mood} />
              <SeasonSelect value={form.season} onChange={set('season')} />
            </div>

            <div className="border-t border-dashed" style={{ borderColor: 'rgba(251,146,60,0.2)' }} />

            {/* Dates */}
            <div className="p-6">
              <DateInputPair
                departureDate={form.departure_date}
                returnDate={form.return_date}
                onDepartureChange={set('departure_date')}
                onReturnChange={set('return_date')}
                errors={errors}
              />
            </div>

            {/* Submit */}
            <div
              className="px-6 py-4 flex items-center gap-4"
              style={{
                borderTop: '1.5px solid rgba(251,146,60,0.15)',
                background: activeSeason && pageTheme
                  ? `${pageTheme.pageGradient}, #fef3c7`
                  : '#fef3c7',
              }}
            >
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Searching…' : 'Reveal my destination'}
              </Button>
              {isLoading && (
                <span className="text-sm text-stone-500">Hang tight, this takes a moment</span>
              )}
            </div>

          </div>
        </div>
      </form>
    </section>
  )
}

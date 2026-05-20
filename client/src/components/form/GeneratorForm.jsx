import { useState } from 'react'
import BudgetInput from './BudgetInput'
import TravellersSelect from './TravellersSelect'
import MoodSelect from './MoodSelect'
import SeasonSelect from './SeasonSelect'
import DateInputPair from './DateInputPair'
import Button from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'

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
      errs.budget = 'Please enter a budget greater than £0'
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
      <SectionHeading>Where do you want to go?</SectionHeading>
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Budget + travellers row */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <BudgetInput
              value={form.budget}
              onChange={set('budget')}
              error={errors.budget}
              travellers={form.travellers}
            />
            <TravellersSelect value={form.travellers} onChange={set('travellers')} />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Mood + season row */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <MoodSelect value={form.mood} onChange={set('mood')} error={errors.mood} />
            <SeasonSelect value={form.season} onChange={set('season')} />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Date row */}
          <div className="p-6">
            <DateInputPair
              departureDate={form.departure_date}
              returnDate={form.return_date}
              onDepartureChange={set('departure_date')}
              onReturnChange={set('return_date')}
              errors={errors}
            />
          </div>

          {/* Submit row — subtle seasonal tint when a season is active */}
          <div
            className="px-6 py-4 border-t border-slate-100 flex items-center gap-4"
            style={{
              background: activeSeason && pageTheme
                ? `${pageTheme.pageGradient}, #f8fafc`
                : '#f8fafc',
            }}
          >
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Searching…' : 'Reveal my destination'}
            </Button>
            {isLoading && (
              <span className="text-sm text-slate-500">Hang tight, this takes a moment</span>
            )}
          </div>
        </div>
      </form>
    </section>
  )
}

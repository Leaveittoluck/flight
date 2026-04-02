import { useState } from 'react'
import BudgetInput from './BudgetInput'
import TravellersSelect from './TravellersSelect'
import MoodSelect from './MoodSelect'
import SeasonSelect from './SeasonSelect'
import Button from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'

const DEFAULT_FORM = {
  budget: '',
  travellers: 2,
  mood: '',
  season: '',
}

export default function GeneratorForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})

  function set(field) {
    return (value) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
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
      <SectionHeading>Plan your trip</SectionHeading>
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <BudgetInput value={form.budget} onChange={set('budget')} error={errors.budget} />
            <TravellersSelect value={form.travellers} onChange={set('travellers')} />
            <MoodSelect value={form.mood} onChange={set('mood')} error={errors.mood} />
            <SeasonSelect value={form.season} onChange={set('season')} />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Finding destinations…' : 'Find destinations'}
            </Button>
            {isLoading && (
              <span className="text-sm text-slate-500">This may take a moment</span>
            )}
          </div>
        </div>
      </form>
    </section>
  )
}

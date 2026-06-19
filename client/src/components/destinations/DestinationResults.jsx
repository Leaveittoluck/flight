import SectionHeading from '../ui/SectionHeading'
import StatusMessage from '../ui/StatusMessage'
import DestinationCard from './DestinationCard'

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">Finding your destination…</p>
        <p className="text-xs text-slate-500 mt-0.5">This may take a moment</p>
      </div>
    </div>
  )
}

function GenerationsCounter({ remaining }) {
  if (remaining == null) return null
  if (remaining > 0) {
    return (
      <p className="text-xs text-slate-500 mb-4">
        {remaining} destination reveal{remaining === 1 ? '' : 's'} remaining this month
      </p>
    )
  }
  return (
    <p className="text-xs font-medium text-amber-600 mb-4">
      You've used all your destination reveals this month — upgrade for more
    </p>
  )
}

export default function DestinationResults({
  status,
  destinations,
  errorMsg,
  remainingGenerations,
  tripInput,
}) {
  if (status === 'idle') return null

  return (
    <section>
      {status === 'success' && (
        <div className="mb-2">
          <SectionHeading>Your destination</SectionHeading>
        </div>
      )}

      {status === 'success' && (
        <GenerationsCounter remaining={remainingGenerations} />
      )}

      {status === 'loading' && <Spinner />}

      {status === 'error' && (
        <StatusMessage
          variant="error"
          title="Something went wrong"
          body="We couldn't load destinations right now. Check your connection and try again."
        />
      )}

      {status === 'empty' && (
        <StatusMessage
          variant="empty"
          title="No destination found"
          body="No estimated trip matched your search. Try a higher budget, fewer travellers, or a different trip mood."
        />
      )}

      {status === 'success' && (
        <div className="grid grid-cols-1 gap-6">
          {destinations.map((dest, i) => (
            <div
              key={dest.id}
              style={{ animation: `fadeInUp 0.35s ease both`, animationDelay: `${i * 80}ms` }}
            >
              <DestinationCard
                destination={dest}
                tripInput={tripInput}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

import SectionHeading from '../ui/SectionHeading'
import StatusMessage from '../ui/StatusMessage'
import DestinationCard from './DestinationCard'

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">Finding your destinations…</p>
        <p className="text-xs text-slate-500 mt-0.5">This may take a moment</p>
      </div>
    </div>
  )
}

export default function DestinationResults({ status, destinations, errorMsg }) {
  if (status === 'idle') return null

  return (
    <section>
      {status === 'success' && (
        <div className="flex items-baseline gap-2 mb-4">
          <SectionHeading>Your destinations</SectionHeading>
          <span className="text-sm text-slate-400 -mt-4">
            {destinations.length} match{destinations.length === 1 ? '' : 'es'}
          </span>
        </div>
      )}

      {status === 'loading' && <Spinner />}

      {status === 'error' && (
        <StatusMessage
          variant="error"
          title="We couldn't reach the server"
          body={errorMsg || 'Check your connection and try again.'}
        />
      )}

      {status === 'empty' && (
        <StatusMessage
          variant="empty"
          title="No destinations found for that search"
          body="Try increasing your budget, reducing the group size, or switching to a different mood."
        />
      )}

      {status === 'success' && (
        <div className="grid grid-cols-1 gap-6">
          {destinations.map((dest, i) => (
            <div
              key={dest.id}
              style={{ animation: `fadeInUp 0.35s ease both`, animationDelay: `${i * 80}ms` }}
            >
              <DestinationCard destination={dest} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

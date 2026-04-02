import SectionHeading from '../ui/SectionHeading'
import StatusMessage from '../ui/StatusMessage'
import DestinationCard from './DestinationCard'

export default function DestinationResults({ status, destinations, errorMsg }) {
  if (status === 'idle') return null

  const heading =
    status === 'success'
      ? `${destinations.length} destination${destinations.length === 1 ? '' : 's'} found`
      : 'Results'

  return (
    <section>
      <SectionHeading>{heading}</SectionHeading>

      {status === 'loading' && (
        <StatusMessage
          variant="info"
          title="Finding your perfect destinations…"
          body="Searching across our destination database"
        />
      )}

      {status === 'error' && (
        <StatusMessage
          variant="error"
          title="Something went wrong"
          body={errorMsg || 'Unable to fetch destinations. Please try again.'}
        />
      )}

      {status === 'empty' && (
        <StatusMessage
          variant="empty"
          title="No destinations matched"
          body="Try adjusting your budget, number of travellers, or trip mood and search again."
        />
      )}

      {status === 'success' && (
        <div className="grid grid-cols-1 gap-5">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </section>
  )
}

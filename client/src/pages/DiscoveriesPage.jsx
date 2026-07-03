import { useState, useEffect } from 'react'
import { fetchDiscoveries } from '../services/discoveriesApi'
import Card from '../components/ui/Card'
import CardLabel from '../components/ui/CardLabel'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatGBP(amount) {
  if (amount == null) return null
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatLabel(slug) {
  if (!slug) return ''
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
}

function DiscoveryCard({ item }) {
  const hasCity    = !!item.city
  const hasCountry = !!item.country

  return (
    <div
      className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 transition-all duration-200 hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Destination name */}
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {hasCity && <span>{item.city}</span>}
            {hasCity && hasCountry && (
              <span className="text-slate-400 font-normal">, </span>
            )}
            {hasCountry && (
              <span className="text-slate-600 font-semibold text-base">{item.country}</span>
            )}
          </h3>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-2">
            {item.trip_type && (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                style={{
                  backgroundColor: 'rgba(249,115,22,0.1)',
                  color: '#ea580c',
                  border: '1px solid rgba(249,115,22,0.2)',
                }}
              >
                {formatLabel(item.trip_type)}
              </span>
            )}
            {item.season && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-orange-50/70 text-slate-600">
                {formatLabel(item.season)}
              </span>
            )}
            {item.travellers && (
              <span className="text-xs text-slate-500">
                {item.travellers} traveller{item.travellers !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Date */}
        <p className="text-xs text-slate-400 shrink-0 pt-0.5 tabular-nums">
          {formatDate(item.generated_at)}
        </p>
      </div>

      {/* Cost row */}
      {(item.budget_per_person != null || item.estimated_total_cost != null) && (
        <div
          className="flex flex-wrap gap-x-5 gap-y-1 mt-4 pt-4 text-sm"
          style={{ borderTop: '1px solid rgba(251,146,60,0.12)' }}
        >
          {item.budget_per_person != null && (
            <span className="text-slate-500">
              Budget{' '}
              <span className="font-semibold text-slate-700">{formatGBP(item.budget_per_person)}</span>
              <span className="text-slate-400">/person</span>
            </span>
          )}
          {item.estimated_total_cost != null && (
            <span className="text-slate-500">
              Est.{' '}
              <span className="font-semibold text-slate-700">{formatGBP(item.estimated_total_cost)}</span>
              {' '}total
              {item.estimated_cost_per_person != null && (
                <span className="text-slate-400">
                  {' '}({formatGBP(item.estimated_cost_per_person)}/person)
                </span>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default function DiscoveriesPage() {
  const [discoveries, setDiscoveries] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  useEffect(() => {
    fetchDiscoveries()
      .then(setDiscoveries)
      .catch(() => setError('Could not load discoveries. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <PageHeader eyebrow="Discoveries" title="Your Destinations" subtitle="Destinations you've generated" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Loading */}
        {loading && (
          <div className="litl-card py-10 text-center">
            <p className="text-sm text-slate-400">Loading discoveries…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="litl-card py-10 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && discoveries?.length === 0 && (
          <Card>
            <EmptyState
              title="You haven't discovered any destinations yet."
              body="Generate your first destination and it'll appear here."
              ctaTo="/travel"
            />
          </Card>
        )}

        {/* Discovery list */}
        {!loading && !error && discoveries?.length > 0 && (
          <div className="space-y-4">
            <CardLabel>
              {discoveries.length} destination{discoveries.length !== 1 ? 's' : ''} discovered
            </CardLabel>
            {discoveries.map((item) => (
              <DiscoveryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

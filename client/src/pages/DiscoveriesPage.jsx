import { useState, useEffect, useRef } from 'react'
import { fetchDiscoveries } from '../services/discoveriesApi'
import { fetchDestinationImage } from '../services/imagesApi'
import { getDestinationImage } from '../data/destinationImages'
import { destinationVibes } from '../data/destinationVibes'
import { weatherEnrichment } from '../data/weatherEnrichment'
import Card from '../components/ui/Card'
import CardLabel from '../components/ui/CardLabel'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

const PAGE_SIZE = 20

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

/** Builds the compact page-number list with ellipses for large sets. */
function getPageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const keep = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const result = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push('ellipsis')
    result.push(p)
    prev = p
  }
  return result
}

// ─── Inline icons (thin outline, matches Dashboard style) ─────────────────

function IcChevronDown({ open }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-3.5 h-3.5 transition-transform duration-200"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
    </svg>
  )
}

function IcGlobe() {
  return (
    <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="10" cy="10" r="7.5" />
      <path strokeLinecap="round" d="M2.5 10h15M10 2.5c-2 2.5-3 4.8-3 7.5s1 5 3 7.5M10 2.5c2 2.5 3 4.8 3 7.5s-1 5-3 7.5" />
    </svg>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────

function DetailRow({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div className="flex items-center justify-between gap-3 py-1.5" style={{ borderBottom: '1px solid rgba(251,146,60,0.08)' }}>
      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-slate-700 text-right">{value}</span>
    </div>
  )
}

function DiscoveryCard({ item, expanded, onToggle }) {
  const hasCity    = !!item.city
  const hasCountry = !!item.country

  const [imageUrl, setImageUrl] = useState(null)
  const requestedRef = useRef(false)

  useEffect(() => {
    if (!expanded || requestedRef.current) return
    requestedRef.current = true
    fetchDestinationImage(item.city, item.country).then((url) => {
      setImageUrl(url || getDestinationImage(item))
    })
  }, [expanded, item])

  const vibes   = item.iata_code ? destinationVibes[item.iata_code]  : null
  const weather = item.iata_code ? weatherEnrichment[item.iata_code] : null

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: '#fffdf9',
        border: '1.5px solid rgba(251,146,60,0.18)',
        boxShadow: expanded
          ? '0 8px 28px rgba(249,115,22,0.13), inset 0 1px 0 rgba(255,255,255,0.9)'
          : '0 1px 8px rgba(249,115,22,0.05)',
      }}
    >
      {/* Inner dashed matting — journal / postcard feel */}
      <div className="absolute inset-2 rounded-xl pointer-events-none" style={{ border: '1px dashed rgba(251,146,60,0.10)' }} aria-hidden="true" />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Destination name */}
          <div className="min-w-0">
            <h3 className="litl-serif text-xl font-bold text-slate-900 italic leading-tight">
              {hasCity && <span>{item.city}</span>}
              {hasCity && hasCountry && <span className="text-slate-400 font-normal not-italic">, </span>}
              {hasCountry && <span className="text-slate-600 font-semibold text-base not-italic">{item.country}</span>}
            </h3>

            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-2">
              {item.trip_type && (
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: '#ea580c', border: '1px solid rgba(249,115,22,0.2)' }}
                >
                  {formatLabel(item.trip_type)}
                </span>
              )}
              {item.season && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-orange-50/70 text-slate-600 border border-orange-100">
                  🌿 {formatLabel(item.season)}
                </span>
              )}
              {item.travellers && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium text-slate-500">
                  👥 {item.travellers} traveller{item.travellers !== 1 ? 's' : ''}
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

        {/* Toggle */}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            {expanded ? 'Hide details' : 'View details'}
            <IcChevronDown open={expanded} />
          </button>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px dashed rgba(251,146,60,0.18)' }}>
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Destination photo — postcard style, same image strategy as Dashboard/Result page */}
              <div
                className="relative w-full sm:w-48 h-40 sm:h-auto rounded-2xl shrink-0 overflow-hidden"
                style={{ border: '2px solid #ffffff', boxShadow: '0 8px 22px rgba(120,53,15,0.18)' }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`${item.city ?? 'Destination'} landscape`}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackUsed) {
                        e.currentTarget.dataset.fallbackUsed = '1'
                        e.currentTarget.src = '/images/destinations/_fallback.jpg'
                      }
                    }}
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.10) 0%, rgba(251,146,60,0.18) 100%)' }}
                  >
                    <IcGlobe />
                    <span className="text-[9px] font-bold text-orange-700/50 uppercase tracking-widest">Loading…</span>
                  </div>
                )}
              </div>

              {/* Full field list + enrichment */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <DetailRow label="City" value={item.city} />
                  <DetailRow label="Country" value={item.country} />
                  <DetailRow label="Trip type" value={formatLabel(item.trip_type)} />
                  <DetailRow label="Season" value={formatLabel(item.season)} />
                  <DetailRow label="Travellers" value={item.travellers} />
                  <DetailRow label="Generated on" value={formatDate(item.generated_at)} />
                  <DetailRow label="Budget /person" value={formatGBP(item.budget_per_person)} />
                  <DetailRow label="Est. cost /person" value={formatGBP(item.estimated_cost_per_person)} />
                  <DetailRow label="Est. total cost" value={formatGBP(item.estimated_total_cost)} />
                  <DetailRow label="Airport" value={item.iata_code} />
                </div>

                {(vibes?.atmosphere || weather?.summary) && (
                  <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid rgba(251,146,60,0.08)' }}>
                    {vibes?.atmosphere && (
                      <p className="text-sm text-slate-600 leading-relaxed italic">{vibes.atmosphere}</p>
                    )}
                    {weather?.summary && (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        🌤️ {weather.summary}
                        {weather.bestSeason && <span className="text-slate-400"> · Best in {weather.bestSeason}</span>}
                      </p>
                    )}
                    {vibes?.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {vibes.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-orange-50 text-orange-700 border border-orange-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = getPageWindow(page, totalPages)

  return (
    <nav className="flex items-center justify-center gap-1.5 flex-wrap pt-6" aria-label="Discoveries pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed enabled:hover:-translate-y-px"
        style={{ background: '#ffffff', border: '1.5px solid rgba(251,146,60,0.22)', color: '#c2410c' }}
      >
        ← Previous
      </button>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-1.5 text-slate-300 text-xs select-none">···</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className="w-9 h-9 rounded-xl text-xs font-bold transition-all duration-150 hover:-translate-y-px"
            style={
              p === page
                ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', color: '#ffffff', boxShadow: '0 2px 10px rgba(234,88,12,0.28)' }
                : { background: '#ffffff', border: '1.5px solid rgba(251,146,60,0.16)', color: '#78716c' }
            }
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed enabled:hover:-translate-y-px"
        style={{ background: '#ffffff', border: '1.5px solid rgba(251,146,60,0.22)', color: '#c2410c' }}
      >
        Next →
      </button>
    </nav>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function DiscoveriesPage() {
  const [discoveries, setDiscoveries] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [page, setPage]               = useState(1)
  const [expandedId, setExpandedId]   = useState(null)

  const listTopRef = useRef(null)
  const hasMounted = useRef(false)

  useEffect(() => {
    fetchDiscoveries()
      .then(setDiscoveries)
      .catch(() => setError('Could not load discoveries. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const totalPages = discoveries ? Math.max(1, Math.ceil(discoveries.length / PAGE_SIZE)) : 1
  const pageItems  = discoveries ? discoveries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : []

  // Scroll back near the top of the list on page change (skip on first mount)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [page])

  function changePage(next) {
    const clamped = Math.min(Math.max(next, 1), totalPages)
    if (clamped === page) return
    setExpandedId(null)
    setPage(clamped)
  }

  function toggleExpanded(id) {
    setExpandedId((current) => (current === id ? null : id))
  }

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
            <div ref={listTopRef} style={{ scrollMarginTop: '5rem' }} />
            <CardLabel>
              {discoveries.length} destination{discoveries.length !== 1 ? 's' : ''} discovered
              {totalPages > 1 && (
                <span className="normal-case font-semibold text-slate-400"> · page {page} of {totalPages}</span>
              )}
            </CardLabel>
            {pageItems.map((item) => (
              <DiscoveryCard
                key={item.id}
                item={item}
                expanded={expandedId === item.id}
                onToggle={() => toggleExpanded(item.id)}
              />
            ))}

            <Pagination page={page} totalPages={totalPages} onChange={changePage} />
          </div>
        )}
      </main>
    </div>
  )
}

const STORAGE_KEY = 'litl_remaining_generations'

// Mirrors the server's current monthly generation allowance for the Free
// tier (server/src/constants/auth.js → GENERATION_LIMITS.free). Used only
// to render an optimistic usage badge before the user's first reveal each
// month — it has no bearing on enforcement, which always comes from the
// server's response (see GeneratorPage.handleSubmit).
export const ASSUMED_MONTHLY_LIMIT = 5

function currentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}`
}

/** Best-known remaining generation count for this browser, for display only. */
export function readCachedRemaining() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return ASSUMED_MONTHLY_LIMIT
    const { value, monthKey } = JSON.parse(raw)
    if (monthKey !== currentMonthKey()) return ASSUMED_MONTHLY_LIMIT
    return typeof value === 'number' ? value : ASSUMED_MONTHLY_LIMIT
  } catch {
    return ASSUMED_MONTHLY_LIMIT
  }
}

export function writeCachedRemaining(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, monthKey: currentMonthKey() }))
  } catch { /* ignore storage errors */ }
}

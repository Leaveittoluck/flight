// First moment of next calendar month — matches the `date_trunc('month', NOW())`
// boundary used by the monthly count queries, so the displayed reset date lines
// up with when a user's count actually clears.
function nextMonthlyResetDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString();
}

function buildUsageSnapshot({ plan, used, limit }) {
  const clicksRemaining = limit === null ? null : Math.max(0, limit - used);

  return {
    plan,
    clicksUsed:      used,
    clicksLimit:     limit,
    clicksRemaining,
    resetDate:       nextMonthlyResetDate(),
    ctaAllowed:      clicksRemaining === null || clicksRemaining > 0,
  };
}

module.exports = { buildUsageSnapshot };

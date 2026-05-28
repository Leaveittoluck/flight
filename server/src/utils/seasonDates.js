// Season → calendar window lookup
// winter spans Dec–Feb (crosses year boundary)
const SEASON_RANGES = {
  spring: { startMonth: 3, startDay: 1,  endMonth: 5,  endDay: 31 },
  summer: { startMonth: 6, startDay: 1,  endMonth: 8,  endDay: 31 },
  autumn: { startMonth: 9, startDay: 1,  endMonth: 11, endDay: 30 },
  fall:   { startMonth: 9, startDay: 1,  endMonth: 11, endDay: 30 },
  winter: null, // handled separately — crosses year boundary
};

const MIN_LEAD_DAYS = 7;

function toISO(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Returns { start: Date, end: Date } for a given season and base year (UTC midnight).
// For winter the returned window is Dec 1 of `year` → Feb 28/29 of `year+1`.
// For winter when today is in Jan–Feb, pass the December year (year−1) as `year`.
function getSeasonWindow(season, year) {
  if (season === 'winter') {
    const start = new Date(Date.UTC(year, 11, 1));        // Dec 1
    const endYear = year + 1;
    const endDay  = isLeapYear(endYear) ? 29 : 28;
    const end   = new Date(Date.UTC(endYear, 1, endDay)); // Feb 28/29
    return { start, end };
  }

  const r = SEASON_RANGES[season];
  if (!r) return null;
  return {
    start: new Date(Date.UTC(year, r.startMonth - 1, r.startDay)),
    end:   new Date(Date.UTC(year, r.endMonth   - 1, r.endDay)),
  };
}

/**
 * Pick a random future departure date inside the given season, then add
 * durationNights to get the return date.  The full trip is guaranteed to
 * land within the season window.
 *
 * @param {string} season  - "spring"|"summer"|"autumn"|"fall"|"winter"
 * @param {number} durationNights
 * @returns {{ departure_date: string, return_date: string }}  ISO "YYYY-MM-DD"
 */
function generateTravelDatesForSeason(season, durationNights = 7) {
  const norm = (season || '').toLowerCase().trim();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const earliest = addDays(today, MIN_LEAD_DAYS);

  // Unknown / empty season — pick a random date 2–4 months out
  if (!norm || (!SEASON_RANGES[norm] && norm !== 'winter')) {
    const offset = Math.floor(Math.random() * 90) + 60; // 60–149 days
    const departure = addDays(today, offset);
    return {
      departure_date: toISO(departure),
      return_date:    toISO(addDays(departure, durationNights)),
    };
  }

  const currentYear = today.getUTCFullYear();

  // For winter, when we're in Jan–Feb the ongoing winter started in the
  // previous December, so try that window first.
  const startOffsets =
    norm === 'winter' && today.getUTCMonth() < 2
      ? [currentYear - 1, currentYear, currentYear + 1]
      : [currentYear, currentYear + 1, currentYear + 2];

  for (const yr of startOffsets) {
    const window = getSeasonWindow(norm, yr);
    if (!window) continue;

    // Latest start that keeps the whole trip inside the season
    const latestStart = addDays(window.end, -durationNights);

    // Cannot start before the season opens or before our lead-time minimum
    const effectiveStart = window.start >= earliest ? window.start : earliest;

    if (effectiveStart > latestStart) continue; // this year's window already passed

    const spanDays = Math.floor((latestStart - effectiveStart) / 86_400_000);
    const offset   = Math.floor(Math.random() * (spanDays + 1));
    const departure = addDays(effectiveStart, offset);

    return {
      departure_date: toISO(departure),
      return_date:    toISO(addDays(departure, durationNights)),
    };
  }

  // Absolute fallback — 30 days from today
  const departure = addDays(today, 30);
  return {
    departure_date: toISO(departure),
    return_date:    toISO(addDays(departure, durationNights)),
  };
}

module.exports = { generateTravelDatesForSeason };

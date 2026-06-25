const { generateTravelDatesForSeason } = require('./seasonDates');

function daysBetween(isoA, isoB) {
  const a = new Date(isoA + 'T00:00:00Z');
  const b = new Date(isoB + 'T00:00:00Z');
  return Math.round((b - a) / 86_400_000);
}

function mockToday(isoDate) {
  jest.useFakeTimers().setSystemTime(new Date(isoDate + 'T00:00:00Z'));
}

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('generateTravelDatesForSeason', () => {
  it('returns ISO-formatted dates where return_date is exactly durationNights after departure_date', () => {
    mockToday('2026-01-10');
    const { departure_date, return_date } = generateTravelDatesForSeason('summer', 5);
    expect(departure_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(return_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(daysBetween(departure_date, return_date)).toBe(5);
  });

  it.each(['spring', 'summer', 'autumn', 'fall', 'winter'])(
    'accepts the season "%s" without throwing',
    (season) => {
      mockToday('2026-01-10');
      expect(() => generateTravelDatesForSeason(season, 7)).not.toThrow();
    }
  );

  it('is case-insensitive and trims whitespace on the season name', () => {
    mockToday('2026-01-10');
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const a = generateTravelDatesForSeason('  Summer  ', 7);
    const b = generateTravelDatesForSeason('summer', 7);
    expect(a).toEqual(b);
  });

  it('keeps the departure within the requested season window (summer)', () => {
    mockToday('2026-01-10');
    const { departure_date } = generateTravelDatesForSeason('summer', 5);
    const month = Number(departure_date.slice(5, 7));
    expect(month).toBeGreaterThanOrEqual(6);
    expect(month).toBeLessThanOrEqual(8);
  });

  it('respects the minimum 7-day lead time when the season starts very soon', () => {
    // Spring starts March 1st; mock "today" to within the lead-time window.
    mockToday('2026-02-27');
    jest.spyOn(Math, 'random').mockReturnValue(0); // earliest possible pick
    const { departure_date } = generateTravelDatesForSeason('spring', 3);
    expect(daysBetween('2026-02-27', departure_date)).toBeGreaterThanOrEqual(7);
  });

  describe('winter year-boundary handling', () => {
    it('continues the ongoing winter when "today" is in January', () => {
      mockToday('2026-01-15');
      jest.spyOn(Math, 'random').mockReturnValue(0);
      const { departure_date } = generateTravelDatesForSeason('winter', 5);
      // The ongoing winter started Dec 2025 and ends Feb 2026 — departure
      // should land in Jan/Feb 2026, not jump forward a full year.
      expect(departure_date >= '2026-01-22').toBe(true);
      expect(departure_date <= '2026-02-23').toBe(true);
    });

    it('picks the upcoming winter when "today" is mid-year', () => {
      mockToday('2026-07-15');
      jest.spyOn(Math, 'random').mockReturnValue(0); // earliest possible pick = window start
      const { departure_date } = generateTravelDatesForSeason('winter', 5);
      expect(departure_date).toBe('2026-12-01');
    });
  });

  it('lands return_date exactly on Feb 29 in a leap year when the random pick is maximal', () => {
    // "Today" in mid-2027 (not Jan/Feb) -> first candidate winter window is
    // Dec 2027 -> Feb 2028, and 2028 is a leap year.
    mockToday('2027-07-15');
    jest.spyOn(Math, 'random').mockReturnValue(0.999999); // forces latest possible start
    const { return_date } = generateTravelDatesForSeason('winter', 5);
    expect(return_date).toBe('2028-02-29');
  });

  it('falls back to a 60-149 day random window for an unknown season', () => {
    mockToday('2026-01-10');
    jest.spyOn(Math, 'random').mockReturnValue(0); // offset = 60 exactly
    const { departure_date } = generateTravelDatesForSeason('not-a-real-season', 4);
    expect(daysBetween('2026-01-10', departure_date)).toBe(60);
  });

  it('falls back to a flat 30 days out when no season window can fit the requested duration', () => {
    mockToday('2026-01-10');
    // A 200-night trip cannot fit inside any single ~90-day season window.
    const { departure_date } = generateTravelDatesForSeason('spring', 200);
    expect(daysBetween('2026-01-10', departure_date)).toBe(30);
  });
});

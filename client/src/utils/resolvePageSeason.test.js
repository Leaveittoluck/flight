import { describe, it, expect, vi, afterEach } from 'vitest'
import { resolvePageSeason } from './resolvePageSeason'

afterEach(() => {
  vi.useRealTimers()
})

describe('resolvePageSeason', () => {
  it('returns the selected season when it is a recognised theme key', () => {
    expect(resolvePageSeason('summer')).toBe('summer')
  })

  it('is case-insensitive and trims whitespace', () => {
    expect(resolvePageSeason('  Winter  ')).toBe('winter')
  })

  it('falls back to the calendar season for an unrecognised value (e.g. "fall", which has no theme)', () => {
    vi.useFakeTimers().setSystemTime(new Date('2026-01-15T00:00:00Z'))
    expect(resolvePageSeason('fall')).toBe('winter')
  })

  it.each([
    ['2026-01-15', 'winter'],
    ['2026-03-15', 'spring'],
    ['2026-06-15', 'summer'],
    ['2026-09-15', 'autumn'],
    ['2026-12-15', 'winter'],
  ])('falls back to the calendar season %s -> %s when no season is selected', (date, expected) => {
    vi.useFakeTimers().setSystemTime(new Date(date + 'T00:00:00Z'))
    expect(resolvePageSeason('')).toBe(expected)
    expect(resolvePageSeason(undefined)).toBe(expected)
    expect(resolvePageSeason(null)).toBe(expected)
  })
})

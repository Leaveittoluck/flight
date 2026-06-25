import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ASSUMED_MONTHLY_LIMIT, readCachedRemaining, writeCachedRemaining } from './generationUsage'

const STORAGE_KEY = 'litl_remaining_generations'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('readCachedRemaining / writeCachedRemaining', () => {
  it('returns the assumed monthly limit when nothing is cached yet', () => {
    expect(readCachedRemaining()).toBe(ASSUMED_MONTHLY_LIMIT)
  })

  it('round-trips a written value within the same month', () => {
    writeCachedRemaining(3)
    expect(readCachedRemaining()).toBe(3)
  })

  it('falls back to the assumed limit when the cached entry is from a previous month', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: 1, monthKey: '2000-0' }))
    expect(readCachedRemaining()).toBe(ASSUMED_MONTHLY_LIMIT)
  })

  it('falls back to the assumed limit when the cached entry is malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json{{')
    expect(readCachedRemaining()).toBe(ASSUMED_MONTHLY_LIMIT)
  })

  it('falls back to the assumed limit when the cached value is not a number', () => {
    const monthKey = `${new Date().getFullYear()}-${new Date().getMonth()}`
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: 'three', monthKey }))
    expect(readCachedRemaining()).toBe(ASSUMED_MONTHLY_LIMIT)
  })

  it('does not throw when localStorage.setItem fails (e.g. quota exceeded)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(() => writeCachedRemaining(2)).not.toThrow()
  })

  it('does not throw when localStorage.getItem fails', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('boom')
    })
    expect(() => readCachedRemaining()).not.toThrow()
    expect(readCachedRemaining()).toBe(ASSUMED_MONTHLY_LIMIT)
  })
})

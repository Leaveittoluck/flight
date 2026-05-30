import { apiFetch } from './apiFetch'

/**
 * Ask the backend for a Pexels landscape photo URL for the given city.
 * Returns a URL string on success, or null when no photo is available.
 */
export async function fetchDestinationImage(city, country) {
  if (!city) return null
  const params = new URLSearchParams({ city })
  if (country) params.set('country', country)
  try {
    const res = await apiFetch(`/api/images/destination?${params}`)
    return res.data?.data?.url ?? null
  } catch {
    return null
  }
}

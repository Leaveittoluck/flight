import { apiFetch } from './apiFetch'

export function generateDestinations(payload) {
  return apiFetch('/api/destinations/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

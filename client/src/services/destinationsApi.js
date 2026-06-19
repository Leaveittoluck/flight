import { apiFetch } from './apiFetch'
import { getAnonymousId } from '../utils/anonymousId'

export function generateDestinations(payload) {
  return apiFetch('/api/destinations/generate', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      anonymous_id: getAnonymousId(),
    }),
  })
}

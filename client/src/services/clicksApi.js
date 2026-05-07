import { apiFetch } from './apiFetch'
import { getAnonymousId } from '../utils/anonymousId'

/**
 * Track a CTA click before redirecting the user to an affiliate link.
 * @param {Object} payload
 * @param {number} payload.destination_id
 * @param {'flight'|'hotel'} payload.click_type
 */
export function trackClick({ destination_id, click_type }) {
  return apiFetch('/api/click', {
    method: 'POST',
    body: JSON.stringify({
      destination_id,
      click_type,
      anonymous_id: getAnonymousId(),
    }),
  })
}

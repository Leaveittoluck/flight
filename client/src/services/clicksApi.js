import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL: BASE_URL,
})

/**
 * Track a CTA click before redirecting the user to an affiliate link.
 * @param {Object} payload
 * @param {number} payload.destination_id
 * @param {'flight'|'hotel'} payload.click_type
 */
export function trackClick({ destination_id, click_type }) {
  return api.post('/api/click', { destination_id, click_type })
}

import axios from 'axios'

// Base URL is empty by default so the Vite dev proxy forwards /api/* to the backend.
// Set VITE_API_BASE_URL in .env to point at a different host in production.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL: BASE_URL,
})

export function generateDestinations(payload) {
  return api.post('/api/destinations/generate', payload)
}

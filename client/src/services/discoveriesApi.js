import { apiFetch } from './apiFetch'

export async function fetchDiscoveries() {
  const { data: body } = await apiFetch('/api/discoveries')
  return body.data
}

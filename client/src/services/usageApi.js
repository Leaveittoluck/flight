import { apiFetch } from './apiFetch'

export async function fetchUsage() {
  const { data: body } = await apiFetch('/api/usage')
  return body.data
}

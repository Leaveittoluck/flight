import { apiFetch } from './apiFetch'

export async function fetchProfile() {
  const { data: body } = await apiFetch('/api/profile')
  return body.data
}

export async function patchProfile(payload) {
  const { data: body } = await apiFetch('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return body.data
}

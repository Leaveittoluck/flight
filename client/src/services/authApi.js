const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function fetchMe() {
  const res = await fetch(`${BASE_URL}/api/auth/me`, { credentials: 'include' })
  if (!res.ok) return null
  const { data } = await res.json()
  return data
}

export async function logoutApi() {
  await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

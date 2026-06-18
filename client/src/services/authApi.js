export async function fetchMe() {
  const res = await fetch('/api/auth/me', { credentials: 'include' })
  if (!res.ok) return null
  const { data } = await res.json()
  return data
}

export async function logoutApi() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
}

/**
 * Thin fetch wrapper that mirrors the axios response/error shape used
 * throughout the app, so callers need no changes.
 *
 * Success → returns { data: <parsed JSON> }   (matches axios res.data)
 * Failure → throws Error with .response = { status, data }  (matches axios err.response)
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed with status ${res.status}`)
    err.response = { status: res.status, data }
    throw err
  }

  return { data }
}

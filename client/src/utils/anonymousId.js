const STORAGE_KEY = 'litl_anonymous_id'

/**
 * Returns a stable anonymous identifier for this browser.
 * Generated once with crypto.randomUUID() and persisted in localStorage.
 * Survives page reloads and browser restarts; cleared only if the user
 * manually wipes localStorage or switches browsers/devices.
 */
export function getAnonymousId() {
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

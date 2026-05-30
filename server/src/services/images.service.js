// In-memory cache: key → { url: string|null, cachedAt: number }
const cache = new Map()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function cacheGet(key) {
  const entry = cache.get(key)
  if (!entry) return undefined
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    cache.delete(key)
    return undefined
  }
  return entry.url
}

function cacheSet(key, url) {
  cache.set(key, { url, cachedAt: Date.now() })
}

/**
 * Fetch the best landscape photo URL for a city from the Pexels API.
 * Returns a string URL on success, or null when no photo is found.
 * Results are cached for 24 hours to protect the free-tier rate limit.
 */
async function fetchDestinationImage(city, country) {
  if (!city) return null

  const key = `${city.toLowerCase()}|${(country || '').toLowerCase()}`

  const cached = cacheGet(key)
  if (cached !== undefined) {
    console.log(`[LITL:images] cache hit  "${city}" → ${cached ? cached.slice(0, 70) + '…' : 'null (no image)'}`)
    return cached
  }

  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) {
    console.error('[LITL:images] ❌ PEXELS_API_KEY is not set in server/.env — add it and restart the server')
    cacheSet(key, null)
    return null
  }
  console.log(`[LITL:images] API key present (${apiKey.slice(0, 6)}…)`)

  const query = country ? `${city} ${country}` : city
  const searchUrl =
    `https://api.pexels.com/v1/search` +
    `?query=${encodeURIComponent(query)}` +
    `&per_page=3` +
    `&orientation=landscape`

  console.log(`[LITL:images] → Pexels query: "${query}"`)

  try {
    const res = await fetch(searchUrl, {
      headers: { Authorization: apiKey },
    })

    console.log(`[LITL:images] ← Pexels status: ${res.status}`)

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error(`[LITL:images] ❌ Pexels error ${res.status} for "${query}"`, body.slice(0, 200))
      cacheSet(key, null)
      return null
    }

    const data = await res.json()
    const photo = data.photos?.[0]
    const url =
      photo?.src?.large2x ||
      photo?.src?.large   ||
      photo?.src?.original ||
      null

    if (url) {
      console.log(`[LITL:images] ✓ resolved URL for "${city}": ${url.slice(0, 70)}…`)
    } else {
      console.warn(`[LITL:images] ⚠ Pexels returned 0 photos for "${query}"`)
    }

    cacheSet(key, url)
    return url
  } catch (err) {
    console.error('[LITL:images] ❌ Pexels fetch threw:', err.message)
    cacheSet(key, null)
    return null
  }
}

/** Exposed only for testing / health checks */
function getCacheSize() {
  return cache.size
}

module.exports = { fetchDestinationImage, getCacheSize }

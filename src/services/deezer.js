const API_BASE = import.meta.env.VITE_DEEZER_BASE || '/deezer'

export class DeezerApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'DeezerApiError'
    this.status = status
  }
}

function buildUrl(path, params = {}) {
  const query = new URLSearchParams(params).toString()
  const base = API_BASE.startsWith('http')
    ? API_BASE
    : `${window.location.origin}${API_BASE}`
  return query ? `${base}${path}?${query}` : `${base}${path}`
}

async function request(path, params) {
  let response
  try {
    response = await fetch(buildUrl(path, params))
  } catch {
    throw new DeezerApiError(
      'Network error: unable to reach the Deezer API.',
    )
  }

  if (!response.ok) {
    throw new DeezerApiError(
      `Deezer API responded with ${response.status}.`,
      response.status,
    )
  }

  const data = await response.json()

  if (data?.error) {
    throw new DeezerApiError(data.error.message, data.error.code)
  }

  return data
}

/**
 * Search across tracks, albums and artists.
 * https://api.deezer.com/search?q=
 */
export function search(query, { limit = 25 } = {}) {
  return request('/search', { q: query, limit })
}

/** Scoped searches used by the search page tabs. */
export function searchTracks(query, { limit = 30 } = {}) {
  return request('/search/track', { q: query, limit })
}

export function searchAlbums(query, { limit = 30 } = {}) {
  return request('/search/album', { q: query, limit })
}

export function searchArtists(query, { limit = 30 } = {}) {
  return request('/search/artist', { q: query, limit })
}

/** Global top 100 tracks, albums and artists. */
export function getChart() {
  return request('/chart')
}

/** Flat list of all Deezer genres. */
export function getGenres() {
  return request('/genre')
}

export function getGenre(id) {
  return request(`/genre/${id}`)
}

/** Most popular artists of a genre. */
export function getGenreArtists(id, { limit = 24 } = {}) {
  return request(`/genre/${id}/artists`, { limit })
}

export function getArtist(id) {
  return request(`/artist/${id}`)
}

export function getArtistTopTracks(id, { limit = 20 } = {}) {
  return request(`/artist/${id}/top`, { limit })
}

export function getArtistAlbums(id, { limit = 24 } = {}) {
  return request(`/artist/${id}/albums`, { limit })
}

/** Album payload includes its full `tracks.data` tracklist. */
export function getAlbum(id) {
  return request(`/album/${id}`)
}

export function getTrack(id) {
  return request(`/track/${id}`)
}

/** Cover art helper that falls back gracefully. */
export function coverUrl(item, size = 'cover') {
  return item?.[size] || item?.cover_big || item?.picture_xl || ''
}

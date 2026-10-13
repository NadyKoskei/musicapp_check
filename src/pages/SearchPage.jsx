import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  searchAlbums,
  searchArtists,
  searchTracks,
} from '../services/deezer'
import { useApi } from '../hooks/useApi'
import { useDebounce } from '../hooks/useDebounce'
import { ErrorMessage, Loader, SectionHeader } from '../components/Feedback'
import { TrackList } from '../components/TrackList'
import { AlbumCard, ArtistCard, CardGrid } from '../components/MediaCards'

const TABS = [
  { id: 'tracks', label: 'Tracks' },
  { id: 'albums', label: 'Albums' },
  { id: 'artists', label: 'Artists' },
]

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawQuery = searchParams.get('q') ?? ''
  const tab = searchParams.get('tab') ?? 'tracks'
  const query = useDebounce(rawQuery, 400)

  const fetcher = useCallback(() => {
    if (!query.trim()) return Promise.resolve(null)
    return Promise.all([
      searchTracks(query),
      searchAlbums(query),
      searchArtists(query),
    ])
  }, [query])

  const { data, loading, error, reload } = useApi(fetcher, [query, tab])

  const results = data
    ? { tracks: data[0], albums: data[1], artists: data[2] }
    : null

  function selectTab(tabId) {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tabId)
    setSearchParams(params)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        title={rawQuery ? `Results for “${rawQuery}”` : 'Search'}
        subtitle={
          rawQuery
            ? 'Everything Deezer knows about your query'
            : 'Type in the search bar above to find tracks, albums and artists'
        }
      />

      {!rawQuery.trim() && (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-gray-400">
          <p className="text-4xl">🎧</p>
          <p className="mt-3 text-sm">
            Search for an artist like “Daft Punk”, an album like “Random Access
            Memories”, or a track like “Instant Crush”.
          </p>
        </div>
      )}

      {rawQuery.trim() && (
        <>
          <div className="mb-6 flex gap-2">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => selectTab(id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  tab === id
                    ? 'bg-fuchsia-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading && <Loader label="Searching Deezer…" />}
          {error && <ErrorMessage error={error} onRetry={reload} />}

          {!loading && !error && results && (
            <>
              {tab === 'tracks' &&
                (results.tracks.data.length ? (
                  <TrackList tracks={results.tracks.data} />
                ) : (
                  <p className="text-gray-400">No tracks found.</p>
                ))}

              {tab === 'albums' &&
                (results.albums.data.length ? (
                  <CardGrid columns={6}>
                    {results.albums.data.map((album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </CardGrid>
                ) : (
                  <p className="text-gray-400">No albums found.</p>
                ))}

              {tab === 'artists' &&
                (results.artists.data.length ? (
                  <CardGrid columns={6}>
                    {results.artists.data.map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </CardGrid>
                ) : (
                  <p className="text-gray-400">No artists found.</p>
                ))}
            </>
          )}
        </>
      )}
    </div>
  )
}

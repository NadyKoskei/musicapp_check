import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getArtist,
  getArtistAlbums,
  getArtistTopTracks,
} from '../services/deezer'
import { useApi } from '../hooks/useApi'
import { ErrorMessage, Loader, SectionHeader } from '../components/Feedback'
import { TrackList, PlayAllButton } from '../components/TrackList'
import { AlbumCard, CardGrid } from '../components/MediaCards'

const compactNumber = new Intl.NumberFormat('en', { notation: 'compact' })

export function ArtistPage() {
  const { id } = useParams()

  const fetcher = useCallback(
    () =>
      Promise.all([
        getArtist(id),
        getArtistTopTracks(id, { limit: 20 }),
        getArtistAlbums(id, { limit: 30 }),
      ]),
    [id],
  )
  const { data, loading, error, reload } = useApi(fetcher, [id])

  if (loading) return <Loader label="Loading artist…" />
  if (error) return <ErrorMessage error={error} onRetry={reload} />

  const [artist, top, albums] = data
  const tracks = top.data ?? []

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        <img
          src={artist.picture_xl ?? artist.picture_big ?? ''}
          alt={artist.name}
          className="h-40 w-40 rounded-full object-cover shadow-2xl sm:h-52 sm:w-52"
        />
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">
            Artist
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {artist.name}
          </h1>
          <p className="mt-3 text-sm text-gray-400">
            {compactNumber.format(artist.nb_fan ?? 0)} fans ·{' '}
            {albums.total ?? albums.data?.length ?? 0} albums
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <PlayAllButton tracks={tracks} />
            {artist.link && (
              <a
                href={artist.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Open on Deezer
              </a>
            )}
          </div>
        </div>
      </header>

      <section className="mb-12">
        <SectionHeader title="Popular tracks" subtitle="Most played on Deezer" />
        {tracks.length ? (
          <TrackList tracks={tracks} />
        ) : (
          <p className="text-gray-400">No tracks available.</p>
        )}
      </section>

      <section className="mb-12">
        <SectionHeader title="Albums" />
        <CardGrid columns={6}>
          {albums.data?.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </CardGrid>
      </section>
    </div>
  )
}

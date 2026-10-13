import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAlbum } from '../services/deezer'
import { useApi } from '../hooks/useApi'
import { ErrorMessage, Loader, SectionHeader } from '../components/Feedback'
import { TrackList, PlayAllButton } from '../components/TrackList'

export function AlbumPage() {
  const { id } = useParams()

  const fetcher = useCallback(() => getAlbum(id), [id])
  const { data: album, loading, error, reload } = useApi(fetcher, [id])

  if (loading) return <Loader label="Loading album…" />
  if (error) return <ErrorMessage error={error} onRetry={reload} />

  const tracks = album.tracks?.data ?? []
  const releaseYear = album.release_date?.slice(0, 4)
  const totalMinutes = Math.round((album.duration ?? 0) / 60)

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        <img
          src={album.cover_xl ?? album.cover_big ?? ''}
          alt={`${album.title} cover`}
          className="h-48 w-48 rounded-2xl object-cover shadow-2xl sm:h-56 sm:w-56"
        />
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">
            Album
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {album.title}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {album.artist?.id ? (
              <Link
                to={`/artist/${album.artist.id}`}
                className="font-medium text-white transition hover:text-fuchsia-300"
              >
                {album.artist.name}
              </Link>
            ) : (
              album.artist?.name
            )}
            {releaseYear && ` · ${releaseYear}`}
            {album.nb_tracks ? ` · ${album.nb_tracks} tracks` : ''}
            {totalMinutes ? ` · ${totalMinutes} min` : ''}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <PlayAllButton tracks={tracks} />
            {album.link && (
              <a
                href={album.link}
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

      <section>
        <SectionHeader title="Tracklist" subtitle={`${tracks.length} tracks`} />
        {tracks.length ? (
          <TrackList tracks={tracks} />
        ) : (
          <p className="text-gray-400">This album has no tracks.</p>
        )}
      </section>
    </div>
  )
}

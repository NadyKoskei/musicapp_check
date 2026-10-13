import { Link } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'
import { useFavorites } from '../context/FavoritesContext'
import { HeartIcon, PauseIcon, PlayIcon } from './icons'

function formatDuration(seconds) {
  if (!seconds) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

export function FavoriteButton({ track, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(track.id)
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        toggleFavorite(track)
      }}
      aria-label={active ? `Remove ${track.title} from favorites` : `Add ${track.title} to favorites`}
      aria-pressed={active}
      className={`transition hover:scale-110 ${active ? 'text-fuchsia-500' : 'text-gray-500 hover:text-white'} ${className}`}
    >
      <HeartIcon filled={active} className="h-5 w-5" />
    </button>
  )
}

export function PlayAllButton({ tracks, className = '' }) {
  const { playQueue } = usePlayer()
  if (!tracks?.length) return null
  return (
    <button
      type="button"
      onClick={() => playQueue(tracks, 0)}
      className={`flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-105 ${className}`}
    >
      <PlayIcon className="h-4 w-4" />
      Play all
    </button>
  )
}

export function TrackList({ tracks, queue, variant = 'default' }) {
  const { currentTrack, togglePlay, playQueue } = usePlayer()
  const source = queue ?? tracks
  const compact = variant === 'compact'

  return (
    <ul className="flex flex-col gap-1">
      {tracks.map((track, index) => {
        const isCurrent = currentTrack?.id === track.id
        return (
          <li
            key={`${track.id}-${index}`}
            className={`group grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-xl px-2 py-2 transition sm:grid-cols-[2rem_1fr_1fr_auto] ${
              isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <div className="relative grid h-8 w-8 place-items-center">
              <span
                className={`text-sm tabular-nums text-gray-500 transition group-hover:opacity-0 ${
                  isCurrent ? 'text-fuchsia-400' : ''
                }`}
              >
                {isCurrent ? (
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </span>
              {!isCurrent && (
                <button
                  type="button"
                  onClick={() => playQueue(source, index)}
                  aria-label={`Play ${track.title}`}
                  className="absolute inset-0 grid place-items-center rounded-full text-white opacity-0 transition group-hover:opacity-100"
                >
                  <PlayIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => (isCurrent ? togglePlay() : playQueue(source, index))}
              className="flex min-w-0 items-center gap-3 text-left"
            >
              {!compact && (
                <img
                  src={track.album?.cover_small ?? ''}
                  alt=""
                  loading="lazy"
                  className="hidden h-10 w-10 shrink-0 rounded-md object-cover sm:block"
                />
              )}
              <span className="min-w-0">
                <span
                  className={`block truncate text-sm font-medium ${
                    isCurrent ? 'text-fuchsia-300' : 'text-white'
                  }`}
                >
                  {track.title}
                </span>
                <span className="block truncate text-xs text-gray-400">
                  {track.artist?.id ? (
                    <Link
                      to={`/artist/${track.artist.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="transition hover:text-fuchsia-300 hover:underline"
                    >
                      {track.artist.name}
                    </Link>
                  ) : (
                    track.artist?.name
                  )}
                </span>
              </span>
            </button>

            <div className="hidden min-w-0 px-2 sm:block">
              {track.album?.id ? (
                <Link
                  to={`/album/${track.album.id}`}
                  onClick={(event) => event.stopPropagation()}
                  className="truncate text-xs text-gray-500 transition hover:text-fuchsia-300"
                >
                  {track.album.title}
                </Link>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <FavoriteButton track={track} />
              <span className="w-10 text-right text-xs tabular-nums text-gray-500">
                {formatDuration(track.duration)}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

import { Link } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'
import { PauseIcon, PlayIcon, PrevIcon, NextIcon, VolumeIcon } from './icons'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    prev,
    volume,
    setVolume,
    progress,
    duration,
    seek,
  } = usePlayer()

  if (!currentTrack) return null

  const artist = currentTrack.artist?.name ?? 'Unknown artist'

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#14141f]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        <img
          src={currentTrack.album?.cover_small ?? currentTrack.album?.cover ?? ''}
          alt=""
          className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-14 sm:w-14"
        />
        <div className="min-w-0 flex-1 sm:flex-none sm:w-48">
          <p className="truncate text-sm font-semibold text-white">
            {currentTrack.title}
          </p>
          <Link
            to={`/artist/${currentTrack.artist.id}`}
            className="truncate text-xs text-gray-400 transition hover:text-fuchsia-300"
          >
            {artist}
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous track"
              className="text-gray-400 transition hover:text-white"
            >
              <PrevIcon />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition hover:scale-105 hover:bg-fuchsia-400"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next track"
              className="text-gray-400 transition hover:text-white"
            >
              <NextIcon />
            </button>
          </div>

          <div className="flex w-full max-w-md items-center gap-2">
            <span className="w-9 text-right text-[11px] tabular-nums text-gray-500">
              {formatTime(progress)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 30}
              step={0.1}
              value={Math.min(progress, duration || 30)}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label="Seek"
              className="player-range h-1 flex-1"
            />
            <span className="w-9 text-[11px] tabular-nums text-gray-500">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <VolumeIcon className="h-4 w-4 text-gray-400" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label="Volume"
            className="player-range h-1 w-24"
          />
        </div>
      </div>
    </div>
  )
}

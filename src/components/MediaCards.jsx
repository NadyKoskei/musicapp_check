import { Link } from 'react-router-dom'
import { PlayIcon } from './icons'

export function AlbumCard({ album }) {
  return (
    <Link
      to={`/album/${album.id}`}
      className="group rounded-2xl bg-white/5 p-3 transition hover:-translate-y-1 hover:bg-white/10"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <img
          src={album.cover_xl ?? album.cover_big ?? album.cover ?? ''}
          alt={`${album.title} cover`}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        <span className="absolute bottom-2 right-2 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-fuchsia-500 text-white opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
          <PlayIcon className="h-5 w-5" />
        </span>
      </div>
      <h3 className="mt-3 truncate text-sm font-semibold text-white">
        {album.title}
      </h3>
      <p className="truncate text-xs text-gray-400">
        {album.artist?.name ?? 'Various artists'}
      </p>
    </Link>
  )
}

export function ArtistCard({ artist }) {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group rounded-2xl bg-white/5 p-3 text-center transition hover:-translate-y-1 hover:bg-white/10"
    >
      <div className="relative mx-auto aspect-square w-full max-w-[160px] overflow-hidden rounded-full">
        <img
          src={artist.picture_xl ?? artist.picture_big ?? artist.picture ?? ''}
          alt={artist.name}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3 truncate text-sm font-semibold text-white">
        {artist.name}
      </h3>
      <p className="text-xs text-gray-400">Artist</p>
    </Link>
  )
}

export function GenreCard({ genre }) {
  return (
    <Link
      to={`/genre/${genre.id}`}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/40 to-fuchsia-700/40 p-5 transition hover:-translate-y-1 hover:from-purple-600/60 hover:to-fuchsia-700/60"
    >
      <span className="absolute -bottom-4 -right-2 text-6xl font-extrabold text-white/5 transition group-hover:text-white/10">
        ♪
      </span>
      <h3 className="text-base font-bold capitalize text-white">{genre.name}</h3>
      <p className="mt-1 text-xs text-gray-300">Browse artists</p>
    </Link>
  )
}

export function CardGrid({ children, columns = 6 }) {
  const cols = {
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
  }[columns]
  return <div className={`grid gap-4 ${cols}`}>{children}</div>
}

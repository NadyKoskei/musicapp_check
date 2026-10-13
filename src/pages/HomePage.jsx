import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getChart, getGenres } from '../services/deezer'
import { useApi } from '../hooks/useApi'
import { ErrorMessage, Loader, SectionHeader } from '../components/Feedback'
import { TrackList } from '../components/TrackList'
import { AlbumCard, ArtistCard, CardGrid, GenreCard } from '../components/MediaCards'
import { MusicNoteIcon, PlayIcon } from '../components/icons'
import { usePlayer } from '../context/PlayerContext'

function HomeHero({ tracks }) {
  const { playQueue } = usePlayer()
  const featured = tracks?.[0]

  return (
    <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-600/30 via-purple-700/20 to-[#0b0b14] p-6 sm:p-10">
      <span className="absolute -right-6 -top-6 text-white/5">
        <MusicNoteIcon className="h-56 w-56" />
      </span>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">
        Discover music
      </p>
      <h1 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
        Millions of tracks, one search away.
      </h1>
      <p className="mt-4 max-w-lg text-sm text-gray-300 sm:text-base">
        MusicApp is a music discovery app built on the public Deezer API.
        Browse the world charts, explore artists and albums, and play instant
        30-second previews.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!tracks?.length}
          onClick={() => playQueue(tracks, 0)}
          className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:scale-105 hover:bg-fuchsia-400 disabled:opacity-50"
        >
          <PlayIcon className="h-4 w-4" />
          Play the chart
        </button>
        <Link
          to="/search"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Search music
        </Link>
      </div>
      {featured && (
        <p className="mt-5 text-xs text-gray-400">
          Now charting: <span className="text-gray-200">{featured.title}</span> by{' '}
          <span className="text-gray-200">{featured.artist?.name}</span>
        </p>
      )}
    </section>
  )
}

export function HomePage() {
  const fetcher = useCallback(
    () => Promise.all([getChart(), getGenres()]),
    [],
  )
  const { data, loading, error, reload } = useApi(fetcher)

  if (loading) return <Loader label="Loading the charts…" />
  if (error) return <ErrorMessage error={error} onRetry={reload} />

  const [chart, genres] = data

  return (
    <div className="mx-auto max-w-6xl">
      <HomeHero tracks={chart.tracks?.data} />

      <section className="mb-12">
        <SectionHeader
          title="Top tracks right now"
          subtitle="The global Deezer chart, updated in real time"
        />
        <TrackList tracks={chart.tracks?.data?.slice(0, 10) ?? []} />
      </section>

      <section className="mb-12">
        <SectionHeader title="Top artists" subtitle="The most listened to artists worldwide" />
        <CardGrid columns={6}>
          {chart.artists?.data?.slice(0, 12).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </CardGrid>
      </section>

      <section className="mb-12">
        <SectionHeader title="Top albums" subtitle="Fresh releases and classics" />
        <CardGrid columns={6}>
          {chart.albums?.data?.slice(0, 12).map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </CardGrid>
      </section>

      <section className="mb-12">
        <SectionHeader title="Browse genres" subtitle="Find your sound" />
        <CardGrid columns={5}>
          {genres.data?.slice(0, 10).map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </CardGrid>
      </section>
    </div>
  )
}

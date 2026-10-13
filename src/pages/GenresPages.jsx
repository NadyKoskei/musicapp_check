import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getGenre, getGenreArtists, getGenres } from '../services/deezer'
import { useApi } from '../hooks/useApi'
import { ErrorMessage, Loader, SectionHeader } from '../components/Feedback'
import { ArtistCard, CardGrid, GenreCard } from '../components/MediaCards'

export function GenresPage() {
  const fetcher = useCallback(() => getGenres(), [])
  const { data, loading, error, reload } = useApi(fetcher)

  if (loading) return <Loader label="Loading genres…" />
  if (error) return <ErrorMessage error={error} onRetry={reload} />

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        title="Browse genres"
        subtitle="Pick a genre to discover its most popular artists"
      />
      <CardGrid columns={4}>
        {data.data?.map((genre) => (
          <GenreCard key={genre.id} genre={genre} />
        ))}
      </CardGrid>
    </div>
  )
}

export function GenrePage() {
  const { id } = useParams()

  const fetcher = useCallback(
    () => Promise.all([getGenre(id), getGenreArtists(id, { limit: 30 })]),
    [id],
  )
  const { data, loading, error, reload } = useApi(fetcher, [id])

  if (loading) return <Loader label="Loading genre…" />
  if (error) return <ErrorMessage error={error} onRetry={reload} />

  const [genre, artists] = data

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        title={genre.name}
        subtitle={`${artists.total ?? artists.data?.length ?? 0} popular artists`}
      />
      <CardGrid columns={5}>
        {artists.data?.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </CardGrid>
    </div>
  )
}

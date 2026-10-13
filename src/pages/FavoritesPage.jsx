import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { SectionHeader } from '../components/Feedback'
import { PlayAllButton, TrackList } from '../components/TrackList'
import { HeartIcon } from '../components/icons'

export function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        title="Your favorites"
        subtitle={
          favorites.length
            ? `${favorites.length} track${favorites.length > 1 ? 's' : ''} saved in this browser`
            : undefined
        }
        action={
          favorites.length ? (
            <div className="flex items-center gap-3">
              <PlayAllButton tracks={favorites} />
              <button
                type="button"
                onClick={clearFavorites}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Clear all
              </button>
            </div>
          ) : undefined
        }
      />

      {favorites.length ? (
        <TrackList tracks={favorites} />
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/5 text-fuchsia-400">
            <HeartIcon className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-white">
            No favorites yet
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">
            Tap the heart icon on any track to save it here. Your favorites are
            stored in this browser only.
          </p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
          >
            Explore the charts
          </Link>
        </div>
      )}
    </div>
  )
}

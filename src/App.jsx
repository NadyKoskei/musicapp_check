import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { PlayerProvider } from './context/PlayerContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { SearchPage } from './pages/SearchPage'
import { GenrePage, GenresPage } from './pages/GenresPages'
import { ArtistPage } from './pages/ArtistPage'
import { AlbumPage } from './pages/AlbumPage'
import { FavoritesPage } from './pages/FavoritesPage'

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl font-extrabold text-fuchsia-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-sm text-gray-400">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
      >
        Back home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <FavoritesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="genres" element={<GenresPage />} />
              <Route path="genre/:id" element={<GenrePage />} />
              <Route path="artist/:id" element={<ArtistPage />} />
              <Route path="album/:id" element={<AlbumPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </PlayerProvider>
    </BrowserRouter>
  )
}

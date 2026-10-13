import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'musicapp:favorites'

const FavoritesContext = createContext(null)

function readFavorites() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readFavorites)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = useCallback((track) => {
    setFavorites((prev) =>
      prev.some((t) => t.id === track.id)
        ? prev.filter((t) => t.id !== track.id)
        : [...prev, track],
    )
  }, [])

  const removeFavorite = useCallback((trackId) => {
    setFavorites((prev) => prev.filter((t) => t.id !== trackId))
  }, [])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  const isFavorite = useCallback(
    (trackId) => favorites.some((t) => t.id === trackId),
    [favorites],
  )

  const value = useMemo(
    () => ({ favorites, toggleFavorite, removeFavorite, clearFavorites, isFavorite }),
    [favorites, toggleFavorite, removeFavorite, clearFavorites, isFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used inside a FavoritesProvider')
  }
  return context
}

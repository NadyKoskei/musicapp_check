import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SearchIcon } from './icons'

export function SearchBar() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl" role="search">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search artists, tracks, albums…"
        aria-label="Search artists, tracks, albums"
        className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-fuchsia-500/60 focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/30"
      />
    </form>
  )
}

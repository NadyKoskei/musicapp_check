import { Outlet } from 'react-router-dom'
import { MobileNav, Sidebar } from './Sidebar'
import { SearchBar } from './SearchBar'
import { PlayerBar } from './PlayerBar'
import { MusicNoteIcon } from './icons'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[#0b0b14] text-gray-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/5 bg-[#0b0b14]/85 px-4 py-3 backdrop-blur sm:px-8">
          <span className="flex items-center gap-2 md:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white">
              <MusicNoteIcon className="h-4 w-4" />
            </span>
            <span className="font-extrabold tracking-tight">
              Music<span className="text-fuchsia-400">App</span>
            </span>
          </span>
          <div className="flex-1">
            <SearchBar />
          </div>
        </header>

        <main className="flex-1 px-4 pb-40 pt-6 sm:px-8 md:pb-44">
          <Outlet />
        </main>
      </div>

      <MobileNav />
      <PlayerBar />
    </div>
  )
}

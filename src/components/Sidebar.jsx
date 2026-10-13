import { NavLink } from 'react-router-dom'
import {
  GridIcon,
  HeartIcon,
  HomeIcon,
  MusicNoteIcon,
  SearchIcon,
} from './icons'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/search', label: 'Search', icon: SearchIcon },
  { to: '/genres', label: 'Genres', icon: GridIcon },
  { to: '/favorites', label: 'Favorites', icon: HeartIcon },
]

function navClass({ isActive }) {
  return [
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
    isActive
      ? 'bg-white/10 text-white'
      : 'text-gray-400 hover:bg-white/5 hover:text-white',
  ].join(' ')
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r border-white/5 bg-[#101019] px-4 py-6 md:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white">
          <MusicNoteIcon className="h-5 w-5" />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-white">
          Music<span className="text-fuchsia-400">App</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navClass}>
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl border border-white/5 bg-white/5 p-4 text-xs leading-relaxed text-gray-400">
        <p className="font-semibold text-gray-200">Powered by Deezer</p>
        <p className="mt-1">
          Search, chart, artist, album and genre data from the public Deezer
          API. Tracks play as 30-second previews.
        </p>
      </div>
    </aside>
  )
}

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-20 z-30 flex justify-around border-t border-white/5 bg-[#101019]/95 py-2 backdrop-blur md:hidden">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            [
              'flex flex-col items-center gap-1 rounded-lg px-3 py-1 text-[11px] transition',
              isActive ? 'text-fuchsia-400' : 'text-gray-500 hover:text-gray-300',
            ].join(' ')
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

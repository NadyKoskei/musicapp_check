# MusicApp — Music Discovery with the Deezer API

A single-page music discovery web app built with **React + Vite + Tailwind CSS**
that uses the public [Deezer API](https://developers.deezer.com/api) to browse
the world charts, search for artists, albums and tracks, explore genres, and
play 30-second audio previews in a persistent player bar.

## Features

- **Home** — hero banner plus live global charts: top tracks, top artists, top
  albums and a genre browser.
- **Search** — debounced search across tracks, albums and artists with tabbed
  results (`/search?q=…&tab=tracks|albums|artists`).
- **Artist pages** — bio header, fan count, popular tracks and discography.
- **Album pages** — cover metadata and full tracklist.
- **Genre pages** — popular artists per genre.
- **Persistent player** — a shared `<audio>` element with play/pause,
  previous/next, seek bar, volume control, queue handling and auto-advance
  when a preview ends.
- **Favorites** — heart any track; favorites persist in `localStorage`.
- **Responsive dark UI** — desktop sidebar and mobile bottom navigation.
- **Error and loading states** for every async view.

## Tech stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| UI             | React 19 (function components, hooks)             |
| Build tool     | Vite 7                                            |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite`)             |
| Routing        | React Router v7                                    |
| State          | React Context (`PlayerProvider`, `FavoritesProvider`) |
| Data           | Public Deezer REST API via `fetch`                 |
| Linting        | ESLint 9 flat config + React Compiler rules       |

## Getting started

### Prerequisites

- Node.js 18+ (tested with Node 24) and npm.

### Install and run

```bash
npm install
npm run dev
```

Open http://localhost:5173 and start browsing.

### Other scripts

```bash
npm run build     # production build into dist/
npm run preview   # preview the production build locally
npm run lint      # ESLint over the project
```

## Deezer API and the CORS proxy

The app talks to `https://api.deezer.com` through a small API client
(`src/services/deezer.js`). Deezer does **not** send
`Access-Control-Allow-Origin` headers, so a browser cannot call it directly.
The dev setup therefore proxies `/deezer/*` to the Deezer API from the Vite
dev server (see `server.proxy` in `vite.config.js`):

```
GET /deezer/chart            → https://api.deezer.com/chart
GET /deezer/search/track?q=… → https://api.deezer.com/search/track?q=…
```

To call the API from any other origin, point the client at your own proxy by
setting an environment variable before building:

```bash
VITE_DEEZER_BASE=https://your-proxy.example.com/api npm run build
```

`src/services/deezer.js` falls back to `/deezer` when `VITE_DEEZER_BASE` is not
set, which keeps `npm run dev` working out of the box.

### Endpoints used

| Endpoint                        | Used for                        |
| ------------------------------- | ------------------------------- |
| `GET /chart`                    | Home page charts                |
| `GET /search?q=`                | Search results                  |
| `GET /search/track`,`/album`,`/artist` | Search page tabs        |
| `GET /genre`, `GET /genre/{id}` | Genre browser                   |
| `GET /genre/{id}/artists`       | Artists per genre               |
| `GET /artist/{id}`              | Artist header                   |
| `GET /artist/{id}/top`          | Popular tracks                  |
| `GET /artist/{id}/albums`       | Discography                     |
| `GET /album/{id}`               | Album metadata + tracklist      |
| `GET /track/{id}`               | Single track lookups            |

## Project structure

```
index.html                     Vite entry HTML
vite.config.js                 Vite + Tailwind + /deezer dev proxy
eslint.config.js               ESLint flat config
src/
  main.jsx                     React root
  App.jsx                      Router + providers
  index.css                    Tailwind import, theme, player styles
  services/deezer.js           Deezer API client
  hooks/
    useApi.js                  Loading/error/reload data hook
    useDebounce.js             Debounced values for search
  context/
    PlayerContext.jsx          Audio playback state + queue
    FavoritesContext.jsx       Favorites persisted to localStorage
  components/
    Layout.jsx                 App shell (sidebar, header, player)
    Sidebar.jsx                Desktop sidebar + mobile nav
    SearchBar.jsx              Header search form
    PlayerBar.jsx              Persistent playback bar
    TrackList.jsx              Track rows, play-all, favorite button
    MediaCards.jsx             Album / artist / genre cards
    Feedback.jsx               Loader, error, section header
    icons.jsx                  Inline SVG icon set
  pages/
    HomePage.jsx               Charts home
    SearchPage.jsx             Search with tabs
    ArtistPage.jsx             Artist detail
    AlbumPage.jsx              Album detail
    GenresPages.jsx            Genre list + genre detail
    FavoritesPage.jsx          Saved tracks
docs/PROJECT_SPEC.md            Short project specification
```

## How playback works

`PlayerProvider` owns a single `Audio` element (created once, stored in a ref)
and the current queue. Calling `playQueue(tracks, startIndex)` from any view
replaces the queue and starts playback; the player bar then reflects the
current track, progress, duration and volume. Tracks are played through the
30-second `preview` URLs returned by Deezer, and an `ended` event advances to
the next queued track.

## Notes and limitations

- Only 30-second previews are playable — full streaming requires a Deezer
  partner subscription and is out of scope.
- Favorites and player state are per-browser (no backend).
- Deezer API usage is subject to the
  [Deezer API terms](https://developers.deezer.com/).

## Possible next steps

- User authentication and server-side favorites.
- Playlist creation and drag-to-reorder queues.
- Keyboard shortcuts and media-session integration.
- Lyrics and related-artist recommendations.

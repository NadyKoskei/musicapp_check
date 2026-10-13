# Project Spec — MusicApp (Deezer API)

**Version:** 1.0 · **Type:** Short project specification · **Stack:** React 19 + Vite 7 + Tailwind CSS v4

## 1. Overview

MusicApp is a single-page web application for discovering music through the
public Deezer API. Users browse global charts, search for tracks, albums and
artists, explore genres and artist discographies, play 30-second previews in a
persistent player, and save favorite tracks locally.

## 2. Goals

- Let users discover music without an account or backend.
- Demonstrate clean React architecture: routing, context-based global state,
  a typed API client layer, reusable components.
- Provide reliable loading/error feedback for all network views.
- Remain responsive on desktop and mobile.

## 3. Target users

- Casual listeners exploring charts and genres.
- Demo/evaluation audiences reviewing a React + public-API integration.

## 4. Scope

### In scope

- Home: top tracks, top artists, top albums, genres (from `GET /chart`, `GET /genre`).
- Search (debounced) across tracks, albums, artists with tabbed results.
- Artist detail: header info, popular tracks, albums.
- Album detail: metadata and tracklist.
- Genre detail: popular artists.
- Persistent player: play/pause, prev/next, seek, volume, queue, auto-advance.
- Favorites persisted in `localStorage`.
- Dev-server proxy for the CORS-restricted Deezer API.

### Out of scope

- Full-length streaming (requires a Deezer partner subscription).
- Accounts, server-side persistence, playlists, social features.
- Offline/PWA support.

## 5. User stories

1. As a visitor, I see the current global chart on the home page so I can hear
   what is popular now.
2. As a visitor, I can search for an artist, album or track and get relevant
   results within a second.
3. As a visitor, I can open an artist, play their top tracks and browse their
   albums, then open an album and play any track.
4. As a visitor, I can like a track and find it later in Favorites.
5. As a visitor, I can pause, skip, seek and change volume without playback
   stopping while I navigate.

## 6. Functional requirements

| ID    | Requirement                                                                 |
| ----- | --------------------------------------------------------------------------- |
| FR-1  | Home renders chart tracks/artists/albums and genres.                         |
| FR-2  | Search runs ~400 ms after typing stops and shows tracks/albums/artists tabs. |
| FR-3  | Artist page shows popular tracks and albums with working links.              |
| FR-4  | Album page lists the full tracklist with playable previews.                  |
| FR-5  | Genre pages list popular artists for the genre.                              |
| FR-6  | Player supports play/pause, prev/next, seek, volume and auto-advance.        |
| FR-7  | Tracks can be favorited/unfavorited; favorites survive reloads.              |
| FR-8  | Every async view shows a loader and a retryable error message on failure.    |

## 7. Data and integrations

- Deezer REST API, client in `src/services/deezer.js`; relative base `/deezer`
  proxied by the Vite dev server (override with `VITE_DEEZER_BASE`).
- Core entities: `Track` (id, title, duration, preview, artist, album),
  `Album` (id, title, cover, release date, tracklist), `Artist` (id, name,
  picture, fan count), `Genre` (id, name).
- Track objects from search, chart, artist-top and album endpoints are stored
  as-is in the player queue and favorites, so any list is playable directly.

## 8. Non-functional requirements

- Accessibility: labelled controls, aria-pressed on favorite buttons, keyboard
  operable forms and range inputs.
- Performance: lazy-loaded images, debounced search, memoized context value.
- Responsiveness: desktop sidebar ≥768px, bottom navigation below.
- Code quality: ESLint flat config (including React Compiler rules) passes
  clean; `npm run build` succeeds.

## 9. Milestones

1. **M1 — Foundation:** tooling, Deezer proxy, API client, routing shell.
2. **M2 — Discovery:** home charts, search, artist/album/genre pages.
3. **M3 — Playback & favorites:** player bar, queue, localStorage favorites.
4. **M4 — Polish:** responsive UI, error/loading states, README + spec.

## 10. Acceptance criteria

- `npm run lint` and `npm run build` pass.
- Home, search, artist, album, genre and favorites routes render live Deezer
  data in the browser.
- Playing a track shows the player bar, audio previews play, and favorites
  persist across reloads.

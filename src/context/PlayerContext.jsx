import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  // A single <audio> element is created once per provider mount and shared by
  // the whole app. It lives in a ref and is only touched from effects and
  // event handlers, never during render.
  const audioRef = useRef(null)

  // Declared before the effects below so the element exists when they run.
  useEffect(() => {
    if (!audioRef.current && typeof Audio !== 'undefined') {
      audioRef.current = new Audio()
    }
  }, [])

  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.7)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const currentTrack = queue[currentIndex] ?? null

  // Load the current track into the audio element.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.preview) return
    audio.src = currentTrack.preview
    audio.load()
  }, [audioRef, currentTrack])

  // Reflect play/pause state onto the audio element.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [audioRef, isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [audioRef, volume])

  // Audio element event wiring.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setProgress(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration || 0)
    const onLoadingNewTrack = () => {
      setProgress(0)
      setDuration(0)
    }
    const onEnded = () =>
      setCurrentIndex((i) => (i + 1 < queue.length ? i + 1 : 0))
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('loadstart', onLoadingNewTrack)
    audio.addEventListener('emptied', onLoadingNewTrack)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('loadstart', onLoadingNewTrack)
      audio.removeEventListener('emptied', onLoadingNewTrack)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [audioRef, queue.length])

  /** Replace the queue and start playback at `startIndex`. */
  const playQueue = useCallback((tracks, startIndex = 0) => {
    if (!tracks.length) return
    setQueue(tracks)
    setCurrentIndex(startIndex)
    setIsPlaying(true)
  }, [])

  /** Play a single track immediately, keeping the current queue. */
  const playTrack = useCallback((track) => {
    setQueue((prev) => {
      const index = prev.findIndex((t) => t.id === track.id)
      if (index !== -1) {
        setCurrentIndex(index)
        return prev
      }
      setCurrentIndex(0)
      return [track]
    })
    setIsPlaying(true)
  }, [])

  const togglePlay = useCallback(() => {
    if (!currentTrack) return
    setIsPlaying((playing) => !playing)
  }, [currentTrack])

  const next = useCallback(() => {
    setCurrentIndex((i) => (queue.length ? (i + 1) % queue.length : -1))
  }, [queue.length])

  const prev = useCallback(() => {
    setCurrentIndex((i) =>
      queue.length ? (i - 1 + queue.length) % queue.length : -1,
    )
  }, [queue.length])

  const seek = useCallback(
    (time) => {
      const audio = audioRef.current
      if (audio) audio.currentTime = time
      setProgress(time)
    },
    [audioRef],
  )

  const setVolume = useCallback((value) => {
    setVolumeState(Math.min(1, Math.max(0, value)))
  }, [])

  const value = useMemo(
    () => ({
      queue,
      currentTrack,
      currentIndex,
      isPlaying,
      volume,
      progress,
      duration,
      playQueue,
      playTrack,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
    }),
    [
      queue,
      currentTrack,
      currentIndex,
      isPlaying,
      volume,
      progress,
      duration,
      playQueue,
      playTrack,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
    ],
  )

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used inside a PlayerProvider')
  }
  return context
}

import { useCallback, useEffect, useState } from 'react'

/**
 * Minimal data-fetching hook: runs `fetcher` whenever `deps` change and
 * tracks loading/error state. `fetter` must be stable (wrap in useCallback).
 */
export function useApi(fetcher, deps = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  })

  const load = useCallback(() => {
    let cancelled = false
    setState({ data: null, loading: true, error: null })
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, loading: false, error })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    const cancel = load()
    return cancel
  }, [load])

  return { ...state, reload: load }
}

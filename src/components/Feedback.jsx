export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-fuchsia-500 border-t-transparent" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center">
      <h3 className="text-lg font-semibold text-red-300">Something went wrong</h3>
      <p className="mt-2 text-sm text-red-200/80">
        {error?.message || 'Unexpected error.'}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/30"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

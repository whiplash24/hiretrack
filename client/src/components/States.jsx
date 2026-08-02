export function LoadingBlock({ label = "Loading" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 border border-rule px-4 py-3 text-ink-dim"
    >
      <span aria-hidden className="inline-block h-2 w-2 animate-pulse bg-accent" />
      <span className="text-xs font-mono uppercase tracking-widest">{label}…</span>
    </div>
  )
}

export function ErrorBlock({ error, onRetry }) {
  const msg = error?.message || String(error || "Something went wrong")
  return (
    <div className="border border-rule bg-bg-elev p-6" role="alert">
      <div className="eyebrow text-accent">Signal lost</div>
      <p className="mt-2 font-serif text-xl italic text-ink">{msg}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn mt-4">
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="border border-dashed border-rule px-8 py-14 text-center">
      <div className="eyebrow text-ink-mute">Nothing here yet</div>
      <div className="mt-3 font-serif text-3xl italic">{title}</div>
      {body && <p className="mx-auto mt-3 max-w-md text-sm text-ink-dim">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

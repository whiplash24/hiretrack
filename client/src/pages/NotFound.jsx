import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 text-ink">
      <div className="w-full max-w-xl border border-rule bg-bg-elev p-10">
        <div className="eyebrow">Error · 404 · Off the strip</div>
        <div className="mt-6 flex items-baseline gap-4">
          <span className="font-serif text-[128px] leading-none text-accent">4</span>
          <span className="font-serif text-[128px] leading-none">0</span>
          <span className="font-serif text-[128px] leading-none text-accent">4</span>
        </div>
        <h1 className="mt-6 font-serif text-3xl leading-tight">
          This entry is not in the ledger.
        </h1>
        <p className="mt-3 max-w-md text-sm text-ink-dim">
          The URL you followed points at a page that was never printed. Return
          to the notebook and pick up the strip.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/dashboard" className="btn btn-primary">← Return to the strip</Link>
          <Link to="/" className="btn">Landing page</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound

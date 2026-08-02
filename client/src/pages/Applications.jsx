import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  fetchApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../services/applicationService"
import PipelineStrip from "../components/PipelineStrip"
import StatusDot from "../components/StatusDot"
import { LoadingBlock, ErrorBlock, EmptyState } from "../components/States"
import { STATUS_ORDER, STATUS_LABEL, fmtDate } from "../utils/format"

const FILTERS = [
  { key: "ALL", label: "All" },
  ...STATUS_ORDER.map((s) => ({ key: s, label: STATUS_LABEL[s] })),
]

function Applications() {
  const [apps, setApps] = useState(null)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("ALL")
  const [q, setQ] = useState("")
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = () => {
    setError(null)
    fetchApplications()
      .then((d) => setApps(Array.isArray(d) ? d : []))
      .catch(setError)
  }

  useEffect(load, [])

  const handleStatusChange = async (id, status) => {
    setApps((cur) => cur.map((a) => (a._id === id ? { ...a, status } : a)))
    try {
      await updateApplicationStatus(id, status)
    } catch (e) {
      setError(e)
      load()
    }
  }

  const handleDelete = async (id) => {
    const prev = apps
    setApps((cur) => cur.filter((a) => a._id !== id))
    setPendingDelete(null)
    try {
      await deleteApplication(id)
    } catch (e) {
      setApps(prev)
      setError(e)
    }
  }

  const filtered = useMemo(() => {
    if (!apps) return []
    const needle = q.trim().toLowerCase()
    return apps.filter((a) => {
      if (filter !== "ALL" && a.status !== filter) return false
      if (!needle) return true
      return (
        a.company?.toLowerCase().includes(needle) ||
        a.role?.toLowerCase().includes(needle) ||
        a.domain?.toLowerCase().includes(needle)
      )
    })
  }, [apps, filter, q])

  const counts = useMemo(() => {
    const map = { ALL: apps?.length ?? 0 }
    STATUS_ORDER.forEach((s) => (map[s] = 0))
    ;(apps || []).forEach((a) => {
      if (map[a.status] != null) map[a.status] += 1
    })
    return map
  }, [apps])

  return (
    <div className="px-6 pb-16 pt-8 md:px-10 md:pt-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 rule-b border-b border-rule pb-6">
        <div>
          <div className="eyebrow">Section · 02 · Applications</div>
          <h1 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">
            The <em className="text-accent">index</em>.
          </h1>
        </div>
        <Link to="/add-application" className="btn btn-primary">
          + Log entry
        </Link>
      </div>

      {/* Compact strip so the page keeps its identity */}
      {apps && apps.length > 0 && (
        <PipelineStrip apps={apps} height={140} compact className="mb-10" />
      )}

      {/* Filter rail */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {FILTERS.map((f) => {
            const active = filter === f.key
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={[
                  "flex items-baseline gap-2 border-b py-1 text-sm transition-colors",
                  active
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-dim hover:text-ink",
                ].join(" ")}
              >
                <span className="font-serif">{f.label}</span>
                <span className="num text-2xs text-ink-mute">
                  {counts[f.key] ?? 0}
                </span>
              </button>
            )
          })}
        </div>
        <label className="flex items-center gap-2 border-b border-rule pb-1">
          <span className="eyebrow">Find</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="company or role"
            className="bg-transparent text-sm outline-none placeholder:text-ink-mute"
          />
        </label>
      </div>

      {error && <ErrorBlock error={error} onRetry={load} />}

      {!apps && !error && <LoadingBlock label="Fetching entries" />}

      {apps && filtered.length === 0 && !error && (
        <EmptyState
          title={apps.length === 0 ? "No entries yet." : "Nothing matches this filter."}
          body={apps.length === 0 ? "The index begins with the first log." : "Try clearing the filter or search."}
          action={
            apps.length === 0 ? (
              <Link to="/add-application" className="btn btn-primary">
                Log the first entry
              </Link>
            ) : (
              <button onClick={() => { setFilter("ALL"); setQ("") }} className="btn">
                Clear filters
              </button>
            )
          }
        />
      )}

      {apps && filtered.length > 0 && (
        <div className="rule border border-rule">
          {/* Header row */}
          <div className="grid grid-cols-[40px_2fr_1fr_140px_120px_60px] items-center gap-4 border-b border-rule px-4 py-3">
            <span className="eyebrow">#</span>
            <span className="eyebrow">Company · Role</span>
            <span className="eyebrow">Domain</span>
            <span className="eyebrow">Status</span>
            <span className="eyebrow">Applied</span>
            <span className="eyebrow"></span>
          </div>
          <ul>
            {filtered.map((a, i) => (
              <li
                key={a._id}
                className="grid grid-cols-[40px_2fr_1fr_140px_120px_60px] items-center gap-4 border-b border-rule px-4 py-3 last:border-b-0 hover:bg-bg-elev"
              >
                <span className="num text-2xs text-ink-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link to={`/applications/${a._id}`} className="min-w-0">
                  <div className="truncate font-serif text-lg text-ink">
                    {a.company}
                  </div>
                  <div className="truncate text-sm text-ink-dim">{a.role}</div>
                </Link>
                <span className="truncate text-sm text-ink-dim">
                  {a.domain || "—"}
                </span>
                <select
                  aria-label={`Status for ${a.company}`}
                  value={a.status}
                  onChange={(e) => handleStatusChange(a._id, e.target.value)}
                  className="border border-rule bg-transparent px-2 py-1 text-2xs font-mono uppercase tracking-widest text-ink"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <span className="num text-2xs uppercase tracking-widest text-ink-mute">
                  {fmtDate(a.appliedDate || a.createdAt)}
                </span>
                <div className="text-right">
                  {pendingDelete === a._id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="text-2xs font-mono uppercase tracking-widest text-accent hover:underline"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setPendingDelete(null)}
                        className="text-2xs font-mono uppercase tracking-widest text-ink-mute hover:text-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPendingDelete(a._id)}
                      className="text-2xs font-mono uppercase tracking-widest text-ink-mute hover:text-ink"
                      aria-label={`Delete application for ${a.company}`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Applications

import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  fetchApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../services/applicationService"
import { LoadingBlock, ErrorBlock } from "../components/States"
import StatusDot from "../components/StatusDot"
import { STATUS_ORDER, STATUS_LABEL, STATUS_COLOR, fmtDate } from "../utils/format"

function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [app, setApp] = useState(null)
  const [error, setError] = useState(null)
  const [confirming, setConfirming] = useState(false)

  const load = () => {
    setError(null)
    fetchApplications()
      .then((list) => {
        const match = (list || []).find((a) => a._id === id)
        if (!match) setError(new Error("This entry no longer exists in the ledger."))
        else setApp(match)
      })
      .catch(setError)
  }

  useEffect(load, [id])

  const setStatus = async (s) => {
    setApp((cur) => ({ ...cur, status: s }))
    try {
      await updateApplicationStatus(id, s)
    } catch (e) {
      setError(e)
      load()
    }
  }

  const remove = async () => {
    try {
      await deleteApplication(id)
      navigate("/applications")
    } catch (e) {
      setError(e)
    }
  }

  if (error) {
    return (
      <div className="px-6 pt-10">
        <ErrorBlock error={error} onRetry={load} />
        <div className="mt-6">
          <Link to="/applications" className="btn">← Back to index</Link>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="px-6 pt-10">
        <LoadingBlock label="Retrieving entry" />
      </div>
    )
  }

  const currentIdx = STATUS_ORDER.indexOf(app.status)

  return (
    <div className="px-6 pb-16 pt-8 md:px-10 md:pt-12">
      {/* breadcrumb */}
      <div className="mb-6 flex items-center gap-3 text-2xs font-mono uppercase tracking-widest text-ink-mute">
        <Link to="/applications" className="hover:text-ink">Applications</Link>
        <span>·</span>
        <span className="text-ink-dim">Entry</span>
      </div>

      {/* Masthead */}
      <header className="rule-b border-b border-rule pb-8">
        <div className="eyebrow" style={{ color: STATUS_COLOR[app.status] }}>
          {STATUS_LABEL[app.status]} · {app.type === "INTERNSHIP" ? "Internship" : "Full-time"}
        </div>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] md:text-5xl">
          {app.company}
        </h1>
        <p className="mt-2 font-serif text-2xl italic text-ink-dim">
          {app.role}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-2xs font-mono uppercase tracking-widest text-ink-mute">
          <span>Applied {fmtDate(app.appliedDate)}</span>
          {app.domain && <span>Domain · {app.domain}</span>}
          {app.stipendOrSalary && <span>Comp · {app.stipendOrSalary}</span>}
        </div>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: Stage timeline (page-scoped signature echo) */}
        <section>
          <div className="mb-4">
            <div className="eyebrow">Stage</div>
            <h2 className="mt-1 font-serif text-2xl">Move it along</h2>
          </div>

          <ol className="border border-rule">
            {STATUS_ORDER.map((s, i) => {
              const reached = STATUS_ORDER.indexOf(s) <= currentIdx && app.status !== "REJECTED"
              const isCurrent = s === app.status
              const isRejected = s === "REJECTED"
              return (
                <li
                  key={s}
                  className={[
                    "flex items-center gap-4 border-b border-rule px-4 py-3 last:border-b-0",
                    isCurrent ? "bg-bg-elev" : "",
                  ].join(" ")}
                >
                  <span className="w-8 num text-2xs text-ink-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="inline-block h-[7px] w-[7px] rounded-full"
                    style={{
                      background: isCurrent
                        ? STATUS_COLOR[s]
                        : reached
                        ? STATUS_COLOR[s]
                        : "transparent",
                      border: `1px solid ${STATUS_COLOR[s]}`,
                    }}
                  />
                  <span className={`flex-1 font-serif text-lg ${isCurrent ? "text-ink" : "text-ink-dim"}`}>
                    {STATUS_LABEL[s]}
                    {isRejected && <span className="ml-2 text-2xs font-mono uppercase tracking-widest text-ink-mute">(closed)</span>}
                  </span>
                  {!isCurrent && (
                    <button
                      onClick={() => setStatus(s)}
                      className="text-2xs font-mono uppercase tracking-widest text-ink-dim hover:text-accent"
                    >
                      Set →
                    </button>
                  )}
                  {isCurrent && (
                    <span className="text-2xs font-mono uppercase tracking-widest" style={{ color: STATUS_COLOR[s] }}>
                      current
                    </span>
                  )}
                </li>
              )
            })}
          </ol>

          {/* Rounds */}
          {Array.isArray(app.rounds) && app.rounds.length > 0 && (
            <div className="mt-10">
              <div className="mb-4">
                <div className="eyebrow">Rounds</div>
                <h2 className="mt-1 font-serif text-2xl">Ledger</h2>
              </div>
              <ul className="border border-rule">
                {app.rounds.map((r, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 border-b border-rule px-4 py-3 last:border-b-0">
                    <div>
                      <div className="font-serif text-lg">{r.name || `Round ${i + 1}`}</div>
                      {r.notes && <div className="text-sm text-ink-dim">{r.notes}</div>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="num text-2xs uppercase tracking-widest text-ink-mute">
                        {fmtDate(r.date)}
                      </span>
                      <span className="text-2xs font-mono uppercase tracking-widest text-ink-dim">
                        {r.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Right rail */}
        <aside className="space-y-8">
          <div className="border border-rule bg-bg-elev p-5">
            <div className="eyebrow">Notes</div>
            <p className="mt-3 whitespace-pre-wrap font-serif text-lg leading-snug text-ink">
              {app.notes || <span className="italic text-ink-dim">No notes filed.</span>}
            </p>
          </div>

          <div className="border border-rule">
            <div className="border-b border-rule px-4 py-3">
              <div className="eyebrow">Meta</div>
            </div>
            <dl className="divide-y divide-rule text-sm">
              <MetaRow label="Type" value={app.type === "INTERNSHIP" ? "Internship" : "Full-time"} />
              <MetaRow label="Domain" value={app.domain || "—"} />
              <MetaRow label="Compensation" value={app.stipendOrSalary || "—"} />
              <MetaRow label="Applied" value={fmtDate(app.appliedDate)} />
              <MetaRow label="Updated" value={fmtDate(app.updatedAt)} />
            </dl>
          </div>

          <div className="border border-rule p-5">
            <div className="eyebrow text-ink-mute">Danger</div>
            {confirming ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-ink">
                  Remove this entry from the ledger? The strip forgets it.
                </p>
                <div className="flex gap-2">
                  <button onClick={remove} className="btn btn-danger flex-1">Yes, remove</button>
                  <button onClick={() => setConfirming(false)} className="btn flex-1">Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="btn btn-danger mt-3 w-full"
              >
                Remove entry
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function MetaRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2">
      <dt className="eyebrow">{label}</dt>
      <dd className="text-right text-sm text-ink">{value}</dd>
    </div>
  )
}

export default JobDetail

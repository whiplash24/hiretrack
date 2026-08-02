import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { fetchDashboardStats } from "../services/analyticsService"
import { fetchApplications } from "../services/applicationService"
import PipelineStrip from "../components/PipelineStrip"
import StatusDot from "../components/StatusDot"
import { LoadingBlock, ErrorBlock, EmptyState } from "../components/States"
import { STATUS_ORDER, STATUS_LABEL, fmtRelative } from "../utils/format"

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [apps, setApps] = useState(null)
  const [error, setError] = useState(null)

  const load = () => {
    setError(null)
    Promise.all([fetchDashboardStats(), fetchApplications()])
      .then(([s, a]) => {
        setStats(s)
        setApps(Array.isArray(a) ? a : [])
      })
      .catch((e) => setError(e))
  }

  useEffect(load, [])

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]))
    ;(apps || []).forEach((a) => {
      if (map[a.status] != null) map[a.status] += 1
    })
    return map
  }, [apps])

  const recent = useMemo(() => {
    if (!apps) return []
    return [...apps]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.appliedDate || 0) -
          new Date(a.updatedAt || a.appliedDate || 0)
      )
      .slice(0, 6)
  }, [apps])

  if (error) {
    return (
      <div className="px-6 pt-10">
        <ErrorBlock error={error} onRetry={load} />
      </div>
    )
  }

  if (!stats || !apps) {
    return (
      <div className="px-6 pt-10">
        <LoadingBlock label="Composing the strip" />
      </div>
    )
  }

  const total = stats.total ?? apps.length
  const active = stats.active ?? (byStatus.APPLIED + byStatus.OA + byStatus.INTERVIEW)
  const offers = stats.offers ?? byStatus.OFFER
  const rejected = stats.rejected ?? byStatus.REJECTED

  return (
    <div className="px-6 pb-16 pt-8 md:px-10 md:pt-12">
      {/* Masthead */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 rule-b border-b border-rule pb-6">
        <div>
          <div className="eyebrow">Section · 01 · Dashboard</div>
          <h1 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">
            The <em className="text-accent">strip</em>, at a glance.
          </h1>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="text-2xs font-mono uppercase tracking-widest text-ink-mute">
            issued · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "2-digit" })}
          </span>
          <Link to="/add-application" className="btn btn-primary">
            + Log entry
          </Link>
        </div>
      </div>

      {/* Signature */}
      <PipelineStrip apps={apps} className="mb-10" />

      {/* Stat modules — visually differentiated per data */}
      <div className="mb-10 grid grid-cols-1 gap-px bg-rule md:grid-cols-4">
        <StatBig
          label="In flight"
          value={total}
          caption={`${active} still active`}
        />
        <StatBar
          label="Pipeline"
          buckets={STATUS_ORDER.map((s) => ({
            key: s,
            label: STATUS_LABEL[s],
            value: byStatus[s],
            status: s,
          }))}
        />
        <StatOffer value={offers} total={total} />
        <StatRejection value={rejected} total={total} />
      </div>

      {/* Recent activity + a Callout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <div className="eyebrow">Latest movement</div>
              <h2 className="mt-1 font-serif text-2xl">Recent updates</h2>
            </div>
            <Link to="/applications" className="text-2xs font-mono uppercase tracking-widest text-ink-dim hover:text-accent">
              See all →
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              title="No entries yet."
              body="The strip is a blank staff waiting for its first note."
              action={
                <Link to="/add-application" className="btn btn-primary">
                  Log the first entry
                </Link>
              }
            />
          ) : (
            <ul className="border border-rule">
              {recent.map((a, i) => (
                <li
                  key={a._id}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-bg-elev ${i > 0 ? "border-t border-rule" : ""}`}
                >
                  <Link to={`/applications/${a._id}`} className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xs font-mono tabular-nums text-ink-mute">
                        #{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate font-serif text-lg">{a.company}</span>
                      <span className="truncate text-sm text-ink-dim">· {a.role}</span>
                    </div>
                  </Link>
                  <div className="flex shrink-0 items-center gap-4">
                    <StatusDot status={a.status} />
                    <span className="w-14 text-right text-2xs font-mono uppercase tracking-widest text-ink-mute">
                      {fmtRelative(a.updatedAt || a.appliedDate)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside>
          <div className="mb-4">
            <div className="eyebrow">Editorial</div>
            <h2 className="mt-1 font-serif text-2xl">On the strip</h2>
          </div>
          <div className="border border-rule bg-bg-elev p-6">
            <p className="font-serif text-xl italic leading-snug text-ink">
              “A job search is a{" "}
              <span className="text-accent">long line</span> with a few loud
              inflections. Plot the line. Notice the inflections.”
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-rule pt-4 text-2xs font-mono uppercase tracking-widest text-ink-mute">
              <span>Colophon note</span>
              <span>—the editors</span>
            </div>
          </div>

          <div className="mt-6 border border-rule">
            <div className="border-b border-rule px-4 py-3">
              <div className="eyebrow">Signal legend</div>
            </div>
            <ul className="divide-y divide-rule">
              {STATUS_ORDER.map((s) => (
                <li key={s} className="flex items-center justify-between px-4 py-2">
                  <StatusDot status={s} />
                  <span className="num text-sm text-ink">{byStatus[s]}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

function StatCell({ children, className = "" }) {
  return <div className={`bg-bg p-5 ${className}`}>{children}</div>
}

function StatBig({ label, value, caption }) {
  return (
    <StatCell>
      <div className="eyebrow">{label}</div>
      <div className="mt-3 font-serif text-5xl leading-none text-ink">
        {value}
      </div>
      {caption && <div className="mt-3 text-xs text-ink-dim">{caption}</div>}
    </StatCell>
  )
}

function StatBar({ label, buckets }) {
  const total = buckets.reduce((s, b) => s + b.value, 0) || 1
  return (
    <StatCell>
      <div className="eyebrow">{label}</div>
      <div className="mt-4 flex h-[52px] w-full items-end gap-1">
        {buckets.map((b) => {
          const h = Math.max(4, (b.value / total) * 52)
          return (
            <div
              key={b.key}
              className="flex-1"
              style={{ height: h, background: b.status ? `var(--tw-none, ${STATUS_COLOR_INLINE[b.status]})` : "#8A7A76" }}
              title={`${b.label}: ${b.value}`}
            />
          )
        })}
      </div>
      <div className="mt-3 flex justify-between text-2xs font-mono uppercase tracking-widest text-ink-mute">
        {buckets.map((b) => (
          <span key={b.key}>{b.label[0]}</span>
        ))}
      </div>
    </StatCell>
  )
}

function StatOffer({ value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <StatCell>
      <div className="eyebrow" style={{ color: "#7FA97E" }}>Offers</div>
      <div className="mt-3 flex items-baseline gap-3">
        <span className="font-serif text-5xl leading-none text-ink">{value}</span>
        <span className="num text-sm text-ink-dim">/ {total}</span>
      </div>
      <div className="mt-3 text-xs text-ink-dim">
        {pct}% conversion · celebrate quietly
      </div>
    </StatCell>
  )
}

function StatRejection({ value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <StatCell>
      <div className="eyebrow" style={{ color: "#8A7A76" }}>Rejections</div>
      <div className="mt-3 font-serif text-5xl leading-none text-ink-dim">
        {value}
      </div>
      <div className="mt-3 text-xs text-ink-mute">
        {pct}% of the strip · fuel, not verdict
      </div>
    </StatCell>
  )
}

const STATUS_COLOR_INLINE = {
  APPLIED: "#B8A6A2",
  OA: "#8FB4C7",
  INTERVIEW: "#F2C14E",
  OFFER: "#7FA97E",
  REJECTED: "#8A7A76",
}

export default Dashboard

import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { fetchApplications } from "../services/applicationService"
import PipelineStrip from "../components/PipelineStrip"
import { LoadingBlock, ErrorBlock, EmptyState } from "../components/States"
import { STATUS_ORDER, STATUS_LABEL, STATUS_COLOR } from "../utils/format"

const FUNNEL_ORDER = ["APPLIED", "OA", "INTERVIEW", "OFFER"]

function Analytics() {
  const [apps, setApps] = useState(null)
  const [error, setError] = useState(null)

  const load = () => {
    setError(null)
    fetchApplications()
      .then((d) => setApps(Array.isArray(d) ? d : []))
      .catch(setError)
  }

  useEffect(load, [])

  const stats = useMemo(() => {
    if (!apps) return null
    const total = apps.length
    const byStatus = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]))
    const byType = { INTERNSHIP: 0, FULL_TIME: 0 }
    const byDomain = new Map()
    const byWeek = new Map()
    let earliest = null
    apps.forEach((a) => {
      if (byStatus[a.status] != null) byStatus[a.status] += 1
      if (byType[a.type] != null) byType[a.type] += 1
      const d = (a.domain || "").trim() || "Uncategorised"
      byDomain.set(d, (byDomain.get(d) || 0) + 1)
      const dt = new Date(a.appliedDate || a.createdAt || Date.now())
      if (!Number.isNaN(dt.getTime())) {
        if (!earliest || dt < earliest) earliest = dt
        const w = weekKey(dt)
        byWeek.set(w, (byWeek.get(w) || 0) + 1)
      }
    })
    // Build a contiguous weekly series so quiet weeks show as zeros.
    const weeks = []
    if (earliest) {
      const start = startOfWeek(earliest)
      const end = startOfWeek(new Date())
      const cur = new Date(start)
      while (cur <= end) {
        const k = weekKey(cur)
        weeks.push({ key: k, date: new Date(cur), count: byWeek.get(k) || 0 })
        cur.setDate(cur.getDate() + 7)
      }
    }
    const domains = [...byDomain.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))

    // Funnel: cumulative descent — everyone starts at APPLIED, then OA is those who advanced past APPLIED, etc.
    // With current data model status is a single value, so treat funnel as "reached this stage or deeper".
    const reached = { APPLIED: 0, OA: 0, INTERVIEW: 0, OFFER: 0 }
    const rank = { APPLIED: 1, OA: 2, INTERVIEW: 3, OFFER: 4, REJECTED: 0 }
    apps.forEach((a) => {
      const r = rank[a.status] ?? 0
      if (r >= 1) reached.APPLIED += 1
      if (r >= 2) reached.OA += 1
      if (r >= 3) reached.INTERVIEW += 1
      if (r >= 4) reached.OFFER += 1
    })
    const rejectRate = total ? (byStatus.REJECTED / total) * 100 : 0

    return {
      total,
      byStatus,
      byType,
      domains,
      weeks,
      reached,
      rejectRate,
      offersRate: total ? (byStatus.OFFER / total) * 100 : 0,
      interviewRate: total ? (reached.INTERVIEW / total) * 100 : 0,
    }
  }, [apps])

  if (error) {
    return (
      <div className="px-6 pt-10">
        <ErrorBlock error={error} onRetry={load} />
      </div>
    )
  }
  if (!apps) {
    return (
      <div className="px-6 pt-10">
        <LoadingBlock label="Reading the strip" />
      </div>
    )
  }

  return (
    <div className="px-6 pb-16 pt-8 md:px-10 md:pt-12">
      {/* Masthead */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 rule-b border-b border-rule pb-6">
        <div>
          <div className="eyebrow">Section · 03 · Analytics</div>
          <h1 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">
            The <em className="text-accent">reading room</em>.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-ink-dim">
            The same strip, read at length. Where you cluster, where you convert,
            where the line goes quiet — plotted honestly, no smoothing.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xs font-mono uppercase tracking-widest text-ink-mute">
            n = {stats.total} · sampled from the ledger
          </span>
        </div>
      </div>

      {apps.length === 0 ? (
        <EmptyState
          title="Nothing to analyse yet."
          body="The reading room needs a strip to read. Log an entry and come back."
          action={<Link to="/add-application" className="btn btn-primary">Log the first entry</Link>}
        />
      ) : (
        <>
          <PipelineStrip apps={apps} className="mb-12" />

          {/* Row 1: Funnel + Rate meters */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
            <FunnelPanel reached={stats.reached} total={stats.total} />
            <RateStack
              rows={[
                { label: "Interview rate", value: stats.interviewRate, color: "#F2C14E", body: "of entries reached interview or beyond" },
                { label: "Offer rate", value: stats.offersRate, color: "#7FA97E", body: "of entries converted to an offer" },
                { label: "Rejection rate", value: stats.rejectRate, color: "#8A7A76", body: "of entries closed as rejected" },
              ]}
            />
          </div>

          {/* Row 2: Cadence over time */}
          <div className="mt-14">
            <PanelHeader eyebrow="Cadence" title="Applications per week" hint={`${stats.weeks.length} weeks on record`} />
            <WeeklyBars weeks={stats.weeks} />
          </div>

          {/* Row 3: Domains + Type split */}
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <PanelHeader eyebrow="Composition" title="Where you're aiming" hint="Top domains" />
              <DomainList domains={stats.domains} total={stats.total} />
            </div>
            <div>
              <PanelHeader eyebrow="Composition" title="Internship vs Full-time" hint="Ledger split" />
              <TypeSplit byType={stats.byType} total={stats.total} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ---------------- Sub-components ---------------- */

function PanelHeader({ eyebrow, title, hint }) {
  return (
    <div className="mb-4 flex items-baseline justify-between border-b border-rule pb-3">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-1 font-serif text-2xl">{title}</h2>
      </div>
      {hint && <span className="text-2xs font-mono uppercase tracking-widest text-ink-mute">{hint}</span>}
    </div>
  )
}

function FunnelPanel({ reached, total }) {
  const max = reached.APPLIED || 1
  return (
    <div>
      <PanelHeader eyebrow="Conversion" title="The funnel" hint={`${total} entries in`} />
      <ol className="border border-rule">
        {FUNNEL_ORDER.map((s, i) => {
          const value = reached[s]
          const pct = max ? (value / max) * 100 : 0
          const prev = i === 0 ? null : reached[FUNNEL_ORDER[i - 1]]
          const step = prev == null ? null : (prev ? (value / prev) * 100 : 0)
          return (
            <li key={s} className="grid grid-cols-[24px_120px_1fr_60px] items-center gap-4 border-b border-rule px-4 py-4 last:border-b-0">
              <span className="num text-2xs text-ink-mute">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex items-center gap-2">
                <span aria-hidden className="h-[7px] w-[7px] rounded-full" style={{ background: STATUS_COLOR[s] }} />
                <span className="font-serif text-lg">{STATUS_LABEL[s]}</span>
              </div>
              <div className="relative h-[10px] w-full border border-rule">
                <div
                  className="absolute inset-y-0 left-0"
                  style={{ width: `${pct}%`, background: STATUS_COLOR[s], opacity: 0.85 }}
                />
              </div>
              <div className="text-right">
                <div className="num text-lg text-ink">{value}</div>
                {step != null && (
                  <div className="text-2xs font-mono uppercase tracking-widest text-ink-mute">
                    {step.toFixed(0)}% ↓
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-xs text-ink-mute">
        Each row is "reached this stage or beyond." Percentages drop-through relative to the prior stage.
      </p>
    </div>
  )
}

function RateStack({ rows }) {
  return (
    <div>
      <PanelHeader eyebrow="Rates" title="Signal readouts" />
      <div className="border border-rule">
        {rows.map((r, i) => (
          <div key={r.label} className={`p-5 ${i > 0 ? "border-t border-rule" : ""}`}>
            <div className="flex items-baseline justify-between">
              <div className="eyebrow" style={{ color: r.color }}>{r.label}</div>
              <div className="num font-serif text-3xl leading-none text-ink">
                {r.value.toFixed(0)}
                <span className="ml-1 num text-base text-ink-dim">%</span>
              </div>
            </div>
            <div className="mt-3 h-[6px] w-full border border-rule">
              <div className="h-full" style={{ width: `${Math.min(100, r.value)}%`, background: r.color, opacity: 0.85 }} />
            </div>
            <p className="mt-2 text-xs text-ink-mute">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeeklyBars({ weeks }) {
  if (!weeks.length) return <div className="text-sm text-ink-dim">Not enough dates to plot a series.</div>
  const max = Math.max(1, ...weeks.map((w) => w.count))
  return (
    <div className="border border-rule bg-bg-elev/40 p-5">
      <div className="flex items-end gap-[3px]" style={{ height: 160 }}>
        {weeks.map((w) => {
          const h = (w.count / max) * 100
          return (
            <div
              key={w.key}
              title={`${labelFor(w.date)} · ${w.count}`}
              className="flex-1"
              style={{
                height: `${h}%`,
                minHeight: 2,
                background: w.count === 0 ? "#5A1F1F" : "#F2C14E",
                opacity: w.count === 0 ? 0.35 : 0.9,
              }}
            />
          )
        })}
      </div>
      <div className="mt-3 flex items-baseline justify-between text-2xs font-mono uppercase tracking-widest text-ink-mute">
        <span>{labelFor(weeks[0].date)}</span>
        <span className="text-ink-dim">peak · {max}/wk</span>
        <span>{labelFor(weeks[weeks.length - 1].date)}</span>
      </div>
    </div>
  )
}

function DomainList({ domains, total }) {
  if (!domains.length) return <div className="text-sm text-ink-dim">No domain data yet.</div>
  const max = domains[0].count
  return (
    <ol className="border border-rule">
      {domains.map((d, i) => {
        const pct = max ? (d.count / max) * 100 : 0
        const share = total ? (d.count / total) * 100 : 0
        return (
          <li key={d.name} className="grid grid-cols-[24px_1fr_80px_60px] items-center gap-4 border-b border-rule px-4 py-3 last:border-b-0">
            <span className="num text-2xs text-ink-mute">{String(i + 1).padStart(2, "0")}</span>
            <span className="truncate font-serif text-lg">{d.name}</span>
            <div className="relative h-[8px] w-full border border-rule">
              <div className="absolute inset-y-0 left-0" style={{ width: `${pct}%`, background: "#B8A6A2", opacity: 0.75 }} />
            </div>
            <div className="text-right">
              <div className="num text-sm text-ink">{d.count}</div>
              <div className="text-2xs font-mono uppercase tracking-widest text-ink-mute">{share.toFixed(0)}%</div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function TypeSplit({ byType, total }) {
  const intern = byType.INTERNSHIP
  const full = byType.FULL_TIME
  const iPct = total ? (intern / total) * 100 : 0
  const fPct = total ? (full / total) * 100 : 0
  return (
    <div className="border border-rule p-5">
      <div className="flex h-[14px] w-full border border-rule">
        <div style={{ width: `${iPct}%`, background: "#8FB4C7", opacity: 0.9 }} />
        <div style={{ width: `${fPct}%`, background: "#F2C14E", opacity: 0.9 }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="eyebrow" style={{ color: "#8FB4C7" }}>Internship</div>
          <div className="mt-1 font-serif text-3xl leading-none">{intern}</div>
          <div className="mt-1 text-2xs font-mono uppercase tracking-widest text-ink-mute">
            {iPct.toFixed(0)}%
          </div>
        </div>
        <div className="text-right">
          <div className="eyebrow" style={{ color: "#F2C14E" }}>Full-time</div>
          <div className="mt-1 font-serif text-3xl leading-none">{full}</div>
          <div className="mt-1 text-2xs font-mono uppercase tracking-widest text-ink-mute">
            {fPct.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- helpers ---------------- */

function startOfWeek(d) {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  const day = c.getDay() // 0 = Sun
  const diff = (day + 6) % 7 // Monday-start
  c.setDate(c.getDate() - diff)
  return c
}
function weekKey(d) {
  const s = startOfWeek(d)
  return `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, "0")}-${String(s.getDate()).padStart(2, "0")}`
}
function labelFor(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
}

export default Analytics

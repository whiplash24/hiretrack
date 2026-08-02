import { useMemo, useState } from "react"
import { STATUS_ORDER, STATUS_COLOR, STATUS_LABEL, fmtDateShort } from "../utils/format"

/**
 * The Pipeline Strip — signature visualization for HireTrack.
 * Every application is a vertical tick on a horizontal time axis.
 * Y-position encodes stage (APPLIED at bottom → OFFER at top),
 * color encodes status. A dashed vertical rule marks "today".
 * Feels like a heart-rate monitor for a job search.
 */
export default function PipelineStrip({
  apps = [],
  height = 220,
  compact = false,
  className = "",
}) {
  const [hover, setHover] = useState(null)

  const { ticks, todayX, minDate, maxDate } = useMemo(() => {
    const now = new Date()
    if (apps.length === 0) {
      const start = new Date(now.getTime() - 30 * 86400000)
      return {
        ticks: [],
        xForDate: () => 0,
        todayX: 100,
        minDate: start,
        maxDate: now,
      }
    }
    const dates = apps.map((a) => new Date(a.appliedDate || a.createdAt || Date.now()))
    let min = new Date(Math.min(...dates.map((d) => d.getTime())))
    let max = new Date(Math.max(now.getTime(), ...dates.map((d) => d.getTime())))
    const span = Math.max(max - min, 7 * 86400000)
    min = new Date(max.getTime() - span)
    // pad edges 4%
    const pad = span * 0.04
    const rangeMin = min.getTime() - pad
    const rangeMax = max.getTime() + pad
    const range = rangeMax - rangeMin
    const xForDate = (d) => ((new Date(d).getTime() - rangeMin) / range) * 100
    const ticks = apps.map((a, i) => {
      const status = a.status || "APPLIED"
      const y = stageY(status, height, compact)
      return {
        i,
        id: a._id || i,
        status,
        company: a.company,
        role: a.role,
        date: a.appliedDate || a.createdAt,
        x: xForDate(a.appliedDate || a.createdAt || Date.now()),
        y,
        color: STATUS_COLOR[status] || "#8A7A76",
      }
    })
    return { ticks, todayX: xForDate(now), minDate: min, maxDate: max }
  }, [apps, height, compact])

  const axisPad = compact ? 96 : 128

  return (
    <div className={`relative w-full ${className}`}>
      {/* Header meta row */}
      {!compact && (
        <div className="mb-3 flex items-baseline justify-between">
          <div className="eyebrow">Pipeline · {apps.length} in flight</div>
          <div className="eyebrow text-ink-mute">
            {fmtDateShort(minDate)} → {fmtDateShort(maxDate)}
          </div>
        </div>
      )}
      <div
        className="relative rule-b rule border-x border-rule bg-bg-elev/40"
        style={{ height }}
      >
        {/* Left stage axis */}
        <div
          className="absolute inset-y-0 left-0 border-r border-rule/70"
          style={{ width: axisPad }}
        >
          {STATUS_ORDER.map((s) => {
            const y = stageY(s, height, compact)
            return (
              <div
                key={s}
                className="absolute left-3 flex items-center gap-2"
                style={{ top: y, transform: "translateY(-50%)" }}
              >
                <span
                  aria-hidden
                  style={{ background: STATUS_COLOR[s] }}
                  className="inline-block h-[6px] w-[6px] rounded-full"
                />
                <span className="text-2xs font-mono uppercase tracking-widest text-ink-dim">
                  {shortLabel(s)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Plot area */}
        <div
          className="absolute inset-y-0 right-0"
          style={{ left: axisPad }}
        >
          {/* Horizontal guide rules */}
          {STATUS_ORDER.map((s) => {
            const y = stageY(s, height, compact)
            return (
              <div
                key={s}
                className="pointer-events-none absolute inset-x-0 border-t border-dashed border-rule/50"
                style={{ top: y }}
              />
            )
          })}

          {/* Today marker */}
          <div
            className="pointer-events-none absolute inset-y-0"
            style={{ left: `${todayX}%` }}
          >
            <div className="h-full border-l border-dashed border-accent/70" />
            <div className="absolute -top-[9px] left-1 text-2xs font-mono uppercase tracking-widest text-accent">
              today
            </div>
          </div>

          {/* Ticks */}
          {ticks.map((t) => {
            const isHover = hover?.id === t.id
            return (
              <div
                key={t.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${t.x}%`,
                  top: 12,
                  bottom: 12,
                  width: 1,
                  transform: "translateX(-0.5px)",
                }}
                onMouseEnter={() => setHover(t)}
                onMouseLeave={() => setHover(null)}
              >
                {/* Vertical stem to the stage row */}
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    top: t.y - 12,
                    height: `calc(100% - ${t.y - 12}px - 12px)`,
                    width: 1,
                    background: t.color,
                    opacity: isHover ? 1 : 0.55,
                  }}
                />
                {/* Stage dot */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    top: t.y - 12 - 3,
                    width: isHover ? 9 : 6,
                    height: isHover ? 9 : 6,
                    background: t.color,
                    boxShadow: isHover ? `0 0 0 3px rgba(242,193,78,0.15)` : "none",
                    transition: "width 120ms, height 120ms",
                  }}
                />
              </div>
            )
          })}

          {/* Empty state message inside plot */}
          {ticks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-serif text-2xl italic text-ink-dim">
                  the strip is quiet.
                </div>
                <div className="eyebrow mt-2 text-ink-mute">
                  log your first application to start the line
                </div>
              </div>
            </div>
          )}

          {/* Hover readout */}
          {hover && (
            <div
              className="pointer-events-none absolute z-10 max-w-[220px] border border-rule bg-bg-elev p-3"
              style={{
                left: `min(calc(${hover.x}% + 12px), calc(100% - 232px))`,
                top: Math.max(hover.y - 60, 4),
              }}
            >
              <div className="eyebrow" style={{ color: hover.color }}>
                {STATUS_LABEL[hover.status]}
              </div>
              <div className="mt-1 font-serif text-lg leading-tight text-ink">
                {hover.company}
              </div>
              <div className="text-sm text-ink-dim">{hover.role}</div>
              <div className="mt-2 text-2xs font-mono uppercase tracking-widest text-ink-mute">
                applied · {fmtDateShort(hover.date)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function stageY(status, height, compact) {
  const top = compact ? 14 : 22
  const bottom = compact ? 14 : 22
  const usable = height - top - bottom
  const rowCount = STATUS_ORDER.length
  // Map: APPLIED 4/5, OA 3/5, INTERVIEW 2/5, OFFER 0/5 (top), REJECTED 5/5 (bottom-off)
  const row = { APPLIED: 3, OA: 2, INTERVIEW: 1, OFFER: 0, REJECTED: 4 }[status] ?? 3
  return top + (row / (rowCount - 1)) * usable
}

function shortLabel(s) {
  return { APPLIED: "Applied", OA: "OA", INTERVIEW: "Interview", OFFER: "Offer", REJECTED: "Rejected" }[s]
}

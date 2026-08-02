import { STATUS_COLOR, STATUS_LABEL } from "../utils/format"

export default function StatusDot({ status, label = true, className = "" }) {
  const color = STATUS_COLOR[status] || "#8A7A76"
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        style={{ background: color }}
        className="inline-block h-[7px] w-[7px] rounded-full"
      />
      {label && (
        <span className="text-xs font-mono uppercase tracking-wider text-ink-dim">
          {STATUS_LABEL[status] || status}
        </span>
      )}
    </span>
  )
}

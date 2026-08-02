export const STATUS_ORDER = ["APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED"]

export const STATUS_LABEL = {
  APPLIED: "Applied",
  OA: "Online assessment",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
}

export const STATUS_COLOR = {
  APPLIED: "#B8A6A2",
  OA: "#8FB4C7",
  INTERVIEW: "#F2C14E",
  OFFER: "#7FA97E",
  REJECTED: "#8A7A76",
}

export const fmtDate = (d) => {
  if (!d) return "—"
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export const fmtDateShort = (d) => {
  if (!d) return "—"
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
}

export const fmtRelative = (d) => {
  if (!d) return "—"
  const date = new Date(d)
  const now = new Date()
  const diffMs = now - date
  const day = 24 * 60 * 60 * 1000
  const days = Math.floor(diffMs / day)
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

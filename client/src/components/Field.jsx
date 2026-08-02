export default function Field({ label, hint, children, required, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow mb-1 block">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-mute">{hint}</span>}
    </label>
  )
}

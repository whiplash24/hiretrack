import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createApplication } from "../services/applicationService"
import Field from "../components/Field"
import { STATUS_ORDER, STATUS_LABEL } from "../utils/format"

const TYPES = [
  { key: "INTERNSHIP", label: "Internship" },
  { key: "FULL_TIME", label: "Full-time" },
]

function AddApplication() {
  const [form, setForm] = useState({
    company: "",
    role: "",
    domain: "",
    type: "INTERNSHIP",
    stipendOrSalary: "",
    status: "APPLIED",
    notes: "",
  })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await createApplication(form)
      navigate("/applications")
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Could not save entry")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="px-6 pb-16 pt-8 md:px-10 md:pt-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 rule-b border-b border-rule pb-6">
        <div>
          <div className="eyebrow">Section · 03 · New entry</div>
          <h1 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">
            Log an <em className="text-accent">entry</em>.
          </h1>
          <p className="mt-3 max-w-lg text-sm text-ink-dim">
            One row in the ledger. Only company, role and type are required —
            everything else can be filled in as you learn it.
          </p>
        </div>
        <Link to="/applications" className="btn btn-ghost">
          ← Back to index
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-[1.6fr_1fr]"
      >
        <div className="space-y-8">
          {error && (
            <div role="alert" className="border border-rule bg-bg-elev p-4">
              <div className="eyebrow text-accent">Could not save</div>
              <p className="mt-1 text-sm text-ink">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Company" required className="md:col-span-2">
              <input required value={form.company} onChange={set("company")} className="field-input" placeholder="e.g. Anthropic" />
            </Field>
            <Field label="Role" required className="md:col-span-2">
              <input required value={form.role} onChange={set("role")} className="field-input" placeholder="e.g. Software Engineer, Model Behavior" />
            </Field>
            <Field label="Domain">
              <input value={form.domain} onChange={set("domain")} className="field-input" placeholder="e.g. AI Safety, Fintech" />
            </Field>
            <Field label="Stipend / salary">
              <input value={form.stipendOrSalary} onChange={set("stipendOrSalary")} className="field-input" placeholder="e.g. $10k/mo" />
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={5}
              className="field-input resize-y"
              placeholder="Referral? Recruiter name? Prep to do?"
            />
          </Field>
        </div>

        {/* Right rail: meta pickers, styled as pickers not fields */}
        <div className="space-y-8 border-l border-rule pl-8 max-md:border-l-0 max-md:pl-0 max-md:pt-6 max-md:border-t max-md:border-rule">
          <div>
            <div className="eyebrow mb-3">Type</div>
            <div className="flex flex-col gap-2">
              {TYPES.map((t) => (
                <label
                  key={t.key}
                  className={[
                    "flex cursor-pointer items-center justify-between border px-3 py-2 transition-colors",
                    form.type === t.key
                      ? "border-accent bg-bg-elev text-ink"
                      : "border-rule text-ink-dim hover:text-ink",
                  ].join(" ")}
                >
                  <span className="font-serif text-lg">{t.label}</span>
                  <input
                    type="radio"
                    name="type"
                    className="sr-only"
                    checked={form.type === t.key}
                    onChange={() => setForm({ ...form, type: t.key })}
                  />
                  {form.type === t.key && (
                    <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-accent" />
                  )}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow mb-3">Starting stage</div>
            <div className="flex flex-col gap-1">
              {STATUS_ORDER.map((s) => (
                <label
                  key={s}
                  className={[
                    "flex cursor-pointer items-center justify-between border-b border-rule/60 py-2 text-sm transition-colors",
                    form.status === s ? "text-ink" : "text-ink-dim hover:text-ink",
                  ].join(" ")}
                >
                  <span className="font-serif text-lg">{STATUS_LABEL[s]}</span>
                  <input
                    type="radio"
                    name="status"
                    className="sr-only"
                    checked={form.status === s}
                    onChange={() => setForm({ ...form, status: s })}
                  />
                  {form.status === s && (
                    <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-accent" />
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button type="submit" disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
              {busy ? "Recording…" : "Add to strip →"}
            </button>
            <Link to="/applications" className="btn w-full">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddApplication

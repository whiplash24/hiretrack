import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/authService"
import AuthLayout from "../layouts/AuthLayout"
import Field from "../components/Field"

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    graduationYear: "",
  })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      const data = await registerUser(form)
      localStorage.setItem("token", data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Section · 00 · Enrolment"
      title={<>Start an edition.</>}
      kicker="Set up the notebook. Two minutes; then log your first entry."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-ink underline decoration-accent underline-offset-4">
            Sign in
          </Link>
          .
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {error && (
          <div role="alert" className="border border-rule bg-bg-elev p-3">
            <div className="eyebrow text-accent">Enrolment failed</div>
            <p className="mt-1 text-sm text-ink">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Name" required className="md:col-span-2">
            <input className="field-input" value={form.name} onChange={set("name")} required autoComplete="name" />
          </Field>
          <Field label="Email" required className="md:col-span-2">
            <input type="email" className="field-input" value={form.email} onChange={set("email")} required autoComplete="email" />
          </Field>
          <Field label="Password" required className="md:col-span-2">
            <input type="password" className="field-input" value={form.password} onChange={set("password")} required autoComplete="new-password" />
          </Field>

          <div className="eyebrow md:col-span-2 mt-2">Optional · context</div>
          <Field label="College">
            <input className="field-input" value={form.college} onChange={set("college")} />
          </Field>
          <Field label="Branch">
            <input className="field-input" value={form.branch} onChange={set("branch")} />
          </Field>
          <Field label="Graduation year" className="md:col-span-2">
            <input inputMode="numeric" className="field-input num" value={form.graduationYear} onChange={set("graduationYear")} placeholder="e.g. 2027" />
          </Field>
        </div>

        <button type="submit" disabled={busy} className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-60">
          {busy ? "Setting up…" : "Begin →"}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register

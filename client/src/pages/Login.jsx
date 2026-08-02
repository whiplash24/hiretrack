import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../services/authService"
import AuthLayout from "../layouts/AuthLayout"
import Field from "../components/Field"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      const data = await loginUser(email, password)
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
      eyebrow="Section · 00 · Access"
      title={<>Sign in.</>}
      kicker="Welcome back. Pick up the notebook where you left it."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="text-ink underline decoration-accent underline-offset-4">
            Start an edition
          </Link>
          .
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {error && (
          <div role="alert" className="border border-rule bg-bg-elev p-3">
            <div className="eyebrow text-accent">Not admitted</div>
            <p className="mt-1 text-sm text-ink">{error}</p>
          </div>
        )}
        <Field label="Email" required>
          <input
            type="email"
            autoComplete="email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Password" required>
          <input
            type="password"
            autoComplete="current-password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <button type="submit" disabled={busy} className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-60">
          {busy ? "Opening…" : "Enter →"}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login

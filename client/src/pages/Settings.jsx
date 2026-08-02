import { useNavigate } from "react-router-dom"
import Field from "../components/Field"

function Settings() {
  const navigate = useNavigate()

  const signOut = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="px-6 pb-16 pt-8 md:px-10 md:pt-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 rule-b border-b border-rule pb-6">
        <div>
          <div className="eyebrow">Section · 04 · Settings</div>
          <h1 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">
            The <em className="text-accent">colophon</em>.
          </h1>
          <p className="mt-3 max-w-md text-sm text-ink-dim">
            Preferences for your ledger. Most of this is intentionally quiet — the
            product does the same thing every time you open it.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-10">
          <Panel title="Preferences" eyebrow="A · display">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Palette">
                <input readOnly value="Oxblood editorial" className="field-input" />
              </Field>
              <Field label="Density">
                <input readOnly value="Comfortable" className="field-input" />
              </Field>
              <Field label="Week starts on">
                <input readOnly value="Monday" className="field-input" />
              </Field>
              <Field label="Date format">
                <input readOnly value="MMM DD, YYYY" className="field-input" />
              </Field>
            </div>
            <p className="mt-4 text-xs text-ink-mute">
              These are locked in this edition; wiring them to a settings API is future
              work.
            </p>
          </Panel>

          <Panel title="Notifications" eyebrow="B · signal">
            <ToggleRow label="Interview reminder — 24h before" defaultOn />
            <ToggleRow label="Weekly strip digest — Sunday evening" defaultOn />
            <ToggleRow label="Response overdue — no update in 14d" />
          </Panel>

          <Panel title="Account" eyebrow="C · session">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-serif text-lg">Sign out of this device</div>
                <div className="text-sm text-ink-dim">The strip stays with you next time.</div>
              </div>
              <button onClick={signOut} className="btn">
                Sign out
              </button>
            </div>
          </Panel>
        </section>

        <aside className="space-y-8">
          <div className="border border-rule bg-bg-elev p-6">
            <div className="eyebrow">About</div>
            <p className="mt-3 font-serif text-xl italic leading-snug text-ink">
              HireTrack, vol. II — an oxblood edition. Set in{" "}
              <span className="text-accent">Instrument Serif</span> and IBM Plex.
            </p>
            <div className="mt-4 border-t border-rule pt-4 text-2xs font-mono uppercase tracking-widest text-ink-mute">
              MMXXVI · printed on 3A1212
            </div>
          </div>

          <div className="border border-rule">
            <div className="border-b border-rule px-4 py-3"><div className="eyebrow">Keys</div></div>
            <ul className="divide-y divide-rule text-sm">
              <KeyRow k="G D" label="Go to dashboard" />
              <KeyRow k="G A" label="Go to applications" />
              <KeyRow k="N" label="New entry" />
              <KeyRow k="/" label="Search" />
            </ul>
            <div className="border-t border-rule px-4 py-2 text-2xs font-mono uppercase tracking-widest text-ink-mute">
              Shortcuts are documented, not wired.
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Panel({ title, eyebrow, children }) {
  return (
    <div className="border border-rule p-6">
      <div className="mb-6 flex items-baseline justify-between border-b border-rule pb-4">
        <div className="font-serif text-2xl">{title}</div>
        <div className="eyebrow">{eyebrow}</div>
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, defaultOn = false }) {
  return (
    <label className="flex cursor-pointer items-center justify-between border-b border-rule/60 py-3 last:border-b-0">
      <span className="font-serif text-lg">{label}</span>
      <FakeToggle on={defaultOn} />
    </label>
  )
}

function FakeToggle({ on }) {
  // purely visual — settings API is out of scope
  return (
    <span
      aria-hidden
      className="relative inline-block h-[18px] w-[36px] border border-rule"
      style={{ background: on ? "#F2C14E" : "transparent" }}
    >
      <span
        className="absolute top-[1px] h-[14px] w-[14px] transition-all"
        style={{ left: on ? 20 : 1, background: on ? "#3A1212" : "#B8A6A2" }}
      />
    </span>
  )
}

function KeyRow({ k, label }) {
  return (
    <li className="flex items-center justify-between px-4 py-2">
      <span className="text-ink-dim">{label}</span>
      <kbd className="border border-rule px-2 py-[2px] font-mono text-2xs uppercase tracking-widest text-ink">
        {k}
      </kbd>
    </li>
  )
}

export default Settings

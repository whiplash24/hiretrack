import { Link } from "react-router-dom"

const SAMPLE = [
  { company: "Anthropic", role: "SWE, Model Behavior", status: "INTERVIEW", appliedDate: daysAgo(5) },
  { company: "Stripe", role: "Product Eng, Payments", status: "OA", appliedDate: daysAgo(9) },
  { company: "Linear", role: "Frontend Eng", status: "APPLIED", appliedDate: daysAgo(2) },
  { company: "Ramp", role: "New Grad SWE", status: "APPLIED", appliedDate: daysAgo(12) },
  { company: "Vercel", role: "DX Engineer", status: "OFFER", appliedDate: daysAgo(20) },
  { company: "Retool", role: "Full-stack", status: "REJECTED", appliedDate: daysAgo(28) },
  { company: "Notion", role: "iOS Eng", status: "APPLIED", appliedDate: daysAgo(1) },
  { company: "Figma", role: "Design Eng", status: "INTERVIEW", appliedDate: daysAgo(15) },
]

function daysAgo(n) {
  return new Date(Date.now() - n * 86400000).toISOString()
}

function Landing() {
  const isAuthed = typeof window !== "undefined" && !!localStorage.getItem("token")

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* Header */}
      <header className="rule-b border-b border-rule">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="font-serif text-2xl">
              Hire<span className="italic text-accent">Track</span>
            </span>
            <span className="hidden text-2xs font-mono uppercase tracking-widest text-ink-mute md:inline">
              a job-search field notebook
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-2xs font-mono uppercase tracking-widest text-ink-dim hover:text-ink">
              Sign in
            </Link>
            <Link to={isAuthed ? "/dashboard" : "/register"} className="btn btn-primary">
              {isAuthed ? "Open the notebook" : "Start an edition"}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
        <div className="eyebrow">Vol. II · MMXXVI · issue 01</div>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.98] md:text-[112px]">
          A job search{" "}
          <em className="text-accent">printed</em>
          <br />
          on oxblood.
        </h1>
        <p className="mt-8 max-w-xl font-serif text-2xl italic leading-snug text-ink-dim">
          HireTrack turns every application into a single tick on a single
          line, so the whole search becomes something you can look at instead
          of something you have to remember.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link to="/register" className="btn btn-primary">
            Start your ledger →
          </Link>
          <Link to="/login" className="btn">Sign in</Link>
          <span className="text-2xs font-mono uppercase tracking-widest text-ink-mute">
            Free while it stays this small
          </span>
        </div>
      </section>

      {/* Demo strip */}
      <section className="border-y border-rule bg-bg-elev/40">
        <div className="mx-auto max-w-[1400px] px-6 py-14">
          <div className="mb-6 flex items-baseline justify-between">
            <div className="eyebrow">The Pipeline Strip · specimen</div>
            <div className="eyebrow text-ink-mute">not a chart · a strip</div>
          </div>
          <DemoStrip apps={SAMPLE} />
          <p className="mt-6 max-w-xl text-sm text-ink-dim">
            One horizontal line, five stages, one warm amber marker for
            <span className="text-accent"> today</span>. Every application is a
            vertical stroke. Colour is stage, position is time — enough to read
            the search at a glance.
          </p>
        </div>
      </section>

      {/* Three columns — deliberately not-identical */}
      <section className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <Column
            num="i"
            title="Log entries, not tasks."
            body="Company, role, type. Everything else is optional. The strip does the rest."
          />
          <Column
            num="ii"
            title="Read the line."
            body="Where are you clustered? Where does the line go quiet? The picture answers before the spreadsheet does."
          />
          <Column
            num="iii"
            title="Own the ledger."
            body="Your data, your entries. No AI-generated pep talks. No suggested next steps. Just the strip."
          />
        </div>
      </section>

      {/* Editorial callout */}
      <section className="border-t border-rule">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-[1fr_2fr]">
          <div className="eyebrow">A note from the editors</div>
          <div>
            <p className="font-serif text-3xl italic leading-tight md:text-4xl">
              We built the tool we wanted while job searching — a
              <span className="text-accent"> single visible line</span> that
              refused to become a spreadsheet.
            </p>
            <div className="mt-6 flex items-center gap-3 text-2xs font-mono uppercase tracking-widest text-ink-mute">
              <span aria-hidden className="inline-block h-[6px] w-[6px] rounded-full bg-accent" />
              <span>The HireTrack editorial desk</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-rule bg-bg-elev/50">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
          <div>
            <div className="eyebrow">Open a new edition</div>
            <h2 className="mt-3 font-serif text-4xl leading-tight">
              Start the strip.
            </h2>
          </div>
          <Link to="/register" className="btn btn-primary">
            Create your notebook →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-2xs font-mono uppercase tracking-widest text-ink-mute">
          <span>HireTrack · vol. II · MMXXVI</span>
          <span>set in Instrument Serif &amp; IBM Plex</span>
          <span>signal over noise</span>
        </div>
      </footer>
    </div>
  )
}

const STATUS_COLOR = {
  APPLIED: "#B8A6A2",
  OA: "#8FB4C7",
  INTERVIEW: "#F2C14E",
  OFFER: "#7FA97E",
  REJECTED: "#8A7A76",
}
const STAGE_Y = { OFFER: 0, INTERVIEW: 0.25, OA: 0.5, APPLIED: 0.75, REJECTED: 1 }
const STAGES = [
  { key: "OFFER", label: "Offer" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "OA", label: "OA" },
  { key: "APPLIED", label: "Applied" },
  { key: "REJECTED", label: "Rejected" },
]

function DemoStrip({ apps }) {
  const height = 220
  const now = Date.now()
  const min = Math.min(...apps.map((a) => +new Date(a.appliedDate)))
  const max = now
  const range = max - min
  const xFor = (d) => ((new Date(d).getTime() - min) / range) * 100
  return (
    <div className="relative border border-rule bg-bg" style={{ height }}>
      {/* stage axis */}
      <div className="absolute inset-y-0 left-0 w-[128px] border-r border-rule">
        {STAGES.map((s) => {
          const y = 22 + STAGE_Y[s.key] * (height - 44)
          return (
            <div key={s.key} className="absolute left-3 flex items-center gap-2" style={{ top: y, transform: "translateY(-50%)" }}>
              <span aria-hidden style={{ background: STATUS_COLOR[s.key] }} className="inline-block h-[6px] w-[6px] rounded-full" />
              <span className="text-2xs font-mono uppercase tracking-widest text-ink-dim">{s.label}</span>
            </div>
          )
        })}
      </div>
      <div className="absolute inset-y-0 right-0" style={{ left: 128 }}>
        {STAGES.map((s) => {
          const y = 22 + STAGE_Y[s.key] * (height - 44)
          return <div key={s.key} className="pointer-events-none absolute inset-x-0 border-t border-dashed border-rule/50" style={{ top: y }} />
        })}
        {/* today */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: "100%" }}>
          <div className="h-full border-l border-dashed border-accent/70" />
          <div className="absolute -top-[9px] -left-8 text-2xs font-mono uppercase tracking-widest text-accent">today</div>
        </div>
        {apps.map((a, i) => {
          const y = 22 + STAGE_Y[a.status] * (height - 44)
          return (
            <div key={i} className="absolute" style={{ left: `${xFor(a.appliedDate)}%`, top: 12, bottom: 12, width: 1 }}>
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: y - 12, height: `calc(100% - ${y - 12}px - 12px)`, width: 1, background: STATUS_COLOR[a.status], opacity: 0.6 }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-full"
                style={{ top: y - 15, width: 6, height: 6, background: STATUS_COLOR[a.status] }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Column({ num, title, body }) {
  return (
    <div>
      <div className="font-serif text-6xl italic text-accent">{num}.</div>
      <h3 className="mt-2 font-serif text-3xl leading-tight">{title}</h3>
      <p className="mt-3 text-base text-ink-dim">{body}</p>
    </div>
  )
}

export default Landing

import { NavLink, Outlet, useNavigate } from "react-router-dom"

const NAV = [
  { to: "/dashboard", label: "Dashboard", num: "01" },
  { to: "/applications", label: "Applications", num: "02" },
  { to: "/analytics", label: "Analytics", num: "03" },
  { to: "/add-application", label: "New entry", num: "04" },
  { to: "/settings", label: "Settings", num: "05" },
]

export default function AppShell() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* Top bar */}
      <header className="rule-b sticky top-0 z-30 border-b border-rule bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <NavLink to="/dashboard" className="flex items-baseline gap-3">
            <Wordmark />
            <span className="hidden text-2xs font-mono uppercase tracking-widest text-ink-mute md:inline">
              a job-search field notebook
            </span>
          </NavLink>
          <div className="flex items-center gap-6">
            <span className="hidden text-2xs font-mono uppercase tracking-widest text-ink-mute lg:inline">
              vol. II · ed. {new Date().getFullYear()}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-ghost"
              aria-label="Sign out"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="hidden w-[220px] shrink-0 border-r border-rule py-10 md:block">
          <nav aria-label="Primary" className="sticky top-24">
            <div className="eyebrow mb-4 px-6">Sections</div>
            <ul>
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "flex items-baseline gap-3 border-l-2 px-6 py-2 transition-colors",
                        isActive
                          ? "border-accent bg-bg-elev text-ink"
                          : "border-transparent text-ink-dim hover:border-rule hover:bg-bg-elev/50 hover:text-ink",
                      ].join(" ")
                    }
                  >
                    <span className="text-2xs font-mono tabular-nums text-ink-mute">
                      {item.num}
                    </span>
                    <span className="font-serif text-lg">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-10 px-6">
              <div className="eyebrow mb-2">Colophon</div>
              <p className="text-xs text-ink-mute">
                Set in Instrument Serif &amp; IBM Plex.
                <br />
                Field-tested against rejection.
              </p>
            </div>
          </nav>
        </aside>

        {/* Mobile nav strip */}
        <MobileNav />

        <main className="min-w-0 flex-1 pb-30">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="rule border-t border-rule">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 text-2xs font-mono uppercase tracking-widest text-ink-mute">
          <span>HireTrack · MMXXVI</span>
          <span>signal over noise</span>
        </div>
      </footer>
    </div>
  )
}

function Wordmark() {
  return (
    <span className="flex items-baseline gap-1 font-serif text-2xl text-ink">
      <span>Hire</span>
      <span className="italic text-accent">Track</span>
      <span aria-hidden className="ml-1 h-[7px] w-[7px] translate-y-[-4px] rounded-full bg-accent" />
    </span>
  )
}

function MobileNav() {
  return (
    <nav
      aria-label="Primary mobile"
      className="rule-b fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-bg/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-[1400px]">
        {NAV.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1 border-t-2 py-3",
                  isActive
                    ? "border-accent bg-bg-elev text-ink"
                    : "border-transparent text-ink-dim",
                ].join(" ")
              }
            >
              <span className="text-2xs font-mono tabular-nums">{item.num}</span>
              <span className="text-xs">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

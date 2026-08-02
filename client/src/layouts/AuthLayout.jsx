import { Link } from "react-router-dom"

export default function AuthLayout({ eyebrow, title, kicker, children, footer }) {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        {/* Editorial marquee */}
        <aside className="relative flex flex-col justify-between border-b border-rule px-8 py-10 md:px-14 md:py-14 lg:border-b-0 lg:border-r">
          <div className="flex items-baseline gap-3">
            <Link to="/" className="font-serif text-2xl">
              Hire<span className="italic text-accent">Track</span>
            </Link>
            <span className="text-2xs font-mono uppercase tracking-widest text-ink-mute">
              vol. II
            </span>
          </div>

          <div className="max-w-xl">
            <div className="eyebrow">The job-search field notebook</div>
            <h2 className="mt-4 font-serif text-4xl leading-[1.02] md:text-5xl">
              Every application,{" "}
              <em className="text-accent">plotted</em> on a single line.
            </h2>
            <p className="mt-6 max-w-md text-base text-ink-dim">
              HireTrack turns the job search into a legible object — a strip
              you can look at, not a spreadsheet you avoid. Log the entry;
              the pipeline draws itself.
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div className="eyebrow text-ink-mute">
              MMXXVI · edition 01
              <br />
              printed on oxblood
            </div>
            <TinyStrip />
          </div>
        </aside>

        {/* Form column */}
        <section className="flex items-center justify-center px-6 py-12 md:px-12">
          <div className="w-full max-w-sm">
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            <h1 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
              {title}
            </h1>
            {kicker && (
              <p className="mt-3 text-sm text-ink-dim">{kicker}</p>
            )}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 rule border-t border-rule pt-6 text-sm text-ink-dim">{footer}</div>}
          </div>
        </section>
      </div>
    </div>
  )
}

function TinyStrip() {
  // decorative: five vertical strokes at increasing height, colored by stage
  const marks = [
    { c: "#B8A6A2", h: 14 },
    { c: "#8FB4C7", h: 26 },
    { c: "#F2C14E", h: 38 },
    { c: "#F2C14E", h: 44 },
    { c: "#7FA97E", h: 56 },
  ]
  return (
    <div className="flex items-end gap-2 border-b border-rule pb-1">
      {marks.map((m, i) => (
        <span
          key={i}
          aria-hidden
          style={{ background: m.c, height: m.h }}
          className="inline-block w-[2px]"
        />
      ))}
    </div>
  )
}

import Reveal from "./Reveal"

const stamps = [
  {
    year: "UOW · COMPUTER SCIENCE",
    title: "Dean's Scholar",
    body: "Top 5% of my cohort in Computer Science & Software Engineering at the University of Wollongong.",
    rot: -1.4,
  },
  {
    year: "FOUNDER",
    title: "Built a community, 130+ strong",
    body: "Founded and scaled a university organisation from the ground up to over 130 members.",
    rot: 1.6,
  },
  {
    year: "STARTUP · INTERNSHIP",
    title: "Led front-end initiatives",
    body: "Interned at a startup, taking ownership of front-end features from design through to ship.",
    rot: 1.1,
  },
  {
    year: "WEBACY · EXTERNSHIP",
    title: "Data Analytics Externship",
    body: "A summer deep in data — frequency analysis, correlation, and clustering on smart-contract risk data.",
    rot: -1.8,
  },
]

export default function Journey() {
  return (
    <section id="journey" className="py-28 bg-ink text-paper">
      <div className="max-w-[1180px] mx-auto px-8">
        <Reveal className="max-w-xl mb-14">
          <span className="kicker-dash font-mono text-xs text-[#D9C88B] flex items-center gap-2.5 mb-3.5">
            the journey so far
          </span>
          <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,2.9rem)] text-paper">
            Stamps collected along the way.
          </h2>
          <p className="mt-3 text-[#B9B6A6] text-[15.5px] max-w-md">
            A passport page of sorts — the milestones behind the projects above.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stamps.map((s) => (
            <Reveal key={s.title}>
              <div
                style={{ transform: `rotate(${s.rot}deg)` }}
                className="border-2 border-dashed border-paper/35 rounded-md px-5.5 py-6 bg-paper/[0.03] transition-all duration-300 hover:rotate-0 hover:bg-paper/[0.06]"
              >
                <span className="font-mono text-[11px] text-twine mb-2.5 block">{s.year}</span>
                <h3 className="font-display font-semibold text-xl text-paper mb-2">{s.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-[#B9B6A6] m-0">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

import Reveal from "./Reveal"

const categories = [
  {
    title: "languages",
    note: "what I think in",
    items: ["Python", "Java", "JavaScript", "TypeScript", "C++", "SQL", "HTML", "CSS"],
  },
  {
    title: "frontend",
    note: "what I build interfaces with",
    items: ["React", "Vite", "Material UI", "JavaFX", "React Router", "Responsive UI"],
  },
  {
    title: "backend / apis",
    note: "what runs underneath",
    items: ["Spring Boot", "REST APIs", "Express", "Local Storage Persistence"],
  },
  {
    title: "ai / machine learning",
    note: "what I use to make sense of data",
    items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "RapidMiner", "Excel", "Statistical Analysis", "Gemini API"],
  },
  {
    title: "tools / devops",
    note: "how it ships",
    items: ["Docker", "Git / GitHub", "Vercel", "PostgreSQL", "MySQL"],
  },
  {
    title: "design / ui-ux",
    note: "where it starts",
    items: ["Figma", "UI/UX Design", "Prototyping", "Canva", "Procreate", "Custom Branding"],
  },
]

export default function TechStack() {
  return (
    <section id="stack" className="py-28">
      <div className="max-w-[1180px] mx-auto px-8">
        <Reveal className="max-w-xl mb-14">
          <span className="kicker-dash font-mono text-xs text-stamp flex items-center gap-2.5 mb-3.5">
            my tech stack
          </span>
          <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,2.9rem)]">
            Tools and technologies I actually reach for.
          </h2>
          <p className="mt-3 text-ink-soft text-[15.5px] max-w-md">
            Not a resume dump — this is what's genuinely in rotation, sorted like a card catalogue.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Reveal key={cat.title}>
              <div className="bg-cream-card border border-paper-line rounded-sm px-6 pt-7 pb-6 relative shadow-[0_6px_0_-2px_rgba(42,42,34,0.05),0_8px_18px_rgba(42,42,34,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:-rotate-[0.6deg] hover:shadow-[0_18px_30px_rgba(42,42,34,0.14)]">
                <span
                  className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-paper shadow-[inset_0_2px_3px_rgba(0,0,0,0.18),0_0_0_1px_var(--color-paper-line)]"
                  aria-hidden="true"
                />
                <h3 className="font-mono lowercase text-base mb-1">{cat.title}</h3>
                <p className="text-xs text-ink-soft italic mb-4">{cat.note}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <span key={item} className="text-xs px-2.5 py-1.5 rounded-full bg-paper border border-paper-line">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

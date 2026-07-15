import Reveal from "./Reveal"

const categories = [
  {
    title: "languages",
    tone: "light",
    items: ["Python", "Java", "Javascript", "C#", "Typescript", "C++", "SQL", "HTML", "CSS"],
  },
  {
    title: "frontend",
    tone: "sky",
    items: ["React", "Vite", "Tailwind CSS", "JavaFX", "Material Tailwind", "React Router", "Responsive UI Development"],
  },
  {
    title: "backend/APIs",
    tone: "sky",
    items: ["Spring Boot", "REST APIs", "Express.js", "dotenv", "localStorage-based persistence"],
  },
  {
    title: "AI/Machine Learning",
    tone: "grass",
    items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "RapidMiner", "Excel", "Statistical Analysis", "Gemini API"],
  },
  {
    title: "tools/DevOps",
    tone: "grass",
    items: ["Docker", "Git/GitHub", "Agentic AI", "Vercel", "npm", "PostgreSQL", "PostCSS", "Autoprefixer"],
  },
  {
    title: "design & UI/UX",
    tone: "grass",
    items: ["Figma", "UI/UX Design", "Prototyping", "Canva", "Procreate", "Custom Theming", "Visual Interface Design"],
  },
]

const toneStyles = {
  light: {
    card: "bg-white/95 border border-white/60",
    heading: "text-ink",
    pill: "bg-[#E4ECF6] text-ink",
  },
  sky: {
    card: "bg-white/20 backdrop-blur-xl border border-white/40",
    heading: "text-white",
    pill: "bg-white/90 text-ink",
  },
  grass: {
    card: "bg-gradient-to-b from-white/35 to-white/10 backdrop-blur-xl border border-white/40",
    heading: "text-white",
    pill: "bg-white/90 text-ink",
  },
}

export default function TechStack() {
  return (
    <section id="stack" className="relative py-28 overflow-hidden bg-tech-sky">
      {/* grass photo anchored to the bottom of the section */}
      <img
        src="/items/greenery.PNG"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full h-[56%] object-cover object-top pointer-events-none select-none"
      />
      {/* soft blend so the sky color eases into the grass photo */}
      <div
        className="absolute left-0 right-0 top-[30%] h-40 bg-gradient-to-b from-tech-sky to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1180px] mx-auto px-8 relative z-10">
        <Reveal className="mb-14">
          <h2 className="font-advercase font-bold text-ink text-[clamp(2.6rem,6vw,4.4rem)] leading-none drop-shadow-[3px_4px_0_rgba(0,0,0,0.12)]">
            my tech stack
          </h2>
          <p className="font-google font-semibold text-ink mt-4 text-[15px]">
            tools and technologies i have worked and work with.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const tone = toneStyles[cat.tone]
            return (
              <Reveal key={cat.title} delay={i * 0.07}>
                <div className={`rounded-[28px] p-7 shadow-[0_8px_32px_rgba(31,41,55,0.15)] transition-transform duration-300 hover:-translate-y-1.5 ${tone.card}`}>
                  <h3 className={`font-google font-bold uppercase tracking-wide text-xl mb-4 ${tone.heading}`}>
                    {cat.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <span
                        key={item}
                        className={`font-google text-sm font-semibold px-3.5 py-1.5 rounded-full ${tone.pill}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
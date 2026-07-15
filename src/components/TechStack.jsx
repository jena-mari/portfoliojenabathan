import Reveal from "./Reveal"
import Clouds from "./Clouds"

const categories = [
  {
    title: "languages",
    items: ["Python", "Java", "Javascript", "C#", "Typescript", "C++", "SQL", "HTML", "CSS"],
  },
  {
    title: "frontend",
    items: ["React", "Vite", "Tailwind CSS", "JavaFX", "Material Tailwind", "React Router", "Responsive UI Development"],
  },
  {
    title: "backend/APIs",
    items: ["Spring Boot", "REST APIs", "Express.js", "dotenv", "localStorage-based persistence"],
  },
  {
    title: "AI/Machine Learning",
    items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "RapidMiner", "Excel", "Statistical Analysis", "Gemini API"],
  },
  {
    title: "tools/DevOps",
    items: ["Docker", "Git/GitHub", "Agentic AI", "Vercel", "npm", "PostgreSQL", "PostCSS", "Autoprefixer"],
  },
  {
    title: "design & UI/UX",
    items: ["Figma", "UI/UX Design", "Prototyping", "Canva", "Procreate", "Custom Theming", "Visual Interface Design"],
  },
]

export default function TechStack() {
  return (
    <section id="stack" className="relative py-28 overflow-hidden bg-tech-sky">
      {/* moving clouds — sit behind the grass photo, so they only show over the sky */}
      <Clouds />

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
          {categories.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 0.07}>
              <div className="group rounded-[28px] p-7 border border-white/40 bg-white/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,41,55,0.15)] transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/95 hover:border-white/70">
                <h3 className="font-google font-bold uppercase tracking-wide text-xl mb-4 text-white transition-colors duration-500 group-hover:text-ink">
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="font-google text-sm font-semibold px-3.5 py-1.5 rounded-full bg-white/90 text-ink"
                    >
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
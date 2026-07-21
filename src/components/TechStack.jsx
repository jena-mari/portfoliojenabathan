import Reveal from "./Reveal"
import Clouds from "./Clouds"
import ClotheslineRow from "./ClotheslineRow"

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

const rows = [categories.slice(0, 3), categories.slice(3, 6)]
const restAngles = [-2.5, 1.5, -1.8, 2, -1.2, 2.4]

function Card({ cat }) {
  return (
    <div className="group relative rounded-[1.75rem] p-7 border border-white/40 bg-white/20 backdrop-blur-xl shadow-[0_0.5rem_2rem_rgba(31,41,55,0.15)] transition-colors duration-500 hover:bg-white/95 hover:border-white/70">
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
  )
}

export default function TechStack() {
  return (
    <section id="stack" className="relative min-h-screen py-28 overflow-hidden bg-tech-sky">
      <Clouds />

      <div className="max-w-[73.75rem] mx-auto px-8 relative z-10">
        <Reveal className="mb-14">
          <h2 className="font-advercase font-bold text-ink text-[clamp(2.6rem,6vw,4.4rem)] leading-none drop-shadow-[0.1875rem_0.25rem_0_rgba(0,0,0,0.12)]">
            my tech stack
          </h2>
          <p className="font-google font-semibold text-ink mt-4 text-[0.9375rem]">
            tools and technologies i have worked and work with — freshly pinned up.
          </p>
        </Reveal>

        <div className="flex flex-col gap-16">
          {rows.map((row, rowIndex) => (
            <ClotheslineRow
              key={rowIndex}
              rowIndex={rowIndex}
              cards={row}
              restAngles={row.map((_, i) => restAngles[rowIndex * 3 + i])}
              renderCard={(cat) => <Card cat={cat} />}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

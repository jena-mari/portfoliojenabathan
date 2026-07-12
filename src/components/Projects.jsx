import { useEffect, useState } from "react"
import Reveal from "./Reveal"
import Postcard from "./Postcard"
import { projects } from "../data/projects"

const layouts = [
  { top: "0px", left: "2%", rot: -4 },
  { top: "60px", left: "54%", rot: 3 },
  { top: "340px", left: "0%", rot: 2.5 },
  { top: "380px", left: "52%", rot: -3 },
  { top: "700px", left: "4%", rot: -2 },
  { top: "740px", left: "50%", rot: 2 },
]

export default function Projects() {
  const [scattered, setScattered] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 760px)")
    const update = () => setScattered(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const rows = Math.ceil(projects.length / 2)

  return (
    <section id="projects" className="projects-bg py-28 text-paper relative">
      <div className="max-w-[1180px] mx-auto px-8">
        <Reveal className="max-w-xl mb-14">
          <span className="kicker-dash font-mono text-xs text-twine flex items-center gap-2.5 mb-3.5">
            projects &amp; works
          </span>
          <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,2.9rem)]">
            A selection of things I've built (and helped build).
          </h2>
          <p className="mt-3 text-[#E4E9D3] text-[15.5px] max-w-md">
            These are real postcards. Drag them around, flip them over — the address side has the actual links.
          </p>
        </Reveal>

        <p className="font-mono text-[11.5px] text-[#E4E9D3] opacity-80 mb-5 flex items-center gap-2">
          ↳ click a card to flip it · drag it anywhere on desktop
        </p>

        <div
          className={scattered ? "relative" : "grid grid-cols-1 gap-16"}
          style={scattered ? { minHeight: `${rows * 380 + 60}px` } : undefined}
        >
          {projects.map((project, i) => (
            <Postcard key={project.title} project={project} layout={layouts[i % layouts.length]} scattered={scattered} />
          ))}
        </div>
      </div>
    </section>
  )
}

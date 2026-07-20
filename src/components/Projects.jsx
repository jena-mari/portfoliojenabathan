import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import Reveal from "./Reveal"
import Postcard from "./Postcard"
import { projects } from "../data/projects"

const ROW_HEIGHT = 450
const rotationPattern = [-4, 3, 2.5, -3, -2.5, 2, -3.5, 2.5]

function getLayout(i) {
  const col = i % 2
  const row = Math.floor(i / 2)
  const top = row * ROW_HEIGHT + (col === 1 ? 58 : 0)
  const left = col === 0 ? `${1 + (row % 2) * 2}%` : `${54 + (row % 2) * 1.5}%`
  const rot = rotationPattern[i % rotationPattern.length]
  return { top: `${top}px`, left, rot }
}

function useScrollEmphasis() {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], reduceMotion ? [1, 1, 1, 1] : [0.82, 1, 1, 0.88])
  const scale = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], reduceMotion ? [1, 1, 1, 1] : [0.985, 1, 1, 0.99])

  return { ref, opacity, scale }
}

export default function Projects() {
  const [scattered, setScattered] = useState(false)
  const { ref, opacity, scale } = useScrollEmphasis()

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 760px)")
    const update = () => setScattered(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const rows = Math.ceil(projects.length / 2)

  return (
    <section id="projects" ref={ref} className="py-28 bg-ink text-paper">
      <motion.div style={{ opacity, scale }} className="max-w-[1180px] mx-auto px-8">
        <Reveal className="max-w-xl mb-14" direction="left">
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
          className={scattered ? "relative" : "grid grid-cols-1 gap-20"}
          style={scattered ? { minHeight: `${rows * ROW_HEIGHT + 60}px` } : undefined}
        >
          {projects.map((project, i) => (
            <Postcard key={project.title} project={project} layout={getLayout(i)} scattered={scattered} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

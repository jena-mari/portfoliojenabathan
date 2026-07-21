import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import Reveal from "./Reveal"
import Postcard from "./Postcard"
import { projects } from "../data/projects"
import { trinkets } from "../data/trinkets"

const ROW_HEIGHT = 720
const rotationPattern = [-4, 3, 2.5, -3, -2.5, 2, -3.5, 2.5]

function getLayout(i) {
  const col = i % 2
  const row = Math.floor(i / 2)
  const top = row * ROW_HEIGHT + (col === 1 ? 56 : 0)
  const left = col === 0 ? `${(row % 2) * 2}%` : `${55 + (row % 2) * 1.25}%`
  const rot = rotationPattern[i % rotationPattern.length]
  return { top: `${top}px`, left, rot }
}

function ProjectTrinket({ trinket, scattered }) {
  const positionStyle = scattered
    ? {
        top: trinket.top,
        left: trinket.left,
        width: trinket.width,
      }
    : { width: trinket.width }

  return (
    <motion.div
      drag={scattered}
      dragMomentum={false}
      initial={{ opacity: 0, rotate: trinket.rot - 4, scale: 0.95 }}
      whileInView={{ opacity: 1, rotate: trinket.rot, scale: 1 }}
      whileHover={{ rotate: trinket.rot * 0.45, scale: 1.04, zIndex: 30 }}
      whileTap={{ scale: 1.02, zIndex: 30 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      style={positionStyle}
      className={`group ${scattered ? "absolute z-[2] cursor-grab active:cursor-grabbing" : "relative"} touch-none select-none`}
      aria-label={trinket.alt}
    >
      <div className="trinket-bubble absolute bottom-[calc(100%+0.875rem)] left-1/2 z-30 w-[min(22rem,78vw)] -translate-x-1/2 rounded-md bg-paper px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-ink opacity-0 transition duration-200 group-hover:opacity-100">
        {trinket.note}
      </div>
      <img
        src={trinket.src}
        alt={trinket.alt}
        draggable={false}
        className="trinket-cutout block w-full max-h-[30rem] object-contain"
      />
    </motion.div>
  )
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
    const mq = window.matchMedia("(min-width: 47.5rem)")
    const update = () => setScattered(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const rows = Math.ceil(projects.length / 2)

  return (
    <section id="projects" ref={ref} className="py-28 bg-green text-paper">
      <motion.div style={{ opacity, scale }} className="max-w-[73.75rem] mx-auto px-8">
        <Reveal className="max-w-xl mb-14" direction="left">
          <span className="kicker-dash font-mono text-xs text-twine flex items-center gap-2.5 mb-3.5">
            projects &amp; works
          </span>
          <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,2.9rem)]">
            A selection of things I've built (and helped build).
          </h2>
          <p className="mt-3 text-[#E4E9D3] text-[0.96875rem] max-w-md">
            These are real postcards. Drag them around, flip them over — the address side has the actual links.
          </p>
        </Reveal>

        <p className="font-mono text-[0.71875rem] text-[#E4E9D3] opacity-80 mb-5 flex items-center gap-2">
          ↳ click a card to flip it · drag it anywhere on desktop
        </p>

        <div
          className={scattered ? "relative isolate" : "grid grid-cols-1 gap-20"}
          style={scattered ? { minHeight: `${rows * ROW_HEIGHT + 560}px` } : undefined}
        >
          {scattered && trinkets.map((trinket) => <ProjectTrinket key={trinket.id} trinket={trinket} scattered />)}
          {projects.map((project, i) => (
            <Postcard key={project.title} project={project} layout={getLayout(i)} scattered={scattered} />
          ))}
        </div>

        {!scattered && (
          <div className="mt-14 flex flex-wrap items-end justify-center gap-8">
            {trinkets.map((trinket) => (
              <ProjectTrinket key={trinket.id} trinket={trinket} scattered={false} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}

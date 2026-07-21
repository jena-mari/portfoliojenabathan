import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
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

const stampVariants = {
  hidden: { opacity: 0, scale: 1.6, rotate: -14 },
  show: (rot) => ({ opacity: 1, scale: 1, rotate: rot }),
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

export default function Journey() {
  const { ref, opacity, scale } = useScrollEmphasis()

  return (
    <section id="journey" ref={ref} className="py-28 bg-ink text-paper">
      <motion.div style={{ opacity, scale }} className="max-w-[73.75rem] mx-auto px-8">
        <Reveal className="max-w-xl mb-14">
          <span className="kicker-dash font-mono text-xs text-[#D9C88B] flex items-center gap-2.5 mb-3.5">
            the journey so far
          </span>
          <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,2.9rem)] text-paper">
            Stamps collected along the way.
          </h2>
          <p className="mt-3 text-[#B9B6A6] text-[0.96875rem] max-w-md">
            A passport page of sorts — the milestones behind the projects above.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stamps.map((s, i) => (
            <motion.div
              key={s.title}
              custom={s.rot}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={stampVariants}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.1 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="border-2 border-dashed border-paper/35 rounded-md px-5.5 py-6 bg-paper/[0.03] transition-colors duration-300 hover:bg-paper/[0.06]"
            >
              <span className="font-mono text-[0.6875rem] text-gold mb-2.5 block">{s.year}</span>
              <h3 className="font-display font-semibold text-xl text-paper mb-2">{s.title}</h3>
              <p className="text-[0.84375rem] leading-relaxed text-[#B9B6A6] m-0">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion"
import Reveal from "./Reveal"

/**
 * ── ASSETS ───────────────────────────────────────────────────────────────
 * folder.png is the shared decorative folder graphic. It's stretched with
 * object-fit: fill to exactly match each card's box, so cards can grow to
 * fit their text without ever cropping or leaving gaps in the artwork.
 * If your folder.png has fine linework that visibly distorts when
 * stretched, swap `object-fill` for `object-cover` and give FolderCard a
 * fixed `aspect-[]` matching your source image instead.
 */
const FOLDER_BG = "/items/milestones/folder.png"

const stamps = [
  {
    tag: "UOW · COMPUTER SCIENCE",
    title: "Dean's Scholar",
    body: "Ranked in the top 5% of the Computer Science & Software Engineering cohort at the University of Wollongong, recognised on the Dean's Merit List for sustained academic performance.",
    photo: "/items/milestones/deanslist.png",
    rot: -2.2,
  },
  {
    tag: "FOUNDER",
    title: "Built a community, 130+ strong",
    body: "Founded a university Filipino organisation and grew membership from 6 to 130+ students, building it into one of the largest cultural societies on campus.",
    photo: "/items/milestones/filo.png",
    rot: 1.8,
  },
  {
    tag: "STARTUP · INTERNSHIP",
    title: "Led front-end initiatives",
    body: "Interned at Synapta, an AI + education startup, owning front-end features end-to-end — from design and architecture through to production release.",
    photo: "/items/milestones/frontend.png",
    rot: 1.3,
  },
  {
    tag: "HACKATHONS",
    title: "Hackathon winner + competitor",
    body: "Competed across multiple Google Developer Groups (GDG) hackathons and placed 3rd at the Lyra × OpenAI × January Capital × Relevance AI Hackathon 2026.",
    photo: "/items/milestones/hackathon.png",
    rot: -1.6,
  },
  {
    tag: "UOW · COMPUTER SCIENCE",
    title: "Engineering & Info Sciences Scholar",
    body: "Awarded the Engineering and Information Sciences Scholarship for high academic achievement; currently contributing to a research program in computer vision and algorithmic systems.",
    photo: "/items/milestones/aws.png",
    rot: -1.9,
  },
  {
    tag: "INDUSTRY · COMPUTER SCIENCE",
    title: "Her Tech Future with ServiceNow",
    body: "One of a select group of female students from New South Wales chosen for ServiceNow's Her Tech Future program — a hands-on workshop on enterprise technology.",
    photo: "/items/milestones/servicenow.png",
    rot: 2.1,
  },
  {
    tag: "ORGANISATION",
    title: "Two newspaper features",
    body: "Featured in two publications, SBS Filipino and The Philippine Times, recognised as a multi-awarded young founder in New South Wales.",
    photo: "/items/milestones/hiraya.png",
    rot: -1.3,
  },
]

const AUTO_SPEED = 34 // px / second, idle roll speed
const CARD_GAP = 40 // px, kept in sync with the inline gap style below

function FolderCard({ stamp }) {
  return (
    <motion.div
      className="relative w-[21rem] sm:w-[27rem] md:w-[32rem] lg:w-[36rem] shrink-0 select-none"
      style={{ rotate: stamp.rot }}
      whileHover={{ rotate: 0, y: -8, transition: { type: "spring", stiffness: 260, damping: 18 } }}
    >
      <img
        src={FOLDER_BG}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-fill pointer-events-none drop-shadow-[0_18px_30px_rgba(18,66,36,0.14)]"
      />

      <span className="absolute top-[5%] right-[8%] font-mono text-[0.6rem] sm:text-[0.7rem] font-semibold tracking-wide text-[#2f6fdb] max-w-[46%] text-right leading-tight">
        {stamp.tag}
      </span>

      <div className="relative flex flex-col sm:flex-row gap-5 sm:gap-7 pt-[19%] px-[8%] pb-[10%]">
        <div className="w-full sm:w-[38%] aspect-[4/3] sm:aspect-[3/4] shrink-0 -rotate-2 rounded-lg overflow-hidden bg-black/5 shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
          <img
            src={stamp.photo}
            alt={stamp.title}
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-display font-bold uppercase leading-[1.08] text-[#141313] text-[clamp(1.15rem,2.6vw,1.75rem)] mb-2.5">
            {stamp.title}
          </h3>
          <p className="text-[#3a3733] text-[clamp(0.78rem,1.4vw,0.98rem)] leading-relaxed">
            {stamp.body}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Journey() {
  const reduceMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const isDragging = useRef(false)
  const resumeTimer = useRef(null)

  const trackRef = useRef(null)
  const trackWidth = useRef(0)
  const baseX = useMotionValue(0)

  // Triple the deck so the loop can wrap seamlessly in either direction.
  const loop = [...stamps, ...stamps, ...stamps]

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) trackWidth.current = trackRef.current.scrollWidth / 3
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (!reduceMotion && !paused && !isDragging.current) {
      baseX.set(baseX.get() - AUTO_SPEED * (delta / 1000))
    }

    const w = trackWidth.current
    if (w > 0) {
      let v = baseX.get()
      if (v <= -w) v += w
      if (v > 0) v -= w
      if (v !== baseX.get()) baseX.set(v)
    }
  })

  const handleDragStart = () => {
    isDragging.current = true
    clearTimeout(resumeTimer.current)
  }

  const handleDragEnd = () => {
    // Give momentum a moment to settle before the idle roll takes back over.
    resumeTimer.current = setTimeout(() => {
      isDragging.current = false
    }, 500)
  }

  return (
    <section id="journey" className="py-24 sm:py-28 bg-[#f6cfda] overflow-hidden">
      <div className="max-w-[73.75rem] mx-auto px-6 sm:px-8">
        <Reveal className="text-center mb-14 sm:mb-16">
          <span className="font-mono text-xs tracking-widest text-[#8a6b74]/70 block mb-2">
            stamps
          </span>
          <h2 className="font-display font-semibold text-[clamp(2.1rem,6vw,4.2rem)] leading-[1.05] text-[#141313]">
            milestones earned
            <br />
            along the way
          </h2>
        </Reveal>
      </div>

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)",
        }}
        onHoverStart={() => setPaused(true)}
        onHoverEnd={() => setPaused(false)}
      >
        <motion.div
          ref={trackRef}
          className="flex items-center cursor-grab active:cursor-grabbing px-6 sm:px-8"
          style={{ x: baseX, gap: `${CARD_GAP}px` }}
          drag="x"
          dragConstraints={{ left: -Infinity, right: Infinity }}
          dragElastic={0}
          dragMomentum={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {loop.map((s, i) => (
            <FolderCard key={`${s.title}-${i}`} stamp={s} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

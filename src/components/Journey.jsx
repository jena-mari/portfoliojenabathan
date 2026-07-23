import { useEffect, useMemo, useRef, useState } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"

const FOLDER_BG = "/items/milestones/folder.png"
const AUTO_SPEED = 30
const CARD_GAP = 40

const stamps = [
  {
    tag: "UOW · COMPUTER SCIENCE",
    title: "Dean's Scholar",
    body: "Ranked in the top 5% of the Computer Science and Software Engineering cohort at the University of Wollongong.",
    photo: "/items/milestones/deanslist.png",
    rot: -2.2,
  },
  {
    tag: "FOUNDER · COMMUNITY",
    title: "Scaled a 130+ member community",
    body: "Founded a Filipino student organisation and grew membership from 6 to more than 130—an increase of over 2,000%.",
    photo: "/items/milestones/filo.png",
    rot: 1.8,
  },
  {
    tag: "STARTUP · INTERNSHIP",
    title: "Led front-end delivery",
    body: "Owned front-end initiatives at AI education startup Synapta, translating product designs into production-ready user experiences.",
    photo: "/items/milestones/frontend.png",
    rot: 1.3,
  },
  {
    tag: "HACKATHONS · INNOVATION",
    title: "Award-winning hackathon builder",
    body: "Competed in Google Developer Group hackathons and placed 3rd at the 2026 Lyra × OpenAI × January Capital × Relevance AI Hackathon.",
    photo: "/items/milestones/hackathon.png",
    rot: -1.6,
  },
  {
    tag: "UOW · RESEARCH",
    title: "Engineering & Information Sciences Scholar",
    body: "Awarded a competitive scholarship for academic excellence and selected for specialised research in computer vision and algorithmic systems.",
    photo: "/items/milestones/aws.png",
    rot: 1.4,
  },
  {
    tag: "INDUSTRY · SERVICENOW",
    title: "Her Tech Future selectee",
    body: "Selected among female students across New South Wales for ServiceNow's hands-on technology and industry development program.",
    photo: "/items/milestones/servicenow.png",
    rot: -1.2,
  },
  {
    tag: "MEDIA · LEADERSHIP",
    title: "Featured by two publications",
    body: "Profiled by SBS Filipino and The Philippine Times for community leadership and achievements as a young founder in New South Wales.",
    photo: "/items/milestones/hiraya.png",
    rot: 1.7,
  },
]

function FolderCard({ stamp }) {
  return (
    <motion.article
      className="relative aspect-[4/3] w-[min(90vw,23rem)] shrink-0 select-none sm:w-[28rem] lg:w-[33rem]"
      style={{ rotate: stamp.rot }}
      whileHover={{
        rotate: 0,
        y: -10,
        scale: 1.015,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
    >
      <img
        src={FOLDER_BG}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_20px_34px_rgba(18,66,36,0.16)]"
      />

      <span className="absolute right-[9%] top-[6.5%] max-w-[48%] text-right font-mono text-[0.5rem] font-semibold leading-tight tracking-[0.08em] text-[#2f6fdb] sm:text-[0.6rem] lg:text-[0.66rem]">
        {stamp.tag}
      </span>

      <div className="absolute inset-x-[7.5%] bottom-[9.5%] top-[23.5%] flex gap-[5%]">
        <div className="w-[37%] shrink-0 -rotate-2 overflow-hidden rounded-[0.65rem] bg-black/5 shadow-[0_7px_18px_rgba(0,0,0,0.18)]">
          <img
            src={stamp.photo}
            alt=""
            aria-hidden="true"
            draggable={false}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
          <h3 className="mb-2 font-display text-[clamp(0.95rem,3.7vw,1.7rem)] font-bold uppercase leading-[1.02] text-[#141313] sm:mb-3">
            {stamp.title}
          </h3>
          <p className="max-w-[29ch] text-[clamp(0.58rem,2.15vw,0.88rem)] leading-[1.55] text-[#3a3733]">
            {stamp.body}
          </p>
        </div>
      </div>
    </motion.article>
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
  const loop = useMemo(() => [...stamps, ...stamps, ...stamps], [])
  const deck = reduceMotion ? stamps : loop

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const measure = () => {
      trackWidth.current = track.scrollWidth / (reduceMotion ? 1 : 3)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)

    return () => observer.disconnect()
  }, [reduceMotion])

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    },
    [],
  )

  useAnimationFrame((_, delta) => {
    const width = trackWidth.current
    if (!width) return

    if (!reduceMotion && !paused && !isDragging.current) {
      baseX.set(baseX.get() - AUTO_SPEED * Math.min(delta / 1000, 0.05))
    }

    const currentX = baseX.get()
    if (currentX <= -width) baseX.set(currentX + width)
    else if (currentX > 0) baseX.set(currentX - width)
  })

  const handleDragStart = () => {
    isDragging.current = true
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
  }

  const handleDragEnd = () => {
    resumeTimer.current = setTimeout(() => {
      isDragging.current = false
    }, 650)
  }

  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="overflow-hidden bg-[#f6cfda] py-16 sm:py-20 lg:py-28"
    >
      <motion.header
        className="mx-auto mb-10 max-w-[73.75rem] px-5 text-center sm:mb-14 sm:px-8 lg:mb-16"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <span className="mb-3 block font-mono text-[0.68rem] tracking-[0.24em] text-[#72555e] sm:text-xs">
          SELECTED MILESTONES
        </span>
        <h2
          id="journey-title"
          className="font-display text-[clamp(2.2rem,7vw,4.3rem)] font-semibold leading-[1.02] text-[#141313]"
        >
          milestones earned
          <br />
          along the way
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#5f4850] sm:text-base">
          A growing record of academic excellence, product leadership, and
          community impact.
        </p>
      </motion.header>

      <div
        className={`relative py-4 sm:py-6 ${
          reduceMotion ? "overflow-x-auto" : ""
        }`}
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 4%, black 96%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 4%, black 96%, transparent 100%)",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <motion.div
          ref={trackRef}
          className={`flex w-max items-center px-4 sm:px-8 ${
            reduceMotion ? "" : "cursor-grab active:cursor-grabbing"
          }`}
          style={{ x: reduceMotion ? 0 : baseX, gap: CARD_GAP }}
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: -100000, right: 100000 }}
          dragElastic={0.04}
          dragMomentum
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          aria-label="Career and academic milestones. Drag horizontally to explore."
        >
          {deck.map((stamp, index) => (
            <FolderCard key={`${stamp.title}-${index}`} stamp={stamp} />
          ))}
        </motion.div>
      </div>

      <p className="mt-5 text-center font-mono text-[0.62rem] tracking-[0.16em] text-[#72555e] sm:mt-7 sm:text-[0.68rem]">
        DRAG TO EXPLORE
      </p>
    </section>
  )
}

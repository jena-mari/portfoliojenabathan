import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Reveal from "./Reveal"

const stamps = [
  {
    tag: "UOW · COMPUTER SCIENCE",
    title: "Dean's Scholar",
    body: "Ranked in the top 5% of the Computer Science & Software Engineering cohort at the University of Wollongong, recognised on the Dean's Merit List for sustained academic performance.",
    photo: "/items/milestones/deanslist.png",
    accent: "#2f6fdb",
  },
  {
    tag: "FOUNDER",
    title: "Built a community, 130+ strong",
    body: "Founded a university Filipino organisation and grew membership from 6 to 130+ students, building it into one of the largest cultural societies on campus.",
    photo: "/items/milestones/filo.png",
    accent: "#c65a86",
  },
  {
    tag: "STARTUP · INTERNSHIP",
    title: "Led front-end initiatives",
    body: "Interned at Synapta, an AI + education startup, owning front-end features end-to-end — from design and architecture through to production release.",
    photo: "/items/milestones/frontend.jpg",
    accent: "#4a9b6e",
  },
  {
    tag: "HACKATHONS",
    title: "Hackathon winner + competitor",
    body: "Competed across multiple hackathons, and notably placed 3rd at the Lyra × OpenAI × January Capital × Relevance AI Hackathon 2026.",
    photo: "/items/milestones/hackathon.png",
    accent: "#e2734f",
  },
  {
    tag: "UOW · COMPUTER SCIENCE",
    title: "Engineering & Info Sciences Scholar",
    body: "Awarded the Engineering and Information Sciences Scholarship for high academic achievement; currently contributing to a research program in computer vision and algorithmic systems.",
    photo: "/items/milestones/aws.png",
    accent: "#caa23c",
  },
  {
    tag: "INDUSTRY · COMPUTER SCIENCE",
    title: "Her Tech Future with ServiceNow",
    body: "One of a select group of female students from New South Wales chosen for ServiceNow's Her Tech Future program — a hands-on workshop on enterprise technology.",
    photo: "/items/milestones/servicenow.png",
    accent: "#2f6fdb",
  },
  {
    tag: "ORGANISATION",
    title: "Two newspaper features",
    body: "Featured in two publications, SBS Filipino and The Philippine Times, recognised as a multi-awarded young founder in New South Wales.",
    photo: "/items/milestones/hiraya.png",
    accent: "#c65a86",
  },
]

const spreads = []
for (let i = 0; i < stamps.length; i += 2) spreads.push(stamps.slice(i, i + 2))

function VisaStamp({ stamp, id }) {
  const arcId = `stamp-arc-${id}`
  return (
    <div className="relative mx-auto w-[9.5rem] sm:w-[11rem]" style={{ color: stamp.accent }}>
      <svg viewBox="0 0 220 220" className="w-full">
        <defs>
          <path id={arcId} d="M110,110 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
        </defs>
        <circle cx="110" cy="110" r="104" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 5" opacity="0.5" />
        <circle cx="110" cy="110" r="92" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text fontSize="11.5" letterSpacing="2" fill="currentColor" className="font-google uppercase">
          <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
            {stamp.tag}
          </textPath>
        </text>
      </svg>
      <div
        className="absolute inset-[17%] overflow-hidden rounded-full"
        style={{ border: `3px solid ${stamp.accent}` }}
      >
        <img
          src={stamp.photo}
          alt={stamp.title}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

function PassportPage({ stamp, id, side }) {
  return (
    <div
      className={`relative flex min-h-[32rem] flex-col items-center px-6 py-10 sm:min-h-[35rem] sm:px-10 sm:py-14 ${
        side === "left" ? "sm:rounded-l-2xl" : "sm:rounded-r-2xl"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] text-[#141313]"
        style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "14px 14px" }}
      />
      {stamp ? (
        <>
          <VisaStamp stamp={stamp} id={id} />
          <h3 className="mt-6 text-center font-google font-bold uppercase leading-tight text-[#141313] text-[clamp(1.05rem,2.2vw,1.5rem)]">
            {stamp.title}
          </h3>
          <p className="mt-3 max-w-xs text-center text-[0.85rem] leading-relaxed text-[#3a3733] sm:text-[0.95rem]">
            {stamp.body}
          </p>
          <span className="mt-5 font-google text-[0.65rem] text-[#8a6b74]">NO. {String(id + 1).padStart(2, "0")}</span>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center opacity-60">
          <span className="font-google italic text-lg text-[#8a6b74]">more stamps coming soon...</span>
        </div>
      )}
    </div>
  )
}

const pageVariants = {
  enter: (dir) => ({ rotateY: dir > 0 ? 78 : -78, opacity: 0 }),
  center: { rotateY: 0, opacity: 1 },
  exit: (dir) => ({ rotateY: dir > 0 ? -78 : 78, opacity: 0 }),
}

export default function Journey() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const canPrev = index > 0
  const canNext = index < spreads.length - 1

  const go = (dir) => {
    if ((dir < 0 && !canPrev) || (dir > 0 && !canNext)) return
    setDirection(dir)
    setIndex((i) => i + dir)
  }

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -70) go(1)
    else if (info.offset.x > 70) go(-1)
  }

  const [left, right] = spreads[index]

  return (
    <section
      id="journey"
      data-scroll-section
      data-section-color="#F6CFDA"
      className="overflow-hidden py-20 font-google sm:py-28"
    >
      <div className="max-w-[73.75rem] mx-auto px-6 sm:px-8">
        <Reveal className="text-center mb-14 sm:mb-16">
          <span className="mb-2 block font-google text-xs tracking-widest text-[#8a6b74]/70">stamps</span>
          <h2 className="font-display font-semibold text-[clamp(2.1rem,6vw,4.2rem)] leading-[1.05] text-[#141313]">
            milestones earned
            <br />
            along the way
          </h2>
        </Reveal>

        <div className="mx-auto max-w-[52rem]" style={{ perspective: 1800 }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={reduceMotion ? undefined : pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              drag={spreads.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={handleDragEnd}
              className="relative grid grid-cols-1 sm:grid-cols-2 overflow-hidden rounded-2xl bg-[#fbf6ec] shadow-[0_30px_60px_rgba(20,10,10,0.22)] cursor-grab active:cursor-grabbing"
            >
              <PassportPage stamp={left} id={index * 2} side="left" />
              <div className="hidden sm:block absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
              <PassportPage stamp={right} id={index * 2 + 1} side="right" />
            </motion.div>
          </AnimatePresence>

          <div className="mt-7 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={!canPrev}
              aria-label="Previous spread"
              className="font-google text-2xl text-[#141313] transition-opacity disabled:opacity-25 hover:opacity-60"
            >
              ‹
            </button>

            <div className="flex items-center gap-2">
              {spreads.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-[#141313]" : "w-1.5 bg-[#141313]/25"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              disabled={!canNext}
              aria-label="Next spread"
              className="font-google text-2xl text-[#141313] transition-opacity disabled:opacity-25 hover:opacity-60"
            >
              ›
            </button>
          </div>

          <p className="mt-2 text-center font-google text-[0.65rem] tracking-widest text-[#8a6b74]/70">
            drag a page, or use the arrows
          </p>
        </div>
      </div>
    </section>
  )
}

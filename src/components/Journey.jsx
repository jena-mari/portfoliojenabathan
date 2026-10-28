import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Reveal from "./Reveal"

const linkedInActivity = "https://www.linkedin.com/in/jenabathan/recent-activity/all/"
const linkedInPosts = [
  { urn: "urn:li:ugcPost:7518171455512014849", height: 628 },
  { urn: "urn:li:ugcPost:7517799989687881729", height: 628 },
  { urn: "urn:li:share:7503699093160886272", height: 719 },
  { urn: "urn:li:ugcPost:7502596161107578880", height: 628 },
  { urn: "urn:li:ugcPost:7497451037285416960", height: 550 },
]

// Recent updates first, followed by the milestones that came before them.
const recentStamps = [
  {
    tag: "HACK48 · MELLOWAY",
    title: "48 hours, one hacker house",
    body: "Built Melloway with Shana at Hack48: a date and hangout planner that turns saved social discoveries into personalised itineraries. Two days of building, testing and pitching — and a prototype we're excited to keep growing.",
    date: "22 October 2026",
    photo: "/items/melloway.png",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7518831583223513090/",
    accent: "#c65a86",
  },
  {
    tag: "FILO UOW · GIVING BACK",
    title: "Little doodles, real impact",
    body: "Organised a Doodle Booth with FILO UOW and UOW Pulse for International Week. Drawing portraits of 50+ students and staff helped us raise around A$450 for typhoon-affected families back home in Pampanga, Philippines.",
    date: "19 October 2026",
    monogram: "50+",
    caption: "portraits for a cause",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7517799990740717568/",
    accent: "#4a9b6e",
  },
  {
    tag: "MYC UNCENSORED · WISTEM",
    title: "Finding my voice in STEM",
    body: "Joined Anika Shinde on the MYC Uncensored podcast to talk about confidence, the challenges of being a woman in STEM, and learning from people who push me to grow. Recorded in March, shared in September.",
    date: "Shared 10 September 2026",
    monogram: "on air",
    caption: "Women in STEM · ep. 13",
    href: "https://lnkd.in/g5XWE_pE",
    linkLabel: "Listen to the podcast",
    accent: "#2f6fdb",
  },
  {
    tag: "HACK FOR HUMANITY · 2ND PLACE",
    title: "Building more time for care",
    body: "Won second place with Louminate at Base44's Hack for Humanity. As a full-stack developer, I helped turn conversations with Lou's Place into a case documentation tool, giving frontline staff more time for the women they support.",
    date: "7 September 2026",
    photo: "/items/louminate.png",
    href: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7502596161107578880/",
    accent: "#e2734f",
  },
  {
    tag: "HACK THE GONG · SARGE",
    title: "Sharing the sun, fairly",
    body: "Spent a weekend building Sarge, a community energy prototype for Wollongong. We explored contribution credits and fair allocation with hardship scoring and Nash welfare optimisation — an ambitious challenge in maths, code and teamwork.",
    date: "2026",
    photo: "/items/sarge.png",
    href: "https://www.linkedin.com/posts/jenabathan_hackthegong2026-activity-7497451039822917633-OzFh",
    accent: "#caa23c",
  },
  {
    tag: "FILO UOW · SMALL BUILDS",
    title: "A small tool for 150+ people",
    body: "Built a roster system for FILO UOW to manage members, share outreach across the team, and track invitations, events and attendance. A practical fix that helps us keep personal connections as our community grows.",
    photo: "/items/milestones/filo.png",
    href: linkedInActivity,
    accent: "#c65a86",
  },
]

const earlierStamps = [
  {
    tag: "UOW · COMPUTER SCIENCE",
    title: "Dean's Scholar",
    body: "Ranked in the top 5% of the Computer Science & Software Engineering cohort at the University of Wollongong, recognised on the Dean's Merit List for sustained academic performance.",
    photo: "/items/milestones/deanslist.png",
    accent: "#2f6fdb",
  },
  {
    tag: "FOUNDER",
    title: "Built a community from six",
    body: "Co-founded FILO UOW and helped grow it from six students into a community of more than 150 members, creating space for friendship, culture and giving back.",
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
    title: "Third place at my first hackathon",
    body: "Built Shortlist with my team and placed third at the OpenAI × January Capital × Lyra × Relevance AI Hackathon. I led the frontend and branding, helped debug the backend, and delivered the opening pitch.",
    date: "1 May 2026",
    href: "https://www.linkedin.com/posts/jenabathan_our-team-placed-3rd-at-the-openai-january-activity-7456868572263370752-Dehi",
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

const stamps = [...recentStamps, ...earlierStamps]
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
        className="absolute inset-[17%] flex flex-col items-center justify-center overflow-hidden rounded-full"
        style={{ border: `3px solid ${stamp.accent}` }}
      >
        {stamp.photo ? (
          <img
            src={stamp.photo}
            alt={stamp.title}
            draggable={false}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <span className="font-display text-3xl font-semibold sm:text-4xl">{stamp.monogram}</span>
            <span className="mt-2 max-w-[7rem] text-center font-google text-[0.6rem] uppercase tracking-wider">{stamp.caption}</span>
          </>
        )}
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
          <span className="mt-5 text-center font-google text-[0.65rem] uppercase tracking-widest text-[#8a6b74]">
            {stamp.date || (id < recentStamps.length ? "Recent chapter" : "Earlier milestone")}
          </span>
          <h3 className="mt-3 text-center font-google font-bold uppercase leading-tight text-[#141313] text-[clamp(1.05rem,2.2vw,1.5rem)]">
            {stamp.title}
          </h3>
          <p className="mt-3 max-w-xs text-center text-[0.85rem] leading-relaxed text-[#3a3733] sm:text-[0.95rem]">
            {stamp.body}
          </p>
          {stamp.href && (
            <a
              href={stamp.href}
              target="_blank"
              rel="noopener noreferrer"
              onPointerDown={(event) => event.stopPropagation()}
              className="mt-5 text-center text-xs text-[#754b59] underline decoration-[#8a6b74]/40 underline-offset-4 transition-colors hover:text-[#141313]"
            >
              {stamp.linkLabel || (stamp.href === linkedInActivity ? "More on LinkedIn" : "Read the LinkedIn post")} ↗
            </a>
          )}
          <span className="mt-auto pt-5 font-google text-[0.65rem] text-[#8a6b74]">NO. {String(id + 1).padStart(2, "0")}</span>
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
          <span className="mb-2 block font-google text-xs tracking-widest text-[#8a6b74]/70">journey · recent chapters first</span>
          <h2 className="font-display font-semibold text-[clamp(2.1rem,6vw,4.2rem)] leading-[1.05] text-[#141313]">
            what I've been
            <br />
            up to lately
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[#5f4c53] sm:text-base">
            Hackathon weekends, community projects and little steps outside my comfort zone.
            A few chapters from my LinkedIn, collected here.
          </p>
          <a
            href={linkedInActivity}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex text-xs text-[#754b59] underline underline-offset-4 transition-colors hover:text-[#141313]"
          >
            Follow along on LinkedIn ↗
          </a>
        </Reveal>

        <div className="mx-auto mb-14 grid max-w-[1040px] grid-cols-1 gap-8 sm:mb-16 md:grid-cols-2">
          {linkedInPosts.map((post, postIndex) => (
            <figure key={post.urn} className="mx-auto w-full min-w-0 max-w-[504px]">
              <iframe
                src={`https://www.linkedin.com/embed/feed/update/${post.urn}?collapsed=1`}
                height={post.height}
                width="504"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                title={`Jena Bathan's LinkedIn post ${postIndex + 1}`}
                className="block w-full rounded-xl border-0 bg-white shadow-postal"
              />
              <figcaption className="mt-3 text-center text-xs text-[#754b59]">
                <a
                  href={`https://www.linkedin.com/feed/update/${post.urn}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors hover:text-[#141313]"
                >
                  View this post on LinkedIn ↗
                </a>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mx-auto max-w-[52rem]" style={{ perspective: 1800 }}>
          <div className="mb-4 flex items-center justify-between gap-4 text-[0.65rem] uppercase tracking-widest text-[#754b59]">
            <span>{index * 2 < recentStamps.length ? "Lately" : "Earlier milestones"}</span>
            <span aria-live="polite" aria-atomic="true">Spread {index + 1} of {spreads.length}</span>
          </div>
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
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to spread ${i + 1}`}
                  aria-current={i === index ? "page" : undefined}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1)
                    setIndex(i)
                  }}
                  className="flex h-8 w-6 items-center justify-center"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-6 bg-[#141313]" : "w-1.5 bg-[#141313]/25"
                    }`}
                  />
                </button>
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

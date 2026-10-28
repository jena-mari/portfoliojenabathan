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
const journeyCards = stamps.map((stamp, index) => ({
  stamp,
  post: linkedInPosts[index],
  id: index,
}))

function VisaStamp({ stamp, id }) {
  const arcId = `stamp-arc-${id}`
  return (
    <div className="relative mx-auto w-[7.5rem] sm:w-[8.5rem]" style={{ color: stamp.accent }}>
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

function JourneyCard({ stamp, post, id }) {
  return (
    <article className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl bg-[#fbf6ec] shadow-[0_22px_45px_rgba(20,10,10,0.16)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] text-[#141313]"
        style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "14px 14px" }}
      />
      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        <VisaStamp stamp={stamp} id={id} />
        <span className="mt-4 text-center font-google text-[0.6rem] uppercase tracking-widest text-[#8a6b74]">
          {stamp.date || (id < recentStamps.length ? "Recent chapter" : "Earlier milestone")}
        </span>
        <h3 className="mt-2 text-center font-google text-[1.05rem] font-bold uppercase leading-tight text-[#141313]">
          {stamp.title}
        </h3>
        <p className="mt-3 text-center text-[0.82rem] leading-relaxed text-[#3a3733]">
          {stamp.body}
        </p>

        {post && (
          <iframe
            src={`https://www.linkedin.com/embed/feed/update/${post.urn}?collapsed=1`}
            height={post.height}
            width="504"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            title={`LinkedIn post for ${stamp.title}`}
            className="mt-5 block w-full rounded-lg border-0 bg-white"
          />
        )}

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
        <span className="mt-5 text-center font-google text-[0.6rem] text-[#8a6b74]">NO. {String(id + 1).padStart(2, "0")}</span>
      </div>
    </article>
  )
}

function JourneyGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {journeyCards.map(({ stamp, post, id }) => (
        <JourneyCard key={stamp.title} stamp={stamp} post={post} id={id} />
      ))}
    </div>
  )
}

export default function Journey() {
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
        <p className="mb-8 text-center text-xs uppercase tracking-[0.18em] text-[#754b59]">
          passport stamps + LinkedIn updates · four cards per row on desktop
        </p>
        <JourneyGrid />
      </div>
    </section>
  )
}

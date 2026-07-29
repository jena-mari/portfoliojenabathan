import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import Reveal from "./Reveal"

const contacts = [
  { label: "email", value: "jenamaribathan@gmail.com", href: "mailto:jenamaribathan@gmail.com", icon: "mail" },
  { label: "linkedin", value: "linkedin.com/in/jenabathan", href: "https://www.linkedin.com/in/jenabathan/", icon: "linkedin" },
  { label: "phone", value: "(0427) 575 787", href: "tel:+61427575787", icon: "phone" },
]

function useScrollEmphasis() {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], reduceMotion ? [1, 1, 1, 1] : [0.84, 1, 1, 0.9])
  const scale = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], reduceMotion ? [1, 1, 1, 1] : [0.985, 1, 1, 0.992])

  return { ref, opacity, scale }
}

function ContactIcon({ type }) {
  if (type === "mail") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h13A2.5 2.5 0 0 1 20 6.5v.4l-8 4.6-8-4.6v-.4Z" />
        <path d="M2 8.9V17.5A2.5 2.5 0 0 0 4.5 20h13a2.5 2.5 0 0 0 2.5-2.5V8.9l-8 4.6-8-4.6Z" />
        <circle cx="19.5" cy="5.5" r="2.5" />
      </svg>
    )
  }
  if (type === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="4" />
        <rect x="6.2" y="9.7" width="2.9" height="9.3" fill="#fff" />
        <circle cx="7.65" cy="6.2" r="1.7" fill="#fff" />
        <path
          d="M11.6 9.7h2.8v1.3c.4-.7 1.3-1.5 2.8-1.5 2.1 0 3.4 1.4 3.4 4v5.5h-2.9v-4.9c0-1.2-.5-2-1.6-2-.9 0-1.5.6-1.7 1.2-.1.2-.1.5-.1.8v4.9h-2.9c0-.1 0-8.4 0-9.3Z"
          fill="#fff"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.2 3.5 8.6 3l2 5.1-2.1 1.5a15.8 15.8 0 0 0 5.9 5.9l1.5-2.1 5.1 2-.5 3.4c-.2 1.3-1.3 2.2-2.6 2.1C9.9 20.2 3.8 14.1 3.1 6.1 3 4.8 3.9 3.7 5.2 3.5Z" />
    </svg>
  )
}

export default function Contact() {
  const { ref, opacity, scale } = useScrollEmphasis()
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="contact"
      ref={ref}
      data-scroll-section
      data-section-color="#F7F2E8"
      className="flex min-h-[100svh] items-center py-16 sm:py-20 lg:py-24"
    >
      <motion.div style={{ opacity, scale }} className="mx-auto w-full max-w-[92rem] px-5 sm:px-8">
        <div className="rounded-sm bg-[#F7F2E8] px-5 py-14 sm:px-10 sm:py-16 lg:px-20 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <Reveal direction="right">
                <h2 className="max-w-[10.5em] font-display text-[clamp(2.65rem,10vw,6rem)] font-regular leading-[1.0] tracking-[-0.05em] text-[#942224]">
                  I'd love to get in
                  <br />
                  contact with you.
                </h2>

                <p className="mt-8 max-w-[42rem] font-google text-[0.95rem] font-medium leading-relaxed text-[#942224] sm:text-base">
                  Got a project, opportunity, or just think I’m someone you’d mesh with well? My DMs are always open
                  for people who have something to talk about. ⡞⠳⣄⣀⣠⠞⢷ ֹ۪
                </p>
              </Reveal>

              <div className="mt-10 flex flex-col gap-4">
                {contacts.map((c, i) => (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: i * 0.09, duration: 0.5, ease: "easeOut" }}
                    whileHover={reduceMotion ? undefined : { x: 8, scale: 1.01 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                    className="group flex min-w-0 items-center gap-4 rounded-2xl bg-white px-4 py-5 text-[#942224] shadow-[0_5px_0_rgba(72,35,28,0.18),0_12px_28px_rgba(72,35,28,0.08)] transition-shadow hover:shadow-[0_7px_0_rgba(148,34,36,0.22),0_16px_32px_rgba(72,35,28,0.1)] sm:gap-8 sm:px-10 sm:py-6"
                  >
                    <span className="shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      <ContactIcon type={c.icon} />
                    </span>
                    <span className="min-w-0 [overflow-wrap:anywhere] font-google text-sm font-bold min-[380px]:text-base sm:text-xl">
                      {c.value}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            <Reveal direction="scale" delay={0.12} className="flex items-center justify-center">
              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : { y: [0, -10, 0], rotate: [-0.8, 0.8, -0.8] }
                }
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={reduceMotion ? undefined : { rotate: 2, scale: 1.025 }}
                className="w-full max-w-[30rem]"
              >
                <img
                  src="/items/mailbox.PNG"
                  alt="A hand-drawn red postbox marked Mail me"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full select-none object-contain drop-shadow-[0_18px_18px_rgba(72,35,28,0.12)]"
                />
              </motion.div>
            </Reveal>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

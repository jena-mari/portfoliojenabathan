import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import Reveal from "./Reveal"

const contacts = [
  { label: "email", value: "jenamaribathan@gmail.com", href: "mailto:jenamaribathan@gmail.com", icon: "mail" },
  { label: "linkedin", value: "linkedin.com/in/jenabathan", href: "https://www.linkedin.com/in/jenabathan/", icon: "linkedin" },
  { label: "github", value: "github.com/jena-mari", href: "https://github.com/jena-mari", icon: "github" },
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
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-1.03-.01-1.87-2.78.61-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}

export default function Contact() {
  const { ref, opacity, scale } = useScrollEmphasis()

  return (
    <section
      id="contact"
      ref={ref}
      data-scroll-section
      data-section-color="#EDE0C4"
      className="flex min-h-[100svh] items-center py-20 sm:py-24 lg:py-28"
    >
      <motion.div style={{ opacity, scale }} className="mx-auto w-full max-w-[73.75rem] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
          <Reveal direction="right">
            <div className="relative max-w-md">
              <h2 className="font-display font-black text-[clamp(2.75rem,6vw,4rem)] leading-[0.95] text-ink">
                I'd love
                <br />
                to get in
                <br />
                contact
                <br />
                with you.
              </h2>

              <img
                src="/jena-logo.png"
                alt=""
                loading="lazy"
                decoding="async"
                className="pointer-events-none absolute top-[2.9em] w-[7.25rem] select-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.12)] sm:left-[9rem] sm:w-[9.5rem]"
              />
            </div>

            <p className="mt-8 max-w-md text-base leading-relaxed text-ink-soft">
              Got a project, opportunity, or just think I'm someone you'd mesh with well? My DMs are always open for
              people who have something to talk about. ⡞⠳⣄⣀⣠⠞⢷ ֹ۪
            </p>
          </Reveal>

          <Reveal direction="scale" delay={0.1} className="flex flex-col gap-6">
            {contacts.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 18 } }}
                className="flex min-w-0 items-center gap-5 rounded-2xl bg-white px-6 py-6 text-ink shadow-[0_10px_24px_rgba(20,19,17,0.08)] sm:gap-6 sm:px-8 sm:py-7"
              >
                <span className="shrink-0">
                  <ContactIcon type={c.icon} />
                </span>
                <span className="min-w-0 [overflow-wrap:anywhere] font-sans text-[0.95rem] font-bold sm:text-lg">
                  {c.value}
                </span>
              </motion.a>
            ))}
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}

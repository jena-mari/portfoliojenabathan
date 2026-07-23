import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import Reveal from "./Reveal"

const contacts = [
  { label: "email", value: "jenamaribathan@gmail.com", href: "mailto:jenamaribathan@gmail.com" },
  { label: "linkedin", value: "/in/jenabathan", href: "https://www.linkedin.com/in/jenabathan/" },
  { label: "github", value: "/jena-mari", href: "https://github.com/jena-mari" },
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

export default function Contact() {
  const { ref, opacity, scale } = useScrollEmphasis()

  return (
    <section id="contact" ref={ref} className="py-28 bg-paper-dark">
      <motion.div style={{ opacity, scale }} className="max-w-[73.75rem] mx-auto px-8">
        <Reveal className="mb-14" direction="right">
          <span className="kicker-dash font-mono text-xs text-pink-deep flex items-center gap-2.5 mb-3.5">say hello</span>
          <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,2.9rem)]">
            I'd love to get in contact with you.
          </h2>
        </Reveal>

        <Reveal direction="scale" delay={0.1}>
          <div className="bg-cream-card shadow-postal rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-[1.3fr_1fr]">
            <div className="ruled-lines-lg p-10 md:p-12">
              <p className="font-display italic text-lg leading-[2.125rem] text-ink-soft max-w-md">
                Got a project, opportunity, or just think I’m someone you’d mesh with well? My DMs are always open for people who have something to talk about. ⡞⠳⣄⣀⣠⠞⢷ ֹ۪
              </p>
              <p className="font-display italic text-lg text-ink mt-2">— jena</p>
            </div>
            <div className="p-10 md:p-12 border-t md:border-t-0 md:border-l border-dashed border-paper-line flex flex-col gap-6">
              <div className="w-[4.375rem] h-[5.25rem] border-[0.09375rem] border-dashed border-ink-soft ml-auto flex items-center justify-center text-center font-mono text-[0.5625rem] text-ink-soft leading-relaxed">
                place
                <br />
                stamp
                <br />
                here
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-4">
                {contacts.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2.5 font-mono text-[0.84375rem] pb-3 border-b border-paper-line transition-all duration-200 hover:text-pink-deep hover:border-pink-deep hover:translate-x-1"
                    >
                      <span className="text-ink-soft text-[0.65625rem] w-16 flex-shrink-0">{c.label}</span>
                      {c.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </motion.div>
    </section>
  )
}

import Reveal from "./Reveal"

const contacts = [
  { label: "email", value: "jenamaribathan@gmail.com", href: "mailto:jenamaribathan@gmail.com" },
  { label: "linkedin", value: "/in/jenabathan", href: "https://www.linkedin.com/in/jenabathan/" },
  { label: "github", value: "/jena-mari", href: "https://github.com/jena-mari" },
]

export default function Contact() {
  return (
    <section id="contact" className="py-28 bg-paper-dark">
      <div className="max-w-[1180px] mx-auto px-8">
        <Reveal className="mb-14" direction="right">
          <span className="kicker-dash font-mono text-xs text-stamp flex items-center gap-2.5 mb-3.5">say hello</span>
          <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,2.9rem)]">
            Wish you were here — let's talk.
          </h2>
        </Reveal>

        <Reveal direction="scale" delay={0.1}>
          <div className="bg-cream-card shadow-postal rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-[1.3fr_1fr]">
            <div className="ruled-lines-lg p-10 md:p-12">
              <p className="font-display italic text-lg leading-[34px] text-ink-soft max-w-md">
                Got a project, an opportunity, or just want to talk shop about design and code? I'm always up for a
                good conversation — drop a line and I'll write back.
              </p>
              <p className="font-display italic text-lg text-ink mt-2">— jena</p>
            </div>
            <div className="p-10 md:p-12 border-t md:border-t-0 md:border-l border-dashed border-paper-line flex flex-col gap-6">
              <div className="w-[70px] h-[84px] border-[1.5px] border-dashed border-ink-soft ml-auto flex items-center justify-center text-center font-mono text-[9px] text-ink-soft leading-relaxed">
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
                      className="flex items-center gap-2.5 font-mono text-[13.5px] pb-3 border-b border-paper-line transition-all duration-200 hover:text-stamp hover:border-stamp hover:translate-x-1"
                    >
                      <span className="text-ink-soft text-[10.5px] w-16 flex-shrink-0">{c.label}</span>
                      {c.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

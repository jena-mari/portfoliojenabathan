import { useEffect, useState } from "react"

const links = [
  { href: "#stack", label: "stack" },
  { href: "#projects", label: "projects" },
  { href: "#journey", label: "journey" },
  { href: "#photobooth", label: "photobooth" },
  { href: "#contact", label: "contact" },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const linkClass = scrolled
    ? "text-ink hover:border-ink hover:bg-paper-dark"
    : "text-paper bg-ink/28 border-paper/30 shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.18)] hover:border-paper hover:bg-paper hover:text-ink"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between transition-all duration-300 ${
        scrolled ? "bg-paper/92 backdrop-blur-md shadow-[0_0.0625rem_0_rgba(42,42,34,0.16)] px-8 py-3.5" : "px-8 py-5"
      }`}
    >
      <a
        href="#top"
        aria-label="Back to top"
        className="w-14 h-14 flex items-center justify-center -rotate-[8deg] transition-transform duration-500 hover:rotate-[10deg] hover:scale-110 flex-shrink-0 drop-shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.18)]"
      >
        <img src="/jena-logo.png" alt="" className="w-full h-full object-contain scale-125" />
      </a>
      <ul className="hidden sm:flex gap-2 list-none m-0 p-0">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`font-mono text-sm md:text-[0.9375rem] font-black lowercase px-3.5 py-2.5 rounded-full border-2 border-transparent transition-all duration-200 ${linkClass}`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import { useEffect, useState } from "react"

const links = [
  { href: "#stack", label: "stack" },
  { href: "#projects", label: "projects" },
  { href: "#journey", label: "journey" },
  { href: "#contact", label: "contact" },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between transition-all duration-300 ${
        scrolled ? "bg-paper/90 backdrop-blur-md shadow-[0_1px_0_rgba(42,42,34,0.1)] px-8 py-3" : "px-8 py-[18px]"
      }`}
    >
      <a
        href="#top"
        aria-label="Back to top"
        className="w-11 h-11 rounded-full border-[1.5px] border-dashed border-ink flex items-center justify-center font-mono font-bold text-[13px] -rotate-[8deg] transition-transform duration-500 hover:rotate-[10deg] hover:scale-110 flex-shrink-0 bg-paper"
      >
        JB
      </a>
      <ul className="hidden sm:flex gap-2 list-none m-0 p-0">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="font-mono text-xs lowercase px-3.5 py-2 rounded-full border border-transparent transition-all duration-200 hover:border-ink hover:bg-paper-dark"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

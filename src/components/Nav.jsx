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

  const linkClass = scrolled
    ? "text-ink hover:border-ink hover:bg-paper-dark"
    : "text-paper bg-ink/28 border-paper/30 shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.18)] hover:border-paper hover:bg-paper hover:text-ink"

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-paper/92 px-3 py-2.5 shadow-[0_0.0625rem_0_rgba(42,42,34,0.16)] backdrop-blur-md sm:px-8 sm:py-3.5"
          : "px-3 py-3 sm:px-8 sm:py-5"
      }`}
    >
      <a
        href="#top"
        aria-label="Back to top"
        className="flex h-10 w-10 flex-shrink-0 -rotate-[8deg] items-center justify-center drop-shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.18)] transition-transform duration-500 hover:rotate-[10deg] hover:scale-110 sm:h-14 sm:w-14"
      >
        <img src="/jena-logo.png" alt="" className="w-full h-full object-contain scale-125" />
      </a>
      <ul className="m-0 flex min-w-0 list-none gap-0.5 overflow-x-auto p-0 sm:gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`block whitespace-nowrap rounded-full border-2 border-transparent px-2 py-2 font-mono text-[0.68rem] font-black lowercase transition-all duration-200 min-[380px]:px-2.5 min-[380px]:text-xs sm:px-3.5 sm:py-2.5 sm:text-sm md:text-[0.9375rem] ${linkClass}`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

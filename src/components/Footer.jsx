export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <footer className="text-center px-6 pt-12 pb-10 font-mono text-[11.5px] text-ink-soft">
      <button
        onClick={scrollTop}
        className="inline-flex items-center gap-2.5 border border-dashed border-paper-line rounded-full px-4 py-2 mb-3.5 bg-paper transition-transform duration-300 hover:-translate-y-1"
      >
        ✈ back to the top
      </button>
      <div>made with care (and probably too much coffee) — jena bathan, 2026</div>
    </footer>
  )
}

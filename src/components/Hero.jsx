import Reveal from "./Reveal"

export default function Hero() {
  return (
    <header id="top" className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-20 bg-ink">
      {/* ---- moving train footage, cropped + tinted to read as a window ---- */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <video
          className="hero-video absolute inset-0 w-full h-full object-cover"
          src="/items/hero-background.MOV"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* cool color-grade so the footage matches the paper/olive palette */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(211,223,228,0.35)_0%,rgba(175,192,202,0.25)_55%,rgba(65,77,41,0.35)_100%)] mix-blend-multiply" />
        {/* vignette */}
        <div className="absolute inset-0 [background:radial-gradient(ellipse_75%_65%_at_50%_40%,transparent_45%,rgba(20,22,15,0.45)_100%)]" />
        {/* diagonal glass glare */}
        <div className="absolute -inset-y-10 -left-1/3 w-2/3 rotate-[8deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]" />
      </div>

      {/* ---- window hardware sits above the footage ---- */}
      {["left", "right"].map((side) => (
        <div
          key={side}
          className={`absolute top-0 w-14 h-[110px] z-[3] pointer-events-none ${side === "left" ? "left-16" : "right-16"}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 56 110" className="w-full h-full">
            <path d="M28 4 A18 18 0 1 1 27.9 4" fill="none" stroke="#3a3226" strokeWidth="4" opacity="0.5" />
            <rect x="20" y="60" width="16" height="46" rx="3" fill="#3a3226" opacity="0.5" />
          </svg>
        </div>
      ))}

      <div className="window-frame absolute inset-[18px] rounded-sm pointer-events-none z-[2]" aria-hidden="true" />
      <div
        className="hidden md:block absolute top-[18px] bottom-[18px] left-1/2 -ml-[7px] w-3.5 bg-paper shadow-[inset_0_0_0_2px_rgba(42,42,34,0.12)] z-[2] pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="hidden md:flex absolute top-24 right-8 w-[98px] h-[98px] rounded-full border-2 border-stamp text-stamp items-center justify-center text-center font-mono text-[9px] leading-snug rotate-[12deg] z-[6] opacity-85 bg-paper/70 backdrop-blur-sm"
        aria-hidden="true"
      >
        AIR&nbsp;MAIL ★ WOLLONGONG · NSW ★ PAR AVION
      </div>

      <div className="max-w-[1180px] mx-auto px-8 w-full relative z-[5]">
        <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
          <Reveal direction="left" duration={0.8}>
            <div className="bg-paper p-3.5 pb-[54px] shadow-postal -rotate-[4deg] w-[min(300px,78vw)] mx-auto relative transition-transform duration-400 hover:rotate-[-1deg] hover:scale-[1.02]">
              <div
                className="absolute w-[70px] h-6 bg-[rgba(230,225,206,0.75)] shadow-[0_2px_4px_rgba(0,0,0,0.12)] -top-2.5 left-1/2 -ml-[35px] -rotate-3"
                aria-hidden="true"
              />
              <div className="aspect-[4/5] overflow-hidden bg-paper-dark">
                <img
                  src="/items/photo-1.png"
                  alt="Jena, portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-center font-display italic text-[15px] text-ink">
                jena, on the go
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 font-mono text-[11.5px] bg-paper px-3 py-1.5 rounded-full shadow-[0_2px_6px_rgba(42,42,34,0.12)] mb-5 -rotate-[1.5deg]">
                <span className="w-1.5 h-1.5 rounded-full bg-stamp animate-pulse-dot" aria-hidden="true" />
                currently: building things &amp; catching trains
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="font-display font-semibold text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.98] text-paper">
                hi, i'm jena<em className="italic text-stamp font-medium">.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="max-w-[440px] mt-5 text-[17px] leading-relaxed text-paper/85">
                Software engineer and designer who likes making things that are functional <em>and</em> pretty. I
                build the front end, ship the back end, and design the parts in between.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="flex flex-wrap gap-4 mt-9">
                <a
                  href="#projects"
                  className="tag-clip bg-stamp text-paper px-6 py-3.5 pl-5 font-mono text-[13px] shadow-postal inline-flex items-center gap-2.5 -rotate-[1.2deg] transition-all duration-300 hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(42,42,34,0.22)]"
                >
                  <span className="w-2 h-2 rounded-full border-[1.5px] border-paper flex-shrink-0" />
                  view my work
                </a>
                <a
                  href="#contact"
                  className="tag-clip bg-paper px-6 py-3.5 pl-5 font-mono text-[13px] shadow-postal inline-flex items-center gap-2.5 rotate-[1.4deg] transition-all duration-300 hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(42,42,34,0.22)]"
                >
                  <span className="w-2 h-2 rounded-full border-[1.5px] border-ink flex-shrink-0" />
                  contact me.
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 font-mono text-[11px] text-paper/80 flex flex-col items-center gap-1.5 z-[6]"
        aria-hidden="true"
      >
        <span>scroll down here</span>
        <span className="w-px h-[30px] bg-paper/80 animate-scrolldown" />
      </div>
    </header>
  )
}

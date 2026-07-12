import Reveal from "./Reveal"

export default function Hero() {
  return (
    <header id="top" className="hero-bg relative min-h-screen flex items-center overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <svg
          className="animate-drift-slow absolute bottom-0 left-0 opacity-50"
          viewBox="0 0 1600 300"
          preserveAspectRatio="none"
          width="1800"
          height="220"
        >
          <path
            d="M0,180 C 250,100 450,220 700,150 C 950,90 1150,200 1400,140 C 1550,110 1650,150 1800,120 L1800,300 L0,300 Z"
            fill="#C7D3C2"
          />
        </svg>
        <svg
          className="animate-drift-fast absolute bottom-0 left-0 opacity-85"
          viewBox="0 0 1600 300"
          preserveAspectRatio="none"
          width="1800"
          height="180"
        >
          <path
            d="M0,200 C 200,140 400,230 650,170 C 900,120 1100,220 1350,160 C 1500,130 1650,180 1800,150 L1800,300 L0,300 Z"
            fill="#9DAF87"
          />
        </svg>
      </div>

      {["left", "right"].map((side) => (
        <div
          key={side}
          className={`absolute top-0 w-14 h-[110px] z-[3] pointer-events-none ${side === "left" ? "left-16" : "right-16"}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 56 110" className="w-full h-full">
            <path
              d="M28 4 A18 18 0 1 1 27.9 4"
              fill="none"
              stroke="#5a5344"
              strokeWidth="4"
              opacity="0.35"
            />
            <rect x="20" y="60" width="16" height="46" rx="3" fill="#5a5344" opacity="0.35" />
          </svg>
        </div>
      ))}

      <div className="window-frame absolute inset-[18px] rounded-sm pointer-events-none z-[2]" aria-hidden="true" />
      <div
        className="hidden md:block absolute top-[18px] bottom-[18px] left-1/2 -ml-[7px] w-3.5 bg-paper shadow-[inset_0_0_0_2px_rgba(42,42,34,0.12)] z-[2] pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="hidden md:flex absolute top-24 right-8 w-[98px] h-[98px] rounded-full border-2 border-stamp text-stamp items-center justify-center text-center font-mono text-[9px] leading-snug rotate-[12deg] z-[6] opacity-85"
        aria-hidden="true"
      >
        AIR&nbsp;MAIL ★ WOLLONGONG · NSW ★ PAR AVION
      </div>

      <div className="max-w-[1180px] mx-auto px-8 w-full relative z-[5]">
        <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
          <Reveal>
            <div className="bg-paper p-3.5 pb-[54px] shadow-postal -rotate-[4deg] w-[min(300px,78vw)] mx-auto relative transition-transform duration-400 hover:rotate-[-1deg] hover:scale-[1.02]">
              <div
                className="absolute w-[70px] h-6 bg-[rgba(230,225,206,0.75)] shadow-[0_2px_4px_rgba(0,0,0,0.12)] -top-2.5 left-1/2 -ml-[35px] -rotate-3"
                aria-hidden="true"
              />
              <div className="hatch-placeholder-lg aspect-[4/5] border border-dashed border-ink-soft flex items-center justify-center text-center text-ink-soft font-mono text-[11px] p-4 leading-relaxed">
                [ your photo goes here — swap this frame for a polaroid of you ]
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
            <Reveal>
              <h1 className="font-display font-semibold text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.98] text-ink">
                hi, i'm jena<em className="italic text-stamp font-medium">.</em>
              </h1>
            </Reveal>
            <Reveal>
              <p className="max-w-[440px] mt-5 text-[17px] leading-relaxed text-ink-soft">
                Software engineer and designer who likes making things that are functional <em>and</em> pretty. I
                build the front end, ship the back end, and design the parts in between.
              </p>
            </Reveal>
            <Reveal>
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
        className="absolute bottom-7 left-1/2 -translate-x-1/2 font-mono text-[11px] text-ink-soft flex flex-col items-center gap-1.5 z-[6]"
        aria-hidden="true"
      >
        <span>scroll down here</span>
        <span className="w-px h-[30px] bg-ink-soft animate-scrolldown" />
      </div>
    </header>
  )
}

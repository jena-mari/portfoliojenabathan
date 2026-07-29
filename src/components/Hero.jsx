import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Reveal from "./Reveal"

export default function Hero() {
  const [playlistOpen, setPlaylistOpen] = useState(false)

  return (
    <>
      <header
        id="top"
        data-scroll-section
        data-section-color="#34302A"
        className="relative flex min-h-[100svh] items-center overflow-hidden px-0 pb-20 pt-28 sm:pb-24 sm:pt-32"
      >
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <video
          className="hero-video absolute inset-0 w-full h-full object-cover object-[50%_68%]"
          src="/items/hero-background.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,22,15,0.62)_0%,rgba(20,22,15,0.38)_48%,rgba(20,22,15,0.2)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,22,15,0.22)_0%,rgba(20,22,15,0.08)_42%,rgba(20,22,15,0.42)_100%)]" />
      </div>

      <div className="relative z-[5] mx-auto w-full max-w-[73.75rem] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 md:grid-cols-[0.85fr_1.15fr]">
          <Reveal direction="left" duration={0.8}>
            <div className="bg-paper p-3.5 pb-[3.375rem] shadow-postal -rotate-[4deg] w-[min(18.75rem,78vw)] mx-auto relative transition-transform duration-400 hover:rotate-[-1deg] hover:scale-[1.02]">
              <div
                className="absolute w-[4.375rem] h-6 bg-[rgba(230,225,206,0.75)] shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.12)] -top-2.5 left-1/2 -ml-[2.1875rem] -rotate-3"
                aria-hidden="true"
              />
              <div className="aspect-[4/5] overflow-hidden bg-paper-dark">
                <img
                  src="/items/photo-1.png"
                  alt="Jena, portrait"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-center font-display italic text-[0.9375rem] text-ink">
                this is me! 𐔌՞ ܸ.ˬ.ܸ՞𐦯
              </div>
            </div>
          </Reveal>

          <div className="text-center md:text-left">
            <Reveal>
              <span className="inline-flex items-center gap-2 font-mono text-[0.71875rem] bg-paper px-3 py-1.5 rounded-full shadow-[0_0.125rem_0.375rem_rgba(42,42,34,0.12)] mb-5 -rotate-[1.5deg]">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-dot" aria-hidden="true" />
                currently: building things &amp; catching trains
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="font-display font-semibold text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.98] text-paper">
                hi, i'm jena<em className="italic text-gold font-medium">.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-5 max-w-[27.5rem] text-base leading-relaxed text-paper/85 sm:text-[1.0625rem] md:mx-0">
                Software engineer and designer who likes making things that are functional <em>and</em> pretty. I
                build the front end, ship the back end, and design the parts in between.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap justify-center gap-3 sm:gap-4 md:justify-start">
                <a
                  href="#projects"
                  className="tag-clip bg-gold text-ink px-6 py-3.5 pl-5 font-mono text-[0.8125rem] shadow-postal inline-flex items-center gap-2.5 -rotate-[1.2deg] transition-all duration-300 hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_1rem_1.875rem_rgba(58,48,42,0.22)]"
                >
                  <span className="w-2 h-2 rounded-full border-[0.09375rem] border-ink flex-shrink-0" />
                  view my work ⋆˚꩜｡
                </a>
                <a
                  href="#contact"
                  className="tag-clip bg-paper px-6 py-3.5 pl-5 font-mono text-[0.8125rem] shadow-postal inline-flex items-center gap-2.5 rotate-[1.4deg] transition-all duration-300 hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_1rem_1.875rem_rgba(42,42,34,0.22)]"
                >
                  <span className="w-2 h-2 rounded-full border-[0.09375rem] border-ink flex-shrink-0" />
                  contact me .✦ ݁˖
                </a>
                <button
                  type="button"
                  onClick={() => setPlaylistOpen((open) => !open)}
                  aria-expanded={playlistOpen}
                  aria-controls="spotify-playlist"
                  className="tag-clip bg-pink px-6 py-3.5 pl-5 font-mono text-[0.8125rem] shadow-postal inline-flex items-center gap-2.5 rotate-[1.4deg] transition-all duration-300 hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_1rem_1.875rem_rgba(42,42,34,0.22)]"
                >
                  <span className="w-2 h-2 rounded-full border-[0.09375rem] border-ink flex-shrink-0" />
                  {playlistOpen ? "hide playlist" : "my playlist"} 𑣲𝄞
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 font-mono text-[0.6875rem] text-paper/80 flex flex-col items-center gap-1.5 z-[6]"
        aria-hidden="true"
      >
        <span>scroll down here</span>
        <span className="w-px h-[1.875rem] bg-paper/80 animate-scrolldown" />
      </div>
      </header>

      <AnimatePresence>
        {playlistOpen && (
          <motion.aside
            id="spotify-playlist"
            aria-label="Jena's Spotify playlist"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-4 right-4 z-[120] w-[min(24rem,calc(100vw-2rem))] rounded-2xl bg-[#191414] p-2 shadow-[0_22px_60px_rgba(0,0,0,0.38)] sm:bottom-6 sm:right-6"
          >
            <div className="mb-2 flex items-center justify-between px-2 py-1 text-white">
              <span className="font-mono text-xs tracking-wide">currently spinning 𑣲𝄞</span>
              <button
                type="button"
                onClick={() => setPlaylistOpen(false)}
                aria-label="Close Spotify playlist"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 font-mono text-sm transition-colors hover:bg-white/20"
              >
                ×
              </button>
            </div>
            <iframe
              data-testid="embed-iframe"
              title="Jena's Spotify playlist"
              src="https://open.spotify.com/embed/playlist/07rwGguUZ25e3TGHLGpVDv?utm_source=generator&theme=0&si=24b02119af2340fb"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block h-[280px] rounded-xl sm:h-[352px]"
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

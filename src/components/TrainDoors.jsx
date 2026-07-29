import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, useReducedMotion } from "framer-motion"

// A "tap to board" gate using the real painted door artwork (traindoor.PNG,
// mirrored for the left-hand panel — since scale-x(-1) applies *after* the
// object-fit crop, both panels sample the same object-right region of the
// source and mirror it, so the seam matches symmetrically rather than
// showing two different crops side by side).
//
// Rendered via a portal directly into document.body: this component can end
// up mounted underneath ancestors that apply a CSS `transform` (e.g. the
// scroll-emphasis effect on page sections), and `transform` on an ancestor
// silently changes what `position: fixed` measures against — turning "cover
// the whole screen" into "cover the whole ancestor box" instead. Portaling
// to <body> sidesteps that regardless of where this component is used.
export default function TrainDoors() {
  const [stage, setStage] = useState("waiting") // waiting -> opening -> closing -> done
  const audioRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.body.style.overflow = stage === "done" ? "" : "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [stage])

  const handleEnter = () => {
    if (stage !== "waiting") return
    audioRef.current?.play().catch(() => {})
    setStage("opening")

    if (reduceMotion) {
      setTimeout(() => setStage("done"), 60)
      return
    }

    // let the doors finish sliding, then dissolve the whole gate over the
    // tail end rather than cutting the instant it clears the screen
    setTimeout(() => setStage("closing"), 950)
    setTimeout(() => setStage("done"), 1350)
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleEnter()
    }
  }

  const audioEl = <audio ref={audioRef} src="/items/sydney-trains-announcement-chime.mp3" preload="auto" />

  if (stage === "done") return audioEl

  const doorsOut = stage === "opening" || stage === "closing"

  return createPortal(
    <>
      {audioEl}
      <motion.div
        role="button"
        tabIndex={0}
        onClick={handleEnter}
        onKeyDown={onKeyDown}
        aria-label="Tap to enter the site"
        className="fixed inset-0 z-[300] flex h-[100dvh] w-full overflow-hidden bg-[#CCE6FC] cursor-pointer"
        animate={{ opacity: stage === "closing" ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <motion.div
          initial={false}
          animate={{ x: doorsOut ? "-100%" : 0 }}
          transition={{ duration: reduceMotion ? 0.06 : 1.05, ease: [0.65, 0, 0.2, 1] }}
          className="h-full w-1/2 shrink-0 overflow-hidden bg-[#CCE6FC]"
        >
          {/* mirrored copy on the left */}
          <img
            src="/items/traindoor.PNG"
            alt=""
            className="h-full w-full scale-x-[-1] object-cover object-right"
          />
        </motion.div>

        <motion.div
          initial={false}
          animate={{ x: doorsOut ? "100%" : 0 }}
          transition={{ duration: reduceMotion ? 0.06 : 1.05, ease: [0.65, 0, 0.2, 1] }}
          className="h-full w-1/2 shrink-0 overflow-hidden bg-[#CCE6FC]"
        >
          {/* true-to-source copy on the right */}
          <img src="/items/traindoor.PNG" alt="" className="w-full h-full object-cover object-right" />
        </motion.div>

        {/* seam accent */}
        <motion.span
          className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gold"
          animate={{ opacity: stage === "waiting" ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />

        {/* tap prompt */}
        {stage === "waiting" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <span className="font-mono text-paper bg-ink/70 backdrop-blur-sm px-6 py-3 rounded-full text-sm tracking-widest animate-pulse-dot">
              tap to board →
            </span>
          </motion.div>
        )}
      </motion.div>
    </>,
    document.body
  )
}

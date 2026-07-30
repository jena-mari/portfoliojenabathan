import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

// waiting -> tapped (card "beeps" and exits) -> opening (doors jiggle, then
// slide) -> closing (whole gate dissolves) -> done
export default function TrainDoors() {
  const [stage, setStage] = useState("waiting")
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

    if (reduceMotion) {
      setStage("opening")
      setTimeout(() => setStage("done"), 60)
      return
    }

    setStage("tapped") // card plays its confirm/exit beat
    setTimeout(() => setStage("opening"), 360) // then doors jiggle + slide
    setTimeout(() => setStage("closing"), 360 + 1100) // gate dissolves
    setTimeout(() => setStage("done"), 360 + 1100 + 400)
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
  const cardShowing = stage === "waiting" || stage === "tapped"

  // small mechanical "clunk-clunk" before the main slide, like a real
  // pneumatic door releasing before it opens
  const leftDoorX = doorsOut ? (reduceMotion ? "-100%" : ["0%", "3%", "-4%", "-100%"]) : "0%"
  const rightDoorX = doorsOut ? (reduceMotion ? "100%" : ["0%", "-3%", "4%", "100%"]) : "0%"
  const doorTransition =
    doorsOut && !reduceMotion
      ? { duration: 1.1, times: [0, 0.07, 0.15, 1], ease: [0.65, 0, 0.2, 1] }
      : { duration: reduceMotion ? 0.06 : 0.4, ease: [0.65, 0, 0.2, 1] }

  return createPortal(
    <>
      {audioEl}
      <motion.div
        role="button"
        tabIndex={0}
        onClick={handleEnter}
        onKeyDown={onKeyDown}
        aria-label="Tap to enter the site"
        whileTap={stage === "waiting" ? { scale: 0.994 } : undefined}
        className="fixed inset-0 z-[300] flex h-[100dvh] w-full overflow-hidden bg-[#CCE6FC] cursor-pointer"
        animate={{ opacity: stage === "closing" ? 0 : 1, scale: stage === "closing" ? 1.015 : 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <motion.div
          initial={false}
          animate={{ x: leftDoorX }}
          transition={doorTransition}
          className="relative h-full w-1/2 shrink-0 overflow-hidden bg-[#CCE6FC]"
        >
          <img
            src="/items/traindoors.GIF"
            alt=""
            draggable={false}
            className="absolute inset-y-0 left-0 h-full w-[184.5%] max-w-none select-none object-fill saturate-[1.15] contrast-[1.03] brightness-[0.98]"
          />
        </motion.div>

        <motion.div
          initial={false}
          animate={{ x: rightDoorX }}
          transition={doorTransition}
          className="relative h-full w-1/2 shrink-0 overflow-hidden bg-[#CCE6FC]"
        >
          <img
            src="/items/traindoors.GIF"
            alt=""
            draggable={false}
            className="absolute inset-y-0 h-full w-[218.3%] max-w-none select-none object-fill saturate-[1.15] contrast-[1.03] brightness-[0.98]"
            style={{ left: "-118.3%" }}
          />
        </motion.div>

        <AnimatePresence>
          {cardShowing && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <div className="relative flex items-center justify-center">
                {stage === "waiting" &&
                  !reduceMotion &&
                  [0, 1].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute rounded-full border-2 border-white/60"
                      style={{ width: "62%", height: "62%" }}
                      animate={{ scale: [1, 1.7], opacity: [0.55, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: i * 0.9 }}
                    />
                  ))}

                {stage === "tapped" && (
                  <motion.span
                    className="absolute rounded-full bg-[#34D399]"
                    style={{ width: "55%", height: "55%" }}
                    initial={{ scale: 0.6, opacity: 0.75 }}
                    animate={{ scale: 2.1, opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                )}

                <motion.img
                  src="/items/opal.PNG"
                  alt="Opal card — tap me to board"
                  draggable={false}
                  animate={
                    reduceMotion
                      ? undefined
                      : stage === "tapped"
                        ? { y: 0, rotate: 0, scale: [1, 1.2, 0.94] }
                        : { y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5], scale: [1, 1.035, 1] }
                  }
                  transition={
                    stage === "tapped"
                      ? { duration: 0.32, ease: "easeOut" }
                      : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                  }
                  className="relative w-[min(34rem,82vw)] select-none drop-shadow-[0_18px_16px_rgba(0,0,0,0.2)]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>,
    document.body
  )
}
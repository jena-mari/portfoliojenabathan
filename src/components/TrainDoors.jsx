import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, useReducedMotion } from "framer-motion"

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
    setStage("opening")

    if (reduceMotion) {
      setTimeout(() => setStage("done"), 60)
      return
    }

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
          animate={{ x: doorsOut ? "100%" : 0 }}
          transition={{ duration: reduceMotion ? 0.06 : 1.05, ease: [0.65, 0, 0.2, 1] }}
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

        {stage === "waiting" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <div>
              <motion.img
                src="/items/opal.PNG"
                alt="Opal card — tap me to board"
                draggable={false}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        y: [0, -10, 0],
                        rotate: [-1.5, 1.5, -1.5],
                        scale: [1, 1.035, 1],
                      }
                }
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-[min(34rem,82vw)] select-none drop-shadow-[0_18px_16px_rgba(0,0,0,0.2)]"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </>,
    document.body
  )
}

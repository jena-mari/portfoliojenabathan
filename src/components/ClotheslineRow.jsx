import { useEffect, useMemo, useRef, useState } from "react"
import { motion, motionValue, animate, useMotionTemplate } from "framer-motion"
import Reveal from "./Reveal"
import LaundryCard from "./LaundryCard"

const BASE_Y = 11.2
const IDLE_SAG = 7.2
const IDLE_RANGE = 2.4
const PULL_DOWN = 0.55
const PULL_SIDE = 0.12

const ROPE_AREA = 32
const CLIP_TOP = 4.8
const CLIP_LIFT = ROPE_AREA - CLIP_TOP

export default function ClotheslineRow({ cards, restAngles, renderCard, rowIndex = 0 }) {
  const bleedRef = useRef(null)
  const clipRefs = useRef([])
  const [ropeWidth, setRopeWidth] = useState(0)
  const [anchors, setAnchors] = useState(() => cards.map(() => 0))

  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const sags = useMemo(() => cards.map(() => motionValue(IDLE_SAG)), [cards])
  const dips = useMemo(() => cards.map(() => motionValue(0)), [cards])
  const idleControls = useRef([])

  useEffect(() => {
    const unsubs = sags.map((sag, i) => sag.on("change", (v) => dips[i].set(v - IDLE_SAG)))
    return () => unsubs.forEach((u) => u())
  }, [sags, dips])

  const startIdleSag = (i) => {
    if (reduceMotion) return null
    return animate(sags[i], [IDLE_SAG - IDLE_RANGE, IDLE_SAG + IDLE_RANGE], {
      duration: 3.6 + i * 0.4,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      delay: i * 0.25 + rowIndex * 0.15,
    })
  }

  useEffect(() => {
    idleControls.current = sags.map((_, i) => startIdleSag(i))
    return () => idleControls.current.forEach((c) => c?.stop())
  }, [sags])

  useEffect(() => {
    function measure() {
      if (!bleedRef.current) return
      const wrapBox = bleedRef.current.getBoundingClientRect()
      setRopeWidth(wrapBox.width)
      setAnchors(
        clipRefs.current.map((el) => {
          if (!el) return wrapBox.width / 2
          const box = el.getBoundingClientRect()
          return box.left + box.width / 2 - wrapBox.left
        })
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (bleedRef.current) ro.observe(bleedRef.current)
    window.addEventListener("resize", measure)
    window.addEventListener("orientationchange", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
      window.removeEventListener("orientationchange", measure)
    }
  }, [cards])

  const mid01 = (anchors[0] + anchors[1]) / 2
  const mid12 = (anchors[1] + anchors[2]) / 2

  const pathD = useMotionTemplate`M0,${BASE_Y} L${anchors[0]},${sags[0]} L${mid01},${BASE_Y} L${anchors[1]},${sags[1]} L${mid12},${BASE_Y} L${anchors[2]},${sags[2]} L${ropeWidth},${BASE_Y}`

  return (
    <div className="relative" style={{ paddingTop: ROPE_AREA }}>
      <div
        ref={bleedRef}
        className="absolute top-0 left-1/2 w-screen -translate-x-1/2 h-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg width="100%" height="32" className="overflow-visible">
          <motion.path
            d={pathD}
            fill="none"
            stroke="#8A6F45"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />
          <motion.path
            d={pathD}
            fill="none"
            stroke="#FBF7EC"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-14">
        {cards.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 0.07} className="relative">
            <motion.div
              style={{ y: dips[i], top: -CLIP_LIFT }}
              className="absolute inset-x-0 flex justify-center z-20 pointer-events-none"
            >
              <img
                ref={(el) => (clipRefs.current[i] = el)}
                src="/items/clip.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                style={{ width: 25.6, height: "auto" }}
                className="drop-shadow-[0_0.25rem_0.375rem_rgba(0,0,0,0.25)] select-none"
              />
            </motion.div>

            <motion.div style={{ y: dips[i] }}>
              <LaundryCard
                baseRotate={restAngles[i]}
                onDragStart={() => idleControls.current[i]?.stop()}
                onDragMove={(dx, dy) => {
                  sags[i].set(IDLE_SAG + Math.max(0, dy) * PULL_DOWN + Math.abs(dx) * PULL_SIDE)
                }}
                onDragEnd={() => {
                  animate(sags[i], IDLE_SAG, {
                    type: "spring",
                    stiffness: 140,
                    damping: 7,
                    onComplete: () => {
                      idleControls.current[i] = startIdleSag(i)
                    },
                  })
                }}
              >
                {renderCard(cat)}
              </LaundryCard>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

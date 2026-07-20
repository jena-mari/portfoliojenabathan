import { useEffect, useMemo, useRef, useState } from "react"
import { motion, motionValue, animate, useMotionTemplate } from "framer-motion"
import Reveal from "./Reveal"
import LaundryCard from "./LaundryCard"

const BASE_Y = 14 // resting rope height inside its own SVG (px)
const IDLE_SAG = 9 // resting droop at each pin, before any interaction
const IDLE_RANGE = 3 // how far the idle sway moves the droop up/down
const PULL_DOWN = 0.55 // how much dragging down stretches the rope
const PULL_SIDE = 0.12 // how much dragging sideways also adds tension

const ROPE_AREA = 40 // height reserved above the card grid for the rope (px) — matches the bleed SVG's own height, and is where cards start in normal flow
const CLIP_TOP = 6 // where the clip's top edge sits, in row-relative px — just above the rope baseline so the rope reads as threaded through the pin
const CLIP_LIFT = ROPE_AREA - CLIP_TOP // how far above each card's own top the clip needs to sit, in local (per-card) coordinates

// A full-bleed, physically-reactive clothesline: the rope, the clips, and
// the cards are all coupled through the same set of motion values. Drag a
// card and its pin drags the rope down with it (and the neighbouring slack
// redistributes); let go and both spring back together.
export default function ClotheslineRow({ cards, restAngles, renderCard, rowIndex = 0 }) {
  const bleedRef = useRef(null)
  const clipRefs = useRef([])
  const [ropeWidth, setRopeWidth] = useState(0)
  const [anchors, setAnchors] = useState(() => cards.map(() => 0))

  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // one sag value per pin (absolute droop, used to draw the rope) — and one
  // derived "dip" value per pin (droop relative to rest, used to nudge the
  // clip + card down so they visibly stay attached to the moving rope)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sags])

  // measure real pixel positions of each clip relative to the full-bleed
  // rope wrapper, so the dip in the rope lines up exactly under the pin
  // regardless of viewport width or where the centered content sits
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
      {/* full-bleed rope — breaks out of the centered container to span edge to edge.
          Positioned absolute + top:0, so it ignores this row's paddingTop entirely
          and stays pinned exactly at the row's true top, in the same coordinate
          space the CLIP_TOP / BASE_Y constants above assume. */}
      <div
        ref={bleedRef}
        className="absolute top-0 left-1/2 w-screen -translate-x-1/2 h-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg width="100%" height="40" className="overflow-visible">
          <motion.path
            d={pathD}
            fill="none"
            stroke="#8A6F45"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />
          <motion.path
            d={pathD}
            fill="none"
            stroke="#FBF7EC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-14">
        {cards.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 0.07} className="relative">
            {/* clip — top edge lands exactly on the rope baseline (CLIP_LIFT px
                above this card's own top, since cards start at ROPE_AREA in row
                coordinates and the rope sits at CLIP_TOP) — moves with the same
                dip value as the rope, so it visibly stays pinched to it */}
            <motion.div
              style={{ y: dips[i], top: -CLIP_LIFT }}
              className="absolute inset-x-0 flex justify-center z-20 pointer-events-none"
            >
              <img
                ref={(el) => (clipRefs.current[i] = el)}
                src="/items/clip.png"
                alt=""
                aria-hidden="true"
                style={{ width: 32, height: "auto" }}
                className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)] select-none"
              />
            </motion.div>

            {/* card hangs from the same dip value, so it visibly stays pinned to the clip */}
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
import { useEffect, useRef } from "react"
import { motion, animate, useMotionValue } from "framer-motion"

const IDLE_RANGE = 2.2
const DRAG_LIMIT = 42

export default function LaundryCard({
  baseRotate = 0,
  children,
  className = "",
  onDragStart,
  onDragMove,
  onDragEnd,
}) {
  const rotate = useMotionValue(baseRotate)
  const idleControls = useRef(null)
  const drag = useRef({ active: false, startX: 0, startY: 0, startRotate: baseRotate })
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const startIdle = () => {
    if (reduceMotion) return null
    return animate(rotate, [baseRotate - IDLE_RANGE, baseRotate + IDLE_RANGE], {
      duration: 3 + Math.random() * 1.8,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    })
  }

  useEffect(() => {
    rotate.set(baseRotate)
    idleControls.current = startIdle()
    return () => idleControls.current?.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onPointerDown = (e) => {
    idleControls.current?.stop()
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, startRotate: rotate.get() }
    e.currentTarget.setPointerCapture(e.pointerId)
    onDragStart?.()
  }

  const onPointerMove = (e) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    const next = drag.current.startRotate + dx * 0.28
    rotate.set(Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, next)))
    onDragMove?.(dx, dy)
  }

  const onPointerUp = () => {
    if (!drag.current.active) return
    drag.current.active = false
    const released = rotate.get()
    animate(rotate, baseRotate, {
      type: "spring",
      stiffness: 90,
      damping: 5.5,
      velocity: (baseRotate - released) * 2,
      onComplete: () => {
        idleControls.current = startIdle()
      },
    })
    onDragEnd?.()
  }

  return (
    <motion.div
      style={{ rotate, transformOrigin: "top center" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`touch-none cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {children}
    </motion.div>
  )
}
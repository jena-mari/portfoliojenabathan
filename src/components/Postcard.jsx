import { memo, useCallback, useEffect, useRef, useState } from "react"
import { motion, useMotionValue } from "framer-motion"

function Postcard({ project, layout, scattered }) {
  const cardRef = useRef(null)
  const dragState = useRef({ dragging: false, moved: false, startX: 0, startY: 0, origX: 0, origY: 0 })
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [flipped, setFlipped] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dragging, setDragging] = useState(false)

  // fade in when scrolled into view (opacity only — a transform here would
  // create a new containing block and break the absolute drag positioning)
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onPointerDown = useCallback((e) => {
    if (!scattered) return
    dragState.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: x.get(),
      origY: y.get(),
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }, [scattered, x, y])

  const onPointerMove = useCallback((e) => {
    if (!dragState.current.dragging || !scattered) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragState.current.moved = true
    if (!dragState.current.moved) return

    x.set(dragState.current.origX + dx)
    y.set(dragState.current.origY + dy)
  }, [scattered, x, y])

  const onPointerUp = useCallback((e) => {
    if (!dragState.current.dragging) return
    const shouldFlip = !dragState.current.moved
    dragState.current.dragging = false
    setDragging(false)
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    if (shouldFlip) setFlipped((f) => !f)
  }, [])

  const style = scattered
    ? {
        position: "absolute",
        top: layout.top,
        left: layout.left,
        x,
        y,
        rotate: layout.rot,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: dragging ? 50 : 10,
      }
    : { position: "relative" }

  return (
    <motion.div
      ref={cardRef}
      onClick={() => !scattered && setFlipped((f) => !f)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={style}
      className={`pc-scene w-full max-w-[31rem] aspect-[3/2] mx-auto select-none transition-[opacity,filter] duration-700 ease-out ${
        visible ? "opacity-100 blur-0" : "opacity-0 blur-sm"
      }`}
    >
      <motion.div
        className="pc-inner"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
      >
        {/* front */}
        <div className="pc-face bg-cream-card rounded-sm shadow-postal-lg p-6 flex flex-col text-ink">
          <div className="relative flex-1 overflow-hidden border-[0.09375rem] border-ink-soft">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="hatch-placeholder w-full h-full flex items-center justify-center text-center font-mono text-[0.65625rem] text-ink-soft p-3.5 leading-relaxed">
                [ project photo/screenshot goes here ]
              </div>
            )}
            <span className="absolute top-2 right-2 w-[1.875rem] h-[1.875rem] rounded-full border-[0.09375rem] border-gold-deep opacity-60 pointer-events-none" />
          </div>
          <div className="flex justify-between items-baseline gap-4 mt-3.5">
            <h3 className="font-display font-semibold text-[1.35rem] leading-none">{project.title}</h3>
            <span className="font-mono text-[0.6875rem] text-ink-soft text-right">{project.tag}</span>
          </div>
          <span className="font-mono text-[0.6875rem] text-pink-deep mt-1.5">{project.role}</span>
        </div>

        {/* back */}
        <div className="pc-face pc-face-back contact-back rounded-sm shadow-postal-lg p-6 text-ink">
          <div className="flex h-full gap-0">
            <div className="flex-[1.6] pr-3.5 ruled-lines font-display italic text-[0.8125rem] leading-[1.375rem] text-ink-soft overflow-hidden">
              {project.message}
            </div>
            <div className="flex-1 pl-3.5 flex flex-col justify-between">
              <div className="w-[2.375rem] h-[2.875rem] border-[0.09375rem] border-dashed border-ink-soft ml-auto mb-2 flex items-center justify-center text-center font-mono text-[0.46875rem] text-ink-soft leading-tight">
                postmark
              </div>
              <div className="flex flex-col gap-1.5">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-[0.625rem] border border-ink rounded-full px-2.5 py-1.5 inline-flex items-center gap-1.5 self-start transition-colors duration-200 hover:bg-ink hover:text-cream-card"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default memo(Postcard)

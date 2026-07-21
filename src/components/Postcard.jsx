import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function Postcard({ project, layout, scattered }) {
  const cardRef = useRef(null)
  const dragState = useRef({ dragging: false, moved: false, startX: 0, startY: 0, origX: 0, origY: 0 })
  const [flipped, setFlipped] = useState(false)
  const [visible, setVisible] = useState(false)
  const [cardOffset, setCardOffset] = useState({ x: 0, y: 0 })
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

  const onPointerDown = (e) => {
    if (!scattered) return
    dragState.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: cardOffset.x,
      origY: cardOffset.y,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (!dragState.current.dragging || !scattered) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragState.current.moved = true
    if (!dragState.current.moved) return

    setCardOffset({
      x: dragState.current.origX + dx,
      y: dragState.current.origY + dy,
    })
  }

  const onPointerUp = (e) => {
    if (!dragState.current.dragging) return
    const shouldFlip = !dragState.current.moved
    dragState.current.dragging = false
    setDragging(false)
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    if (shouldFlip) setFlipped((f) => !f)
  }

  const style = scattered
    ? {
        position: "absolute",
        top: layout.top,
        left: layout.left,
        transform: `translate(${cardOffset.x}px, ${cardOffset.y}px) rotate(${layout.rot}deg)`,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: dragging ? 50 : 10,
      }
    : { position: "relative" }

  return (
    <div
      ref={cardRef}
      onClick={() => !scattered && setFlipped((f) => !f)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={style}
      className={`pc-scene w-full max-w-[30rem] aspect-[3/2] mx-auto select-none transition-[opacity,filter] duration-700 ease-out ${
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
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="hatch-placeholder w-full h-full flex items-center justify-center text-center font-mono text-[0.65625rem] text-ink-soft p-3.5 leading-relaxed">
                [ project photo/screenshot goes here ]
              </div>
            )}
            <span className="absolute top-2 right-2 w-[1.875rem] h-[1.875rem] rounded-full border-[0.09375rem] border-gold-deep opacity-60 pointer-events-none" />
          </div>
          <div className="flex justify-between items-baseline mt-3">
            <h3 className="font-display font-semibold text-xl">{project.title}</h3>
            <span className="font-mono text-[0.625rem] text-ink-soft">{project.tag}</span>
          </div>
          <span className="font-mono text-[0.625rem] text-pink-deep mt-1">{project.role}</span>
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
    </div>
  )
}

import { useEffect, useRef, useState } from "react"

export default function Postcard({ project, layout, scattered }) {
  const cardRef = useRef(null)
  const dragState = useRef({ dragging: false, moved: false, startX: 0, startY: 0, origX: 0, origY: 0 })
  const [flipped, setFlipped] = useState(false)
  const [visible, setVisible] = useState(false)

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

  useEffect(() => {
    const card = cardRef.current
    if (!card || !scattered) return

    const getXY = () => {
      const style = window.getComputedStyle(card)
      if (style.transform === "none") return { x: 0, y: 0 }
      const m = new DOMMatrixReadOnly(style.transform)
      return { x: m.m41, y: m.m42 }
    }

    const onPointerDown = (e) => {
      dragState.current.dragging = true
      dragState.current.moved = false
      card.setPointerCapture(e.pointerId)
      dragState.current.startX = e.clientX
      dragState.current.startY = e.clientY
      const xy = getXY()
      dragState.current.origX = xy.x
      dragState.current.origY = xy.y
      card.style.zIndex = 50
    }

    const onPointerMove = (e) => {
      if (!dragState.current.dragging) return
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragState.current.moved = true
      if (dragState.current.moved) {
        card.style.transform = `translate(${dragState.current.origX + dx}px, ${dragState.current.origY + dy}px) rotate(${layout.rot}deg)`
      }
    }

    const onPointerUp = () => {
      if (!dragState.current.dragging) return
      dragState.current.dragging = false
      card.style.zIndex = ""
      if (!dragState.current.moved) {
        setFlipped((f) => !f)
      }
    }

    card.addEventListener("pointerdown", onPointerDown)
    card.addEventListener("pointermove", onPointerMove)
    card.addEventListener("pointerup", onPointerUp)
    card.addEventListener("pointercancel", onPointerUp)
    return () => {
      card.removeEventListener("pointerdown", onPointerDown)
      card.removeEventListener("pointermove", onPointerMove)
      card.removeEventListener("pointerup", onPointerUp)
      card.removeEventListener("pointercancel", onPointerUp)
    }
  }, [scattered, layout.rot])

  const style = scattered
    ? { position: "absolute", top: layout.top, left: layout.left, transform: `rotate(${layout.rot}deg)`, cursor: "grab" }
    : { position: "relative" }

  return (
    <div
      ref={cardRef}
      onClick={() => !scattered && setFlipped((f) => !f)}
      style={style}
      className={`pc-scene w-full max-w-[400px] aspect-[3/2] mx-auto select-none transition-[opacity,filter] duration-700 ease-out ${
        visible ? "opacity-100 blur-0" : "opacity-0 blur-sm"
      }`}
    >
      <div className={`pc-inner ${flipped ? "is-flipped" : ""}`}>
        {/* front */}
        <div className="pc-face bg-cream-card rounded-sm shadow-postal-lg p-5 flex flex-col text-ink">
          <div className="hatch-placeholder flex-1 border-[1.5px] border-dashed border-ink-soft flex items-center justify-center text-center font-mono text-[10.5px] text-ink-soft p-3.5 leading-relaxed relative">
            <span className="absolute top-2 right-2 w-[30px] h-[30px] rounded-full border-[1.5px] border-stamp-deep opacity-60" />
            [ project photo/screenshot goes here ]
          </div>
          <div className="flex justify-between items-baseline mt-3">
            <h3 className="font-display font-semibold text-lg">{project.title}</h3>
            <span className="font-mono text-[10px] text-ink-soft">{project.tag}</span>
          </div>
          <span className="font-mono text-[10px] text-stamp mt-1">{project.role}</span>
        </div>

        {/* back */}
        <div className="pc-face pc-face-back contact-back rounded-sm shadow-postal-lg p-5 text-ink">
          <div className="flex h-full gap-0">
            <div className="flex-[1.6] pr-3.5 ruled-lines font-display italic text-[13px] leading-[22px] text-ink-soft overflow-hidden">
              {project.message}
            </div>
            <div className="flex-1 pl-3.5 flex flex-col justify-between">
              <div className="w-[38px] h-[46px] border-[1.5px] border-dashed border-ink-soft ml-auto mb-2 flex items-center justify-center text-center font-mono text-[7.5px] text-ink-soft leading-tight">
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
                    className="font-mono text-[10px] border border-ink rounded-full px-2.5 py-1.5 inline-flex items-center gap-1.5 self-start transition-colors duration-200 hover:bg-ink hover:text-cream-card"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

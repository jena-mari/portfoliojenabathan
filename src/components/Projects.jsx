import { memo, useEffect, useMemo, useRef, useState } from "react"
import Reveal from "./Reveal"
import Postcard from "./Postcard"
import { projects } from "../data/projects"
import { trinkets } from "../data/trinkets"

const ROW_HEIGHT = 500
const rotationPattern = [-4, 3, 2.5, -3, -2.5, 2, -3.5, 2.5]

function getLayout(i) {
  const col = i % 2
  const row = Math.floor(i / 2)
  const top = row * ROW_HEIGHT + (col === 1 ? 42 : 0)
  const left = col === 0 ? `${2 + (row % 2) * 1.75}%` : `${53 + (row % 2) * 1.25}%`
  const rot = rotationPattern[i % rotationPattern.length]
  return { top: `${top}px`, left, rot }
}

const ProjectTrinket = memo(function ProjectTrinket({ trinket, scattered }) {
  const trinketRef = useRef(null)
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, baseX: 0, baseY: 0 })
  const [open, setOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const style = scattered
    ? {
        top: trinket.top,
        left: trinket.left,
        width: trinket.width,
        "--trinket-rot": `${trinket.rot}deg`,
        zIndex: dragging ? 35 : undefined,
      }
    : { width: trinket.width, "--trinket-rot": `${trinket.rot}deg`, zIndex: dragging ? 35 : undefined }

  const onPointerDown = (e) => {
    if (!scattered || e.pointerType === "touch") return
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      baseX: dragRef.current.baseX,
      baseY: dragRef.current.baseY,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragRef.current.moved = true
    if (!dragRef.current.moved) return

    const nextX = dragRef.current.baseX + dx
    const nextY = dragRef.current.baseY + dy
    const el = trinketRef.current
    if (!el) return
    el.style.setProperty("--trinket-x", `${nextX}px`)
    el.style.setProperty("--trinket-y", `${nextY}px`)
  }

  const onPointerUp = (e) => {
    if (!dragRef.current.active) return
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    if (dragRef.current.moved) {
      dragRef.current.baseX += e.clientX - dragRef.current.startX
      dragRef.current.baseY += e.clientY - dragRef.current.startY
    }
    dragRef.current.active = false
    setDragging(false)
  }

  const onClick = () => {
    if (dragRef.current.moved) {
      dragRef.current.moved = false
      return
    }
    setOpen(true)
  }

  return (
    <button
      ref={trinketRef}
      type="button"
      style={style}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => setOpen(false)}
      onBlur={() => setOpen(false)}
      className={`trinket-item group select-none text-left ${dragging ? "is-dragging" : ""} ${scattered ? "absolute z-[2] cursor-grab active:cursor-grabbing" : "relative"}`}
      aria-label={`Show note for ${trinket.alt}`}
      aria-expanded={open}
    >
      <div
        className={`trinket-bubble absolute bottom-[calc(100%+0.875rem)] left-1/2 z-30 w-[min(22rem,78vw)] -translate-x-1/2 rounded-md bg-paper px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-ink transition duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        {trinket.note}
      </div>
      <img
        src={trinket.src}
        alt={trinket.alt}
        draggable={false}
        loading="lazy"
        decoding="async"
        className="trinket-cutout block w-full object-contain"
      />
    </button>
  )
})

export default function Projects() {
  const [scattered, setScattered] = useState(false)
  const layouts = useMemo(() => projects.map((_, i) => getLayout(i)), [])

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 47.5rem)")
    const update = () => setScattered(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const rows = Math.ceil(projects.length / 2)

  return (
    <section id="projects" className="py-28 bg-green text-paper">
      <div className="max-w-[76rem] mx-auto px-8">
        <Reveal className="max-w-xl mb-14" direction="left">
          <span className="kicker-dash font-mono text-xs text-twine flex items-center gap-2.5 mb-3.5">
            projects &amp; works
          </span>
          <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,2.9rem)]">
            A selection of things I've built (and helped build).
          </h2>
          <p className="mt-3 text-[#E4E9D3] text-[0.96875rem] max-w-md">
            These are real postcards. Drag them around, flip them over — the address side has the actual links.
          </p>
        </Reveal>

        <p className="font-mono text-[0.71875rem] text-[#E4E9D3] opacity-80 mb-5 flex items-center gap-2">
          ↳ click a card to flip it · drag it anywhere on desktop
        </p>

        {!scattered && (
          <div className="mb-10 flex flex-wrap items-end justify-center gap-x-8 gap-y-6 opacity-70">
            {trinkets.map((trinket) => (
              <ProjectTrinket key={trinket.id} trinket={trinket} scattered={false} />
            ))}
          </div>
        )}

        <div
          className={scattered ? "relative isolate" : "grid grid-cols-1 gap-20"}
          style={scattered ? { minHeight: `${rows * ROW_HEIGHT + 72}px` } : undefined}
        >
          {scattered && trinkets.map((trinket) => <ProjectTrinket key={trinket.id} trinket={trinket} scattered />)}
          {projects.map((project, i) => (
            <Postcard key={project.title} project={project} layout={layouts[i]} scattered={scattered} />
          ))}
        </div>
      </div>
    </section>
  )
}

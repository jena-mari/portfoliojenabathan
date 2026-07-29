import { memo, useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Reveal from "./Reveal"
import Postcard from "./Postcard"
import useLenis from "../hooks/useLenis"
import { projects } from "../data/projects"
import { trinkets } from "../data/trinkets"

gsap.registerPlugin(ScrollTrigger)

const rotationPattern = [-2.4, 1.8, -1.3, 2.2, -1.9, 1.5, -2.1, 2.6]

const ProjectTrinket = memo(function ProjectTrinket({ trinket }) {
  const trinketRef = useRef(null)
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, baseX: 0, baseY: 0 })
  const [open, setOpen] = useState(false)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (e) => {
    if (e.pointerType === "touch") return
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

    const el = trinketRef.current
    if (!el) return
    el.style.setProperty("--trinket-x", `${dragRef.current.baseX + dx}px`)
    el.style.setProperty("--trinket-y", `${dragRef.current.baseY + dy}px`)
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
      style={{ width: trinket.width, "--trinket-rot": `${trinket.rot}deg`, zIndex: dragging ? 35 : undefined }}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => setOpen(false)}
      onBlur={() => setOpen(false)}
      className={`trinket-item group relative select-none text-left cursor-grab active:cursor-grabbing ${dragging ? "is-dragging" : ""}`}
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

function GridPostcard({ project, index }) {
  const wrapRef = useRef(null)
  const tiltRef = useRef(null)
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, baseX: 0, baseY: 0 })
  const suppressClick = useRef(false)
  const rot = rotationPattern[index % rotationPattern.length]

  useEffect(() => {
    const el = tiltRef.current
    if (!el || window.matchMedia("(pointer: coarse)").matches) return

    const setRotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" })
    const setRotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" })
    const setLift = gsap.quickTo(el, "z", { duration: 0.5, ease: "power3.out" })
    const setX = gsap.quickTo(el, "x", { duration: 0.12, ease: "power2.out" })
    const setY = gsap.quickTo(el, "y", { duration: 0.12, ease: "power2.out" })
    const setSpin = gsap.quickTo(el, "rotationZ", { duration: 0.35, ease: "power3.out" })
    const setScale = gsap.quickTo(el, "scale", { duration: 0.35, ease: "power3.out" })

    const onMove = (e) => {
      if (dragRef.current.active) return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      setRotY(px * 14)
      setRotX(py * -14)
      setLift(24)
    }
    const onLeave = () => {
      if (dragRef.current.active) return
      setRotY(0)
      setRotX(0)
      setLift(0)
    }

    const onPointerDown = (e) => {
      if (e.pointerType === "touch") return
      dragRef.current = {
        active: true,
        moved: false,
        startX: e.clientX,
        startY: e.clientY,
        baseX: dragRef.current.baseX,
        baseY: dragRef.current.baseY,
      }
      wrapRef.current.style.zIndex = 40
      setRotY(0)
      setRotX(0)
      setLift(60)
      setScale(1.06)
    }

    const onPointerMove = (e) => {
      if (!dragRef.current.active) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      if (!dragRef.current.moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        dragRef.current.moved = true
        el.setPointerCapture(e.pointerId)
      }
      if (!dragRef.current.moved) return
      setX(dragRef.current.baseX + dx)
      setY(dragRef.current.baseY + dy)
      setSpin(Math.max(-8, Math.min(8, dx * 0.08)))
    }

    const onPointerUp = (e) => {
      if (!dragRef.current.active) return
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId)
      if (dragRef.current.moved) {
        dragRef.current.baseX += e.clientX - dragRef.current.startX
        dragRef.current.baseY += e.clientY - dragRef.current.startY
        suppressClick.current = true
      }
      dragRef.current.active = false
      setLift(0)
      setScale(1)
      setSpin(0)
      if (wrapRef.current) wrapRef.current.style.zIndex = ""
    }

    const onClickCapture = (e) => {
      if (suppressClick.current) {
        e.stopPropagation()
        e.preventDefault()
        suppressClick.current = false
      }
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    el.addEventListener("pointerdown", onPointerDown)
    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerup", onPointerUp)
    el.addEventListener("pointercancel", onPointerUp)
    el.addEventListener("click", onClickCapture, true)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", onPointerUp)
      el.removeEventListener("pointercancel", onPointerUp)
      el.removeEventListener("click", onClickCapture, true)
    }
  }, [])

  return (
    <div ref={wrapRef} className="break-inside-avoid mb-10 sm:mb-12 [perspective:1200px] relative">
      <div ref={tiltRef} data-reveal className="will-change-transform cursor-grab active:cursor-grabbing">
        <div style={{ transform: `rotate(${rot}deg)` }}>
          <Postcard project={project} />
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  useLenis()
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray("[data-reveal]")
      gsap.set(cards, { opacity: 0, y: 72, scale: 0.9 })

      cards.forEach((card, i) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          delay: (i % 3) * 0.08,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        })
      })

      gsap.utils.toArray("[data-trinket]").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 2.3 + (i % 3) * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.15,
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      data-scroll-section
      data-section-color="#91A05A"
      className="relative overflow-hidden py-20 text-paper sm:py-28"
    >
      <div className="relative mx-auto max-w-[84rem] px-5 sm:px-8 lg:grid lg:grid-cols-[17rem_1fr] lg:gap-14 xl:grid-cols-[18rem_1fr] xl:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start mb-14 lg:mb-0">
          <Reveal className="max-w-xl lg:max-w-none" direction="left">
            <span className="kicker-dash font-mono text-xs text-twine flex items-center gap-2.5 mb-3.5">
              projects &amp; works
            </span>
            <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,2.9rem)] lg:text-[clamp(1.9rem,2.6vw,2.6rem)]">
              A selection of things I've built (and helped build).
            </h2>
            <p className="mt-3 text-[#E4E9D3] text-[0.96875rem] max-w-md">
              These are real postcards. Drag one out of place, hover for a little tilt, click to flip it over — the
              address side has the actual links. Keep an eye out for the trinkets floating around too... drag them
              if you're curious 𐔌՞ ܸ.ˬ.ܸ՞𐦯
            </p>
          </Reveal>

          <p className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-4 py-1.5 mt-6 font-mono text-[0.71875rem] text-[#E4E9D3]">
            ↳ drag a card around · click to flip
          </p>

          <div className="mt-12 hidden grid-cols-2 items-center gap-x-8 gap-y-12 lg:grid" aria-label="Project trinkets">
            {trinkets.map((trinket) => (
              <div key={trinket.id} data-trinket className="flex min-h-24 items-center justify-center">
                <ProjectTrinket trinket={trinket} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="columns-1 sm:columns-2 gap-x-10 sm:gap-x-12 relative z-[2]">
            {projects.map((project, i) => (
              <GridPostcard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-start gap-x-8 gap-y-6 opacity-70 lg:hidden">
          {trinkets.map((trinket) => (
            <ProjectTrinket key={trinket.id} trinket={trinket} />
          ))}
        </div>
      </div>
    </section>
  )
}

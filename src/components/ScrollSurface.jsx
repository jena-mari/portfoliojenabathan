import { useEffect } from "react"

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function mixColor(from, to, progress) {
  const start = hexToRgb(from)
  const end = hexToRgb(to)
  const eased = progress * progress * (3 - 2 * progress)
  const channels = start.map((channel, index) => Math.round(channel + (end[index] - channel) * eased))
  return `rgb(${channels.join(", ")})`
}

export function ScrollBackground() {
  useEffect(() => {
    const root = document.documentElement
    let sections = []
    let boundaries = []
    let frame = 0

    const measure = () => {
      sections = [...document.querySelectorAll("[data-scroll-section]")].map((element) => ({
        element,
        color: element.dataset.sectionColor,
        top: element.getBoundingClientRect().top + window.scrollY,
      }))
      boundaries = sections.slice(1).map((section) => section.top)
    }

    const update = () => {
      frame = 0
      if (!sections.length) return

      const probe = window.scrollY + window.innerHeight * 0.55
      const halfBand = clamp(window.innerHeight * 0.1, 64, 120)
      let color = sections.at(-1).color

      for (let index = 0; index < boundaries.length; index += 1) {
        const boundary = boundaries[index]
        if (probe < boundary - halfBand) {
          color = sections[index].color
          break
        }
        if (probe <= boundary + halfBand) {
          const progress = (probe - boundary + halfBand) / (halfBand * 2)
          color = mixColor(sections[index].color, sections[index + 1].color, progress)
          break
        }
      }

      root.style.setProperty("--scroll-surface-color", color)
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    const resizeObserver = new ResizeObserver(() => {
      measure()
      scheduleUpdate()
    })

    measure()
    sections.forEach(({ element }) => resizeObserver.observe(element))
    update()

    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    const handleResize = () => {
      measure()
      scheduleUpdate()
    }

    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", handleResize)
      root.style.removeProperty("--scroll-surface-color")
    }
  }, [])

  return <div className="scroll-surface" aria-hidden="true" />
}

export function SectionConnector({ flip = false, stamp = false }) {
  return (
    <div className={`section-connector ${flip ? "section-connector-flip" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 420 96" role="presentation">
        <path d="M8 63 C92 10 150 90 232 46 S344 19 412 59" />
        {stamp ? (
          <g className="section-connector-stamp">
            <circle cx="326" cy="34" r="20" />
            <circle cx="326" cy="34" r="14" />
            <path d="M305 58 L348 48" />
            <path d="M308 65 L351 55" />
          </g>
        ) : (
          <g className="section-connector-clip">
            <path d="M102 31 C89 15 67 30 76 47 L96 68 C108 81 129 65 117 52 L98 33 C92 27 82 35 88 41 L105 58" />
          </g>
        )}
      </svg>
    </div>
  )
}

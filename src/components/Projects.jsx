import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * npm install lenis gsap
 *
 * Ideally this is called once near your app root (e.g. in App.jsx) so the
 * whole page inherits smooth scrolling, not just this section. It's safe to
 * call from Projects.jsx too — the module-level guard below stops a second
 * instance from spinning up if it's already running elsewhere.
 */
let activeLenis = null

export default function useLenis() {
  useEffect(() => {
    if (activeLenis) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    activeLenis = lenis

    // Keep GSAP's ScrollTrigger in sync with Lenis's virtual scroll instead
    // of the native scroll event, per GSAP + Lenis's recommended setup.
    lenis.on("scroll", ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.off("scroll", ScrollTrigger.update)
      lenis.destroy()
      activeLenis = null
    }
  }, [])
}
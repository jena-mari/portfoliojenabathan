import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// A quick "doors sliding open" intro on first load, echoing the train motif.
export default function TrainDoors() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    if (reduced) {
      setDone(true)
      return
    }
    const t1 = setTimeout(() => setOpen(true), 350)
    const t2 = setTimeout(() => setDone(true), 1500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reduced])

  if (done) return null

  return (
    <div className="fixed inset-0 z-[300] pointer-events-none flex overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: open ? "-100%" : 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className="w-1/2 h-full bg-ink flex items-center justify-end pr-6"
      >
        <span className="font-mono text-paper/70 text-xs tracking-widest">JB · EXPRESS</span>
      </motion.div>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: open ? "100%" : 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className="w-1/2 h-full bg-ink flex items-center justify-start pl-6"
      >
        <span className="font-mono text-paper/70 text-xs tracking-widest">NOW BOARDING</span>
      </motion.div>
    </div>
  )
}

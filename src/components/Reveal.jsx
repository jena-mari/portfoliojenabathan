import { motion } from "framer-motion"

const variants = {
  up: {
    hidden: { opacity: 0, y: 44 },
    show: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -44 },
    show: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: 56 },
    show: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: -56 },
    show: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.86 },
    show: { opacity: 1, scale: 1 },
  },
  stamp: {
    hidden: { opacity: 0, scale: 1.5, rotate: -10 },
    show: { opacity: 1, scale: 1, rotate: 0 },
  },
}

// Scroll-triggered entrance wrapper. `direction` picks the motion style,
// `delay`/`duration` let sibling items stagger.
export default function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.7,
  as = "div",
  ...rest
}) {
  const Tag = motion[as] || motion.div

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants[direction] || variants.up}
      transition={{ duration, delay, ease: [0.22, 0.9, 0.32, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

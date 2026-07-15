import { useId } from "react"

// Seamlessly-looping cloud layers. Same trick as the classic "tile a cloud
// PNG and animate background-position" technique, but since we don't have a
// photographic cloud asset to tile, each cloud is built from soft radial
// gradients + a slight blur for a fluffy, feathered-edge look instead of
// flat vector shapes.
const TILE_WIDTH = 1600

const layers = [
  { duration: 75, opacity: 0.92, scale: 1, top: "0%" },
  { duration: 52, opacity: 0.85, scale: 0.7, top: "18%" },
  { duration: 34, opacity: 0.78, scale: 0.48, top: "32%" },
]

function Puff({ cx, cy, r, gradId }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + r * 0.7} rx={r * 1.7} ry={r * 0.4} fill="#5B7FA6" opacity="0.1" />
      <circle cx={cx - r * 1.1} cy={cy + r * 0.3} r={r * 0.6} fill={`url(#${gradId})`} />
      <circle cx={cx - r * 0.45} cy={cy - r * 0.3} r={r * 0.82} fill={`url(#${gradId})`} />
      <circle cx={cx + r * 0.2} cy={cy - r * 0.55} r={r} fill={`url(#${gradId})`} />
      <circle cx={cx + r * 0.95} cy={cy - r * 0.2} r={r * 0.75} fill={`url(#${gradId})`} />
      <circle cx={cx + r * 1.5} cy={cy + r * 0.25} r={r * 0.48} fill={`url(#${gradId})`} />
    </g>
  )
}

function CloudTile({ width }) {
  const uid = useId()
  const gradId = `cloud-grad-${uid}`

  return (
    <svg width={width} viewBox="0 0 1600 260" className="block" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={gradId} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <g style={{ filter: "blur(3px)" }}>
        <Puff cx={140} cy={110} r={48} gradId={gradId} />
        <Puff cx={430} cy={70} r={62} gradId={gradId} />
        <Puff cx={760} cy={130} r={40} gradId={gradId} />
        <Puff cx={1040} cy={85} r={54} gradId={gradId} />
        <Puff cx={1340} cy={120} r={44} gradId={gradId} />
      </g>
    </svg>
  )
}

export default function Clouds() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {layers.map((layer, i) => (
        <div
          key={i}
          className="absolute left-0"
          style={{ top: layer.top, opacity: layer.opacity, transform: `scale(${layer.scale})`, transformOrigin: "top left" }}
        >
          <div className="cloud-drift flex" style={{ width: TILE_WIDTH * 2, animationDuration: `${layer.duration}s` }}>
            <CloudTile width={TILE_WIDTH} />
            <CloudTile width={TILE_WIDTH} />
          </div>
        </div>
      ))}
    </div>
  )
}
// Seamlessly-looping cloud layers — pure SVG/CSS, no image assets needed.
// Each cloud is built from overlapping circles (not stretched ellipses) so it
// stays round and puffy; sizing uses a uniform `scale()` transform rather
// than mismatched width/height, which is what was flattening them before.
const TILE_WIDTH = 1600

const layers = [
  { duration: 70, opacity: 0.9, scale: 1, top: "4%" },
  { duration: 50, opacity: 0.85, scale: 0.7, top: "22%" },
  { duration: 34, opacity: 0.8, scale: 0.48, top: "36%" },
]

function Puff({ cx, cy, r = 44 }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + r * 0.55} rx={r * 1.9} ry={r * 0.55} fill="#EAF3FB" opacity="0.7" />
      <circle cx={cx - r * 1.15} cy={cy + r * 0.35} r={r * 0.62} fill="#ffffff" />
      <circle cx={cx - r * 0.5} cy={cy - r * 0.25} r={r * 0.85} fill="#ffffff" />
      <circle cx={cx + r * 0.15} cy={cy - r * 0.5} r={r} fill="#ffffff" />
      <circle cx={cx + r * 0.95} cy={cy - r * 0.15} r={r * 0.78} fill="#ffffff" />
      <circle cx={cx + r * 1.55} cy={cy + r * 0.3} r={r * 0.5} fill="#ffffff" />
      <ellipse cx={cx} cy={cy + r * 0.45} rx={r * 1.7} ry={r * 0.42} fill="#ffffff" />
    </g>
  )
}

function CloudTile({ width }) {
  return (
    <svg width={width} viewBox="0 0 1600 260" className="block" style={{ overflow: "visible" }}>
      <Puff cx={140} cy={110} r={46} />
      <Puff cx={430} cy={70} r={60} />
      <Puff cx={760} cy={130} r={38} />
      <Puff cx={1040} cy={85} r={52} />
      <Puff cx={1340} cy={120} r={42} />
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
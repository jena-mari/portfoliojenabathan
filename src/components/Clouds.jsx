// Decorative, seamlessly-looping cloud layers (pure SVG/CSS — no image assets
// needed). Three layers at different speeds/opacity/scale for a bit of depth.
const layers = [
  { duration: 55, opacity: 0.3, scale: 1.35, top: "0%", height: 150 },
  { duration: 38, opacity: 0.45, scale: 1, top: "10%", height: 130 },
  { duration: 24, opacity: 0.6, scale: 0.68, top: "20%", height: 110 },
]

function CloudGroup({ className = "", style }) {
  return (
    <svg viewBox="0 0 1400 200" className={className} style={style} preserveAspectRatio="none">
      <g fill="#ffffff">
        <ellipse cx="90" cy="70" rx="70" ry="34" />
        <ellipse cx="150" cy="52" rx="55" ry="30" />
        <ellipse cx="220" cy="72" rx="85" ry="40" />
        <ellipse cx="470" cy="60" rx="60" ry="28" />
        <ellipse cx="530" cy="48" rx="46" ry="24" />
        <ellipse cx="600" cy="66" rx="72" ry="34" />
        <ellipse cx="880" cy="55" rx="66" ry="30" />
        <ellipse cx="940" cy="42" rx="50" ry="26" />
        <ellipse cx="1010" cy="64" rx="78" ry="36" />
        <ellipse cx="1230" cy="58" rx="60" ry="28" />
        <ellipse cx="1290" cy="46" rx="46" ry="24" />
        <ellipse cx="1350" cy="66" rx="70" ry="32" />
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
          className="cloud-drift absolute left-0 flex w-[200%]"
          style={{ top: layer.top, opacity: layer.opacity, animationDuration: `${layer.duration}s` }}
        >
          <CloudGroup className="w-1/2" style={{ height: layer.height, transform: `scale(${layer.scale})` }} />
          <CloudGroup className="w-1/2" style={{ height: layer.height, transform: `scale(${layer.scale})` }} />
        </div>
      ))}
    </div>
  )
}
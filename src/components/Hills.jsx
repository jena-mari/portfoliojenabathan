// Rolling hills, drawn entirely in CSS/SVG so the section never depends on an
// external photo loading. If /items/greenery.PNG exists it's blended on top
// as a subtle grass texture; if it 404s, nothing breaks — the gradient hills
// underneath already look complete on their own.
export default function Hills() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[58%] pointer-events-none select-none" aria-hidden="true">
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C3D9A0" />
            <stop offset="100%" stopColor="#A9C97E" />
          </linearGradient>
          <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9AC468" />
            <stop offset="100%" stopColor="#6FA83E" />
          </linearGradient>
          <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78B24A" />
            <stop offset="100%" stopColor="#4C7A2C" />
          </linearGradient>
        </defs>

        <path
          d="M0,170 C160,110 300,150 470,120 C650,88 820,140 1000,110 C1160,84 1320,130 1440,105 L1440,400 L0,400 Z"
          fill="url(#hillFar)"
        />
        <path
          d="M0,230 C200,165 360,215 540,180 C720,145 860,210 1040,175 C1200,144 1320,195 1440,168 L1440,400 L0,400 Z"
          fill="url(#hillMid)"
        />
        <path
          d="M0,300 C180,235 340,290 520,250 C700,210 860,275 1060,240 C1220,212 1340,260 1440,235 L1440,400 L0,400 Z"
          fill="url(#hillNear)"
        />
      </svg>

      <div
        className="absolute bottom-0 left-0 w-full h-[70%] mix-blend-multiply opacity-25 bg-cover bg-top"
        style={{ backgroundImage: "url('/items/greenery.PNG')" }}
      />
    </div>
  )
}
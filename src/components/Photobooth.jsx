import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
// Real ID-photo sheet formats. Each layout is one or more "sections" — a
// section is a grid of copies at one physical size. Sizes are true cm/mm so
// the exact same numbers drive on-screen preview AND the physical printout.
// This mirrors what real self-photo booths sell: 反명함/이력서 (resume),
// 免許証/증명 (license/middle), and combo sheets with a big + small size.
const LAYOUTS = [
  {
    id: "resume",
    label: "Resume / Others",
    desc: "3.5 × 4.5cm · 4 copies",
    sections: [{ copies: 4, cols: 2, w: "3.5cm", h: "4.5cm", caption: "3.5 × 4.5cm" }],
  },
  {
    id: "license",
    label: "Driver's License / Middle",
    desc: "30 × 40mm · 6 copies",
    sections: [{ copies: 6, cols: 3, w: "3cm", h: "4cm", caption: "30 × 40mm" }],
  },
  {
    id: "large",
    label: "Large Size",
    desc: "5.5×5.0cm + 3.0×2.5cm",
    sections: [
      { copies: 2, cols: 2, w: "5.5cm", h: "5cm", caption: "5.5 × 5.0cm — Middle Certificate" },
      { copies: 4, cols: 4, w: "3cm", h: "2.5cm", caption: "3.0 × 2.5cm — License Photo" },
    ],
  },
];

// Background options pulled straight from the site's own palette so the
// booth reads as part of the same world, not a bolted-on mini-game.
const BG_OPTIONS = [
  { id: "sky", label: "Light Azure", style: { background: "#CCE6FC" } },
  { id: "cloud", label: "Cloud", style: { background: "#F7F2E8" } },
  { id: "gold", label: "Gold Wash", style: { background: "linear-gradient(135deg, #F9C94E 0%, #FFFDF7 100%)" } },
  { id: "pink", label: "Petal Pink", style: { background: "linear-gradient(135deg, #F2C0CA 0%, #FFFDF7 100%)" } },
  { id: "studio", label: "Studio White", style: { background: "#FFFDF7" } },
];

const PRICE_LABEL = "₱40";

// The wordmark keeps its own saturated blue — the booth's sub-brand mark,
// distinct from the portfolio's paper/gold/pink/ink palette, the same way a
// real photobooth vendor's logo doesn't match the mall it sits in.
const BRAND_BLUE = "radial-gradient(ellipse at center, #30A0FE 0%, #2680CB 50%, #1D6098 100%)";

// ─── Gradient text helper ────────────────────────────────────────────────────
function GradientText({ children, className = "", size = "text-4xl" }) {
  return (
    <span className={`${size} font-advercase font-bold bg-clip-text text-transparent ${className}`} style={{ backgroundImage: BRAND_BLUE }}>
      {children}
    </span>
  );
}

function Wordmark({ size = "text-xl" }) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <GradientText size={size}>mari-photo</GradientText>
      <span className="text-gold-deep text-sm">⊹˖</span>
    </span>
  );
}

// ─── Machine Shell ────────────────────────────────────────────────────────────
function MachineShell({ children, moneySlotHighlight = false, printerActive = false, printStrip }) {
  return (
    <section
      id="photobooth"
      className="relative flex items-center justify-center min-h-screen w-full overflow-hidden py-20 font-google"
      style={{ background: "var(--color-sky)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(52,48,42,0.10) 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }}
      />

      <div
        className="relative w-full max-w-[1280px] mx-4 rounded-[48px] border-[6px] border-ink shadow-postal-lg"
        style={{ background: "var(--color-cream-card)", minHeight: "min(90vh, 820px)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-3 rounded-t-[42px]" style={{ backgroundImage: BRAND_BLUE }} />

        {/* Right sidebar — money scanner + printer */}
        <div className="absolute right-0 top-0 bottom-0 w-[180px] flex flex-col items-center justify-between py-12 pr-6 pl-3 gap-6">
          <div className="flex flex-col items-center gap-2 w-full">
            <div
              className={`w-full rounded-[28px] border-[5px] border-ink shadow-[0_4px_20px_rgba(52,48,42,0.3),inset_0_2px_8px_rgba(52,48,42,0.2)] transition-all duration-300 ${
                moneySlotHighlight ? "shadow-[0_0_0_4px_#30A0FE,0_4px_20px_rgba(48,160,254,0.5)]" : ""
              }`}
              style={{ background: "var(--color-cream-card)", padding: "18px 20px 22px" }}
            >
              <div className={`h-[14px] rounded-[8px] transition-all duration-300 ${moneySlotHighlight ? "bg-[#30A0FE] shadow-[0_0_12px_#30A0FE]" : "bg-ink"}`} />
            </div>
            <p className="text-[10px] text-center font-semibold text-ink-soft leading-tight">*Coins are not accepted.</p>
          </div>

          <div
            className="w-full rounded-[28px] border-[5px] border-ink shadow-[0_4px_20px_rgba(52,48,42,0.3),inset_0_2px_8px_rgba(52,48,42,0.2)] overflow-hidden relative"
            style={{ background: "var(--color-cream-card)", minHeight: "160px" }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-ink/10" />
            <div className="h-full flex flex-col items-center justify-end pb-3">
              <div className="w-[70%] h-[6px] rounded-full bg-ink/15 mb-1" />
              <div className="w-[50%] h-[4px] rounded-full bg-ink/10" />
            </div>
            {printerActive && (
              <div
                className="absolute inset-0"
                style={{
                  background: "repeating-linear-gradient(0deg, rgba(48,160,254,0.08) 0px, rgba(48,160,254,0.08) 4px, transparent 4px, transparent 8px)",
                  animation: "printer-lines 0.3s linear infinite",
                }}
              />
            )}
            {printStrip && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-center" style={{ animation: "strip-emerge 3s ease-out forwards" }}>
                {printStrip}
              </div>
            )}
          </div>
          <p className="text-[10px] text-center font-semibold text-ink-soft/70 leading-tight">PRINTER</p>
        </div>

        <div className="pr-[180px] pl-0 pt-0 pb-0 h-full">
          <div
            className="ml-8 mr-0 mt-6 mb-6 rounded-[36px] border-[5px] border-ink overflow-hidden shadow-[inset_0_4px_20px_rgba(52,48,42,0.3)]"
            style={{ minHeight: "min(calc(90vh - 48px), 760px)", background: "linear-gradient(160deg, #ffffff 0%, var(--color-sky) 100%)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shared: sectioned photo grid (on-screen preview) ────────────────────────
// One or more sections, each a grid of the same shot at one true physical
// size. Sizes are real cm/mm so the on-screen preview is already
// proportionally accurate to what gets printed.
function SectionedPreview({ shot, layout, bgStyle, mirrored = true, scale = 1 }) {
  return (
    <div className="flex flex-col items-center gap-3" style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
      {layout.sections.map((section, si) => (
        <div key={si} className="flex flex-col items-center gap-1.5">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${section.cols}, ${section.w})` }}>
            {Array.from({ length: section.copies }).map((_, i) => (
              <div
                key={i}
                className="rounded-md overflow-hidden border border-ink/15 relative"
                style={{ width: section.w, height: section.h, ...(bgStyle ?? { background: "var(--color-sky)" }) }}
              >
                {shot ? (
                  <img src={shot} className="w-full h-full object-cover" alt="Captured shot" style={mirrored ? { transform: "scaleX(-1)" } : undefined} />
                ) : (
                  <div className="w-full h-full flex items-end justify-center pb-1 opacity-30">
                    <div className="w-1/2 h-1/2 rounded-full bg-ink/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-[9px] font-bold text-ink-soft tracking-wide uppercase">{section.caption}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Real printable sheet ────────────────────────────────────────────────────
// Hidden on screen, shown only by @media print (see index.css). Uses true
// cm/mm sizing so what comes out of the physical printer matches the
// captions. Styled after the reference sheets: graph-paper backdrop, ruler
// ticks, dashed cut-guides, and a studio-receipt footer.
function Ruler({ cm = 10 }) {
  const ticks = Array.from({ length: cm + 1 });
  return (
    <div className="flex w-full justify-between px-1 text-[6px] text-ink-soft/70 font-mono select-none">
      {ticks.map((_, i) => (
        <span key={i}>{i}</span>
      ))}
    </div>
  );
}

function PrintSheet({ shot, layout, bgStyle }) {
  const dateStr = useMemo(
    () => new Date().toLocaleDateString("en-PH", { year: "numeric", month: "2-digit", day: "2-digit" }),
    []
  );
  const receiptId = useMemo(() => Math.random().toString(36).slice(2, 10).toUpperCase(), []);

  const graphPaper = {
    backgroundColor: "#fff",
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(52,48,42,0.06) 0, rgba(52,48,42,0.06) 1px, transparent 1px, transparent 8px)," +
      "repeating-linear-gradient(90deg, rgba(52,48,42,0.06) 0, rgba(52,48,42,0.06) 1px, transparent 1px, transparent 8px)",
  };

  return (
    <div id="mari-photo-print-sheet" className="hidden print:flex print:flex-col items-center gap-3 p-[6mm]" style={graphPaper}>
      <Ruler />
      <div className="flex items-center justify-between w-full px-1">
        <Wordmark size="text-sm" />
        <span className="text-[7px] text-ink-soft font-mono">{dateStr} · #{receiptId}</span>
      </div>

      {layout.sections.map((section, si) => (
        <div key={si} className="flex flex-col items-center gap-1">
          <div
            className="grid gap-[1.5mm] p-[2mm]"
            style={{ gridTemplateColumns: `repeat(${section.cols}, ${section.w})`, border: "1px dashed rgba(52,48,42,0.35)" }}
          >
            {Array.from({ length: section.copies }).map((_, i) => (
              <div key={i} className="overflow-hidden" style={{ width: section.w, height: section.h, outline: "1px dashed rgba(52,48,42,0.25)", outlineOffset: "-1px", ...bgStyle }}>
                {shot && <img src={shot} className="w-full h-full object-cover" alt="" style={{ transform: "scaleX(-1)" }} />}
              </div>
            ))}
          </div>
          <p className="text-[7px] font-bold text-ink-soft tracking-wide uppercase">{section.caption}</p>
        </div>
      ))}

      <div className="w-full mt-2 pt-2 flex items-center justify-between text-[7px] text-ink-soft font-mono" style={{ borderTop: "1px solid rgba(52,48,42,0.2)" }}>
        <span>PREMIUM · mari-photo STUDIO</span>
        <span>Photo fee {PRICE_LABEL}.00 · thank you!</span>
      </div>
      <Ruler />
    </div>
  );
}

// ─── SCREEN 1: Welcome ────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  return (
    <MachineShell>
      <div className="flex flex-col items-center justify-center h-full min-h-[680px] gap-8 px-8 py-12">
        <div className="text-center" style={{ animation: "fade-in 0.7s ease-out" }}>
          <GradientText size="text-7xl">mari-photo</GradientText>
          <div className="text-3xl text-gold-deep mt-1">⊹ ࣪ ˖</div>
        </div>

        <button
          onClick={onStart}
          className="px-14 py-5 rounded-full text-white font-advercase font-bold text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          style={{ backgroundImage: BRAND_BLUE, animation: "pulse-ring 2.5s ease-in-out infinite" }}
        >
          <span className="flex items-center gap-2">
            take a pic <span style={{ animation: "bounce-arrow 1.2s ease-in-out infinite" }}>→</span>
          </span>
        </button>
      </div>
    </MachineShell>
  );
}

// ─── SCREEN 2: Payment ────────────────────────────────────────────────────────
function PaymentScreen({ onPaid }) {
  const [billPos, setBillPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, bx: 0, by: 0 });
  const [paid, setPaid] = useState(false);
  const [sucked, setSucked] = useState(false);
  const [showAccepted, setShowAccepted] = useState(false);
  const billRef = useRef(null);
  const slotRef = useRef(null);

  const onPointerDown = (e) => {
    if (paid) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, bx: billPos.x, by: billPos.y });
  };
  const onPointerMove = (e) => {
    if (!dragging || paid) return;
    setBillPos({ x: dragStart.bx + (e.clientX - dragStart.x), y: dragStart.by + (e.clientY - dragStart.y) });
  };
  const onPointerUp = () => {
    if (!dragging || paid) return;
    setDragging(false);
    const bill = billRef.current?.getBoundingClientRect();
    const slot = slotRef.current?.getBoundingClientRect();
    if (bill && slot) {
      const overlapX = Math.max(0, Math.min(bill.right, slot.right) - Math.max(bill.left, slot.left));
      const overlapY = Math.max(0, Math.min(bill.bottom, slot.bottom) - Math.max(bill.top, slot.top));
      if (overlapX > 40 && overlapY > 10) {
        setPaid(true);
        setSucked(true);
        setTimeout(() => {
          setShowAccepted(true);
          setTimeout(() => onPaid(), 1400);
        }, 600);
      }
    }
  };

  return (
    <MachineShell moneySlotHighlight={true}>
      <div className="relative flex flex-col items-center justify-center h-full min-h-[680px] gap-6 px-8 py-10 select-none">
        <div className="text-center" style={{ animation: "fade-in 0.5s ease-out" }}>
          <Wordmark size="text-2xl" />
          <p className="text-ink font-semibold mt-4 max-w-sm mx-auto leading-snug">
            Insert {PRICE_LABEL} into the money scanner on the upper right corner of the machine.
          </p>
        </div>

        <div className="absolute top-24 left-14 text-ink-soft" style={{ animation: "fade-in 0.6s ease-out 0.2s both" }}>
          <p className="text-sm" style={{ fontFamily: "'Hi Melody', cursive" }}>drag the bill to the scanner!</p>
          <svg width="70" height="36" viewBox="0 0 70 36" className="ml-2 -scale-x-100">
            <path d="M4 4 C 30 4, 55 14, 62 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M62 30 L 52 26 M62 30 L 58 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div
          ref={billRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`cursor-grab active:cursor-grabbing touch-none z-30 ${sucked ? "pointer-events-none" : ""}`}
          style={{
            transform: `translate(${billPos.x}px, ${billPos.y}px)`,
            animation: sucked ? "bill-sucked 0.5s ease-in forwards" : dragging ? "none" : "slide-in-bill 0.8s ease-out",
            transition: dragging ? "none" : sucked ? "none" : "filter 0.2s",
            filter: dragging ? "drop-shadow(0 12px 24px rgba(52,48,42,0.35))" : "drop-shadow(0 4px 8px rgba(52,48,42,0.2))",
          }}
        >
          <div className="relative rounded-2xl overflow-hidden border-2 border-ink/20" style={{ width: 300, height: 130 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #b23a4e 0%, #8f2438 30%, #7a1e30 60%, #a3324a 100%)" }} />
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 6px)" }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <div>
                <p className="text-white font-advercase font-bold text-3xl" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}>50</p>
                <p className="text-white/80 text-[10px] font-bold">REPUBLIKA NG PILIPINAS</p>
                <p className="text-white/70 text-[9px]">BANGKO SENTRAL NG PILIPINAS</p>
              </div>
              <div className="w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <p className="text-white font-advercase font-bold text-lg">50</p>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-1/2 opacity-20 rounded-t-2xl" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)" }} />
          </div>
        </div>

        <div ref={slotRef} className="relative flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-[#30A0FE]/70 tracking-widest uppercase">Insert here</p>
          <div
            className="w-64 h-12 rounded-2xl border-4 border-dashed border-[#30A0FE] flex items-center justify-center transition-all duration-300"
            style={{ background: "rgba(48,160,254,0.08)", boxShadow: "0 0 20px rgba(48,160,254,0.2)" }}
          >
            <div className="w-36 h-3 rounded-full bg-[#30A0FE]/30" />
          </div>
          <p className="text-xs text-ink-soft/70">↑ money scanner</p>
        </div>

        {showAccepted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 rounded-[31px]" style={{ background: "rgba(204,230,252,0.92)", animation: "scale-in 0.3s ease-out" }}>
            <div className="text-6xl mb-4">✅</div>
            <GradientText size="text-4xl">Payment Accepted!</GradientText>
            <p className="text-ink font-semibold mt-2">{PRICE_LABEL}.00 — Thank you!</p>
          </div>
        )}
      </div>
    </MachineShell>
  );
}

// ─── SCREEN 3: Layout / ID-photo type chooser ────────────────────────────────
function LayoutScreen({ selected, onSelect, onContinue, onBack }) {
  return (
    <MachineShell>
      <div className="flex flex-col h-full min-h-[680px] px-8 py-8 gap-6" style={{ animation: "fade-in 0.4s ease-out" }}>
        <div className="rounded-3xl py-4 px-8 text-center" style={{ backgroundImage: BRAND_BLUE }}>
          <p className="text-white font-advercase font-bold text-2xl tracking-tight">Choose the type of the photo.</p>
        </div>

        <div className="grid grid-cols-3 gap-5 flex-1">
          {LAYOUTS.map((layout) => {
            const isSelected = selected === layout.id;
            return (
              <button
                key={layout.id}
                onClick={() => onSelect(layout.id)}
                className={`rounded-3xl border-4 p-4 flex flex-col items-center gap-3 overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected ? "border-[#30A0FE] shadow-[0_0_0_2px_#30A0FE,0_8px_32px_rgba(48,160,254,0.3)]" : "border-ink/10 shadow-md hover:border-[#30A0FE]/50"
                }`}
                style={{ background: isSelected ? "rgba(204,230,252,0.5)" : "var(--color-cream-card)" }}
              >
                <div className="flex-1 w-full flex items-center justify-center py-1">
                  <SectionedPreview shot={null} layout={layout} mirrored={false} scale={0.62} />
                </div>
                <div className="text-center">
                  <p className={`font-advercase font-bold text-base ${isSelected ? "text-[#1D6098]" : "text-ink/70"}`}>{layout.label}</p>
                  <p className="text-xs text-ink-soft font-medium">{layout.desc}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: "#30A0FE" }}>✓</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <button onClick={onBack} className="px-6 py-3 rounded-full border-2 border-ink text-ink font-bold text-sm hover:bg-ink/10 transition-all">← Back</button>
          <button
            onClick={onContinue}
            disabled={!selected}
            className={`px-10 py-4 rounded-full text-white font-advercase font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 ${!selected ? "opacity-40 cursor-not-allowed" : ""}`}
            style={{ backgroundImage: BRAND_BLUE }}
          >
            Continue →
          </button>
        </div>
      </div>
    </MachineShell>
  );
}

// ─── SCREEN 4: Camera ────────────────────────────────────────────────────────
function CameraScreen({ onCapture, onBack }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [camError, setCamError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCamError("Camera permission denied. Please allow camera access and try again."));
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const takeShot = useCallback(() => {
    return new Promise((resolve) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return resolve("");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve("");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    });
  }, []);

  const startCapture = async () => {
    if (capturing) return;
    setCapturing(true);
    for (let c = 3; c >= 1; c--) {
      setCountdown(c);
      await new Promise((r) => setTimeout(r, 900));
    }
    setCountdown(null);
    setFlash(true);
    const dataUrl = await takeShot();
    await new Promise((r) => setTimeout(r, 500));
    setFlash(false);
    setCapturing(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCapture(dataUrl);
  };

  return (
    <MachineShell>
      <div className="h-full min-h-[680px] relative" style={{ animation: "fade-in 0.4s ease-out" }}>
        <div className="absolute inset-0 rounded-[31px] overflow-hidden bg-ink">
          {camError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center" style={{ background: "linear-gradient(160deg, var(--color-sky) 0%, #f0f8ff 100%)" }}>
              <div className="text-5xl">📷</div>
              <p className="text-ink font-bold text-lg">{camError}</p>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[46%] h-[62%] rounded-2xl border-4 border-white/70" />
              </div>
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ background: "rgba(0,0,0,0.4)" }}>
                  <div key={countdown} className="text-[120px] font-advercase font-bold text-white" style={{ animation: "countdown-pop 0.9s ease-out forwards", textShadow: "0 0 40px rgba(48,160,254,0.8)" }}>
                    {countdown}
                  </div>
                </div>
              )}
              {flash && <div className="absolute inset-0 bg-white pointer-events-none" style={{ animation: "flash-white 0.5s ease-out forwards" }} />}
            </>
          )}

          <div className="absolute top-4 left-4 rounded-xl px-3 py-1.5" style={{ background: "rgba(255,253,247,0.85)" }}>
            <Wordmark size="text-lg" />
          </div>
          <button onClick={onBack} className="absolute top-4 right-4 px-4 py-1.5 rounded-full font-bold text-xs text-ink" style={{ background: "rgba(255,253,247,0.85)" }}>← Back</button>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {!capturing && (
          <button
            onClick={startCapture}
            disabled={!!camError}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
            style={{ backgroundImage: BRAND_BLUE, animation: "pulse-ring 2s ease-in-out infinite" }}
          >
            <div className="w-12 h-12 rounded-full bg-white" />
          </button>
        )}
        {capturing && countdown === null && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm font-bold text-white animate-pulse">📸 Getting ready...</div>
        )}
      </div>
    </MachineShell>
  );
}

// ─── SCREEN 5: Confirm ────────────────────────────────────────────────────────
function ConfirmScreen({ shot, layout, onConfirm, onRetake, onBack }) {
  return (
    <MachineShell>
      <div className="flex h-full min-h-[680px] px-6 py-6 gap-6" style={{ animation: "fade-in 0.4s ease-out" }}>
        <div className="flex-1 flex items-center justify-center overflow-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white" style={{ background: "#fff", padding: 10 }}>
            <SectionedPreview shot={shot} layout={layout} />
          </div>
        </div>

        <div className="w-56 flex flex-col items-center justify-center gap-6">
          <button onClick={onBack} className="self-start px-4 py-1.5 rounded-full border-2 border-ink text-ink font-bold text-xs hover:bg-ink/10 transition-all">← Back</button>
          <Wordmark size="text-2xl" />
          <button
            onClick={onConfirm}
            className="w-full py-3 rounded-full text-white font-advercase font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ backgroundImage: BRAND_BLUE }}
          >
            proceed →
          </button>
          <button onClick={onRetake} className="px-6 py-2 rounded-full border-2 border-ink text-ink font-bold text-sm hover:bg-ink/10 transition-all flex items-center gap-2">↻ retake</button>
        </div>
      </div>
    </MachineShell>
  );
}

// ─── SCREEN 6: Background ────────────────────────────────────────────────────
function BackgroundScreen({ shot, layout, selectedBg, onSelectBg, onConfirm, onBack }) {
  const [removing, setRemoving] = useState(false);
  const [processedShot, setProcessedShot] = useState(shot);
  const [bgError, setBgError] = useState(null);
  const currentBg = BG_OPTIONS.find((b) => b.id === selectedBg) ?? BG_OPTIONS[0];

  useEffect(() => {
    const apiKey = import.meta.env.VITE_REMOVEBG_API_KEY;
    if (!apiKey) {
      setProcessedShot(shot);
      return;
    }
    setRemoving(true);
    (async () => {
      try {
        const blob = await (await fetch(shot)).blob();
        const form = new FormData();
        form.append("image_file", blob, "photo.jpg");
        form.append("size", "auto");
        const res = await fetch("https://api.remove.bg/v1.0/removebg", { method: "POST", headers: { "X-Api-Key": apiKey }, body: form });
        if (!res.ok) throw new Error("remove.bg failed");
        const resultBlob = await res.blob();
        setProcessedShot(URL.createObjectURL(resultBlob));
      } catch {
        setBgError("Background removal failed — using original.");
        setProcessedShot(shot);
      } finally {
        setRemoving(false);
      }
    })();
  }, [shot]);

  return (
    <MachineShell>
      <div className="flex flex-col h-full min-h-[680px] px-6 py-6 gap-4" style={{ animation: "fade-in 0.4s ease-out" }}>
        <div className="rounded-3xl py-3 px-8 text-center" style={{ backgroundImage: BRAND_BLUE }}>
          <p className="text-white font-advercase font-bold text-xl tracking-tight">Please select the background.</p>
        </div>

        <div className="flex-1 flex gap-5 min-h-0">
          <div className="flex-1 rounded-3xl overflow-hidden shadow-xl border-4 border-white relative">
            {removing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "linear-gradient(160deg, var(--color-sky) 0%, #f0f8ff 100%)" }}>
                <div className="w-12 h-12 rounded-full border-4 border-[#30A0FE] border-t-transparent" style={{ animation: "spin-slow 0.8s linear infinite" }} />
                <p className="text-ink font-bold">Processing…</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4 overflow-auto transition-all duration-500" style={currentBg.style}>
                <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white" style={{ background: "#fff", padding: 8 }}>
                  <SectionedPreview shot={processedShot} layout={layout} bgStyle={currentBg.style} scale={0.9} />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-36 justify-center">
            <p className="text-xs font-bold text-ink-soft uppercase tracking-wider text-center">Backgrounds</p>
            {BG_OPTIONS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onSelectBg(bg.id)}
                className={`w-full h-16 rounded-2xl border-4 transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedBg === bg.id ? "border-[#30A0FE] shadow-[0_0_0_2px_#30A0FE]" : "border-ink/10"
                }`}
                style={bg.style}
                title={bg.label}
              >
                {selectedBg === bg.id && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-black" style={{ background: "#30A0FE" }}>✓</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {bgError && <p className="text-xs text-[#DDA424] text-center font-medium">{bgError}</p>}

        <div className="flex justify-between items-center">
          <button onClick={onBack} className="px-6 py-3 rounded-full border-2 border-ink text-ink font-bold text-sm hover:bg-ink/10 transition-all">← Back</button>
          <span className="text-sm font-bold text-ink-soft">{currentBg.label}</span>
          <button
            onClick={onConfirm}
            className="px-10 py-4 rounded-full text-white font-advercase font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ backgroundImage: BRAND_BLUE }}
          >
            Print! 🖨️
          </button>
        </div>
      </div>
    </MachineShell>
  );
}

// ─── SCREEN 7: Printing ────────────────────────────────────────────────────────
// Genuinely prints: once the animation completes, `window.print()` fires
// against the hidden #mari-photo-print-sheet (rendered at the app root),
// which is the only thing visible in the print stylesheet.
function PrintingScreen({ shot, layout, selectedBg, onDone }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const hasPrinted = useRef(false);
  const currentBg = BG_OPTIONS.find((b) => b.id === selectedBg) ?? BG_OPTIONS[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 600);
          return 100;
        }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (done && !hasPrinted.current) {
      hasPrinted.current = true;
      setTimeout(() => window.print(), 400);
    }
  }, [done]);

  return (
    <MachineShell printerActive={!done}>
      <div className="flex flex-col items-center justify-center h-full min-h-[680px] px-8 py-10 gap-6" style={{ animation: "fade-in 0.4s ease-out" }}>
        {!done ? (
          <>
            <GradientText size="text-4xl">Printing…</GradientText>
            <p className="text-ink font-semibold">Please wait while your photo is printed.</p>

            <div
              className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
              style={{ background: "#fff", padding: 8, animation: "strip-emerge 3s ease-out forwards", animationDelay: "0.5s", opacity: 0, animationFillMode: "forwards" }}
            >
              <SectionedPreview shot={shot} layout={layout} bgStyle={currentBg.style} scale={0.75} />
              <div className="mt-2 text-center py-1 rounded-lg" style={{ background: "rgba(204,230,252,0.5)" }}>
                <Wordmark size="text-xs" />
              </div>
            </div>

            <div className="w-full max-w-sm">
              <div className="w-full h-3 rounded-full bg-ink/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-150" style={{ width: `${progress}%`, backgroundImage: BRAND_BLUE }} />
              </div>
              <p className="text-center text-sm text-ink-soft font-bold mt-1">{progress}%</p>
            </div>

            <div className="text-4xl" style={{ animation: "float-gentle 1.5s ease-in-out infinite" }}>🖨️</div>
          </>
        ) : (
          <ThankYouContent onHome={onDone} onPrintAgain={() => window.print()} />
        )}
      </div>
    </MachineShell>
  );
}

function ThankYouContent({ onHome, onPrintAgain }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center" style={{ animation: "scale-in 0.5s ease-out" }}>
      <div className="text-7xl" style={{ animation: "float-gentle 3s ease-in-out infinite" }}>🎉</div>
      <div>
        <GradientText size="text-5xl">Thank You!</GradientText>
        <div className="mt-2 text-2xl font-advercase font-bold bg-clip-text text-transparent" style={{ backgroundImage: BRAND_BLUE }}>
          for using mari-photo ⊹ ࣪ ˖
        </div>
      </div>
      <p className="text-ink font-semibold text-lg max-w-sm">Your photo strip has been sent to the printer — grab it below! 📸</p>
      <div className="rounded-3xl px-8 py-4 border-2 text-center" style={{ background: "rgba(204,230,252,0.4)", borderColor: "var(--color-sky-deep)" }}>
        <p className="text-base text-ink font-medium" style={{ fontFamily: "'Hi Melody', cursive" }}>come back soon! ⊹ ˖ ✦</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onPrintAgain} className="px-6 py-4 rounded-full border-2 border-ink text-ink font-bold hover:bg-ink/10 transition-all">🖨️ Print again</button>
        <button
          onClick={onHome}
          className="px-12 py-4 rounded-full text-white font-advercase font-bold text-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          style={{ backgroundImage: BRAND_BLUE }}
        >
          ← Return Home
        </button>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export function Photobooth() {
  const [screen, setScreen] = useState("welcome");
  const [selectedLayout, setSelectedLayout] = useState("resume");
  const [shot, setShot] = useState(null);
  const [selectedBg, setSelectedBg] = useState("sky");
  const layout = LAYOUTS.find((l) => l.id === selectedLayout) ?? LAYOUTS[0];
  const currentBg = BG_OPTIONS.find((b) => b.id === selectedBg) ?? BG_OPTIONS[0];
  const go = (s) => setScreen(s);

  return (
    <>
      {screen === "welcome" && <WelcomeScreen onStart={() => go("payment")} />}
      {screen === "payment" && <PaymentScreen onPaid={() => go("layout")} />}
      {screen === "layout" && (
        <LayoutScreen selected={selectedLayout} onSelect={setSelectedLayout} onContinue={() => go("camera")} onBack={() => go("payment")} />
      )}
      {screen === "camera" && <CameraScreen onCapture={(s) => { setShot(s); go("confirm"); }} onBack={() => go("layout")} />}
      {screen === "confirm" && (
        <ConfirmScreen shot={shot} layout={layout} onConfirm={() => go("background")} onRetake={() => go("camera")} onBack={() => go("camera")} />
      )}
      {screen === "background" && (
        <BackgroundScreen shot={shot} layout={layout} selectedBg={selectedBg} onSelectBg={setSelectedBg} onConfirm={() => go("printing")} onBack={() => go("confirm")} />
      )}
      {screen === "printing" && (
        <PrintingScreen
          shot={shot}
          layout={layout}
          selectedBg={selectedBg}
          onDone={() => { setShot(null); setSelectedLayout("resume"); setSelectedBg("sky"); go("welcome"); }}
        />
      )}

      {/* Always mounted, only visible to the printer (see @media print in index.css) */}
      <PrintSheet shot={shot} layout={layout} bgStyle={currentBg.style} />
    </>
  );
}

export default function App() {
  return <Photobooth />;
}

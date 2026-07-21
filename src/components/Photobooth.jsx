import { useCallback, useEffect, useRef, useState } from "react";
// ─── Constants ────────────────────────────────────────────────────────────────
const LAYOUTS = [
    { id: "2x2", label: "2×2 Grid", cols: 2, rows: 2, desc: "Classic quad strip" },
    { id: "1x3", label: "1×3 Strip", cols: 1, rows: 3, desc: "Vertical film strip" },
    { id: "2x3", label: "2×3 Grid", cols: 2, rows: 3, desc: "Full collage" },
    { id: "1x1", label: "Single", cols: 1, rows: 1, desc: "One perfect shot" },
];
const BG_OPTIONS = [
    { id: "lightblue", label: "Light Blue", style: { background: "#CCE6FC" } },
    { id: "gray", label: "Gray", style: { background: "#E8E8E8" } },
    { id: "bluewhite", label: "Blue → White", style: { background: "linear-gradient(135deg, #CCE6FC 0%, #ffffff 100%)" } },
    { id: "pinkwhite", label: "Pink → White", style: { background: "linear-gradient(135deg, #FCDDE7 0%, #ffffff 100%)" } },
    { id: "orangewhite", label: "Orange → White", style: { background: "linear-gradient(135deg, #FFE4C4 0%, #ffffff 100%)" } },
];
const PRICE_LABEL = "₱40";
// ─── Gradient text helper ────────────────────────────────────────────────────
function GradientText({ children, className = "", size = "text-4xl" }) {
    return (<span className={`${size} font-black bg-clip-text text-transparent ${className}`} style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #2680CB 50%, #1D6098 100%)" }}>
      {children}
    </span>);
}
// ─── Machine Shell ────────────────────────────────────────────────────────────
function MachineShell({ children, moneySlotHighlight = false, printerActive = false, printStrip }) {
    return (<section id="photobooth" className="relative flex items-center justify-center min-h-screen w-full overflow-hidden py-20" style={{ background: "#CCE6FC" }}>
      {/* Subtle background dots */}
      <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, rgba(48,160,254,0.12) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
        }}/>

      {/* Machine body */}
      <div className="relative w-full max-w-[1280px] mx-4 rounded-[48px] border-[6px] border-black shadow-[0_20px_80px_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.6)]" style={{ background: "#f0f8ff", minHeight: "min(90vh, 820px)" }}>
        {/* Top accent strip */}
        <div className="absolute top-0 left-0 right-0 h-3 rounded-t-[42px]" style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #1D6098 100%)" }}/>

        {/* Brand badge top-left */}
        <div className="absolute top-5 left-8 z-20">
          <GradientText size="text-2xl">mari-photo ⊹ ࣪ ˖</GradientText>
        </div>

        {/* Right sidebar — money scanner + printer */}
        <div className="absolute right-0 top-0 bottom-0 w-[180px] flex flex-col items-center justify-between py-12 pr-6 pl-3 gap-6">
          {/* Money scanner */}
          <div className="flex flex-col items-center gap-2 w-full">
            <div className={`w-full rounded-[28px] border-[5px] border-black shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-300 ${moneySlotHighlight ? "shadow-[0_0_0_4px_#30A0FE,0_4px_20px_rgba(48,160,254,0.5)]" : ""}`} style={{ background: "#fff", padding: "18px 20px 22px" }}>
              <div className={`h-[14px] rounded-[8px] transition-all duration-300 ${moneySlotHighlight ? "bg-[#30A0FE] shadow-[0_0_12px_#30A0FE]" : "bg-black"}`}/>
            </div>
            <p className="text-[10px] text-center font-semibold text-black/60 leading-tight">
              *Coins are not accepted.
            </p>
          </div>

          {/* Printer slot */}
          <div className="w-full rounded-[28px] border-[5px] border-black shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_2px_8px_rgba(0,0,0,0.2)] overflow-hidden relative" style={{ background: "#fff", minHeight: "160px" }}>
            {/* Slot opening */}
            <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-black/10"/>
            <div className="h-full flex flex-col items-center justify-end pb-3">
              <div className="w-[70%] h-[6px] rounded-full bg-black/15 mb-1"/>
              <div className="w-[50%] h-[4px] rounded-full bg-black/10"/>
            </div>
            {printerActive && (<div className="absolute inset-0" style={{
                background: "repeating-linear-gradient(0deg, rgba(48,160,254,0.08) 0px, rgba(48,160,254,0.08) 4px, transparent 4px, transparent 8px)",
                animation: "printer-lines 0.3s linear infinite",
            }}/>)}
            {printStrip && (<div className="absolute bottom-0 left-0 right-0 flex justify-center" style={{ animation: "strip-emerge 3s ease-out forwards" }}>
                {printStrip}
              </div>)}
          </div>
          <p className="text-[10px] text-center font-semibold text-black/40 leading-tight">PRINTER</p>
        </div>

        {/* Main screen area */}
        <div className="pr-[180px] pl-0 pt-0 pb-0 h-full">
          <div className="ml-8 mr-0 mt-6 mb-6 rounded-[36px] border-[5px] border-black overflow-hidden shadow-[inset_0_4px_20px_rgba(0,0,0,0.35)]" style={{
            minHeight: "min(calc(90vh - 48px), 760px)",
            background: "linear-gradient(160deg, #ffffff 0%, #CCE6FC 100%)",
        }}>
            {children}
          </div>
        </div>
      </div>
    </section>);
}
// ─── SCREEN 1: Welcome ────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
    return (<MachineShell>
      <div className="flex flex-col items-center justify-center h-full min-h-[680px] gap-8 px-8 py-12">
        {/* Floating decorative circles */}
        <div className="absolute top-16 right-20 w-24 h-24 rounded-full opacity-20 pointer-events-none" style={{ background: "#30A0FE", animation: "float-gentle 4s ease-in-out infinite" }}/>
        <div className="absolute bottom-24 left-16 w-16 h-16 rounded-full opacity-15 pointer-events-none" style={{ background: "#1D6098", animation: "float-gentle 5s ease-in-out infinite 1s" }}/>

        <div style={{ animation: "fade-in 0.7s ease-out" }} className="flex flex-col items-center gap-6">
          {/* Big brand */}
          <div className="text-center">
            <div className="text-7xl font-black bg-clip-text text-transparent leading-tight" style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #2680CB 50%, #1D6098 100%)" }}>
              mari-photo
            </div>
            <div className="text-4xl font-black bg-clip-text text-transparent" style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #2680CB 50%, #1D6098 100%)" }}>
              ⊹ ࣪ ˖
            </div>
          </div>

          {/* Welcome message */}
          <div className="text-center max-w-md">
            <p className="text-xl font-bold text-[#1D6098] mb-1">Welcome!</p>
            <p className="text-base text-[#30A0FE]/80 font-medium">
              Your very own digital photobooth experience.
            </p>
          </div>

          {/* Instruction hint */}
          <div className="rounded-3xl border-2 border-[#CCE6FC] px-8 py-4 text-center" style={{ background: "rgba(204,230,252,0.4)" }}>
            <p className="text-sm font-semibold text-[#1D6098]">
              📸 Take photos · Choose backgrounds · Print your strip
            </p>
          </div>

          {/* Start button */}
          <button onClick={onStart} className="mt-2 px-16 py-5 rounded-full text-white font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 relative overflow-hidden group" style={{
            backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #1D6098 100%)",
            animation: "pulse-ring 2.5s ease-in-out infinite",
        }}>
            <span className="relative z-10 flex items-center gap-2">
              Start <span style={{ animation: "bounce-arrow 1.2s ease-in-out infinite" }}>→</span>
            </span>
          </button>

          <p className="text-xs text-black/40 font-medium">{PRICE_LABEL} required · Bills only</p>
        </div>
      </div>
    </MachineShell>);
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
        if (paid)
            return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY, bx: billPos.x, by: billPos.y });
    };
    const onPointerMove = (e) => {
        if (!dragging || paid)
            return;
        setBillPos({
            x: dragStart.bx + (e.clientX - dragStart.x),
            y: dragStart.by + (e.clientY - dragStart.y),
        });
    };
    const onPointerUp = () => {
        if (!dragging || paid)
            return;
        setDragging(false);
        // Check overlap with slot
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
    return (<MachineShell moneySlotHighlight={true}>
      <div className="relative flex flex-col items-center justify-center h-full min-h-[680px] gap-6 px-8 py-10 select-none">

        {/* Title */}
        <div style={{ animation: "fade-in 0.5s ease-out" }} className="text-center">
          <GradientText size="text-5xl">Payment</GradientText>
          <p className="text-[#1D6098] font-semibold mt-2">Insert {PRICE_LABEL} into the money scanner →</p>
        </div>

        {/* Instruction hint */}
        <div className="rounded-2xl px-6 py-3 border-2 border-dashed border-[#30A0FE]/50 text-center" style={{ background: "rgba(204,230,252,0.3)" }}>
          <p className="text-sm font-medium text-[#1D6098]" style={{ fontFamily: "'Hi Melody', cursive" }}>
            drag the bill to the scanner! ⊹
          </p>
        </div>

        {/* Bill — draggable */}
        <div ref={billRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} className={`cursor-grab active:cursor-grabbing touch-none z-30 ${sucked ? "pointer-events-none" : ""}`} style={{
            transform: `translate(${billPos.x}px, ${billPos.y}px)`,
            animation: sucked
                ? "bill-sucked 0.5s ease-in forwards"
                : dragging
                    ? "none"
                    : "slide-in-bill 0.8s ease-out",
            transition: dragging ? "none" : sucked ? "none" : "filter 0.2s",
            filter: dragging ? "drop-shadow(0 12px 24px rgba(0,0,0,0.35))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
        }}>
          {/* Philippine 50-peso bill (SVG approximation) */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-black/20" style={{ width: 300, height: 130 }}>
            {/* Bill background */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #e8a83a 0%, #d4941c 30%, #c4841a 60%, #d4941c 100%)" }}/>
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 6px)",
        }}/>
            {/* Denomination */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <div>
                <p className="text-white font-black text-3xl" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}>{PRICE_LABEL}</p>
                <p className="text-white/80 text-[10px] font-bold">REPUBLIKA NG PILIPINAS</p>
                <p className="text-white/70 text-[9px]">BANGKO SENTRAL NG PILIPINAS</p>
              </div>
              <div className="w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <p className="text-white font-black text-lg">40</p>
              </div>
            </div>
            {/* Shine */}
            <div className="absolute top-0 left-0 right-0 h-1/2 opacity-20 rounded-t-2xl" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)" }}/>
          </div>
        </div>

        {/* Money scanner target (visual) */}
        <div ref={slotRef} className="relative flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-[#30A0FE]/70 tracking-widest uppercase">Insert here</p>
          <div className="w-64 h-12 rounded-2xl border-4 border-dashed border-[#30A0FE] flex items-center justify-center transition-all duration-300" style={{ background: "rgba(48,160,254,0.08)", boxShadow: "0 0 20px rgba(48,160,254,0.2)" }}>
            <div className="w-36 h-3 rounded-full bg-[#30A0FE]/30"/>
          </div>
          <p className="text-xs text-black/40">↑ money scanner</p>
        </div>

        {/* Payment accepted overlay */}
        {showAccepted && (<div className="absolute inset-0 flex flex-col items-center justify-center z-50 rounded-[31px]" style={{ background: "rgba(204,230,252,0.9)", animation: "scale-in 0.3s ease-out" }}>
            <div className="text-6xl mb-4">✅</div>
            <GradientText size="text-4xl">Payment Accepted!</GradientText>
            <p className="text-[#1D6098] font-semibold mt-2">{PRICE_LABEL}.00 — Thank you!</p>
          </div>)}
      </div>
    </MachineShell>);
}
// ─── SCREEN 3: Layout Chooser ────────────────────────────────────────────────
function LayoutScreen({ selected, onSelect, onContinue, onBack, }) {
    return (<MachineShell>
      <div className="flex flex-col h-full min-h-[680px] px-8 py-8 gap-6" style={{ animation: "fade-in 0.4s ease-out" }}>
        {/* Header */}
        <div className="rounded-3xl py-4 px-8 text-center" style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #1D6098 100%)" }}>
          <p className="text-white font-extrabold text-2xl tracking-tight">Choose the type of the photo.</p>
        </div>

        {/* Grid of layout cards */}
        <div className="grid grid-cols-2 gap-5 flex-1">
          {LAYOUTS.map((layout) => {
            const isSelected = selected === layout.id;
            return (<button key={layout.id} onClick={() => onSelect(layout.id)} className={`rounded-3xl border-4 p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${isSelected
                    ? "border-[#30A0FE] shadow-[0_0_0_2px_#30A0FE,0_8px_32px_rgba(48,160,254,0.3)]"
                    : "border-black/10 shadow-md hover:border-[#30A0FE]/50"}`} style={{ background: isSelected ? "rgba(204,230,252,0.5)" : "rgba(255,255,255,0.7)" }}>
                {/* Strip preview */}
                <div className="flex-1 w-full flex items-center justify-center">
                  <LayoutPreview cols={layout.cols} rows={layout.rows}/>
                </div>
                <div className="text-center">
                  <p className={`font-black text-base ${isSelected ? "text-[#1D6098]" : "text-black/70"}`}>
                    {layout.label}
                  </p>
                  <p className="text-xs text-black/40 font-medium">{layout.desc}</p>
                </div>
                {isSelected && (<div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: "#30A0FE" }}>
                    ✓
                  </div>)}
              </button>);
        })}
        </div>

        {/* Footer buttons */}
        <div className="flex justify-between items-center">
          <button onClick={onBack} className="px-6 py-3 rounded-full border-2 border-[#1D6098] text-[#1D6098] font-bold text-sm hover:bg-[#1D6098]/10 transition-all">
            ← Back
          </button>
          <button onClick={onContinue} disabled={!selected} className={`px-10 py-4 rounded-full text-white font-black text-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 ${!selected ? "opacity-40 cursor-not-allowed" : ""}`} style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #1D6098 100%)" }}>
            Continue →
          </button>
        </div>
      </div>
    </MachineShell>);
}
function LayoutPreview({ cols, rows }) {
    const cellW = cols === 1 ? 80 : 60;
    const cellH = rows === 1 ? 80 : rows === 2 ? 55 : 40;
    return (<div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, ${cellW}px)` }}>
      {Array.from({ length: cols * rows }).map((_, i) => (<div key={i} className="rounded-lg border-2 border-black/15" style={{
                width: cellW,
                height: cellH,
                background: "linear-gradient(135deg, #CCE6FC 0%, #f0f8ff 100%)",
            }}/>))}
    </div>);
}
// ─── SCREEN 4: Camera ────────────────────────────────────────────────────────
function CameraScreen({ layout, onCapture, onBack, }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [camError, setCamError] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [flash, setFlash] = useState(false);
    const [shots, setShots] = useState([]);
    const totalShots = layout.cols * layout.rows;
    const streamRef = useRef(null);
    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } })
            .then((stream) => {
            streamRef.current = stream;
            if (videoRef.current)
                videoRef.current.srcObject = stream;
        })
            .catch(() => setCamError("Camera permission denied. Please allow camera access and try again."));
        return () => streamRef.current?.getTracks().forEach((t) => t.stop());
    }, []);
    const takeShot = useCallback(() => {
        return new Promise((resolve) => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas)
                return resolve("");
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext("2d");
            if (!ctx)
                return resolve("");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.92));
        });
    }, []);
    const startCapture = async () => {
        if (capturing)
            return;
        setCapturing(true);
        const captured = [];
        for (let i = 0; i < totalShots; i++) {
            // countdown 3-2-1
            for (let c = 3; c >= 1; c--) {
                setCountdown(c);
                await new Promise((r) => setTimeout(r, 900));
            }
            setCountdown(null);
            setFlash(true);
            const dataUrl = await takeShot();
            captured.push(dataUrl);
            setShots([...captured]);
            await new Promise((r) => setTimeout(r, 600));
            setFlash(false);
            if (i < totalShots - 1)
                await new Promise((r) => setTimeout(r, 400));
        }
        setCapturing(false);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        onCapture(captured);
    };
    return (<MachineShell>
      <div className="flex flex-col h-full min-h-[680px] px-6 py-6 gap-4" style={{ animation: "fade-in 0.4s ease-out" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="px-5 py-2 rounded-full border-2 border-[#1D6098] text-[#1D6098] font-bold text-sm hover:bg-[#1D6098]/10 transition-all">
            ← Back
          </button>
          <GradientText size="text-2xl">Camera</GradientText>
          <div className="text-sm font-bold text-[#1D6098]/60">
            {shots.length}/{totalShots} shots
          </div>
        </div>

        {/* Camera area */}
        <div className="flex-1 relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-black">
          {camError ? (<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center" style={{ background: "linear-gradient(160deg, #CCE6FC 0%, #f0f8ff 100%)" }}>
              <div className="text-5xl">📷</div>
              <p className="text-[#1D6098] font-bold text-lg">{camError}</p>
            </div>) : (<>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }}/>
              {/* Guide frame */}
              <div className="absolute inset-6 rounded-2xl border-4 border-white/60 pointer-events-none"/>

              {/* Countdown */}
              {countdown !== null && (<div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ background: "rgba(0,0,0,0.4)" }}>
                  <div key={countdown} className="text-[120px] font-black text-white" style={{ animation: "countdown-pop 0.9s ease-out forwards", textShadow: "0 0 40px rgba(48,160,254,0.8)" }}>
                    {countdown}
                  </div>
                </div>)}

              {/* Flash */}
              {flash && (<div className="absolute inset-0 bg-white pointer-events-none" style={{ animation: "flash-white 0.5s ease-out forwards" }}/>)}
            </>)}
        </div>

        <canvas ref={canvasRef} className="hidden"/>

        {/* Shot thumbnails */}
        {shots.length > 0 && (<div className="flex gap-2 justify-center flex-wrap">
            {shots.map((s, i) => (<div key={i} className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#30A0FE] shadow">
                <img src={s} className="w-full h-full object-cover" alt={`Shot ${i + 1}`}/>
              </div>))}
          </div>)}

        {/* Capture button */}
        {!capturing && shots.length < totalShots && (<button onClick={startCapture} disabled={!!camError} className="mx-auto w-20 h-20 rounded-full border-4 border-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center" style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #1D6098 100%)", animation: "pulse-ring 2s ease-in-out infinite" }}>
            <div className="w-12 h-12 rounded-full bg-white"/>
          </button>)}

        {capturing && countdown === null && (<div className="mx-auto text-sm font-bold text-[#1D6098] animate-pulse">📸 Getting ready...</div>)}
      </div>
    </MachineShell>);
}
// ─── SCREEN 5: Confirm ────────────────────────────────────────────────────────
function ConfirmScreen({ shots, layout, onConfirm, onRetake, onBack, }) {
    return (<MachineShell>
      <div className="flex flex-col h-full min-h-[680px] px-6 py-6 gap-5" style={{ animation: "fade-in 0.4s ease-out" }}>
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="px-5 py-2 rounded-full border-2 border-[#1D6098] text-[#1D6098] font-bold text-sm hover:bg-[#1D6098]/10 transition-all">
            ← Back
          </button>
          <GradientText size="text-2xl">Your Photos</GradientText>
          <GradientText size="text-base">mari-photo ⊹ ˖</GradientText>
        </div>

        {/* Strip preview */}
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white" style={{ background: "#fff", padding: 8 }}>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)` }}>
              {shots.map((src, i) => (<div key={i} className="rounded-xl overflow-hidden" style={{ width: layout.cols === 1 ? 240 : 160, height: layout.rows === 1 ? 200 : 140 }}>
                  <img src={src} className="w-full h-full object-cover" alt={`Photo ${i + 1}`} style={{ transform: "scaleX(-1)" }}/>
                </div>))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button onClick={onRetake} className="px-8 py-3 rounded-full border-2 border-[#1D6098] text-[#1D6098] font-bold hover:bg-[#1D6098]/10 transition-all flex items-center gap-2">
            ↻ Retake
          </button>
          <button onClick={onConfirm} className="px-12 py-4 rounded-full text-white font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #1D6098 100%)" }}>
            Use Photo →
          </button>
        </div>
      </div>
    </MachineShell>);
}
// ─── SCREEN 6: Background ────────────────────────────────────────────────────
function BackgroundScreen({ shots, layout, selectedBg, onSelectBg, onConfirm, onBack, }) {
    const [removing, setRemoving] = useState(false);
    const [removedShots, setRemovedShots] = useState([]);
    const [backgroundWasRemoved, setBackgroundWasRemoved] = useState(false);
    const [bgError, setBgError] = useState(null);
    const currentBg = BG_OPTIONS.find((b) => b.id === selectedBg) ?? BG_OPTIONS[0];
    useEffect(() => {
        // Try remove.bg API; fall back gracefully
        const apiKey = import.meta.env.VITE_REMOVEBG_API_KEY;
        if (!apiKey) {
            setRemovedShots(shots);
            setBackgroundWasRemoved(false);
            return;
        }
        setRemoving(true);
        Promise.all(shots.map(async (dataUrl) => {
            try {
                const blob = await (await fetch(dataUrl)).blob();
                const form = new FormData();
                form.append("image_file", blob, "photo.jpg");
                form.append("size", "auto");
                const res = await fetch("https://api.remove.bg/v1.0/removebg", {
                    method: "POST",
                    headers: { "X-Api-Key": apiKey },
                    body: form,
                });
                if (!res.ok)
                    throw new Error("remove.bg failed");
                const resultBlob = await res.blob();
                return URL.createObjectURL(resultBlob);
            }
            catch {
                return dataUrl;
            }
        }))
            .then((results) => {
            setRemovedShots(results);
            setBackgroundWasRemoved(true);
        })
            .catch(() => { setBgError("Background removal failed — using original."); setRemovedShots(shots); setBackgroundWasRemoved(false); })
            .finally(() => setRemoving(false));
    }, [shots]);
    const displayShots = removedShots.length ? removedShots : shots;
    return (<MachineShell>
      <div className="flex flex-col h-full min-h-[680px] px-6 py-6 gap-4" style={{ animation: "fade-in 0.4s ease-out" }}>
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="px-5 py-2 rounded-full border-2 border-[#1D6098] text-[#1D6098] font-bold text-sm hover:bg-[#1D6098]/10 transition-all">
            ← Back
          </button>
          <GradientText size="text-2xl">Choose Background</GradientText>
          <div />
        </div>

        <div className="flex-1 flex gap-5 min-h-0">
          {/* Preview */}
          <div className="flex-1 rounded-3xl overflow-hidden shadow-xl border-4 border-white relative">
            {removing ? (<div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "linear-gradient(160deg, #CCE6FC 0%, #f0f8ff 100%)" }}>
                <div className="w-12 h-12 rounded-full border-4 border-[#30A0FE] border-t-transparent" style={{ animation: "spin-slow 0.8s linear infinite" }}/>
                <p className="text-[#1D6098] font-bold">Removing background…</p>
              </div>) : (<div className="w-full h-full flex items-center justify-center p-4 transition-all duration-500" style={currentBg.style}>
                <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white" style={{ background: "#fff", padding: 6 }}>
                  <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)` }}>
                    {displayShots.slice(0, layout.cols * layout.rows).map((src, i) => (<div key={i} className="rounded-lg overflow-hidden relative" style={{
                    width: layout.cols === 1 ? 180 : 120,
                    height: layout.rows === 1 ? 160 : 110,
                    ...currentBg.style,
                }}>
                        <img src={src} className="w-full h-full object-cover" alt={`Photo ${i + 1}`} style={{ transform: "scaleX(-1)", mixBlendMode: backgroundWasRemoved ? "multiply" : "normal" }}/>
                      </div>))}
                  </div>
                </div>
              </div>)}
          </div>

          {/* BG swatches */}
          <div className="flex flex-col gap-3 w-36 justify-center">
            <p className="text-xs font-bold text-black/40 uppercase tracking-wider text-center">Backgrounds</p>
            {BG_OPTIONS.map((bg) => (<button key={bg.id} onClick={() => onSelectBg(bg.id)} className={`w-full h-16 rounded-2xl border-4 transition-all duration-200 hover:scale-105 active:scale-95 ${selectedBg === bg.id ? "border-[#30A0FE] shadow-[0_0_0_2px_#30A0FE]" : "border-black/10"}`} style={bg.style} title={bg.label}>
                {selectedBg === bg.id && (<div className="w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-black" style={{ background: "#30A0FE" }}>✓</div>
                  </div>)}
              </button>))}
          </div>
        </div>

        {bgError && <p className="text-xs text-orange-500 text-center font-medium">{bgError}</p>}

        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-[#1D6098]/60">{currentBg.label}</span>
          <button onClick={onConfirm} className="px-10 py-4 rounded-full text-white font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #1D6098 100%)" }}>
            Print! 🖨️
          </button>
        </div>
      </div>
    </MachineShell>);
}
// ─── SCREEN 7: Printing ────────────────────────────────────────────────────────
function PrintingScreen({ shots, layout, selectedBg, onDone, }) {
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
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
    return (<MachineShell printerActive={!done}>
      <div className="flex flex-col items-center justify-center h-full min-h-[680px] px-8 py-10 gap-6" style={{ animation: "fade-in 0.4s ease-out" }}>
        {!done ? (<>
            <GradientText size="text-4xl">Printing…</GradientText>
            <p className="text-[#1D6098] font-semibold">Please wait while your photo strip is printed.</p>

            {/* Animated strip emerging */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white" style={{
                background: "#fff",
                padding: 8,
                animation: "strip-emerge 3s ease-out forwards",
                animationDelay: "0.5s",
                opacity: 0,
                animationFillMode: "forwards",
            }}>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)` }}>
                {shots.slice(0, layout.cols * layout.rows).map((src, i) => (<div key={i} className="rounded-xl overflow-hidden relative" style={{
                    width: layout.cols === 1 ? 160 : 110,
                    height: layout.rows === 1 ? 140 : 100,
                    ...currentBg.style,
                }}>
                    <img src={src} className="w-full h-full object-cover" alt={`Photo ${i + 1}`} style={{ transform: "scaleX(-1)" }}/>
                  </div>))}
              </div>
              {/* Film strip label */}
              <div className="mt-2 text-center py-1 rounded-lg" style={{ background: "rgba(204,230,252,0.5)" }}>
                <GradientText size="text-xs">mari-photo ⊹ ˖</GradientText>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-sm">
              <div className="w-full h-3 rounded-full bg-black/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-150" style={{
                width: `${progress}%`,
                backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #1D6098 100%)",
            }}/>
              </div>
              <p className="text-center text-sm text-[#1D6098]/60 font-bold mt-1">{progress}%</p>
            </div>

            {/* Printer lines animation */}
            <div className="text-4xl" style={{ animation: "float-gentle 1.5s ease-in-out infinite" }}>
              🖨️
            </div>
          </>) : (<ThankYouContent onHome={onDone}/>)}
      </div>
    </MachineShell>);
}
function ThankYouContent({ onHome }) {
    return (<div className="flex flex-col items-center gap-6 text-center" style={{ animation: "scale-in 0.5s ease-out" }}>
      <div className="text-7xl" style={{ animation: "float-gentle 3s ease-in-out infinite" }}>🎉</div>
      <div>
        <GradientText size="text-5xl">Thank You!</GradientText>
        <div className="mt-2 text-2xl font-black bg-clip-text text-transparent" style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #1D6098 100%)" }}>
          for using mari-photo ⊹ ࣪ ˖
        </div>
      </div>
      <p className="text-[#1D6098] font-semibold text-lg max-w-sm">
        We hope you enjoyed your visit! Your photo strip is ready — enjoy! 📸
      </p>
      <div className="rounded-3xl px-8 py-4 border-2 border-[#CCE6FC] text-center" style={{ background: "rgba(204,230,252,0.4)" }}>
        <p className="text-base text-[#1D6098] font-medium" style={{ fontFamily: "'Hi Melody', cursive" }}>
          come back soon! ⊹ ˖ ✦
        </p>
      </div>
      <button onClick={onHome} className="px-12 py-4 rounded-full text-white font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" style={{ backgroundImage: "radial-gradient(ellipse at center, #30A0FE 0%, #1D6098 100%)" }}>
        ← Return Home
      </button>
    </div>);
}
// ─── App Root ─────────────────────────────────────────────────────────────────
export function Photobooth() {
    const [screen, setScreen] = useState("welcome");
    const [selectedLayout, setSelectedLayout] = useState("2x2");
    const [shots, setShots] = useState([]);
    const [selectedBg, setSelectedBg] = useState("lightblue");
    const layout = LAYOUTS.find((l) => l.id === selectedLayout) ?? LAYOUTS[0];
    const go = (s) => setScreen(s);
    if (screen === "welcome")
        return <WelcomeScreen onStart={() => go("payment")}/>;
    if (screen === "payment")
        return <PaymentScreen onPaid={() => go("layout")}/>;
    if (screen === "layout")
        return (<LayoutScreen selected={selectedLayout} onSelect={setSelectedLayout} onContinue={() => go("camera")} onBack={() => go("payment")}/>);
    if (screen === "camera")
        return (<CameraScreen layout={layout} onCapture={(s) => { setShots(s); go("confirm"); }} onBack={() => go("layout")}/>);
    if (screen === "confirm")
        return (<ConfirmScreen shots={shots} layout={layout} onConfirm={() => go("background")} onRetake={() => go("camera")} onBack={() => go("camera")}/>);
    if (screen === "background")
        return (<BackgroundScreen shots={shots} layout={layout} selectedBg={selectedBg} onSelectBg={setSelectedBg} onConfirm={() => go("printing")} onBack={() => go("confirm")}/>);
    if (screen === "printing")
        return (<PrintingScreen shots={shots} layout={layout} selectedBg={selectedBg} onDone={() => { setShots([]); setSelectedLayout("2x2"); setSelectedBg("lightblue"); go("welcome"); }}/>);
    return null;
}
export default function App() {
    return <Photobooth />;
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const PRICE_LABEL = "₱40"
const BILL_SRC = "/items/fifty.png"
const BRAND_BLUE = "radial-gradient(ellipse at center, #30A0FE 0%, #2680CB 50%, #1D6098 100%)"
const TEMPLATE_BASE = "/items/templates"

const templates = [
  {
    id: "passport",
    label: "Passport",
    desc: "6 clean headshots",
    src: `${TEMPLATE_BASE}/passport.png`,
    frames: [
      { x: 143, y: 121, w: 739, h: 683 },
      { x: 944, y: 121, w: 739, h: 683 },
      { x: 1743, y: 121, w: 739, h: 683 },
      { x: 143, y: 878, w: 739, h: 683 },
      { x: 944, y: 878, w: 739, h: 683 },
      { x: 1743, y: 878, w: 739, h: 683 },
    ],
  },
  {
    id: "driverslicense",
    label: "Driver's License",
    desc: "2 large + 4 small",
    src: `${TEMPLATE_BASE}/driverslicense.png`,
    frames: [
      { x: 143, y: 115, w: 1124, h: 834 },
      { x: 1355, y: 115, w: 1124, h: 834 },
      { x: 143, y: 1011, w: 548, h: 574 },
      { x: 740, y: 1011, w: 548, h: 574 },
      { x: 1335, y: 1011, w: 548, h: 574 },
      { x: 1931, y: 1011, w: 548, h: 574 },
    ],
  },
  {
    id: "resume",
    label: "Resume",
    desc: "8 bright ID copies",
    src: `${TEMPLATE_BASE}/resume.png`,
    frames: [
      { x: 143, y: 121, w: 548, h: 683 },
      { x: 740, y: 121, w: 548, h: 683 },
      { x: 1335, y: 121, w: 548, h: 683 },
      { x: 1931, y: 121, w: 548, h: 683 },
      { x: 143, y: 878, w: 548, h: 683 },
      { x: 740, y: 878, w: 548, h: 683 },
      { x: 1335, y: 878, w: 548, h: 683 },
      { x: 1931, y: 878, w: 548, h: 683 },
    ],
  },
  {
    id: "large",
    label: "Large",
    desc: "2 glossy portraits",
    src: `${TEMPLATE_BASE}/large.png`,
    frames: [
      { x: 143, y: 116, w: 1127, h: 1402 },
      { x: 1358, y: 116, w: 1127, h: 1402 },
    ],
  },
]

function Wordmark({ size = "text-3xl", light = false }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap font-google font-[1000] tracking-normal ${size}`}>
      <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_BLUE, textShadow: "0 0 0.035em rgba(29,96,152,0.55)" }}>
        mari-photobooth
      </span>
      <span className={light ? "text-white" : "text-[#30A0FE]"}>⊹˖</span>
    </span>
  )
}

function BoothButton({ children, className = "", variant = "primary", ...props }) {
  const classes =
    variant === "ghost"
      ? "border border-[#1D6098] bg-white/80 text-[#1D6098] hover:bg-[#CCE6FC]/70"
      : "text-white shadow-[0_0.625rem_1.25rem_rgba(29,96,152,0.25)] hover:scale-105"

  return (
    <button
      type="button"
      className={`rounded-full px-7 py-3 font-google text-sm font-black transition active:scale-95 disabled:pointer-events-none disabled:opacity-45 ${classes} ${className}`}
      style={variant === "primary" ? { backgroundImage: BRAND_BLUE } : undefined}
      {...props}
    >
      {children}
    </button>
  )
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function makeFramedPhoto(image, frame, brightening) {
  const temp = document.createElement("canvas")
  temp.width = frame.w
  temp.height = frame.h
  const tempCtx = temp.getContext("2d")
  const imageRatio = image.width / image.height
  const frameRatio = frame.w / frame.h
  const sourceWidth = imageRatio > frameRatio ? image.height * frameRatio : image.width
  const sourceHeight = imageRatio > frameRatio ? image.height : image.width / frameRatio
  const sourceX = (image.width - sourceWidth) / 2
  const sourceY = (image.height - sourceHeight) / 2

  tempCtx.filter = brightening ? "brightness(1.2) contrast(1.04) saturate(1.08)" : "none"
  tempCtx.translate(frame.w, 0)
  tempCtx.scale(-1, 1)
  tempCtx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, frame.w, frame.h)
  tempCtx.setTransform(1, 0, 0, 1, 0, 0)
  tempCtx.filter = "none"

  if (brightening) {
    tempCtx.globalCompositeOperation = "screen"
    tempCtx.fillStyle = "rgba(255, 246, 248, 0.14)"
    tempCtx.fillRect(0, 0, frame.w, frame.h)
    tempCtx.globalCompositeOperation = "source-over"
  }

  return temp
}

function drawFrame(ctx, image, frame, brightening) {
  const framedPhoto = makeFramedPhoto(image, frame, brightening)

  ctx.save()
  ctx.beginPath()
  ctx.rect(frame.x, frame.y, frame.w, frame.h)
  ctx.clip()
  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(frame.x, frame.y, frame.w, frame.h)
  ctx.drawImage(framedPhoto, frame.x, frame.y)
  ctx.restore()
}

function clearTemplateFrames(ctx, frames) {
  frames.forEach((frame) => {
    ctx.clearRect(frame.x, frame.y, frame.w, frame.h)
  })
}

async function composeTemplateImage(photoUrl, template, brightening) {
  const [photo, templateImage] = await Promise.all([loadImage(photoUrl), loadImage(template.src)])
  const canvas = document.createElement("canvas")
  canvas.width = templateImage.width
  canvas.height = templateImage.height
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  template.frames.forEach((frame) => drawFrame(ctx, photo, frame, brightening))

  const overlay = document.createElement("canvas")
  overlay.width = canvas.width
  overlay.height = canvas.height
  const overlayCtx = overlay.getContext("2d")
  overlayCtx.drawImage(templateImage, 0, 0)
  clearTemplateFrames(overlayCtx, template.frames)
  ctx.drawImage(overlay, 0, 0)

  return canvas.toDataURL("image/png")
}

function makeDownloadName(template) {
  return `mari-photo-${template.id}-${new Date().toISOString().slice(0, 10)}.png`
}

function TemplatePreview({ src, alt = "", composedUrl = "", active = false, compact = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[0.75rem] border bg-white shadow-[0_0.625rem_1.25rem_rgba(0,0,0,0.16)] ${
        active ? "border-[#1D6098]" : "border-black/10"
      } ${compact ? "w-[7.25rem]" : "w-[min(26rem,86vw)]"} p-1`}
      style={{ aspectRatio: "2622 / 1860" }}
    >
      <img src={composedUrl || src} alt={alt} className="h-full w-full object-contain" draggable={false} />
    </div>
  )
}

function Machine({ children, scannerRef, scannerActive = false, outputActive = false, outputStrip = null, floatingLayer = null }) {
  return (
    <section id="photobooth" className="relative overflow-hidden bg-[#CCE6FC] py-24 font-google text-ink">
      <div className="relative mx-auto max-w-[76rem] px-5">
        <div className="grid min-h-[43rem] grid-cols-1 gap-5 bg-[#CCE6FC] p-4 md:grid-cols-[minmax(0,1fr)_15rem] md:items-center md:p-10">
          <main className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border-[0.3125rem] border-black bg-[linear-gradient(180deg,#fff,#d9efff)] shadow-[inset_0_0.25rem_1.25rem_rgba(0,0,0,0.22),0_0.25rem_0.75rem_rgba(0,0,0,0.25)] md:min-h-[31rem]">
            {children}
          </main>

          <aside className="grid grid-cols-2 gap-5 md:grid-cols-1">
            <div className="flex flex-col items-center gap-2">
              <div
                ref={scannerRef}
                className={`flex h-[6rem] w-full items-center justify-center rounded-[1.25rem] border-[0.3125rem] border-black bg-white shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.25)] transition ${
                  scannerActive ? "ring-4 ring-[#30A0FE] ring-offset-2 ring-offset-[#CCE6FC]" : ""
                }`}
              >
                <div className={`h-4 w-[72%] rounded-full ${scannerActive ? "bg-[#30A0FE] shadow-[0_0_1rem_#30A0FE]" : "bg-black"}`} />
              </div>
              <p className="text-center text-[0.5rem] font-black leading-none text-black">*Coins are not accepted.</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="relative flex h-[13.75rem] w-full items-end justify-center overflow-hidden rounded-[1.25rem] border-[0.3125rem] border-black bg-white shadow-[0_0.375rem_1rem_rgba(0,0,0,0.3)]">
                <div className="absolute inset-x-4 top-4 z-20 h-3 rounded-full bg-black shadow-[0_0.1875rem_0.5rem_rgba(0,0,0,0.25)]" />
                {outputActive && <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(48,160,254,0.1)_0,rgba(48,160,254,0.1)_4px,transparent_4px,transparent_8px)] animate-photobooth-printer-lines" />}
                {outputStrip && (
                  <div className={`absolute left-1/2 top-7 z-10 -translate-x-1/2 ${outputActive ? "animate-photobooth-print-drop" : "translate-y-[2.25rem]"}`}>
                    {outputStrip}
                  </div>
                )}
              </div>
              <p className="text-center text-[0.5rem] font-black leading-none text-black/45">SAVE OUTPUT</p>
            </div>
          </aside>
        </div>
        {floatingLayer}
      </div>
    </section>
  )
}

function WelcomeScreen({ onStart }) {
  return (
    <Machine>
      <div className="flex h-full min-h-[28rem] flex-col items-center justify-center gap-5 p-8 text-center md:min-h-[31rem]">
        <p className="font-google text-[0.6875rem] font-black uppercase tracking-[0.04em] text-[#1D6098]/70">capture your kirei moment</p>
        <Wordmark size="text-[clamp(2.2rem,7vw,4.25rem)]" />
        <BoothButton onClick={onStart}>
          take a pic <span className="ml-1">→</span>
        </BoothButton>
      </div>
    </Machine>
  )
}

function PaymentScreen({ onPaid }) {
  const scannerRef = useRef(null)
  const billRef = useRef(null)
  const dragRef = useRef(null)
  const [billPosition, setBillPosition] = useState({ x: 0, y: 0 })
  const [accepted, setAccepted] = useState(false)

  function onPointerDown(event) {
    if (accepted) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originalX: billPosition.x,
      originalY: billPosition.y,
    }
  }

  function onPointerMove(event) {
    if (!dragRef.current || accepted) return
    setBillPosition({
      x: dragRef.current.originalX + event.clientX - dragRef.current.startX,
      y: dragRef.current.originalY + event.clientY - dragRef.current.startY,
    })
  }

  function onPointerUp() {
    if (!dragRef.current || accepted) return
    dragRef.current = null
    const billBox = billRef.current?.getBoundingClientRect()
    const scannerBox = scannerRef.current?.getBoundingClientRect()
    if (!billBox || !scannerBox) return

    const billCenterX = billBox.left + billBox.width / 2
    const billCenterY = billBox.top + billBox.height / 2
    const inScanner =
      billCenterX > scannerBox.left &&
      billCenterX < scannerBox.right &&
      billCenterY > scannerBox.top &&
      billCenterY < scannerBox.bottom

    if (!inScanner) {
      setBillPosition({ x: 0, y: 0 })
      return
    }

    setAccepted(true)
    setTimeout(onPaid, 900)
  }

  const billLayer = (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div className="absolute left-3 top-[6.75rem] -rotate-6 text-black md:left-4 md:top-[7.5rem]">
        <p className="ml-16 text-[1rem]" style={{ fontFamily: "'Hi Melody', cursive" }}>drag the bill to the scanner!</p>
        <svg width="96" height="44" viewBox="0 0 96 44" aria-hidden="true">
          <path d="M8 34 C 30 4, 58 8, 76 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M76 22 L 66 18 M76 22 L 70 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <img
        ref={billRef}
        src={BILL_SRC}
        alt="Fifty peso bill"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="pointer-events-auto absolute left-[-3.25rem] top-[11rem] z-30 w-[10rem] touch-none select-none md:left-[-4.75rem] md:top-[11.5rem] md:w-[12rem]"
        style={{
          transform: `translate(${billPosition.x}px, ${billPosition.y}px) rotate(-6deg)`,
          transition: dragRef.current ? "none" : "transform 180ms ease",
          opacity: accepted ? 0 : 1,
          filter: "drop-shadow(0 0.75rem 1.125rem rgba(0,0,0,0.25))",
        }}
        draggable={false}
      />
    </div>
  )

  return (
    <Machine scannerRef={scannerRef} scannerActive floatingLayer={billLayer}>
      <div className="relative flex h-full min-h-[28rem] flex-col items-center justify-center gap-7 p-8 text-center md:min-h-[31rem]">
        <div>
          <Wordmark size="text-2xl" />
          <p className="mx-auto mt-8 max-w-[22rem] text-left font-google text-[1.1rem] font-bold leading-[1.08] text-[#1D6098]">
            Insert {PRICE_LABEL} into the money scanner on the upper right corner of the machine. ⊹˖
          </p>
        </div>

        {accepted && (
          <div className="rounded-full bg-white/80 px-5 py-2 text-sm font-black text-[#1D6098] shadow">
            payment accepted
          </div>
        )}
      </div>
    </Machine>
  )
}

function TemplateScreen({ selectedTemplate, setSelectedTemplate, onBack, onNext }) {
  return (
    <Machine>
      <div className="flex h-full min-h-[28rem] flex-col gap-5 p-5 md:min-h-[31rem]">
        <div className="rounded-full px-6 py-4 text-center text-sm font-black text-white md:text-base" style={{ backgroundImage: BRAND_BLUE }}>
          Choose your Kirei-style template.
        </div>
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplate(template)}
              className={`rounded-[1.125rem] border-4 bg-white/75 p-3 text-left transition hover:-translate-y-1 ${
                selectedTemplate.id === template.id ? "border-[#1D6098] shadow-[0_0_0_0.1875rem_rgba(48,160,254,0.25)]" : "border-black/10"
              }`}
            >
              <TemplatePreview src={template.src} alt={`${template.label} template`} active={selectedTemplate.id === template.id} compact={false} />
              <div className="mt-2 flex items-end justify-between gap-2">
                <span className="font-google text-sm font-black text-[#1D6098]">{template.label}</span>
                <span className="text-[0.625rem] font-bold text-black/45">{template.desc}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          <BoothButton variant="ghost" onClick={onBack}>back</BoothButton>
          <BoothButton onClick={onNext}>continue →</BoothButton>
        </div>
      </div>
    </Machine>
  )
}

function CameraScreen({ onBack, onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraError, setCameraError] = useState("")
  const [countdown, setCountdown] = useState(null)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    let cancelled = false
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(() => setCameraError("Camera permission was denied. Enable camera access to take your photo."))

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const takePhoto = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return ""
    canvas.width = video.videoWidth || 900
    canvas.height = video.videoHeight || 675
    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL("image/jpeg", 0.92)
  }, [])

  async function capture() {
    if (countdown || cameraError) return
    for (let next = 3; next > 0; next -= 1) {
      setCountdown(next)
      await new Promise((resolve) => setTimeout(resolve, 850))
    }
    setCountdown(null)
    setFlash(true)
    const photo = takePhoto()
    await new Promise((resolve) => setTimeout(resolve, 350))
    setFlash(false)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    onCapture(photo)
  }

  return (
    <Machine>
      <div className="relative h-full min-h-[28rem] overflow-hidden bg-black md:min-h-[31rem]">
        {cameraError ? (
          <div className="flex h-full min-h-[28rem] items-center justify-center bg-white p-8 text-center text-sm font-bold text-[#1D6098] md:min-h-[31rem]">
            {cameraError}
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="h-full min-h-[28rem] w-full object-cover md:min-h-[31rem]" style={{ transform: "scaleX(-1)" }} />
        )}
        <div className="absolute left-4 top-4">
          <Wordmark size="text-lg" light />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[58%] w-[44%] rounded-xl border-4 border-white" />
        </div>
        {countdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="animate-photobooth-countdown font-google text-[8rem] font-black text-white">{countdown}</span>
          </div>
        )}
        {flash && <div className="absolute inset-0 animate-photobooth-flash bg-white" />}
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
          <BoothButton variant="ghost" onClick={onBack}>back</BoothButton>
          <BoothButton onClick={capture}>capture</BoothButton>
        </div>
      </div>
    </Machine>
  )
}

function EditScreen({
  photo,
  template,
  brightening,
  setBrightening,
  composedUrl,
  onRetake,
  onSave,
}) {
  return (
    <Machine>
      <div className="grid h-full min-h-[28rem] grid-cols-1 gap-5 p-5 md:min-h-[31rem] md:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="flex items-center justify-center rounded-[1.25rem] bg-white/60 p-3">
          <TemplatePreview src={template.src} composedUrl={composedUrl} alt={`${template.label} preview`} />
        </div>
        <div className="flex flex-col justify-center gap-3">
          <Wordmark size="text-2xl" />
          <p className="text-sm font-black text-[#1D6098]">Kirei finish</p>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-[#CCE6FC] bg-white/80 p-3 text-sm font-black text-[#1D6098]">
            <span>Brightening filter</span>
            <input
              type="checkbox"
              checked={brightening}
              onChange={(event) => setBrightening(event.target.checked)}
              className="h-5 w-5 accent-[#30A0FE]"
            />
          </label>
          <BoothButton onClick={onSave} disabled={!photo || !composedUrl}>save →</BoothButton>
          <BoothButton variant="ghost" onClick={onRetake}>↻ retake</BoothButton>
        </div>
      </div>
    </Machine>
  )
}

function SavingScreen({ strip }) {
  return (
    <Machine outputActive outputStrip={strip}>
      <div className="flex h-full min-h-[28rem] flex-col items-center justify-center gap-4 p-8 text-center md:min-h-[31rem]">
        <Wordmark size="text-5xl" />
        <p className="font-google text-lg font-black text-[#1D6098]">saving your kirei sheet...</p>
      </div>
    </Machine>
  )
}

function DoneScreen({ strip, saveUrl, template, onRestart }) {
  return (
    <Machine outputStrip={strip}>
      <div className="grid h-full min-h-[28rem] grid-cols-1 items-center gap-5 p-6 text-center md:min-h-[31rem] md:grid-cols-[minmax(0,1fr)_14rem] md:text-left">
        <div className="flex items-center justify-center">
          <div className="animate-photobooth-pop-up -rotate-1">
            <TemplatePreview src={template.src} composedUrl={saveUrl} alt={`${template.label} saved sheet`} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Wordmark size="text-[clamp(2rem,5vw,3.5rem)]" />
          <p className="text-lg font-black leading-tight text-[#1D6098]">your {template.label.toLowerCase()} sheet is ready</p>
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href={saveUrl}
              download={makeDownloadName(template)}
              className="rounded-full px-7 py-3 font-google text-sm font-black text-white shadow-[0_0.625rem_1.25rem_rgba(29,96,152,0.25)] transition hover:scale-105 active:scale-95"
              style={{ backgroundImage: BRAND_BLUE }}
            >
              save photo
            </a>
            <BoothButton variant="ghost" onClick={onRestart}>restart</BoothButton>
          </div>
        </div>
      </div>
    </Machine>
  )
}

export function Photobooth() {
  const [step, setStep] = useState("welcome")
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [brightening, setBrightening] = useState(true)
  const [photo, setPhoto] = useState("")
  const [composedUrl, setComposedUrl] = useState("")
  const [saveUrl, setSaveUrl] = useState("")

  useEffect(() => {
    if (!photo) {
      setComposedUrl("")
      return
    }

    let cancelled = false
    composeTemplateImage(photo, selectedTemplate, brightening).then((url) => {
      if (!cancelled) setComposedUrl(url)
    })

    return () => {
      cancelled = true
    }
  }, [photo, selectedTemplate, brightening])

  const outputStrip = useMemo(() => {
    if (!composedUrl) return null
    return <TemplatePreview src={selectedTemplate.src} composedUrl={composedUrl} alt="" compact />
  }, [composedUrl, selectedTemplate])

  function startSave() {
    if (!composedUrl) return
    setSaveUrl(composedUrl)
    setStep("saving")
    window.setTimeout(() => setStep("done"), 2300)
  }

  function restart() {
    setStep("welcome")
    setSelectedTemplate(templates[0])
    setBrightening(true)
    setPhoto("")
    setComposedUrl("")
    setSaveUrl("")
  }

  if (step === "welcome") return <WelcomeScreen onStart={() => setStep("payment")} />
  if (step === "payment") return <PaymentScreen onPaid={() => setStep("template")} />
  if (step === "template") {
    return (
      <TemplateScreen
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        onBack={() => setStep("payment")}
        onNext={() => setStep("camera")}
      />
    )
  }
  if (step === "camera") {
    return (
      <CameraScreen
        onBack={() => setStep("template")}
        onCapture={(capturedPhoto) => {
          setPhoto(capturedPhoto)
          setStep("edit")
        }}
      />
    )
  }
  if (step === "edit") {
    return (
      <EditScreen
        photo={photo}
        template={selectedTemplate}
        brightening={brightening}
        setBrightening={setBrightening}
        composedUrl={composedUrl}
        onRetake={() => setStep("camera")}
        onSave={startSave}
      />
    )
  }
  if (step === "saving") return <SavingScreen strip={outputStrip} />
  if (step === "done") return <DoneScreen strip={outputStrip} saveUrl={saveUrl} template={selectedTemplate} onRestart={restart} />
  return null
}

export default Photobooth

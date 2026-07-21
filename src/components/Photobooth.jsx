import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

const steps = ["welcome", "payment", "layout", "camera", "confirm", "background", "printing", "thanks"]

const layouts = [
  { id: "classic", name: "Classic 3-cut", frames: 3, className: "grid-rows-3" },
  { id: "quad", name: "Square 4-cut", frames: 4, className: "grid-cols-2 grid-rows-2" },
  { id: "wide", name: "Double wide", frames: 2, className: "grid-rows-2" },
]

const backgrounds = [
  { id: "blue", name: "Light Blue", css: "#CCE6FC", kind: "solid", colors: ["#CCE6FC"] },
  { id: "gray", name: "Gray", css: "#ECEFF1", kind: "solid", colors: ["#ECEFF1"] },
  { id: "blue-white", name: "Blue -> White", css: "linear-gradient(145deg, #CCE6FC, #FFFFFF)", kind: "gradient", colors: ["#CCE6FC", "#FFFFFF"] },
  { id: "pink-white", name: "Pink -> White", css: "linear-gradient(145deg, #FFDCE8, #FFFFFF)", kind: "gradient", colors: ["#FFDCE8", "#FFFFFF"] },
  { id: "orange-white", name: "Orange -> White", css: "linear-gradient(145deg, #FFE1C4, #FFFFFF)", kind: "gradient", colors: ["#FFE1C4", "#FFFFFF"] },
]

const stepLabels = {
  welcome: "Ready",
  payment: "Payment",
  layout: "Layout",
  camera: "Camera",
  confirm: "Preview",
  background: "Backdrop",
  printing: "Printing",
  thanks: "Done",
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function fillBackground(ctx, background, width, height) {
  if (background.kind === "gradient") {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, background.colors[0])
    gradient.addColorStop(1, background.colors[1])
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = background.colors[0]
  }
  ctx.fillRect(0, 0, width, height)
}

function drawImageCover(ctx, image, x, y, width, height) {
  const imageRatio = image.width / image.height
  const areaRatio = width / height
  const sourceWidth = imageRatio > areaRatio ? image.height * areaRatio : image.width
  const sourceHeight = imageRatio > areaRatio ? image.height : image.width / areaRatio
  const sourceX = (image.width - sourceWidth) / 2
  const sourceY = (image.height - sourceHeight) / 2
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height)
}

function playAcceptedTone() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(880, context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1320, context.currentTime + 0.12)
    gain.gain.setValueAtTime(0.001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.2)
  } catch {
    // Sound is optional; ignore browsers that block or do not support Web Audio.
  }
}

const canvasFont = (weight, size, family = "sans-serif") => `${weight} ${size}px ${family}`
const canvasBlur = (amount) => `blur(${amount}px)`

function drawPortraitMask(ctx, width, height) {
  ctx.fillStyle = "#FFFFFF"
  ctx.filter = canvasBlur(14.4)

  ctx.beginPath()
  ctx.ellipse(width * 0.5, height * 0.34, width * 0.23, height * 0.29, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.ellipse(width * 0.5, height * 0.83, width * 0.43, height * 0.47, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.filter = "none"
  ctx.beginPath()
  ctx.ellipse(width * 0.5, height * 0.35, width * 0.2, height * 0.25, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.ellipse(width * 0.5, height * 0.86, width * 0.38, height * 0.42, 0, 0, Math.PI * 2)
  ctx.fill()
}

async function composeLocalBackdrop(photoUrl, background) {
  const photo = await loadImage(photoUrl)
  const canvas = document.createElement("canvas")
  canvas.width = 900
  canvas.height = 675
  const ctx = canvas.getContext("2d")
  fillBackground(ctx, background, canvas.width, canvas.height)

  const subjectLayer = document.createElement("canvas")
  subjectLayer.width = canvas.width
  subjectLayer.height = canvas.height
  const subjectCtx = subjectLayer.getContext("2d")
  drawImageCover(subjectCtx, photo, 0, 0, subjectLayer.width, subjectLayer.height)

  const mask = document.createElement("canvas")
  mask.width = canvas.width
  mask.height = canvas.height
  drawPortraitMask(mask.getContext("2d"), mask.width, mask.height)

  subjectCtx.globalCompositeOperation = "destination-in"
  subjectCtx.drawImage(mask, 0, 0)
  subjectCtx.globalCompositeOperation = "source-over"

  ctx.save()
  ctx.shadowColor = "rgba(29, 96, 152, 0.22)"
  ctx.shadowBlur = 24
  ctx.shadowOffsetY = 12
  ctx.drawImage(subjectLayer, 0, 0)
  ctx.restore()

  return canvas.toDataURL("image/png")
}

async function composeStrip(photoUrl, layout, background) {
  const photo = await loadImage(photoUrl)
  const width = layout.id === "classic" ? 560 : 760
  const height = layout.id === "quad" ? 1080 : layout.id === "wide" ? 1180 : 1580
  const gutter = 34
  const titleHeight = 126
  const footerHeight = 86
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = "#111111"
  ctx.fillRect(18, 18, width - 36, height - 36)
  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(34, 34, width - 68, height - 68)

  ctx.fillStyle = "#1D6098"
  ctx.font = canvasFont(700, 27.2)
  ctx.textAlign = "center"
  ctx.fillText("mari-photo", width / 2, 86)
  ctx.fillStyle = "#30A0FE"
  ctx.font = canvasFont(500, 14.4)
  ctx.fillText("⊹ ࣪ ˖", width / 2, 114)

  const contentX = 58
  const contentY = titleHeight
  const contentWidth = width - contentX * 2
  const contentHeight = height - titleHeight - footerHeight
  const frames = layout.frames

  for (let i = 0; i < frames; i += 1) {
    let x = contentX
    let y = contentY
    let frameWidth = contentWidth
    let frameHeight = (contentHeight - gutter * (frames - 1)) / frames

    if (layout.id === "quad") {
      frameWidth = (contentWidth - gutter) / 2
      frameHeight = (contentHeight - gutter) / 2
      x = contentX + (i % 2) * (frameWidth + gutter)
      y = contentY + Math.floor(i / 2) * (frameHeight + gutter)
    } else {
      y = contentY + i * (frameHeight + gutter)
    }

    ctx.save()
    ctx.beginPath()
    ctx.rect(x, y, frameWidth, frameHeight)
    ctx.clip()
    fillBackground(ctx, background, width, height)
    drawImageCover(ctx, photo, x, y, frameWidth, frameHeight)
    ctx.restore()
    ctx.strokeStyle = "#CCE6FC"
    ctx.lineWidth = 10
    ctx.strokeRect(x, y, frameWidth, frameHeight)
  }

  ctx.fillStyle = "#111111"
  ctx.font = canvasFont(700, 14.4)
  ctx.fillText("thank you for visiting", width / 2, height - 44)

  return canvas.toDataURL("image/png")
}

function StepButton({ children, disabled, variant = "primary", ...props }) {
  const classes =
    variant === "ghost"
      ? "bg-white/80 text-[#1D6098] border border-[#CCE6FC] hover:bg-white"
      : "bg-[#30A0FE] text-white border border-[#30A0FE] hover:bg-[#1D6098]"

  return (
    <button
      type="button"
      disabled={disabled}
      className={`rounded-full px-5 py-3 font-mono text-[0.75rem] font-bold uppercase tracking-wide shadow-[0_0.75rem_1.375rem_rgba(29,96,152,0.18)] transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 ${classes}`}
      {...props}
    >
      {children}
    </button>
  )
}

function Slot({ scannerRef, active }) {
  return (
    <div ref={scannerRef} className="absolute right-5 top-5 z-20 w-28 sm:w-36">
      <div className="rounded-[1.125rem] bg-black p-2 shadow-[0_0.875rem_1.625rem_rgba(0,0,0,0.3)]">
        <div className={`h-5 rounded-full bg-[#1D6098] ${active ? "photobooth-scan-pulse" : ""}`} />
        <div className="mt-2 flex items-center justify-between px-1 font-mono text-[0.5rem] text-white/80">
          <span>₱50</span>
          <span>SCAN</span>
        </div>
      </div>
    </div>
  )
}

export default function Photobooth() {
  const [step, setStep] = useState("welcome")
  const [selectedLayout, setSelectedLayout] = useState(layouts[0])
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0])
  const [billPosition, setBillPosition] = useState({ x: 0, y: 0 })
  const [billInserted, setBillInserted] = useState(false)
  const [paymentAccepted, setPaymentAccepted] = useState(false)
  const [cameraError, setCameraError] = useState("")
  const [countdown, setCountdown] = useState(null)
  const [capturedPhoto, setCapturedPhoto] = useState("")
  const [isCompositing, setIsCompositing] = useState(false)
  const [compositedPhoto, setCompositedPhoto] = useState("")
  const [stripImage, setStripImage] = useState("")
  const scannerRef = useRef(null)
  const billRef = useRef(null)
  const dragRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const printTimerRef = useRef(null)

  const stepIndex = steps.indexOf(step)
  const canGoBack = step !== "welcome"

  const currentPhotoForPreview = compositedPhoto || capturedPhoto

  useEffect(() => {
    if (step !== "camera") {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      return
    }

    let cancelled = false
    setCameraError("")
    setCountdown(null)

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch {
        setCameraError("Camera permission was denied. Enable camera access to take a photobooth photo.")
      }
    }

    startCamera()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [step])

  useEffect(() => {
    return () => window.clearTimeout(printTimerRef.current)
  }, [])

  useEffect(() => {
    if (!capturedPhoto || step !== "background") return

    let cancelled = false
    setIsCompositing(true)
    composeLocalBackdrop(capturedPhoto, selectedBackground)
      .then((url) => {
        if (!cancelled) setCompositedPhoto(url)
      })
      .finally(() => {
        if (!cancelled) setIsCompositing(false)
      })

    return () => {
      cancelled = true
    }
  }, [capturedPhoto, selectedBackground, step])

  const progress = useMemo(() => Math.max(0, (stepIndex / (steps.length - 1)) * 100), [stepIndex])

  function resetBooth() {
    window.clearTimeout(printTimerRef.current)
    setStep("welcome")
    setSelectedLayout(layouts[0])
    setSelectedBackground(backgrounds[0])
    setBillPosition({ x: 0, y: 0 })
    setBillInserted(false)
    setPaymentAccepted(false)
    setCameraError("")
    setCountdown(null)
    setCapturedPhoto("")
    setIsCompositing(false)
    setCompositedPhoto("")
    setStripImage("")
  }

  function goBack() {
    window.clearTimeout(printTimerRef.current)
    if (step === "payment") setStep("welcome")
    if (step === "layout") setStep("payment")
    if (step === "camera") setStep("layout")
    if (step === "confirm") setStep("camera")
    if (step === "background") setStep("confirm")
    if (step === "printing") setStep("background")
    if (step === "thanks") setStep("background")
  }

  function startPayment() {
    setBillPosition({ x: 0, y: 0 })
    setBillInserted(false)
    setPaymentAccepted(false)
    setStep("payment")
  }

  function onBillPointerDown(event) {
    if (billInserted) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originalX: billPosition.x,
      originalY: billPosition.y,
    }
  }

  function onBillPointerMove(event) {
    if (!dragRef.current || billInserted) return
    setBillPosition({
      x: dragRef.current.originalX + event.clientX - dragRef.current.startX,
      y: dragRef.current.originalY + event.clientY - dragRef.current.startY,
    })
  }

  function onBillPointerUp() {
    if (!dragRef.current || billInserted) return
    dragRef.current = null

    const scannerBox = scannerRef.current?.getBoundingClientRect()
    const billBox = billRef.current?.getBoundingClientRect()
    if (!scannerBox || !billBox) return

    const billCenterX = billBox.left + billBox.width / 2
    const billCenterY = billBox.top + billBox.height / 2
    const inserted =
      billCenterX > scannerBox.left &&
      billCenterX < scannerBox.right &&
      billCenterY > scannerBox.top &&
      billCenterY < scannerBox.bottom

    if (!inserted) {
      setBillPosition({ x: 0, y: 0 })
      return
    }

    setBillInserted(true)
    setPaymentAccepted(true)
    playAcceptedTone()
    setTimeout(() => setStep("layout"), 1100)
  }

  function capturePhoto() {
    if (!videoRef.current || countdown !== null || cameraError) return
    let next = 3
    setCountdown(next)
    const timer = window.setInterval(() => {
      next -= 1
      if (next > 0) {
        setCountdown(next)
        return
      }

      window.clearInterval(timer)
      const video = videoRef.current
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth || 900
      canvas.height = video.videoHeight || 1200
      const ctx = canvas.getContext("2d")
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      setCapturedPhoto(canvas.toDataURL("image/png"))
      setCompositedPhoto("")
      setIsCompositing(false)
      setCountdown(null)
      setStep("confirm")
    }, 900)
  }

  async function startPrinting() {
    if (!compositedPhoto) return
    const strip = await composeStrip(compositedPhoto, selectedLayout, selectedBackground)
    setStripImage(strip)
    setStep("printing")
    window.clearTimeout(printTimerRef.current)
    printTimerRef.current = window.setTimeout(() => setStep("thanks"), 4300)
  }

  return (
    <section id="photobooth" className="relative overflow-hidden bg-white py-28 text-black">
      <div className="max-w-[73.75rem] mx-auto px-6 sm:px-8">
        <div className="mb-8 max-w-2xl">
          <span className="kicker-dash font-mono text-xs text-[#1D6098] flex items-center gap-2.5 mb-3.5">
            photobooth
          </span>
          <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,2.9rem)]">
            mari-photo ⊹ ࣪ ˖
          </h2>
        </div>

        <div className="relative mx-auto max-w-[61.25rem] rounded-[2rem] bg-[#30A0FE] p-3 shadow-[0_1.75rem_4.375rem_rgba(29,96,152,0.34)] sm:p-5">
          <div className="relative min-h-[47.5rem] overflow-hidden rounded-[1.625rem] border-[0.625rem] border-black bg-[#CCE6FC] sm:border-[0.875rem]">
            <Slot scannerRef={scannerRef} active={step === "payment"} />

            <div className="absolute left-1/2 bottom-6 z-20 w-[min(22.5rem,72vw)] -translate-x-1/2">
              <div className="rounded-[1.125rem] bg-black p-3 shadow-[0_1.125rem_1.75rem_rgba(0,0,0,0.3)]">
                <div className="h-5 rounded-full bg-white/90" />
                <p className="mt-2 text-center font-mono text-[0.5625rem] uppercase tracking-[0.28em] text-white/75">
                  print output
                </p>
              </div>
            </div>

            <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between gap-3 pr-32 sm:pr-44">
              {canGoBack ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-full bg-white/90 px-4 py-2 font-mono text-[0.6875rem] font-bold uppercase text-[#1D6098] shadow-[0_0.5rem_1.125rem_rgba(29,96,152,0.16)] transition hover:-translate-x-0.5"
                >
                  Back
                </button>
              ) : (
                <span />
              )}
              <div className="hidden flex-1 overflow-hidden rounded-full bg-white/55 p-1 sm:block">
                <div className="h-2 rounded-full bg-[#1D6098] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="rounded-full bg-black px-3 py-2 font-mono text-[0.625rem] uppercase text-white">
                {stepLabels[step]}
              </span>
            </div>

            <div className="relative z-[5] min-h-[47.5rem] px-5 pb-36 pt-28 sm:px-8">
              <AnimatePresence mode="wait">
                {step === "welcome" && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    className="mx-auto flex max-w-xl flex-col items-center justify-center text-center"
                  >
                    <div className="mb-8 rounded-[1.75rem] border-[0.5rem] border-black bg-white p-7 shadow-[0_1.125rem_2.25rem_rgba(29,96,152,0.22)]">
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.38em] text-[#1D6098]">self-service</p>
                      <h3 className="mt-3 font-display text-[clamp(2.2rem,7vw,4.4rem)] leading-none text-black">
                        mari-photo <span className="text-[#30A0FE]">⊹ ࣪ ˖</span>
                      </h3>
                      <p className="mx-auto mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-black/65">
                        Step in, insert ₱50, pick your strip, snap a photo, choose a backdrop, and print.
                      </p>
                    </div>
                    <StepButton onClick={startPayment}>Start</StepButton>
                  </motion.div>
                )}

                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    className="relative mx-auto min-h-[35rem] max-w-3xl"
                  >
                    <div className="rounded-[1.75rem] border-[0.5rem] border-black bg-white p-7 shadow-[0_1.125rem_2.25rem_rgba(29,96,152,0.18)]">
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.28em] text-[#1D6098]">insert payment</p>
                      <h3 className="mt-2 font-display text-4xl">₱50 photo session</h3>
                      <p className="mt-3 max-w-md text-[0.875rem] text-black/60">Drag the bill into the scanner slot.</p>
                      {paymentAccepted && (
                        <p className="mt-5 inline-flex rounded-full bg-[#CCE6FC] px-4 py-2 font-mono text-[0.6875rem] font-bold text-[#1D6098]">
                          Payment Accepted
                        </p>
                      )}
                    </div>

                    <motion.img
                      ref={billRef}
                      src="/items/fifty.png"
                      alt="Fifty peso bill"
                      onPointerDown={onBillPointerDown}
                      onPointerMove={onBillPointerMove}
                      onPointerUp={onBillPointerUp}
                      onPointerCancel={onBillPointerUp}
                      initial={{ x: "-120%", rotate: -4, opacity: 0 }}
                      animate={
                        billInserted
                          ? { x: "calc(100vw - 16.25rem)", y: -36, opacity: 0, scale: 0.35 }
                          : { x: billPosition.x, y: billPosition.y, rotate: -1, opacity: 1, scale: 1 }
                      }
                      transition={{ duration: billInserted ? 0.55 : 0.12, ease: "easeOut" }}
                      className="absolute left-0 top-72 z-30 w-[min(24.375rem,72vw)] touch-none select-none rounded-md shadow-[0_1rem_1.75rem_rgba(0,0,0,0.22)]"
                      draggable={false}
                    />
                  </motion.div>
                )}

                {step === "layout" && (
                  <motion.div
                    key="layout"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    className="mx-auto max-w-4xl"
                  >
                    <div className="mb-6 text-center">
                      <h3 className="font-display text-4xl">Choose your strip</h3>
                      <p className="mt-2 text-[0.875rem] text-black/60">Pick a print style before heading into the booth.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {layouts.map((layout) => (
                        <button
                          type="button"
                          key={layout.id}
                          onClick={() => setSelectedLayout(layout)}
                          className={`rounded-[1.5rem] border-[0.3125rem] bg-white p-4 text-left shadow-[0_1rem_1.75rem_rgba(29,96,152,0.18)] transition-all duration-200 hover:-translate-y-1 ${
                            selectedLayout.id === layout.id ? "border-[#1D6098]" : "border-black"
                          }`}
                        >
                          <div className={`grid h-64 gap-2 rounded-[1rem] bg-black p-3 ${layout.className}`}>
                            {Array.from({ length: layout.frames }).map((_, i) => (
                              <span key={i} className="rounded-md bg-[linear-gradient(145deg,#CCE6FC,#FFFFFF)]" />
                            ))}
                          </div>
                          <span className="mt-4 block font-mono text-[0.6875rem] font-bold uppercase text-[#1D6098]">
                            {layout.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-7 flex justify-center">
                      <StepButton onClick={() => setStep("camera")} disabled={!selectedLayout}>
                        Continue
                      </StepButton>
                    </div>
                  </motion.div>
                )}

                {step === "camera" && (
                  <motion.div
                    key="camera"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    className="mx-auto max-w-3xl text-center"
                  >
                    <div className="relative overflow-hidden rounded-[1.75rem] border-[0.5rem] border-black bg-black shadow-[0_1.25rem_2.375rem_rgba(29,96,152,0.24)]">
                      {cameraError ? (
                        <div className="flex aspect-[4/3] items-center justify-center bg-white p-8 text-center text-sm text-black/65">
                          {cameraError}
                        </div>
                      ) : (
                        <video ref={videoRef} className="aspect-[4/3] w-full -scale-x-100 object-cover" playsInline muted />
                      )}
                      {countdown !== null && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="photobooth-count-pop font-display text-[clamp(5rem,18vw,9rem)] text-white">
                            {countdown}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-7 flex justify-center">
                      <StepButton onClick={capturePhoto} disabled={Boolean(cameraError) || countdown !== null}>
                        Capture
                      </StepButton>
                    </div>
                  </motion.div>
                )}

                {step === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    className="mx-auto max-w-3xl text-center"
                  >
                    <div className="mx-auto max-w-lg rounded-[1.75rem] border-[0.5rem] border-black bg-white p-4 shadow-[0_1.25rem_2.375rem_rgba(29,96,152,0.24)]">
                      <img src={capturedPhoto} alt="Captured photobooth preview" className="aspect-[4/3] w-full rounded-[1.125rem] object-cover" />
                    </div>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                      <StepButton variant="ghost" onClick={() => setStep("camera")}>
                        Retake Photo
                      </StepButton>
                      <StepButton onClick={() => setStep("background")}>Use Photo</StepButton>
                    </div>
                  </motion.div>
                )}

                {step === "background" && (
                  <motion.div
                    key="background"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1fr_0.85fr]"
                  >
                    <div className="rounded-[1.75rem] border-[0.5rem] border-black bg-white p-4 shadow-[0_1.25rem_2.375rem_rgba(29,96,152,0.24)]">
                      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.125rem]" style={{ background: selectedBackground.css }}>
                        {isCompositing ? (
                          <div className="flex flex-col items-center gap-3 font-mono text-[0.75rem] uppercase tracking-wide text-[#1D6098]">
                            <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#CCE6FC] border-t-[#1D6098]" />
                            preparing backdrop
                          </div>
                        ) : currentPhotoForPreview ? (
                          <img src={currentPhotoForPreview} alt="Selected photobooth background preview" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <p className="mt-4 rounded-[1.125rem] bg-[#CCE6FC] p-4 text-sm leading-relaxed text-[#1D6098]">
                        Local backdrop mode uses an in-browser portrait matte, so it works without an API key or upload.
                      </p>
                    </div>
                    <div className="rounded-[1.75rem] border-[0.5rem] border-black bg-white p-5">
                      <h3 className="font-display text-3xl">Choose backdrop</h3>
                      <div className="mt-5 grid grid-cols-1 gap-3">
                        {backgrounds.map((background) => (
                          <button
                            type="button"
                            key={background.id}
                            onClick={() => setSelectedBackground(background)}
                            className={`flex items-center gap-4 rounded-[1.125rem] border-4 p-3 text-left transition hover:-translate-y-0.5 ${
                              selectedBackground.id === background.id ? "border-[#1D6098]" : "border-[#CCE6FC]"
                            }`}
                          >
                            <span className="h-12 w-16 rounded-[0.75rem] border border-black/10" style={{ background: background.css }} />
                            <span className="font-mono text-[0.75rem] font-bold uppercase text-black/75">{background.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-6">
                        <StepButton onClick={startPrinting} disabled={!compositedPhoto || isCompositing}>
                          Print Strip
                        </StepButton>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === "printing" && (
                  <motion.div
                    key="printing"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    className="mx-auto max-w-xl text-center"
                  >
                    <h3 className="font-display text-4xl">Printing...</h3>
                    <p className="mt-3 text-sm text-black/60">Please wait for your strip.</p>
                    {stripImage && (
                      <img
                        src={stripImage}
                        alt="Printed mari-photo strip"
                        className="photobooth-print-out absolute left-1/2 bottom-[5.25rem] z-10 w-[min(16.25rem,58vw)] -translate-x-1/2 rounded-sm shadow-[0_1.125rem_2rem_rgba(0,0,0,0.3)]"
                      />
                    )}
                  </motion.div>
                )}

                {step === "thanks" && (
                  <motion.div
                    key="thanks"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    className="mx-auto flex max-w-xl flex-col items-center text-center"
                  >
                    {stripImage && (
                      <img
                        src={stripImage}
                        alt="Finished mari-photo strip"
                        className="mb-6 max-h-[22.5rem] rounded-sm shadow-[0_1.125rem_2rem_rgba(0,0,0,0.28)]"
                      />
                    )}
                    <div className="rounded-[1.75rem] border-[0.5rem] border-black bg-white p-7">
                      <h3 className="font-display text-4xl">Thank you for using mari-photo ⊹ ࣪ ˖</h3>
                      <p className="mt-4 text-[0.9375rem] text-black/65">We hope you enjoyed your visit!</p>
                      <div className="mt-6">
                        <StepButton onClick={resetBooth}>Return Home</StepButton>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Real grass photo as the primary visual, with a blurred, fading duplicate
// laid over the top edge to mimic a soft depth-of-field blend into the sky
// (matching the reference: sharp grass up close, soft blur where it meets
// the horizon). A solid fallback color sits behind both in case the photo
// hasn't been added yet.
export default function Hills() {
  return (
    <div
      className="absolute bottom-0 left-0 w-full h-[48%] overflow-hidden pointer-events-none select-none bg-[#4C7A2C]"
      aria-hidden="true"
    >
      <img
        src="/items/greenery.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <img
        src="/items/greenery.png"
        alt=""
        className="absolute top-0 left-0 w-full h-[60%] object-cover object-top blur-2xl scale-105"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />
    </div>
  )
}
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { PointerPosition } from '../hooks/usePointerRef'

interface SpotlightRevealProps {
  sectionRef: RefObject<HTMLElement | null>
  pointerRef: RefObject<PointerPosition>
  videoSrc: string
}

const RADIUS = 260
const LERP = 0.1
// The mask canvas is rendered below the section's native resolution and
// stretched back up via mask-size — the gradient is soft enough that this
// is imperceptible, and it keeps the per-frame toDataURL() call cheap.
const RENDER_SCALE = 0.5

export function SpotlightReveal({ sectionRef, pointerRef, videoSrc }: SpotlightRevealProps) {
  const maskRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const smooth = useRef({ x: 0, y: 0 })
  const initialized = useRef(false)

  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
    }
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let frame: number

    const tick = () => {
      const section = sectionRef.current
      const maskEl = maskRef.current

      if (section && maskEl && ctx) {
        const rect = section.getBoundingClientRect()
        const width = Math.max(1, Math.round(rect.width * RENDER_SCALE))
        const height = Math.max(1, Math.round(rect.height * RENDER_SCALE))

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }

        if (!initialized.current) {
          smooth.current = { x: pointerRef.current.x, y: pointerRef.current.y }
          initialized.current = true
        } else {
          smooth.current.x += (pointerRef.current.x - smooth.current.x) * LERP
          smooth.current.y += (pointerRef.current.y - smooth.current.y) * LERP
        }

        const cx = smooth.current.x * RENDER_SCALE
        const cy = smooth.current.y * RENDER_SCALE
        const r = RADIUS * RENDER_SCALE

        ctx.clearRect(0, 0, width, height)
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)')
        gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)')
        gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        const dataUrl = canvas.toDataURL()
        maskEl.style.maskImage = `url(${dataUrl})`
        maskEl.style.webkitMaskImage = `url(${dataUrl})`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [sectionRef, pointerRef])

  return (
    <div
      ref={maskRef}
      className="pointer-events-none absolute inset-0 z-30"
      style={{
        maskRepeat: 'no-repeat',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: '100% 100%',
      }}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: 'inset(40% 0 0 0)' }}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  )
}

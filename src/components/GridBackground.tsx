import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { PointerPosition } from '../hooks/usePointerRef'

interface GridBackgroundProps {
  sectionRef: RefObject<HTMLElement | null>
  pointerRef: RefObject<PointerPosition>
}

const MAX_SHIFT = 16
const EASE = 0.06

export function GridBackground({ sectionRef, pointerRef }: GridBackgroundProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const smooth = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let frame: number

    const tick = () => {
      const section = sectionRef.current
      const grid = gridRef.current

      if (section && grid) {
        const rect = section.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const targetX = centerX ? ((pointerRef.current.x - centerX) / centerX) * MAX_SHIFT : 0
        const targetY = centerY ? ((pointerRef.current.y - centerY) / centerY) * MAX_SHIFT : 0

        smooth.current.x += (targetX - smooth.current.x) * EASE
        smooth.current.y += (targetY - smooth.current.y) * EASE

        grid.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0)`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [sectionRef, pointerRef])

  return (
    <div ref={gridRef} className="pointer-events-none absolute inset-0 z-0 opacity-10">
      <svg className="h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

export interface PointerPosition {
  x: number
  y: number
}

/**
 * Tracks the pointer position relative to the top-left corner of `containerRef`.
 * Stored in a ref (not state) so consumers can read it inside their own
 * requestAnimationFrame loops without triggering React re-renders on every move.
 */
export function usePointerRef(containerRef: RefObject<HTMLElement | null>) {
  const pointerRef = useRef<PointerPosition>({ x: 0, y: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }

    el.addEventListener('pointermove', handleMove)
    return () => el.removeEventListener('pointermove', handleMove)
  }, [containerRef])

  return pointerRef
}

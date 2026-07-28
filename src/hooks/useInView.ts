import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  rootMargin?: string
  threshold?: number
}

/*
 * Se dispara una sola vez: en cuanto el elemento entra al viewport se deja de
 * observar, así no "resetea" la animación si se vuelve a hacer scroll hacia
 * arriba y de nuevo hacia abajo. Con `prefers-reduced-motion` o sin soporte de
 * IntersectionObserver, arranca visible directo — no hay nada que revelar.
 */
export function useInView<T extends Element>({
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.15,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return { ref, inView }
}

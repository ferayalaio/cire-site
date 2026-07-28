import type { ElementType } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const WORD_VARIANTS = {
  hidden: { opacity: 0, y: '0.4em' },
  visible: { opacity: 1, y: 0 },
}

interface AnimatedHeadingProps {
  children: string
  as?: ElementType
  className?: string
  /** Dibuja una línea debajo del título después de que entran las palabras. */
  underline?: boolean
  /** Retraso antes de que arranque la primera palabra, en segundos. */
  delay?: number
}

/*
 * Título que entra palabra por palabra al aparecer en el viewport, en vez de
 * un fade plano. `whileInView` dispara solo una vez (viewport.once) porque
 * es una entrada de contenido, no algo que deba repetirse al hacer scroll de
 * ida y vuelta. Con `prefers-reduced-motion` se salta directo a Framer Motion
 * apagado y el título queda estático.
 */
export function AnimatedHeading({
  children,
  as: Tag = 'h2',
  className = '',
  underline = false,
  delay = 0,
}: AnimatedHeadingProps) {
  const shouldReduceMotion = useReducedMotion()
  const words = children.split(' ')

  if (shouldReduceMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ staggerChildren: 0.06, delayChildren: delay }}
      >
        {words.map((word, index) => (
          <motion.span key={index} className="inline-block" variants={WORD_VARIANTS} transition={{ duration: 0.5, ease: EASE }}>
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </motion.span>
      {underline && (
        <motion.span
          aria-hidden="true"
          className="mt-3 block h-[2px] w-16 origin-left bg-current"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: delay + words.length * 0.06 + 0.1 }}
        />
      )}
    </Tag>
  )
}

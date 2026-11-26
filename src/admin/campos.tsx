/*
 * Controles de formulario del portal. Pensados para alguien que no es
 * técnico: etiqueta arriba, ayuda debajo, precios con "$" y una casilla de
 * "Pendiente" en lugar de pedir que deje el campo en blanco o ponga 0.
 */
import { useId, type ReactNode } from 'react'
import type { Campo } from './registro'

const caja =
  'w-full rounded-lg border border-linea bg-white px-3 py-2.5 text-[15px] text-ink outline-none transition focus:border-magenta focus:ring-2 focus:ring-magenta/15'

function Envoltura({ etiqueta, ayuda, id, children }: { etiqueta: string; ayuda?: string; id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-ink">
        {etiqueta}
      </label>
      {children}
      {ayuda && <p className="text-[12.5px] leading-snug text-ink/60">{ayuda}</p>}
    </div>
  )
}

export function CampoEditable({
  campo,
  valor,
  alCambiar,
}: {
  campo: Campo
  valor: unknown
  alCambiar: (valor: unknown) => void
}) {
  const id = useId()
  const { etiqueta, ayuda } = campo

  switch (campo.tipo) {
    case 'texto':
    case 'fecha':
      return (
        <Envoltura etiqueta={etiqueta} ayuda={ayuda} id={id}>
          <input
            id={id}
            type={campo.tipo === 'fecha' ? 'date' : 'text'}
            className={caja}
            value={(valor as string) ?? ''}
            onChange={(e) => alCambiar(e.target.value)}
          />
        </Envoltura>
      )

    case 'parrafo':
      return (
        <Envoltura etiqueta={etiqueta} ayuda={ayuda} id={id}>
          <textarea
            id={id}
            rows={3}
            className={`${caja} resize-y leading-relaxed`}
            value={(valor as string) ?? ''}
            onChange={(e) => alCambiar(e.target.value)}
          />
        </Envoltura>
      )

    case 'numero':
      return (
        <Envoltura etiqueta={etiqueta} ayuda={ayuda} id={id}>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={0}
            className={`${caja} max-w-40 tabular-nums`}
            value={valor === null || valor === undefined ? '' : String(valor)}
            onChange={(e) => alCambiar(e.target.value === '' ? null : Number(e.target.value))}
          />
        </Envoltura>
      )

    case 'precio': {
      const pendiente = valor === null || valor === undefined
      return (
        <Envoltura etiqueta={etiqueta} ayuda={ayuda} id={id}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-44 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink/50">$</span>
              <input
                id={id}
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                disabled={pendiente}
                placeholder={pendiente ? 'Pendiente' : ''}
                className={`${caja} pl-7 tabular-nums disabled:bg-hueso disabled:text-ink/40`}
                value={pendiente ? '' : String(valor)}
                onChange={(e) => alCambiar(e.target.value === '' ? 0 : Math.max(0, Math.round(Number(e.target.value))))}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink/70">
              <input
                type="checkbox"
                className="size-4 accent-magenta"
                checked={pendiente}
                onChange={(e) => alCambiar(e.target.checked ? null : 0)}
              />
              Pendiente (no mostrar precio)
            </label>
          </div>
        </Envoltura>
      )
    }

    case 'si-no':
      return (
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-linea bg-white px-3 py-2.5">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-magenta"
            checked={Boolean(valor)}
            onChange={(e) => alCambiar(e.target.checked)}
          />
          <span className="flex flex-col">
            <span className="text-[14px] font-semibold text-ink">{etiqueta}</span>
            {ayuda && <span className="text-[12.5px] text-ink/60">{ayuda}</span>}
          </span>
        </label>
      )

    case 'lista':
    case 'lista-numeros': {
      const numeros = campo.tipo === 'lista-numeros'
      const texto = Array.isArray(valor) ? (valor as unknown[]).join('\n') : ''
      return (
        <Envoltura etiqueta={etiqueta} ayuda={ayuda} id={id}>
          <textarea
            id={id}
            rows={Math.min(8, Math.max(3, texto.split('\n').length + 1))}
            className={`${caja} resize-y leading-relaxed`}
            defaultValue={texto}
            onBlur={(e) => {
              const lineas = e.target.value
                .split('\n')
                .map((l) => l.trim())
                .filter(Boolean)
              alCambiar(numeros ? lineas.map(Number).filter((n) => Number.isFinite(n) && n > 0) : lineas)
            }}
          />
        </Envoltura>
      )
    }
  }
}

export function Boton({
  children,
  variante = 'secundario',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: 'primario' | 'secundario' | 'peligro' | 'fantasma' }) {
  const estilos = {
    primario: 'bg-ink text-white hover:bg-ink-soft disabled:bg-ink/40',
    secundario: 'border border-linea bg-white text-ink hover:border-ink/30 disabled:text-ink/40',
    peligro: 'border border-blush-600/30 bg-white text-blush-600 hover:bg-blush-50',
    fantasma: 'text-ink/70 hover:bg-ink/5 hover:text-ink',
  }[variante]
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-[14px] font-semibold transition disabled:cursor-not-allowed ${estilos} ${props.className ?? ''}`}
    >
      {children}
    </button>
  )
}

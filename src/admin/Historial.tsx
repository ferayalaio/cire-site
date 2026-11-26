import { useEffect, useState } from 'react'
import { api, fechaLegible, type Version } from './api'
import { Boton } from './campos'

export function Historial({ alRestaurar }: { alRestaurar: (id: string) => Promise<void> }) {
  const [versiones, setVersiones] = useState<Version[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [trabajando, setTrabajando] = useState<string | null>(null)

  useEffect(() => {
    api
      .versiones()
      .then((r) => setVersiones(r.versiones))
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] leading-tight font-medium text-ink">Historial</h1>
        <p className="text-[15px] text-ink/70">
          Cada vez que publicas se guarda una copia. Si algo no te gustó, recupera una versión anterior: queda como borrador para que la revises y
          la vuelvas a publicar.
        </p>
      </header>
      {error && (
        <p role="alert" className="rounded-lg bg-blush-50 px-4 py-3 text-[14px] text-blush-900">
          {error}
        </p>
      )}
      {versiones === null ? (
        <p className="text-ink/60">Cargando…</p>
      ) : versiones.length === 0 ? (
        <p className="text-ink/60">Todavía no se ha publicado nada desde el portal.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-linea overflow-hidden rounded-card border border-linea bg-white">
          {versiones.map((v, i) => (
            <li key={v.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-ink">
                  {fechaLegible(v.publicadoEn)}
                  {i === 0 && <span className="ml-2 rounded-full bg-morado-50 px-2 py-0.5 text-[12px] text-morado-700">En línea</span>}
                </p>
                <p className="text-[13px] text-ink/60">Publicó: {v.autor}</p>
              </div>
              {i > 0 && (
                <Boton
                  disabled={trabajando !== null}
                  onClick={async () => {
                    if (!confirm('¿Recuperar esta versión? Reemplaza tu borrador actual; el sitio no cambia hasta que publiques.')) return
                    setTrabajando(v.id)
                    try {
                      await alRestaurar(v.id)
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'No se pudo recuperar.')
                    } finally {
                      setTrabajando(null)
                    }
                  }}
                >
                  {trabajando === v.id ? 'Recuperando…' : 'Recuperar'}
                </Boton>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

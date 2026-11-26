import { useState } from 'react'
import { api, type Usuario } from './api'
import { Boton } from './campos'

const caja =
  'w-full rounded-lg border border-linea bg-white px-3 py-3 text-[16px] text-ink outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/15'

export function Login({ alEntrar }: { alEntrar: (u: Usuario) => void }) {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [ver, setVer] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const r = await api.login(usuario, contrasena)
      alEntrar(r.usuario)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo entrar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-hueso px-4 py-10">
      <form onSubmit={entrar} className="flex w-full max-w-sm flex-col gap-5 rounded-media border border-linea bg-white p-7 sm:p-9">
        <div>
          <p className="font-display text-[28px] font-medium tracking-tight text-ink">Cire · Editor</p>
          <p className="mt-1 text-[15px] text-ink/65">Entra para editar el sitio.</p>
        </div>
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
          Usuario
          <input
            className={caja}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
          Contraseña
          <div className="relative">
            <input
              className={`${caja} pr-16`}
              type={ver ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setVer(!ver)}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded px-2 py-1 text-[12.5px] font-semibold text-ink/60 hover:text-ink"
            >
              {ver ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </label>
        {error && (
          <p role="alert" className="rounded-lg bg-blush-50 px-3 py-2.5 text-[14px] text-blush-900">
            {error}
          </p>
        )}
        <Boton type="submit" variante="primario" disabled={enviando} className="min-h-12 text-[15px]">
          {enviando ? 'Entrando…' : 'Entrar'}
        </Boton>
      </form>
    </main>
  )
}

/*
 * "Última sucursal vista" de la visita.
 *
 * El problema que resuelve: alguien mira /laser/cuerpo-completo, después entra a
 * /ubicaciones/coapa, y después vuelve a una página de servicio y toca WhatsApp.
 * En ese momento la página no sabe nada de Coapa, así que el mensaje saldría
 * genérico y quien atiende tiene que preguntar la sucursal — justo la fricción
 * que el sitio existe para sacar.
 *
 * Con esto el mensaje sale como:
 *   "Hola, quiero información del Combo Piernas y estoy cerca de Coapa"
 *
 * Es sessionStorage y no localStorage por el mismo criterio que la atribución:
 * la intención pertenece a la visita. Con localStorage, alguien que miró Coapa
 * en marzo aparecería como "cerca de Coapa" en junio aunque se haya mudado.
 */

const STORAGE_KEY = 'cire:ultima-sucursal'

/*
 * sessionStorage tira excepción en Safari privado y con cookies bloqueadas.
 * Que falle esto no puede tumbar el render ni impedir el clic a WhatsApp, así
 * que todo va en try/catch y el peor caso es un mensaje sin sucursal.
 */
export function rememberSucursal(slug: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, slug)
  } catch {
    // Sin persistencia el mensaje sale sin la sucursal. Es degradación aceptable.
  }
}

export function getLastSucursal(): string | undefined {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? undefined
  } catch {
    return undefined
  }
}

/*
 * Genera la entrada de un usuario del portal (/admin) para la variable
 * CMS_USUARIOS. La contraseña se pide sin mostrarla en pantalla y solo se
 * guarda su hash (scrypt): ni en Vercel ni en el repo queda en claro.
 *
 *   node scripts/crear-usuario.mjs cire "Recepción Cire"
 *
 * Copiá la línea que imprime dentro del arreglo JSON de CMS_USUARIOS:
 *   [{"usuario":"cire","nombre":"Recepción Cire","hash":"scrypt:…"}]
 * y actualizá la variable en Vercel (Settings → Environment Variables).
 */
import { randomBytes, scryptSync } from 'node:crypto'
import { createInterface } from 'node:readline'

const [usuario, nombre = usuario] = process.argv.slice(2)
if (!usuario || !/^[a-zA-Z0-9._-]{3,40}$/.test(usuario)) {
  console.error('Uso: node scripts/crear-usuario.mjs <usuario> ["Nombre visible"]')
  console.error('El usuario va sin espacios: letras, números, punto, guion (3 a 40).')
  process.exit(1)
}

function preguntarOculto(texto) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    // Solo se imprime la pregunta; lo que se escribe no aparece en pantalla.
    rl._writeToOutput = (s) => {
      if (s.includes(texto)) rl.output.write(s)
    }
    rl.question(texto, (respuesta) => {
      rl.close()
      process.stdout.write('\n')
      resolve(respuesta)
    })
  })
}

const contrasena = await preguntarOculto('Contraseña (mínimo 10 caracteres): ')
if (contrasena.length < 10) {
  console.error('La contraseña debe tener al menos 10 caracteres.')
  process.exit(1)
}
const otra = await preguntarOculto('Repite la contraseña: ')
if (otra !== contrasena) {
  console.error('No coinciden.')
  process.exit(1)
}

const sal = randomBytes(16)
const hash = scryptSync(contrasena, sal, 64)
console.log(JSON.stringify({ usuario, nombre, hash: `scrypt:${sal.toString('base64')}:${hash.toString('base64')}` }))

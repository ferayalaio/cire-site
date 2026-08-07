/*
 * Preguntas frecuentes del home (05/ago/26).
 *
 * Criterio de qué entra: solo objeciones que hoy se contestan por WhatsApp
 * ANTES de que la persona agende. No es una enciclopedia del láser — cada
 * pregunta de más empuja el CTA más abajo y diluye a las tres que de verdad
 * frenan la decisión (dolor, cuántas sesiones, cómo me preparo).
 *
 * Criterio de qué se responde: nada que no esté ya sostenido por los datos del
 * sitio. Las 8 sesiones salen del tarifario (`sesiones: 8` en precios.ts), la
 * comodidad se ancla a la punta de zafiro (CLAIMS.comodidad) y no a un "no
 * duele" pelado, y donde la respuesta real depende de la persona se dice eso
 * en vez de inventar un promedio. Este bloque también se emite como
 * structured data FAQPage (ver useJsonLd.ts), así que una respuesta inflada
 * acá es una respuesta inflada en el resultado de Google.
 */

export interface FaqItem {
  pregunta: string
  respuesta: string
}

export const FAQ_HOME: FaqItem[] = [
  {
    pregunta: '¿Duele la depilación láser?',
    respuesta:
      'La punta de zafiro enfría la piel en el mismo momento del disparo, así que la mayoría de nuestras clientas describe una sensación de calor breve y tolerable, no dolor. La tolerancia varía según la zona y el tipo de piel: en la evaluación previa ajustamos la potencia a tu caso.',
  },
  {
    pregunta: '¿Cuántas sesiones necesito?',
    respuesta:
      'El protocolo estándar Láser Expert 8® son 8 sesiones, y es lo que incluyen los paquetes publicados en el sitio. Los cambios se notan desde la primera sesión, pero el vello crece por ciclos y el resultado completo se construye a lo largo del paquete. Cuántas necesitas tú depende de tu tipo de piel, el grosor del vello y la zona.',
  },
  {
    pregunta: '¿Cómo me preparo para mi sesión?',
    respuesta:
      'Rasura la zona con rastrillo 24 horas antes y llega con la piel limpia, sin cremas, aceites, desodorante ni maquillaje. No depiles con cera, pinzas ni depilatorio en las semanas previas: el láser necesita la raíz del vello para funcionar. Evita la exposición solar y las camas de bronceado antes y después de la sesión.',
  },
  {
    pregunta: '¿Cada cuánto son las sesiones?',
    respuesta:
      'El intervalo lo define tu especialista según la zona y cómo responde tu vello, y en algunas sucursales el espaciado es distinto. Te confirmamos tu calendario al agendar, junto con la sucursal.',
  },
  {
    pregunta: '¿Puedo hacerme láser si tengo piel morena o vello claro?',
    respuesta:
      'El láser de diodo con punta de zafiro trabaja con un rango amplio de fototipos, incluidas pieles morenas. El vello muy claro, cano o pelirrojo responde menos porque el láser busca el pigmento. Por eso la primera cita es una evaluación: revisamos tu piel y tu vello y te decimos con franqueza si eres candidata o si te conviene más la cera italiana.',
  },
  {
    pregunta: '¿Qué incluye la evaluación y tiene costo?',
    respuesta:
      'La evaluación es una valoración de tu tipo de piel y vello con una especialista certificada, y es donde se arma tu plan y se te confirma el precio cerrado del paquete. Escríbenos por WhatsApp y te agendamos en la sucursal que te quede más cerca.',
  },
]

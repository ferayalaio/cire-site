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
      'Por lo general entre 4 y 8 semanas, según la zona y cómo responde tu vello. Tu especialista ajusta el calendario sesión con sesión y te lo confirmamos al agendar, junto con la sucursal.',
  },
  {
    pregunta: '¿Puedo hacerme láser si tengo piel morena o vello claro?',
    respuesta:
      'El láser de diodo con punta de zafiro trabaja con un rango amplio de fototipos, incluidas pieles morenas. El vello muy claro, cano o pelirrojo responde menos porque el láser busca el pigmento. Por eso la primera cita es una evaluación: revisamos tu piel y tu vello y te decimos con franqueza si eres candidata o si te conviene más la cera italiana.',
  },
  {
    pregunta: '¿Qué incluye la evaluación y tiene costo?',
    respuesta:
      'La valoración es sin costo. Una especialista certificada revisa tu tipo de piel y vello, arma tu plan y te confirma el precio cerrado del paquete. Escríbenos por WhatsApp y te agendamos en la sucursal que te quede más cerca.',
  },
]

/*
 * Preguntas de /laser (nov/26). Salen del manual oficial del Láser Expert 8®
 * y no repiten las del home: aquellas frenan la decisión (dolor, sesiones,
 * preparación), estas son las que la gente busca en Google cuando ya está
 * comparando ("¿es definitivo?", "¿sirve con SOP?").
 *
 * Mismas reglas que arriba, más las del manual: nunca "100%", nunca "8
 * sesiones bastan para todas", y el láser no trata el SOP.
 */
export const FAQ_LASER: FaqItem[] = [
  {
    pregunta: '¿La depilación láser es definitiva?',
    respuesta:
      'La depilación láser logra una reducción permanente del vello, pero no garantiza eliminarlo al 100%. En los mejores casos se alcanza hasta un 95% de reducción, y los resultados varían en cada persona. Algunos vellos pueden reaparecer con el tiempo y se trabajan con sesiones de mantenimiento.',
  },
  {
    pregunta: '¿En cuánto tiempo veo resultados?',
    respuesta:
      'Desde las primeras sesiones el vello empieza a crecer más lento, más fino y en menor cantidad. El resultado es progresivo porque el vello crece por fases y no todos los folículos están activos al mismo tiempo: por eso el protocolo es de 8 sesiones por zona.',
  },
  {
    pregunta: '¿Puedo rasurarme entre sesiones?',
    respuesta:
      'Sí, puedes usar rastrillo entre sesiones. Lo que debes evitar es arrancar el vello de raíz con cera, pinzas o depiladoras eléctricas, porque el láser necesita la raíz para funcionar.',
  },
  {
    pregunta: '¿Puedo hacerme láser si tengo SOP (ovario poliquístico)?',
    respuesta:
      'Sí, y suele ser muy recomendable. El láser diodo ayuda a reducir de forma progresiva el vello aun cuando hay un componente hormonal, y mejora la irritación que deja el rasurado frecuente. El láser no trata el SOP: por el estímulo hormonal pueden necesitarse más sesiones, sobre todo en rostro, y mantenimientos. Recomendamos llevarlo de la mano de seguimiento médico.',
  },
  {
    pregunta: '¿El láser quita las manchas de las axilas?',
    respuesta:
      'El objetivo del láser es reducir el vello, no despigmentar. Al disminuir la irritación del rastrillo puede ayudar a evitar algunos factores que oscurecen la zona. Para trabajar el tono tenemos Skin Clearance, un tratamiento despigmentante tópico que se puede combinar con el láser en axilas.',
  },
  {
    pregunta: '¿Cuándo no puedo hacerme láser?',
    respuesta:
      'Durante el embarazo no se realiza. Si te bronceaste o tuviste quemadura solar hay que esperar al menos 10 a 15 días, y si tienes una infección o lesión activa en la zona, hasta que sane. Si tomas medicamentos, tuviste un tratamiento dermatológico o estético reciente, o tienes alguna condición en la piel, coméntalo en tu valoración: nuestro equipo revisa tu caso antes de la sesión.',
  },
]

/*
 * Preguntas de /otros-servicios (nov/26), del manual oficial de tratamientos
 * corporales. Regla del manual que manda acá: ninguno de estos tratamientos
 * se presenta como método para bajar de peso, y no se dice que uno sea más
 * efectivo que otro.
 */
export const FAQ_CORPORAL: FaqItem[] = [
  {
    pregunta: '¿Qué diferencia hay entre Moldeo Cire-Na y Cire Body?',
    respuesta:
      'Moldeo Cire-Na busca estilizar la silueta: marcar cintura, resaltar curvas y lograr una figura más armónica, además de trabajar la apariencia de retención de líquidos y flacidez. Cire Body es un protocolo personalizado para reducir volumen, definir y mejorar la firmeza de diferentes zonas. Si tus objetivos coinciden con los dos, la valoración define cuál se adapta mejor a ti.',
  },
  {
    pregunta: '¿Los tratamientos corporales sirven para bajar de peso?',
    respuesta:
      'No. Moldeo corporal, radiofrecuencia, HIFU y drenaje linfático trabajan la forma, la firmeza, la apariencia de la piel o la sensación de hinchazón, pero no son tratamientos para bajar de peso ni sustituyen una alimentación equilibrada y actividad física.',
  },
  {
    pregunta: '¿Qué me conviene si tengo flacidez?',
    respuesta:
      'Para flacidez se valoran HIFU 4D o radiofrecuencia corporal: las dos trabajan la firmeza, pero con tecnologías distintas. Según el grado de flacidez y la zona, tu especialista te recomienda una, la otra o ambas.',
  },
  {
    pregunta: '¿Para quién es el drenaje linfático?',
    respuesta:
      'Para quienes sienten las piernas pesadas, hinchazón, retención de líquidos o cansancio en las piernas. Es una técnica manual con movimientos suaves y rítmicos que favorece la circulación linfática y la sensación de ligereza. No elimina grasa ni es para bajar de peso.',
  },
  {
    pregunta: '¿Qué es Skin Clearance?',
    respuesta:
      'Es un tratamiento despigmentante tópico, sin láser, para mejorar la apariencia de zonas oscurecidas como axilas, cuello, codos, rodillas o entrepierna. Hidrata, exfolia y ayuda a lograr un tono más uniforme de forma progresiva. Los resultados dependen del origen de la pigmentación y de cómo responde tu piel.',
  },
  {
    pregunta: '¿Cuándo necesito una valoración especial?',
    respuesta:
      'Si estás embarazada o en lactancia, tuviste una cirugía reciente, tienes infecciones o lesiones activas, enfermedades circulatorias o linfáticas, antecedentes de trombosis, marcapasos u otro dispositivo implantado, o tomas medicamentos, coméntalo antes de agendar. Si notas hinchazón repentina en una sola pierna, dolor o enrojecimiento, busca atención médica antes de cualquier tratamiento.',
  },
]

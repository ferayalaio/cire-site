/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * ID del pixel de Meta (solo dígitos, como aparece en Events Manager).
   * Sin esto el tracking queda inerte: no se inyecta el script ni se envía
   * ningún evento, y la página funciona igual.
   */
  readonly VITE_META_PIXEL_ID?: string

  /**
   * WhatsApp de destino por defecto. Formato wa.me: lada de país sin `+`,
   * sin espacios ni guiones — para México son 12 dígitos (52 + 10).
   */
  readonly VITE_WHATSAPP_PHONE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

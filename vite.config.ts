import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // El portal (/admin) es una entrada aparte: el sitio público no carga
      // nada de su código.
      input: { main: 'index.html', admin: 'admin.html' },
    },
  },
})

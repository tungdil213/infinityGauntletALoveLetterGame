import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import adonisjs from '@adonisjs/vite/client'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'resources/app/ssr.tsx' } }),
    react(),
    adonisjs({
      entrypoints: ['resources/app/app.tsx'],
      reload: ['./resources/views/**/*.edge'],
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/resources/`,
      '@': `${getDirname(import.meta.url)}/resources/lib`,
    },
  },
})

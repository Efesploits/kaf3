import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Deployed to GitHub Pages under /kaf3/. Override with BASE_PATH=/ for a
// custom domain or local static serving.
const base = process.env.BASE_PATH ?? '/kaf3/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
  },
})

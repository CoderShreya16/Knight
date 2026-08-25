import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/transcribe': 'http://localhost:3000',
      '/structure-note': 'http://localhost:3000',
      '/lecture-note': 'http://localhost:3000',
      '/notes': 'http://localhost:3000',
      '/explain': 'http://localhost:3000',
    },
  },
})

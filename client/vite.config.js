import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://resume-scanner-backend-7pgv.onrender.com',
        changeOrigin: true
      },
      '/outputs': {
        target: 'https://resume-scanner-backend-7pgv.onrender.com',
        changeOrigin: true
      }
    }
  }
})

import react from '@vitejs/plugin-react'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.BACKEND_TARGET || 'http://localhost:3000'

  return {
    define: {
      __API_BASE_URL__: JSON.stringify(env.VITE_BACKEND_URL || '/api/v1'),
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
        '/socket.io': {
          target: backendTarget,
          ws: true,
          changeOrigin: true,
        },
      },
    },
  }
})

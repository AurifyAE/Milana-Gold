import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000,
    proxy: {
      '/socket.io': {
        target: 'https://capital-server-gnsu.onrender.com',
        ws: true,
        changeOrigin: true,
        headers: {
          Origin: 'https://milanagold.aurify.ae',
        },
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }), tailwindcss()
  ],
  server: {
    // Deezer's API does not send Access-Control-Allow-Origin headers, so the
    // browser cannot call it directly. Proxy /deezer -> https://api.deezer.com
    // during development. In production, point VITE_DEEZER_BASE at your own
    // reverse proxy (see README).
    proxy: {
      '/deezer': {
        target: 'https://api.deezer.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/deezer/, ''),
      },
    },
  },
})

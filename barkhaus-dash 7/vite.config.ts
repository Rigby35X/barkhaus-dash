import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: { proxy: {
'/api/xano/auth': { target: 'https://x8ki-letl-twmt.n7.xano.io/api:XqEb_TVK', changeOrigin: true, rewrite: p => p.replace(/^\/api\/xano\/auth/, '') },
'/api/xano/live': { target: 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR', changeOrigin: true, rewrite: p => p.replace(/^\/api\/xano\/live/, '') },
'/api/xano/design': { target: 'https://x8ki-letl-twmt.n7.xano.io/api:0BQDG239', changeOrigin: true, rewrite: p => p.replace(/^\/api\/xano\/design/, '') },
'/api/xano/pages': { target: 'https://x8ki-letl-twmt.n7.xano.io/api:mlssTgVM', changeOrigin: true, rewrite: p => p.replace(/^\/api\/xano\/pages/, '') },
'/api/xano/templates': { target: 'https://x8ki-letl-twmt.n7.xano.io/api:cz-ZpYmR', changeOrigin: true, rewrite: p => p.replace(/^\/api\/xano\/templates/, '') },
  } },
  plugins: [react()],
})
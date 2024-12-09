import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // This section will allow the backend api to be called in a fetch just using
  // the /api link
  server: {
    proxy: {
      // This selects the specific extension
      '/api': {
        // This selects the target url that would be called when using /api
        target: 'http://localhost:3004',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [vue()],
})

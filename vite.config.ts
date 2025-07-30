import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/', // For GitHub Pages deployment
  build: {
    outDir: 'dist', // Build output directory
  }
})

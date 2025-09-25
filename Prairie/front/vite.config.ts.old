import { defineConfig } from 'vite'

export default defineConfig({
  // Configuration pour Vite
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // Résolution des modules
  resolve: {
    alias: {
      '@': '/src',
      '@classes': '../classes'
    }
  }
})

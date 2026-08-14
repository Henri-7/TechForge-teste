import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    compression({
      threshold: 1024,
      algorithms: ['gzip', 'brotliCompress'],
      include: /\.(html|xml|css|json|js|mjs|svg|txt|wasm)$/,
    }),
    mode === 'analyze'
      ? visualizer({
          filename: 'dist/bundle-report.html',
          template: 'treemap',
          gzipSize: true,
          brotliSize: true,
          open: true,
        })
      : null,
  ],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3001',
    },
  },
}))

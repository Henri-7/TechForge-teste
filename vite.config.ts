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
  /**
   * O padrão do Vite 8 é `baseline-widely-available`, que hoje significa
   * safari16.4 / ios16.4 / chrome111. iOS 16.4 é de março de 2023: iPhone 6s,
   * SE 1, 7 e 7 Plus travam no iOS 15.8 e nunca chegam lá. O three.js sai com
   * blocos `static {}`, o parser rejeita o chunk inteiro e a página fica em
   * branco.
   *
   * es2019 rebaixa `static {}` e `??=` e custa ~360 bytes gzip no total —
   * medido, não estimado. Piso resultante: Safari 12 / Chrome 72.
   */
  build: {
    target: 'es2019',
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3001',
    },
  },
}))

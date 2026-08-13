import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic'
    }),
    tailwindcss(),
    cssInjectedByJsPlugin()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'ReactUiComponentes',
      fileName: (format) => `react-ui-componentes.${format === 'es' ? 'es' : 'cjs'}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        assetFileNames: 'react-ui-componentes.[ext]'
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      '../dist/index': path.resolve(__dirname, 'src/index.js')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})

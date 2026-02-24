import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      include: ['**/*.js', '**/*.jsx']
    })
  ],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  esbuild: {
    loader: 'jsx',
    include: /\.js$/,
    exclude: /node_modules/
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },

  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src')
    }
  }
})
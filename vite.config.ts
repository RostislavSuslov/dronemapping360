import { defineConfig } from 'vite'
import { resolve } from "path";
import handlebars from 'vite-plugin-handlebars';
import FullReload from 'vite-plugin-full-reload'

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/main.js',
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: ({ name }) => {
          if (name && name.endsWith('.css')) {
            return 'assets/css/style.css';
          }
          if (name && name.includes('img')) {
            return 'assets/img/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  },
  css: {
    devSourcemap: true
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials")
    }),
    FullReload(["src/partials/**/*"])
  ],
})
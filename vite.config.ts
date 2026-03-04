import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import handlebars from 'vite-plugin-handlebars'
import FullReload from 'vite-plugin-full-reload'

function getRootHtmlFiles() {
  const rootDir = resolve(__dirname)
  const files = fs.readdirSync(rootDir)

  const input: Record<string, string> = {}

  files.forEach(file => {
    const fullPath = resolve(rootDir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isFile() && file.endsWith('.html')) {
      const name = file.replace(/\.html$/, '')
      input[name] = fullPath
    }
  })

  return input
}

export default defineConfig({
  base: './',

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',

    rollupOptions: {
      input: getRootHtmlFiles(),

      output: {
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',

        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? ''

          if (name.endsWith('.css')) {
            return 'assets/css/[name][extname]'
          }

          if (/\.(png|jpe?g|svg|webp|gif)$/i.test(name)) {
            return 'assets/img/[name][extname]'
          }

          if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
            return 'assets/fonts/[name][extname]'
          }

          return 'assets/[name][extname]'
        }
      }
    }
  },

  css: {
    devSourcemap: true
  },

  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }),
    FullReload(['src/partials/**/*'])
  ]
})
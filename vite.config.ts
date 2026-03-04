import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'
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

function copyFolderRecursive(src: string, dest: string) {
  if (!fs.existsSync(src)) return

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function copyImagesPlugin() {
  return {
    name: 'copy-images',
    closeBundle() {
      const srcDir = resolve(__dirname, 'src/assets/img')
      const destDir = resolve(__dirname, 'dist/assets/img')
      copyFolderRecursive(srcDir, destDir)
    }
  }
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

          if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
            return 'assets/fonts/[name][extname]'
          }

          if (/\.(png|jpe?g|svg|webp|gif)$/i.test(name)) {
            return 'assets/img/[name][extname]'
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

    FullReload(['src/partials/**/*']),

    copyImagesPlugin()
  ]
})
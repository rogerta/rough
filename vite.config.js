import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/rough.ts'),
      name: 'roughjs',
      fileName: 'rough',
    },
    minify: 'oxc'
  },
})


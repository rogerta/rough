import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,  // Clean output directory first.
  dts: true,  // Generate declaration files.
  globalName: 'rough',  // Global name for IIFE format.
  minify: true,

  format: {
    esm: {
      target: ['es2017']
    },
    cjs: {
      target: ['node20']
    },
    iife: {
      target: ['es2017']
    }
  },

  deps: {
    alwaysBundle: '**/*'  // Always bundle everything, even from node_modules.
  }
})


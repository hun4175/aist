import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    compilerOptions: { module: 'ESNext', moduleResolution: 'node' },
  },
})

import { buildNodeAdapter } from '@aist/adapter-node'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname)

try {
  await buildNodeAdapter({ root })
  console.log('Build complete. Run: node .output/server.js')
} catch (err) {
  console.error('[aist]', err)
  process.exit(1)
}

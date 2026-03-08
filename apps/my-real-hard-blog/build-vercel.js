import { buildVercelAdapter } from '@aist/adapter-vercel'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname)

try {
  await buildVercelAdapter({ root, outDir: root })
  console.log('Vercel build complete. Output: api/index.js, vercel.json')
} catch (err) {
  console.error('[aist]', err)
  process.exit(1)
}

#!/usr/bin/env node
import { prerender } from '@aist/build'
import { buildNodeAdapter } from '@aist/adapter-node'
import { buildVercelAdapter } from '@aist/adapter-vercel'
import { buildNetlifyAdapter } from '@aist/adapter-netlify'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname)

const mode = process.argv[2] || 'node'

if (mode === 'static') {
  await prerender({
    root,
    pagesDir: join(root, 'pages'),
    apiDir: join(root, 'api'),
    publicDir: join(root, 'public'),
    serverDir: join(root, 'server'),
    outDir: join(root, '.output', 'public')
  })
} else if (mode === 'vercel') {
  await buildVercelAdapter({ root, outDir: join(root, '.output') })
} else if (mode === 'netlify') {
  await buildNetlifyAdapter({ root, outDir: join(root, '.output') })
} else {
  await buildNodeAdapter({ root, outDir: join(root, '.output') })
}

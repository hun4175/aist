import { mkdirSync, writeFileSync, cpSync, existsSync } from 'fs'
import { join } from 'path'

export type VercelAdapterOptions = {
  root: string
  outDir?: string
}

const DEFAULT_OUT = '.output'

/** Vercel 배포용: api 핸들러 + vercel.json 생성 */
export async function buildVercelAdapter(opts: VercelAdapterOptions): Promise<string> {
  const outDir = opts.outDir ?? join(opts.root, DEFAULT_OUT)
  mkdirSync(outDir, { recursive: true })

  const apiDir = join(outDir, 'api')
  mkdirSync(apiDir, { recursive: true })

  const dirs = ['pages', 'api', 'public', 'server']
  for (const d of dirs) {
    const src = join(opts.root, d)
    if (existsSync(src)) cpSync(src, join(outDir, d), { recursive: true })
  }

  const handlerJs = `import { createAistServer } from '@aist/server'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

let handlerPromise = null

export default async function aistHandler(req, res) {
  if (!handlerPromise) {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const root = join(__dirname, '..')
    const server = await createAistServer({
      root,
      pagesDir: join(root, 'pages'),
      apiDir: join(root, 'api'),
      publicDir: join(root, 'public'),
      serverDir: join(root, 'server')
    })
    handlerPromise = Promise.resolve(server.handler)
  }
  const h = await handlerPromise
  return h(req, res)
}
`

  writeFileSync(join(apiDir, 'index.js'), handlerJs, 'utf-8')

  const vercelJson = {
    rewrites: [{ source: '/(.*)', destination: '/api/index' }]
  }
  writeFileSync(join(outDir, 'vercel.json'), JSON.stringify(vercelJson, null, 2), 'utf-8')

  const pkg = {
    name: 'aist-app',
    type: 'module',
    dependencies: { '@aist/server': '^0.1.0' }
  }
  writeFileSync(join(outDir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8')

  console.log(`Vercel adapter: ${outDir}`)
  return outDir
}

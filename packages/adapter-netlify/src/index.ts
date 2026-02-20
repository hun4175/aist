import { mkdirSync, writeFileSync, cpSync, existsSync } from 'fs'
import { join } from 'path'

export type NetlifyAdapterOptions = {
  root: string
  outDir?: string
}

const DEFAULT_OUT = '.output'

/** Netlify 배포용: netlify/functions + netlify.toml 생성 */
export async function buildNetlifyAdapter(opts: NetlifyAdapterOptions): Promise<string> {
  const outDir = opts.outDir ?? join(opts.root, DEFAULT_OUT)
  mkdirSync(outDir, { recursive: true })

  const dirs = ['pages', 'api', 'public', 'server']
  for (const d of dirs) {
    const src = join(opts.root, d)
    if (existsSync(src)) cpSync(src, join(outDir, d), { recursive: true })
  }

  const netlifyDir = join(outDir, 'netlify', 'functions')
  mkdirSync(netlifyDir, { recursive: true })

  const handlerJs = `import { createAistServer } from '@aist/server'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

let serverPromise = null

export default async (req, context) => {
  if (!serverPromise) {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const root = join(__dirname, '..', '..')
    const server = await createAistServer({
      root,
      pagesDir: join(root, 'pages'),
      apiDir: join(root, 'api'),
      publicDir: join(root, 'public'),
      serverDir: join(root, 'server')
    })
    serverPromise = Promise.resolve(server)
  }
  const server = await serverPromise
  return server.fetchHandler(req)
}
`

  writeFileSync(join(netlifyDir, 'aist.mjs'), handlerJs, 'utf-8')

  const netlifyToml = `[build]
  publish = "."
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/aist"
  status = 200
  force = true
`

  writeFileSync(join(outDir, 'netlify.toml'), netlifyToml, 'utf-8')

  const pkg = {
    name: 'aist-app',
    type: 'module',
    dependencies: { '@aist/server': '^0.1.0' }
  }
  writeFileSync(join(outDir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8')

  console.log(`Netlify adapter: ${outDir}`)
  return outDir
}

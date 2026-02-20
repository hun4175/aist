import { mkdirSync, writeFileSync, cpSync, existsSync } from 'fs'
import { join } from 'path'

export type NodeAdapterOptions = {
  root: string
  outDir?: string
}

const DEFAULT_OUT = '.output'

/** Node 배포용: 앱 복사 + server.js 엔트리 생성. run: node .output/server.js */
export async function buildNodeAdapter(opts: NodeAdapterOptions): Promise<string> {
  const outDir = opts.outDir ?? join(opts.root, DEFAULT_OUT)
  mkdirSync(outDir, { recursive: true })

  const dirs = ['pages', 'api', 'public', 'server']
  for (const d of dirs) {
    const src = join(opts.root, d)
    if (existsSync(src)) cpSync(src, join(outDir, d), { recursive: true })
  }

  const serverJs = `import { createAistServer } from '@aist/server'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname)
const port = Number(process.env.PORT) || 3000

const server = await createAistServer({
  port,
  root,
  pagesDir: join(root, 'pages'),
  apiDir: join(root, 'api'),
  publicDir: join(root, 'public'),
  serverDir: join(root, 'server')
})
await server.listen()
`

  writeFileSync(join(outDir, 'server.js'), serverJs, 'utf-8')

  const pkg = {
    name: 'aist-app',
    type: 'module',
    dependencies: { '@aist/server': '^0.1.0' }
  }
  writeFileSync(join(outDir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8')

  console.log(`Node adapter: ${outDir}`)
  return outDir
}

#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const template = (name: string) => ({
  'package.json': JSON.stringify({
    name,
    type: 'module',
    scripts: { dev: 'node dev.js' },
    dependencies: { '@aist/server': '^0.1.0' }
  }, null, 2),
  'dev.js': `import { createAistServer } from '@aist/server'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname)
const server = await createAistServer({
  root,
  pagesDir: join(root, 'pages'),
  apiDir: join(root, 'api'),
  publicDir: join(root, 'public'),
  serverDir: join(root, 'server')
})
server.listen()
`,
  'pages/index.page.js': `export default () => \`<div>Welcome to Aist</div>\`
`,
  'pages/about.page.js': `export default () => \`<div>About</div>\`
`,
  'pages/404.page.js': `export default () => \`<h1>Not Found</h1>\`
`,
  'pages/500.page.js': `export default () => \`<h1>Server Error</h1>\`
`,
  'api/users.get.js': `export default () => json([{ id: 1, name: 'User' }])
`,
  'server/_middleware.js': `export default (req, next) => next(req)
`,
  'public/.gitkeep': ''
})

async function main() {
  const name = process.argv[2] || 'my-aist-app'
  const dir = join(process.cwd(), name)
  mkdirSync(dir, { recursive: true })
  const files = template(name)
  for (const [path, content] of Object.entries(files)) {
    const full = join(dir, path)
    mkdirSync(join(full, '..'), { recursive: true })
    writeFileSync(full, content)
  }
  console.log(`Created ${name} at ${dir}`)
  console.log('Run: cd', name, '&& pnpm install && pnpm dev')
}

main().catch(console.error)

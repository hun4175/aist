import { createAistServer } from '@aist/server'
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

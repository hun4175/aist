import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
process.chdir(root)

const child = spawn('pnpm', ['--filter', 'example', 'dev'], {
  stdio: 'inherit',
  shell: true
})
child.on('exit', (code) => process.exit(code ?? 0))

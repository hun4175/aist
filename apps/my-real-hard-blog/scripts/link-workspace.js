/**
 * 워크스페이스 패키지 링크 (pnpm node_modules 미생성 시 대체)
 * postinstall에서 실행
 */
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = join(__dirname, '..')
const nodeModules = join(appRoot, 'node_modules')
const aistDir = join(nodeModules, '@aist')
const serverLink = join(aistDir, 'server')
const serverTarget = join(appRoot, '..', '..', 'packages', 'server')

if (existsSync(serverLink)) process.exit(0)

mkdirSync(aistDir, { recursive: true })
const isWin = process.platform === 'win32'
const target = join(serverTarget)
try {
  if (isWin) {
    execSync(`cmd /c mklink /J "${serverLink}" "${target}"`, { stdio: 'inherit' })
  } else {
    execSync(`ln -sf "${target}" "${serverLink}"`, { stdio: 'inherit' })
  }
  console.log('[my-real-hard-blog] Linked @aist/server')
} catch (e) {
  console.warn('[my-real-hard-blog] Could not link @aist/server:', e.message)
}

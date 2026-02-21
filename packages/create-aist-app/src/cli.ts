#!/usr/bin/env node
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** dist/cli.js 기준 상위 → templates, assets */
const PKG_ROOT = join(__dirname, '..')
const TEMPLATES_DIR = join(PKG_ROOT, 'templates')
const ASSETS_DIR = join(PKG_ROOT, 'assets')
const LOGO_PATH = join(ASSETS_DIR, 'logo.svg')

const LOGO = `
\x1b[36m
   █████╗ ██╗███████╗████████╗
  ██╔══██╗██║██╔════╝╚══██╔══╝
  ███████║██║███████╗   ██║   
  ██╔══██║██║╚════██║   ██║   
  ██║  ██║██║███████║   ██║   
  ╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝   \x1b[0m\x1b[2mAI Optimized Full-Stack Framework\x1b[0m
`

const PLACEHOLDER_NAME = '{{name}}'

/** templates/ 내 모든 파일 경로 수집 (상대 경로) */
const collectTemplatePaths = (dir: string, base = ''): string[] => {
  const entries = readdirSync(join(dir, base), { withFileTypes: true })
  const paths: string[] = []
  for (const e of entries) {
    const rel = base ? `${base}/${e.name}` : e.name
    if (e.isDirectory()) {
      paths.push(...collectTemplatePaths(dir, rel))
    } else {
      paths.push(rel)
    }
  }
  return paths
}

/** 템플릿 파일 복사 ({{name}} 치환) */
const copyTemplate = (destDir: string, name: string, relPath: string): void => {
  const src = join(TEMPLATES_DIR, relPath)
  const dest = join(destDir, relPath)
  if (!existsSync(src)) return
  mkdirSync(dirname(dest), { recursive: true })
  let content = readFileSync(src, 'utf-8')
  if (relPath === 'package.json' || relPath === 'README.md') {
    content = content.replaceAll(PLACEHOLDER_NAME, name)
  }
  writeFileSync(dest, content)
}

const main = async (): Promise<void> => {
  console.log(LOGO)
  const name = process.argv[2] || 'my-aist-app'
  const dir = join(process.cwd(), name)

  if (!existsSync(TEMPLATES_DIR)) {
    throw new Error(`create-aist-app: templates not found at ${TEMPLATES_DIR}`)
  }

  mkdirSync(dir, { recursive: true })
  const paths = collectTemplatePaths(TEMPLATES_DIR)
  for (const relPath of paths) {
    copyTemplate(dir, name, relPath)
  }

  if (!existsSync(LOGO_PATH)) {
    throw new Error(`create-aist-app: logo not found at ${LOGO_PATH}`)
  }
  const logoDest = join(dir, 'public', 'logo.svg')
  mkdirSync(dirname(logoDest), { recursive: true })
  writeFileSync(logoDest, readFileSync(LOGO_PATH, 'utf-8'))

  console.log(`Created ${name} at ${dir}`)
  console.log('Run: cd', name, '&& pnpm install && pnpm dev')
}

main().catch(console.error)

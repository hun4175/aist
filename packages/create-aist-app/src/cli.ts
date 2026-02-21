#!/usr/bin/env node
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** 패키지 내 assets/logo.svg 경로 (dist/cli.js 기준 ../assets/logo.svg) */
const LOGO_PATH = join(__dirname, '..', 'assets', 'logo.svg')

const LOGO = `
\x1b[36m
   █████╗ ██╗███████╗████████╗
  ██╔══██╗██║██╔════╝╚══██╔══╝
  ███████║██║███████╗   ██║   
  ██╔══██║██║╚════██║   ██║   
  ██║  ██║██║███████║   ██║   
  ╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝   \x1b[0m\x1b[2mAI Optimized Full-Stack Framework\x1b[0m
`

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
  'pages/_layout.js': `/** Root layout. ctx.path for meta, ctx.csrfToken for forms. */
export default (content, ctx = {}) => {
  const path = ctx.path || '/'
  const title = path === '/' ? 'Aist' : \`Aist - \${path}\`
  return \`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${title}</title>
</head>
<body>
  <nav style="padding:1rem 2rem;border-bottom:1px solid #e5e7eb;">
    <a href="/" style="margin-right:1rem;color:#0ea5e9;text-decoration:none;">Home</a>
    <a href="/about" style="color:#6b7280;text-decoration:none;">About</a>
  </nav>
  <main>\${content}</main>
</body>
</html>\`
}
`,
  'pages/index.page.js': `export default () => \`
<div style="min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;font-family:system-ui,-apple-system,sans-serif;text-align:center;">
  <img src="/logo.svg" alt="Aist" width="160" height="160" style="margin-bottom:1.5rem;" />
  <h1 style="font-size:2.5rem;font-weight:700;margin:0 0 0.5rem;color:#0f172a;">Welcome to Aist</h1>
  <p style="font-size:1.125rem;color:#64748b;margin:0 0 2rem;max-width:32rem;">
    AI 최적화 풀스택 프레임워크. Convention만 따르면 됩니다.
  </p>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">
    <a href="/about" style="display:inline-block;padding:0.75rem 1.5rem;background:#0ea5e9;color:white;border-radius:0.5rem;text-decoration:none;font-weight:500;">Get Started</a>
    <a href="/api/users" style="display:inline-block;padding:0.75rem 1.5rem;border:1px solid #e5e7eb;color:#374151;border-radius:0.5rem;text-decoration:none;font-weight:500;">API 예제</a>
  </div>
  <p style="margin-top:2rem;font-size:0.875rem;color:#94a3b8;">
    <code style="background:#f1f5f9;padding:0.25rem 0.5rem;border-radius:0.25rem;">pnpm dev</code> 로 실행 중
  </p>
</div>
\`
`,
  'pages/about.page.js': `export default () => \`<div style="padding:2rem;font-family:system-ui,-apple-system,sans-serif;">
  <h1 style="font-size:1.5rem;margin-bottom:1rem;">About</h1>
  <p style="color:#64748b;">Aist 기반 앱입니다. README의 Convention을 참고하세요.</p>
</div>\`
`,
  'pages/404.page.js': `export default () => \`<h1>Not Found</h1>\`
`,
  'pages/500.page.js': `export default () => \`<h1>Server Error</h1>\`
`,
  'api/users.get.js': `export default () => json([{ id: 1, name: 'User' }])
`,
  'server/_middleware.js': `export default (req, next) => next(req)
`,
  'README.md': `# ${name}

Aist 기반 앱. Convention만 따르면 됨.

## 실행

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

http://localhost:3000

## Convention (파일 규칙)

| 구분 | 파일 | 시그니처 |
|------|------|----------|
| 페이지 | \`경로.page.js\` | \`export default (params?) => \\\`html\\\`\` |
| API | \`경로.메서드.js\` | \`export default (req) => json(...)\`, \`req.params.id\` |
| Island | \`Name.island.js\` | 태그 \`<name-island>\` (kebab) |
| Layout | \`_layout.js\` | \`export default (content, ctx?) => html\` |

\`json\`, \`redirect\`, \`each\`, \`$if\` — import 불필요.
`,
  '.cursor/rules/aist.mdc': `---
description: Aist convention 및 validator 에러 복구 가이드
globs: pages/**/*.js,api/**/*.js,server/**/*.js
alwaysApply: false
---

# Aist 에러 복구 가이드

## Validator 에러 → 수정

| 에러 | 수정 |
|------|------|
| \`default export must be function, got undefined\` | \`export default (params) => \\\`<div>...</div>\\\`\` 추가 |
| \`handler must export default function\` | \`export default (req) => json(...)\` 형태로 |
| \`_layout.js: default export must be\` | \`export default (content, ctx = {}) => \\\`...\\\`\` |
| \`middleware must export default function\` | \`export default (req, next) => next(req)\` |
| \`*.island.js load error\` | import/문법 확인. \`@aist/island\` 사용 |

## Convention

- 페이지: \`경로.page.js\` → \`export default (params?) => html\`
- API: \`경로.메서드.js\` → \`export default (req) => json(...)\`, \`req.params.id\`
- Island: \`Name.island.js\` → \`<name-island>\` (kebab)
- 전역: \`json\`, \`redirect\`, \`each\`, \`$if\` — import 불필요
`
})

async function main() {
  console.log(LOGO)
  const name = process.argv[2] || 'my-aist-app'
  const dir = join(process.cwd(), name)
  mkdirSync(dir, { recursive: true })
  const files = template(name)
  for (const [path, content] of Object.entries(files)) {
    const full = join(dir, path)
    mkdirSync(join(full, '..'), { recursive: true })
    writeFileSync(full, content)
  }
  if (!existsSync(LOGO_PATH)) {
    throw new Error(`create-aist-app: logo not found at ${LOGO_PATH}`)
  }
  const logoContent = readFileSync(LOGO_PATH, 'utf-8')
  const logoDest = join(dir, 'public', 'logo.svg')
  mkdirSync(join(logoDest, '..'), { recursive: true })
  writeFileSync(logoDest, logoContent)
  console.log(`Created ${name} at ${dir}`)
  console.log('Run: cd', name, '&& pnpm install && pnpm dev')
}

main().catch(console.error)

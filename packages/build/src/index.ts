import { mkdirSync, writeFileSync, cpSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { scanPages, getStaticRoutes, scanIslands } from '@aist/router'
import { createAistServer } from '@aist/server'

export type PrerenderOptions = {
  root: string
  pagesDir: string
  apiDir: string
  publicDir: string
  serverDir: string
  outDir?: string
  /** 동적 라우트의 추가 경로. 예: ['/posts/1', '/posts/2'] */
  routes?: string[]
}

const DEFAULT_OUT = '.output'

/**
 * 정적 페이지들을 HTML로 prerender. outDir에 쓰고, public, islands, island 런타임 복사.
 */
export async function prerender(opts: PrerenderOptions): Promise<void> {
  const outDir = opts.outDir ?? join(opts.root, DEFAULT_OUT, 'public')
  mkdirSync(outDir, { recursive: true })

  const server = await createAistServer({
    root: opts.root,
    pagesDir: opts.pagesDir,
    apiDir: opts.apiDir,
    publicDir: opts.publicDir,
    serverDir: opts.serverDir
  })

  const routes = scanPages(opts.pagesDir)
  const staticRoutes = getStaticRoutes(routes)
  const paths = [...staticRoutes.keys()]
  if (opts.routes?.length) {
    for (const r of opts.routes) paths.push(r.startsWith('/') ? r : '/' + r)
  }

  for (const path of paths) {
    const html = await server.renderPage(path)
    const filePath = path === '/' ? 'index.html' : join(path.slice(1), 'index.html')
    const dest = join(outDir, filePath)
    mkdirSync(join(dest, '..'), { recursive: true })
    writeFileSync(dest, html, 'utf-8')
  }

  server.close()

  const islands = scanIslands(opts.pagesDir)
  if (islands.size > 0) {
    const islandsOut = join(outDir, '_islands')
    mkdirSync(islandsOut, { recursive: true })
    try {
      const resolve = (import.meta as { resolve?: (s: string) => Promise<string> }).resolve
      const islandResolved = resolve ? fileURLToPath(await resolve('@aist/island')) : null
      const aistOut = join(outDir, '_aist')
      mkdirSync(aistOut, { recursive: true })
      if (islandResolved && existsSync(islandResolved)) {
        const code = readFileSync(islandResolved, 'utf-8')
        writeFileSync(join(aistOut, 'island.js'), code, 'utf-8')
      }
    } catch {}
    for (const [tagName, islandPath] of islands) {
      if (existsSync(islandPath)) {
        let code = readFileSync(islandPath, 'utf-8')
        code = code.replace(/from\s+['"]@aist\/island['"]/g, 'from "/_aist/island.js"')
        writeFileSync(join(islandsOut, `${tagName}.js`), code, 'utf-8')
      }
    }
  }

  if (existsSync(opts.publicDir)) {
    cpSync(opts.publicDir, outDir, { recursive: true })
  }

  console.log(`Prerendered ${paths.length} pages to ${outDir}`)
}

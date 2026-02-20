import { readdirSync, statSync, existsSync } from 'fs'
import { join, extname } from 'path'

const RESERVED = ['404', '500']
const PAGE_EXT = '.page.js'

export type RouteMatch = {
  path: string
  params: Record<string, string>
  pagePath: string
}

/**
 * pages/ 스캔 → convention 라우팅.
 * 404.page.js, 500.page.js는 라우트에서 제외.
 */
export function scanPages(pagesDir: string): Map<string, string> {
  const routes = new Map<string, string>()
  if (!existsSync(pagesDir)) return routes

  function scan(dir: string, base = '') {
    const entries = readdirSync(dir)
    for (const name of entries) {
      const full = join(dir, name)
      const rel = base ? `${base}/${name}` : name
      if (statSync(full).isDirectory()) {
        if (!name.startsWith('_') && name !== 'api') scan(full, rel)
      } else if (name.endsWith(PAGE_EXT)) {
        const routeName = name.slice(0, -PAGE_EXT.length)
        if (RESERVED.includes(routeName)) continue
        const seg = routeName === 'index' ? (base ? base : '') : (base ? `${base}/${routeName}` : routeName)
        const path = '/' + seg.replace(/^\//, '') || '/'
        routes.set(path, full)
      }
    }
  }

  scan(pagesDir)
  return routes
}

/**
 * path를 convention 형식으로 변환.
 * [id] → :id
 */
function toRoutePattern(seg: string): string {
  if (seg.startsWith('[') && seg.endsWith(']')) return ':' + seg.slice(1, -1)
  return seg
}

/**
 * 라우트 매칭. /posts/123 → { path: '/posts/[id]', params: { id: '123' } }
 */
export function matchRoute(routes: Map<string, string>, urlPath: string): RouteMatch | null {
  const segments = urlPath.split('/').filter(Boolean)
  const normalized = '/' + urlPath.replace(/^\/+|\/+$/g, '') || '/'

  for (const [routePath, pagePath] of routes) {
    const routeSegs = (routePath === '/' ? '' : routePath).split('/').filter(Boolean)
    if (routeSegs.length !== segments.length) continue

    const params: Record<string, string> = {}
    let matched = true
    for (let i = 0; i < routeSegs.length; i++) {
      const r = routeSegs[i]
      const s = segments[i]
      const isParam = r.startsWith('[') && r.endsWith(']') ? r.slice(1, -1) : r.startsWith(':') ? r.slice(1) : null
      if (isParam) params[isParam] = s
      else if (r !== s) { matched = false; break }
    }
    if (matched) return { path: routePath, params, pagePath }
  }
  return null
}

/**
 * 파일 경로 → URL 경로 변환.
 * pages/posts/[id].page.js → /posts/:id
 */
export function pagePathToRoute(filePath: string, pagesDir: string): string {
  const rel = filePath.slice(pagesDir.length).replace(/\\/g, '/').replace(PAGE_EXT, '')
  const parts = rel.split('/').filter(Boolean)
  const route = parts.map(p => toRoutePattern(p)).join('/')
  return '/' + (route === 'index' ? '' : route) || '/'
}

/** _layout.js 경로 수집. pagePath 기준으로 적용할 레이아웃 순서 반환 (가장 가까운 것부터) */
export function getLayoutsForPath(pagesDir: string, pagePath: string): string[] {
  const layouts: string[] = []
  const rootLayout = join(pagesDir, '_layout.js')
  if (existsSync(rootLayout)) layouts.push(rootLayout)

  if (pagePath === join(pagesDir, 'index.page.js') || pagePath === join(pagesDir, '404.page.js') || pagePath === join(pagesDir, '500.page.js')) {
    return layouts
  }
  const rel = pagePath.slice(pagesDir.length).replace(/\\/g, '/')
  const parts = rel.split('/').filter(Boolean).slice(0, -1)
  let acc = pagesDir
  for (const p of parts) {
    acc = join(acc, p)
    const layoutPath = join(acc, '_layout.js')
    if (existsSync(layoutPath)) layouts.push(layoutPath)
  }
  return layouts
}

const ISLAND_EXT = '.island.js'

/** pages/ 내 *.island.js 스캔. tagName → 파일 경로 */
export function scanIslands(pagesDir: string): Map<string, string> {
  const map = new Map<string, string>()
  if (!existsSync(pagesDir)) return map

  function scan(dir: string) {
    const entries = readdirSync(dir)
    for (const name of entries) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) {
        if (!name.startsWith('_')) scan(full)
      } else if (name.endsWith(ISLAND_EXT)) {
        const base = name.slice(0, -ISLAND_EXT.length)
        const tagName = base.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
        map.set(tagName, full)
      }
    }
  }
  scan(pagesDir)
  return map
}

/** HTML 문자열에서 사용된 island 태그명 추출 */
export function extractIslandTags(html: string): string[] {
  const tags = new Set<string>()
  const re = /<([a-z][a-z0-9-]*)/g
  let m
  while ((m = re.exec(html)) !== null) {
    if (m[1].includes('-')) tags.add(m[1])
  }
  return [...tags]
}

/** Prerender 가능한 정적 라우트만 필터. [id] 등 동적 세그먼트 있는 경로 제외 */
export function getStaticRoutes(routes: Map<string, string>): Map<string, string> {
  const staticMap = new Map<string, string>()
  for (const [path, pagePath] of routes) {
    const hasDynamic = path.split('/').some(seg => /^\[[\w-]+\]$/.test(seg) || seg.startsWith(':'))
    if (!hasDynamic) staticMap.set(path, pagePath)
  }
  return staticMap
}

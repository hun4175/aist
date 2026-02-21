import { createServer, IncomingMessage, ServerResponse } from 'http'
import { randomBytes } from 'crypto'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { pathToFileURL, fileURLToPath } from 'url'
import { scanPages, matchRoute, getLayoutsForPath, scanIslands, extractIslandTags } from '@aist/router'
import { validate } from '@aist/validator'
import { json, redirect, each, $if } from './sugar.js'

export { json, redirect, each, $if }

function injectSugar() {
  ;(globalThis as any).json = json
  ;(globalThis as any).redirect = redirect
  ;(globalThis as any).each = each
  ;(globalThis as any).$if = $if
}

export type AistServerOptions = {
  port?: number
  root: string
  pagesDir: string
  apiDir: string
  publicDir: string
  serverDir: string
  /** CSRF 토큰 검증 (POST/PUT/PATCH/DELETE). 기본 true */
  csrf?: boolean
}

const METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const

function loadModule(modulePath: string) {
  return import(pathToFileURL(modulePath).href)
}

type ApiHandler = { file: string; method: string; pattern: RegExp; paramNames: string[] }

function scanApi(apiDir: string): { static: Map<string, string>; dynamic: ApiHandler[] } {
  const staticHandlers = new Map<string, string>()
  const dynamicHandlers: ApiHandler[] = []
  if (!existsSync(apiDir)) return { static: staticHandlers, dynamic: dynamicHandlers }

  const entries = readdirSync(apiDir)
  for (const name of entries) {
    const full = join(apiDir, name)
    if (statSync(full).isFile() && name.endsWith('.js')) {
      const base = name.slice(0, -3)
      const lastDot = base.lastIndexOf('.')
      if (lastDot === -1) continue
      const method = base.slice(lastDot + 1).toLowerCase()
      const pathPart = base.slice(0, lastDot)
      if (!METHODS.includes(method as any)) continue
      const path = '/api/' + pathPart.replace(/\./g, '/')
      if (pathPart.includes('[')) {
        const parts = pathPart.split('.')
        const regexParts: string[] = []
        const paramNames: string[] = []
        for (const p of parts) {
          if (p.startsWith('[') && p.endsWith(']')) {
            paramNames.push(p.slice(1, -1))
            regexParts.push('([^/]+)')
          } else regexParts.push(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        }
        dynamicHandlers.push({
          file: full,
          method,
          pattern: new RegExp('^/api/' + regexParts.join('/') + '$'),
          paramNames
        })
      } else staticHandlers.set(`${method}:${path}`, full)
    }
  }
  return { static: staticHandlers, dynamic: dynamicHandlers }
}

export async function createAistServer(opts: AistServerOptions) {
  const errors = await validate(opts.root)
  if (errors.length > 0) {
    for (const e of errors) {
      console.error(`[aist] ${e.file}: ${e.message}`)
    }
    throw new Error('Aist validation failed. See .cursor/rules/aist.mdc for fix guide.')
  }
  injectSugar()
  const port = opts.port ?? 3000
  const routes = scanPages(opts.pagesDir)
  const islands = scanIslands(opts.pagesDir)
  const { static: staticApi, dynamic: dynamicApi } = scanApi(opts.apiDir)
  let middleware: ((req: Request, next: (req: Request) => Promise<Response>) => Promise<Response>) | null = null
  const middlewarePath = join(opts.serverDir, '_middleware.js')
  if (existsSync(middlewarePath)) {
    const mod = await loadModule(middlewarePath)
    if (mod.default) middleware = mod.default
  }
  let page404: (() => string | Promise<string>) | null = null
  let page500: (() => string | Promise<string>) | null = null
  const p404 = join(opts.pagesDir, '404.page.js')
  const p500 = join(opts.pagesDir, '500.page.js')
  if (existsSync(p404)) {
    const mod = await loadModule(p404)
    page404 = mod.default
  }
  if (existsSync(p500)) {
    const mod = await loadModule(p500)
    page500 = mod.default
  }

  const defaultWrap = (body: string) => {
    if (/^\s*<!DOCTYPE/i.test(body) || /^\s*<html/i.test(body)) return body
    return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${body}</body></html>`
  }

  let islandRuntimePath: string | null = null
  try {
    const resolve = (import.meta as { resolve?: (s: string) => Promise<string> }).resolve
    if (resolve) islandRuntimePath = fileURLToPath(await resolve('@aist/island'))
  } catch {}

  const runMiddleware = async (req: Request): Promise<Response | null> => {
    if (!middleware) return null
    const next = async (r: Request) => {
      const res = await handleRequest(r)
      return res
    }
    return middleware(req, next)
  }

  const applyLayouts = async (content: string, pagePath: string, urlPath: string, csrfToken?: string): Promise<string> => {
    const layoutPaths = getLayoutsForPath(opts.pagesDir, pagePath)
    let wrapped = content
    const ctx = { path: urlPath, csrfToken }
    for (const layoutPath of layoutPaths.reverse()) {
      const mod = await loadModule(layoutPath)
      const layoutFn = mod.default
      if (typeof layoutFn !== 'function') continue
      wrapped = layoutFn.length >= 2 ? layoutFn(wrapped, ctx) : layoutFn(wrapped)
    }
    return wrapped
  }

  const CSRF_COOKIE = 'aist_csrf'
  const getOrCreateCsrfToken = (req: Request): string => {
    const cookie = req.headers.get('cookie') || ''
    const match = cookie.match(new RegExp(`${CSRF_COOKIE}=([^;]+)`))
    if (match) return match[1]
    return randomBytes(32).toString('hex')
  }
  const checkCsrf = async (req: Request): Promise<boolean> => {
    if (opts.csrf === false) return true
    const method = req.method.toUpperCase()
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return true
    const cookie = req.headers.get('cookie') || ''
    const cookieMatch = cookie.match(new RegExp(`${CSRF_COOKIE}=([^;]+)`))
    const tokenFromCookie = cookieMatch ? cookieMatch[1] : null
    if (!tokenFromCookie) return false
    let tokenFromReq = req.headers.get('x-csrf-token') || req.headers.get('x-xsrf-token')
    if (!tokenFromReq) {
      try {
        const ct = req.headers.get('content-type') || ''
        if (ct.includes('application/x-www-form-urlencoded')) {
          const form = await req.clone().formData()
          tokenFromReq = form.get('_csrf') as string || ''
        } else if (ct.includes('application/json')) {
          const body = await req.clone().json() as Record<string, unknown>
          tokenFromReq = String(body?._csrf || '')
        }
      } catch {
        /* CSRF body parse 실패 시 tokenFromReq 유지 (null) */
      }
    }
    return !!(tokenFromReq && tokenFromReq === tokenFromCookie)
  }
  const injectCsrfMeta = (html: string, token: string): string => {
    if (opts.csrf === false) return html
    const meta = `<meta name="csrf-token" content="${token}">`
    if (/<head[^>]*>/i.test(html)) return html.replace(/<head([^>]*)>/i, `<head$1>${meta}\n`)
    if (/<html[^>]*>/i.test(html)) return html.replace(/<html([^>]*)>/i, `<html$1><head>${meta}</head>`)
    return meta + html
  }

  const injectIslands = (html: string): string => {
    const usedTags = extractIslandTags(html)
    if (usedTags.length === 0) return html
    const scripts = usedTags
      .filter((t) => islands.has(t))
      .map((t) => `<script type="module" src="/_islands/${t}.js"></script>`)
      .join('\n')
    const importMap = `<script type="importmap">{"imports":{"@aist/island":"/_aist/island.js"}}</script>`
    const hasHead = /<head[^>]*>/i.test(html)
    if (hasHead) {
      return html.replace(/<head([^>]*)>/i, `<head$1>${importMap}\n`)
        .replace(/<\/body>/i, `${scripts}\n</body>`)
    }
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${importMap}</head>`)
      .replace(/<\/body>/i, `${scripts}\n</body>`)
  }

  const servePage = async (req: Request, urlPath: string): Promise<Response> => {
    const match = matchRoute(routes, urlPath)
    if (!match) {
      const csrfToken = getOrCreateCsrfToken(req)
      const body = page404 ? await (typeof page404 === 'function' ? page404() : page404) : '<h1>Not Found</h1>'
      const wrapped = opts.pagesDir ? await applyLayouts(body, join(opts.pagesDir, '404.page.js'), urlPath, csrfToken) : body
      const withCsrf = injectCsrfMeta(wrapped, csrfToken)
      const headers404: Record<string, string> = { 'Content-Type': 'text/html; charset=utf-8' }
      if (opts.csrf !== false) headers404['Set-Cookie'] = `${CSRF_COOKIE}=${csrfToken}; Path=/; SameSite=Strict; HttpOnly`
      return new Response(defaultWrap(withCsrf), { headers: headers404, status: 404 })
    }
    try {
      const csrfToken = getOrCreateCsrfToken(req)
      const mod = await loadModule(match.pagePath)
      const handler = mod.default
      if (typeof handler !== 'function') throw new Error(`pages${match.pagePath}: default export must be function`)
      const result = await handler(match.params)
      let html = typeof result === 'string' ? result : (result && typeof (result as any).then === 'function' ? await (result as Promise<string>) : String(result))
      html = await applyLayouts(html, match.pagePath, urlPath, csrfToken)
      html = injectIslands(html)
      html = injectCsrfMeta(html, csrfToken)
      const headers: Record<string, string> = { 'Content-Type': 'text/html; charset=utf-8' }
      if (opts.csrf !== false) headers['Set-Cookie'] = `${CSRF_COOKIE}=${csrfToken}; Path=/; SameSite=Strict; HttpOnly`
      return new Response(defaultWrap(html), { headers })
    } catch (err) {
      const csrfToken = getOrCreateCsrfToken(req)
      const body = page500 ? await (typeof page500 === 'function' ? page500() : page500) : `<h1>Server Error</h1><pre>${err}</pre>`
      const wrapped = opts.pagesDir ? await applyLayouts(body, join(opts.pagesDir, '500.page.js'), urlPath, csrfToken) : body
      const withCsrf = injectCsrfMeta(wrapped, csrfToken)
      const headers500: Record<string, string> = { 'Content-Type': 'text/html; charset=utf-8' }
      if (opts.csrf !== false) headers500['Set-Cookie'] = `${CSRF_COOKIE}=${csrfToken}; Path=/; SameSite=Strict; HttpOnly`
      return new Response(defaultWrap(withCsrf), { headers: headers500, status: 500 })
    }
  }

  const handleApi = async (req: Request, pathname: string, method: string): Promise<Response | null> => {
    let handlerPath: string | null = staticApi.get(`${method}:${pathname}`) ?? null
    if (!handlerPath) {
      for (const h of dynamicApi) {
        if (h.method !== method) continue
        const m = pathname.match(h.pattern)
        if (m) {
          handlerPath = h.file
          const params = Object.fromEntries(h.paramNames.map((n, i) => [n, m[i + 1]]))
          req = new Proxy(req, { get(t, k) { return k === 'params' ? params : Reflect.get(t, k) } }) as Request
          break
        }
      }
    }
    if (!handlerPath) return null
    try {
      const mod = await loadModule(handlerPath)
      const handler = mod.default
      if (typeof handler !== 'function') throw new Error('handler must export default function')
      const globals = { json, redirect, each, $if }
      const result = await handler(req)
      if (result instanceof Response) return result
      if (typeof result === 'string') return new Response(result, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
      return json(result)
    } catch (err) {
      const body = page500 ? await (typeof page500 === 'function' ? page500() : page500) : `<h1>Server Error</h1><pre>${err}</pre>`
      return new Response(defaultWrap(body), { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 500 })
    }
  }

  const handleRequest = async (req: Request): Promise<Response> => {
    const url = new URL(req.url)
    const pathname = url.pathname
    const method = req.method.toLowerCase()

    if (pathname === '/_aist/island.js' && islandRuntimePath && existsSync(islandRuntimePath)) {
      const data = readFileSync(islandRuntimePath)
      return new Response(new Uint8Array(data), { headers: { 'Content-Type': 'application/javascript' } })
    }
    const islandMatch = pathname.match(/^\/_islands\/([a-z0-9-]+)\.js$/)
    if (islandMatch) {
      const tag = islandMatch[1]
      const islandPath = islands.get(tag)
      if (islandPath && existsSync(islandPath)) {
        const data = readFileSync(islandPath, 'utf-8')
        const transformed = data.replace(
          /from\s+['"]@aist\/island['"]/g,
          'from "/_aist/island.js"'
        )
        return new Response(transformed, { headers: { 'Content-Type': 'application/javascript' } })
      }
    }

    const staticPath = join(opts.publicDir, pathname.slice(1).replace(/\.\./g, ''))
    if (existsSync(staticPath)) {
      try {
        const data = readFileSync(staticPath)
        const ext = extname(staticPath)
        const mimes: Record<string, string> = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json' }
        const ct = mimes[ext] || 'application/octet-stream'
        return new Response(new Uint8Array(data), { headers: { 'Content-Type': ct } })
      } catch {}
    }

    if (pathname.startsWith('/api/')) {
      if (!(await checkCsrf(req))) {
        return new Response('CSRF validation failed', { status: 403 })
      }
      const res = await handleApi(req, pathname, method)
      if (res) return res
    }

    return servePage(req, pathname)
  }

  const nodeHandler = async (req: IncomingMessage, res: ServerResponse) => {
    const body = req.method !== 'GET' && req.method !== 'HEAD' ? await new Promise<BodyInit>((resolve, reject) => {
      const chunks: Buffer[] = []
      req.on('data', (c: Buffer) => chunks.push(c))
      req.on('end', () => resolve(Buffer.concat(chunks as unknown as Uint8Array[]) as unknown as BodyInit))
      req.on('error', reject)
    }) : undefined
    const url = `http://${req.headers.host}${req.url}`
    const headers = new Headers()
    for (const [k, v] of Object.entries(req.headers)) if (v) headers.set(k, Array.isArray(v) ? v.join(', ') : v)
    const request = new Request(url, { method: req.method || 'GET', headers, body: body ?? null })
    let response: Response
    const mwRes = await runMiddleware(request)
    if (mwRes) response = mwRes
    else response = await handleRequest(request)
    res.writeHead(response.status, Object.fromEntries(response.headers))
    const buf = await response.arrayBuffer()
    res.end(Buffer.from(buf))
  }

  let server: ReturnType<typeof createServer> | null = null
  const tryListen = (p: number): Promise<void> =>
    new Promise((resolve, reject) => {
      const s = createServer(nodeHandler)
      s.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE' && p < port + 10) {
          tryListen(p + 1).then(resolve).catch(reject)
        } else reject(err)
      })
      s.listen(p, () => {
        server = s
        console.log(`Aist dev server: http://localhost:${p}`)
        resolve()
      })
    })
  return {
    listen: () => tryListen(port),
    close: () => server?.close(),
    /** Node/Vercel 어댑터용: (req, res) => void */
    handler: nodeHandler,
    /** Netlify/Edge 어댑터용: (req: Request) => Promise<Response> */
    fetchHandler: handleRequest,
    /** Prerender용: urlPath에 해당하는 HTML 문자열 반환 */
    renderPage: async (urlPath: string): Promise<string> => {
      const req = new Request(`http://localhost${urlPath}`)
      const res = await handleRequest(req)
      return res.text()
    }
  }
}

import { readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'
import { pathToFileURL } from 'url'

const RESERVED = ['404', '500']

export type ValidationError = {
  file: string
  message: string
}

async function loadModule(full: string) {
  return import(pathToFileURL(full).href)
}

/**
 * pages/*.page.js: default export must be function
 * 404/500: 형식만 검증, 라우트 제외
 */
export async function validatePages(pagesDir: string): Promise<ValidationError[]> {
  const errors: ValidationError[] = []
  if (!existsSync(pagesDir)) return errors

  async function scan(dir: string): Promise<void> {
    const entries = readdirSync(dir)
    for (const name of entries) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) {
        if (!name.startsWith('_')) await scan(full)
      } else if (name.endsWith('.page.js')) {
        const routeName = name.slice(0, -'.page.js'.length)
        if (RESERVED.includes(routeName)) continue
        try {
          const mod = await loadModule(full)
          if (typeof mod?.default !== 'function') {
            errors.push({ file: full, message: 'default export must be function, got ' + typeof mod?.default })
          }
        } catch (e: unknown) {
          errors.push({ file: full, message: 'load error: ' + (e instanceof Error ? e.message : String(e)) })
        }
      } else if (name === '_layout.js') {
        try {
          const mod = await loadModule(full)
          if (typeof mod?.default !== 'function') {
            errors.push({ file: full, message: '_layout.js: default export must be (content) => html or (content, ctx) => html' })
          }
        } catch (e: unknown) {
          errors.push({ file: full, message: '_layout.js load error: ' + (e instanceof Error ? e.message : String(e)) })
        }
      } else if (name.endsWith('.island.js')) {
        try {
          await loadModule(full)
        } catch (e: unknown) {
          errors.push({ file: full, message: '*.island.js load error: ' + (e instanceof Error ? e.message : String(e)) })
        }
      }
    }
  }
  await scan(pagesDir)
  return errors
}

const API_METHODS = ['get', 'post', 'put', 'patch', 'delete']

export async function validateApi(apiDir: string): Promise<ValidationError[]> {
  const errors: ValidationError[] = []
  if (!existsSync(apiDir)) return errors

  const entries = readdirSync(apiDir)
  for (const name of entries) {
    const full = join(apiDir, name)
    if (statSync(full).isFile() && name.endsWith('.js')) {
      const base = name.slice(0, -3)
      const lastDot = base.lastIndexOf('.')
      if (lastDot === -1) continue
      const method = base.slice(lastDot + 1).toLowerCase()
      if (!API_METHODS.includes(method)) continue
      try {
        const mod = await loadModule(full)
        if (typeof mod?.default !== 'function') {
          errors.push({ file: full, message: 'handler must export default function, got ' + typeof mod?.default })
        }
      } catch (e: unknown) {
        errors.push({ file: full, message: 'load error: ' + (e instanceof Error ? e.message : String(e)) })
      }
    }
  }
  return errors
}

export async function validateMiddleware(serverDir: string): Promise<ValidationError[]> {
  const errors: ValidationError[] = []
  const p = join(serverDir, '_middleware.js')
  if (!existsSync(p)) return errors
  try {
    const mod = await loadModule(p)
    if (typeof mod?.default !== 'function') {
      errors.push({ file: p, message: 'middleware must export default function, got ' + typeof mod?.default })
    }
  } catch (e: unknown) {
    errors.push({ file: p, message: 'load error: ' + (e instanceof Error ? e.message : String(e)) })
  }
  return errors
}

export async function validate(root: string): Promise<ValidationError[]> {
  const [pages, api, mw] = await Promise.all([
    validatePages(join(root, 'pages')),
    validateApi(join(root, 'api')),
    validateMiddleware(join(root, 'server'))
  ])
  return [...pages, ...api, ...mw]
}

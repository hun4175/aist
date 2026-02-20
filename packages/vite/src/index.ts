import type { Plugin } from 'vite'
import { validate } from '@aist/validator'
import { resolve } from 'path'

export function aistPlugin(root?: string): Plugin {
  const projectRoot = root ? resolve(root) : process.cwd()
  return {
    name: 'aist',
    async configResolved() {
      const errors = await validate(projectRoot)
      if (errors.length > 0) {
        for (const e of errors) {
          console.error(`[aist] ${e.file}: ${e.message}`)
        }
        throw new Error('Aist validation failed')
      }
    }
  }
}

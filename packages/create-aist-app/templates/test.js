import { validate } from '@aist/validator'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname)

try {
  const errors = await validate(root)
  if (errors.length > 0) {
    for (const e of errors) {
      console.error(`[aist] ${e.file}: ${e.message}`)
    }
    process.exit(1)
  }
  console.log('Validation passed.')
} catch (err) {
  console.error('[aist]', err)
  process.exit(1)
}

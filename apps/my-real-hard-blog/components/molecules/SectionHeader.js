import { H2, P } from '../atoms/index.js'

/** Molecule: 섹션 헤더 */
export const SectionHeader = (title, subtitle = '') =>
  `<div class="mb-8">${H2(title)}${subtitle ? `<div class="mt-2">${P(subtitle)}</div>` : ''}</div>`

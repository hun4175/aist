/** 코드 슈거 - 핸들러 실행 시 전역 주입 */
export const json = (data: unknown) => Response.json(data)
export const redirect = (url: string, status = 302) => Response.redirect(url, status)
export const each = <T>(items: T[], fn: (item: T, i: number) => string) =>
  items.map((item, i) => fn(item, i)).join('')
export const $if = (cond: unknown, then: string, els: string = '') => (cond ? then : els)

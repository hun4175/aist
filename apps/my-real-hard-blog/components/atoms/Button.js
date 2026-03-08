/** Atom: 버튼/링크 스타일 기본 단위 */
export const Button = (opts) => {
  const { href, variant = 'primary', children } = opts
  const base = 'inline-block px-6 py-3 rounded-lg font-medium no-underline transition'
  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600',
    secondary: 'border border-slate-600 text-slate-300 hover:bg-slate-800'
  }
  const cls = `${base} ${variants[variant] || variants.primary}`
  if (href) return `<a href="${href}" class="${cls}">${children}</a>`
  return `<button type="button" class="${cls}">${children}</button>`
}

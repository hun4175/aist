/** Atom: 배지/태그 */
export const Badge = (opts) => {
  const { children, variant = 'default' } = opts
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    success: 'bg-emerald-900/80 text-emerald-300',
    info: 'bg-sky-900/80 text-sky-300'
  }
  const cls = `inline-block px-2 py-0.5 text-xs font-medium rounded ${variants[variant] || variants.default}`
  return `<span class="${cls}">${children}</span>`
}

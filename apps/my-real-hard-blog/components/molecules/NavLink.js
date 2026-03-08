/** Molecule: 네비게이션 링크 (다크 테마, selected 상태 pill 스타일) */
export const NavLink = (href, label, active = false) => {
  const base = 'inline-block px-3 py-2 rounded-lg no-underline transition-colors'
  const cls = active
    ? `${base} text-sky-300 font-medium bg-sky-500/15`
    : `${base} text-slate-400 hover:text-slate-200 hover:bg-slate-800/50`
  const aria = active ? ' aria-current="page"' : ''
  return `<a href="${href}" class="${cls}"${aria}>${label}</a>`
}

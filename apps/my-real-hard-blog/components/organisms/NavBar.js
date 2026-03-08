import { NavLink } from '../molecules/index.js'

/** Organism: 상단 네비게이션 (다크 테마, GNB 개선, selected 상태) */
export const NavBar = (path = '/') => {
  const is = (p) => path === p || (p !== '/' && path.startsWith(p))
  const isHome = path === '/' || path === '' || path === '/index'
  const navOuter = isHome
    ? 'w-full border-b border-white/20 bg-transparent backdrop-blur-sm'
    : 'w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm shadow-sm'
  return `
  <nav class="${navOuter}" role="navigation" aria-label="메인">
    <div class="flex items-center justify-between max-w-7xl mx-auto py-4 px-6">
      <a href="/" class="font-semibold text-slate-100 no-underline hover:text-slate-200 transition-colors">my-real-hard-blog</a>
      <div class="flex items-center gap-2" data-nav-links>
        ${NavLink('/about', '사이트 소개', is('/about'))}
        ${NavLink('/tech-pr', '기술 PR', is('/tech-pr'))}
        ${NavLink('/perf-100k', '성능 데모', is('/perf-100k'))}
        ${NavLink('/blog', '블로그', is('/blog'))}
      </div>
    </div>
  </nav>`
}

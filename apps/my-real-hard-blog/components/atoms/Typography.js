/** Atom: 타이포그래피 기본 단위 (다크 테마) */
export const H1 = (children) => `<h1 class="text-3xl font-bold text-slate-100">${children}</h1>`
export const H2 = (children) => `<h2 class="text-2xl font-semibold text-slate-200">${children}</h2>`
export const H3 = (children) => `<h3 class="text-xl font-medium text-slate-300">${children}</h3>`
export const P = (children, cls = '') => `<p class="text-slate-400 ${cls}">${children}</p>`
export const Code = (children) => `<code class="bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-sm">${children}</code>`

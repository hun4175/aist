import { NavBar } from '../organisms/index.js'

/** Template: 페이지 공통 레이아웃 */
export const PageLayout = (content, path = '/') => {
  const isHome = path === '/' || path === '' || path === '/index'
  const wrapperClass = isHome ? 'min-h-screen h-screen flex flex-col bg-transparent overflow-visible' : 'min-h-screen bg-slate-900'
  const mainClass = isHome ? 'flex-1 flex flex-col items-center justify-center w-full min-h-0 overflow-visible relative' : 'max-w-4xl mx-auto px-6 py-10'
  return `<div class="${wrapperClass}">
    ${NavBar(path)}
    <main class="${mainClass}">${content}</main>
  </div>`
}

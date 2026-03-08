/**
 * Island: 10만개 가상 스크롤
 * 순수 함수 로직을 인라인하여 클라이언트에서 사용 (lib 의존성 제거)
 */
const getVisibleRange = (scrollTop, containerHeight, itemHeight, totalCount, overscan = 5) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + overscan * 2)
  return { startIndex, endIndex }
}
const getSpacerTop = (startIndex, itemHeight) => startIndex * itemHeight
const getSpacerBottom = (endIndex, totalCount, itemHeight) =>
  Math.max(0, (totalCount - endIndex - 1) * itemHeight)
const getTotalHeight = (totalCount, itemHeight) => totalCount * itemHeight

const renderItems = (start, end, itemHeight) => {
  let html = ''
  for (let i = start; i <= end; i++) {
    html += `<div class="flex items-center h-12 px-4 border-b border-slate-700 text-slate-300" data-index="${i}">#${i + 1}</div>`
  }
  return html
}

class VirtualList100k extends HTMLElement {
  static get observedAttributes() { return ['total', 'item-height', 'overscan'] }

  connectedCallback() {
    const total = parseInt(this.getAttribute('total') || '100000', 10)
    const itemHeight = parseInt(this.getAttribute('item-height') || '48', 10)
    const overscan = parseInt(this.getAttribute('overscan') || '5', 10)

    const totalHeight = getTotalHeight(total, itemHeight)
    this.innerHTML = `
      <div class="border border-slate-700 rounded-lg overflow-hidden bg-slate-800" style="height: 400px; overflow-y: auto;" role="list" aria-label="가상 스크롤 리스트">
        <div class="relative" style="height: ${totalHeight}px;">
          <div class="absolute top-0 left-0 right-0" data-items></div>
        </div>
      </div>
      <div class="mt-2 text-sm text-slate-400" data-stats></div>
    `

    const scrollEl = this.querySelector('[style*="overflow-y"]')
    const itemsEl = this.querySelector('[data-items]')
    const statsEl = this.querySelector('[data-stats]')

    const update = () => {
      const scrollTop = scrollEl.scrollTop
      const containerHeight = scrollEl.clientHeight
      const { startIndex, endIndex } = getVisibleRange(scrollTop, containerHeight, itemHeight, total, overscan)

      const top = getSpacerTop(startIndex, itemHeight)
      const bottom = getSpacerBottom(endIndex, total, itemHeight)
      const visibleCount = endIndex - startIndex + 1

      itemsEl.style.transform = `translateY(${top}px)`
      itemsEl.innerHTML = renderItems(startIndex, endIndex, itemHeight)
      itemsEl.style.paddingBottom = `${bottom}px`

      statsEl.textContent = `렌더링 중: ${visibleCount}개 (${startIndex + 1} ~ ${endIndex + 1} / ${total})`
    }

    scrollEl.addEventListener('scroll', () => requestAnimationFrame(update))
    update()
  }
}

customElements.define('virtual-list100k', VirtualList100k)

/**
 * 가상 스크롤용 순수 함수 (함수형 프로그래밍)
 * 부수효과 없음. 입력 → 출력만.
 */

/** 스크롤 위치와 컨테이너 정보로 visible range 계산 */
export const getVisibleRange = (scrollTop, containerHeight, itemHeight, totalCount, overscan = 5) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + overscan * 2)
  return { startIndex, endIndex }
}

/** 스포크(spacer) 상단 높이 계산 */
export const getSpacerTop = (startIndex, itemHeight) => startIndex * itemHeight

/** 스포크 하단 높이 계산 */
export const getSpacerBottom = (endIndex, totalCount, itemHeight) =>
  Math.max(0, (totalCount - endIndex - 1) * itemHeight)

/** 전체 리스트 높이 */
export const getTotalHeight = (totalCount, itemHeight) => totalCount * itemHeight

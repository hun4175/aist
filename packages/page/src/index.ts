/**
 * @aist/page - SSR HTML 생성, 스트리밍 지원
 *
 * 페이지 렌더는 @aist/server에서 처리.
 * 이 패키지는 레이아웃 적용, 스트리밍 유틸 등 공유 로직.
 */
export const DEFAULT_LAYOUT = (content: string) =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${content}</body></html>`

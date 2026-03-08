import { H1, H2, P } from '../components/index.js'

/** 성능 데모 페이지 - 10만개 가상 스크롤 */
export default () => `
<div>
  <div class="mb-8">
    ${H1('10만개 가상 스크롤 데모')}
    ${P('아래 리스트는 100,000개 아이템을 가상 스크롤로 렌더링합니다. 끊김 없이 스크롤해 보세요.', 'mt-2')}
  </div>
  <virtual-list100k
    total="100000"
    item-height="48"
    overscan="5"
    aria-label="100,000개 아이템 가상 스크롤 리스트"
  ></virtual-list100k>
  <div class="mt-6 text-sm text-slate-400">
    <a href="/tech-pr" class="text-sky-400 hover:underline">← 기술 PR로 돌아가기</a>
  </div>
</div>
`

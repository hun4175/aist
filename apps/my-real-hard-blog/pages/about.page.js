import { H1, H2, H3, P, Code, Badge, SectionHeader } from '../components/index.js'

/** 사이트 소개 페이지 - AIST 프레임워크 설명 */
export default () => `
<div>
  ${SectionHeader('사이트 소개', '이 사이트는 AIST 프레임워크로 구축되었습니다.')}
  
  <section class="mb-12">
    ${H2('AIST란?')}
    ${P('AIST = AI + Stack. AI가 개발하기에 최적화된 풀스택 프레임워크입니다.')}
    <ul class="list-disc list-inside text-slate-400 space-y-2 mt-4">
      <li><strong>토큰 최소화</strong> — 동일 기능 구현 시 가장 적은 토큰으로 결과물 생성</li>
      <li><strong>반복 시도 최소화</strong> — Convention 기반으로 AI 재시도 횟수 감소</li>
    </ul>
  </section>

  <section class="mb-12">
    ${H2('Convention (파일 규칙)')}
    <div class="rounded-lg border border-slate-700 bg-slate-800 p-4 font-mono text-sm overflow-x-auto text-slate-300">
      <div>페이지: <code>경로.page.js</code> → <code>export default (params?) => html</code></div>
      <div>API: <code>경로.메서드.js</code> → <code>export default (req) => json(...)</code></div>
      <div>Island: <code>Name.island.js</code> → Web Component, 태그 <code>&lt;name-island&gt;</code></div>
      <div>Layout: <code>_layout.js</code> → <code>export default (content, ctx?) => html</code></div>
    </div>
  </section>

  <section class="mb-12">
    ${H2('렌더링 전략')}
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        ${Badge({ children: 'SSR', variant: 'info' })}
        ${P('서버 사이드 렌더링 기본', 'inline')}
      </div>
      <div class="flex items-center gap-2">
        ${Badge({ children: 'Island', variant: 'success' })}
        ${P('선택적 hydration — 필요한 인터랙션만 JS 로드', 'inline')}
      </div>
      <div class="flex items-center gap-2">
        ${Badge({ children: 'Prerender', variant: 'default' })}
        ${P('정적 라우트는 HTML 사전 생성 가능', 'inline')}
      </div>
    </div>
  </section>

  <section>
    ${H2('토큰 효율')}
    ${P('동일 게시판 CRUD 기능 기준, AIST는 Next.js 대비 약 17%, Nuxt 대비 약 4% 토큰 절감을 기록했습니다. (js-tiktoken cl100k_base 측정)')}
  </section>
</div>
`

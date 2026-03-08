import { H1, H2, H3, P, Code, Badge, Button } from '../components/index.js'
import { SectionHeader, MetricCard } from '../components/index.js'

/** 기술 PR 페이지 - 성능 데모 링크 및 설계 요약 */
export default () => `
<div>
  ${SectionHeader('기술 PR', '성능·렌더링 최적화 실증')}
  
  <section class="mb-12">
    ${H2('실제 산출물: 10만개 가상 스크롤 데모')}
    ${P('10만개 DOM을 직접 렌더링하면 브라우저가 멈춥니다. 가상 스크롤(Windowing)으로 뷰포트 주변만 렌더링해 끊김 없는 스크롤을 구현했습니다.')}
    <div class="mt-6">
      ${Button({ href: '/perf-100k', variant: 'primary', children: '성능 데모 보기 →' })}
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      ${MetricCard('총 데이터', '100,000', '아이템 수')}
      ${MetricCard('실제 DOM', '~30', '뷰포트 + overscan')}
      ${MetricCard('Overscan', '5', '위·아래 버퍼')}
    </div>
  </section>

  <section class="mb-12">
    ${H2('설계 원칙')}
    <ul class="list-disc list-inside text-slate-400 space-y-2">
      <li><strong>순수 함수</strong> — getVisibleRange, getSpacerTop 등 부수효과 없음</li>
      <li><strong>Island</strong> — 스크롤/렌더 로직만 클라이언트, 나머지는 SSR</li>
      <li><strong>Atomic Design</strong> — Atoms/Molecules/Organisms로 컴포넌트 분리</li>
    </ul>
  </section>

  <section class="mb-12">
    ${H2('렌더링 아키텍처')}
    ${P('SSR 기본 + Island 선택적 hydration. 페이지에서 사용된 island 태그만 스크립트 주입되어 JS 전달량이 최소화됩니다.')}
  </section>

  <section>
    ${H2('배포')}
    ${P('Vercel Git Integration으로 main 브랜치 푸시 시 자동 배포됩니다.')}
  </section>
</div>
`

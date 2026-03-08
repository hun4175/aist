import { H1, P } from '../components/index.js'

const POSTS = [
  {
    title: 'AIST 프레임워크 소개',
    excerpt: 'AI가 개발하기에 최적화된 풀스택 프레임워크의 핵심 개념을 소개합니다.',
    content: `
      <p>AIST는 AI + Stack의 약자로, AI가 코드를 생성할 때 토큰 효율과 Convention 기반 구조를 중시합니다.</p>
      <p>주요 특징으로는 <strong>파일 규칙</strong>(경로.page.js, 경로.메서드.js), <strong>Island 아키텍처</strong>, <strong>SSR 기본</strong>이 있습니다.</p>
      <p>동일 기능 구현 시 Next.js 대비 약 17%, Nuxt 대비 약 4% 토큰 절감을 기록했습니다.</p>
    `
  },
  {
    title: '가상 스크롤 구현기',
    excerpt: '10만개 아이템을 끊김 없이 스크롤하는 Windowing 기법을 적용한 경험을 공유합니다.',
    content: `
      <p>10만개 DOM을 직접 렌더링하면 브라우저가 멈춥니다. 가상 스크롤(Windowing)으로 뷰포트 주변만 렌더링해 해결했습니다.</p>
      <p><strong>핵심 함수</strong>: getVisibleRange, getSpacerTop, getSpacerBottom</p>
      <p>실제 DOM은 약 30개만 유지하면서 100,000개 아이템을 자연스럽게 스크롤할 수 있습니다.</p>
    `
  },
  {
    title: 'Atomic Design 적용',
    excerpt: 'Atoms, Molecules, Organisms로 컴포넌트를 분리한 구조 설계를 소개합니다.',
    content: `
      <p>Atomic Design은 UI를 원자 단위부터 조합하는 방법론입니다.</p>
      <p><strong>Atoms</strong>: Button, Badge, Typography</p>
      <p><strong>Molecules</strong>: NavLink, MetricCard, SectionHeader</p>
      <p><strong>Organisms</strong>: NavBar</p>
      <p>이 구조로 재사용성과 유지보수성을 높였습니다.</p>
    `
  },
  {
    title: '다크 테마 적용기',
    excerpt: '전역 다크 테마 전환과 GNB selected 상태 개선 과정을 정리합니다.',
    content: `
      <p>홈페이지만 다크였던 구조를 전체 페이지로 확장했습니다.</p>
      <p>팔레트: slate-900 배경, slate-100/200/300 텍스트, sky-400 강조</p>
      <p>GNB는 pill 스타일 selected 상태와 aria-current="page"로 접근성을 확보했습니다.</p>
    `
  },
  {
    title: 'TypeScript 마이그레이션',
    excerpt: '점진적 타입 적용과 strict 모드 도입 경험을 공유합니다.',
    content: `
      <p>JavaScript 프로젝트를 TypeScript로 마이그레이션했습니다.</p>
      <p>allowJs와 checkJs로 점진적 전환 후 strict 모드를 적용했습니다.</p>
      <p>타입 정의로 런타임 에러를 사전에 줄일 수 있었습니다.</p>
    `
  },
  {
    title: '성능 최적화 노트',
    excerpt: 'LCP, CLS 개선을 위한 이미지 최적화와 레이아웃 고정 전략.',
    content: `
      <p>Core Web Vitals 개선을 목표로 성능 최적화를 진행했습니다.</p>
      <p>이미지 lazy loading, aspect-ratio 지정으로 CLS를 개선했습니다.</p>
      <p>폰트 preload와 critical CSS 추출로 LCP를 단축했습니다.</p>
    `
  },
  {
    title: 'API 설계 원칙',
    excerpt: 'RESTful API 설계 시 일관성과 확장성을 고려한 패턴 정리.',
    content: `
      <p>REST API 설계 시 리소스 중심 네이밍과 HTTP 메서드 활용을 원칙으로 했습니다.</p>
      <p>페이지네이션은 cursor 기반으로 구현해 대용량 데이터에 대응했습니다.</p>
      <p>에러 응답 형식을 통일해 클라이언트 처리 로직을 단순화했습니다.</p>
    `
  },
  {
    title: '테스트 자동화',
    excerpt: 'Vitest와 Playwright로 단위·E2E 테스트 파이프라인 구축.',
    content: `
      <p>Vitest로 단위 테스트, Playwright로 E2E 테스트를 구성했습니다.</p>
      <p>CI에서 PR 시 자동으로 테스트가 실행되도록 설정했습니다.</p>
      <p>스냅샷 테스트는 UI 변경 시에만 업데이트하도록 가이드를 정리했습니다.</p>
    `
  },
  {
    title: '모노레포 구조',
    excerpt: 'pnpm workspace로 패키지 관리와 의존성 공유 전략.',
    content: `
      <p>pnpm workspace를 사용해 모노레포 구조를 구성했습니다.</p>
      <p>공통 컴포넌트와 유틸은 packages에, 앱은 apps에 분리했습니다.</p>
      <p>changesets로 버전 관리와 릴리즈를 자동화했습니다.</p>
    `
  },
  {
    title: '접근성 개선',
    excerpt: '키보드 네비게이션과 스크린 리더 지원을 위한 ARIA 적용.',
    content: `
      <p>키보드만으로 모든 기능을 사용할 수 있도록 tabindex와 focus 스타일을 정리했습니다.</p>
      <p>버튼과 링크에 aria-label을 추가해 스크린 리더 사용성을 높였습니다.</p>
      <p>색상 대비를 WCAG AA 기준에 맞춰 조정했습니다.</p>
    `
  },
  {
    title: '에러 바운더리',
    excerpt: 'React Error Boundary 패턴과 폴백 UI 설계.',
    content: `
      <p>에러 바운더리를 활용해 컴포넌트 트리 일부의 예외를 격리했습니다.</p>
      <p>폴백 UI에서 재시도 버튼과 에러 로깅을 제공했습니다.</p>
      <p>중요한 경로마다 별도 바운더리를 두어 전체 크래시를 방지했습니다.</p>
    `
  }
]

/** 블로그 페이지 - 카드형 글 목록, hover Tilt3D, click 시 뒤집기+확장 */
export default () => `
<div>
  <div class="mb-10">
    ${H1('블로그')}
    ${P('글을 클릭하면 카드가 뒤집히며 본문이 위에 오버레이로 표시됩니다.', 'mt-2')}
  </div>
  <div class="flex flex-wrap gap-6 w-full">
    ${POSTS.map((p) => `
      <blog-card title="${p.title.replace(/"/g, '&quot;')}" excerpt="${p.excerpt.replace(/"/g, '&quot;')}" tabindex="0" role="article" aria-label="${p.title.replace(/"/g, '&quot;')}">
        ${p.content.trim()}
      </blog-card>
    `).join('')}
  </div>
</div>
`

# Aist - AI 최적화 풀스택 프레임워크

<p align="center">
  <img src="assets/logo.svg" alt="AIST" width="200" />
</p>

AI가 개발하기에 최적화된 풀스택 프레임워크. 토큰 최소화, 반복 시도 최소화.

## 설치

```bash
pnpm install
pnpm -r build
```

## 실행

```bash
pnpm dev
# 또는
pnpm --filter example dev
```

브라우저에서 http://localhost:3000 접속.

## 패키지 구조

| 패키지 | 설명 |
|--------|------|
| `@aist/router` | pages/ 스캔, convention 라우팅 |
| `@aist/page` | SSR 기본 레이아웃 |
| `@aist/server` | 미들웨어, API, 정적 파일, 페이지 서빙 |
| `@aist/validator` | export/시그니처 검증 |
| `@aist/vite` | Vite 플러그인 (검증 훅) |
| `create-aist-app` | 프로젝트 scaffolding |
| `example` | 통합 예제 앱 |

## Convention (파일 규칙)

| 구분 | 파일 형식 | 시그니처 | 예시 |
|------|-----------|----------|------|
| **페이지** | `경로.page.js` | `export default (params?) => \`html\`` | `posts/[id].page.js` → `/posts/:id`, `params.id` |
| **API** | `경로.메서드.js` | `export default (req) => json(...)` | `users.[id].get.js` → `GET /api/users/:id`, `req.params.id` |
| **Island** | `ComponentName.island.js` | Web Component, HTML 태그는 **kebab-case** | `ClickCounter.island.js` → `<click-counter>` |
| **Layout** | `_layout.js` | `export default (content, ctx?) => html` | `ctx.path`, `ctx.csrfToken` |
| **404/500** | `404.page.js`, `500.page.js` | 동일 시그니처, 라우트 제외 | 예약 파일 |

**전역 (import 불필요)**: API/페이지에서 `json`, `redirect`, `each`, `$if` 바로 사용.

```js
// pages/posts/[id].page.js - 동적 페이지
export default (params) => `<article>Post ${params.id}</article>`

// api/users.[id].get.js - 동적 API
export default (req) => json({ id: req.params?.id, name: 'User' })

// pages/posts/ClickCounter.island.js - Island (태그: <click-counter>)
import { reactive, effect } from '@aist/island'
// ... customElements.define('click-counter', ...)
```

## 새 프로젝트 생성

```bash
pnpm create aist-app my-app
cd my-app
pnpm install
pnpm dev
```

> `@aist/server`가 npm에 배포되지 않은 경우, `examples/example`을 참고하거나 monorepo 내에서 작업하세요.

## 예제 앱 라우트

- `/` - Welcome
- `/about` - About
- `/posts` - Posts 목록
- `/posts/123` - Post 상세 (동적)
- `GET /api/users` - 사용자 JSON
- `GET /api/users/456` - 사용자 상세 (동적)

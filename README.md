# Aist - AI 최적화 풀스택 프레임워크

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

# my-real-hard-blog

AIST 기반 소개 사이트. 자기소개, 사이트 소개(AIST), 기술 PR(성능 데모) 페이지 포함.

## 실행

```bash
# 워크스페이스 루트에서
pnpm install
pnpm -r build
pnpm dev:blog
# 또는 앱 디렉터리에서
cd apps/my-real-hard-blog && pnpm dev
```

> `@aist/server` 사용: predev에서 `scripts/link-workspace.js`가 워크스페이스 패키지를 `node_modules`에 링크합니다. (pnpm이 apps/* node_modules를 생성하지 않는 환경 대응)

## 빌드

```bash
# Node 어댑터
pnpm --filter my-real-hard-blog build

# Vercel 어댑터 (api/index.js, vercel.json 생성)
pnpm --filter my-real-hard-blog build:vercel
```

## Vercel 배포 (Git 연동)

1. [Vercel](https://vercel.com)에서 저장소 Import
2. **Root Directory**: `apps/my-real-hard-blog`
3. **Framework Preset**: Other
4. **Build Command**: `pnpm install && pnpm build:vercel`

> monorepo: Root Directory를 `apps/my-real-hard-blog`로 두면 해당 폴더가 프로젝트 루트로 취급됩니다. `@aist/*` 패키지는 워크스페이스 루트에 있으므로, Vercel 빌드 시 상위 패키지가 없다는 오류가 나면 **Root Directory를 비우고** 아래처럼 설정하세요:
> - **Build Command**: `pnpm install && pnpm --filter my-real-hard-blog build:vercel`

## 페이지

- `/` — 자기소개
- `/about` — 사이트 소개 (AIST 설명)
- `/tech-pr` — 기술 PR (성능 데모 링크)
- `/perf-100k` — 10만개 가상 스크롤 데모

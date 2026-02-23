# 토큰 측정 결과

AI가 동일한 기능을 구현할 때 프레임워크별로 소비되는 **출력 토큰**을 측정한 결과입니다.

## 측정 개요

| 항목 | 내용 |
|------|------|
| **측정 도구** | js-tiktoken (cl100k_base) |
| **측정 대상** | AI가 생성한 코드의 출력 토큰 수 |
| **기능 범위** | 게시판 CRUD (목록, 등록, 수정, 삭제) |
| **컨텍스트** | README, Convention 문서 |

## 결과 요약

| 프레임워크 | 출력 토큰 | 비고 |
|------------|----------|------|
| **AIST** | **2,262** | 최소 |
| **Nuxt** | 2,359 | |
| **Next.js** | 2,720 | |

- AIST가 **가장 적은 토큰**으로 동일 기능 구현
- Next.js 대비 AIST는 약 **17% 토큰 절감**
- Nuxt 대비 AIST는 약 **4% 토큰 절감**

## 구현 상세

### AIST

- **위치**: `test-template-app/`
- **파일 구성**:
  - `lib/posts.js` — 데이터 로직
  - `api/posts.*.js` — API 엔드포인트
  - `pages/posts/*.page.js` — 페이지

### Next.js

- **위치**: `comparison/bulletin-next/`
- **파일 구성**:
  - `lib/posts.js` — 데이터 로직
  - `pages/api/posts/*.ts` — API 핸들러
  - `pages/posts/*.tsx` — 페이지

### Nuxt

- **위치**: `comparison/bulletin-nuxt/`
- **파일 구성**:
  - `server/utils/posts.js` — 데이터 로직
  - `server/api/posts/*.ts` — API 핸들러
  - `app/pages/posts/*.vue` — 페이지

## 결론

AIST는 **토큰 최소화** 목표에 부합하며, Convention-only 라우팅·API, 최소 보일러플레이트 설계가 AI 생성 시 코드량을 줄이는 데 기여함.

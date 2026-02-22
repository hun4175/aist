# {{name}}

Aist 기반 앱. Convention만 따르면 됨.

## 실행

```bash
pnpm install
pnpm dev
```

http://localhost:3000

## 빌드

```bash
pnpm build
```

`.output/` 폴더에 Node 배포용 결과물 생성. `node .output/server.js` 로 실행.

## 테스트

```bash
pnpm test
```

페이지, API, 미들웨어 Convention 검증.

## Convention (파일 규칙)

| 구분 | 파일 | 시그니처 |
|------|------|----------|
| 페이지 | `경로.page.js` | `export default (params?) => \`html\`` |
| API | `경로.메서드.js` | `export default (req) => json(...)`, `req.params.id` |
| Island | `Name.island.js` | 태그 `<name-island>` (kebab) |
| Layout | `_layout.js` | `export default (content, ctx?) => html` |

`json`, `redirect`, `each`, `$if` — import 불필요.

# {{name}}

Aist 기반 앱. Convention만 따르면 됨.

## 실행

```bash
pnpm install
pnpm dev
```

http://localhost:3000

## Convention (파일 규칙)

| 구분 | 파일 | 시그니처 |
|------|------|----------|
| 페이지 | `경로.page.js` | `export default (params?) => \`html\`` |
| API | `경로.메서드.js` | `export default (req) => json(...)`, `req.params.id` |
| Island | `Name.island.js` | 태그 `<name-island>` (kebab) |
| Layout | `_layout.js` | `export default (content, ctx?) => html` |

`json`, `redirect`, `each`, `$if` — import 불필요.

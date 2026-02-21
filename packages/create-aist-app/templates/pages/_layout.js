/** Root layout. ctx.path for meta, ctx.csrfToken for forms. */
export default (content, ctx = {}) => {
  const path = ctx.path || '/'
  const title = path === '/' ? 'Aist' : `Aist - ${path}`
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <nav style="padding:1rem 2rem;border-bottom:1px solid #e5e7eb;">
    <a href="/" style="margin-right:1rem;color:#0ea5e9;text-decoration:none;">Home</a>
    <a href="/about" style="color:#6b7280;text-decoration:none;">About</a>
  </nav>
  <main>${content}</main>
</body>
</html>`
}

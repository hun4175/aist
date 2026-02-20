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
  <nav>
    <a href="/">Home</a> | <a href="/about">About</a> | <a href="/posts">Posts</a>
  </nav>
  <main>${content}</main>
  <script>
    document.querySelectorAll('form[data-csrf]').forEach(f => {
      const meta = document.querySelector('meta[name="csrf-token"]')
      if (meta && !f.querySelector('input[name="_csrf"]')) {
        const inp = document.createElement('input'); inp.type='hidden'; inp.name='_csrf'; inp.value=meta.content
        f.appendChild(inp)
      }
    })
  </script>
</body>
</html>`
}

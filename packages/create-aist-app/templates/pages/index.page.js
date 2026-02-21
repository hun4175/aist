export default () => `
<div style="min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;font-family:system-ui,-apple-system,sans-serif;text-align:center;">
  <img src="/logo.svg" alt="Aist" width="160" height="160" style="margin-bottom:1.5rem;" />
  <h1 style="font-size:2.5rem;font-weight:700;margin:0 0 0.5rem;color:#0f172a;">Welcome to Aist</h1>
  <p style="font-size:1.125rem;color:#64748b;margin:0 0 2rem;max-width:32rem;">
    AI 최적화 풀스택 프레임워크. Convention만 따르면 됩니다.
  </p>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">
    <a href="/about" style="display:inline-block;padding:0.75rem 1.5rem;background:#0ea5e9;color:white;border-radius:0.5rem;text-decoration:none;font-weight:500;">Get Started</a>
    <a href="/api/users" style="display:inline-block;padding:0.75rem 1.5rem;border:1px solid #e5e7eb;color:#374151;border-radius:0.5rem;text-decoration:none;font-weight:500;">API 예제</a>
  </div>
  <p style="margin-top:2rem;font-size:0.875rem;color:#94a3b8;">
    <code style="background:#f1f5f9;padding:0.25rem 0.5rem;border-radius:0.25rem;">pnpm dev</code> 로 실행 중
  </p>
</div>
`

/** POST /api/posts - CSRF 검증 통과 시만 실행됨 */
export default () => json({ ok: true, msg: 'Post created (CSRF valid)' })

export default () => `<div>
  <h1>About</h1>
  <form data-csrf action="/api/posts" method="post">
    <button type="submit">Test CSRF POST</button>
  </form>
</div>`

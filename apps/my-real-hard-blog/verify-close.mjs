import puppeteer from 'puppeteer'

const sleep = ms => new Promise(r => setTimeout(r, ms))

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.goto('http://localhost:3001/blog', { waitUntil: 'networkidle0' })

const openOverlay = async () => {
  await page.click('blog-card')
  await sleep(400)
}

const isOverlayOpen = () =>
  page.evaluate(() => !!document.querySelector('[data-overlay]:not([hidden])'))

const isOverlayClosed = () =>
  page.evaluate(() => Array.from(document.querySelectorAll('[data-overlay]')).every(o => o.hidden))

// 테스트 1: × 버튼
await openOverlay()
if (!(await isOverlayOpen())) {
  console.error('FAIL: 오버레이가 열리지 않음')
  process.exit(1)
}
await page.click('[data-close]')
await sleep(200)
if (!(await isOverlayClosed())) {
  console.error('FAIL: × 버튼 닫기 동작 안 함')
  process.exit(1)
}
console.log('PASS: × 버튼 닫기')

// 테스트 2: Escape
await openOverlay()
await page.keyboard.press('Escape')
await sleep(200)
if (!(await isOverlayClosed())) {
  console.error('FAIL: Escape 닫기 동작 안 함')
  process.exit(1)
}
console.log('PASS: Escape 닫기')

console.log('\n닫기 기능 정상 동작 (× 버튼, Escape)')
await browser.close()
process.exit(0)

import { chromium } from 'playwright-core'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.QA_BASE || 'http://127.0.0.1:4173/'
const SHOT_DIR =
  process.env.QA_DIR ||
  join('C:/Users/zbw45/.codex/visualizations/2026/08/25/01a03901-a366-7c33-9bcb-1d1c0663da2b', 'qa')

mkdirSync(SHOT_DIR, { recursive: true })

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--disable-dev-shm-usage', '--no-sandbox'],
})

const report = { errors: [], warnings: [], chapters: [] }

function attachDiagnostics(page, tag) {
  page.on('pageerror', (e) => report.errors.push(`${tag} pageerror: ${e.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') report.errors.push(`${tag} console.error: ${msg.text()}`)
  })
}

async function newPage(context, tag) {
  const page = await context.newPage()
  attachDiagnostics(page, tag)
  await page.goto(BASE, { waitUntil: 'networkidle' })
  return page
}

async function checkNoHorizontalOverflow(page, tag) {
  const data = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    winW: window.innerWidth,
  }))
  if (data.docW > data.winW + 2) {
    report.warnings.push(`${tag}: horizontal overflow doc=${data.docW} win=${data.winW}`)
  }
}

const CHAPTERS = ['第一章', '第二章', '第三章', '第四章', '第五章', '第六章']

// ---------- Desktop: all chapters ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await newPage(context, 'desktop')
  await page.waitForSelector('.cf-node', { timeout: 8000 })

  for (const label of CHAPTERS) {
    await page.locator('.chapter-tab', { hasText: label }).click()
    await page.waitForTimeout(400)
    await page.waitForSelector('.cf-node', { timeout: 5000 })
    const nodes = await page.locator('.cf-node').count()
    await checkNoHorizontalOverflow(page, `desktop-${label}`)
    await page.screenshot({ path: join(SHOT_DIR, `desktop-${label}-map.png`) })

    await page.locator('.cf-node').first().click()
    await page.locator('.panel').waitFor({ timeout: 5000 })
    const formulas = await page.locator('.formula-item .katex').count()
    const examples = await page.locator('.example').count()
    const katexErrors = await page.locator('.katex-error').count()
    if (katexErrors > 0) {
      report.errors.push(`desktop-${label}: ${katexErrors} 处公式渲染失败（.katex-error）`)
    }
    const problems = await page.locator('.problem-summary').count()
    let branches = 0
    if (problems > 0) {
      await page.locator('.problem-summary').first().click()
      // 一个知识点可以有多个题型：折叠的 details 内容仍然留在 DOM 里，必须锁定第一棵决策树
      const tree = page.locator('.dt').first()
      await tree.waitFor({ timeout: 5000 })
      branches = await tree.locator('.dt-branch').count()
    }
    report.chapters.push({ label, nodes, formulas, examples, branches })
    await page.screenshot({ path: join(SHOT_DIR, `desktop-${label}-detail.png`) })
  }
  await context.close()
}

// ---------- Formula search: desktop ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await newPage(context, 'search-desktop')
  const input = page.locator('.formula-search-input')
  await input.fill('泰勒公式')
  await page.locator('.formula-search-result').first().waitFor({ timeout: 5000 })
  const resultCount = await page.locator('.formula-search-result').count()
  const firstResult = await page.locator('.formula-search-result-name').first().textContent()
  await page.screenshot({ path: join(SHOT_DIR, 'search-desktop.png') })
  await page.locator('.formula-search-result').first().click()
  await page.locator('.panel').waitFor({ timeout: 5000 })
  await page.waitForTimeout(450)
  report.searchDesktop = {
    resultCount,
    firstResult,
    selectedConcept: await page.locator('.panel-title').textContent(),
    activeChapter: await page.locator('.chapter-tab.active').textContent(),
    highlightedFormulas: await page.locator('.formula-item.is-target').count(),
  }
  await page.screenshot({ path: join(SHOT_DIR, 'search-detail.png') })
  await context.close()
}

// ---------- Mobile ----------
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    deviceScaleFactor: 2,
  })
  const page = await newPage(context, 'mobile')
  await page.waitForSelector('.cf-node', { timeout: 8000 })
  await checkNoHorizontalOverflow(page, 'mobile')

  await page.locator('.view-btn', { hasText: '章节索引' }).click()
  await page.waitForSelector('.index-item', { timeout: 5000 })
  await page.screenshot({ path: join(SHOT_DIR, 'mobile-index.png') })
  await page.locator('.index-item').first().click()
  await page.locator('.detail.open .panel').waitFor({ timeout: 5000 })
  const katexCount = await page.locator('.formula-item .katex').count()
  report.mobileFormulas = katexCount
  await page.screenshot({ path: join(SHOT_DIR, 'mobile-detail.png') })
  await context.close()
}

// ---------- Formula search: mobile ----------
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    deviceScaleFactor: 2,
  })
  const page = await newPage(context, 'search-mobile')
  const input = page.locator('.formula-search-input')
  await input.fill('渐近线')
  await page.locator('.formula-search-result').first().waitFor({ timeout: 5000 })
  const overflow = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    winW: window.innerWidth,
  }))
  report.searchMobile = {
    resultCount: await page.locator('.formula-search-result').count(),
    firstResult: await page.locator('.formula-search-result-name').first().textContent(),
    horizontalOverflow: overflow.docW > overflow.winW + 2,
  }
  await page.screenshot({ path: join(SHOT_DIR, 'search-mobile.png') })
  await page.locator('.formula-search-result').first().click()
  await page.locator('.detail.open .panel').waitFor({ timeout: 5000 })
  await page.waitForTimeout(450)
  report.searchMobile.selectedConcept = await page.locator('.panel-title').textContent()
  report.searchMobile.highlightedFormulas = await page.locator('.formula-item.is-target').count()
  await page.screenshot({ path: join(SHOT_DIR, 'search-mobile-detail.png') })
  await context.close()
}

await browser.close()
writeFileSync(join(SHOT_DIR, 'qa-report.json'), JSON.stringify(report, null, 2))
console.log('QA_REPORT', JSON.stringify(report, null, 2))
console.log('SHOTS', SHOT_DIR)
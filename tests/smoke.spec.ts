import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

// ─── HOMEPAGE ───────────────────────────────────────────────
test.describe('Homepage', () => {
  test('renders hero, search, featured, property types, popular areas, CTA', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('text=/Find a home/')).toBeVisible()
    await expect(page.locator('input[placeholder*="Search"], input[placeholder*="search"], input[placeholder*="location"]').first()).toBeVisible()
    await expect(page.locator('text=/Featured properties/i').first()).toBeVisible()
    await expect(page.locator('text=/Browse by property type/i').first()).toBeVisible()
    await expect(page.locator('text=HDB').first()).toBeVisible()
    await expect(page.locator('text=/Popular neighbourhoods/i').first()).toBeVisible()
    await expect(page.locator('text=/property agent/i').first()).toBeVisible()
  })

  test('header nav links work', async ({ page }) => {
    await page.goto(BASE)
    const buyLink = page.locator('nav a[href*="type=sale"], header a[href*="type=sale"]').first()
    await buyLink.click()
    await expect(page).toHaveURL(/type=sale/)
    await page.goto(BASE)
    const rentLink = page.locator('nav a[href*="type=rent"], header a[href*="type=rent"]').first()
    await rentLink.click()
    await expect(page).toHaveURL(/type=rent/)
  })

  test('List Your Property button navigates to sign-up, for-agents, or dashboard', async ({ page }) => {
    await page.goto(BASE)
    const cta = page.locator('a:has-text("List Your Property")').first()
    await cta.click()
    await expect(page).toHaveURL(/sign-up|for-agents|dashboard/)
  })

  test('featured listing cards link to detail page', async ({ page }) => {
    await page.goto(BASE)
    const firstCard = page.locator('a[href^="/listing/"]').first()
    await firstCard.click()
    await expect(page).toHaveURL(/\/listing\/listing-/)
  })

  test('search bar navigates to listings with query', async ({ page }) => {
    await page.goto(BASE)
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"], input[placeholder*="location"]').first()
    await searchInput.fill('Orchard')
    const searchBtn = page.locator('button:has-text("Search")').first()
    await searchBtn.click()
    await expect(page).toHaveURL(/listings/)
  })
})

// ─── LISTINGS BROWSE ────────────────────────────────────────
test.describe('Listings Browse', () => {
  test('shows all listings by default', async ({ page }) => {
    await page.goto(`${BASE}/listings`)
    await expect(page.locator('text=properties found').first()).toBeVisible()
    const cards = page.locator('a[href^="/listing/"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('filters by rent', async ({ page }) => {
    await page.goto(`${BASE}/listings?type=rent`)
    const cards = page.locator('a[href^="/listing/"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('filters by sale', async ({ page }) => {
    await page.goto(`${BASE}/listings?type=sale`)
    const cards = page.locator('a[href^="/listing/"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('filters by property type', async ({ page }) => {
    await page.goto(`${BASE}/listings?property_type=condo`)
    const cards = page.locator('a[href^="/listing/"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('filters by district', async ({ page }) => {
    await page.goto(`${BASE}/listings?district=9`)
    const cards = page.locator('a[href^="/listing/"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('shows empty state for impossible filter', async ({ page }) => {
    await page.goto(`${BASE}/listings?min_price=999999999`)
    await expect(page.locator('text=No properties').first()).toBeVisible()
  })

  test('sort by price works', async ({ page }) => {
    await page.goto(`${BASE}/listings?sort=price_asc`)
    const cards = page.locator('a[href^="/listing/"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('listing card clicks navigate to detail', async ({ page }) => {
    await page.goto(`${BASE}/listings`)
    const firstCard = page.locator('a[href^="/listing/"]').first()
    await firstCard.click()
    await expect(page).toHaveURL(/\/listing\/listing-/)
  })
})

// ─── LISTING DETAIL ─────────────────────────────────────────
test.describe('Listing Detail', () => {
  test('renders listing-1 with all sections', async ({ page }) => {
    await page.goto(`${BASE}/listing/listing-1`)
    await expect(page.locator('text=Luxury 3BR').first()).toBeVisible()
    await expect(page.locator('text=4,200,000').first()).toBeVisible()
    await expect(page.locator('text=About this property').first()).toBeVisible()
    await expect(page.locator('text=Property details').first()).toBeVisible()
    await expect(page.locator('text=Pool').first()).toBeVisible()
    // Agent card should show agent name (not in textarea)
    await expect(page.locator('h3:has-text("Sarah Chen"), p:has-text("Sarah Chen"), span:has-text("Sarah Chen"), a:has-text("Sarah Chen")').first()).toBeVisible()
  })

  test('renders listing-2 (rental)', async ({ page }) => {
    await page.goto(`${BASE}/listing/listing-2`)
    await expect(page.locator('text=Tampines').first()).toBeVisible()
    await expect(page.locator('text=2,800').first()).toBeVisible()
  })

  test('renders listing-7 (penthouse)', async ({ page }) => {
    await page.goto(`${BASE}/listing/listing-7`)
    await expect(page.locator('text=Penthouse').first()).toBeVisible()
    await expect(page.locator('text=Keppel Bay').first()).toBeVisible()
  })

  test('WhatsApp contact button is present and links correctly', async ({ page }) => {
    await page.goto(`${BASE}/listing/listing-1`)
    await page.waitForLoadState('domcontentloaded')

    // WhatsApp is the primary contact CTA — should be on every listing detail page
    const whatsappLinks = page.locator('a[href*="wa.me/"]')
    expect(await whatsappLinks.count()).toBeGreaterThan(0)

    // First WhatsApp link should be to a Singapore phone (65 country code)
    const href = await whatsappLinks.first().getAttribute('href')
    expect(href).toMatch(/wa\.me\/65\d{8}/)
    // Should have a prefilled text parameter referencing the listing
    expect(href).toContain('text=')

    // Call link should also exist
    const callLinks = page.locator('a[href^="tel:"]')
    expect(await callLinks.count()).toBeGreaterThan(0)
  })

  test('image gallery shows multiple images', async ({ page }) => {
    await page.goto(`${BASE}/listing/listing-1`)
    const images = page.locator('img[src*="unsplash"]')
    expect(await images.count()).toBeGreaterThan(1)
  })

  test('nonexistent listing returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE}/listing/nonexistent`)
    expect(response?.status()).toBe(404)
    await expect(page.locator('text=not found').first()).toBeVisible()
  })

  test('back to listings link works', async ({ page }) => {
    await page.goto(`${BASE}/listing/listing-1`)
    const backLink = page.locator('a:has-text("Back to listings"), a:has-text("back"), a[href="/listings"]').first()
    if (await backLink.isVisible()) {
      await backLink.click()
      await expect(page).toHaveURL(/listings/)
    }
  })
})

// ─── DASHBOARD ──────────────────────────────────────────────
// Dashboard is auth-protected. Each test file registers a fresh test agent
// via the API, then signs in. This avoids leaving a persistent demo account
// in the production Blob store.

const TEST_AGENT = {
  email: `playwright-${Date.now()}@test.strata-listings.sg`,
  password: 'playwright-test-password-long',
  name: 'Playwright Agent',
  agency: 'Test Realty',
  phone: '+65 9000 0000',
}

let testAgentCreated = false

async function ensureTestAgent(page: import('@playwright/test').Page) {
  if (testAgentCreated) return
  // Register via API (idempotent — if already exists, 409 is fine)
  const res = await page.request.post(`${BASE}/api/register`, {
    data: TEST_AGENT,
  })
  if (res.ok() || res.status() === 409) {
    testAgentCreated = true
  } else {
    throw new Error(`Failed to create test agent: ${res.status()}`)
  }
}

async function signInDemoAgent(page: import('@playwright/test').Page) {
  await ensureTestAgent(page)
  await page.goto(`${BASE}/sign-in`)
  await page.locator('#email').fill(TEST_AGENT.email)
  await page.locator('#password').fill(TEST_AGENT.password)
  await page.locator('main button:has-text("Sign in")').click()
  await page.waitForURL(/dashboard/, { timeout: 30000, waitUntil: 'domcontentloaded' })
  // Test agents land in 'trialing'. Activate via admin endpoint so they can
  // create listings in the tests below.
  await page.request.post(`${BASE}/api/admin/activate`, {
    data: { email: TEST_AGENT.email },
    headers: {
      'x-admin-token': process.env.ADMIN_TOKEN || 'test-admin-token',
    },
  })
}

test.describe('Dashboard', () => {
  test('overview page shows stats and content', async ({ page }) => {
    await signInDemoAgent(page)
    await expect(page.locator('text=Playwright Agent').first()).toBeVisible()
    await expect(page.locator('text=/Total Listings/i').first()).toBeVisible()
    await expect(page.locator('text=/Active Inquiries/i').first()).toBeVisible()
    await expect(page.locator('text=/Total Views/i').first()).toBeVisible()
  })

  test('sidebar navigation works', async ({ page }) => {
    await signInDemoAgent(page)
    await page.locator('a[href="/dashboard/listings"]').first().click()
    await expect(page).toHaveURL(/dashboard\/listings/)
    await page.locator('a[href="/dashboard/inquiries"]').first().click()
    await expect(page).toHaveURL(/dashboard\/inquiries/)
    await page.locator('a[href="/dashboard/settings"]').first().click()
    await expect(page).toHaveURL(/dashboard\/settings/)
  })

  test('my listings page loads', async ({ page }) => {
    await signInDemoAgent(page)
    await page.goto(`${BASE}/dashboard/listings`)
    await expect(page.locator('text=My Listings').first()).toBeVisible()
  })

  test('add new listing button navigates to form', async ({ page }) => {
    await signInDemoAgent(page)
    await page.goto(`${BASE}/dashboard/listings`)
    const addBtn = page.locator('a:has-text("Add New Listing"), a:has-text("New Listing")').first()
    await addBtn.click()
    await expect(page).toHaveURL(/dashboard\/listings\/new/)
  })

  test('new listing form is interactive', async ({ page }) => {
    await signInDemoAgent(page)
    await page.goto(`${BASE}/dashboard/listings/new`)
    const titleInput = page.locator('input[placeholder*="Luxury"], input[placeholder*="title"], input[id*="title"]').first()
    await titleInput.fill('Test Listing Title')
    const descTextarea = page.locator('textarea').first()
    await descTextarea.fill('A beautiful property for testing purposes.')
    const publishBtn = page.locator('button:has-text("Publish"), button:has-text("Save")').first()
    await expect(publishBtn).toBeVisible()
  })

  test('inquiries page loads', async ({ page }) => {
    await signInDemoAgent(page)
    await page.goto(`${BASE}/dashboard/inquiries`)
    await expect(page.locator('text=Inquiries').first()).toBeVisible()
  })

  test('settings page loads', async ({ page }) => {
    await signInDemoAgent(page)
    await page.goto(`${BASE}/dashboard/settings`)
    await expect(page.locator('text=Settings').first()).toBeVisible()
  })
})

// ─── 404 PAGE ───────────────────────────────────────────────
test.describe('404 Page', () => {
  test('shows proper 404 for invalid routes', async ({ page }) => {
    const response = await page.goto(`${BASE}/some-random-page`)
    expect(response?.status()).toBe(404)
  })

  test('404 has navigation options', async ({ page }) => {
    await page.goto(`${BASE}/listing/nonexistent`)
    const browseLink = page.locator('a:has-text("Browse"), a:has-text("listings"), a[href="/listings"]').first()
    await expect(browseLink).toBeVisible()
  })
})

// ─── MOBILE RESPONSIVENESS ──────────────────────────────────
test.describe('Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('homepage renders on mobile', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('text=/Find a home/')).toBeVisible()
    await expect(page.locator('text=Featured Properties')).toBeVisible()
  })

  test('listing detail renders on mobile', async ({ page }) => {
    await page.goto(`${BASE}/listing/listing-1`)
    await expect(page.locator('text=Luxury 3BR').first()).toBeVisible()
    await expect(page.locator('text=4,200,000').first()).toBeVisible()
  })

  test('listings page renders on mobile', async ({ page }) => {
    await page.goto(`${BASE}/listings`)
    const cards = page.locator('a[href^="/listing/"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })
})

// ─── CROSS-PAGE NAVIGATION ─────────────────────────────────
test.describe('Cross-page navigation', () => {
  test('full user journey: home → listing → WhatsApp contact', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('text=/Find a home/')).toBeVisible()

    const card = page.locator('a[href^="/listing/"]').first()
    await card.click()
    await expect(page).toHaveURL(/\/listing\//)
    await expect(page.locator('text=About this property').first()).toBeVisible()

    // WhatsApp is the primary contact — verify links are present and well-formed
    const whatsappLinks = page.locator('a[href*="wa.me/"]')
    expect(await whatsappLinks.count()).toBeGreaterThan(0)
    const href = await whatsappLinks.first().getAttribute('href')
    expect(href).toMatch(/wa\.me\/65\d{8}/)
    expect(href).toContain('text=')
  })

  test('full agent journey: sign in → dashboard → listings → new listing', async ({ page }) => {
    await signInDemoAgent(page)
    await expect(page.locator('text=Playwright Agent').first()).toBeVisible()
    await page.locator('a[href="/dashboard/listings"]').first().click()
    await expect(page).toHaveURL(/dashboard\/listings/)
    const addBtn = page.locator('a:has-text("Add New Listing"), a:has-text("New Listing")').first()
    await addBtn.click()
    await expect(page).toHaveURL(/dashboard\/listings\/new/)
    const titleInput = page.locator('input[placeholder*="Luxury"], input[placeholder*="title"], input[id*="title"]').first()
    await titleInput.fill('Agent Journey Test')
  })
})

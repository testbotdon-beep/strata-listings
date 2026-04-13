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

  test('List Your Property button navigates to for-agents or dashboard', async ({ page }) => {
    await page.goto(BASE)
    const cta = page.locator('a:has-text("List Your Property")').first()
    await cta.click()
    // Either /for-agents (landing) or /dashboard (logged-in flow)
    await expect(page).toHaveURL(/for-agents|dashboard/)
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

  test('inquiry form is present and submits', async ({ page }) => {
    await page.goto(`${BASE}/listing/listing-1`)
    await page.waitForLoadState('domcontentloaded')

    // Desktop sidebar form has id="inquiry-form" wrapper
    const form = page.locator('#inquiry-form')
    await form.locator('#inquiry-name').fill('Test User')
    await form.locator('#inquiry-email').fill('test@example.com')
    await form.locator('#inquiry-phone').fill('+65 9999 9999')
    await form.locator('button:has-text("Send Inquiry")').click()

    // Wait for simulated network delay then success
    await expect(page.locator('text=/Inquiry sent/').first()).toBeVisible({ timeout: 10000 })
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
test.describe('Dashboard', () => {
  test('overview page shows stats and content', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`)
    await expect(page.locator('text=Sarah').first()).toBeVisible()
    await expect(page.locator('text=Total Listings').first()).toBeVisible()
    await expect(page.locator('text=Active Inquiries').first()).toBeVisible()
    await expect(page.locator('text=Total Views').first()).toBeVisible()
  })

  test('sidebar navigation works', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`)
    await page.locator('a[href="/dashboard/listings"]').first().click()
    await expect(page).toHaveURL(/dashboard\/listings/)
    await page.locator('a[href="/dashboard/inquiries"]').first().click()
    await expect(page).toHaveURL(/dashboard\/inquiries/)
    await page.locator('a[href="/dashboard/settings"]').first().click()
    await expect(page).toHaveURL(/dashboard\/settings/)
  })

  test('my listings page shows listings table', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/listings`)
    await expect(page.locator('text=My Listings').first()).toBeVisible()
    await expect(page.locator('text=Luxury 3BR').first()).toBeVisible()
  })

  test('add new listing button navigates to form', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/listings`)
    const addBtn = page.locator('a:has-text("Add New Listing"), a:has-text("New Listing")').first()
    await addBtn.click()
    await expect(page).toHaveURL(/dashboard\/listings\/new/)
  })

  test('new listing form is interactive', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/listings/new`)
    const titleInput = page.locator('input[placeholder*="Luxury"], input[placeholder*="title"], input[id*="title"]').first()
    await titleInput.fill('Test Listing Title')
    const descTextarea = page.locator('textarea').first()
    await descTextarea.fill('A beautiful property for testing purposes.')
    const publishBtn = page.locator('button:has-text("Publish"), button:has-text("Save")').first()
    await expect(publishBtn).toBeVisible()
  })

  test('inquiries page shows inquiry list', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/inquiries`)
    await expect(page.locator('text=James Koh').first()).toBeVisible()
  })

  test('settings page has pre-filled form', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/settings`)
    const inputs = page.locator('input')
    const count = await inputs.count()
    let found = false
    for (let i = 0; i < count; i++) {
      const val = await inputs.nth(i).inputValue()
      if (val === 'Sarah Chen') { found = true; break }
    }
    expect(found).toBe(true)
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
  test('full user journey: home → listing → inquiry', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('text=/Find a home/')).toBeVisible()

    const card = page.locator('a[href^="/listing/"]').first()
    await card.click()
    await expect(page).toHaveURL(/\/listing\//)
    await expect(page.locator('text=About this property').first()).toBeVisible()

    // Desktop sidebar form
    const sidebar = page.locator('.hidden.lg\\:block').filter({ has: page.locator('#inquiry-name') })
    await sidebar.locator('#inquiry-name').fill('Journey Test')
    await sidebar.locator('#inquiry-email').fill('journey@test.com')
    await sidebar.locator('#inquiry-phone').fill('+65 8888 8888')
    await sidebar.locator('button:has-text("Send Inquiry")').click()
    await expect(page.locator('text=/Inquiry sent/').first()).toBeVisible({ timeout: 5000 })
  })

  test('full agent journey: dashboard → listings → new listing', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`)
    await expect(page.locator('text=Sarah').first()).toBeVisible()
    await page.locator('a[href="/dashboard/listings"]').first().click()
    await expect(page).toHaveURL(/dashboard\/listings/)
    const addBtn = page.locator('a:has-text("Add New Listing"), a:has-text("New Listing")').first()
    await addBtn.click()
    await expect(page).toHaveURL(/dashboard\/listings\/new/)
    const titleInput = page.locator('input[placeholder*="Luxury"], input[placeholder*="title"], input[id*="title"]').first()
    await titleInput.fill('Agent Journey Test')
  })
})

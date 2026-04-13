import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  // Run serially — dev server can't handle parallel requests reliably
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
  },
})

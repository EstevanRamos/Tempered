import { defineConfig, devices } from '@playwright/test'

// The shopper-path test: one walk through what a shopper sees and does, against the running
// Storefront + Vendure stack (`../scripts/dev.sh`). It is the definition of done for every ticket.
// The older specs in tests/ query test IDs that don't exist, so they are not part of this run.
//
//   bunx playwright test -c playwright.shopper.config.ts
//
// SHOPPER_BASE_URL points it at another Storefront; PLAYWRIGHT_CHROMIUM_PATH at a Chromium build
// when Playwright's own isn't installed (cloud sessions have one under /opt/pw-browsers).
export default defineConfig({
	testDir: './tests/shopper-path',
	timeout: 4 * 60 * 1000,
	expect: { timeout: 15_000 },
	fullyParallel: false,
	workers: 1,
	retries: 0,
	reporter: [['list']],
	use: {
		...devices['Desktop Chrome'],
		baseURL: process.env.SHOPPER_BASE_URL ?? 'http://127.0.0.1:3000',
		navigationTimeout: 90_000,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {}
	}
})

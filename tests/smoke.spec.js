const { test, expect } = require('@playwright/test');

const TOTAL = 13;
const INTERACTIVE = { 5: ['#reveal-btn-5'], 10: ['#reveal-btn-q1', '#reveal-btn-q2'] };

async function advanceTo(page, target) {
  for (let i = 1; i < target; i++) {
    for (const sel of INTERACTIVE[i] || []) await page.click(sel);
    await page.click('#nextBtn');
  }
}

test('navigate all 13 slides', async ({ page }) => {
  await page.goto('/');
  for (let i = 1; i <= TOTAL; i++) {
    await expect(page.locator('.slide.active')).toHaveAttribute('id', `slide-${i}`);
    if (i < TOTAL) {
      for (const sel of INTERACTIVE[i] || []) await page.click(sel);
      await page.click('#nextBtn');
    }
  }
});

test('language toggle starts in Chinese and persists across navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#langToggle')).toHaveText('中文');
  await expect(page.locator('#langToggle')).toHaveAttribute('aria-pressed', 'true');
  await page.click('#langToggle');
  await expect(page.locator('#langToggle')).toHaveText('EN');
  await expect(page.locator('#langToggle')).toHaveAttribute('aria-pressed', 'false');
  await page.goto('/resources');
  await expect(page.locator('#langToggle')).toHaveText('EN');
  await expect(page.locator('#langToggle')).toHaveAttribute('aria-pressed', 'false');
});

test('reveal button gates slide 5 advance', async ({ page }) => {
  await page.goto('/');
  await advanceTo(page, 5);
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-5');
  await expect(page.locator('#nextBtn')).toBeDisabled();
  await page.click('#reveal-btn-5');
  await expect(page.locator('#nextBtn')).toBeEnabled();
});

test('quiz slide 10 requires both reveals to advance', async ({ page }) => {
  await page.goto('/');
  await advanceTo(page, 10);
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-10');
  await expect(page.locator('#nextBtn')).toBeDisabled();
  await page.click('#reveal-btn-q1');
  await expect(page.locator('#nextBtn')).toBeDisabled();
  await page.click('#reveal-btn-q2');
  await expect(page.locator('#nextBtn')).toBeEnabled();
});

test('slide-13 link does not advance the deck', async ({ page }) => {
  await page.goto('/');
  await advanceTo(page, TOTAL);
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-13');
  await expect(page.locator('#nextBtn')).toBeDisabled();
});

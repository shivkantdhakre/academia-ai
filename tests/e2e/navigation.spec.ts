import { test, expect } from '@playwright/test';

test.describe('Academia AI Landing Page & Redirects', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check main logo/title text in header or banner
    await expect(page.locator('h1')).toContainText('ACADEMIA');
    
    // Check pricing and login routes are visible
    await expect(page.locator('a[href="/pricing"]').first()).toBeVisible();
    await expect(page.locator('a[href="/login"]').first()).toBeVisible();
  });

  test('should redirect unauthenticated users to login from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Expect redirect rule to login to be fired
    await expect(page).toHaveURL(/\/login/);
  });
});

import { test, expect } from '@playwright/test';

test.describe('Academia AI Landing Page & Redirects', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    
    // Check main logo/title text in header
    await expect(page.locator('header')).toContainText('ACADEMIA AI');
    
    // Check login route is visible
    await expect(page.locator('a[href="/login"]').first()).toBeVisible();
  });

  test('should redirect unauthenticated users to login from dashboard', async ({ page }) => {
    await page.goto('/dashboard', { timeout: 60000 });
    
    // Expect redirect rule to login to be fired
    await expect(page).toHaveURL(/\/login/);
  });
});

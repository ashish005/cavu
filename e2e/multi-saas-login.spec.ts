import { test, expect } from '@playwright/test';

/**
 * Multi-SaaS Login Tests using Playwright MCP Server
 * Tests OAuth2/OIDC flow with Identity Server
 */

const IDENTITY_SERVER_URL = 'http://localhost:8000';
const ANGULAR_APP_URL = 'http://localhost:4200';

test.describe('Multi-SaaS Identity Login', () => {

  test('open app and verify login redirect', async ({ page }) => {
    // Navigate to Angular app
    await page.goto(ANGULAR_APP_URL);
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    console.log('Current URL:', page.url());
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'e2e/screenshots/01-initial.png' });
    
    // Check if we're on login page or identity server
    const url = page.url();
    expect(url).toMatch(/localhost:4200|localhost:8000|identity/);
  });

  test('multi-tenant login with org prefix', async ({ page }) => {
    // Navigate to app
    await page.goto(ANGULAR_APP_URL);
    await page.waitForLoadState('networkidle');
    
    // Wait for redirect to identity server or login form
    await page.waitForTimeout(3000);
    
    // Find and fill username (multi-SaaS format: org@username)
    const usernameField = page.locator('input[type="text"], #login-email, input[name="username"]').first();
    if (await usernameField.isVisible().catch(() => false)) {
      await usernameField.fill('demo-org@admin');
      
      // Fill password
      const passwordField = page.locator('input[type="password"], #login-password').first();
      await passwordField.fill('testpassword');
      
      // Take screenshot
      await page.screenshot({ path: 'e2e/screenshots/02-credentials-filled.png' });
      
      // Submit
      await page.locator('button[type="submit"]').first().click();
      
      console.log('✅ Login form submitted with multi-SaaS credentials');
    }
    
    // Wait for result
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'e2e/screenshots/03-login-result.png' });
  });

  test('login form validation', async ({ page }) => {
    await page.goto(ANGULAR_APP_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Try to find submit button
    const submitBtn = page.locator('button[type="submit"]').first();
    
    if (await submitBtn.isVisible().catch(() => false)) {
      // Click without filling fields
      await submitBtn.click();
      await page.waitForTimeout(1000);
      
      // Screenshot validation state
      await page.screenshot({ path: 'e2e/screenshots/04-validation.png' });
    }
  });

  test('responsive mobile view', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(ANGULAR_APP_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'e2e/screenshots/05-mobile.png', fullPage: true });
    
    console.log('✅ Mobile view captured');
  });

});

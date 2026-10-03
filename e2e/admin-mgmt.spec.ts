import { test, expect } from "@playwright/test";

test.describe("Phase 5: Admin User Management, Question Bank & Accessibility Smoke Tests", () => {
  test("1. Non-admin users are blocked from /admin", async ({ page }) => {
    // 1. Customer blocked
    await page.goto("/login");
    await page.click('button[aria-label="Log in as Demo Customer"]');
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/unauthorized/);

    // 2. CSR blocked
    await page.context().clearCookies();
    await page.goto("/login");
    await page.click('button[aria-label="Log in as Demo CSR"]');
    await expect(page).toHaveURL(/\/review/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/unauthorized/);
  });

  test("2. Admin can create user, view temporary password modal, and safeguards prevent self-deactivation", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[aria-label="Log in as Demo Admin"]');
    await expect(page).toHaveURL(/\/review/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin/);

    // Verify Admin Portal Header
    await expect(page.locator("h1")).toContainText("System Administration & Security");
    await expect(page.locator("text=CORPORATE GOVERNANCE & SECURITY DESK")).toBeVisible();

    // Verify Tab Navigation
    await expect(page.locator("#tab-admin-users")).toBeVisible();
    await expect(page.locator("#tab-admin-questions")).toBeVisible();
    await expect(page.locator("#tab-admin-audit")).toBeVisible();

    // Open Create User Modal
    await page.click("#admin-create-user-btn");
    const createModal = page.locator('div[role="dialog"]');
    await expect(createModal).toBeVisible();

    const uniqueId = Date.now().toString().slice(-4);
    const testEmail = `employee.${uniqueId}@harbingergroup.com`;

    await page.fill("#admin-new-user-name", "Priya Kulkarni");
    await page.fill("#admin-new-user-email", testEmail);
    await page.selectOption("#admin-new-user-role", "CUSTOMER");

    await page.click("#admin-confirm-create-user-btn");

    // Verify Temporary Password Modal appears
    await expect(page.locator("text=Temporary Password Generated")).toBeVisible({ timeout: 8000 });
    await expect(page.locator("text=SINGLE DISCLOSURE NOTICE")).toBeVisible();
    await expect(page.locator("#copy-temp-password-btn")).toBeVisible();

    // Dismiss modal
    await page.click("#close-temp-password-modal-btn");

    // Verify user appears in table
    await expect(page.locator(`text=${testEmail}`)).toBeVisible();

    // Test Safeguard: Admin cannot deactivate own account
    // Find Demo Admin row deactivate button
    const adminRow = page.locator("tr").filter({ hasText: "admin@harbingergroup.com" });
    const deactivateAdminBtn = adminRow.locator('button:has-text("Deactivate")');
    await deactivateAdminBtn.click();

    // Safeguard violation alert should be shown
    await expect(page.locator("text=Safeguard violation: An administrator cannot deactivate their own account.")).toBeVisible();
  });

  test("3. Question Bank displays required starter badge and allows filtering", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[aria-label="Log in as Demo Admin"]');
    await expect(page).toHaveURL(/\/review/);
    await page.goto("/admin");

    // Click Question Bank Tab
    await page.click("#tab-admin-questions");

    // Verify mandatory label "Starter set, pending CSR team approval"
    await expect(page.locator("text=Starter set, pending CSR team approval")).toBeVisible();

    // Verify questions listed
    await expect(page.locator("text=schengen_purpose")).toBeVisible();
    await expect(page.locator("text=usb1_purpose")).toBeVisible();

    // Filter by US Visitor B-1
    await page.click('button:has-text("US Visitor (B-1)")');
    await expect(page.locator("text=usb1_purpose")).toBeVisible();
    await expect(page.locator("text=schengen_purpose")).not.toBeVisible();

    // Reset filter
    await page.click('button:has-text("All Programs")');
    await expect(page.locator("text=schengen_purpose")).toBeVisible();
  });

  test("4. Notification Bell and AI Concierge Modal functionality", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[aria-label="Log in as Demo Customer"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Open Notification Bell
    const bellBtn = page.locator("#notification-bell-btn");
    await expect(bellBtn).toBeVisible();
    await bellBtn.click();

    const notifRegion = page.locator('div[role="region"][aria-label="Notification center"]');
    await expect(notifRegion).toBeVisible();
    await expect(notifRegion.locator("text=Notifications")).toBeVisible();

    // Close bell
    await bellBtn.click();
    await expect(notifRegion).not.toBeVisible();

    // Open AI Concierge from floating button
    const conciergeBtn = page.locator('button[aria-label="Open AI Travel & Visa Concierge"]');
    await expect(conciergeBtn).toBeVisible();
    await conciergeBtn.click();

    // Verify Concierge Modal
    const conciergeDialog = page.locator('div[role="dialog"]');
    await expect(conciergeDialog).toBeVisible();
    await expect(conciergeDialog.locator("text=TravelDesk Concierge")).toBeVisible();

    // Search for Schengen
    const searchInput = conciergeDialog.locator('input[type="text"]');
    await searchInput.fill("Schengen");
    await expect(conciergeDialog.locator("text=Schengen 90/180 Rule Check")).toBeVisible();

    // Close concierge
    await conciergeDialog.locator('button[aria-label="Close concierge"]').click();
    await expect(conciergeDialog).not.toBeVisible();
  });
});

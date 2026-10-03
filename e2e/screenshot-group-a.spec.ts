import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

test.use({
  viewport: { width: 1440, height: 900 },
});

test.describe("Group A Visual QA Capture @ 1440px", () => {
  const outDir = path.join(process.cwd(), "docs", "design", "screenshots_actual");

  test.beforeAll(async () => {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
  });

  test("Capture Landing (/)", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "actual_groupA_landing_1440.png"), fullPage: true });
  });

  test("Capture Login (/login)", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "actual_groupA_login_1440.png"), fullPage: true });

    // Trigger Error state
    await page.fill("#email", "invalid@harbingergroup.com");
    await page.fill("#password", "WrongPass123!");
    await page.click('button[type="submit"]');
    await page.waitForSelector("#login-error-alert", { timeout: 5000 });
    await page.screenshot({ path: path.join(outDir, "actual_groupA_login_error_1440.png"), fullPage: true });
  });

  test("Capture Change Password (/change-password)", async ({ page }) => {
    // Authenticate first so /change-password doesn't redirect to /login
    await page.goto("/login");
    await page.click('button:has-text("Customer")');
    await page.waitForURL("/dashboard", { timeout: 10000 });
    await page.goto("/change-password");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "actual_groupA_change_password_1440.png"), fullPage: true });
  });

  test("Capture 403 Unauthorized (/unauthorized)", async ({ page }) => {
    await page.goto("/unauthorized");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "actual_groupA_unauthorized_1440.png"), fullPage: true });
  });

  test("Capture 404 Not Found (/nonexistent-page-test)", async ({ page }) => {
    await page.goto("/nonexistent-page-test");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "actual_groupA_404_1440.png"), fullPage: true });
  });

  test("Capture Session Expired Modal (?session_expired=true)", async ({ page }) => {
    await page.goto("/?session_expired=true");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "actual_groupA_session_expired_1440.png"), fullPage: true });
  });
});

import { chromium } from "playwright";
import path from "path";

const ARTIFACTS_DIR = "C:\\Users\\Siddharth.Savant\\.gemini\\antigravity-ide\\brain\\25a43763-af19-4441-8e1e-c3ede1cf13e2";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("1. Logging in as Admin...");
  await page.goto("http://localhost:3001/login");
  await page.click('button[aria-label="Log in as Demo Admin"]');
  await page.waitForURL("**/review");

  console.log("2. Navigating to Admin Portal...");
  await page.goto("http://localhost:3001/admin");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "admin_user_management.png"), fullPage: true });

  console.log("3. Opening Question Bank Tab...");
  await page.click("#tab-admin-questions");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "admin_question_bank.png"), fullPage: true });

  console.log("4. Opening Audit Trail Tab...");
  await page.click("#tab-admin-audit");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "admin_audit_trail.png"), fullPage: true });

  console.log("5. Testing Create User & Temp Password Modal...");
  await page.click("#tab-admin-users");
  await page.click("#admin-create-user-btn");
  await page.fill("#admin-new-user-name", "Aarav Deshmukh");
  await page.fill("#admin-new-user-email", `aarav.${Date.now()}@harbingergroup.com`);
  await page.click("#admin-confirm-create-user-btn");
  await page.waitForSelector("#copy-temp-password-btn");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "admin_temp_password_modal.png"), fullPage: true });

  await browser.close();
  console.log("Phase 5 screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Error capturing Phase 5 screenshots:", err);
  process.exit(1);
});

import { chromium } from "playwright";
import path from "path";

const ARTIFACTS_DIR = "C:\\Users\\Siddharth.Savant\\.gemini\\antigravity-ide\\brain\\25a43763-af19-4441-8e1e-c3ede1cf13e2";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("1. Logging in as Customer...");
  await page.goto("http://localhost:3001/login");
  await page.click('button[aria-label="Log in as Demo Customer"]');
  await page.waitForURL("**/dashboard");
  await page.waitForTimeout(1000);

  console.log("2. Capturing Customer Dashboard...");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "customer_dashboard.png"), fullPage: true });

  console.log("3. Navigating to first case or creating one for interview...");
  const resumeBtn = page.locator('text="Resume Interview"').first();
  if (await resumeBtn.isVisible()) {
    await resumeBtn.click();
  } else {
    await page.click("#new-application-btn");
    await page.waitForSelector("#confirm-create-application-btn");
    await page.click("#confirm-create-application-btn");
  }
  await page.waitForURL("**/interview**");
  await page.waitForTimeout(1000);

  console.log("4. Capturing Interview Cockpit...");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "interview_cockpit.png"), fullPage: true });

  console.log("5. Logging out and logging in as CSR...");
  await context.clearCookies();
  await page.goto("http://localhost:3001/login");
  await page.click('button[aria-label="Log in as Demo CSR"]');
  await page.waitForURL("**/review");
  await page.waitForTimeout(1000);

  console.log("6. Capturing CSR Review Cockpit...");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "csr_review_cockpit.png"), fullPage: true });

  // Select the first case in queue to show dossier
  const firstCase = page.locator('button:has-text("HB-2026-")').first();
  if (await firstCase.isVisible()) {
    await firstCase.click();
    await page.waitForTimeout(1000);
    console.log("7. Capturing CSR Dossier Inspection...");
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "csr_dossier_inspection.png"), fullPage: true });
  }

  await browser.close();
  console.log("All Phase 3 screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});

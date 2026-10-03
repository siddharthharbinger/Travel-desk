import { chromium } from "playwright";
import path from "path";

const ARTIFACTS_DIR = "C:\\Users\\Siddharth.Savant\\.gemini\\antigravity-ide\\brain\\25a43763-af19-4441-8e1e-c3ede1cf13e2";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("1. Navigating to Flights Hub...");
  await page.goto("http://localhost:3001/flights");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "flights_hub.png"), fullPage: true });

  console.log("2. Opening Redirect Modal on Flights...");
  await page.click("#search-flights-ixigo-btn");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "flight_redirect_modal.png"), fullPage: true });
  await page.click('button[aria-label="Close redirect modal"]');

  console.log("3. Navigating to Hotels Hub...");
  await page.goto("http://localhost:3001/hotels");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "hotels_hub.png"), fullPage: true });

  console.log("4. Opening Redirect Modal on Hotels...");
  await page.click("#search-hotels-booking-btn");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "hotel_redirect_modal.png"), fullPage: true });

  await browser.close();
  console.log("Phase 4 screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Error capturing Phase 4 screenshots:", err);
  process.exit(1);
});

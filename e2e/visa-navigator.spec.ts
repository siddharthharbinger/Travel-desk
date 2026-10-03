import { test, expect } from "@playwright/test";

test.describe("Phase 2: Visa Navigator & Informational Guides Smoke Tests", () => {
  test("1. Landing page prompt box prefills into Visa Navigator", async ({ page }) => {
    await page.goto("/");
    const promptInput = page.locator('input[placeholder*="Where are you travelling"]');
    await expect(promptInput).toBeVisible();

    await promptInput.fill("Client kickoff meeting in Munich Germany");
    await page.click('button[aria-label="Submit travel query to Visa Navigator"]');

    // Should navigate to /visas with prompt query param
    await expect(page).toHaveURL(/\/visas\?prompt=/, { timeout: 10000 });
    await expect(page.locator("h1")).toContainText("Visa Category Navigator");
    await expect(page.locator("text=Prefilled from query:")).toBeVisible();
    await expect(page.locator("#evaluation-category-heading")).toContainText("Schengen Business Visa");
  });

  test("2. Visa Navigator evaluates Germany Schengen Business Visa with verified specs", async ({ page }) => {
    await page.goto("/visas");
    await page.click("#dest-germany-btn");
    await page.click("#purpose-meetings-btn");
    await page.click("#duration-short-btn");

    // Verify evaluation results
    const categoryHeading = page.locator("#evaluation-category-heading");
    await expect(categoryHeading).toContainText("Schengen Business Visa (Type C - Short Stay)");

    // Verify statutory fee and passport rule
    await expect(page.locator("text=€90 (Standard EU Schengen fee")).toBeVisible();
    await expect(page.locator("text=Article 12 Schengen Visa Code")).toBeVisible();
    await expect(page.locator("text=Last verified: October 2026").first()).toBeVisible();

    // Verify official consulate link
    const officialLink = page.locator('a[href*="india.diplo.de"]').first();
    await expect(officialLink).toBeVisible();
    await expect(officialLink).toHaveAttribute("target", "_blank");
  });

  test("3. Visa Navigator evaluates US B-1 Visitor Visa with Six-Month Club rule", async ({ page }) => {
    await page.goto("/visas");
    await page.click("#dest-usa-btn");
    await page.click("#purpose-meetings-btn");
    await page.click("#duration-short-btn");

    // Verify US B-1 recommendation
    const categoryHeading = page.locator("#evaluation-category-heading");
    await expect(categoryHeading).toContainText("US B-1 Temporary Business Visitor Visa");

    // Verify statutory MRV fee and Six-Month Club exemption
    await expect(page.locator("text=$185 USD (MRV Application Fee")).toBeVisible();
    await expect(page.locator("text=Six-Month Club Agreement").first()).toBeVisible();

    // Verify official link to travel.state.gov
    const officialLink = page.locator('a[href*="travel.state.gov"]').first();
    await expect(officialLink).toBeVisible();
  });

  test("4. Visa Navigator raises compliance warning when productive labor is selected", async ({ page }) => {
    await page.goto("/visas");
    await page.click("#dest-germany-btn");
    await page.click("#purpose-local_work-btn");

    // Should recommend National Employment Visa and show regulatory compliance notice
    await expect(page.locator("text=German National Employment Visa")).toBeVisible();
    await expect(page.locator("text=Regulatory Compliance Notice:")).toBeVisible();
    await expect(page.locator("text=Schengen C Business visas do NOT allow productive on-site work")).toBeVisible();
  });

  test("5. Visa Policy Directory (/visas/info) renders official fees and rules", async ({ page }) => {
    await page.goto("/visas/info");
    await expect(page.locator("h1")).toContainText("Corporate Visa Classifications & Regulatory Standards");
    await expect(page.locator("text=€90 EUR")).toBeVisible();
    await expect(page.locator("text=$185 USD")).toBeVisible();
    await expect(page.locator("text=Strictly Prohibited on B-1")).toBeVisible();
  });

  test("6. Passport Services Guide (/passport) distinguishes Schengen vs US validity rules", async ({ page }) => {
    await page.goto("/passport");
    await expect(page.locator("h1")).toContainText("Passport Services & Consular Validity Standards");
    await expect(page.locator("text=3-Month Post-Departure Rule")).toBeVisible();
    await expect(page.locator("text=Six-Month Club Agreement (India)")).toBeVisible();
    await expect(page.locator("text=₹1,500 INR")).toBeVisible();
    await expect(page.locator("text=₹3,500 INR")).toBeVisible();
  });

  test("7. Destination Dossiers (/travel-info) renders Munich and New York City logistics", async ({ page }) => {
    await page.goto("/travel-info");
    await expect(page.locator("h1")).toContainText("Executive Destination Guides: Munich & New York City");

    // Check Munich defaults
    await expect(page.locator("text=112 (General) / 110 (Police)")).toBeVisible();
    await expect(page.locator("text=230V / 50Hz (Types C & F)")).toBeVisible();
    await expect(page.locator("text=S-Bahn S1 / S8 (~42 mins)")).toBeVisible();

    // Switch to New York City
    await page.click("#city-newyork-btn");
    await expect(page.locator("text=911 (Police / Fire / EMS)")).toBeVisible();
    await expect(page.locator("text=120V / 60Hz (Types A & B)")).toBeVisible();
    await expect(page.locator("text=AirTrain + Subway / LIRR")).toBeVisible();
  });

  test("8. Corporate FAQ (/faq) clarifies expense policy and prohibited work activities", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.locator("h1")).toContainText("Frequently Asked Questions & Consular Rules");
    await expect(page.locator("text=Who pays for corporate visa application fees")).toBeVisible();
    await expect(page.locator("text=STRICTLY NO.")).toBeVisible();
    await expect(page.locator("text=Mandatory Compliance Rule")).toBeVisible();
    await expect(page.locator("text=travel-desk@harbingergroup.com")).toBeVisible();
  });
});

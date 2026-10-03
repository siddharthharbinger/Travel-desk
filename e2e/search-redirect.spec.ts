import { test, expect } from "@playwright/test";

test.describe("Phase 4: Flights & Hotels Search-and-Redirect Hubs Smoke Tests", () => {
  test("1. Flight Hub renders dynamic relative dates, transit advisory, and opens redirect modal", async ({ page }) => {
    await page.goto("/flights");

    // Verify Corporate Dispatch Header
    await expect(page.locator("h1")).toContainText("Corporate Flight Dispatch Hub");
    await expect(page.locator("text=HARBINGER MOBILITY & EXPENSE DESK")).toBeVisible();

    // Verify Summary Header Pills
    await expect(page.locator("text=Origin & Destination")).toBeVisible();
    await expect(page.locator("text=BOM → MUC")).toBeVisible();
    await expect(page.locator("text=Travel Window")).toBeVisible();
    await expect(page.locator("text=Harbinger Tier 1 Protocol")).toBeVisible();
    await expect(page.locator("text=Permitted Classes")).toBeVisible();

    // Verify Statutory Transit Advisory
    await expect(page.locator("text=Statutory Airport Transit & Visa Advisory")).toBeVisible();
    await expect(page.locator("text=UK Airport Transit (London Heathrow / Gatwick)")).toBeVisible();
    await expect(page.locator("text=Dual-Schengen Airport Transit")).toBeVisible();

    // Verify Policy Rules §14
    await expect(page.locator("text=Harbinger Corporate Travel Policy §14")).toBeVisible();

    // Verify Expandable Search Controls
    const modifyBtn = page.locator("#modify-flight-search-btn");
    await expect(modifyBtn).toBeVisible();
    await modifyBtn.click();

    // Select Destination to JFK
    const destSelect = page.locator("#flight-destination-select");
    await expect(destSelect).toBeVisible();
    await destSelect.selectOption("JFK");

    // Verify Summary Pill updated dynamically
    await expect(page.locator("text=BOM → JFK")).toBeVisible();

    // Open Redirect Modal for ixigo
    const ixigoBtn = page.locator("#search-flights-ixigo-btn");
    await expect(ixigoBtn).toBeVisible();
    await ixigoBtn.click();

    // Verify Corporate Redirection Modal
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.locator("h2")).toContainText("Redirecting to ixigo Corporate");
    await expect(modal.locator("text=Zero Markup & Direct Corporate Compliance")).toBeVisible();
    await expect(modal.locator("text=Harbinger Group Holdings Ltd")).toBeVisible();
    await expect(modal.locator("#confirm-partner-redirect-btn")).toBeVisible();

    // Close modal
    await modal.locator('button[aria-label="Close redirect modal"]').click();
    await expect(modal).not.toBeVisible();
  });

  test("2. Hotel Hub renders expense caps, proximity guidance, and opens hotel redirect modal", async ({ page }) => {
    await page.goto("/hotels");

    // Verify Header
    await expect(page.locator("h1")).toContainText("Corporate Accommodation Dispatch Hub");
    await expect(page.locator("text=HARBINGER CORPORATE LODGING & EXPENSE DESK")).toBeVisible();

    // Verify Summary Header Pills (Default Munich €180/night cap)
    await expect(page.locator("text=Munich, Germany")).toBeVisible();
    await expect(page.locator("text=Max €180 / night")).toBeVisible();

    // Verify Proximity Advisory
    await expect(page.locator("text=Consulate & Corporate Office Proximity Advisory for Munich")).toBeVisible();
    await expect(page.locator("text=Near VFS Global Munich / Karlsplatz / Hauptbahnhof")).toBeVisible();

    // Verify Policy Rules §18
    await expect(page.locator("text=Harbinger Corporate Travel Policy §18")).toBeVisible();

    // Expand Search Parameters & Switch to New York City
    const modifyBtn = page.locator("#modify-hotel-search-btn");
    await expect(modifyBtn).toBeVisible();
    await modifyBtn.click();

    const destSelect = page.locator("#hotel-destination-select");
    await expect(destSelect).toBeVisible();
    await destSelect.selectOption("NYC");

    // Verify Summary Pill updated to NYC with $250/night cap
    await expect(page.locator(".glass-panel").filter({ hasText: "Destination City" }).getByText("New York City, United States")).toBeVisible();
    await expect(page.locator("text=Max $250 / night")).toBeVisible();

    // Open Redirect Modal for Booking.com
    const bookingBtn = page.locator("#search-hotels-booking-btn");
    await expect(bookingBtn).toBeVisible();
    await bookingBtn.click();

    // Verify Corporate Redirection Modal
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.locator("h2")).toContainText("Redirecting to Booking.com for Business");
    await expect(modal.locator("text=$250 / night")).toBeVisible();
    await expect(modal.locator("text=Harbinger Group Holdings Ltd")).toBeVisible();

    // Cancel modal
    await modal.locator('text="Cancel & Return"').click();
    await expect(modal).not.toBeVisible();
  });

  test("3. Data Policy Verification: No fake flight cards, prices, or fake airline reviews exist", async ({ page }) => {
    await page.goto("/flights");

    // Verify no fake flight numbers, mock prices like ₹62,450 or fake ratings exist on the page
    const pageContent = await page.content();
    expect(pageContent).not.toContain("₹62,450");
    expect(pageContent).not.toContain("Lufthansa LH 757");
    expect(pageContent).not.toContain("Emirates EK 501");
    expect(pageContent).not.toContain("Air India AI 121");

    await page.goto("/hotels");
    const hotelContent = await page.content();
    expect(hotelContent).not.toContain("Hilton Munich City");
    expect(hotelContent).not.toContain("4.8/5 (1,240 reviews)");
  });
});

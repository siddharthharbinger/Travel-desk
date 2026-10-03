import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Phase 3: The Complete Pre-Screening Loop Smoke Tests", () => {
  const customerEmail = "customer@harbingergroup.com";
  const csrEmail = "csr@harbingergroup.com";

  let scratchPdfPath: string;
  let scratchFakePdfPath: string;

  test.beforeAll(async () => {
    // Generate valid test PDF with %PDF- header
    const scratchDir = path.join(process.cwd(), "scratch");
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }

    scratchPdfPath = path.join(scratchDir, "valid_test_document.pdf");
    const validPdfBuffer = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF");
    fs.writeFileSync(scratchPdfPath, validPdfBuffer);

    // Generate invalid file disguised as pdf (corrupted magic bytes)
    scratchFakePdfPath = path.join(scratchDir, "invalid_magic_bytes.pdf");
    const invalidBuffer = Buffer.from("THIS_IS_NOT_A_REAL_PDF_FILE_HEADER");
    fs.writeFileSync(scratchFakePdfPath, invalidBuffer);
  });

  test("1. Full Pre-Screening Loop: From Customer Interview & Upload to CSR Verification", async ({ page }) => {
    // 1. Log in as Customer
    await page.goto("/login");
    await page.click('button[aria-label="Log in as Demo Customer"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // 2. Open New Pre-Screening Modal & Create Case
    await page.click("#new-application-btn");
    const createModal = page.locator("text=Initiate Visa Pre-Screening");
    await expect(createModal).toBeVisible();

    await page.click("#confirm-create-application-btn");
    await expect(page).toHaveURL(/\/interview\?caseId=/, { timeout: 10000 });

    // Verify Case Cockpit Header
    await expect(page.locator("text=Pre-Screening Cockpit")).toBeVisible();
    await expect(page.locator("text=HB-2026-")).toBeVisible();

    // 3. Complete Interview Questions
    // Q1: Schengen purpose
    await expect(page.locator("h2")).toContainText("primary commercial purpose");
    await page.click('text="Client Consultations & Contract Negotiations"');
    await page.click("#submit-interview-answer-btn");

    // Q2: Duration
    await expect(page.locator("h2")).toContainText("total duration of your stay");
    const durationInput = page.locator('input[type="number"]');
    await durationInput.fill("14");
    await page.click("#submit-interview-answer-btn");

    // Q3: Passport Expiration Date (Relative to today + 2 years)
    await expect(page.locator("h2")).toContainText("expiration date indicated on your current passport");
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);
    const dateStr = futureDate.toISOString().split("T")[0];
    const dateInput = page.locator('input[type="date"]');
    await dateInput.fill(dateStr);
    await page.click("#submit-interview-answer-btn");

    // 4. Test Magic Bytes Validation on Document Upload
    // (a) Try uploading invalid fake PDF -> should reject
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(scratchFakePdfPath);
    await expect(page.locator("text=File signature does not match authorized PDF")).toBeVisible({ timeout: 8000 });

    // (b) Upload valid PDF -> should succeed
    await fileInput.setInputFiles(scratchPdfPath);
    await expect(page.locator("text=Successfully uploaded and validated")).toBeVisible({ timeout: 8000 });

    // 5. Submit Case to CSR Operations
    const submitCaseBtn = page.locator("#submit-case-to-csr-btn");
    await expect(submitCaseBtn).toBeVisible();
    await submitCaseBtn.click();

    // Redirected to Dashboard with Submitted status
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await expect(page.locator("text=Submitted for Review").first()).toBeVisible();

    // 6. Log in as CSR (clear customer session first)
    await page.context().clearCookies();
    await page.goto("/login");
    await page.click('button[aria-label="Log in as Demo CSR"]');
    await expect(page).toHaveURL(/\/review/);

    // 7. Verify CSR Review Cockpit & Case Dossier
    await expect(page.locator("h1")).toContainText("CSR Review Portal & Consular Dispatch");
    await expect(page.locator("text=Total Active Cases")).toBeVisible();

    // Select the first case in queue
    const firstCaseBtn = page.locator('button:has-text("HB-2026-")').first();
    await expect(firstCaseBtn).toBeVisible();
    await firstCaseBtn.click();

    // Verify dossier details
    await expect(page.locator("text=Uploaded Consular Documents")).toBeVisible();
    await expect(page.locator("text=Interview Q&A Transcript")).toBeVisible();

    // Enter CSR notes and verify case
    const notesInput = page.locator("#csr-decision-notes");
    await notesInput.fill("All commercial documents and passport validity verified under Schengen regulations. Approved for filing.");

    await page.click("#csr-action-verify-btn");

    // Verify success banner and updated status
    await expect(page.locator("text=Case successfully marked as VERIFIED")).toBeVisible({ timeout: 8000 });
  });
});

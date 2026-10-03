import { test, expect } from "@playwright/test";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

test.describe("Phase 1: Authentication & Role Authorization Smoke Tests", () => {
  const customerEmail = "customer@harbingergroup.com";
  const customerPassword = process.env.DEMO_CUSTOMER_PASSWORD || "DemoCustomer2026!";
  const csrEmail = "csr@harbingergroup.com";
  const csrPassword = process.env.DEMO_CSR_PASSWORD || "DemoCSR2026!";
  const adminEmail = "admin@harbingergroup.com";
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || "DemoAdmin2026!";

  test.beforeAll(async () => {
    // Ensure seeded demo accounts exist and are active with matching credentials
    const [custHash, csrHash, admHash] = await Promise.all([
      bcrypt.hash(customerPassword, 10),
      bcrypt.hash(csrPassword, 10),
      bcrypt.hash(adminPassword, 10),
    ]);

    await prisma.user.upsert({
      where: { email: customerEmail },
      update: { passwordHash: custHash, isActive: true, mustChangePassword: false },
      create: {
        name: "Demo Customer",
        email: customerEmail,
        passwordHash: custHash,
        role: "CUSTOMER",
        isActive: true,
        mustChangePassword: false,
      },
    });

    await prisma.user.upsert({
      where: { email: csrEmail },
      update: { passwordHash: csrHash, isActive: true, mustChangePassword: false },
      create: {
        name: "Demo CSR",
        email: csrEmail,
        passwordHash: csrHash,
        role: "CSR",
        isActive: true,
        mustChangePassword: false,
      },
    });

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash: admHash, isActive: true, mustChangePassword: false },
      create: {
        name: "Demo Admin",
        email: adminEmail,
        passwordHash: admHash,
        role: "ADMIN",
        isActive: true,
        mustChangePassword: false,
      },
    });
  });

  test("1. Customer credentials login redirects to /dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", customerEmail);
    await page.fill("#password", customerPassword);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("h1")).toContainText("Customer Application Dashboard");
  });

  test("2. CSR credentials login redirects to /review", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", csrEmail);
    await page.fill("#password", csrPassword);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/review/);
    await expect(page.locator("h1")).toContainText("CSR Review Portal");
  });

  test("3. Admin credentials login redirects to /review", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", adminEmail);
    await page.fill("#password", adminPassword);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/review/);
    await expect(page.locator("h1")).toContainText("CSR Review Portal");
  });

  test("4. 1-Click Demo login buttons work when demo mode is active", async ({ page }) => {
    await page.goto("/login");
    const demoButton = page.locator('button[aria-label="Log in as Demo Customer"]');
    await expect(demoButton).toBeVisible();
    await demoButton.click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("h1")).toContainText("Customer Application Dashboard");
  });

  test("5. Rejects email not ending in @harbingergroup.com", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "unauthorized@gmail.com");
    await page.fill("#password", "Password12345!");
    await page.click('button[type="submit"]');

    const alert = page.locator("#login-error-alert");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("@harbingergroup.com");
  });

  test("6. Customer role blocked from /review (redirected to /unauthorized)", async ({ page }) => {
    // Log in as customer
    await page.goto("/login");
    await page.click('button[aria-label="Log in as Demo Customer"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Attempt to access CSR review portal
    await page.goto("/review");
    await expect(page).toHaveURL(/\/unauthorized/);
    await expect(page.locator("h1")).toContainText("Access Restricted");
  });

  test("7. Unauthenticated user blocked from /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("8. Deactivated user is blocked from logging in", async ({ page }) => {
    const deactivatedEmail = "deactivated.test@harbingergroup.com";
    const deactivatedPass = "Deactivated2026!";
    const deactivatedHash = await bcrypt.hash(deactivatedPass, 10);

    await prisma.user.upsert({
      where: { email: deactivatedEmail },
      update: { isActive: false },
      create: {
        name: "Deactivated User",
        email: deactivatedEmail,
        passwordHash: deactivatedHash,
        role: "CUSTOMER",
        isActive: false,
      },
    });

    await page.goto("/login");
    await page.fill("#email", deactivatedEmail);
    await page.fill("#password", deactivatedPass);
    await page.click('button[type="submit"]');

    const alert = page.locator("#login-error-alert");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("Invalid credentials or account is not authorized");
  });

  test("9. User with mustChangePassword is forced to /change-password", async ({ page }) => {
    const resetEmail = "forcechange.test@harbingergroup.com";
    const tempPass = "TempPass2026!";
    const tempHash = await bcrypt.hash(tempPass, 10);

    await prisma.user.upsert({
      where: { email: resetEmail },
      update: { passwordHash: tempHash, mustChangePassword: true, isActive: true },
      create: {
        name: "Forced User",
        email: resetEmail,
        passwordHash: tempHash,
        role: "CUSTOMER",
        isActive: true,
        mustChangePassword: true,
      },
    });

    await page.goto("/login");
    await page.fill("#email", resetEmail);
    await page.fill("#password", tempPass);
    await page.click('button[type="submit"]');

    // Forced to change-password
    await expect(page).toHaveURL(/\/change-password/);
    await expect(page.locator("h1")).toContainText("Password Update Required");

    // Attempting to navigate away redirects back to change-password
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/change-password/);

    // Enter valid new password >= 10 chars
    await page.fill("#currentPassword", tempPass);
    await page.fill("#newPassword", "BrandNewSecurePass2026!");
    await page.fill("#confirmPassword", "BrandNewSecurePass2026!");
    await page.click('button[type="submit"]');

    // Successfully redirects to dashboard after password update
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

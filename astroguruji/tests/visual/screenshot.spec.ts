import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test("home page — desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-desktop.png", {
      fullPage: true,
    });
  });

  test("home page — tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-tablet.png", {
      fullPage: true,
    });
  });

  test("home page — mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-mobile.png", {
      fullPage: true,
    });
  });
});

import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("page-home")).toBeVisible();
  });

  test("home page has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Figma Design Convert/);
  });

  test("home page renders main content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Figma Design Convert")).toBeVisible();
  });
});

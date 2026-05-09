# Skill: Playwright Generator

## Description

Generate Playwright E2E and visual regression tests for pages and user flows.

## Inputs

- `ComponentMapping[]` — page-level components to test
- Route definitions

## Outputs

- `tests/e2e/{page-name}.spec.ts` — E2E functional tests
- `tests/visual/screenshot.spec.ts` — visual regression tests

## E2E Test Structure

```ts
import { test, expect } from "@playwright/test";

test.describe("Page Name", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/route");
    await expect(page.getByTestId("page-name")).toBeVisible();
  });
});
```

## Visual Regression Structure

```ts
test("visual regression", async ({ page }) => {
  await page.goto("/route");
  await expect(page).toHaveScreenshot("page-name.png");
});
```

## Test Categories

### Navigation Tests

- Page loads at correct route
- Navigation links work
- Back/forward browser navigation

### Authentication Tests

- Login form renders
- Login with valid credentials
- Login with invalid credentials shows error
- Protected routes redirect to login

### Dashboard Tests

- Dashboard loads with data
- Dashboard widgets are interactive
- Dashboard responds to viewport changes

### Visual Regression Tests

- Full page screenshots at desktop viewport
- Component-level screenshots for critical UI
- Comparison with baseline images (1% pixel diff threshold)

## Configuration

- `playwright.config.ts` defines projects for chromium, firefox, webkit
- Dev server auto-started via `webServer` config
- Snapshot directory: `tests/visual/snapshots/`

## Source

`src/figma-pipeline/generators/test-generator.ts`

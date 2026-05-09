# Skill: Visual Testing

## Description

Implement screenshot-based visual regression testing using Playwright. Capture UI state as images and compare against baselines to detect unintended visual changes.

## Inputs

- Running application (dev server)
- Baseline screenshots (stored in `tests/visual/snapshots/`)

## Outputs

- Pass/fail visual regression results
- Diff images highlighting pixel changes
- Updated baselines when intentional changes are approved

## Implementation

### Screenshot Capture

```ts
import { test, expect } from "@playwright/test";

test("visual: home page", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("home.png", {
    maxDiffPixelRatio: 0.01,
    fullPage: true,
  });
});
```

### Component-Level Screenshots

```ts
test("visual: button variants", async ({ page }) => {
  await page.goto("/storybook-iframe?id=atoms-button--all-variants");
  const component = page.getByTestId("button");
  await expect(component).toHaveScreenshot("button-default.png");
});
```

### Workflow

1. **First run**: Creates baseline screenshots in `tests/visual/snapshots/`
2. **Subsequent runs**: Compares current screenshots against baselines
3. **On failure**: Generates diff images showing pixel differences
4. **Update baselines**: `npx playwright test --update-snapshots`

### Configuration

- Threshold: `maxDiffPixelRatio: 0.01` (1% tolerance)
- Viewports tested: Desktop (1440×900), Tablet (768×1024), Mobile (375×812)
- Screenshots stored alongside test files

### When to Run

- After design token updates (`npm run figma:sync-tokens`)
- Before merging PRs that touch UI components
- Nightly in CI for regression detection

## Source

`tests/visual/screenshot.spec.ts`, `playwright.config.ts`

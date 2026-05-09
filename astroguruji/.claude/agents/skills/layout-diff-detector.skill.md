# Skill: Layout Diff Detector

## Description

Compare two sets of design tokens (before and after a Figma update) and report which tokens changed, which were added or removed, and which components might be affected.

## Inputs

- `DesignTokens` — previous token snapshot
- `DesignTokens` — current token snapshot

## Outputs

- `LayoutDiffReport` containing:
  - `TokenDiff` for colors, spacing, typography, shadows
  - `hasChanges` flag
  - Human-readable summary

## Diff Categories

### Added

Tokens present in `after` but not in `before`.

### Removed

Tokens present in `before` but not in `after`.

### Changed

Tokens present in both but with different values. Reports the specific field that changed and before/after values.

## Use Cases

1. **Token sync validation** — after `npm run figma:sync-tokens`, see what changed
2. **Design review** — compare design states before/after designer updates
3. **Regression detection** — flag components that use changed tokens

## Workflow

```bash
# 1. Save current tokens as baseline
cp src/tokens/colors.ts src/tokens/colors.baseline.ts

# 2. Re-sync tokens from Figma
npm run figma:sync-tokens

# 3. Diff is reported automatically by pipeline
```

## Source

`src/figma-pipeline/diff/layout-diff.ts`

# Skill: Design Token Extraction

## Description

Extract design tokens (colors, spacing, typography, shadows, border-radius) from Figma node trees and generate TypeScript token files.

## Inputs

- `FigmaNode` — root node to scan

## Outputs

- `DesignTokens` object containing:
  - `ColorToken[]` — unique colors with hex values
  - `SpacingToken[]` — padding and gap values
  - `TypographyToken[]` — font family, size, weight, line-height, letter-spacing
  - `ShadowToken[]` — drop and inner shadows
  - `BorderRadiusToken[]` — corner radius values

## Extraction Rules

### Colors

- Scan `fills` array on all nodes
- Filter `type: 'SOLID'` and `visible !== false`
- Convert Figma RGBA (0-1 range) to hex
- Deduplicate by hex value

### Spacing

- Collect `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` from auto-layout nodes
- Collect `itemSpacing` (gap) values
- Deduplicate and sort ascending

### Typography

- Scan `TEXT` nodes for `style` property
- Extract: fontFamily, fontSize, fontWeight, lineHeightPx, letterSpacing
- Deduplicate by font-family + size + weight combination
- Name format: `{family}-{weight}-{size}`

### Shadows

- Scan `effects` array for `DROP_SHADOW` and `INNER_SHADOW`
- Filter `visible: true`
- Extract: offset x/y, blur, spread, color (as rgba)

### Border Radius

- Collect `cornerRadius` and `rectangleCornerRadii` values > 0
- Deduplicate and sort ascending

## Source

`src/figma-pipeline/extractors/token-extractor.ts`

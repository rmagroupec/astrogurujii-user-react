# Skill: Tailwind Token Sync

## Description

Synchronize extracted design tokens into Tailwind CSS configuration. When Figma tokens change, update both the TypeScript token files and `tailwind.config.ts`.

## Inputs

- `DesignTokens` — extracted from Figma

## Outputs

- Updated `src/tokens/colors.ts`
- Updated `src/tokens/spacing.ts`
- Updated `src/tokens/typography.ts`
- Updated `src/tokens/shadows.ts`
- Updated `src/tokens/index.ts`
- `tailwind.config.ts` automatically reads from token files

## Token → Tailwind Mapping

| Token Type  | Tailwind Theme Key        | Usage                                |
| ----------- | ------------------------- | ------------------------------------ |
| Color       | `theme.extend.colors`     | `bg-{name}`, `text-{name}`           |
| Spacing     | `theme.extend.spacing`    | `p-{name}`, `m-{name}`, `gap-{name}` |
| Font Family | `theme.extend.fontFamily` | `font-{name}`                        |
| Font Size   | `theme.extend.fontSize`   | `text-{name}`                        |
| Font Weight | `theme.extend.fontWeight` | `font-{name}`                        |
| Line Height | `theme.extend.lineHeight` | `leading-{name}`                     |
| Shadow      | `theme.extend.boxShadow`  | `shadow-{name}`                      |

## Sync Workflow

1. Run `npm run figma:sync-tokens`
2. Pipeline fetches latest Figma file
3. Extracts all design tokens
4. Regenerates TypeScript token files
5. `tailwind.config.ts` imports from token files — no config patching needed
6. Tailwind automatically picks up new values

## Change Detection

Use the layout diff detector to compare before/after tokens and report what changed.

## Source

`src/figma-pipeline/generators/token-generator.ts`

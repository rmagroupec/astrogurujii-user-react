# Skill: Component Generator

## Description

Generate React + TypeScript + Tailwind components from Figma node definitions. Each component follows the Container/Presenter pattern.

## Inputs

- `ComponentMapping[]` — selected components with Figma node references
- Design token context for class generation

## Outputs

- `ComponentNameContainer.tsx` — state & logic
- `ComponentNameView.tsx` — pure UI rendering
- `index.ts` — barrel export

## Figma → Tailwind Class Mapping

### Layout

- `layoutMode: 'HORIZONTAL'` → `flex flex-row`
- `layoutMode: 'VERTICAL'` → `flex flex-col`
- `primaryAxisAlignItems: 'CENTER'` → `justify-center`
- `counterAxisAlignItems: 'CENTER'` → `items-center`
- `itemSpacing: N` → `gap-[Npx]`

### Spacing

- Equal padding → `p-[Npx]`
- Symmetric horizontal → `px-[Npx]`
- Symmetric vertical → `py-[Npx]`
- Per-side → `pt-[N] pr-[N] pb-[N] pl-[N]`

### Dimensions

- Fixed width → `w-[Npx]`
- Fixed height → `h-[Npx]`
- `primaryAxisSizingMode: 'AUTO'` → `w-fit`
- `counterAxisSizingMode: 'AUTO'` → `h-fit`

### Visual

- Solid fill → `bg-[#hex]`
- Corner radius → `rounded-[Npx]`
- Opacity → `opacity-[N]`

### Text

- Font size → `text-[Npx]`
- Font weight 700 → `font-bold`, 600 → `font-semibold`, 500 → `font-medium`
- Line height → `leading-[Npx]`
- Letter spacing → `tracking-[Npx]`
- Text color → `text-[#hex]`

## Component Placement

- Atoms → `src/components/atoms/{Name}/`
- Molecules → `src/components/molecules/{Name}/`
- Organisms → `src/components/organisms/{Name}/`
- Pages → `src/pages/{Name}.tsx`

## Source

`src/figma-pipeline/generators/component-generator.ts`

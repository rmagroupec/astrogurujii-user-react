# Skill: Storybook Generator

## Description

Generate Storybook stories for each React component, including multiple variants and states.

## Inputs

- `ComponentMapping[]` — components to generate stories for

## Outputs

- `{ComponentName}.stories.tsx` — co-located with the component

## Story Structure

### Meta Configuration

```tsx
const meta: Meta<typeof Component> = {
  title: "{Boundary}/{ComponentName}", // e.g., 'Atoms/Button'
  component: Component,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    /* controls */
  },
};
```

### Required Stories

1. **Default** — component with default props
2. **WithCustomClass** — demonstrates className extension
3. **Loading** — loading/skeleton state
4. **Error** — error state with error message

### Optional Stories (based on component)

- **AllVariants** — grid showing all visual variants
- **Responsive** — component at different viewport sizes
- **DarkMode** — dark theme variant (if applicable)
- **Interactive** — story with actions for events

## Guidelines

- Use Storybook `args` for props when possible
- Use `render` function for complex compositions
- Include `data-testid` in custom render stories
- Pages do NOT get stories (they get Playwright tests instead)

## Source

`src/figma-pipeline/generators/story-generator.ts`

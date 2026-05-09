# Skill: Component-First Development

## Description

A workflow methodology where development starts with individual components before composing them into pages. Each component is fully developed (story + test + implementation) before integration.

## Workflow Steps

### 1. Identify Reusable Component

From the Figma design analysis or feature requirements, identify a component to build.

### 2. Create Storybook Story First

Write the story file defining the component's visual contract:

```tsx
// Button.stories.tsx — written FIRST
export const Default: Story = { args: { children: "Click me" } };
export const Loading: Story = { args: { isLoading: true } };
```

### 3. Write Failing Test

Write a test asserting the component's behavior:

```tsx
// Button.test.tsx — written SECOND
it("renders children", () => {
  render(<Button>Click</Button>);
  expect(screen.getByText("Click")).toBeInTheDocument();
});
```

### 4. Implement Component

Build the component to satisfy the story and test:

```tsx
// Button.tsx — written THIRD
export function Button({ children }) {
  return <button>{children}</button>;
}
```

### 5. Compose into Page

Once components are built and tested, compose them into pages:

```tsx
// Page uses tested, storied components
<Header />
<main><ProductGrid /><Sidebar /></main>
<Footer />
```

## Benefits

- Components are **tested in isolation** before integration
- Storybook serves as **living documentation**
- **Faster feedback** — see component immediately in Storybook
- **Reduced integration bugs** — components are proven to work individually
- **Design review ready** — designers can review components in Storybook

## Order of Development

1. Design tokens (colors, spacing, typography)
2. Atoms (Button, Input, Badge, Icon, Text)
3. Molecules (Card, NavItem, SearchBar)
4. Organisms (Header, Sidebar, ProductGrid, Footer)
5. Pages (Home, Dashboard, Login)
6. Features (auth flow, dashboard data loading)

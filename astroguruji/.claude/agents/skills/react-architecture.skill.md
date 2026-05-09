# Skill: React Architecture

## Description

Define and enforce the scalable React application architecture using atomic design, feature modules, and the Container/Presenter pattern.

## Architecture Layers

### Components (Atomic Design)

```
src/components/
  atoms/        — smallest, single-purpose (Button, Input, Badge, Icon)
  molecules/    — composed of atoms (SearchBar, Card, NavItem)
  organisms/    — complex, section-level (Header, Sidebar, ProductGrid)
```

### Features (Domain Modules)

```
src/features/
  auth/         — authentication logic and components
  dashboard/    — dashboard-specific views and state
```

### Pages (Route Targets)

```
src/pages/
  Home.tsx      — landing page
  Dashboard.tsx — dashboard page
  Login.tsx     — auth page
```

### Shared

```
src/hooks/      — custom React hooks
src/services/   — API clients, external service wrappers
src/utils/      — pure utility functions
src/tokens/     — design tokens from Figma
```

## Container/Presenter Pattern

### Container (Logic)

```tsx
// XContainer.tsx
export function XContainer(props) {
  const [state, setState] = useState();
  // API calls, event handlers, business logic
  return <XView data={state} onAction={handler} />;
}
```

### Presenter (UI)

```tsx
// XView.tsx
export function XView({ data, onAction }) {
  return (
    <div className="tailwind-classes">
      {/* Pure rendering — no state, no side effects */}
    </div>
  );
}
```

### Page Variant

```tsx
// PageName.tsx
function usePageName() {
  /* hook = container */
}
function PageNameView() {
  /* presenter */
}
export default function PageName() {
  const state = usePageName();
  return <PageNameView {...state} />;
}
```

## Import Rules

- Atoms import nothing from components
- Molecules import only from atoms
- Organisms import from atoms and molecules
- Pages import from any component level
- Features import from components, hooks, services
- No circular imports between features

## File Co-location

Each component directory contains:

```
ComponentName/
  ComponentNameContainer.tsx  — logic
  ComponentNameView.tsx       — UI
  ComponentName.stories.tsx   — Storybook
  ComponentName.test.tsx      — unit tests
  index.ts                    — barrel export
```

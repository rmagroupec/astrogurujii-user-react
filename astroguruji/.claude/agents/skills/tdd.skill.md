# Skill: Test-Driven Development (TDD)

## Description

Enforce the TDD workflow: write a failing test first, then implement the minimal code to pass, then refactor. Applied to both unit tests (Vitest) and E2E tests (Playwright).

## TDD Cycle

### 1. Red — Write Failing Test

```tsx
// Component doesn't exist yet — test fails
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";

it("renders product name", () => {
  render(<ProductCard name="Widget" price={9.99} />);
  expect(screen.getByText("Widget")).toBeInTheDocument();
});
```

### 2. Green — Minimal Implementation

```tsx
// Simplest code to pass the test
export function ProductCard({ name }: { name: string; price: number }) {
  return <div data-testid="product-card">{name}</div>;
}
```

### 3. Refactor — Improve Without Breaking

```tsx
// Clean up, add Tailwind, improve types
export interface ProductCardProps {
  name: string;
  price: number;
}

export function ProductCard({ name, price }: ProductCardProps) {
  return (
    <div className="rounded-lg shadow-md p-4" data-testid="product-card">
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray-600">${price.toFixed(2)}</p>
    </div>
  );
}
```

## Testing Pyramid

### Unit Tests (Vitest + React Testing Library) — 80%

- Fast, isolated, pure
- Mock external deps
- Cover: render, props, interactions, edge cases
- Target: ≥80% coverage on new code

### Integration Tests (Vitest) — 15%

- Test component compositions
- Test hook + component integration
- Use `renderHook` for custom hooks

### E2E Tests (Playwright) — 5%

- Test full user flows
- Test critical paths only
- Visual regression for design fidelity

## Test Quality Rules

1. **One assertion per test** (conceptually)
2. **AAA pattern**: Arrange → Act → Assert
3. **No test interdependence** — each test runs in isolation
4. **Use factories** for test data, not hardcoded objects
5. **Mock at boundaries** — API calls, timers, random values
6. **Prefer `userEvent`** over `fireEvent` for realistic interaction simulation
7. **Use `data-testid`** for element selection reliability

## Commands

```bash
npm test              # Run all unit tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run test:e2e      # Playwright E2E tests
npm run test:visual   # Visual regression tests
```

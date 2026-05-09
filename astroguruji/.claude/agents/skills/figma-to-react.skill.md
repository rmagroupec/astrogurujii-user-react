# Skill: Figma to React

## Description

End-to-end conversion of a Figma design file into a React + TypeScript + Tailwind application. This is the master skill that orchestrates the full pipeline.

## Inputs

- **Figma URL**: `https://www.figma.com/design/{fileKey}/{name}?node-id={nodeId}`
- **FIGMA_ACCESS_TOKEN**: Personal access token (via environment variable)

## Outputs

- Design token files (`src/tokens/`)
- React components (`src/components/`)
- Page components (`src/pages/`)
- Storybook stories (`.stories.tsx`)
- Test files (`.test.tsx`, `.spec.ts`)

## Pipeline Steps

### 1. Parse Figma URL

Extract `fileKey` and `nodeId` from the provided URL.

### 2. Fetch Figma API JSON

Call `GET /v1/files/{fileKey}` with the access token.

### 3. Parse Frame Hierarchy

Walk the document tree. Identify `CANVAS` → `FRAME` relationships. Each top-level FRAME = a page/screen.

### 4. Detect Groups

Recursively find `GROUP` and nested `FRAME` nodes. Score each as a component candidate based on child count, depth, auto-layout presence.

### 5. Interactive Selection

Present candidates to the user via CLI prompt. User selects which groups become components (atom/molecule/organism) and which frames become pages.

### 6. Extract Design Tokens

Scan all nodes for unique colors, spacing, typography, shadows, and border-radius values.

### 7. Generate Token Files

Write TypeScript token files. Update `tailwind.config.ts` to extend theme.

### 8. Generate React Components

For each selected component: create Container + View files following the Composer/Presenter pattern. Map Figma properties to Tailwind classes.

### 9. Generate Storybook Stories

For each component: create stories with default, variant, loading, error, and accessibility states.

### 10. Generate Tests

For each component: unit test (Vitest + RTL). For each page: E2E test (Playwright) + visual regression test.

## Usage

```bash
# Set token
echo "FIGMA_ACCESS_TOKEN=your_token" > .env

# Run full pipeline
npm run figma:convert

# Re-sync tokens only
npm run figma:sync-tokens
```

## Dependencies

- Skills: `figma-frame-parser`, `figma-group-detector`, `design-token-extraction`, `component-generator`, `storybook-generator`, `playwright-generator`

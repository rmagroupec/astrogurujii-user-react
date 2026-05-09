# Skill: Figma Group Detector

## Description

Detect grouped layers in a Figma frame and identify which groups should become React components. Designed for Figma files that use groups instead of components.

## Inputs

- `FigmaNode` — a frame node with children
- `parentFrameName` — name of the parent frame for context

## Outputs

- `GroupInfo[]` — detected groups with metadata
- `CandidateComponent[]` — scored candidates for component extraction

## Detection Heuristics

### Group Scoring

A group is a strong component candidate when it has:

- **Named intentionally** (not "Group 1" but "header-container")
- **Multiple children** (2+ nodes inside)
- **Auto-layout** enabled (structured layout)
- **Nested groups** (composition suggests molecule/organism)

### Boundary Suggestion

| Condition                       | Boundary |
| ------------------------------- | -------- |
| ≤3 children, depth ≥ 2          | Atom     |
| Has child groups, < 3 nested    | Molecule |
| Has ≥ 3 child groups or depth 0 | Organism |
| Top-level frame                 | Page     |

## Interactive Workflow

After detection, the user is prompted to:

1. Select which groups to convert (checkbox)
2. Override the suggested boundary type (atom/molecule/organism/page)
3. Confirm component names (auto-generated from group names)

## Source

- `src/figma-pipeline/parsers/frame-parser.ts` → `parseGroups()`, `detectCandidateComponents()`
- `src/figma-pipeline/interactive/component-selector.ts` → `selectComponents()`

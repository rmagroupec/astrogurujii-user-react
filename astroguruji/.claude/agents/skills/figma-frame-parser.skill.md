# Skill: Figma Frame Parser

## Description

Parse a Figma API document response and extract all top-level frames representing pages/screens.

## Inputs

- `FigmaFileResponse` — the JSON response from `GET /v1/files/{fileKey}`

## Outputs

- `FrameInfo[]` — array of frame metadata:
  - `id`: node ID
  - `name`: frame name from Figma
  - `width`, `height`: dimensions
  - `children`: direct child nodes

## Algorithm

1. Start at the `DOCUMENT` root node
2. Walk into each `CANVAS` child (Figma pages)
3. For each `CANVAS`, collect children of type `FRAME` or `SECTION`
4. Extract bounding box dimensions
5. Return as `FrameInfo[]`

## Key Rules

- Skip nodes with `visible: false`
- `SECTION` nodes in Figma are treated like frames
- Each frame represents a potential React page

## Source

`src/figma-pipeline/parsers/frame-parser.ts` → `parseFrames()`

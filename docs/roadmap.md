# Roadmap

## Core thesis

Korean tokenizes 1.5–2x heavier than equivalent English in most tokenizers. The real value of pi-ko is intercepting the Korean input *before* it reaches the expensive model, compressing it to a tight English task, and translating the English response back to Korean — reducing token cost on both sides of the turn.

v0.1 validates the intent-disambiguation logic. v0.2 delivers the actual token savings via a preprocessing pipeline.

## v0.1 — Prompt-only Pi package ✓

**Goal:** Validate that Korean intent disambiguation and safety constraints work correctly before building the preprocessing layer.

Deliverables:
- 4 prompt templates: `ko-ask`, `ko-plan`, `ko-review`, `ko-debug`
- 3 skills: `korean-intent-normalization`, `technical-text-preservation`, `korean-response-style`
- Examples for all 7 MVP test cases
- Publish-ready `package.json` (npm + git installable)

Success criteria: All 7 MVP test cases correctly honor Korean safety constraints.

**Known limitation:** Token cost is not reduced. Korean input lands in the expensive model's context window in full. The normalization happens inside the same inference pass — it's a thinking pattern, not a preprocessing step.

## v0.2 — TypeScript extension with preprocessing pipeline

**Goal:** Deliver the actual token savings. This is the core thesis.

Architecture:

```
User types Korean
      │
      ▼
pi-ko extension intercepts input (TypeScript)
      │  cheap model (Haiku) or rule-based compressor
      │  "이 PR 치명적인 버그 위주로만 봐줘. 스타일 지적은 빼고."
      │  → "Review PR diff. Severity: critical only. Skip style."
      ▼
Compressed English → expensive model (Opus/Sonnet)
      │  cheaper input, cheaper output
      ▼
English response → cheap model translates to Korean
      ▼
Korean response to user
```

Deliverables:
- `extension/korean-preprocessor.ts` — intercepts turn, calls cheap model to compress Korean → English task
- `extension/korean-postprocessor.ts` — translates English response back to Korean
- `extension/token-estimator.ts` — measures and displays actual savings per turn
- Token dashboard shown before each turn:
  ```
  원문 한국어: 142 tokens
  압축 영어:    48 tokens
  절감률:       66%
  ```

Gate: v0.1 MVP test cases all pass (intent-mapping logic is correct before we build on top of it).

Extension layout:
```
pi-ko/
└── extension/
    ├── index.ts
    ├── korean-preprocessor.ts
    ├── korean-postprocessor.ts
    └── token-estimator.ts
```

## v0.3 — Hard safety enforcement

**Goal:** Make Korean safety constraints structurally enforced, not just instructed.

The v0.1/v0.2 prompt templates say "do NOT edit files." A model can still ignore this. A TypeScript extension can intercept tool calls and block writes programmatically based on the constraints parsed from the Korean input.

Deliverables:
- `extension/safety-router.ts` — parses constraints from preprocessed Korean input, blocks disallowed tool calls for the turn

Gate: A test case violates the write-lock despite correct Korean input in v0.2.

## v0.4 — Additional prompt templates

**Goal:** Cover more common workflows once the pipeline is proven.

Candidates:
- `ko-commit` — Korean-described commit messages
- `ko-test` — write tests from Korean specs

Gate: Demand from real usage.

## v1.0 — Standalone CLI (maybe)

Only if pi-ko outgrows what Pi's extension API supports. Likely unnecessary.

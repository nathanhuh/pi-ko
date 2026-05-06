# Roadmap

## Core thesis

Korean tokenizes 1.5–2x heavier than equivalent English in most tokenizers. The real value of pi-ko is intercepting the Korean input *before* it reaches the expensive model, compressing it to a tight English task, and translating the English response back to Korean — reducing token cost on both sides of the turn.

v0.1 validated the intent-disambiguation logic. v0.2 delivers the input-side token savings via a preprocessing pipeline. v0.3 completes the output side once the Pi extension API exposes a post-streaming rewrite hook.

## v0.1 — Prompt-only Pi package ✓

**Goal:** Validate that Korean intent disambiguation and safety constraints work correctly before building the preprocessing layer.

Deliverables:
- 4 prompt templates: `ko-ask`, `ko-plan`, `ko-review`, `ko-debug`
- 3 skills: `korean-intent-normalization`, `technical-text-preservation`, `korean-response-style`
- Examples for all 7 MVP test cases
- Publish-ready `package.json` (npm + git installable)

Success criteria: All 7 MVP test cases correctly honor Korean safety constraints.

**Known limitation:** Token cost is not reduced. Korean input lands in the expensive model's context window in full. The normalization happens inside the same inference pass — it's a thinking pattern, not a preprocessing step.

## v0.2 — TypeScript extension with input preprocessing pipeline ✓

**Goal:** Deliver the actual input-side token savings. This is the core thesis.

**Shipped.** The `input` event hook intercepts every `/ko-*` turn and runs the Korean text through Haiku before it reaches the expensive model.

Deliverables shipped:
- `extension/index.ts` — extension entry; `input` + `before_agent_start` event hooks
- `extension/preprocessor.ts` — Haiku compresses Korean → English task
- `extension/postprocessor.ts` — Haiku translator (wired up in v0.3)
- `extension/token-estimator.ts` — char-based token estimation; opt-in dashboard
- `extension/system-prompts.ts` — compressor and translator prompts

**Known gap:** Full output-side savings (expensive model → English → Haiku → Korean) require a post-streaming response rewrite hook not yet available in the Pi extension API. In v0.2 the expensive model responds in Korean directly. The output pipeline is implemented and ready; it activates in v0.3 once the API hook is available.

## v0.3 — Output pipeline + hard safety enforcement

**Goals:**
1. Wire up the output pipeline: expensive model → English → Haiku → Korean (saves output tokens too). Gate: Pi extension API exposes a post-streaming response rewrite hook.
2. Make Korean safety constraints structurally enforced, not just instructed.

The v0.1/v0.2 prompt templates say "do NOT edit files." A model can still ignore this. A TypeScript extension can intercept tool calls and block writes programmatically based on the constraints parsed from the Korean input.

Deliverables:
- Output pipeline using `postprocessor.ts` (already written) once the API hook is available
- `--ko-direct` flag becomes functional: skips the Haiku → Korean translation step
- `extension/safety-router.ts` — parses constraints from preprocessed Korean input, blocks disallowed tool calls for the turn

Gates: (1) Pi API exposes post-streaming rewrite event. (2) A test case violates the write-lock despite correct Korean input in v0.2.

## v0.4 — Additional prompt templates

**Goal:** Cover more common workflows once the pipeline is proven.

Candidates:
- `ko-commit` — Korean-described commit messages
- `ko-test` — write tests from Korean specs

Gate: Demand from real usage.

## v1.0 — Standalone CLI (maybe)

Only if pi-ko outgrows what Pi's extension API supports. Likely unnecessary.

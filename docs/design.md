# pi-ko Design Notes

## What pi-ko is

A Pi package that reduces the token cost of using a coding agent in Korean, by intercepting Korean input before it reaches the expensive model, compressing it to a tight English task, and translating the response back to Korean.

Korean tokenizes 1.5–2x heavier than equivalent English. Every Korean turn pays that premium on both input and output. pi-ko's preprocessing pipeline routes the heavy Korean through a cheap model (Haiku or rule-based), sends only compressed English to the expensive model (Opus/Sonnet), and renders the answer back in Korean — cutting cost on both sides.

The secondary value is **intent disambiguation**: Korean developers embed safety constraints in natural language ("수정하지 말고", "원인만") that a generic coding agent ignores. The preprocessing step also extracts those constraints explicitly, making them structural rather than advisory.

## What pi-ko is not

- A general-purpose Korean assistant. It only wraps coding-agent workflows.
- A no-op translation wrapper. Technical artifacts (code, paths, errors) are always preserved verbatim and never passed through translation.
- A safety enforcer in v0.1. Prompt-only instructions can be overridden by the model's judgment. Hard enforcement arrives in v0.3.

## Current architecture (v0.2)

```
User types Korean /ko-* command
      │
      ▼
pi-ko extension intercepts input event (TypeScript)
      │  Haiku compresses Korean → English task
      │  "이 PR 치명적인 버그 위주로만 봐줘. 스타일 지적은 빼고."
      │  → "/ko-review Review the PR diff for correctness bugs.
      │     Constraints: critical severity only, skip style. Mode: review."
      ▼
Compressed English task → expensive model (Opus/Sonnet)
      │  smaller input context; saves 40–65% of input tokens on typical Korean turns
      ▼
Expensive model responds in Korean
      │  (output tokens same as v0.1; full output savings come in v0.3)
      ▼
Korean response to user
      │  optional: token dashboard showing input savings
```

The v0.1 skills (`korean-intent-normalization`, `korean-response-style`, `technical-text-preservation`) remain in the repo as documentation. In v0.2 the compressor's system prompt carries the mapping table; the expensive model still uses the skills for its Korean output.

## --ko-direct flag

`--ko-direct` is registered as a Pi flag in v0.2 but has no behavioral effect yet. It reserves the namespace for v0.3, where it will opt out of the postprocessor (expensive model → English → Haiku → Korean) and route directly to Korean output from the expensive model instead. Default behavior in v0.3 will be: English output from expensive model + Haiku translation.

## v0.3 output pipeline (planned)

When Pi exposes a post-streaming response rewrite hook, the full pipeline becomes:

```
Compressed English → expensive model → English response (cheaper output)
      │
      ▼
Haiku translates English → Korean
      │  (code/logs/paths passed through verbatim)
      ▼
Korean response to user
```

This delivers savings on both sides of the turn. `--ko-direct` will skip this step.

## History

### v0.1 limitation (resolved in v0.2)

v0.1 was prompt-only. The Korean intent-normalization happened *inside* the expensive model's inference pass — the full Korean text was already tokenized before any normalization. v0.1 validated that the intent-disambiguation logic was correct. The actual token savings required the TypeScript preprocessing pipeline in v0.2.

### Why prompt-only first

The preprocessing pipeline requires correctly identifying Korean safety constraints before compressing the input. If the constraint-mapping logic is wrong, the compressed English task is wrong too. v0.1 validated the mapping logic in isolation, using the expensive model as the judge.

## Out of scope (v0.1 and likely indefinitely)

- Themes (no visual branding story yet).
- A `pi-ko:` slash-command namespace (Pi prompt templates don't support package-scoped commands; `ko-` filename prefix achieves the same effect).
- Standalone CLI (only if Pi itself becomes a blocker).

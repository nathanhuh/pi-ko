# pi-ko Design Notes

## What pi-ko is

A Pi package that reduces the token cost of using a coding agent in Korean, by intercepting Korean input before it reaches the expensive model, compressing it to a tight English task, and translating the response back to Korean.

Korean tokenizes 1.5–2x heavier than equivalent English. Every Korean turn pays that premium on both input and output. pi-ko's preprocessing pipeline routes the heavy Korean through a cheap model (Haiku or rule-based), sends only compressed English to the expensive model (Opus/Sonnet), and renders the answer back in Korean — cutting cost on both sides.

The secondary value is **intent disambiguation**: Korean developers embed safety constraints in natural language ("수정하지 말고", "원인만") that a generic coding agent ignores. The preprocessing step also extracts those constraints explicitly, making them structural rather than advisory.

## What pi-ko is not

- A general-purpose Korean assistant. It only wraps coding-agent workflows.
- A no-op translation wrapper. Technical artifacts (code, paths, errors) are always preserved verbatim and never passed through translation.
- A safety enforcer in v0.1. Prompt-only instructions can be overridden by the model's judgment. Hard enforcement arrives in v0.3.

## v0.1 limitation — token cost is not actually reduced

v0.1 is prompt-only. The Korean intent-normalization happens *inside* the expensive model's inference pass — the full Korean text is already tokenized before any normalization occurs. v0.1 validates that the intent-disambiguation logic is correct. The actual token savings require the TypeScript preprocessing pipeline in v0.2.

## v0.1 architecture

```
User writes Korean
      │
      ▼
Prompt template (ko-ask / ko-plan / ko-review / ko-debug)
  │  Sets mode, hard rules, permitted tool surface
  │
  ▼
korean-intent-normalization skill (auto-loaded)
  │  Maps Korean phrases → explicit behavioral constraints
  │  Produces internal English task description (not shown)
  │
  ▼
Pi agent executes within permitted tool surface
  │
  ▼
korean-response-style skill + technical-text-preservation skill
  │  Shapes Korean output format; preserves code/logs verbatim
  │
  ▼
Korean response to user
```

Everything in this flow is Markdown. No TypeScript, no build step, no runtime dependencies.

## Why prompt-only first (v0.1)

The preprocessing pipeline (v0.2) requires correctly identifying Korean safety constraints before compressing the input. If the constraint-mapping logic is wrong, the compressed English task will be wrong too — and the expensive model will act on a bad task.

v0.1 validates the mapping logic in isolation, using the expensive model as the judge. Once the 7 MVP test cases all pass, we have confidence that the mapping table is correct and can move it into the preprocessor.

## v0.2 target architecture

```
User types Korean
      │
      ▼
pi-ko extension intercepts (TypeScript, before Pi's main model call)
      │
      ├─ cheap model / rule-based: extract constraints from Korean
      │  "이 PR 치명적인 버그 위주로만 봐줘. 스타일 지적은 빼고."
      │  → constraints: { writelock: true, severityFilter: 'critical', skipStyle: true }
      │
      ├─ cheap model: compress Korean intent → English task
      │  → "Review PR diff. Severity: critical only. Skip style."
      │
      ▼
Compressed English task → expensive model (Opus/Sonnet)
      │  smaller input context, smaller output
      ▼
English response
      │
      ▼
cheap model: translate English response → Korean
      │  (code/logs/paths passed through verbatim, not translated)
      ▼
Korean response to user + token dashboard
```

## Out of scope (v0.1 and likely indefinitely)

- Themes (no visual branding story yet).
- A `pi-ko:` slash-command namespace (Pi prompt templates don't support package-scoped commands; `ko-` filename prefix achieves the same effect).
- Standalone CLI (only if Pi itself becomes a blocker).

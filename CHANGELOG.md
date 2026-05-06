# Changelog

## 0.2.0 — 2026-05-06

### Added

- TypeScript extension delivering the core thesis: Korean input → Haiku compresses to English → expensive model → Korean response
- `extension/index.ts` — extension entry; hooks `input` and `before_agent_start` events
- `extension/preprocessor.ts` — Haiku compresses Korean `/ko-*` input to a tight English task before the expensive model
- `extension/system-prompts.ts` — compressor and translator system prompts (mirrors v0.1 intent-mapping table)
- `extension/postprocessor.ts` — Haiku translator for future output pipeline (v0.3)
- `extension/token-estimator.ts` — char-based token estimator; optional per-turn dashboard via `pi-ko.dashboard: true` in Pi settings
- `extension/config.ts` — reads `pi-ko` block from Pi's `settings.json`
- `tsconfig.json` — editor-only TypeScript config for the `extension/` directory
- `--ko-direct` per-turn flag — documented; reserved for v0.3 output pipeline
- `docs/extension.md` — dashboard config, flag reference, token estimation methodology

### Changed

- All four `/ko-*` prompt `argument-hint` fields updated to mention `[--ko-direct]`
- `peerDependencies`: added `@mariozechner/pi-coding-agent: "*"`
- `files` manifest: added `extension/`, `tsconfig.json`

### Note

Full output-side token savings (expensive model responds in English → Haiku translates back to Korean) require a post-streaming rewrite hook not yet available in the Pi extension API. That pipeline ships in v0.3. In v0.2 the expensive model responds in Korean directly (same as v0.1), but the input arrives as compressed English — delivering the larger of the two savings on every turn.

## 0.1.1 — 2026-05-06

### Changed

- Scoped package name to `@nathanhuh/pi-ko` (npm rejected `pi-ko` as too similar to `piko`)
- Updated README install command

### Added

- CI pipeline (on PR): frontmatter lint, tarball check, version bump enforcement
- Publish pipeline (on merge to main): lint, tarball check, npm publish, git tag
- `scripts/lint.sh` for local use

## 0.1.0 — 2026-05-06

### Added

- `prompts/ko-ask.md` — read-only Korean Q&A prompt template (`/ko-ask`)
- `prompts/ko-plan.md` — plan-only prompt template, no code edits (`/ko-plan`)
- `prompts/ko-review.md` — diff/PR review prompt template, no edits (`/ko-review`)
- `prompts/ko-debug.md` — debug analysis prompt template, edits gated by explicit Korean phrase (`/ko-debug`)
- `skills/korean-intent-normalization/` — canonical Korean phrase → agent behavior mapping
- `skills/technical-text-preservation/` — preserves code/logs/errors verbatim inside Korean responses
- `skills/korean-response-style/` — concise peer-to-peer Korean response conventions
- `examples/` — four annotated input/output examples (ask, plan, review, debug)
- `docs/design.md` — architecture rationale and v0.2+ upgrade triggers
- `docs/intent-mapping.md` — full canonical Korean intent mapping table
- `docs/roadmap.md` — v0.1 → v1.0 progression

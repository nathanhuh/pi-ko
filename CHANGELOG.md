# Changelog

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

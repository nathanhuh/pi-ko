---
name: pi-ko-ship
description: Use when the user explicitly asks to ship, release, commit, push, or publish pi-ko. Stages all changes, commits with a conventional message, pushes, opens a GitHub PR, and optionally publishes to npm. Do not use for general editing or planning work.
---

Ship the current pi-ko changes through a branch, PR, and optional npm publish flow.

## Workflow

1. Confirm working directory and branch.
   - Run `git status` and `git diff --stat` to understand what is changing.
   - All work should be on a branch, not directly on `main`. If currently on `main`
     with uncommitted changes, create a branch first:
     `git checkout -b <conventional-name>` (e.g. `feat/v0.1.0-scaffold`,
     `fix/review-prompt-silent-steps`, `chore/roadmap-token-thesis`).

2. No build step required.
   - pi-ko is pure Markdown. There is no `npm run build`, no TypeScript compile,
     no test suite to run. Skip straight to staging.
   - When extension/ is added in v0.2, this step will need `npm run build` and
     `npm test` added here.

3. Inspect and stage carefully.
   - Stage only the relevant files by name. Never use `git add .` or `git add -A`.
   - Verify the tarball contents are correct with `npm pack --dry-run` before
     committing. Confirm only `prompts/`, `skills/`, `examples/`, `docs/`,
     `README.md`, `LICENSE`, and `CHANGELOG.md` are included.

4. Commit with a conventional message.
   - Use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `chore:`.
   - Title: imperative, ≤72 chars.
   - Body: bullet points for key changes. No `Co-Authored-By` lines.
   - Example for the v0.1.0 scaffold:
     ```
     feat: add v0.1.0 prompt-only Pi package scaffold

     - four prompt templates: ko-ask, ko-plan, ko-review, ko-debug
     - three skills: korean-intent-normalization, technical-text-preservation,
       korean-response-style
     - examples for all four modes
     - docs: design, intent-mapping, roadmap
     - publish-ready package.json (pi-package keyword, files, pi manifest)
     ```

5. Push and open the PR.
   - Push with `git push -u origin <branch>`.
   - Open with `gh pr create`.
   - If a PR already exists for the branch, use `gh pr view` and update it instead
     of opening a duplicate.
   - PR body structure (no template exists):
     ```
     ## Summary
     <2-4 bullets describing what changed and why>

     ## Validation
     - [ ] `npm pack --dry-run` confirms correct tarball contents
     - [ ] Prompt templates invoke correctly as /ko-ask, /ko-plan, /ko-review, /ko-debug
     - [ ] Skills load by description (korean-intent-normalization, etc.)
     - [ ] Local install works: `pi install -l .`

     ## Notes
     <anything the reviewer should know; link to docs/design.md if architectural>
     ```

6. npm publish (only if user explicitly asks).
   - Confirm the version in `package.json` matches the intended release tag.
   - Run `npm publish --access public` (package is unscoped, public by default).
   - After publish, tag the release: `git tag v<version> && git push origin v<version>`.
   - Do not publish without explicit user instruction.

## Output

Return: branch name, commit hash, PR URL, `npm pack --dry-run` result, and npm
publish status (skipped / published at version X).

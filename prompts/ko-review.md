---
description: Korean review of staged/diff/PR changes — focus on correctness, no edits
argument-hint: "[베이스 브랜치 또는 추가 지시] [--ko-direct]"
---
You are operating in **review mode** for a Korean-speaking developer.

## Hard rules
- Do NOT create, edit, or delete any files.
- Do NOT run shell commands with side effects. Git read commands (diff, log, show, status) are permitted.
- Review and report only. Do not apply fixes.
- Preserve all code, file paths, identifiers, error messages, and stack traces **verbatim** in the original language.
- Respond in Korean unless the user explicitly requests English or the pi-ko extension overrides the output language.
- If the user's input includes "스타일 지적은 빼고", skip all style and formatting observations entirely — report only correctness, security, race conditions, data loss, production risk, and API compatibility.
- If the user's input includes "치명적인 버그 위주", apply the same filter and additionally order findings by severity descending.

## User review request (Korean)
$@

## Procedure

Work silently through steps 1–3. Do not narrate your actions, tool calls, or intermediate thoughts to the user. Only output the final Korean review.

1. Apply the `korean-intent-normalization` skill to determine scope and filters. Silent.
2. Gather the diff silently:
   - `git diff HEAD` has changes → review those.
   - `git diff HEAD` is empty AND the user said "이 PR" → run `gh pr list --limit 1 --state open`, confirm scope in one Korean sentence ("PR #N (제목) 기준으로 리뷰할게요."), then run `gh pr diff <N>`.
   - User names a base branch or ref → diff against that.
   - User provides a PR URL → `gh pr diff <URL>`.
   - Still ambiguous → ask in Korean: "어떤 변경사항을 리뷰할까요? (브랜치명, PR 번호, 또는 staged diff)"
3. Review the diff for: correctness bugs, race conditions, data loss, security vulnerabilities, production risks, unhandled errors, and API contract breaks. Apply filters from step 1. Silent.
4. Output the Korean review using the `korean-response-style` skill format:
   `심각도 — 파일:라인 — 문제 설명 — 제안`
   Severity levels: 치명 / 높음 / 중간 / 낮음. Order by severity descending when "치명적인 버그 위주" is set.
5. If no issues found, state that in Korean and briefly note what was checked.

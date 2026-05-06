---
name: korean-intent-normalization
description: Convert Korean developer requests into concise English coding-agent tasks. Use whenever the user writes in Korean to a coding agent. Disambiguates safety constraints embedded in Korean ("코드 바꾸지 말고", "원인만", "테스트는 돌려도 돼") and maps them to explicit agent behavior.
---

# Korean Intent Normalization

When the user writes in Korean, internally produce a tight English task before acting. This step is never shown to the user — it runs silently to constrain agent behavior.

## Canonical phrase → behavior mapping

| Korean phrase / pattern           | Agent behavior                                                |
|-----------------------------------|---------------------------------------------------------------|
| 코드 바꾸지 말고                  | Disable file writes for this turn                             |
| 수정하지 말고                     | Disable file writes for this turn                             |
| 파일은 바꾸지 마                  | Disable file writes for this turn                             |
| 원인만                            | Root-cause analysis only; do not propose or apply a fix       |
| 원인만 분석해줘                   | Root-cause analysis only; do not propose or apply a fix       |
| 수정 방향만                       | Plan only; do not edit any files                              |
| 방향만 알려줘                     | Plan only; do not edit any files                              |
| 고쳐도 돼 / 수정해도 돼           | File edits are permitted (unlock writes)                      |
| 테스트는 돌려도 돼                | Test commands are permitted; file writes remain locked        |
| 명령어 실행하지 마                | Do not run any shell commands; infer from code/logs only      |
| 명령어 실행해도 돼                | Non-destructive shell commands are permitted                  |
| 운영 장애 / prod / production     | High-risk incident mode: bias to read-only, confirm before writes |
| 스타일 지적은 빼고                | Skip style/formatting observations; correctness-only          |
| 치명적인 버그 위주로만            | Severe-correctness review only; skip minor/style findings     |
| 설명만 / 설명해줘                 | Explain only; do not modify anything                          |
| 바로 구현해줘 / 바로 고쳐줘       | Implementation request — check active prompt mode; if plan-only, surface the constraint |
| 로그만 보고 추측해줘              | Inference from provided logs only; do not read additional files or run commands |

## Compound phrases

Multiple constraints compose. Examples:

- "테스트는 돌려도 되는데 파일은 바꾸지 마" → tests allowed, file writes locked.
- "운영 장애라고 생각하고 원인만 파악해줘" → high-risk incident mode + root-cause only.
- "명령어 실행하지 말고 로그만 보고 추측해줘" → no shell, inference from provided log text only.

## Output shape (internal only — never shown to user)

Produce an English task of the form:

```
<verb> <target>. Constraints: <comma-separated list>. Return: Korean explanation.
```

Examples:
- "Explain the AuthService class. Constraints: no file writes, no shell side effects. Return: Korean explanation."
- "Identify root cause of the Redis lock test failure. Constraints: no file writes, no shell commands, inference from provided logs only. Return: Korean explanation."
- "Review git diff HEAD. Constraints: no file writes, skip style findings. Return: Korean explanation with severity format."

## Conflict resolution

If the Korean request contradicts the active prompt template's hard rules (e.g. asking for edits inside `/ko-ask`), follow the prompt template's rules. Explain the conflict to the user in Korean and offer an alternative within the allowed scope.

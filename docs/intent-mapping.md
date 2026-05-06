# Korean Intent Mapping

Canonical reference table: Korean phrases developers naturally write → agent behavior constraints.

This is the authoritative version. The `korean-intent-normalization` skill's SKILL.md contains a condensed subset for the system prompt.

## Safety / write constraints

| Korean phrase / pattern                 | Agent behavior                                                        |
|-----------------------------------------|-----------------------------------------------------------------------|
| 코드 바꾸지 말고                        | Disable file writes for this turn                                     |
| 수정하지 말고                           | Disable file writes for this turn                                     |
| 파일은 바꾸지 마                        | Disable file writes for this turn                                     |
| 수정 금지                               | Disable file writes for this turn                                     |
| 읽기만 해                               | Disable file writes; read-only access only                            |
| 고쳐도 돼                               | File edits are permitted (unlock writes)                              |
| 수정해도 돼                             | File edits are permitted (unlock writes)                              |
| 바꿔도 돼                               | File edits are permitted (unlock writes)                              |

## Analysis scope constraints

| Korean phrase / pattern                 | Agent behavior                                                        |
|-----------------------------------------|-----------------------------------------------------------------------|
| 원인만                                  | Root-cause analysis only; no fix proposed or applied                  |
| 원인만 분석해줘                         | Root-cause analysis only; no fix proposed or applied                  |
| 수정 방향만                             | Plan only; no code edits                                              |
| 방향만 알려줘                           | Plan only; no code edits                                              |
| 설명만                                  | Explain only; do not modify anything                                  |
| 설명해줘                                | Explain only; do not modify anything                                  |
| 분석만 해줘                             | Analysis only; no changes                                             |

## Shell / command constraints

| Korean phrase / pattern                 | Agent behavior                                                        |
|-----------------------------------------|-----------------------------------------------------------------------|
| 명령어 실행하지 마                      | Do not run any shell commands; infer from code/logs only              |
| 명령어는 쓰지 마                        | Do not run any shell commands                                         |
| 로그만 보고 추측해줘                    | Inference from provided log text only; do not run commands            |
| 테스트는 돌려도 돼                      | Test commands are permitted; file writes remain locked                |
| 테스트 돌려도 돼                        | Test commands are permitted; file writes remain locked                |
| 명령어 실행해도 돼                      | Non-destructive shell commands are permitted                          |

## Review filters

| Korean phrase / pattern                 | Agent behavior                                                        |
|-----------------------------------------|-----------------------------------------------------------------------|
| 스타일 지적은 빼고                      | Skip style/formatting observations; correctness-only                  |
| 스타일은 빼고                           | Skip style/formatting observations; correctness-only                  |
| 포매팅 지적은 빼고                      | Skip formatting observations                                          |
| 치명적인 버그 위주로만                  | Severe-correctness review only; order by severity descending          |
| 치명적인 것만                           | Severe-correctness review only                                        |
| 심각한 것만                             | Severe-correctness review only                                        |

## Risk level signals

| Korean phrase / pattern                 | Agent behavior                                                        |
|-----------------------------------------|-----------------------------------------------------------------------|
| 운영 장애                               | High-risk incident mode: bias to read-only, confirm before any write  |
| prod / production                       | High-risk incident mode (same as above)                               |
| 급해 / 급함                             | Prioritize speed of analysis; flag uncertainties explicitly           |

## Compound phrase examples

These show how multiple constraints compose — the normalized behavior is the intersection of all matching rows.

| User wrote                                          | Normalized behavior                                              |
|-----------------------------------------------------|------------------------------------------------------------------|
| "테스트는 돌려도 되는데 파일은 바꾸지 마"           | tests allowed, file writes locked                                |
| "운영 장애라고 생각하고 원인만 파악해줘"             | high-risk incident + root-cause only + no writes                 |
| "명령어 실행하지 말고 로그만 보고 추측해줘"          | no shell commands, inference from provided logs only             |
| "치명적인 버그 위주로만 봐줘. 스타일 지적은 빼고."  | severe-correctness review, skip style                            |

## Notes on ambiguity

- "고쳐줘" alone (without unlocking context) is ambiguous in plan-mode prompts — surface the constraint and ask whether the user wants to switch to a mode that allows edits.
- "빨리" / "급해" does not change the write-lock status; it signals urgency of analysis but not permission to act.
- When the user's intent is unclear, ask in Korean before proceeding.

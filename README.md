# pi-ko

Korean → compressed English → expensive model → Korean. Cheaper turns, same results.

Korean tokenizes 1.5–2x heavier than English. pi-ko intercepts your Korean request, compresses it to a tight English task before it hits the expensive model, and translates the response back. You write in Korean; the model sees English; you read Korean.

---

## Install

```bash
pi install git:github.com/nathanhuh/pi-ko
```

For project-local install (only active in the current repo):

```bash
pi install -l git:github.com/nathanhuh/pi-ko
```

Local dev:

```bash
pi install -l ./pi-ko
```

---

## Commands

| Command      | What it does                                                        |
|--------------|---------------------------------------------------------------------|
| `/ko-ask`    | Read-only Q&A. Explains code, architecture, history. No edits.     |
| `/ko-plan`   | Design or implementation plan only. No code changes.               |
| `/ko-review` | Reviews staged diff or PR for correctness issues. No edits.        |
| `/ko-debug`  | Analyzes logs, errors, test failures. Edits only if you say so.    |

---

## Usage

```
/ko-ask 이 코드 설명해줘. 수정하지 말고.
/ko-plan Redis lock race condition 안전하게 고치는 방향만 알려줘.
/ko-review 이 PR 치명적인 버그 위주로만 봐줘. 스타일 지적은 빼고.
/ko-debug 테스트 실패 원인만 분석해줘.
```

---

## Per-turn flags

| Flag          | Effect                                                                  |
|---------------|-------------------------------------------------------------------------|
| `--ko-direct` | Reserved for v0.3 — will skip the Haiku postprocessor when wired up.   |

## Token savings

The extension compresses your Korean input to English before the expensive model sees it. Typical savings: 40–65% of input tokens per `/ko-*` turn.

Enable the per-turn dashboard in Pi's settings: see [docs/extension.md](docs/extension.md).

---

## Korean safety phrases

pi-ko understands Korean constraints embedded in natural language:

| Korean phrase              | Effect                                         |
|----------------------------|------------------------------------------------|
| 코드 바꾸지 말고           | No file writes                                 |
| 원인만                     | Root-cause only, no fix                        |
| 수정 방향만                | Plan only, no code edits                       |
| 테스트는 돌려도 돼         | Tests allowed; writes still locked             |
| 명령어 실행하지 마         | No shell commands; infer from code/logs        |
| 운영 장애 / prod           | High-risk incident mode (conservative)         |
| 스타일 지적은 빼고         | Correctness-only; skip style observations      |
| 치명적인 버그 위주로만     | Severe issues only; ordered by severity        |
| 고쳐도 돼                  | File edits unlocked (for `/ko-debug`)          |

Full table: [docs/intent-mapping.md](docs/intent-mapping.md)

---

## Example transcript

```
User:  /ko-review 이 PR 치명적인 버그 위주로만 봐줘. 스타일 지적은 빼고.

pi-ko: 치명 — src/payments/charge.service.ts:84 — `charge()` 실패 시 Stripe 웹훅
       상태가 업데이트되지 않아요. 재시도 시 중복 과금 가능. —
       try/catch에서 `PaymentRecord.status = 'failed'`를 명시적으로 저장하세요.

       높음 — src/auth/jwt.strategy.ts:41 — 검증 예외를 catch해서 null 반환 →
       인증 우회 가능. 예외를 다시 throw해야 해요.

       치명 1건, 높음 1건. 스타일/포매팅 항목은 요청에 따라 제외했어요.
```

More examples: [examples/](examples/)

---

## Design

Why prompt-only first, what the skills do, and when to expect a TypeScript extension: [docs/design.md](docs/design.md)

Roadmap (v0.1 → v1.0): [docs/roadmap.md](docs/roadmap.md)

---

## License

MIT

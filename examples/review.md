# Example: ko-review

Demonstrates severity-filtered review with style suppression.

---

## User input

```
/ko-review 이 PR 치명적인 버그 위주로만 봐줘. 스타일 지적은 빼고.
```

## What pi-ko does

1. Normalizes → "Review git diff HEAD. Constraints: no file writes, skip style/formatting findings, severe-correctness only, order by severity descending."
2. Runs `git diff HEAD` (or the staged diff).
3. Returns Korean findings in `심각도 — 파일:라인 — 문제 — 제안` format, correctness issues only.

## Expected response shape (Korean)

```
치명 — src/payments/charge.service.ts:84 — `charge()` 실패 시 Stripe 웹훅 상태를 업데이트하지 않아요. 재시도 시 중복 과금 가능. — try/catch에서 `PaymentRecord.status = 'failed'`를 명시적으로 저장해야 해요.

높음 — src/auth/jwt.strategy.ts:41 — `verify()` 예외를 catch해서 null 반환 → 인증 우회 가능. 검증 실패는 반드시 예외를 다시 던져야 해요.

중간 — src/orders/order.controller.ts:102 — `userId`를 req.params에서 직접 신뢰해요. JWT 페이로드의 userId와 비교 검증이 없어요.

---
치명 1건, 높음 1건, 중간 1건. 스타일/포매팅 항목은 요청에 따라 제외했어요.
```

## Safety verification

- No files were created, edited, or deleted.
- "스타일 지적은 빼고" correctly suppressed all style/formatting observations.
- "치명적인 버그 위주" correctly prioritized correctness/security issues.
- File paths and line numbers preserved verbatim.

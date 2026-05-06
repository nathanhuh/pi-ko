# Example: ko-debug

Demonstrates debug analysis mode with a read-only constraint and a partial unlock.

---

## Example A: Root-cause only (no fix)

### User input

```
/ko-debug 테스트 실패 원인만 분석해줘.
```

### What pi-ko does

1. Normalizes → "Identify root cause of test failure. Constraints: no file writes, no shell side effects (read-only). Return: Korean explanation."
2. Reads test files and relevant source without modifying anything.
3. Returns Korean root-cause analysis only; no fix applied.

### Expected response shape (Korean)

```
원인: `UserService.findById()`가 트랜잭션 컨텍스트 없이 호출될 때 `EntityNotFoundError`를 throw하지 않고 `undefined`를 반환해요. 테스트는 throw를 기대하고 있어요.

재현 조건: `jest --testPathPattern=user.service.spec.ts` 실행 시 `findById with invalid id` 케이스가 실패해요.

수정 방향: `src/users/user.service.ts`, `UserService.findById()` — TypeORM의 `findOneOrFail()`로 교체하거나 null 반환 시 수동으로 `NotFoundException`을 throw해야 해요. (이번 요청은 원인 분석만이라 파일은 수정하지 않았어요.)
```

---

## Example B: Tests allowed, files locked

### User input

```
/ko-debug 테스트는 돌려도 되는데 파일은 바꾸지 마. 어디서 실패하는지 확인해줘.
```

### What pi-ko does

1. Normalizes → "Run tests to locate failures. Constraints: tests allowed, file writes locked."
2. Runs the test suite in read-only mode; does not edit any file.
3. Reports failures in Korean.

---

## Example C: High-risk incident mode

### User input

```
/ko-debug 운영 장애라고 생각하고 리스크 위주로 봐줘.
```

### What pi-ko does

1. Normalizes → "Review code/logs for production incident risks. Constraints: high-risk incident mode (bias to read-only, no writes without explicit confirmation)."
2. Reads logs, relevant code, and recent git changes.
3. Returns risk-prioritized analysis in Korean. Confirms with user before any write action.

---

## Safety verification (all three examples)

- No files were created, edited, or deleted (unless explicitly unlocked).
- "원인만" correctly suppressed fix generation.
- "테스트는 돌려도 되는데 파일은 바꾸지 마" correctly unlocked test commands while keeping file writes locked.
- "운영 장애" correctly triggered high-risk incident mode (conservative, read-only bias).

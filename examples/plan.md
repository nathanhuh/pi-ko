# Example: ko-plan

Demonstrates plan-only mode with a concurrency-sensitive design question.

---

## User input

```
/ko-plan Redis lock race condition 안전하게 고치는 방향만 알려줘.
```

## What pi-ko does

1. Normalizes → "Design a safe fix for the Redis distributed lock race condition. Constraints: no file writes, plan only."
2. Reads the relevant lock implementation code.
3. Returns a numbered Korean plan with concrete file/function references.

## Expected response shape (Korean)

```
현재 `src/cache/lock.service.ts`의 `acquireLock()` 구현에서 SET + EXPIRE를 따로 호출하는 구조가 race condition의 원인이에요.

수정 방향:

1. `SET key value NX PX <ttl>` 단일 명령으로 교체
   - 파일: `src/cache/lock.service.ts`, `LockService.acquireLock()`
   - `ioredis`의 `set(key, value, 'NX', 'PX', ttlMs)` 또는 Lua 스크립트 사용.

2. 해제 시 Lua 스크립트로 원자적 비교-삭제 적용
   - 파일: `src/cache/lock.service.ts`, `LockService.releaseLock()`
   - 소유자 토큰을 GET → DEL 대신 `if redis.call('GET', key) == owner then redis.call('DEL', key) end` 패턴.

3. 락 갱신(renewal) 로직이 있다면 동일하게 Lua로 감싸야 해요.
   - 파일: `src/cache/lock.service.ts`, `LockService.renewLock()` (존재하는 경우).

리스크: ioredis 버전이 4 미만이면 NX + PX 조합 지원을 확인해야 해요.

요약: SET NX PX 원자 명령 + Lua 해제 스크립트로 TOCTOU를 제거. 파일 수정은 이 계획 확인 후 진행하세요.
```

## Safety verification

- No files were created, edited, or deleted.
- "방향만 알려줘" correctly mapped to plan-only; implementation deferred.
- File paths and function names (`LockService.acquireLock()`, `ioredis`) preserved verbatim.

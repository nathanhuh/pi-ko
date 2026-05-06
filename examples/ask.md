# Example: ko-ask

Demonstrates read-only Q&A mode with an explicit "no edits" constraint.

---

## User input

```
/ko-ask 이 코드 설명해줘. 수정하지 말고.
```

## What pi-ko does

1. Normalizes Korean intent → "Explain the code in the current context. Constraints: no file writes, no shell side effects."
2. Reads relevant files (no modifications).
3. Returns a Korean explanation with all code/identifiers preserved verbatim.

## Expected response shape (Korean)

```
현재 파일에서 `AuthMiddleware` 클래스는 NestJS의 `NestMiddleware` 인터페이스를 구현해요.

주요 역할:
- `use(req, res, next)` 메서드에서 `Authorization` 헤더를 파싱해요.
- `JwtService.verify()`로 토큰을 검증하고 실패하면 `UnauthorizedException`을 던져요.
- 성공하면 `req.user`에 페이로드를 주입하고 `next()`를 호출해요.

...

요약: JWT 검증 미들웨어로, 인증 실패 시 401을 반환하고 성공 시 다음 핸들러로 넘겨요.
```

## Safety verification

- No files were created, edited, or deleted.
- "수정하지 말고" was correctly mapped to read-only constraint.
- Code identifiers (`AuthMiddleware`, `JwtService.verify()`, `UnauthorizedException`) preserved verbatim.

---
name: technical-text-preservation
description: Preserve code, file paths, identifiers, log lines, error messages, shell commands, and CLI flags verbatim in their original language even when the surrounding response is Korean. Use whenever responding in Korean about technical artifacts (code, errors, configs, logs).
---

# Technical Text Preservation

Korean prose explains technical artifacts; it does not translate or paraphrase them.

## Never translate or paraphrase

- **Source code** — any language. Copy byte-for-byte, including whitespace and comments.
- **File paths and URLs** — `src/auth/middleware.ts`, `https://api.example.com/v2/users`.
- **Package names, module paths, env-var names** — `express`, `@nestjs/core`, `DATABASE_URL`.
- **Variable, function, class, and method names** — `handleRequest`, `UserService`, `MAX_RETRIES`.
- **Stack traces and log lines** — reproduce exactly, including timestamps, log levels, and thread IDs.
- **Error messages and exit codes** — `ECONNREFUSED`, `TypeError: Cannot read properties of undefined`, exit code `137`.
- **Shell commands and flags** — `git rebase --onto main feature`, `npm run test:watch -- --testPathPattern=auth`.
- **HTTP methods and API names** — `POST /api/v1/sessions`, `GET /health`.
- **Configuration keys and values** — `max_connections: 100`, `LOG_LEVEL=debug`.

## Formatting rules

- Inline technical terms: use backticks — `handleRequest`.
- Multi-line code, stack traces, log blocks: use fenced code blocks with the correct language tag.
- If the original already uses a code block, preserve the language tag.

## What Korean prose covers

Korean sentences wrap around the preserved artifacts to explain:
- Why this line/function is the problem.
- What the identifier does or represents.
- What the error means in context.
- What the proposed change achieves.

Korean prose never replaces or rephrases the artifacts themselves.

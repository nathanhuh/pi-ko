# pi-ko Extension

## What it does

The pi-ko extension hooks Pi's `input` event to intercept every `/ko-*` turn before it reaches the expensive model. It calls Haiku to compress the Korean input to a tight English task, then forwards the English text to the expensive model. Korean responses are enforced via the `before_agent_start` system-prompt override.

This delivers input-side token savings on every turn. Korean tokenizes 1.5–2x heavier than English in most tokenizers; typical savings are 40–65% of input tokens.

## Token estimation methodology

Token counts in the dashboard are estimated, not billing-exact. The estimator uses:

- Korean text: 1 token ≈ 1.5 characters
- English text: 1 token ≈ 4 characters

Actual counts depend on the tokenizer. These heuristics are calibrated for Claude's cl100k-based tokenizer. Use them for relative comparison, not billing verification.

## Enabling the token dashboard

Add a `pi-ko` block to Pi's settings file (`~/.pi/agent/settings.json`):

```json
{
  "pi-ko": {
    "dashboard": true
  }
}
```

The dashboard appears as a notification after each `/ko-*` turn showing input token savings.

Example output:
```
  원문 한국어:  142 tokens
  압축 영어:     48 tokens
  입력 절감률:   66%
```

## --ko-direct flag

`--ko-direct` is registered as a Pi session flag. In v0.2 it is reserved (documented but has no behavioral effect). It will become functional in v0.3 when the output pipeline is wired up.

In v0.3, `--ko-direct` will opt out of the Haiku → Korean postprocessor step. Use it when you need Korean output as a direct artifact from the expensive model (e.g., for higher-quality translation of nuanced responses).

To set it for a session: `pi --ko-direct`

## What v0.2 does NOT do

- **Output token savings**: the expensive model still responds in Korean (same as v0.1). Full output savings (expensive model → English → Haiku → Korean) require a post-streaming response rewrite hook not yet available in the Pi extension API. That pipeline is implemented in `extension/postprocessor.ts` and activates in v0.3.

## Reporting compression errors

If the compressor mangles intent (wrong constraints extracted, wrong mode), the bug is in `extension/system-prompts.ts`'s `COMPRESSOR_SYSTEM_PROMPT`. File an issue at https://github.com/nathanhuh/pi-ko/issues with:
- The original Korean input
- The compressed English output (visible in Pi's verbose log)
- The observed vs. expected agent behavior

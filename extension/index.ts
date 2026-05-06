/**
 * pi-ko v0.2 extension
 *
 * Input pipeline (every /ko-* turn):
 *   Korean input → Haiku compresses to English task → expensive model sees English
 *
 * Output pipeline:
 *   Default: expensive model responds in Korean (system prompt carries the instruction)
 *   With --ko-direct flag: same as default (flag is a no-op in v0.2; reserved for v0.3)
 *
 *   Full output savings (English response → Haiku translates → Korean) require a
 *   post-streaming rewrite hook not yet available in the Pi extension API. That path
 *   is implemented in v0.3 once the API supports it.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { compressKorean } from "./preprocessor.js";
import { translateToKorean } from "./postprocessor.js";
import { estimateTokens, formatDashboard, type TurnStats } from "./token-estimator.js";
import { loadConfig } from "./config.js";

const PIKO_PROMPT_RE = /^\/(ko-ask|ko-plan|ko-review|ko-debug)\b/;
const KO_DIRECT_FLAG = "ko-direct";

interface TurnState {
  originalTokens: number;
  compressedTokens: number;
  direct: boolean;
  englishResponse?: string;
}

export default function piKoExtension(pi: ExtensionAPI): void {
  const config = loadConfig();

  pi.registerFlag(KO_DIRECT_FLAG, {
    type: "boolean",
    description:
      "Skip output translation: expensive model responds in Korean directly. " +
      "Saves input tokens only; slightly more output tokens than the default pipeline.",
    default: false,
  });

  const turnStates = new WeakMap<object, TurnState>();
  let currentTurnKey: object | null = null;

  pi.on("input", async (event, ctx) => {
    if (!PIKO_PROMPT_RE.test(event.text)) return;

    const apiKey = await ctx.modelRegistry.getApiKeyForProvider("anthropic");
    if (!apiKey) {
      ctx.ui.notify("pi-ko: no Anthropic API key found — skipping compression", "warning");
      return;
    }

    ctx.ui.setStatus("pi-ko", "압축 중…");
    try {
      const result = await compressKorean(event.text, apiKey, ctx.signal);

      currentTurnKey = {};
      const direct = (pi.getFlag(KO_DIRECT_FLAG) as boolean | undefined) ?? false;
      turnStates.set(currentTurnKey, {
        originalTokens: result.originalTokens,
        compressedTokens: result.compressedTokens,
        direct,
      });

      ctx.ui.setStatus("pi-ko", undefined);
      return { action: "transform", text: result.compressed };
    } catch (err) {
      ctx.ui.setStatus("pi-ko", undefined);
      ctx.ui.notify(`pi-ko: compression failed — ${err instanceof Error ? err.message : String(err)}`, "error");
      return;
    }
  });

  pi.on("before_agent_start", async (event, ctx) => {
    if (!currentTurnKey) return;
    const state = turnStates.get(currentTurnKey);
    if (!state) return;

    const langInstruction = state.direct
      ? "\n\nIMPORTANT (pi-ko --ko-direct): Respond in Korean."
      : "\n\nIMPORTANT (pi-ko): Respond in Korean. Preserve all code, paths, identifiers, log lines, and error messages verbatim in their original language.";

    return { systemPrompt: event.systemPrompt + langInstruction };
  });

  pi.on("agent_end", async (event, ctx) => {
    if (!currentTurnKey) return;
    const state = turnStates.get(currentTurnKey);
    if (!state || !config.dashboard) {
      currentTurnKey = null;
      return;
    }

    const stats: TurnStats = {
      originalTokens: state.originalTokens,
      compressedTokens: state.compressedTokens,
    };

    ctx.ui.notify(formatDashboard(stats), "info");
    currentTurnKey = null;
  });
}

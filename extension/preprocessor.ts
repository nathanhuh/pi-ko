import { COMPRESSOR_SYSTEM_PROMPT } from "./system-prompts.js";
import { estimateTokens } from "./token-estimator.js";

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicRequest {
  model: string;
  max_tokens: number;
  system: string;
  messages: AnthropicMessage[];
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
}

const HAIKU_MODEL = "claude-haiku-4-5-20251001";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export interface CompressResult {
  compressed: string;
  originalTokens: number;
  compressedTokens: number;
}

export async function compressKorean(
  text: string,
  apiKey: string,
  signal?: AbortSignal,
): Promise<CompressResult> {
  const originalTokens = estimateTokens(text);

  const body: AnthropicRequest = {
    model: HAIKU_MODEL,
    max_tokens: 400,
    system: COMPRESSOR_SYSTEM_PROMPT,
    messages: [{ role: "user", content: text }],
  };

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`pi-ko compressor failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as AnthropicResponse;
  const compressed = data.content.find((c) => c.type === "text")?.text?.trim() ?? text;

  return {
    compressed,
    originalTokens,
    compressedTokens: estimateTokens(compressed),
  };
}

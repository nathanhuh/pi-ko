import { TRANSLATOR_SYSTEM_PROMPT } from "./system-prompts.js";

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

export async function translateToKorean(
  englishResponse: string,
  apiKey: string,
  signal?: AbortSignal,
): Promise<string> {
  const body: AnthropicRequest = {
    model: HAIKU_MODEL,
    max_tokens: Math.min(Math.ceil(englishResponse.length / 2), 4096),
    system: TRANSLATOR_SYSTEM_PROMPT,
    messages: [{ role: "user", content: englishResponse }],
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
    throw new Error(`pi-ko translator failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as AnthropicResponse;
  return data.content.find((c) => c.type === "text")?.text?.trim() ?? englishResponse;
}

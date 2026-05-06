const KOREAN_CHARS_PER_TOKEN = 1.5;
const ENGLISH_CHARS_PER_TOKEN = 4;

function isKorean(text: string): boolean {
  const koreanChars = (text.match(/[가-힯ᄀ-ᇿ㄰-㆏]/g) || []).length;
  return koreanChars / text.length > 0.3;
}

export function estimateTokens(text: string): number {
  if (!text) return 0;
  const charsPerToken = isKorean(text) ? KOREAN_CHARS_PER_TOKEN : ENGLISH_CHARS_PER_TOKEN;
  return Math.ceil(text.length / charsPerToken);
}

export interface TurnStats {
  originalTokens: number;
  compressedTokens: number;
  outputOriginalTokens?: number;
  outputTranslatedTokens?: number;
}

export function formatDashboard(stats: TurnStats): string {
  const inputSaving = stats.originalTokens - stats.compressedTokens;
  const inputPct = stats.originalTokens > 0
    ? Math.round((inputSaving / stats.originalTokens) * 100)
    : 0;

  const lines = [
    `  원문 한국어:  ${stats.originalTokens} tokens`,
    `  압축 영어:    ${stats.compressedTokens} tokens`,
    `  입력 절감률:  ${inputPct}%`,
  ];

  if (stats.outputOriginalTokens !== undefined && stats.outputTranslatedTokens !== undefined) {
    const outputSaving = stats.outputOriginalTokens - stats.outputTranslatedTokens;
    const outputPct = stats.outputOriginalTokens > 0
      ? Math.round((outputSaving / stats.outputOriginalTokens) * 100)
      : 0;
    lines.push(`  출력 절감률:  ${outputPct}%`);
  }

  return lines.join("\n");
}

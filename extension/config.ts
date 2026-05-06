import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getAgentDir } from "@mariozechner/pi-coding-agent";

export interface PiKoConfig {
  dashboard: boolean;
}

const DEFAULT_CONFIG: PiKoConfig = {
  dashboard: false,
};

export function loadConfig(): PiKoConfig {
  const settingsPath = join(getAgentDir(), "settings.json");
  if (!existsSync(settingsPath)) return { ...DEFAULT_CONFIG };

  try {
    const raw = readFileSync(settingsPath, "utf-8");
    const settings = JSON.parse(raw) as Record<string, unknown>;
    const pikoBlock = settings["pi-ko"] as Partial<PiKoConfig> | undefined;
    if (!pikoBlock) return { ...DEFAULT_CONFIG };

    return {
      dashboard: typeof pikoBlock.dashboard === "boolean" ? pikoBlock.dashboard : DEFAULT_CONFIG.dashboard,
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export * from "./types";
export * from "./database-engine";
export * from "./ai-engine-stub";

import { DatabaseAskRKEngine } from "./database-engine";
import { AIAskRKEngine } from "./ai-engine-stub";
import type { AskRKEngine } from "./types";

let currentEngine: AskRKEngine | null = null;

/**
 * Factory function to retrieve the configured AskRKEngine.
 * Defaults to AIAskRKEngine which gracefully defaults to DatabaseAskRKEngine in V1.
 */
export function getAskRKEngine(): AskRKEngine {
  if (!currentEngine) {
    currentEngine = new AIAskRKEngine();
  }
  return currentEngine;
}

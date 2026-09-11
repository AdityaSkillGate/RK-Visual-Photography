export * from "@/lib/assistant";
export { DEFAULT_ASK_RK_FALLBACK as DEFAULT_FALLBACK_RESPONSE } from "@/lib/assistant";
export { DatabaseAskRKEngine as DatabaseFaqEngine } from "@/lib/assistant";

import { getAskRKEngine } from "@/lib/assistant";
export const defaultAssistantEngine = getAskRKEngine();

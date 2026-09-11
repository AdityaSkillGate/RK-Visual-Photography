import type { PublicChatbotQuestion } from "@/lib/supabase/queries";
import type { AskRKEngine, AskRKMessage, AskRKResponse, AskRKContext } from "./types";
import { DatabaseAskRKEngine } from "./database-engine";

/**
 * AIAskRKEngine (Prepared Provider Architecture)
 *
 * Implements the universal AskRKEngine interface to enable seamless integration
 * with Gemini API or custom Next.js LLM endpoints (/api/ask-rk) without rewriting any UI components.
 *
 * Currently routes to the grounded DatabaseAskRKEngine as V1 default,
 * ensuring zero hallucination and strict grounding until AI keys/endpoints are configured.
 */
export class AIAskRKEngine implements AskRKEngine {
  readonly id = "ai-gemini-prepared";
  readonly name = "Ask RK AI Assistant (Grounded LLM Ready)";

  private fallbackEngine: DatabaseAskRKEngine;

  constructor() {
    this.fallbackEngine = new DatabaseAskRKEngine();
  }

  async findAnswer(
    userQuery: string,
    knowledge: PublicChatbotQuestion[],
    history: AskRKMessage[] = [],
    context?: AskRKContext
  ): Promise<AskRKResponse> {
    const isAIEnabled = process.env.NEXT_PUBLIC_AI_ASSISTANT_ENABLED === "true";

    if (isAIEnabled) {
      try {
        // Optional client/server dispatch to /api/ask-rk
        const response = await fetch("/api/ask-rk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: userQuery,
            history,
            knowledge,
            context,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            question: userQuery,
            answer: data.answer,
            action_label: data.action_label,
            action_url: data.action_url,
            isFallback: Boolean(data.isFallback),
            source: "ai",
            suggestedFollowUps: data.suggestedFollowUps,
          };
        }
      } catch (err) {
        console.warn("AI Assistant endpoint unavailable, falling back to database engine:", err);
      }
    }

    // Default grounded V1 database resolution
    return this.fallbackEngine.findAnswer(userQuery, knowledge, history, context);
  }
}

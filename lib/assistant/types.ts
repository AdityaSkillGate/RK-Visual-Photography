import type { PublicChatbotQuestion } from "@/lib/supabase/queries";

export interface AskRKMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  action_label?: string | null;
  action_url?: string | null;
  isFallback?: boolean;
  category?: string | null;
  matchedQuestionId?: string | null;
}

export interface AskRKResponse {
  question: string;
  answer: string;
  action_label?: string | null;
  action_url?: string | null;
  isFallback: boolean;
  source: "database" | "ai" | "fallback";
  matchedQuestionId?: string;
  suggestedFollowUps?: string[];
}

export interface AskRKContext {
  activeCategory?: string;
  pathname?: string;
  studioPhone?: string;
  whatsappUrl?: string;
}

/**
 * Universal AskRKEngine interface.
 * Decouples the UI layer from the answer resolution strategy.
 * Implementations:
 * - DatabaseAskRKEngine (V1: Grounded deterministic CMS search)
 * - AIAskRKEngine (Future: LLM / Gemini API integration)
 */
export interface AskRKEngine {
  readonly id: string;
  readonly name: string;
  findAnswer(
    userQuery: string,
    knowledge: PublicChatbotQuestion[],
    history?: AskRKMessage[],
    context?: AskRKContext
  ): Promise<AskRKResponse>;
}

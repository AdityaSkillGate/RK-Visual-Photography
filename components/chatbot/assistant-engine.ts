import type { PublicChatbotQuestion } from "@/lib/supabase/queries";

export interface AssistantResponse {
  question: string;
  answer: string;
  action_label?: string | null;
  action_url?: string | null;
  isFallback: boolean;
  matchedQuestionId?: string;
}

export interface AssistantEngine {
  findAnswer: (
    userQuery: string,
    knowledge: PublicChatbotQuestion[]
  ) => Promise<AssistantResponse>;
}

/**
 * Standard luxury studio fallback response.
 * Complies with requirement: "Never invent business-specific pricing, availability or claims.
 * Only answer from configured CMS content. Add a fallback: Please contact RK Visual Photography for more details."
 */
export const DEFAULT_FALLBACK_RESPONSE: AssistantResponse = {
  question: "Custom Inquiry",
  answer:
    "Please contact RK Visual Photography for more details. We would be delighted to discuss your celebration dates, customized coverage, and vision directly with our concierge.",
  action_label: "Connect on WhatsApp",
  action_url: "https://wa.me/919876543210",
  isFallback: true,
};

/**
 * DatabaseFaqEngine
 *
 * Grounded database-driven search algorithm that matches user queries
 * to verified CMS FAQ questions without hallucination.
 *
 * Prepared for future LLM integration: Future agents (e.g. GeminiAssistantEngine)
 * implement the same AssistantEngine interface.
 */
export class DatabaseFaqEngine implements AssistantEngine {
  async findAnswer(
    rawQuery: string,
    knowledge: PublicChatbotQuestion[]
  ): Promise<AssistantResponse> {
    const query = rawQuery.toLowerCase().trim();

    if (!query || knowledge.length === 0) {
      return DEFAULT_FALLBACK_RESPONSE;
    }

    // 1. Direct or substring match on question title
    const directMatch = knowledge.find((item) => {
      const q = item.question.toLowerCase().trim();
      return q === query || q.includes(query) || query.includes(q);
    });

    if (directMatch) {
      return {
        question: directMatch.question,
        answer: directMatch.answer,
        action_label: directMatch.action_label,
        action_url: directMatch.action_url,
        isFallback: false,
        matchedQuestionId: directMatch.id,
      };
    }

    // 2. Keyword token scoring (ignoring common stop words)
    const stopWords = new Set([
      "a",
      "an",
      "the",
      "is",
      "are",
      "do",
      "does",
      "you",
      "your",
      "i",
      "we",
      "our",
      "can",
      "to",
      "in",
      "for",
      "of",
      "how",
      "what",
      "where",
      "when",
      "which",
      "and",
      "or",
      "it",
      "me",
      "my",
    ]);

    const queryTokens = query
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !stopWords.has(t));

    if (queryTokens.length === 0) {
      return DEFAULT_FALLBACK_RESPONSE;
    }

    let bestMatch: PublicChatbotQuestion | null = null;
    let highestScore = 0;

    for (const item of knowledge) {
      const qText = item.question.toLowerCase();
      const aText = item.answer.toLowerCase();
      let score = 0;

      for (const token of queryTokens) {
        // Higher weight for matches in the question heading
        if (qText.includes(token)) {
          score += 3;
        }
        // Moderate weight for matches in the answer body
        if (aText.includes(token)) {
          score += 1;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    // Minimum threshold score of 2 required to prevent accidental false matches
    if (bestMatch && highestScore >= 2) {
      return {
        question: bestMatch.question,
        answer: bestMatch.answer,
        action_label: bestMatch.action_label,
        action_url: bestMatch.action_url,
        isFallback: false,
        matchedQuestionId: bestMatch.id,
      };
    }

    // Return designated fallback
    return DEFAULT_FALLBACK_RESPONSE;
  }
}

export const defaultAssistantEngine = new DatabaseFaqEngine();

import type { PublicChatbotQuestion } from "@/lib/supabase/queries";
import type { AskRKEngine, AskRKMessage, AskRKResponse, AskRKContext } from "./types";

export const DEFAULT_ASK_RK_FALLBACK: AskRKResponse = {
  question: "Custom Inquiry",
  answer:
    "We don't have this specific detail configured in our verified studio records. Please contact RK Visual Photography directly—our studio concierge would be delighted to discuss your celebration dates, customized coverage, and vision.",
  action_label: "Chat via WhatsApp Concierge",
  action_url: "https://wa.me/919876543210",
  isFallback: true,
  source: "fallback",
  suggestedFollowUps: [
    "What services do you offer?",
    "How can I enquire or check date availability?",
    "What is your delivery timeline for wedding photos?",
  ],
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "do",
  "does",
  "did",
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
  "tell",
  "about",
  "offer",
  "offers",
  "provide",
  "provides",
  "please",
  "give",
]);

export class DatabaseAskRKEngine implements AskRKEngine {
  readonly id = "database-v1";
  readonly name = "RK Studio Database Engine (Grounded)";

  async findAnswer(
    rawQuery: string,
    knowledge: PublicChatbotQuestion[],
    _history?: AskRKMessage[],
    _context?: AskRKContext
  ): Promise<AskRKResponse> {
    const query = rawQuery.toLowerCase().trim();

    if (!query || knowledge.length === 0) {
      return DEFAULT_ASK_RK_FALLBACK;
    }

    // 1. Direct or exact substring match
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
        source: "database",
        matchedQuestionId: directMatch.id,
      };
    }

    // 2. Tokenized keyword relevance scoring
    const queryTokens = query
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

    if (queryTokens.length === 0) {
      return DEFAULT_ASK_RK_FALLBACK;
    }

    let bestMatch: PublicChatbotQuestion | null = null;
    let highestScore = 0;
    let bestTitleHits = 0;

    for (const item of knowledge) {
      const qText = item.question.toLowerCase();
      const aText = item.answer.toLowerCase();
      let score = 0;
      let titleHits = 0;

      for (const token of queryTokens) {
        if (qText.includes(token)) {
          score += 4; // High weight for question title
          titleHits++;
        } else if (aText.includes(token)) {
          score += 1; // Subtle weight for answer content
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
        bestTitleHits = titleHits;
      }
    }

    // Guard against ungrounded pricing, discount, or specific quote inquiries
    const isCommercialInquiry = /\b(discount|discounts|deal|deals|cheap|rate|rates|hourly|price|pricing|cost)\b/i.test(query);
    if (isCommercialInquiry) {
      const isConfiguredPackageQuestion = bestMatch && /package|included|customize/i.test(bestMatch.question);
      if (!isConfiguredPackageQuestion || bestTitleHits === 0) {
        return DEFAULT_ASK_RK_FALLBACK;
      }
    }

    // Require at least a strong match (e.g. title match or multiple keyword hits)
    if (bestMatch && (bestTitleHits > 0 || highestScore >= 5)) {
      return {
        question: bestMatch.question,
        answer: bestMatch.answer,
        action_label: bestMatch.action_label,
        action_url: bestMatch.action_url,
        isFallback: false,
        source: "database",
        matchedQuestionId: bestMatch.id,
      };
    }

    // Fallback: strictly no hallucination of pricing, discounts, or dates
    return DEFAULT_ASK_RK_FALLBACK;
  }
}

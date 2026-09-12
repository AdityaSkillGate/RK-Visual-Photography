"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Send,
  Sparkles,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
  MessageCircleQuestion,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { getAskRKEngine, type AskRKMessage } from "@/lib/assistant";
import { trackChatbotEventAction } from "@/app/admin/(dashboard)/chatbot/actions";
import type { ChatbotCategoryRow, PublicChatbotQuestion } from "@/lib/supabase/queries";

interface RKAssistantProps {
  categories: ChatbotCategoryRow[];
  questions: PublicChatbotQuestion[];
}

export default function RKAssistant({ categories, questions }: RKAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const pathname = usePathname();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<AskRKMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Vanakkam & Welcome to RK Visual Photography.\n\nI am your **Ask RK** studio assistant. Ask me about our ceremony coverage, packages, date availability, or delivery timelines across Tamil Nadu and worldwide.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Filter suggested questions by selected category
  const activeQuestions = questions.filter((q) => {
    if (!q.is_active) return false;
    if (activeCategoryId === "all") return true;
    const cat = (q as { chatbot_categories?: { id?: string; slug?: string } }).chatbot_categories;
    return (
      q.category_id === activeCategoryId ||
      cat?.id === activeCategoryId ||
      cat?.slug === activeCategoryId
    );
  });

  // Scroll to bottom of message list on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Keyboard accessibility: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input and track open event once per session
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);

      if (!hasInteracted) {
        setHasInteracted(true);
        trackChatbotEventAction("ask_rk_opened", { page: pathname }, pathname);
      }
    }
  }, [isOpen, hasInteracted, pathname]);

  const handleAskQuestionRef = useRef<(queryText: string, specificQuestion?: PublicChatbotQuestion) => void>(() => {});

  // Handle asking a question
  const handleAskQuestion = (queryText: string, specificQuestion?: PublicChatbotQuestion) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Add user message
    const userMessageId = "u_" + Date.now();
    const newHistory: AskRKMessage[] = [
      ...messages,
      {
        id: userMessageId,
        sender: "user",
        text: trimmed,
        timestamp: timeString,
        category: activeCategoryId,
      },
    ];

    setMessages(newHistory);
    setInputText("");
    setIsTyping(true);

    // Track query event
    trackChatbotEventAction(
      "ask_rk_query_submitted",
      { query: trimmed, specific_id: specificQuestion?.id || null, category: activeCategoryId },
      pathname
    );

    // 2. Resolve answer via decoupled AskRKEngine (AI-ready architecture)
    setTimeout(async () => {
      let response;
      if (specificQuestion) {
        response = {
          question: specificQuestion.question,
          answer: specificQuestion.answer,
          action_label: specificQuestion.action_label,
          action_url: specificQuestion.action_url,
          isFallback: false,
          source: "database" as const,
        };
      } else {
        const engine = getAskRKEngine();
        response = await engine.findAnswer(trimmed, questions, newHistory, {
          activeCategory: activeCategoryId,
          pathname,
          whatsappUrl: "https://wa.me/919876543210",
        });
      }

      setIsTyping(false);

      if (response.isFallback) {
        trackChatbotEventAction("ask_rk_fallback_triggered", { query: trimmed }, pathname);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "a_" + Date.now(),
          sender: "assistant",
          text: response.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          action_label: response.action_label,
          action_url: response.action_url,
          isFallback: response.isFallback,
          matchedQuestionId: response.matchedQuestionId,
        },
      ]);
    }, 400);
  };

  useEffect(() => {
    handleAskQuestionRef.current = handleAskQuestion;
  });

  // Listen for custom event to open Ask RK from anywhere on page (e.g. FAQ section button)
  useEffect(() => {
    const handleOpenAskRK = (e: Event) => {
      setIsOpen(true);
      const customEvent = e as CustomEvent<{ category?: string; query?: string }>;
      if (customEvent.detail?.category) {
        setActiveCategoryId(customEvent.detail.category);
      }
      if (customEvent.detail?.query) {
        setTimeout(() => {
          handleAskQuestionRef.current(customEvent.detail.query!);
        }, 300);
      }
    };

    window.addEventListener("open-ask-rk", handleOpenAskRK);
    return () => window.removeEventListener("open-ask-rk", handleOpenAskRK);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleAskQuestion(inputText);
    }
  };

  const handleResetConversation = () => {
    setMessages([
      {
        id: "welcome_" + Date.now(),
        sender: "assistant",
        text: "Conversation reset. Feel free to explore our topics below or connect with our concierge directly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleActionClick = (actionLabel: string, actionUrl: string) => {
    trackChatbotEventAction(
      "ask_rk_cta_clicked",
      { label: actionLabel, url: actionUrl },
      pathname
    );
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 pointer-events-none font-sans">
      {/* ============================================================================ */}
      {/* 1. ASK RK ASSISTANT SLIDE-IN PANEL */}
      {/* ============================================================================ */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask RK Assistant"
          className="pointer-events-auto fixed inset-x-3 bottom-20 top-14 sm:inset-x-auto sm:right-6 sm:bottom-24 sm:top-auto sm:w-[440px] md:w-[460px] sm:h-[620px] md:h-[640px] max-h-[calc(100dvh-6rem)] sm:max-h-[calc(100vh-7rem)] flex flex-col rounded-3xl border border-gold-500/30 bg-charcoal-950/98 backdrop-blur-2xl shadow-2xl shadow-charcoal-950/95 overflow-hidden animate-fade-in transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-bronze-border/50 bg-charcoal-900/90 px-4 sm:px-5 py-3.5 select-none">
            <div className="flex items-center gap-3">
              {/* Studio Monogram Emblem */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-charcoal-950 font-display text-sm font-black shadow-gold-subtle">
                RK
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-charcoal-900" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold tracking-wide text-ivory-100">
                    Ask RK
                  </h3>
                  <span className="rounded-full bg-gold-500/15 border border-gold-500/30 px-2 py-0.5 text-[9px] font-semibold text-gold-400 tracking-editorial uppercase">
                    Studio Assistant
                  </span>
                </div>
                <p className="text-[11px] text-sand-400 font-light flex items-center gap-1.5">
                  <span>Tamil Nadu Studio</span>
                  <span className="text-sand-600">•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={11} />
                    Verified Knowledge
                  </span>
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetConversation}
                className="rounded-xl p-2 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
                title="Close assistant (Esc)"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Dual Concierge Action Bar (WhatsApp & Inquiry) */}
          <div className="grid grid-cols-2 gap-2 border-b border-bronze-border/40 bg-charcoal-900/50 p-2.5">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleActionClick("WhatsApp Quick Action", "https://wa.me/919876543210")}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 py-2 px-3 text-center text-xs font-semibold uppercase tracking-editorial text-emerald-300 hover:bg-emerald-900/40 hover:border-emerald-500/60 transition-all shadow-sm group"
            >
              <WhatsAppIcon size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>WhatsApp Concierge</span>
            </a>

            <Link
              href="/contact"
              onClick={() => handleActionClick("Inquiry Quick Action", "/contact")}
              className="flex items-center justify-center gap-2 rounded-xl border border-gold-500/30 bg-charcoal-850 py-2 px-3 text-center text-xs font-semibold uppercase tracking-editorial text-gold-300 hover:bg-gold-500/15 hover:border-gold-500/60 transition-all shadow-sm group"
            >
              <Calendar size={14} className="text-gold-400 group-hover:scale-110 transition-transform" />
              <span>Reserve Dates</span>
            </Link>
          </div>

          {/* Category Navigation Buttons */}
          <div className="border-b border-bronze-border/40 bg-charcoal-900/30 px-3 py-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max">
              <button
                type="button"
                onClick={() => setActiveCategoryId("all")}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-editorial uppercase transition-all ${
                  activeCategoryId === "all"
                    ? "bg-gold-500 text-charcoal-950 font-bold shadow-sm"
                    : "bg-charcoal-800/80 text-sand-300 hover:text-ivory-100 hover:bg-charcoal-700/80 border border-bronze-border/40"
                }`}
              >
                All Topics
              </button>

              {categories
                .filter((c) => c.is_active)
                .map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-editorial uppercase transition-all ${
                      activeCategoryId === cat.id
                        ? "bg-gold-500 text-charcoal-950 font-bold shadow-sm"
                        : "bg-charcoal-800/80 text-sand-300 hover:text-ivory-100 hover:bg-charcoal-700/80 border border-bronze-border/40"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>
          </div>

          {/* Messages Dialogue Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                } space-y-1`}
              >
                {/* Bubble Container */}
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3.5 text-xs leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "rounded-tr-sm bg-charcoal-800 text-ivory-100 border border-bronze-border/50"
                      : "rounded-tl-sm bg-charcoal-900/95 text-sand-200 border border-gold-500/25"
                  }`}
                >
                  <p className="whitespace-pre-line text-xs font-light leading-relaxed">
                    {m.text}
                  </p>

                  {/* Fallback Direct Actions (WhatsApp & Inquiry) */}
                  {m.isFallback && (
                    <div className="mt-3.5 pt-3 border-t border-bronze-border/40 space-y-2">
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          handleActionClick("Fallback WhatsApp Concierge", "https://wa.me/919876543210")
                        }
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-2 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                      >
                        <WhatsAppIcon size={14} className="text-emerald-400" />
                        <span>Chat Directly on WhatsApp</span>
                      </a>

                      <Link
                        href="/contact"
                        onClick={() =>
                          handleActionClick("Fallback Website Inquiry", "/contact")
                        }
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-gold-500/15 border border-gold-500/40 px-3.5 py-2 text-[11px] font-semibold text-gold-300 hover:bg-gold-500/25 transition-colors"
                      >
                        <Calendar size={13} className="text-gold-400" />
                        <span>Submit Wedding Inquiry Form</span>
                      </Link>
                    </div>
                  )}

                  {/* Specific Action CTA from CMS */}
                  {!m.isFallback && m.action_label && m.action_url && (
                    <div className="mt-2.5 pt-2 border-t border-bronze-border/30">
                      <a
                        href={m.action_url}
                        target={m.action_url.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        onClick={() => handleActionClick(m.action_label!, m.action_url!)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500/15 border border-gold-500/40 px-3.5 py-1.5 text-[11px] font-semibold text-gold-300 hover:bg-gold-500/25 transition-colors"
                      >
                        {m.action_url.includes("wa.me") && (
                          <WhatsAppIcon size={12} className="text-emerald-400" />
                        )}
                        <span>{m.action_label}</span>
                        <ArrowUpRight size={11} className="opacity-70" />
                      </a>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-sand-500 px-1 font-mono">{m.timestamp}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-sand-400 text-xs pl-2">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[10px] font-light">Consulting studio records...</span>
              </div>
            )}

            {/* Suggested Questions Chips (Filtered by Category) */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-editorial text-gold-400 mb-2.5">
                <HelpCircle size={12} />
                <span>Suggested Questions</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {activeQuestions.length > 0 ? (
                  activeQuestions.slice(0, 5).map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleAskQuestion(q.question, q)}
                      className="flex items-center justify-between rounded-xl border border-bronze-border/50 bg-charcoal-900/80 px-3 py-2 text-left text-xs text-sand-200 hover:border-gold-500/40 hover:text-gold-300 hover:bg-charcoal-850 transition-all group"
                    >
                      <span className="font-light">{q.question}</span>
                      <ChevronRight size={13} className="text-sand-500 group-hover:text-gold-400 transition-colors shrink-0 ml-2" />
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-bronze-border/60 bg-charcoal-900/40 p-3 text-center">
                    <p className="text-[11px] text-sand-400 font-light mb-2">
                      Have a specific inquiry regarding this topic? Type below or connect with our concierge directly.
                    </p>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-editorial text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <WhatsAppIcon size={12} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="border-t border-bronze-border/50 bg-charcoal-900/95 p-3 sm:p-4">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about packages, dates, delivery, rituals..."
                className="flex-1 rounded-xl border border-bronze-border/60 bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-500 focus:border-gold-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-charcoal-950 hover:bg-gold-400 disabled:opacity-40 disabled:hover:bg-gold-500 transition-all shadow-sm"
                aria-label="Send inquiry"
              >
                <Send size={14} />
              </button>
            </form>

            <div className="flex items-center justify-between pt-2 px-1 text-[10px] text-sand-500 font-light">
              <span className="flex items-center gap-1">
                <ShieldCheck size={11} className="text-gold-500" />
                Verified studio records
              </span>
              <span>Direct Concierge: +91 98765 43210</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================ */}
      {/* 2. FLOATING LAUNCHER BUTTON */}
      {/* ============================================================================ */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Subtle closed tooltip badge */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-charcoal-950/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-ivory-100 shadow-2xl hover:border-gold-400 hover:text-gold-300 transition-all duration-300 group"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-display tracking-wide">Ask RK</span>
            <span className="text-[10px] uppercase font-mono text-gold-400/80 group-hover:text-gold-300">Concierge</span>
          </button>
        )}

        {/* Primary Circular Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative group ${
            isOpen ? "hidden sm:flex" : "flex"
          } h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
            isOpen
              ? "bg-charcoal-900 border border-gold-500/50 text-gold-400 rotate-90"
              : "bg-gradient-to-br from-charcoal-900 to-charcoal-950 border border-gold-500/50 text-gold-400 hover:border-gold-400 hover:scale-105 shadow-gold-subtle"
          }`}
          aria-label={isOpen ? "Close Ask RK assistant" : "Open Ask RK assistant"}
        >
          {isOpen ? (
            <X size={22} className="text-ivory-100" />
          ) : (
            <div className="flex items-center justify-center">
              <MessageCircleQuestion size={24} className="group-hover:scale-110 transition-transform text-gold-400" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-gold-500 ring-2 ring-charcoal-950" />
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

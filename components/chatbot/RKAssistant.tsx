"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Calendar,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { defaultAssistantEngine, DEFAULT_FALLBACK_RESPONSE } from "./assistant-engine";
import { trackChatbotEventAction } from "@/app/admin/(dashboard)/chatbot/actions";
import type { ChatbotCategoryRow, PublicChatbotQuestion } from "@/lib/supabase/queries";

interface MessageItem {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  action_label?: string | null;
  action_url?: string | null;
  isFallback?: boolean;
}

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
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Vanakkam & Welcome to RK Visual Photography. We curate timeless, editorial wedding memories across Tamil Nadu and destination celebrations worldwide. How may our studio concierge assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Filter suggested questions by selected category
  const activeQuestions = questions.filter((q) => {
    if (!q.is_active) return false;
    if (activeCategoryId === "all") return true;
    return q.category_id === activeCategoryId;
  });

  // Scroll to bottom of message list on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Keyboard accessibility: ESC to close, auto-focus input on open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);

      // Track open event once per session
      if (!hasInteracted) {
        setHasInteracted(true);
        trackChatbotEventAction("chatbot_opened", { page: pathname }, pathname);
      }
    }
  }, [isOpen, hasInteracted, pathname]);

  // Handle asking a question
  const handleAskQuestion = async (queryText: string, specificQuestion?: PublicChatbotQuestion) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Add user message
    const userMessageId = "u_" + Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: "user",
        text: trimmed,
        timestamp: timeString,
      },
    ]);

    setInputText("");
    setIsTyping(true);

    // Track question query event (privacy safe: only query text without user identity)
    trackChatbotEventAction(
      "chatbot_query_submitted",
      { query: trimmed, specific_id: specificQuestion?.id || null },
      pathname
    );

    // 2. Resolve answer via Grounded Assistant Engine
    setTimeout(async () => {
      let response;
      if (specificQuestion) {
        response = {
          question: specificQuestion.question,
          answer: specificQuestion.answer,
          action_label: specificQuestion.action_label,
          action_url: specificQuestion.action_url,
          isFallback: false,
        };
      } else {
        response = await defaultAssistantEngine.findAnswer(trimmed, questions);
      }

      setIsTyping(false);

      if (response.isFallback) {
        trackChatbotEventAction("chatbot_fallback_triggered", { query: trimmed }, pathname);
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
        },
      ]);
    }, 450);
  };

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
        text: "Conversation reset. Feel free to explore any of our studio questions below or connect with our concierge directly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleActionClick = (actionLabel: string, actionUrl: string) => {
    trackChatbotEventAction(
      "chatbot_cta_clicked",
      { label: actionLabel, url: actionUrl },
      pathname
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none font-sans">
      {/* ============================================================================ */}
      {/* 1. CHATBOT WINDOW DIALOG */}
      {/* ============================================================================ */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="RK Visual Studio Concierge"
          className="pointer-events-auto absolute bottom-16 sm:bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-[430px] h-[600px] max-h-[calc(100vh-6.5rem)] flex flex-col rounded-3xl border border-gold-500/30 bg-charcoal-950/95 backdrop-blur-2xl shadow-2xl shadow-charcoal-950/90 overflow-hidden animate-fade-in transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-bronze-border/50 bg-charcoal-900/90 px-4 sm:px-5 py-3.5 select-none">
            <div className="flex items-center gap-3">
              {/* Studio Monogram Emblem */}
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-charcoal-950 font-display text-xs font-black shadow-gold-subtle">
                RK
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-charcoal-900" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-semibold tracking-wide text-ivory-100">
                    RK Visual Concierge
                  </h3>
                  <span className="rounded-full bg-gold-500/15 border border-gold-500/30 px-1.5 py-0.2 text-[9px] font-semibold text-gold-400 tracking-editorial uppercase">
                    Assistant
                  </span>
                </div>
                <p className="text-[11px] text-sand-400 font-light flex items-center gap-1">
                  <span>Tamil Nadu Studio</span>
                  <span className="text-sand-600">•</span>
                  <span className="text-emerald-400">Database Verified</span>
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
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
                title="Minimize assistant (Esc)"
                aria-label="Close assistant"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Category Navigation Pills */}
          <div className="border-b border-bronze-border/40 bg-charcoal-900/40 px-3 py-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max">
              <button
                type="button"
                onClick={() => setActiveCategoryId("all")}
                className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-editorial uppercase transition-all ${
                  activeCategoryId === "all"
                    ? "bg-gold-500 text-charcoal-950 font-bold shadow-sm"
                    : "bg-charcoal-800/80 text-sand-300 hover:text-ivory-100 hover:bg-charcoal-700/80 border border-bronze-border/30"
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
                    className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-editorial uppercase transition-all ${
                      activeCategoryId === cat.id
                        ? "bg-gold-500 text-charcoal-950 font-bold shadow-sm"
                        : "bg-charcoal-800/80 text-sand-300 hover:text-ivory-100 hover:bg-charcoal-700/80 border border-bronze-border/30"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {/* Quick Action Concierge Strip */}
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-bronze-border/40 bg-charcoal-900/50 p-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleActionClick("WhatsApp Quick Action", "https://wa.me/919876543210")}
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-charcoal-950/80 p-2 text-center text-[10px] text-sand-200 hover:border hover:border-emerald-500/40 hover:text-emerald-300 transition-all"
              >
                <WhatsAppIcon size={14} className="text-emerald-400" />
                <span className="font-medium">WhatsApp</span>
              </a>

              <Link
                href="/contact"
                onClick={() => handleActionClick("Availability Quick Action", "/contact")}
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-charcoal-950/80 p-2 text-center text-[10px] text-sand-200 hover:border hover:border-gold-500/40 hover:text-gold-300 transition-all"
              >
                <Calendar size={14} className="text-gold-400" />
                <span className="font-medium">Check Dates</span>
              </Link>

              <Link
                href="/services"
                onClick={() => handleActionClick("Services Quick Action", "/services")}
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-charcoal-950/80 p-2 text-center text-[10px] text-sand-200 hover:border hover:border-gold-500/40 hover:text-gold-300 transition-all"
              >
                <Sparkles size={14} className="text-gold-400" />
                <span className="font-medium">Services</span>
              </Link>
            </div>

            {/* Rendered Dialogue Messages */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                } space-y-1`}
              >
                {/* Bubble Container */}
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "rounded-tr-sm bg-charcoal-800 text-ivory-100 border border-bronze-border/50"
                      : "rounded-tl-sm bg-charcoal-900/90 text-sand-200 border border-gold-500/20"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Fallback Contact Action Buttons */}
                  {m.isFallback && (
                    <div className="mt-3 pt-3 border-t border-bronze-border/40 space-y-2">
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          handleActionClick("Fallback WhatsApp Concierge", "https://wa.me/919876543210")
                        }
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-2 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                      >
                        <WhatsAppIcon size={14} className="text-emerald-400" />
                        <span>Chat Directly on WhatsApp</span>
                      </a>

                      <Link
                        href="/contact"
                        onClick={() =>
                          handleActionClick("Fallback Website Inquiry", "/contact")
                        }
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-gold-500/15 border border-gold-500/40 px-3 py-2 text-[11px] font-semibold text-gold-300 hover:bg-gold-500/25 transition-colors"
                      >
                        <Calendar size={13} className="text-gold-400" />
                        <span>Submit Wedding Inquiry Form</span>
                      </Link>
                    </div>
                  )}

                  {/* Specific Action CTA if configured in CMS */}
                  {!m.isFallback && m.action_label && m.action_url && (
                    <div className="mt-2.5 pt-2 border-t border-bronze-border/30">
                      <a
                        href={m.action_url}
                        target={m.action_url.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        onClick={() => handleActionClick(m.action_label!, m.action_url!)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500/15 border border-gold-500/40 px-3 py-1.5 text-[11px] font-medium text-gold-300 hover:bg-gold-500/25 transition-colors"
                      >
                        {m.action_url.includes("wa.me") && (
                          <WhatsAppIcon size={12} className="text-emerald-400" />
                        )}
                        <span>{m.action_label}</span>
                        <ExternalLink size={10} className="opacity-70" />
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

            {/* Suggested Question Chips (Filtered by Category) */}
            <div className="pt-2">
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-editorial text-sand-400 mb-2">
                <HelpCircle size={11} className="text-gold-400" />
                <span>Suggested Questions</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeQuestions.slice(0, 5).map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleAskQuestion(q.question, q)}
                    className="inline-flex items-center gap-1 rounded-xl border border-bronze-border/50 bg-charcoal-900/80 px-2.5 py-1.5 text-left text-[11px] text-sand-200 hover:border-gold-500/40 hover:text-gold-300 hover:bg-charcoal-800 transition-all"
                  >
                    <span>{q.question}</span>
                    <ChevronRight size={11} className="opacity-50 shrink-0" />
                  </button>
                ))}
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
                placeholder="Ask about dates, locations, albums..."
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
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-charcoal-950/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-sand-200 shadow-xl hover:border-gold-500 hover:text-gold-300 transition-all duration-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ask Studio Concierge</span>
          </button>
        )}

        {/* Primary Circular Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative group flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
            isOpen
              ? "bg-charcoal-900 border border-gold-500/50 text-gold-400 rotate-90"
              : "bg-gradient-to-br from-charcoal-900 to-charcoal-950 border border-gold-500/40 text-gold-400 hover:border-gold-400 hover:scale-105 shadow-gold-subtle"
          }`}
          aria-label={isOpen ? "Close studio assistant" : "Open studio assistant"}
        >
          {isOpen ? (
            <X size={22} className="text-ivory-100" />
          ) : (
            <div className="flex items-center justify-center">
              <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
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

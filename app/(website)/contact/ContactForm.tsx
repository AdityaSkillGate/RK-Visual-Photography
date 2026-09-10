"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { submitInquiryAction, type InquiryResult } from "./actions";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

interface ContactFormProps {
  initialService?: string;
}

const EVENT_TYPES = [
  "Luxury Tamil & South Indian Wedding",
  "Pre-Wedding & Destination Narrative",
  "Traditional Muhurtham & Reception",
  "Engagement & Sangeet Celebration",
  "Bespoke Bridal & Family Portraiture",
  "Other Milestone Celebration",
];

const PREFERRED_SERVICES = [
  "Complete Wedding Photography & 4K Cinema",
  "Editorial Photography & Fine-Art Italian Album",
  "Cinematography & Highlight Films Only",
  "Pre-Wedding Couple Narrative Session",
  "Multi-Day Traditional Heritage Coverage",
  "Unsure / Guidance Requested",
];

const BUDGET_RANGES = [
  "Under ₹2,00,000",
  "₹2,00,000 – ₹4,00,000",
  "₹4,00,000 – ₹7,00,000",
  "₹7,00,000 – ₹12,00,000",
  "₹12,00,000 and above",
  "Flexible / Requesting Consultation",
];

export default function ContactForm({ initialService }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState<InquiryResult | null, FormData>(
    submitInquiryAction,
    null
  );

  const [selectedEventType, setSelectedEventType] = useState(
    initialService || EVENT_TYPES[0]
  );
  const [selectedService, setSelectedService] = useState(PREFERRED_SERVICES[0]);

  useEffect(() => {
    if (initialService) {
      setSelectedEventType(initialService);
    }
  }, [initialService]);

  // ============================================================================
  // PREMIUM SUCCESS STATE
  // ============================================================================
  if (state?.success) {
    const details = state.inquiryDetails;
    const refCode = details?.referenceId ? `#${details.referenceId}` : "";
    const waText = encodeURIComponent(
      `Vanakkam RK Visual Studio, I just submitted a wedding consultation inquiry on your website${
        refCode ? ` (${refCode})` : ""
      } for our celebration in ${details?.location || "Tamil Nadu"}. We would love to discuss availability.`
    );
    const whatsappDirectUrl = `https://wa.me/919876543210?text=${waText}`;

    return (
      <div className="rounded-3xl border border-gold-500/40 bg-charcoal-900/80 p-8 sm:p-12 text-center space-y-7 shadow-2xl backdrop-blur-xl animate-fade-in">
        {/* Animated Gold Crest */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-charcoal-950 shadow-gold-subtle">
          <CheckCircle2 size={34} />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-300 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-gold-400" />
          </span>
        </div>

        <div className="space-y-2">
          {refCode && (
            <span className="inline-block rounded-full bg-gold-500/10 border border-gold-500/30 px-3 py-1 text-[11px] font-mono tracking-widest text-gold-400 uppercase">
              Reference {refCode}
            </span>
          )}
          <h3 className="font-display text-2xl sm:text-3xl font-light text-ivory-100 tracking-tight">
            Consultation Request Received
          </h3>
          <p className="text-xs sm:text-sm text-sand-300 font-light max-w-lg mx-auto leading-relaxed">
            Thank you, <span className="text-ivory-100 font-medium">{details?.name}</span>. We
            personally review every submission and will connect with your designated contact within{" "}
            <strong className="text-gold-300 font-medium">24 business hours</strong> with date
            availability and tailored bespoke investment options.
          </p>
        </div>

        {/* Inquiry Parameters Card */}
        {details && (
          <div className="mx-auto max-w-md rounded-2xl border border-bronze-border/60 bg-charcoal-950/60 p-4 text-left text-xs space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-gold-400 border-b border-bronze-border/30 pb-1.5 flex items-center justify-between">
              <span>Celebration Dossier</span>
              <span>Tamil Nadu Studio</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-sand-500 block text-[10px]">Celebration</span>
                <span className="text-ivory-100 font-medium">{details.eventType}</span>
              </div>
              {details.eventDate && (
                <div>
                  <span className="text-sand-500 block text-[10px]">Target Date</span>
                  <span className="text-ivory-100 font-medium">{details.eventDate}</span>
                </div>
              )}
              {details.location && (
                <div>
                  <span className="text-sand-500 block text-[10px]">Celebration Venue</span>
                  <span className="text-ivory-100 font-medium">{details.location}</span>
                </div>
              )}
              {details.guestCount && (
                <div>
                  <span className="text-sand-500 block text-[10px]">Estimated Guests</span>
                  <span className="text-ivory-100 font-medium">{details.guestCount} Attendees</span>
                </div>
              )}
            </div>
            {details.preferredService && (
              <div className="pt-1 border-t border-bronze-border/30 text-[11px]">
                <span className="text-sand-500 block text-[10px]">Requested Commission</span>
                <span className="text-gold-300 font-medium">{details.preferredService}</span>
              </div>
            )}
          </div>
        )}

        {/* Next Step Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          <a
            href={whatsappDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-5 py-3 text-xs font-semibold uppercase tracking-editorial text-emerald-300 hover:bg-emerald-900/40 transition-all shadow-sm"
          >
            <WhatsAppIcon size={15} className="text-emerald-400" />
            <span>Fast-Track on WhatsApp</span>
          </a>

          <Link
            href="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full border border-bronze-border bg-charcoal-800/80 px-5 py-3 text-xs font-semibold uppercase tracking-editorial text-sand-200 hover:text-ivory-100 hover:border-gold-500/40 transition-all"
          >
            <span>Explore Selected Work</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 text-xs text-sand-500 hover:text-sand-300 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Submit Another Consultation Inquiry</span>
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PUBLIC CONSULTATION FORM
  // ============================================================================
  return (
    <form
      action={formAction}
      className="space-y-6 rounded-3xl border border-bronze-border/70 bg-charcoal-900/50 p-6 sm:p-10 shadow-2xl backdrop-blur-md"
    >
      {/* Invisible Honeypot Trap (Anti-Bot) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_bot_trap">Do not fill this field</label>
        <input
          type="text"
          id="website_bot_trap"
          name="website_bot_trap"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Error Banner */}
      {state?.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-950/30 p-4 text-xs text-red-300 animate-fade-in">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block uppercase tracking-wider text-[10px]">
              Submission Note
            </span>
            <span className="leading-relaxed">{state.error}</span>
          </div>
        </div>
      )}

      {/* Form Intro Bar */}
      <div className="border-b border-bronze-border/40 pb-4">
        <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
          Client Consultation
        </span>
        <h2 className="font-display text-xl sm:text-2xl font-light text-ivory-100 tracking-tight mt-0.5">
          Reserve Your Celebration Date
        </h2>
      </div>

      {/* 1. Full Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-widest text-sand-400 block">
            Full Legal / Couple Name(s) <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Meera & Arun"
            className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/70 px-4 py-3 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-widest text-sand-400 block">
            Email Address <span className="text-gold-400">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="e.g. client@domain.com"
            className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/70 px-4 py-3 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors"
          />
        </div>
      </div>

      {/* 2. Phone / WhatsApp & Commission Event Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-widest text-sand-400 block">
            WhatsApp / Mobile Phone <span className="text-gold-400">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="e.g. +91 98765 43210"
            className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/70 px-4 py-3 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-widest text-sand-400 block">
            Celebration Type <span className="text-gold-400">*</span>
          </label>
          <select
            name="event_type"
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/70 px-4 py-3 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors"
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type} className="bg-charcoal-900 text-ivory-100">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Event Date & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-widest text-sand-400 block">
            Target Celebration Date(s)
          </label>
          <div className="relative">
            <input
              type="text"
              name="event_date"
              placeholder="e.g. 18 November 2026 or Muhurtham Tentative"
              className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/70 pl-10 pr-4 py-3 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors"
            />
            <Calendar
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-500 pointer-events-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-widest text-sand-400 block">
            Celebration City / Mandapam Venue
          </label>
          <div className="relative">
            <input
              type="text"
              name="location"
              placeholder="e.g. Chennai, Madurai, Coimbatore, Mahabalipuram"
              className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/70 pl-10 pr-4 py-3 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors"
            />
            <MapPin
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Guest Count & Preferred Service */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-widest text-sand-400 block">
            Estimated Guest Count
          </label>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={15000}
              name="expected_guests"
              placeholder="e.g. 450"
              className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/70 pl-10 pr-4 py-3 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors"
            />
            <Users
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-500 pointer-events-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-widest text-sand-400 block">
            Preferred Studio Service
          </label>
          <select
            name="preferred_service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/70 px-4 py-3 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors"
          >
            {PREFERRED_SERVICES.map((s) => (
              <option key={s} value={s} className="bg-charcoal-900 text-ivory-100">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. Budget Range (Optional) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono uppercase tracking-widest text-sand-400 block">
          Anticipated Photography & Cinema Investment (Optional)
        </label>
        <select
          name="budget_range"
          defaultValue={BUDGET_RANGES[1]}
          className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/70 px-4 py-3 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors"
        >
          {BUDGET_RANGES.map((b) => (
            <option key={b} value={b} className="bg-charcoal-900 text-ivory-100">
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* 6. Message / Vision */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono uppercase tracking-widest text-sand-400 block">
          Tell Us About Your Celebration & Aesthetic Vision
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Share your story, venue details, sacred rituals of particular significance, or any questions for our creative director..."
          className="w-full rounded-xl border border-bronze-border/80 bg-charcoal-950/70 px-4 py-3 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors resize-none leading-relaxed"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2.5 rounded-full bg-gold-500 py-4 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 disabled:opacity-50 transition-all shadow-gold-subtle"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Transmitting Consultation Dossier...</span>
            </>
          ) : (
            <>
              <span>Submit Consultation Request</span>
              <Send size={13} />
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-sand-500 font-light pt-1 px-1">
        <span className="flex items-center gap-1">
          <ShieldCheck size={12} className="text-gold-500" />
          Strictly Confidential
        </span>
        <span>Studio Response within 24 Hours</span>
      </div>
    </form>
  );
}

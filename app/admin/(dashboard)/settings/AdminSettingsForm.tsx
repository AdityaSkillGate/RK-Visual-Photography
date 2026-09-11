"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import {
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
  Settings,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  saveStudioSettings,
  saveExperienceMetrics,
  type StudioSettingsInput,
} from "./actions";
import type { ExperienceMetricItem } from "@/lib/supabase/fallback-data";

interface AdminSettingsFormProps {
  initialStudio: StudioSettingsInput;
  initialMetrics: ExperienceMetricItem[];
}

export default function AdminSettingsForm({
  initialStudio,
  initialMetrics,
}: AdminSettingsFormProps) {
  const [studio, setStudio] = useState<StudioSettingsInput>(initialStudio);
  const [metrics, setMetrics] = useState<ExperienceMetricItem[]>(initialMetrics);

  const [isSavingStudio, setIsSavingStudio] = useState(false);
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Handle studio fields change
  const handleStudioChange = (field: keyof StudioSettingsInput, value: string) => {
    setStudio((prev) => ({ ...prev, [field]: value }));
  };

  // Handle metric item change
  const handleMetricChange = (
    index: number,
    field: keyof ExperienceMetricItem,
    value: string
  ) => {
    setMetrics((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Save Studio Identity
  const handleSaveStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingStudio(true);
    setMessage(null);

    const res = await saveStudioSettings(studio);
    setIsSavingStudio(false);

    if (res.success) {
      setMessage({
        type: "success",
        text: "Studio identity and contact information saved successfully.",
      });
    } else {
      setMessage({
        type: "error",
        text: res.error || "Failed to update studio settings.",
      });
    }
  };

  // Save Experience Metrics
  const handleSaveMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMetrics(true);
    setMessage(null);

    const res = await saveExperienceMetrics(metrics);
    setIsSavingMetrics(false);

    if (res.success) {
      setMessage({
        type: "success",
        text: "Experience metrics successfully updated and published to homepage.",
      });
    } else {
      setMessage({
        type: "error",
        text: res.error || "Failed to update experience metrics.",
      });
    }
  };

  return (
    <div className="space-y-10">
      {/* Feedback Toast Banner */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-xs sm:text-sm ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/40 border-red-500/50 text-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle size={16} className="shrink-0 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. EXPERIENCE METRICS SECTION */}
      {/* ========================================================================= */}
      <form
        onSubmit={handleSaveMetrics}
        className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 p-6 sm:p-8 space-y-6"
      >
        <div className="border-b border-bronze-border/50 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-medium text-ivory-100 flex items-center gap-2">
              <TrendingUp size={18} className="text-gold-400" />
              <span>Experience & Milestone Metrics</span>
            </h2>
            <p className="text-xs text-sand-400 font-light mt-1">
              Live figures featured on the homepage metrics section. Supports formats like{" "}
              <code className="text-gold-400 font-mono">10+</code>,{" "}
              <code className="text-gold-400 font-mono">500+</code>,{" "}
              <code className="text-gold-400 font-mono">1200+</code>,{" "}
              <code className="text-gold-400 font-mono">15</code>.
            </p>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSavingMetrics}
            leftIcon={
              isSavingMetrics ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )
            }
          >
            {isSavingMetrics ? "Publishing..." : "Save Metrics"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={metric.id || `metric-${index}`}
              className="rounded-xl border border-bronze-border/50 bg-charcoal-950/60 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-gold-400 font-semibold">
                  Metric #{index + 1}
                </span>
                <span className="text-[10px] font-mono text-sand-500">
                  ID: {metric.id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1 space-y-1">
                  <label className="block text-[11px] font-medium uppercase tracking-editorial text-sand-300">
                    Display Value
                  </label>
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) =>
                      handleMetricChange(index, "value", e.target.value)
                    }
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-900 px-3 py-2 text-sm text-gold-400 font-mono font-semibold focus:border-gold-400 focus:outline-none"
                    placeholder="e.g. 10+"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[11px] font-medium uppercase tracking-editorial text-sand-300">
                    Label
                  </label>
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) =>
                      handleMetricChange(index, "label", e.target.value)
                    }
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-900 px-3 py-2 text-xs text-ivory-100 uppercase tracking-wider focus:border-gold-400 focus:outline-none"
                    placeholder="e.g. WEDDINGS SHOT"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium uppercase tracking-editorial text-sand-300">
                  Supporting Sentence / Caption
                </label>
                <input
                  type="text"
                  value={metric.description || ""}
                  onChange={(e) =>
                    handleMetricChange(index, "description", e.target.value)
                  }
                  className="w-full rounded-xl border border-bronze-border bg-charcoal-900 px-3 py-2 text-xs text-sand-300 focus:border-gold-400 focus:outline-none"
                  placeholder="Supporting editorial context"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSavingMetrics}
            leftIcon={
              isSavingMetrics ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )
            }
          >
            {isSavingMetrics ? "Publishing Changes..." : "Publish Metrics"}
          </Button>
        </div>
      </form>

      {/* ========================================================================= */}
      {/* 2. STUDIO IDENTITY & CONTACT */}
      {/* ========================================================================= */}
      <form
        onSubmit={handleSaveStudio}
        className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 p-6 sm:p-8 space-y-6"
      >
        <div className="border-b border-bronze-border/50 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-medium text-ivory-100 flex items-center gap-2">
              <Settings size={18} className="text-gold-400" />
              <span>Studio Identity & Global Parameters</span>
            </h2>
            <p className="text-xs text-sand-400 font-light mt-1">
              Displayed across meta tags, hero headers, contact pages, and footer credits.
            </p>
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={isSavingStudio}
            leftIcon={
              isSavingStudio ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )
            }
          >
            {isSavingStudio ? "Saving..." : "Save Identity"}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              Studio Name
            </label>
            <input
              type="text"
              value={studio.studio_name}
              onChange={(e) => handleStudioChange("studio_name", e.target.value)}
              className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none"
              placeholder="RK Visual Photography"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              Studio Tagline
            </label>
            <input
              type="text"
              value={studio.tagline}
              onChange={(e) => handleStudioChange("tagline", e.target.value)}
              className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none"
              placeholder="Luxury Editorial Photography"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              Contact Phone
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500">
                <Phone size={13} />
              </span>
              <input
                type="text"
                value={studio.phone}
                onChange={(e) => handleStudioChange("phone", e.target.value)}
                className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-8 pr-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none font-mono"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              WhatsApp Booking Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500">
                <Globe size={13} />
              </span>
              <input
                type="text"
                value={studio.whatsapp}
                onChange={(e) => handleStudioChange("whatsapp", e.target.value)}
                className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-8 pr-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none font-mono"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              Studio Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500">
                <Mail size={13} />
              </span>
              <input
                type="email"
                value={studio.email}
                onChange={(e) => handleStudioChange("email", e.target.value)}
                className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-8 pr-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none"
                placeholder="contact@rkvisual.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
              Location / Region
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500">
                <MapPin size={13} />
              </span>
              <input
                type="text"
                value={studio.address}
                onChange={(e) => handleStudioChange("address", e.target.value)}
                className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-8 pr-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none"
                placeholder="Tamil Nadu, India"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-bronze-border/50 flex justify-end">
          <Button
            type="submit"
            variant="secondary"
            size="md"
            disabled={isSavingStudio}
            leftIcon={
              isSavingStudio ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )
            }
          >
            {isSavingStudio ? "Saving Identity..." : "Save Studio Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}

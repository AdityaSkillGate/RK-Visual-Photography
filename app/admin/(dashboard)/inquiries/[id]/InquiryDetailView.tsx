"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAdminToast } from "@/components/admin/AdminToastContext";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";
import {
  updateInquiryStatusAction,
  updateInquiryNotesAction,
  toggleInquiryArchiveAction,
  deleteInquiryAction,
} from "../actions";
import type { InquiryRow } from "@/lib/supabase/queries";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  ArchiveRestore,
  Trash2,
  Save,
  ShieldCheck,
  PhoneCall,
  FileText,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

const STATUS_STEPS = [
  { key: "new", label: "NEW" },
  { key: "contacted", label: "CONTACTED" },
  { key: "follow_up", label: "FOLLOW-UP" },
  { key: "quoted", label: "QUOTED" },
  { key: "confirmed", label: "CONFIRMED" },
  { key: "completed", label: "COMPLETED" },
  { key: "cancelled", label: "CANCELLED" },
];

interface InquiryDetailViewProps {
  initialInquiry: InquiryRow;
}

export default function InquiryDetailView({ initialInquiry }: InquiryDetailViewProps) {
  const [inquiry, setInquiry] = useState<InquiryRow>(initialInquiry);
  const [notes, setNotes] = useState(initialInquiry.admin_notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const toast = useAdminToast();
  const confirm = useAdminConfirm();

  // Status Change
  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      setInquiry((prev) => ({ ...prev, status: newStatus }));
      const res = await updateInquiryStatusAction(inquiry.id, newStatus);
      if (res.success) {
        toast.success(`Inquiry status updated to ${newStatus.toUpperCase().replace("_", "-")}`);
      } else {
        setInquiry(inquiry);
        toast.error(res.error || "Failed to update status.");
      }
    });
  };

  // Notes Save
  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingNotes(true);
    const res = await updateInquiryNotesAction(inquiry.id, notes);
    setIsSavingNotes(false);

    if (res.success) {
      toast.success("Studio notes updated successfully.");
      setInquiry((prev) => ({ ...prev, admin_notes: notes }));
    } else {
      toast.error(res.error || "Failed to save notes.");
    }
  };

  // Archive / Restore
  const handleToggleArchive = () => {
    const nextArchived = !inquiry.is_archived;
    startTransition(async () => {
      setInquiry((prev) => ({ ...prev, is_archived: nextArchived }));
      const res = await toggleInquiryArchiveAction(inquiry.id, nextArchived);
      if (res.success) {
        toast.success(nextArchived ? "Inquiry moved to archive." : "Inquiry restored to active pipeline.");
      } else {
        setInquiry(inquiry);
        toast.error(res.error || "Failed to toggle archive.");
      }
    });
  };

  // Delete
  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Permanently Delete Inquiry?",
      message: `Delete inquiry record for "${inquiry.name}"? This record and notes cannot be recovered.`,
      confirmText: "Delete Permanently",
      variant: "danger",
    });

    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteInquiryAction(inquiry.id);
      if (res.success) {
        toast.success("Inquiry deleted successfully.");
        router.push("/admin/inquiries");
      } else {
        toast.error(res.error || "Failed to delete inquiry.");
      }
    });
  };

  // Outreach links
  const cleanPhone = inquiry.phone.replace(/[^0-9]/g, "");
  const waGreeting = encodeURIComponent(
    `Vanakkam ${inquiry.name}, thank you for contacting RK Visual Photography regarding your ${
      inquiry.event_type || "wedding"
    } celebration. We would love to discuss availability, custom packages, and your vision!`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${waGreeting}`;
  const mailtoUrl = `mailto:${inquiry.email}?subject=${encodeURIComponent(
    `RK Visual Photography — Consultation regarding your ${inquiry.event_type || "Celebration"}`
  )}`;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bronze-border/50 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inquiries"
            className="rounded-xl border border-bronze-border/60 bg-charcoal-900/80 p-2 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
            title="Return to pipeline"
          >
            <ArrowLeft size={16} />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
                Lead Dossier #{inquiry.id.slice(0, 8).toUpperCase()}
              </span>
              {inquiry.is_archived && (
                <span className="rounded-full bg-charcoal-800 border border-bronze-border px-2 py-0.5 text-[10px] font-semibold text-sand-400">
                  Archived
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-light text-ivory-100 tracking-tight">
              {inquiry.name}
            </h1>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggleArchive}
            className="gap-1.5"
          >
            {inquiry.is_archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            <span>{inquiry.is_archived ? "Restore to Pipeline" : "Archive Lead"}</span>
          </Button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl border border-bronze-border/60 bg-charcoal-900/60 p-2 text-sand-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
            title="Delete Inquiry Permanently"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* CRM Interactive Status Progression Stepper */}
      <div className="rounded-3xl border border-bronze-border/70 bg-charcoal-900/50 p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-sand-400 block">
            CRM Pipeline Stage Progression
          </span>
          <span className="text-xs text-gold-400 font-medium">
            Active: {inquiry.status.toUpperCase().replace("_", "-")}
          </span>
        </div>

        {/* Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          {STATUS_STEPS.map((step) => {
            const isCurrent = inquiry.status?.toLowerCase() === step.key.toLowerCase();
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => handleStatusChange(step.key)}
                className={`rounded-2xl p-2.5 text-center text-xs font-semibold uppercase tracking-editorial transition-all ${
                  isCurrent
                    ? "bg-gold-500 text-charcoal-950 shadow-gold-subtle font-bold scale-[1.02]"
                    : "border border-bronze-border/50 bg-charcoal-950/60 text-sand-400 hover:text-ivory-100 hover:border-gold-500/30"
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Direct Outreach Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-xs font-semibold uppercase tracking-editorial text-emerald-300 hover:bg-emerald-900/40 transition-all shadow-sm group"
        >
          <WhatsAppIcon size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>WhatsApp Client</span>
        </a>

        {/* Telephone */}
        <a
          href={`tel:${inquiry.phone.replace(/[^0-9+]/g, "")}`}
          className="flex items-center justify-center gap-2.5 rounded-2xl border border-bronze-border/70 bg-charcoal-900/70 p-4 text-xs font-semibold uppercase tracking-editorial text-sand-200 hover:text-ivory-100 hover:border-gold-500/40 transition-all group"
        >
          <PhoneCall size={16} className="text-gold-400 group-hover:scale-110 transition-transform" />
          <span>Call: {inquiry.phone}</span>
        </a>

        {/* Email */}
        <a
          href={mailtoUrl}
          className="flex items-center justify-center gap-2.5 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-4 text-xs font-semibold uppercase tracking-editorial text-gold-300 hover:bg-gold-500/20 transition-all group"
        >
          <Mail size={16} className="text-gold-400 group-hover:scale-110 transition-transform" />
          <span>Email: {inquiry.email}</span>
        </a>
      </div>

      {/* Main Grid: Parameters & Internal Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Commission Specifications */}
        <div className="lg:col-span-7 space-y-6">
          {/* Parameters Card */}
          <div className="rounded-3xl border border-bronze-border/70 bg-charcoal-900/50 p-6 sm:p-7 space-y-5">
            <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
              Celebration Specifications
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-bronze-border/40 bg-charcoal-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sand-500 block">
                  Celebration Offering
                </span>
                <span className="font-display text-base text-ivory-100 font-medium">
                  {inquiry.event_type}
                </span>
              </div>

              <div className="rounded-2xl border border-bronze-border/40 bg-charcoal-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sand-500 block">
                  Target Date(s)
                </span>
                <span className="font-display text-base text-ivory-100 font-medium flex items-center gap-1.5">
                  <Calendar size={14} className="text-gold-400" />
                  {inquiry.event_date || "Undecided / Muhurtham Window"}
                </span>
              </div>

              <div className="rounded-2xl border border-bronze-border/40 bg-charcoal-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sand-500 block">
                  Celebration Location / Venue
                </span>
                <span className="font-display text-base text-ivory-100 font-medium flex items-center gap-1.5">
                  <MapPin size={14} className="text-gold-400" />
                  {inquiry.location || "Tamil Nadu"}
                </span>
              </div>

              <div className="rounded-2xl border border-bronze-border/40 bg-charcoal-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sand-500 block">
                  Estimated Attendance
                </span>
                <span className="font-display text-base text-ivory-100 font-medium flex items-center gap-1.5">
                  <Users size={14} className="text-gold-400" />
                  {inquiry.expected_guests ? `${inquiry.expected_guests} Guests` : "Not specified"}
                </span>
              </div>
            </div>

            {inquiry.preferred_service && (
              <div className="rounded-2xl border border-gold-500/30 bg-gold-500/5 p-4 text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block">
                  Requested Commission Package
                </span>
                <span className="text-ivory-100 font-medium text-sm block">
                  {inquiry.preferred_service}
                </span>
              </div>
            )}

            {inquiry.budget_range && (
              <div className="rounded-2xl border border-bronze-border/40 bg-charcoal-950/60 p-3.5 text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sand-500 block">
                  Anticipated Investment Range
                </span>
                <span className="text-ivory-100 font-medium">{inquiry.budget_range}</span>
              </div>
            )}
          </div>

          {/* Client Aesthetic Vision & Message */}
          <div className="rounded-3xl border border-bronze-border/70 bg-charcoal-900/50 p-6 sm:p-7 space-y-3">
            <span className="text-overline uppercase tracking-widest text-sand-400 font-semibold block">
              Client Aesthetic Vision &amp; Notes
            </span>

            {inquiry.message ? (
              <div className="rounded-2xl border border-bronze-border/40 bg-charcoal-950/70 p-5 text-xs text-sand-200 leading-relaxed font-light whitespace-pre-line">
                {inquiry.message}
              </div>
            ) : (
              <p className="text-xs text-sand-500 italic">
                No custom message was provided with this inquiry submission.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Internal Studio Notes & Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Internal Studio Notes Form */}
          <form
            onSubmit={handleSaveNotes}
            className="rounded-3xl border border-gold-500/30 bg-charcoal-900/70 p-6 sm:p-7 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-bronze-border/40 pb-3">
              <div>
                <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                  Studio CRM Notes
                </span>
                <p className="text-[11px] text-sand-400 font-light">
                  Internal only • Not visible to client
                </p>
              </div>

              <button
                type="submit"
                disabled={isSavingNotes}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 disabled:opacity-50 transition-all shadow-sm"
              >
                <Save size={13} />
                <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record telephone summaries, quotation notes, dates discussed, mandapam restrictions, or photographer assignment..."
              className="w-full rounded-2xl border border-bronze-border/70 bg-charcoal-950/90 p-4 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-500 focus:outline-none leading-relaxed resize-none"
            />
          </form>

          {/* Metadata & Audit Card */}
          <div className="rounded-3xl border border-bronze-border/60 bg-charcoal-900/40 p-6 space-y-3 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sand-400 block border-b border-bronze-border/30 pb-2">
              Telemetry &amp; Ingestion Audit
            </span>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-sand-400">
                <span>Inquiry Ingestion:</span>
                <span className="font-mono text-ivory-100">
                  {new Date(inquiry.created_at).toLocaleString()}
                </span>
              </div>

              {inquiry.updated_at && (
                <div className="flex items-center justify-between text-sand-400">
                  <span>Last CRM Update:</span>
                  <span className="font-mono text-ivory-100">
                    {new Date(inquiry.updated_at).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sand-400">
                <span>Ingestion Source:</span>
                <span className="font-mono text-gold-400">{inquiry.source || "Website"}</span>
              </div>

              <div className="flex items-center justify-between text-sand-400">
                <span>Row-Level Security:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck size={12} />
                  Protected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

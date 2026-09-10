"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAdminToast } from "@/components/admin/AdminToastContext";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";
import {
  updateInquiryStatusAction,
  updateInquiryNotesAction,
  toggleInquiryArchiveAction,
  deleteInquiryAction,
} from "./actions";
import type { InquiryRow, InquiryPipelineStats } from "@/lib/supabase/queries";
import {
  Inbox,
  Search,
  Filter,
  Calendar,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  ArchiveRestore,
  Trash2,
  ExternalLink,
  Users,
  Sparkles,
  ChevronRight,
  FileText,
  Save,
  X,
  ArrowUpDown,
  PhoneCall,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeVariant: "gold" | "outline" | "charcoal"; bg: string; text: string }
> = {
  new: { label: "NEW", badgeVariant: "gold", bg: "bg-gold-500/15 border-gold-500/30", text: "text-gold-400" },
  contacted: { label: "CONTACTED", badgeVariant: "outline", bg: "bg-blue-500/15 border-blue-500/30", text: "text-blue-400" },
  follow_up: { label: "FOLLOW-UP", badgeVariant: "outline", bg: "bg-purple-500/15 border-purple-500/30", text: "text-purple-400" },
  quoted: { label: "QUOTED", badgeVariant: "outline", bg: "bg-amber-500/15 border-amber-500/30", text: "text-amber-400" },
  confirmed: { label: "CONFIRMED", badgeVariant: "gold", bg: "bg-emerald-500/20 border-emerald-500/40", text: "text-emerald-300" },
  completed: { label: "COMPLETED", badgeVariant: "charcoal", bg: "bg-charcoal-800 border-bronze-border/50", text: "text-sand-300" },
  cancelled: { label: "CANCELLED", badgeVariant: "charcoal", bg: "bg-red-500/10 border-red-500/20", text: "text-red-400" },
};

interface InquiriesManagerProps {
  initialInquiries: InquiryRow[];
  initialStats: InquiryPipelineStats;
}

export default function InquiriesManager({
  initialInquiries,
  initialStats,
}: InquiriesManagerProps) {
  const [inquiries, setInquiries] = useState<InquiryRow[]>(initialInquiries);
  const [stats, setStats] = useState<InquiryPipelineStats>(initialStats);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "event_date">("newest");
  const [showArchived, setShowArchived] = useState(false);

  // Quick Slide-Over Drawer
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRow | null>(null);
  const [drawerNotes, setDrawerNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const [isPending, startTransition] = useTransition();
  const toast = useAdminToast();
  const confirm = useAdminConfirm();

  // Open drawer and sync notes
  const openDrawer = (inq: InquiryRow) => {
    setSelectedInquiry(inq);
    setDrawerNotes(inq.admin_notes || "");
  };

  const closeDrawer = () => {
    setSelectedInquiry(null);
  };

  // Filtered & Sorted list
  const processedInquiries = useMemo(() => {
    return inquiries
      .filter((item) => {
        // Archive check
        if (showArchived) {
          if (!item.is_archived) return false;
        } else {
          if (item.is_archived) return false;
        }

        // Status check
        if (statusFilter !== "all" && item.status?.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }

        // Search check
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            item.name.toLowerCase().includes(q) ||
            item.email.toLowerCase().includes(q) ||
            item.phone.toLowerCase().includes(q) ||
            (item.location && item.location.toLowerCase().includes(q)) ||
            (item.event_type && item.event_type.toLowerCase().includes(q)) ||
            (item.preferred_service && item.preferred_service.toLowerCase().includes(q)) ||
            (item.message && item.message.toLowerCase().includes(q)) ||
            (item.admin_notes && item.admin_notes.toLowerCase().includes(q));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === "event_date") {
          if (!a.event_date) return 1;
          if (!b.event_date) return -1;
          return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
        }
        // Default newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [inquiries, showArchived, statusFilter, searchQuery, sortBy]);

  // ============================================================================
  // STATUS UPDATE
  // ============================================================================
  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      // Optimistic update
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      const res = await updateInquiryStatusAction(id, newStatus);
      if (res.success) {
        toast.success(`Inquiry status updated to ${newStatus.toUpperCase().replace("_", "-")}`);
      } else {
        // Revert on error
        setInquiries(inquiries);
        toast.error(res.error || "Failed to update status.");
      }
    });
  };

  // ============================================================================
  // NOTES UPDATE
  // ============================================================================
  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setIsSavingNotes(true);

    const res = await updateInquiryNotesAction(selectedInquiry.id, drawerNotes);
    setIsSavingNotes(false);

    if (res.success) {
      toast.success("Internal notes saved.");
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === selectedInquiry.id ? { ...item, admin_notes: drawerNotes } : item
        )
      );
      setSelectedInquiry((prev) => (prev ? { ...prev, admin_notes: drawerNotes } : null));
    } else {
      toast.error(res.error || "Failed to save notes.");
    }
  };

  // ============================================================================
  // ARCHIVE / UNARCHIVE
  // ============================================================================
  const handleToggleArchive = (item: InquiryRow) => {
    const nextArchived = !item.is_archived;
    startTransition(async () => {
      setInquiries((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_archived: nextArchived } : i))
      );
      if (selectedInquiry?.id === item.id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, is_archived: nextArchived } : null));
      }

      const res = await toggleInquiryArchiveAction(item.id, nextArchived);
      if (res.success) {
        toast.success(nextArchived ? "Inquiry archived." : "Inquiry restored to active pipeline.");
      } else {
        setInquiries(inquiries);
        toast.error(res.error || "Failed to toggle archive.");
      }
    });
  };

  // ============================================================================
  // DELETE INQUIRY
  // ============================================================================
  const handleDeleteInquiry = async (item: InquiryRow) => {
    const confirmed = await confirm({
      title: "Permanently Delete Inquiry?",
      message: `Delete inquiry record for "${item.name}"? This action is permanent and cannot be undone.`,
      confirmText: "Delete Permanently",
      variant: "danger",
    });

    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteInquiryAction(item.id);
      if (res.success) {
        toast.success("Inquiry deleted.");
        setInquiries((prev) => prev.filter((i) => i.id !== item.id));
        if (selectedInquiry?.id === item.id) {
          closeDrawer();
        }
      } else {
        toast.error(res.error || "Failed to delete inquiry.");
      }
    });
  };

  // Outreach Helpers
  const getWhatsAppLink = (inq: InquiryRow) => {
    const cleanNumber = inq.phone.replace(/[^0-9]/g, "");
    const greeting = encodeURIComponent(
      `Vanakkam ${inq.name}, thank you for reaching out to RK Visual Photography regarding your ${
        inq.event_type || "wedding"
      } celebration. We would love to discuss availability and details with you!`
    );
    return `https://wa.me/${cleanNumber}?text=${greeting}`;
  };

  const getMailtoLink = (inq: InquiryRow) => {
    const subject = encodeURIComponent(
      `RK Visual Photography — Consultation for your ${inq.event_type || "Celebration"}`
    );
    const body = encodeURIComponent(
      `Dear ${inq.name},\n\nThank you for considering RK Visual Photography to document your celebration.\n\nWe would be delighted to schedule a consultation...\n\nWarm regards,\nRK Visual Photography Studio`
    );
    return `mailto:${inq.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <AdminPageHeader
        title="Client Inquiries & CRM"
        description="Private client lead pipeline protected by Row-Level Security. Track consultations from inquiry to completed heirloom."
        badge={
          <Badge variant="gold" size="sm">
            {stats.total} Active Leads
          </Badge>
        }
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowArchived((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-editorial transition-colors ${
                showArchived
                  ? "border-gold-500 bg-gold-500/15 text-gold-300"
                  : "border-bronze-border/70 bg-charcoal-900/60 text-sand-300 hover:text-ivory-100 hover:bg-charcoal-850"
              }`}
            >
              <Archive size={14} />
              <span>{showArchived ? "Show Active Pipeline" : `Archived (${stats.archivedCount})`}</span>
            </button>
          </div>
        }
      />

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-bronze-border/60 bg-charcoal-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sand-400">
              Total Active
            </span>
            <Inbox size={14} className="text-sand-500" />
          </div>
          <p className="font-display text-2xl font-light text-ivory-100 mt-1">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-gold-500/40 bg-gold-500/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
              New Unread
            </span>
            <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
          </div>
          <p className="font-display text-2xl font-light text-gold-300 mt-1">{stats.newCount}</p>
        </div>

        <div className="rounded-2xl border border-bronze-border/60 bg-charcoal-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sand-400">
              In Negotiation
            </span>
            <Clock size={14} className="text-amber-400" />
          </div>
          <p className="font-display text-2xl font-light text-ivory-100 mt-1">
            {stats.followUpCount + stats.quotedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
              Confirmed
            </span>
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
          <p className="font-display text-2xl font-light text-emerald-300 mt-1">
            {stats.confirmedCount}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-bronze-border/60 bg-charcoal-900/60 p-3.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, phone, location, or notes..."
            className="w-full rounded-xl border border-bronze-border/60 bg-charcoal-950/80 pl-9 pr-4 py-2 text-xs text-ivory-100 placeholder-sand-500 focus:border-gold-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-200"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort & Status dropdowns */}
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="flex items-center gap-1 bg-charcoal-950/80 rounded-xl border border-bronze-border/60 px-2 py-1">
            <ArrowUpDown size={12} className="text-sand-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort inquiries"
              className="bg-transparent text-xs text-sand-200 focus:outline-none pr-1"
            >
              <option value="newest" className="bg-charcoal-900">
                Newest Inquiries
              </option>
              <option value="oldest" className="bg-charcoal-900">
                Oldest Inquiries
              </option>
              <option value="event_date" className="bg-charcoal-900">
                Event Date
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex border-b border-bronze-border/50 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-editorial transition-all ${
              statusFilter === "all"
                ? "bg-gold-500 text-charcoal-950 shadow-sm"
                : "text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800"
            }`}
          >
            All Leads ({inquiries.filter((i) => (showArchived ? i.is_archived : !i.is_archived)).length})
          </button>

          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = inquiries.filter(
              (i) =>
                (showArchived ? i.is_archived : !i.is_archived) &&
                i.status?.toLowerCase() === key.toLowerCase()
            ).length;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-editorial transition-all ${
                  statusFilter === key
                    ? "bg-gold-500 text-charcoal-950 shadow-sm"
                    : "text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800"
                }`}
              >
                <span>{cfg.label}</span>
                <span className="ml-1.5 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table */}
      {processedInquiries.length === 0 ? (
        <AdminEmptyState
          icon={Inbox}
          title={showArchived ? "No Archived Inquiries" : "No Inquiries Match Filter"}
          description={
            searchQuery || statusFilter !== "all"
              ? "Try clearing your search or status filter to reveal inquiries."
              : "New consultation requests submitted through the public website will appear here in real-time."
          }
        />
      ) : (
        <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-bronze-border/60 bg-charcoal-850/80 text-[11px] uppercase tracking-wider text-sand-400">
                <tr>
                  <th className="py-3.5 px-4 font-medium">Client</th>
                  <th className="py-3.5 px-4 font-medium">Event &amp; Offering</th>
                  <th className="py-3.5 px-4 font-medium">Direct Outreach</th>
                  <th className="py-3.5 px-4 font-medium">Status</th>
                  <th className="py-3.5 px-4 font-medium">Submitted</th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bronze-border/40 text-sand-300">
                {processedInquiries.map((inq) => {
                  const statusInfo = STATUS_CONFIG[inq.status?.toLowerCase()] || STATUS_CONFIG.new;

                  return (
                    <tr
                      key={inq.id}
                      className="hover:bg-charcoal-850/50 transition-colors group cursor-pointer"
                      onClick={() => openDrawer(inq)}
                    >
                      {/* Client */}
                      <td className="py-3.5 px-4 font-medium text-ivory-100">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm group-hover:text-gold-300 transition-colors">
                              {inq.name}
                            </span>
                            {inq.admin_notes && (
                              <span
                                title="Has internal studio notes"
                                className="inline-flex h-2 w-2 rounded-full bg-gold-400"
                              />
                            )}
                          </div>
                          {inq.location && (
                            <span className="block text-[11px] text-sand-400 font-light flex items-center gap-1">
                              <MapPin size={11} className="text-gold-500" />
                              {inq.location}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Event & Offering */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-medium text-sand-200 block">
                            {inq.event_type || "Wedding Documentation"}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-sand-500">
                            {inq.event_date && (
                              <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                {inq.event_date}
                              </span>
                            )}
                            {inq.expected_guests && (
                              <span className="flex items-center gap-1">
                                <Users size={11} />
                                {inq.expected_guests} guests
                              </span>
                            )}
                          </div>
                          {inq.preferred_service && (
                            <span className="text-[10px] text-gold-400 block font-light">
                              {inq.preferred_service}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Direct Outreach Shortcuts */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          {inq.phone && (
                            <a
                              href={getWhatsAppLink(inq)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-2 text-emerald-400 hover:bg-emerald-900/40 hover:border-emerald-500 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <WhatsAppIcon size={14} />
                            </a>
                          )}

                          {inq.phone && (
                            <a
                              href={`tel:${inq.phone.replace(/[^0-9+]/g, "")}`}
                              className="rounded-xl border border-bronze-border/60 bg-charcoal-950/60 p-2 text-sand-300 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                              title="Call Client"
                            >
                              <PhoneCall size={14} />
                            </a>
                          )}

                          {inq.email && (
                            <a
                              href={getMailtoLink(inq)}
                              className="rounded-xl border border-bronze-border/60 bg-charcoal-950/60 p-2 text-sand-300 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                              title="Send Email"
                            >
                              <Mail size={14} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={inq.status?.toLowerCase() || "new"}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          aria-label={`Update status for ${inq.name}`}
                          className={`rounded-xl border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-editorial focus:outline-none ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                            <option key={k} value={k} className="bg-charcoal-900 text-ivory-100">
                              {cfg.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 text-sand-500 text-[11px] font-mono">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/inquiries/${inq.id}`}
                            className="rounded-xl border border-bronze-border/60 bg-charcoal-950/60 px-2.5 py-1.5 text-xs text-gold-400 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                            title="Open Full Dossier"
                          >
                            <span>Dossier</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleToggleArchive(inq)}
                            className="rounded-xl border border-bronze-border/60 bg-charcoal-950/60 p-1.5 text-sand-400 hover:text-ivory-100 transition-colors"
                            title={inq.is_archived ? "Restore Inquiry" : "Archive Inquiry"}
                          >
                            {inq.is_archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================================ */}
      {/* QUICK SLIDE-OVER DRAWER FOR RAPID CLIENT INSPECTION */}
      {/* ============================================================================ */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-charcoal-950/75 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg bg-charcoal-900 border-l border-bronze-border/80 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-bronze-border/50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
                      Client Dossier
                    </span>
                    <Badge
                      variant={
                        selectedInquiry.status === "new"
                          ? "gold"
                          : selectedInquiry.status === "confirmed"
                          ? "gold"
                          : "outline"
                      }
                      size="sm"
                    >
                      {selectedInquiry.status.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="font-display text-2xl font-light text-ivory-100 mt-1">
                    {selectedInquiry.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-xl p-1.5 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Direct Outreach Quick Bar */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={getWhatsAppLink(selectedInquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40 transition-colors"
                >
                  <WhatsAppIcon size={14} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={getMailtoLink(selectedInquiry)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gold-500/40 bg-gold-500/10 py-2.5 text-xs font-semibold text-gold-300 hover:bg-gold-500/20 transition-colors"
                >
                  <Mail size={14} />
                  <span>Email</span>
                </a>

                <a
                  href={`tel:${selectedInquiry.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-bronze-border/70 bg-charcoal-800 py-2.5 text-xs font-semibold text-sand-200 hover:text-ivory-100 transition-colors"
                >
                  <Phone size={14} />
                  <span>Call</span>
                </a>
              </div>

              {/* Celebration Parameters */}
              <div className="rounded-2xl border border-bronze-border/60 bg-charcoal-950/60 p-4 space-y-3 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block border-b border-bronze-border/30 pb-1">
                  Commission Specification
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-sand-500 block text-[10px]">Celebration</span>
                    <span className="text-ivory-100 font-medium">{selectedInquiry.event_type}</span>
                  </div>
                  <div>
                    <span className="text-sand-500 block text-[10px]">Target Date</span>
                    <span className="text-ivory-100 font-medium">
                      {selectedInquiry.event_date || "Date Undecided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sand-500 block text-[10px]">Venue / City</span>
                    <span className="text-ivory-100 font-medium">
                      {selectedInquiry.location || "Tamil Nadu"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sand-500 block text-[10px]">Guest Count</span>
                    <span className="text-ivory-100 font-medium">
                      {selectedInquiry.expected_guests
                        ? `${selectedInquiry.expected_guests} guests`
                        : "Not specified"}
                    </span>
                  </div>
                </div>

                {selectedInquiry.preferred_service && (
                  <div className="pt-2 border-t border-bronze-border/30">
                    <span className="text-sand-500 block text-[10px]">Preferred Service</span>
                    <span className="text-gold-300 font-medium">
                      {selectedInquiry.preferred_service}
                    </span>
                  </div>
                )}

                {selectedInquiry.budget_range && (
                  <div>
                    <span className="text-sand-500 block text-[10px]">Anticipated Budget</span>
                    <span className="text-ivory-100">{selectedInquiry.budget_range}</span>
                  </div>
                )}
              </div>

              {/* Client Message / Aesthetic Vision */}
              {selectedInquiry.message && (
                <div className="rounded-2xl border border-bronze-border/60 bg-charcoal-950/60 p-4 space-y-2 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-sand-400 block">
                    Client Aesthetic Vision &amp; Notes
                  </span>
                  <p className="text-sand-300 font-light leading-relaxed whitespace-pre-line">
                    {selectedInquiry.message}
                  </p>
                </div>
              )}

              {/* Status Stepper Dropdown */}
              <div className="rounded-2xl border border-bronze-border/60 bg-charcoal-950/60 p-4 space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-sand-400 block">
                  CRM Progression Stage
                </label>
                <select
                  value={selectedInquiry.status?.toLowerCase() || "new"}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="w-full rounded-xl border border-bronze-border/70 bg-charcoal-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                >
                  {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                    <option key={k} value={k} className="bg-charcoal-900 text-ivory-100">
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Internal Studio Notes */}
              <div className="rounded-2xl border border-bronze-border/60 bg-charcoal-950/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-sand-400 block">
                    Internal Studio Notes (Private)
                  </label>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-400 hover:text-gold-300 transition-colors disabled:opacity-50"
                  >
                    <Save size={12} />
                    <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Record call summaries, bespoke quotes, mandapam logistics, or photographer assignment..."
                  className="w-full rounded-xl border border-bronze-border/70 bg-charcoal-900 p-3 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="border-t border-bronze-border/50 pt-4 flex items-center justify-between">
              <Link
                href={`/admin/inquiries/${selectedInquiry.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-4 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-sm"
              >
                <span>Open Full Dossier</span>
                <ExternalLink size={12} />
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleArchive(selectedInquiry)}
                >
                  {selectedInquiry.is_archived ? "Restore" : "Archive"}
                </Button>
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(selectedInquiry)}
                  className="rounded-xl border border-bronze-border/60 p-2 text-sand-500 hover:text-red-400 hover:border-red-500/40 transition-colors"
                  title="Delete Inquiry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

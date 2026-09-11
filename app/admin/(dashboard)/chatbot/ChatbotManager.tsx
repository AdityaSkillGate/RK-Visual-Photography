"use client";

import React, { useState, useTransition } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAdminToast } from "@/components/admin/AdminToastContext";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";
import {
  createChatbotCategoryAction,
  updateChatbotCategoryAction,
  deleteChatbotCategoryAction,
  toggleChatbotCategoryActiveAction,
  reorderChatbotCategoriesAction,
  createChatbotQuestionAction,
  updateChatbotQuestionAction,
  deleteChatbotQuestionAction,
  toggleChatbotQuestionActiveAction,
  reorderChatbotQuestionsAction,
  type ChatbotCategoryInput,
  type ChatbotQuestionInput,
} from "./actions";
import type { ChatbotCategoryRow, ChatbotQuestionRow } from "@/lib/supabase/queries";
import {
  Bot,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Search,
  FolderPlus,
  HelpCircle,
  MessageSquare,
  Sparkles,
  X,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

interface ExtendedQuestionRow extends ChatbotQuestionRow {
  chatbot_categories?: { name: string } | null;
}

interface ChatbotManagerProps {
  initialCategories: ChatbotCategoryRow[];
  initialQuestions: ExtendedQuestionRow[];
}

export default function ChatbotManager({
  initialCategories,
  initialQuestions,
}: ChatbotManagerProps) {
  const [activeTab, setActiveTab] = useState<"questions" | "categories">("questions");
  const [categories, setCategories] = useState<ChatbotCategoryRow[]>(initialCategories);
  const [questions, setQuestions] = useState<ExtendedQuestionRow[]>(initialQuestions);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Question Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ExtendedQuestionRow | null>(null);
  const [qCategoryId, setQCategoryId] = useState("");
  const [qQuestion, setQQuestion] = useState("");
  const [qAnswer, setQAnswer] = useState("");
  const [qActionLabel, setQActionLabel] = useState("");
  const [qActionUrl, setQActionUrl] = useState("");
  const [qActive, setQActive] = useState(true);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ChatbotCategoryRow | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catActive, setCatActive] = useState(true);

  // Live Assistant Preview Modal State
  const [previewQuestion, setPreviewQuestion] = useState<ExtendedQuestionRow | null>(null);

  const [isPending, startTransition] = useTransition();
  const toast = useAdminToast();
  const confirm = useAdminConfirm();

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.action_label && q.action_label.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === "all" || q.category_id === selectedCategoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && q.is_active) ||
      (statusFilter === "inactive" && !q.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // ==============================================================================
  // QUESTION HANDLERS
  // ==============================================================================

  const openCreateQuestionModal = () => {
    setEditingQuestion(null);
    setQCategoryId(categories[0]?.id || "");
    setQQuestion("");
    setQAnswer("");
    setQActionLabel("");
    setQActionUrl("");
    setQActive(true);
    setIsQuestionModalOpen(true);
  };

  const openEditQuestionModal = (q: ExtendedQuestionRow) => {
    setEditingQuestion(q);
    setQCategoryId(q.category_id || "");
    setQQuestion(q.question);
    setQAnswer(q.answer);
    setQActionLabel(q.action_label || "");
    setQActionUrl(q.action_url || "");
    setQActive(q.is_active);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qQuestion.trim() || !qAnswer.trim()) {
      toast.error("Question prompt and answer are required.");
      return;
    }

    const payload: ChatbotQuestionInput = {
      category_id: qCategoryId || null,
      question: qQuestion.trim(),
      answer: qAnswer.trim(),
      action_label: qActionLabel.trim() || null,
      action_url: qActionUrl.trim() || null,
      is_active: qActive,
    };

    startTransition(async () => {
      if (editingQuestion) {
        const res = await updateChatbotQuestionAction(editingQuestion.id, payload);
        if (res.success && res.data) {
          toast.success("Question updated successfully.");
          setQuestions((prev) =>
            prev.map((item) =>
              item.id === editingQuestion.id
                ? {
                    ...(res.data as ExtendedQuestionRow),
                    chatbot_categories: categories.find((c) => c.id === payload.category_id)
                      ? { name: categories.find((c) => c.id === payload.category_id)!.name }
                      : null,
                  }
                : item
            )
          );
          setIsQuestionModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update question.");
        }
      } else {
        const res = await createChatbotQuestionAction(payload);
        if (res.success && res.data) {
          toast.success("New question added to knowledge base.");
          const created = res.data as ExtendedQuestionRow;
          created.chatbot_categories = categories.find((c) => c.id === payload.category_id)
            ? { name: categories.find((c) => c.id === payload.category_id)!.name }
            : null;
          setQuestions((prev) => [...prev, created]);
          setIsQuestionModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create question.");
        }
      }
    });
  };

  const handleToggleQuestionActive = (q: ExtendedQuestionRow) => {
    startTransition(async () => {
      // Optimistic update
      setQuestions((prev) =>
        prev.map((item) => (item.id === q.id ? { ...item, is_active: !item.is_active } : item))
      );
      const res = await toggleChatbotQuestionActiveAction(q.id, q.is_active);
      if (res.success) {
        toast.success(
          `Question ${q.is_active ? "deactivated" : "activated"}.`
        );
      } else {
        // Revert
        setQuestions((prev) =>
          prev.map((item) => (item.id === q.id ? { ...item, is_active: q.is_active } : item))
        );
        toast.error(res.error || "Failed to toggle question status.");
      }
    });
  };

  const handleDeleteQuestion = async (q: ExtendedQuestionRow) => {
    const confirmed = await confirm({
      title: "Delete FAQ Question?",
      message: `Are you sure you want to delete "${q.question}"? Clients will no longer receive this response.`,
      confirmText: "Delete Question",
      variant: "danger",
    });

    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteChatbotQuestionAction(q.id);
      if (res.success) {
        toast.success("Question removed.");
        setQuestions((prev) => prev.filter((item) => item.id !== q.id));
      } else {
        toast.error(res.error || "Failed to delete question.");
      }
    });
  };

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const newQuestions = [...questions];
    const [moved] = newQuestions.splice(index, 1);
    newQuestions.splice(targetIndex, 0, moved);

    const reorderedPayload = newQuestions.map((q, idx) => ({
      id: q.id,
      order_index: idx + 1,
    }));

    setQuestions(newQuestions.map((q, idx) => ({ ...q, order_index: idx + 1 })));

    startTransition(async () => {
      const res = await reorderChatbotQuestionsAction(reorderedPayload);
      if (!res.success) {
        toast.error(res.error || "Failed to save question ordering.");
        setQuestions(questions); // Revert
      }
    });
  };


  // ==============================================================================
  // CATEGORY HANDLERS
  // ==============================================================================

  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCatName("");
    setCatSlug("");
    setCatDescription("");
    setCatActive(true);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: ChatbotCategoryRow) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDescription(cat.description || "");
    setCatActive(cat.is_active);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.error("Category name is required.");
      return;
    }

    const payload: ChatbotCategoryInput = {
      name: catName.trim(),
      slug: catSlug.trim() || undefined,
      description: catDescription.trim() || null,
      is_active: catActive,
    };

    startTransition(async () => {
      if (editingCategory) {
        const res = await updateChatbotCategoryAction(editingCategory.id, payload);
        if (res.success && res.data) {
          toast.success("Category updated.");
          setCategories((prev) =>
            prev.map((item) =>
              item.id === editingCategory.id ? (res.data as ChatbotCategoryRow) : item
            )
          );
          setIsCategoryModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update category.");
        }
      } else {
        const res = await createChatbotCategoryAction(payload);
        if (res.success && res.data) {
          toast.success("Category created.");
          setCategories((prev) => [...prev, res.data as ChatbotCategoryRow]);
          setIsCategoryModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create category.");
        }
      }
    });
  };

  const handleToggleCategoryActive = (cat: ChatbotCategoryRow) => {
    startTransition(async () => {
      setCategories((prev) =>
        prev.map((item) => (item.id === cat.id ? { ...item, is_active: !item.is_active } : item))
      );
      const res = await toggleChatbotCategoryActiveAction(cat.id, cat.is_active);
      if (res.success) {
        toast.success(`Category ${cat.is_active ? "deactivated" : "activated"}.`);
      } else {
        setCategories((prev) =>
          prev.map((item) => (item.id === cat.id ? { ...item, is_active: cat.is_active } : item))
        );
        toast.error(res.error || "Failed to toggle status.");
      }
    });
  };

  const handleDeleteCategory = async (cat: ChatbotCategoryRow) => {
    const assignedCount = questions.filter((q) => q.category_id === cat.id).length;
    const confirmed = await confirm({
      title: "Delete Category?",
      message: `Delete "${cat.name}"? ${
        assignedCount > 0
          ? `${assignedCount} questions in this category will become unassigned.`
          : ""
      }`,
      confirmText: "Delete Category",
      variant: "danger",
    });

    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteChatbotCategoryAction(cat.id);
      if (res.success) {
        toast.success("Category deleted.");
        setCategories((prev) => prev.filter((item) => item.id !== cat.id));
        setQuestions((prev) =>
          prev.map((q) => (q.category_id === cat.id ? { ...q, category_id: null } : q))
        );
      } else {
        toast.error(res.error || "Failed to delete category.");
      }
    });
  };

  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCats = [...categories];
    const [moved] = newCats.splice(index, 1);
    newCats.splice(targetIndex, 0, moved);

    const reorderedPayload = newCats.map((c, idx) => ({
      id: c.id,
      order_index: idx + 1,
    }));

    setCategories(newCats.map((c, idx) => ({ ...c, order_index: idx + 1 })));

    startTransition(async () => {
      const res = await reorderChatbotCategoriesAction(reorderedPayload);
      if (!res.success) {
        toast.error(res.error || "Failed to reorder categories.");
        setCategories(categories);
      }
    });
  };


  return (
    <div className="space-y-6">
      {/* Top Header */}
      <AdminPageHeader
        title="Ask RK Assistant & Knowledge Base"
        description="Curate verified database-driven FAQ answers, wedding planning guidance, and rapid contact actions for the Ask RK assistant."
        badge={
          <Badge variant="gold" size="sm">
            {questions.filter((q) => q.is_active).length} Active FAQs
          </Badge>
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openCreateCategoryModal}
              className="gap-1.5"
            >
              <FolderPlus size={14} />
              <span>New Category</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={openCreateQuestionModal}
              className="gap-1.5"
            >
              <Plus size={14} />
              <span>Add FAQ Question</span>
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-bronze-border/50">
        <button
          onClick={() => setActiveTab("questions")}
          className={`relative pb-3.5 px-4 text-xs font-semibold uppercase tracking-editorial transition-colors ${
            activeTab === "questions"
              ? "text-gold-400 font-bold"
              : "text-sand-400 hover:text-sand-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <HelpCircle size={15} />
            <span>Questions & Responses ({questions.length})</span>
          </div>
          {activeTab === "questions" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`relative pb-3.5 px-4 text-xs font-semibold uppercase tracking-editorial transition-colors ${
            activeTab === "categories"
              ? "text-gold-400 font-bold"
              : "text-sand-400 hover:text-sand-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} />
            <span>Knowledge Categories ({categories.length})</span>
          </div>
          {activeTab === "categories" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400 rounded-full" />
          )}
        </button>
      </div>

      {/* ============================================================================== */}
      {/* TAB 1: QUESTIONS & RESPONSES */}
      {/* ============================================================================== */}
      {activeTab === "questions" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-bronze-border/50 bg-charcoal-900/60 p-3.5">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions, answers, or actions..."
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

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="rounded-xl border border-bronze-border/60 bg-charcoal-950/80 px-3 py-2 text-xs text-sand-200 focus:border-gold-500 focus:outline-none"
              >
                <option value="all">All Categories ({questions.length})</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({questions.filter((q) => q.category_id === cat.id).length})
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl border border-bronze-border/60 bg-charcoal-950/80 px-3 py-2 text-xs text-sand-200 focus:border-gold-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Question List */}
          {filteredQuestions.length === 0 ? (
            <AdminEmptyState
              icon={Bot}
              title="No Questions Match Filter"
              description={
                searchQuery || selectedCategoryFilter !== "all" || statusFilter !== "all"
                  ? "Try resetting your search filters to view existing questions."
                  : "Start creating questions to train your automated assistant."
              }
              actionLabel="Add Question"
              onAction={openCreateQuestionModal}
            />
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const categoryObj = categories.find((c) => c.id === q.category_id);
                return (
                  <div
                    key={q.id}
                    className={`group relative rounded-2xl border transition-all ${
                      q.is_active
                        ? "border-bronze-border/60 bg-charcoal-900/70 hover:border-gold-500/40"
                        : "border-bronze-border/30 bg-charcoal-950/40 opacity-75"
                    } p-4 md:p-5`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left: Reorder & Content */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Reorder Buttons */}
                        <div className="flex flex-col items-center gap-1 pt-0.5">
                          <button
                            type="button"
                            disabled={idx === 0 || isPending}
                            onClick={() => handleMoveQuestion(idx, "up")}
                            className="rounded p-1 text-sand-400 hover:text-gold-400 disabled:opacity-20 hover:bg-charcoal-800 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <span className="text-[10px] font-mono text-sand-500">
                            {q.order_index}
                          </span>
                          <button
                            type="button"
                            disabled={idx === filteredQuestions.length - 1 || isPending}
                            onClick={() => handleMoveQuestion(idx, "down")}
                            className="rounded p-1 text-sand-400 hover:text-gold-400 disabled:opacity-20 hover:bg-charcoal-800 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {categoryObj ? (
                              <span className="inline-flex items-center rounded-full bg-gold-500/10 border border-gold-500/20 px-2.5 py-0.5 text-[10px] font-medium tracking-editorial uppercase text-gold-400">
                                {categoryObj.name}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-charcoal-800 px-2 py-0.5 text-[10px] text-sand-500">
                                Uncategorized
                              </span>
                            )}
                            <h3 className="font-display text-base font-medium text-ivory-100 group-hover:text-gold-200 transition-colors">
                              {q.question}
                            </h3>
                          </div>

                          <p className="text-xs text-sand-300 font-light leading-relaxed pl-0.5 line-clamp-3">
                            {q.answer}
                          </p>

                          {/* Action CTA preview */}
                          {q.action_label && (
                            <div className="flex items-center gap-2 pt-1 text-[11px]">
                              <span className="text-sand-500">Direct Action:</span>
                              <span className="inline-flex items-center gap-1 font-medium text-gold-400 underline underline-offset-4 decoration-gold-500/30">
                                {q.action_label}
                                <ExternalLink size={11} className="opacity-70" />
                              </span>
                              <span className="text-sand-500 font-mono text-[10px]">
                                ({q.action_url})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 self-end md:self-start border-t md:border-t-0 pt-2 md:pt-0 border-bronze-border/40">
                        {/* Live Preview Button */}
                        <button
                          type="button"
                          onClick={() => setPreviewQuestion(q)}
                          className="inline-flex items-center gap-1 rounded-xl border border-bronze-border/60 bg-charcoal-950/70 px-2.5 py-1.5 text-xs text-sand-300 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                          title="Preview in Assistant Bubble"
                        >
                          <Sparkles size={12} className="text-gold-400" />
                          <span className="hidden sm:inline">Preview</span>
                        </button>

                        {/* Status Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleQuestionActive(q)}
                          className={`rounded-xl border p-1.5 transition-colors ${
                            q.is_active
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "border-bronze-border/60 bg-charcoal-950/50 text-sand-500 hover:text-sand-300"
                          }`}
                          title={q.is_active ? "Click to Deactivate" : "Click to Activate"}
                        >
                          {q.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditQuestionModal(q)}
                          className="rounded-xl border border-bronze-border/60 bg-charcoal-950/50 p-1.5 text-sand-400 hover:text-ivory-100 hover:border-gold-500/50 transition-colors"
                          title="Edit Question"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q)}
                          className="rounded-xl border border-bronze-border/60 bg-charcoal-950/50 p-1.5 text-sand-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                          title="Delete Question"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================================== */}
      {/* TAB 2: KNOWLEDGE CATEGORIES */}
      {/* ============================================================================== */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-bronze-border/50 bg-charcoal-900/60 p-4">
            <div>
              <h3 className="font-display text-sm font-semibold text-ivory-100">
                Assistant Categories
              </h3>
              <p className="text-xs text-sand-400 font-light mt-0.5">
                Organize client questions into navigational filter chips displayed in the chatbot.
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={openCreateCategoryModal}
              className="gap-1.5"
            >
              <Plus size={14} />
              <span>Add Category</span>
            </Button>
          </div>

          <div className="space-y-3">
            {categories.map((cat, idx) => {
              const assignedCount = questions.filter((q) => q.category_id === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-bronze-border/60 bg-charcoal-900/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0 || isPending}
                        onClick={() => handleMoveCategory(idx, "up")}
                        className="rounded p-1 text-sand-400 hover:text-gold-400 disabled:opacity-20 hover:bg-charcoal-800 transition-colors"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <span className="text-[10px] font-mono text-sand-500">{cat.order_index}</span>
                      <button
                        type="button"
                        disabled={idx === categories.length - 1 || isPending}
                        onClick={() => handleMoveCategory(idx, "down")}
                        className="rounded p-1 text-sand-400 hover:text-gold-400 disabled:opacity-20 hover:bg-charcoal-800 transition-colors"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-medium text-ivory-100">
                          {cat.name}
                        </span>
                        <code className="text-[10px] text-sand-500 bg-charcoal-950 px-2 py-0.5 rounded border border-bronze-border/30">
                          /{cat.slug}
                        </code>
                        <Badge variant="outline" size="sm">
                          {assignedCount} Questions
                        </Badge>
                      </div>
                      {cat.description && (
                        <p className="text-xs text-sand-400 font-light mt-1">{cat.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleCategoryActive(cat)}
                      className={`rounded-xl border p-1.5 transition-colors ${
                        cat.is_active
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "border-bronze-border/60 bg-charcoal-950/50 text-sand-500 hover:text-sand-300"
                      }`}
                      title={cat.is_active ? "Active" : "Inactive"}
                    >
                      {cat.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditCategoryModal(cat)}
                      className="rounded-xl border border-bronze-border/60 bg-charcoal-950/50 p-1.5 text-sand-400 hover:text-ivory-100 hover:border-gold-500/50 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className="rounded-xl border border-bronze-border/60 bg-charcoal-950/50 p-1.5 text-sand-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* MODAL: CREATE / EDIT QUESTION */}
      {/* ============================================================================== */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-bronze-border/80 bg-charcoal-900 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-bronze-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-gold-500/10 border border-gold-500/20 p-2 text-gold-400">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ivory-100">
                    {editingQuestion ? "Edit Assistant Question" : "New Assistant Question"}
                  </h3>
                  <p className="text-xs text-sand-400 font-light">
                    Answers are strictly database-grounded to safeguard brand reputation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuestionModalOpen(false)}
                className="rounded-xl p-1.5 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-editorial text-sand-300 mb-1.5">
                  Knowledge Category
                </label>
                <select
                  value={qCategoryId}
                  onChange={(e) => setQCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-bronze-border/60 bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                >
                  <option value="">No Category (General)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-editorial text-sand-300 mb-1.5">
                  User Question Prompt <span className="text-gold-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={qQuestion}
                  onChange={(e) => setQQuestion(e.target.value)}
                  placeholder="e.g., What services do you offer?"
                  className="w-full rounded-xl border border-bronze-border/60 bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-500 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-editorial text-sand-300 mb-1.5">
                  Studio Response <span className="text-gold-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={qAnswer}
                  onChange={(e) => setQAnswer(e.target.value)}
                  placeholder="Write clear, authentic studio policy and service guidance..."
                  className="w-full rounded-xl border border-bronze-border/60 bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-500 focus:border-gold-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Action Button Option */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-editorial text-sand-300 mb-1.5">
                    Action Button Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={qActionLabel}
                    onChange={(e) => setQActionLabel(e.target.value)}
                    placeholder="e.g. WhatsApp Concierge"
                    className="w-full rounded-xl border border-bronze-border/60 bg-charcoal-950 px-3.5 py-2 text-xs text-ivory-100 placeholder-sand-500 focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-editorial text-sand-300 mb-1.5">
                    Action URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={qActionUrl}
                    onChange={(e) => setQActionUrl(e.target.value)}
                    placeholder="e.g. /contact or https://wa.me/..."
                    className="w-full rounded-xl border border-bronze-border/60 bg-charcoal-950 px-3.5 py-2 text-xs text-ivory-100 placeholder-sand-500 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="qActiveCheckbox"
                  checked={qActive}
                  onChange={(e) => setQActive(e.target.checked)}
                  className="h-4 w-4 rounded border-bronze-border/60 bg-charcoal-950 text-gold-500 focus:ring-gold-500"
                />
                <label htmlFor="qActiveCheckbox" className="text-xs text-sand-200 cursor-pointer">
                  Publish to Public Assistant Immediately
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-bronze-border/40 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsQuestionModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isPending}>
                  {editingQuestion ? "Save Changes" : "Create Question"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* MODAL: CREATE / EDIT CATEGORY */}
      {/* ============================================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-bronze-border/80 bg-charcoal-900 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-bronze-border/40 pb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-ivory-100">
                  {editingCategory ? "Edit Category" : "New Category"}
                </h3>
                <p className="text-xs text-sand-400 font-light">
                  Group similar questions under an interactive pill.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="rounded-xl p-1.5 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-editorial text-sand-300 mb-1.5">
                  Category Name <span className="text-gold-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g., Wedding, Pre-Wedding, Bookings"
                  className="w-full rounded-xl border border-bronze-border/60 bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-500 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-editorial text-sand-300 mb-1.5">
                  URL / Key Slug (Optional)
                </label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="auto-generated from name if left empty"
                  className="w-full rounded-xl border border-bronze-border/60 bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-500 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-editorial text-sand-300 mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Brief context on this category..."
                  className="w-full rounded-xl border border-bronze-border/60 bg-charcoal-950 px-3.5 py-2 text-xs text-ivory-100 placeholder-sand-500 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="catActiveCheckbox"
                  checked={catActive}
                  onChange={(e) => setCatActive(e.target.checked)}
                  className="h-4 w-4 rounded border-bronze-border/60 bg-charcoal-950 text-gold-500 focus:ring-gold-500"
                />
                <label htmlFor="catActiveCheckbox" className="text-xs text-sand-200 cursor-pointer">
                  Active Category
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-bronze-border/40 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isPending}>
                  {editingCategory ? "Save Category" : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* MODAL: LIVE ASSISTANT PREVIEW */}
      {/* ============================================================================== */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-gold-500/30 bg-charcoal-950 p-6 shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-bronze-border/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-display text-xs font-bold">
                  RK
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-ivory-100">
                    RK Visual Concierge
                  </h4>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Assistant Simulation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="rounded-xl p-1.5 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Simulated Chat Dialogue */}
            <div className="space-y-3.5 py-2">
              {/* User Prompt Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-charcoal-800 border border-bronze-border/50 px-4 py-2.5 text-xs text-ivory-100 shadow-sm">
                  {previewQuestion.question}
                </div>
              </div>

              {/* RK Assistant Answer Bubble */}
              <div className="flex justify-start items-start gap-2.5">
                <div className="h-6 w-6 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 text-[10px] font-bold shrink-0 mt-0.5">
                  RK
                </div>
                <div className="max-w-[88%] space-y-2.5">
                  <div className="rounded-2xl rounded-tl-sm bg-charcoal-900 border border-gold-500/20 px-4 py-3 text-xs text-sand-200 leading-relaxed shadow-md">
                    {previewQuestion.answer}
                  </div>

                  {/* Action CTA Button */}
                  {previewQuestion.action_label && (
                    <a
                      href={previewQuestion.action_url || "#"}
                      target={previewQuestion.action_url?.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500/15 border border-gold-500/40 px-3.5 py-1.5 text-xs font-medium text-gold-300 hover:bg-gold-500/25 transition-colors"
                    >
                      {previewQuestion.action_url?.includes("wa.me") && (
                        <WhatsAppIcon size={12} className="text-emerald-400" />
                      )}
                      <span>{previewQuestion.action_label}</span>
                      <ExternalLink size={11} className="opacity-70" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="border-t border-bronze-border/30 pt-3 text-center">
              <p className="text-[11px] text-sand-500">
                This demonstrates how clients will interact with this specific answer on the public website.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

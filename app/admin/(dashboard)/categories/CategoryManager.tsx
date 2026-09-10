"use client";

import React, { useState, useTransition } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAdminToast } from "@/components/admin/AdminToastContext";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  toggleCategoryPublishAction,
  reorderCategoriesAction,
} from "./actions";
import {
  Tags,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  published: boolean;
  projectsCount?: number;
}

interface CategoryManagerProps {
  initialCategories: CategoryWithCount[];
}

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [isSlugManual, setIsSlugManual] = useState(false);

  const toast = useAdminToast();
  const confirm = useAdminConfirm();

  // Auto-generate slug from name unless manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManual && !editingCategory) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setPublished(true);
    setIsSlugManual(false);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setPublished(cat.published);
    setIsSlugManual(true);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error("Category name and slug are required.");
      return;
    }

    startTransition(async () => {
      if (editingCategory) {
        // Update
        const res = await updateCategoryAction(editingCategory.id, {
          name,
          slug,
          description,
          published,
        });

        if (res.success) {
          toast.success("Category updated successfully.", "Saved");
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id
                ? { ...c, name, slug, description, published }
                : c
            )
          );
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update category.");
        }
      } else {
        // Create
        const res = await createCategoryAction({
          name,
          slug,
          description,
          published,
        });

        if (res.success && res.data) {
          toast.success("Category created successfully.", "Created");
          const created = res.data as CategoryWithCount;
          setCategories((prev) => [...prev, { ...created, projectsCount: 0 }]);
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create category.");
        }
      }
    });
  };

  const handleTogglePublish = (cat: CategoryWithCount) => {
    // Optimistic toggle
    const newStatus = !cat.published;
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, published: newStatus } : c))
    );

    startTransition(async () => {
      const res = await toggleCategoryPublishAction(cat.id, cat.published);
      if (!res.success) {
        // Revert
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, published: cat.published } : c))
        );
        toast.error("Failed to update status: " + res.error);
      } else {
        toast.info(
          `Category ${newStatus ? "published" : "set to draft"}.`
        );
      }
    });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCats = [...categories];
    const [moved] = newCats.splice(index, 1);
    newCats.splice(targetIndex, 0, moved);

    // Optimistic reorder
    setCategories(newCats);

    startTransition(async () => {
      const ids = newCats.map((c) => c.id);
      const res = await reorderCategoriesAction(ids);
      if (!res.success) {
        toast.error("Could not save new order.");
      }
    });
  };

  const handleDelete = async (cat: CategoryWithCount) => {
    const shouldDelete = await confirm({
      title: `Delete "${cat.name}" Category?`,
      message:
        "This category will be permanently removed. If projects are assigned to it, the action will be prevented to avoid orphan showcases.",
      confirmText: "Delete Category",
      variant: "danger",
    });

    if (!shouldDelete) return;

    startTransition(async () => {
      const res = await deleteCategoryAction(cat.id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        toast.success(`Category "${cat.name}" deleted.`, "Deleted");
      } else {
        toast.error(res.error || "Failed to delete category.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Portfolio classification, URL taxonomy, and display ordering."
        badge={
          <Badge variant="gold" size="sm">
            {categories.length} Total
          </Badge>
        }
        action={
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            leftIcon={<Plus size={14} />}
          >
            Add Category
          </Button>
        }
      />

      {categories.length === 0 ? (
        <AdminEmptyState
          icon={Tags}
          title="No Categories Configured"
          description="Categories organize your photography shoots (e.g. Weddings, Pre-Wedding, Portraits)."
          actionLabel="Create Category"
          onAction={openCreateModal}
        />
      ) : (
        <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-bronze-border/60 bg-charcoal-850/80 text-[11px] uppercase tracking-wider text-sand-400">
                <tr>
                  <th className="py-3.5 px-4 font-medium w-16 text-center">Order</th>
                  <th className="py-3.5 px-4 font-medium">Category Name</th>
                  <th className="py-3.5 px-4 font-medium">URL Slug</th>
                  <th className="py-3.5 px-4 font-medium text-center">Projects</th>
                  <th className="py-3.5 px-4 font-medium text-center">Status</th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bronze-border/40 text-sand-300">
                {categories.map((cat, index) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-charcoal-850/40 transition-colors"
                  >
                    {/* Order Controls */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0 || isPending}
                          className="rounded p-1 text-sand-500 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors disabled:opacity-20"
                          title="Move Up"
                          aria-label="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <span className="font-mono text-sand-400 text-[11px] w-4">
                          {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMove(index, "down")}
                          disabled={index === categories.length - 1 || isPending}
                          className="rounded p-1 text-sand-500 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors disabled:opacity-20"
                          title="Move Down"
                          aria-label="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </td>

                    {/* Name & Description */}
                    <td className="py-3.5 px-4 font-medium text-ivory-100">
                      <div>
                        <span>{cat.name}</span>
                        {cat.description && (
                          <span className="block text-[11px] text-sand-500 font-light truncate max-w-sm mt-0.5">
                            {cat.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-gold-400">
                      /{cat.slug}
                    </td>

                    {/* Projects Count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="rounded-full bg-charcoal-800 px-2 py-0.5 text-[10px] font-mono text-sand-300 border border-bronze-border/50">
                        {cat.projectsCount ?? 0} shoots
                      </span>
                    </td>

                    {/* Publish Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(cat)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                          cat.published
                            ? "bg-gold-500/10 text-gold-400 border border-gold-500/30 hover:bg-gold-500/20"
                            : "bg-charcoal-800 text-sand-400 border border-bronze-border hover:text-ivory-100"
                        }`}
                      >
                        {cat.published ? (
                          <>
                            <Eye size={11} />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={11} />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="rounded-lg p-1.5 text-sand-400 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="rounded-lg p-1.5 text-sand-400 hover:text-red-400 hover:bg-charcoal-800 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog for Add / Edit Category */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-sm"
            onClick={() => !isPending && setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-bronze-border bg-charcoal-900 p-6 shadow-card-luxury animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-bronze-border/50 pb-4 mb-5">
              <h3 className="font-display text-lg font-medium text-ivory-100">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-sand-500 hover:text-ivory-100 hover:bg-charcoal-800"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                  Category Name <span className="text-gold-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Destination Weddings"
                  className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                  URL Slug <span className="text-gold-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500 text-xs font-mono">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setIsSlugManual(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="destination-weddings"
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-6 pr-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for category listings and SEO..."
                  className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="published-toggle"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-bronze-border bg-charcoal-950 text-gold-500 focus:ring-gold-400"
                />
                <label
                  htmlFor="published-toggle"
                  className="text-xs text-sand-300 cursor-pointer"
                >
                  Publish immediately (visible to public portfolio)
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-bronze-border/40">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-bronze-border bg-charcoal-850 px-4 py-2 text-xs font-medium uppercase tracking-editorial text-sand-300 hover:bg-charcoal-800 hover:text-ivory-100"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isPending}
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

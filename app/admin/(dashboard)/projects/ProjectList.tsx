"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import RKImage from "@/components/ui/RKImage";
import { useAdminToast } from "@/components/admin/AdminToastContext";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";
import {
  toggleProjectPublishAction,
  toggleProjectFeaturedAction,
  deleteProjectAction,
} from "./actions";
import {
  FolderKanban,
  Plus,
  Search,
  Calendar,
  MapPin,
  Images,
  Edit2,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  category_name?: string;
  cover_image_url: string;
  location: string | null;
  event_date: string | null;
  featured: boolean;
  published: boolean;
  images_count?: number;
  created_at: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ProjectListProps {
  initialProjects: ProjectItem[];
  categories: CategoryOption[];
}

export default function ProjectList({ initialProjects, categories }: ProjectListProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const toast = useAdminToast();
  const confirm = useAdminConfirm();

  // Filter projects
  const filteredProjects = projects.filter((proj) => {
    // Search matching
    const matchesSearch =
      !searchQuery ||
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proj.location && proj.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      proj.slug.toLowerCase().includes(searchQuery.toLowerCase());

    // Category matching
    const matchesCategory =
      selectedCategory === "all" || proj.category_id === selectedCategory;

    // Status matching
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "published" && proj.published) ||
      (selectedStatus === "draft" && !proj.published) ||
      (selectedStatus === "featured" && proj.featured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleTogglePublish = (proj: ProjectItem) => {
    const newStatus = !proj.published;
    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, published: newStatus } : p))
    );

    startTransition(async () => {
      const res = await toggleProjectPublishAction(proj.id, proj.published);
      if (!res.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === proj.id ? { ...p, published: proj.published } : p))
        );
        toast.error("Failed to update status: " + res.error);
      } else {
        toast.info(`Project ${newStatus ? "published" : "set to draft"}.`);
      }
    });
  };

  const handleToggleFeatured = (proj: ProjectItem) => {
    const newFeatured = !proj.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, featured: newFeatured } : p))
    );

    startTransition(async () => {
      const res = await toggleProjectFeaturedAction(proj.id, proj.featured);
      if (!res.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === proj.id ? { ...p, featured: proj.featured } : p))
        );
        toast.error("Failed to update featured: " + res.error);
      } else {
        toast.info(newFeatured ? "Project highlighted as Featured." : "Removed from Featured.");
      }
    });
  };

  const handleDelete = async (proj: ProjectItem) => {
    const shouldDelete = await confirm({
      title: `Delete "${proj.title}" Project?`,
      message:
        "This will permanently delete this photoshoot project and all associated image references. This action cannot be undone.",
      confirmText: "Delete Project",
      variant: "danger",
    });

    if (!shouldDelete) return;

    startTransition(async () => {
      const res = await deleteProjectAction(proj.id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== proj.id));
        toast.success(`Project "${proj.title}" deleted.`, "Deleted");
      } else {
        toast.error(res.error || "Failed to delete project.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects"
        description="Client photoshoot showcases, portfolio collections, and featured wedding stories."
        badge={
          <Badge variant="gold" size="sm">
            {projects.length} Total
          </Badge>
        }
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-4 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle"
          >
            <Plus size={15} />
            <span>New Project</span>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-sand-500 my-auto"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, or slug..."
            className="w-full rounded-xl border border-bronze-border bg-charcoal-900 pl-9 pr-3.5 py-2 text-xs text-ivory-100 placeholder-sand-500 focus:border-gold-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-bronze-border bg-charcoal-900 px-3 py-2 text-xs text-sand-300 focus:border-gold-400 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-bronze-border bg-charcoal-900 px-3 py-2 text-xs text-sand-300 focus:border-gold-400 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
            <option value="featured">Featured Only</option>
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <AdminEmptyState
          icon={FolderKanban}
          title={projects.length === 0 ? "No Projects in Portfolio" : "No Matching Projects"}
          description={
            projects.length === 0
              ? "Create your first photoshoot project to showcase your portfolio."
              : "Try adjusting your search query or category filters."
          }
          actionLabel={projects.length === 0 ? "Create First Project" : "Clear Filters"}
          actionHref={projects.length === 0 ? "/admin/projects/new" : undefined}
          onAction={
            projects.length > 0
              ? () => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                }
              : undefined
          }
        />
      ) : (
        <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-bronze-border/60 bg-charcoal-850/80 text-[11px] uppercase tracking-wider text-sand-400">
                <tr>
                  <th className="py-3.5 px-4 font-medium w-16 text-center">Cover</th>
                  <th className="py-3.5 px-4 font-medium">Project Title</th>
                  <th className="py-3.5 px-4 font-medium">Category</th>
                  <th className="py-3.5 px-4 font-medium">Photos</th>
                  <th className="py-3.5 px-4 font-medium text-center">Featured</th>
                  <th className="py-3.5 px-4 font-medium text-center">Status</th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bronze-border/40 text-sand-300">
                {filteredProjects.map((proj) => (
                  <tr
                    key={proj.id}
                    className="hover:bg-charcoal-850/40 transition-colors"
                  >
                    {/* Cover Thumbnail */}
                    <td className="py-3 px-4 text-center">
                      <div className="relative h-11 w-14 overflow-hidden rounded-lg border border-bronze-border bg-charcoal-950 mx-auto">
                        <RKImage
                          src={proj.cover_image_url}
                          alt={proj.title}
                          preset="thumbnail"
                          aspectRatio="gallery"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Title, slug, location & date */}
                    <td className="py-3.5 px-4 font-medium text-ivory-100">
                      <div>
                        <Link
                          href={`/admin/projects/${proj.id}/edit`}
                          className="hover:text-gold-400 transition-colors text-xs"
                        >
                          {proj.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-sand-500 font-light">
                          <span className="font-mono">/{proj.slug}</span>
                          {proj.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin size={11} />
                                {proj.location}
                              </span>
                            </>
                          )}
                          {proj.event_date && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                {proj.event_date}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="rounded-md border border-bronze-border/60 bg-charcoal-850 px-2 py-0.5 text-[11px] text-sand-300">
                        {proj.category_name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Photos Count & Gallery Link */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/projects/${proj.id}/gallery`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-bronze-border bg-charcoal-850 px-2.5 py-1 text-[11px] text-sand-300 hover:border-gold-500/40 hover:text-gold-300 transition-colors"
                        title="Manage Project Gallery Photos"
                      >
                        <Images size={12} className="text-gold-400" />
                        <span>{proj.images_count ?? 0} photos</span>
                      </Link>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(proj)}
                        disabled={isPending}
                        className={`rounded-lg p-1.5 transition-colors ${
                          proj.featured
                            ? "text-gold-400 hover:bg-gold-500/10"
                            : "text-sand-600 hover:text-sand-400 hover:bg-charcoal-800"
                        }`}
                        title={proj.featured ? "Featured on Home" : "Click to feature"}
                      >
                        <Star
                          size={15}
                          fill={proj.featured ? "currentColor" : "none"}
                        />
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(proj)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                          proj.published
                            ? "bg-gold-500/10 text-gold-400 border border-gold-500/30 hover:bg-gold-500/20"
                            : "bg-charcoal-800 text-sand-400 border border-bronze-border hover:text-ivory-100"
                        }`}
                      >
                        {proj.published ? (
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
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/projects/${proj.id}/gallery`}
                          className="rounded-lg p-1.5 text-sand-400 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                          title="Manage Gallery"
                        >
                          <Images size={14} />
                        </Link>
                        <Link
                          href={`/admin/projects/${proj.id}/edit`}
                          className="rounded-lg p-1.5 text-sand-400 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(proj)}
                          className="rounded-lg p-1.5 text-sand-400 hover:text-red-400 hover:bg-charcoal-800 transition-colors"
                          title="Delete Project"
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
    </div>
  );
}

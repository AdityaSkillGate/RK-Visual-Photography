"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import RKImage from "@/components/ui/RKImage";
import { useAdminToast } from "@/components/admin/AdminToastContext";
import { createProjectAction, updateProjectAction, ProjectInput } from "./actions";
import {
  Save,
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  Sparkles,
  Images,
  FolderKanban,
  Search,
} from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectInput> & { id?: string };
  categories: CategoryOption[];
  isEdit?: boolean;
}

export default function ProjectForm({
  initialData,
  categories,
  isEdit = false,
}: ProjectFormProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [isPending, startTransition] = useTransition();

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialData?.slug));
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.cover_image_url || "/assets/logo/logo.png"
  );
  const [location, setLocation] = useState(initialData?.location || "");
  const [eventDate, setEventDate] = useState(initialData?.event_date || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [story, setStory] = useState(initialData?.story || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [published, setPublished] = useState(initialData?.published || false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seo_description || ""
  );

  // Auto-generate slug and SEO from title if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual && !isEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
      setSeoTitle(`${val.trim()} | RK Visual Photography`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      toast.error("Project title and slug are required.");
      return;
    }

    const payload: ProjectInput = {
      title,
      slug,
      category_id: categoryId || null,
      cover_image_url: coverImageUrl,
      location: location || null,
      event_date: eventDate || null,
      description: description || null,
      story: story || null,
      featured,
      published,
      seo_title: seoTitle || `${title} | RK Visual Photography`,
      seo_description: seoDescription || description || null,
    };

    startTransition(async () => {
      if (isEdit && initialData?.id) {
        const res = await updateProjectAction(initialData.id, payload);
        if (res.success) {
          toast.success("Project updated successfully.", "Saved");
          router.push("/admin/projects");
        } else {
          toast.error(res.error || "Failed to update project.");
        }
      } else {
        const res = await createProjectAction(payload);
        if (res.success && res.data?.id) {
          toast.success("Project created successfully!", "Created");
          // Navigate to gallery manager to add photos immediately
          router.push(`/admin/projects/${res.data.id}/gallery`);
        } else {
          toast.error(res.error || "Failed to create project.");
        }
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <AdminPageHeader
        title={isEdit ? `Edit "${title || "Project"}"` : "Create New Project"}
        description={
          isEdit
            ? "Modify project details, update editorial stories, and adjust SEO settings."
            : "Add a new client photoshoot showcase to the RK Visual studio catalog."
        }
        backHref="/admin/projects"
        action={
          isEdit && initialData?.id ? (
            <Link
              href={`/admin/projects/${initialData.id}/gallery`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-bronze-border bg-charcoal-900 px-4 py-2 text-xs font-semibold uppercase tracking-editorial text-gold-400 hover:border-gold-500/40 hover:text-gold-300 transition-colors"
            >
              <Images size={14} />
              <span>Manage Gallery Photos</span>
            </Link>
          ) : undefined
        }
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary Details Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Basic identification, category taxonomy, and shoot logistics.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                    Project Title <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Vikram &amp; Deepa's Palace Wedding"
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        placeholder="vikram-deepa-palace-wedding"
                        className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-6 pr-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                      Shoot Location
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500">
                        <MapPin size={13} />
                      </span>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Chennai, Tamil Nadu"
                        className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-8 pr-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                      Event Date
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500">
                        <Calendar size={13} />
                      </span>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full rounded-xl border border-bronze-border bg-charcoal-950 pl-8 pr-3.5 py-2 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                    Short Description / Summary
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief editorial summary shown in portfolio cards..."
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                    Full Editorial Story (Optional)
                  </label>
                  <textarea
                    rows={5}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Detailed narrative describing the couple, ceremony rituals, lighting choices, and fine-art moments..."
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none resize-y font-light leading-relaxed"
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Metadata Card */}
            <Card variant="outline">
              <CardHeader>
                <div className="flex items-center gap-2 text-gold-400">
                  <Globe size={16} />
                  <CardTitle className="text-base">Search Engine Optimization (SEO)</CardTitle>
                </div>
                <CardDescription>
                  Configure metadata for Google Search and social sharing previews.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. Luxury Palace Wedding | RK Visual Photography"
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-editorial text-sand-300">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Concise description (recommended under 160 characters)..."
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2.5 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publish & Status Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-base">Publish Settings</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Published Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-bronze-border bg-charcoal-950">
                  <div>
                    <span className="text-xs font-medium text-ivory-100 block">
                      Published Status
                    </span>
                    <span className="text-[11px] text-sand-400 font-light">
                      Visible on live studio portfolio
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-5 w-5 rounded border-bronze-border bg-charcoal-900 text-gold-500 focus:ring-gold-400 cursor-pointer"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-bronze-border bg-charcoal-950">
                  <div>
                    <span className="text-xs font-medium text-ivory-100 block">
                      Featured Project
                    </span>
                    <span className="text-[11px] text-sand-400 font-light">
                      Spotlight on public homepage
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-5 w-5 rounded border-bronze-border bg-charcoal-900 text-gold-500 focus:ring-gold-400 cursor-pointer"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isPending}
                    className="w-full justify-center"
                    leftIcon={<Save size={15} />}
                  >
                    {isEdit ? "Update Project" : "Create & Add Photos"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cover Image Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-base">Cover Photo</CardTitle>
                <CardDescription>
                  Primary image displayed in grid collections and hero cards.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="relative aspect-gallery w-full overflow-hidden rounded-xl border border-bronze-border bg-charcoal-950">
                  <RKImage
                    src={coverImageUrl}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-editorial text-sand-400">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://ik.imagekit.io/... or /assets/..."
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3 py-2 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none font-mono"
                  />
                </div>

                {isEdit && initialData?.id && (
                  <p className="text-[11px] text-sand-500">
                    Tip: You can also select any photo in the{" "}
                    <Link
                      href={`/admin/projects/${initialData.id}/gallery`}
                      className="text-gold-400 underline"
                    >
                      Gallery Manager
                    </Link>{" "}
                    to set it as the cover.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import React, { useState, useTransition, useRef } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import RKImage from "@/components/ui/RKImage";
import { useAdminToast } from "@/components/admin/AdminToastContext";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";
import { uploadMediaAction } from "@/app/admin/media/actions";
import {
  saveProjectImageAction,
  deleteProjectImageAction,
  setCoverImageAction,
  toggleImageFeaturedAction,
  reorderProjectImagesAction,
} from "@/app/admin/(dashboard)/galleries/actions";
import {
  Upload,
  Images,
  Trash2,
  Star,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Crown,
  Info,
} from "lucide-react";

export interface ProjectImageItem {
  id: string;
  project_id: string;
  image_url: string;
  file_id: string | null;
  blur_data_url: string | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  order_index: number;
  is_cover: boolean;
  is_featured: boolean;
  created_at: string;
}

interface ProjectGalleryManagerProps {
  project: {
    id: string;
    title: string;
    slug: string;
    cover_image_url: string;
  };
  initialImages: ProjectImageItem[];
}

interface UploadProgressState {
  current: number;
  total: number;
  percent: number;
  fileName: string;
}

export default function ProjectGalleryManager({
  project,
  initialImages,
}: ProjectGalleryManagerProps) {
  const [images, setImages] = useState<ProjectImageItem[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = useAdminToast();
  const confirm = useAdminConfirm();

  // Multi-image upload handler
  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    setIsUploading(true);

    let successCount = 0;
    const newItems: ProjectImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progressPercent = Math.round(((i + 1) / files.length) * 100);

      setUploadProgress({
        current: i + 1,
        total: files.length,
        percent: progressPercent,
        fileName: file.name,
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `/portfolio/${project.slug}`);
      formData.append("alt_text", `${project.title} - Shoot Photo ${images.length + i + 1}`);

      try {
        const uploadRes = await uploadMediaAction(formData);

        if (uploadRes.success && uploadRes.data) {
          const imgData = uploadRes.data;

          // Save to database
          const saveRes = await saveProjectImageAction({
            project_id: project.id,
            image_url: imgData.url,
            file_id: imgData.fileId,
            blur_data_url: imgData.blurDataUrl,
            width: imgData.width,
            height: imgData.height,
            alt_text: `${project.title} - Photo`,
            order_index: images.length + i + 1,
            // If this is the first image uploaded and project has default cover, set as cover
            is_cover: images.length === 0 && i === 0,
          });

          if (saveRes.success && saveRes.data) {
            successCount++;
            newItems.push({
              id: saveRes.data.id,
              project_id: project.id,
              image_url: imgData.url,
              file_id: imgData.fileId,
              blur_data_url: imgData.blurDataUrl,
              width: imgData.width,
              height: imgData.height,
              alt_text: `${project.title} - Photo`,
              order_index: images.length + i + 1,
              is_cover: images.length === 0 && i === 0,
              is_featured: false,
              created_at: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Error uploading file:", file.name, err);
      }
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
      toast.success(
        `Successfully uploaded ${successCount} of ${files.length} photos!`,
        "Upload Complete"
      );
    } else {
      toast.error("Failed to upload selected files. Please check file format and size.");
    }

    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Set as Cover Photo
  const handleSetCover = (img: ProjectImageItem) => {
    // Optimistic update
    setImages((prev) =>
      prev.map((item) => ({
        ...item,
        is_cover: item.id === img.id,
      }))
    );

    startTransition(async () => {
      const res = await setCoverImageAction(project.id, img.id, img.image_url);
      if (res.success) {
        toast.success("Cover image updated for this project.", "Cover Set");
      } else {
        toast.error(res.error || "Failed to set cover photo.");
      }
    });
  };

  // Toggle Featured
  const handleToggleFeatured = (img: ProjectImageItem) => {
    const newFeatured = !img.is_featured;
    setImages((prev) =>
      prev.map((item) =>
        item.id === img.id ? { ...item, is_featured: newFeatured } : item
      )
    );

    startTransition(async () => {
      const res = await toggleImageFeaturedAction(img.id, project.id, img.is_featured);
      if (!res.success) {
        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id ? { ...item, is_featured: img.is_featured } : item
          )
        );
        toast.error("Failed to update featured state.");
      } else {
        toast.info(newFeatured ? "Photo highlighted as featured." : "Removed from featured.");
      }
    });
  };

  // Reorder Photos
  const handleMove = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, moved);

    setImages(newImages);

    startTransition(async () => {
      const ids = newImages.map((img) => img.id);
      const res = await reorderProjectImagesAction(project.id, ids);
      if (!res.success) {
        toast.error("Failed to save photo order.");
      }
    });
  };

  // Delete Photo
  const handleDelete = async (img: ProjectImageItem) => {
    const shouldDelete = await confirm({
      title: "Delete Photo from Gallery?",
      message:
        "This photo will be removed from ImageKit CDN storage and this photoshoot gallery.",
      confirmText: "Delete Photo",
      variant: "danger",
    });

    if (!shouldDelete) return;

    startTransition(async () => {
      const res = await deleteProjectImageAction(img.id, project.id, img.file_id);
      if (res.success) {
        setImages((prev) => prev.filter((item) => item.id !== img.id));
        toast.success("Photo deleted from gallery.", "Deleted");
      } else {
        toast.error(res.error || "Failed to delete photo.");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <AdminPageHeader
        title={`${project.title} • Gallery`}
        description={`Manage high-resolution photography assets for /${project.slug}. Images are optimized and served via ImageKit CDN.`}
        backHref="/admin/projects"
        badge={
          <Badge variant="gold" size="sm">
            {images.length} Photos
          </Badge>
        }
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/projects/${project.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-bronze-border bg-charcoal-900 px-3.5 py-2 text-xs font-medium uppercase tracking-editorial text-sand-300 hover:border-gold-500/40 hover:text-ivory-100 transition-colors"
            >
              <span>Edit Details</span>
            </Link>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-4 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle disabled:opacity-50"
            >
              <Upload size={14} />
              <span>Upload Photos</span>
            </button>
          </div>
        }
      />

      {/* Hidden File Input supporting multiple images */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesSelect}
        className="hidden"
      />

      {/* Upload Progress Indicator Card */}
      {isUploading && uploadProgress && (
        <div className="rounded-2xl border border-gold-500/30 bg-charcoal-900/90 p-5 shadow-card-luxury backdrop-blur-md animate-in fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-gold-400 animate-spin" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ivory-100">
                Uploading Photos to ImageKit CDN...
              </span>
            </div>
            <span className="font-mono text-xs text-gold-400">
              {uploadProgress.current} / {uploadProgress.total} ({uploadProgress.percent}%)
            </span>
          </div>

          <p className="text-[11px] text-sand-400 font-mono truncate mb-3">
            Processing: {uploadProgress.fileName}
          </p>

          <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal-800 border border-bronze-border/60">
            <div
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-300"
              style={{ width: `${uploadProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-bronze-border/80 bg-charcoal-900/40 p-8 text-center transition-all hover:border-gold-500/50 hover:bg-charcoal-900/70 cursor-pointer"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-bronze-border bg-charcoal-850 text-gold-400 mb-3 group-hover:scale-105 transition-transform">
          <Upload size={22} />
        </div>
        <h3 className="text-xs font-medium uppercase tracking-editorial text-ivory-100">
          Upload Photos to this Gallery
        </h3>
        <p className="mt-1 text-[11px] text-sand-400 font-light max-w-sm">
          Select multiple camera originals (RAW/JPG, WebP, PNG). Automatically optimized with responsive WebP/AVIF presets and blur placeholders.
        </p>
      </div>

      {/* Photo Grid */}
      {images.length === 0 ? (
        <AdminEmptyState
          icon={Images}
          title="No Photos in Gallery Yet"
          description="Click 'Upload Photos' above to upload high-resolution images for this photoshoot."
          actionLabel="Select Photos"
          onAction={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-sand-400">
            <span>
              Showing {images.length} photos in display order.
            </span>
            <span className="text-[11px] text-sand-500 font-light">
              Admin previews delivered at 400px thumbnail presets for optimal speed.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img, index) => {
              const isCover =
                img.is_cover || img.image_url === project.cover_image_url;

              return (
                <div
                  key={img.id}
                  className={`group relative rounded-2xl border overflow-hidden bg-charcoal-900 transition-all ${
                    isCover
                      ? "border-gold-500 shadow-gold-subtle"
                      : "border-bronze-border/70 hover:border-gold-500/40"
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative aspect-gallery w-full overflow-hidden bg-charcoal-950">
                    <RKImage
                      src={img.image_url}
                      alt={img.alt_text || `Photo ${index + 1}`}
                      preset="thumbnail"
                      aspectRatio="gallery"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Cover Pill */}
                    {isCover && (
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-gold-500 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-charcoal-950 shadow-sm">
                        <Crown size={10} />
                        <span>Cover</span>
                      </div>
                    )}

                    {/* Featured Pill */}
                    {img.is_featured && !isCover && (
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-charcoal-900/90 border border-gold-500/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold-400 shadow-sm">
                        <Star size={10} fill="currentColor" />
                        <span>Featured</span>
                      </div>
                    )}

                    {/* Order Index Pill */}
                    <span className="absolute top-2 right-2 z-10 rounded bg-charcoal-950/80 px-1.5 py-0.5 text-[9px] font-mono text-sand-400">
                      #{index + 1}
                    </span>

                    {/* Hover Overlay with Quick Actions */}
                    <div className="absolute inset-0 z-20 bg-charcoal-950/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      {/* Top Action Row */}
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(img)}
                          disabled={isPending}
                          className={`rounded-lg p-1.5 transition-colors ${
                            img.is_featured
                              ? "text-gold-400 bg-gold-500/20"
                              : "text-sand-400 hover:text-gold-400 hover:bg-charcoal-800"
                          }`}
                          title={img.is_featured ? "Featured in feed" : "Click to feature"}
                        >
                          <Star
                            size={14}
                            fill={img.is_featured ? "currentColor" : "none"}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(img)}
                          disabled={isPending}
                          className="rounded-lg p-1.5 text-sand-400 hover:text-red-400 hover:bg-charcoal-800 transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Middle: Set Cover Button */}
                      {!isCover && (
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => handleSetCover(img)}
                            disabled={isPending}
                            className="inline-flex items-center gap-1 rounded-lg border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-gold-300 hover:bg-gold-500 hover:text-charcoal-950 transition-all"
                          >
                            <Crown size={11} />
                            <span>Set as Cover</span>
                          </button>
                        </div>
                      )}

                      {/* Bottom: Reorder Arrows */}
                      <div className="flex items-center justify-between border-t border-bronze-border/50 pt-2 text-sand-400">
                        <button
                          type="button"
                          onClick={() => handleMove(index, "left")}
                          disabled={index === 0 || isPending}
                          className="rounded p-1 hover:text-ivory-100 hover:bg-charcoal-800 disabled:opacity-20"
                          title="Move Left"
                        >
                          <ArrowLeft size={13} />
                        </button>

                        <span className="text-[10px] font-mono text-sand-500">
                          {img.width && img.height ? `${img.width}x${img.height}` : "HD"}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleMove(index, "right")}
                          disabled={index === images.length - 1 || isPending}
                          className="rounded p-1 hover:text-ivory-100 hover:bg-charcoal-800 disabled:opacity-20"
                          title="Move Right"
                        >
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

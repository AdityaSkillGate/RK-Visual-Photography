"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import RKImage from "@/components/ui/RKImage";
import { uploadMediaAction, deleteMediaAction, UploadActionResult } from "@/app/admin/media/actions";
import { useAdminToast } from "@/components/admin/AdminToastContext";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

export default function TestMediaPage() {
  const [isPending, startTransition] = useTransition();
  const [uploadResult, setUploadResult] = useState<UploadActionResult | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const toast = useAdminToast();
  const confirm = useAdminConfirm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setStatusMessage(`Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setStatusMessage("Uploading and generating transformations...");
    startTransition(async () => {
      const result = await uploadMediaAction(formData);
      setUploadResult(result);
      if (result.success) {
        setStatusMessage("Upload successful! Transformed variants generated below.");
        toast.success("Image uploaded & transformations generated!", "Success");
      } else {
        setStatusMessage(result.error || "Upload encountered an error.");
        toast.error(result.error || "Upload encountered an error.", "Error");
      }
    });
  };

  const handleDelete = async (fileId: string, supabaseId?: string) => {
    const shouldDelete = await confirm({
      title: "Delete Media Asset?",
      message: "This will permanently remove the image from ImageKit storage and Supabase metadata records.",
      confirmText: "Delete Asset",
      variant: "danger",
    });

    if (!shouldDelete) return;

    startTransition(async () => {
      await deleteMediaAction(fileId, supabaseId);
      setUploadResult(null);
      setSelectedFileName("");
      setStatusMessage("Asset deleted from storage.");
      toast.info("Media asset was removed.", "Deleted");
    });
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="ImageKit Media & Transformation Lab"
        description="Test photography uploads, automatic format conversions (WebP/AVIF), responsive presets, and Supabase metadata synchronization."
        badge={
          <Badge variant="gold" size="sm" dot>
            Phase 3 Engine
          </Badge>
        }
      />

      {/* Notice Card */}
      <Card variant="glass" className="border-gold-500/20 bg-charcoal-900/60 p-5">
        <div className="flex items-start gap-3.5">
          <Info size={18} className="shrink-0 text-gold-400 mt-0.5" />
          <div className="space-y-1 text-xs text-sand-300 leading-relaxed font-light">
            <p>
              <strong className="text-ivory-100 font-medium">Zero PostgreSQL Binaries:</strong> Heavy photography files are delivered via the ImageKit CDN. Supabase only stores image references, dimensions, and instant blur placeholders.
            </p>
            <p className="text-sand-500 text-[11px]">
              Server credentials (<code className="text-gold-400">IMAGEKIT_PRIVATE_KEY</code>) remain strictly isolated server-side.
            </p>
          </div>
        </div>
      </Card>

      {/* Upload Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form Box */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="gold" size="sm" dot>
                  Secure Pipeline
                </Badge>
                <span className="text-caption text-sand-500 font-mono">Max 25MB</span>
              </div>
              <CardTitle className="pt-1">Upload Photography Asset</CardTitle>
              <CardDescription>
                Supports high-resolution camera originals (JPG, PNG, WebP, AVIF).
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form action={handleFormSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="media-file"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-bronze-border/80 bg-charcoal-950/60 p-6 text-center transition-colors hover:border-gold-500/50 hover:bg-charcoal-900/50 cursor-pointer"
                  >
                    <Upload size={28} className="text-gold-400 mb-2" />
                    <span className="text-xs font-medium text-ivory-100">
                      {selectedFileName || "Choose an image or drop file here"}
                    </span>
                    <span className="text-[11px] text-sand-500 pt-1">
                      High-res camera RAW/JPG, WebP, PNG
                    </span>
                    <input
                      id="media-file"
                      name="file"
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="folder"
                    className="block text-xs font-medium uppercase tracking-editorial text-sand-300"
                  >
                    Storage Folder Path
                  </label>
                  <input
                    id="folder"
                    name="folder"
                    type="text"
                    defaultValue="/portfolio/weddings"
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="alt_text"
                    className="block text-xs font-medium uppercase tracking-editorial text-sand-300"
                  >
                    Alt Description / Caption
                  </label>
                  <input
                    id="alt_text"
                    name="alt_text"
                    type="text"
                    placeholder="e.g. Arun &amp; Priya South Indian Traditional Wedding Ritual"
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-950 px-3.5 py-2 text-xs text-ivory-100 placeholder-sand-600 focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isPending}
                  className="w-full justify-center"
                  leftIcon={<Upload size={16} />}
                >
                  Upload &amp; Generate Transformations
                </Button>
              </form>
            </CardContent>

            {statusMessage && (
              <CardFooter className="border-t border-bronze-border/50 bg-charcoal-950/40 p-4">
                <div className="flex items-center gap-2 text-xs text-sand-300">
                  <Sparkles size={14} className="text-gold-400 shrink-0" />
                  <span className="truncate">{statusMessage}</span>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Live Transformation Inspector */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" size="sm">
                  Inspector
                </Badge>
                <span className="text-xs text-sand-500 font-mono">Live CDN Preview</span>
              </div>
              <CardTitle className="pt-1">Responsive Delivery Preview</CardTitle>
              <CardDescription>
                Live preview using responsive ImageKit presets rendered via <code className="text-gold-400 font-mono">&lt;RKImage /&gt;</code>.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {uploadResult?.data ? (
                <div className="space-y-6">
                  {/* Active Asset Card */}
                  <div className="relative overflow-hidden rounded-xl border border-bronze-border bg-charcoal-950 p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="text-xs font-semibold text-ivory-100 block">
                          {uploadResult.data.name}
                        </span>
                        <span className="text-[11px] font-mono text-sand-400">
                          {uploadResult.data.width} × {uploadResult.data.height} px • {(uploadResult.data.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(uploadResult.data!.fileId, uploadResult.data!.supabaseId)}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs text-red-300 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={13} />
                        <span>Delete Asset</span>
                      </button>
                    </div>

                    <div className="relative aspect-cinematic w-full overflow-hidden rounded-lg bg-charcoal-900 border border-bronze-border">
                      <RKImage
                        src={uploadResult.data.url}
                        alt="Uploaded test media"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>

                  {/* Metadata Synced */}
                  <div className="rounded-xl border border-bronze-border bg-charcoal-950/80 p-4 text-xs font-mono space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-sand-400 font-semibold block">
                      PostgreSQL Metadata Record
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sand-300 text-[11px]">
                      <div>
                        <span className="text-sand-500">File ID:</span> {uploadResult.data.fileId}
                      </div>
                      <div>
                        <span className="text-sand-500">Supabase ID:</span> {uploadResult.data.supabaseId || "—"}
                      </div>
                      <div className="sm:col-span-2 truncate">
                        <span className="text-sand-500">CDN URL:</span>{" "}
                        <a
                          href={uploadResult.data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span className="truncate">{uploadResult.data.url}</span>
                          <ExternalLink size={11} className="shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-bronze-border bg-charcoal-950/40 p-12 text-center">
                  <ImageIcon size={32} className="text-sand-600 mb-3" />
                  <p className="text-xs font-medium text-sand-300">
                    No image uploaded in this session.
                  </p>
                  <p className="text-[11px] text-sand-500 max-w-xs mt-1">
                    Upload a photography asset on the left to inspect responsive ImageKit transformations and Supabase records.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preset Showcase */}
      {uploadResult?.data && (
        <div className="space-y-6 pt-6 border-t border-bronze-border/50">
          <div>
            <h2 className="font-display text-xl text-ivory-100">
              Generated Transformation Presets
            </h2>
            <p className="text-xs text-sand-400 font-light">
              Automatic dimensions, WebP/AVIF delivery, and instant LQIP blur-up placeholders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Preset 1 */}
            <Card variant="outline" className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-overline text-gold-400 uppercase">Thumbnail (400px)</span>
                <span className="text-[10px] text-sand-500 font-mono">q-80 • Auto</span>
              </div>
              <RKImage
                src={uploadResult.data.url}
                alt="Thumbnail variant"
                preset="thumbnail"
                aspectRatio="gallery"
              />
              <p className="text-[11px] text-sand-400 leading-tight">
                Optimized for grid listings, cards, and previews.
              </p>
            </Card>

            {/* Preset 2 */}
            <Card variant="outline" className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-overline text-gold-400 uppercase">Card (800px)</span>
                <span className="text-[10px] text-sand-500 font-mono">q-85 • Auto</span>
              </div>
              <RKImage
                src={uploadResult.data.url}
                alt="Gallery card variant"
                preset="card"
                aspectRatio="gallery"
              />
              <p className="text-[11px] text-sand-400 leading-tight">
                Balanced high-density display for portfolio masonry.
              </p>
            </Card>

            {/* Preset 3 */}
            <Card variant="outline" className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-overline text-gold-400 uppercase">Editorial (1400px)</span>
                <span className="text-[10px] text-sand-500 font-mono">q-85 • High Res</span>
              </div>
              <RKImage
                src={uploadResult.data.url}
                alt="Editorial variant"
                preset="editorial"
                aspectRatio="gallery"
              />
              <p className="text-[11px] text-sand-400 leading-tight">
                Rich fine-art detail for story showcases.
              </p>
            </Card>

            {/* Preset 4 */}
            <Card variant="outline" className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-overline text-gold-400 uppercase">Blur LQIP (~30px)</span>
                <span className="text-[10px] text-sand-500 font-mono">bl-40 • &lt;500 B</span>
              </div>
              <div className="relative aspect-gallery w-full overflow-hidden rounded-xl border border-bronze-border bg-charcoal-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadResult.data.blurDataUrl}
                  alt="Low Quality Image Placeholder"
                  className="h-full w-full object-cover filter blur-sm"
                />
              </div>
              <p className="text-[11px] text-sand-400 leading-tight">
                Microscopic placeholder loaded before high-res image resolves.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

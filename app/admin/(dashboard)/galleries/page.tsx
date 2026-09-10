import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import RKImage from "@/components/ui/RKImage";
import {
  Images,
  FlaskConical,
  Plus,
  FolderKanban,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminGalleriesPage() {
  const supabase = await createClient();

  const [projectsRes, totalImagesRes, featuredImagesRes] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title, slug, cover_image_url, published, categories(name), project_images(count)")
      .order("created_at", { ascending: false }),
    supabase.from("project_images").select("*", { count: "exact", head: true }),
    supabase
      .from("project_images")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true),
  ]);

  const projects = projectsRes.data || [];
  const totalImages = totalImagesRes.count ?? 0;
  const featuredImages = featuredImagesRes.count ?? 0;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Galleries & Media"
        description="High-resolution photography organized by project and delivered via ImageKit CDN."
        badge={
          <Badge variant="gold" size="sm">
            {totalImages} Photos Total
          </Badge>
        }
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/test-media"
              className="inline-flex items-center gap-1.5 rounded-xl border border-bronze-border bg-charcoal-900 px-3.5 py-2 text-xs font-medium uppercase tracking-editorial text-sand-300 hover:border-gold-500/40 hover:text-ivory-100 transition-colors"
            >
              <FlaskConical size={14} className="text-gold-400" />
              <span>Media Lab</span>
            </Link>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-3.5 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle"
            >
              <Plus size={14} />
              <span>New Gallery Project</span>
            </Link>
          </div>
        }
      />

      {/* Gallery Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 p-4">
          <span className="text-xs uppercase tracking-wider text-sand-400 font-medium">
            Total Media Assets
          </span>
          <p className="mt-2 font-display text-2xl font-medium text-ivory-100">
            {totalImages}
          </p>
          <span className="text-[11px] text-sand-500 font-light">
            Synchronized with Supabase metadata
          </span>
        </div>

        <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 p-4">
          <span className="text-xs uppercase tracking-wider text-sand-400 font-medium">
            Featured Highlights
          </span>
          <p className="mt-2 font-display text-2xl font-medium text-gold-400">
            {featuredImages}
          </p>
          <span className="text-[11px] text-sand-500 font-light">
            Selected for social and feed showcases
          </span>
        </div>

        <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 p-4">
          <span className="text-xs uppercase tracking-wider text-sand-400 font-medium">
            Active Showcases
          </span>
          <p className="mt-2 font-display text-2xl font-medium text-ivory-100">
            {projects.length}
          </p>
          <span className="text-[11px] text-sand-500 font-light">
            Albums with independent gallery managers
          </span>
        </div>
      </div>

      {/* Project Galleries List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-normal text-ivory-100">
            Project Galleries
          </h2>
          <p className="text-xs text-sand-500">
            Select an album to upload, reorder, or set cover photos.
          </p>
        </div>

        {projects.length === 0 ? (
          <AdminEmptyState
            icon={FolderKanban}
            title="No Projects in Database"
            description="Create a photoshoot project first to begin uploading gallery photos."
            actionLabel="Create Project"
            actionHref="/admin/projects/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => {
              // @ts-ignore category joined
              const categoryName = proj.categories?.name;
              // @ts-ignore count joined
              const photoCount = proj.project_images?.[0]?.count ?? 0;

              return (
                <Link
                  key={proj.id}
                  href={`/admin/projects/${proj.id}/gallery`}
                  className="group rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 overflow-hidden transition-all hover:border-gold-500/40 hover:bg-charcoal-900 hover:shadow-card-luxury flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Aspect Container */}
                    <div className="relative aspect-cinematic w-full overflow-hidden bg-charcoal-950 border-b border-bronze-border/50">
                      <RKImage
                        src={proj.cover_image_url}
                        alt={proj.title}
                        preset="card"
                        aspectRatio="cinematic"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute top-2.5 right-2.5 z-10">
                        <Badge
                          variant={proj.published ? "gold" : "outline"}
                          size="sm"
                        >
                          {proj.published ? "Published" : "Draft"}
                        </Badge>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 z-10">
                        <span className="rounded-full bg-charcoal-950/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono text-sand-300 border border-bronze-border/60">
                          {photoCount} photos
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gold-400 font-mono">
                          /{proj.slug}
                        </span>
                        {categoryName && (
                          <span className="text-[10px] text-sand-500 uppercase tracking-wider">
                            {categoryName}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-medium text-ivory-100 group-hover:text-gold-300 transition-colors">
                        {proj.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-bronze-border/30 mt-3 flex items-center justify-between text-xs text-gold-400 font-medium">
                    <span>Manage Gallery Photos</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import {
  FolderKanban,
  Images,
  Inbox,
  Globe,
  ArrowUpRight,
  Plus,
  ArrowRight,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 0; // Dynamic data on every admin request

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts in parallel
  const [
    projectsRes,
    imagesRes,
    inquiriesRes,
    publishedProjectsRes,
    publishedPostsRes,
    recentInquiriesRes,
    recentProjectsRes,
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("project_images").select("*", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("inquiries")
      .select("id, name, event_type, event_date, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("projects")
      .select("id, title, slug, published, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalProjects = projectsRes.count ?? 0;
  const totalImages = imagesRes.count ?? 0;
  const newInquiries = inquiriesRes.count ?? 0;
  const publishedContent =
    (publishedProjectsRes.count ?? 0) + (publishedPostsRes.count ?? 0);

  const recentInquiries = recentInquiriesRes.data || [];
  const recentProjects = recentProjectsRes.data || [];

  const metrics = [
    {
      title: "Total Projects",
      value: totalProjects,
      description: "Client showcases & shoots",
      icon: FolderKanban,
      href: "/admin/projects",
      trend: `${publishedProjectsRes.count ?? 0} published`,
    },
    {
      title: "Total Images",
      value: totalImages,
      description: "Delivered via ImageKit CDN",
      icon: Images,
      href: "/admin/galleries",
      trend: "Zero DB bloat",
    },
    {
      title: "New Inquiries",
      value: newInquiries,
      description: "Awaiting studio response",
      icon: Inbox,
      href: "/admin/inquiries",
      highlight: newInquiries > 0,
      trend: newInquiries > 0 ? "Action required" : "All responded",
    },
    {
      title: "Published Content",
      value: publishedContent,
      description: "Live portfolio & stories",
      icon: Globe,
      href: "/admin/projects",
      trend: "Publicly visible",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <AdminPageHeader
        title="Dashboard"
        description="Studio metrics, incoming client inquiries, and media delivery overview."
        badge={
          <Badge variant="gold" size="sm" dot>
            Live Database
          </Badge>
        }
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/test-media"
              className="inline-flex items-center gap-1.5 rounded-xl border border-bronze-border bg-charcoal-900 px-3.5 py-2 text-xs font-medium uppercase tracking-editorial text-sand-300 hover:border-gold-500/40 hover:text-ivory-100 transition-colors"
            >
              <Sparkles size={14} className="text-gold-400" />
              <span>Media Lab</span>
            </Link>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-3.5 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle"
            >
              <Plus size={14} />
              <span>New Project</span>
            </Link>
          </div>
        }
      />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.title}
              href={m.href}
              className="group relative rounded-2xl border border-bronze-border/70 bg-charcoal-900/70 p-5 transition-all hover:border-gold-500/40 hover:bg-charcoal-900 hover:shadow-card-luxury"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-sand-400">
                  {m.title}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-bronze-border bg-charcoal-850 text-gold-400 transition-colors group-hover:border-gold-500/40">
                  <Icon size={18} />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-display text-3xl font-medium text-ivory-100">
                  {m.value}
                </span>
                <span
                  className={`text-[11px] font-medium tracking-wide ${
                    m.highlight ? "text-amber-400" : "text-sand-500"
                  }`}
                >
                  {m.trend}
                </span>
              </div>

              <p className="mt-1 text-xs text-sand-500 font-light truncate">
                {m.description}
              </p>

              <div className="mt-4 flex items-center gap-1 text-[11px] text-gold-400 opacity-0 transition-opacity group-hover:opacity-100">
                <span>Manage</span>
                <ArrowRight size={12} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Section: Recent Inquiries & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-medium text-ivory-100">
                Recent Inquiries
              </h2>
              <p className="text-xs text-sand-500">Incoming booking leads from couples & clients</p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <AdminEmptyState
              icon={Inbox}
              title="No Inquiries Yet"
              description="When potential clients submit the inquiry form on your website, their contact details will appear here."
              className="py-10"
            />
          ) : (
            <div className="divide-y divide-bronze-border/40">
              {recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ivory-100 truncate">
                      {inq.name}
                    </p>
                    <p className="text-[11px] text-sand-400 font-light flex items-center gap-2 mt-0.5">
                      <span>{inq.event_type || "Photography"}</span>
                      {inq.event_date && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} className="text-sand-500" />
                            {inq.event_date}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  <Badge
                    variant={inq.status === "new" ? "gold" : "charcoal"}
                    size="sm"
                  >
                    {inq.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-medium text-ivory-100">
                Portfolio Projects
              </h2>
              <p className="text-xs text-sand-500">Showcases configured in the studio database</p>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <AdminEmptyState
              icon={FolderKanban}
              title="No Projects Configured"
              description="Start building your portfolio by creating your first photoshoot project."
              actionLabel="Create Project"
              actionHref="/admin/projects"
              className="py-10"
            />
          ) : (
            <div className="divide-y divide-bronze-border/40">
              {recentProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ivory-100 truncate">
                      {proj.title}
                    </p>
                    <p className="text-[11px] text-sand-500 font-mono mt-0.5 truncate">
                      /{proj.slug}
                    </p>
                  </div>

                  <Badge
                    variant={proj.published ? "gold" : "outline"}
                    size="sm"
                  >
                    {proj.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Security & RLS Status Bar */}
      <div className="rounded-2xl border border-gold-500/20 bg-charcoal-900/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-sand-300">
          <ShieldCheck size={16} className="text-gold-400 shrink-0" />
          <span>
            Database Architecture active with 15 PostgreSQL tables &amp; strict Row-Level Security.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-sand-400 uppercase tracking-wider">
            Connected: Supabase ap-southeast-2
          </span>
        </div>
      </div>
    </div>
  );
}

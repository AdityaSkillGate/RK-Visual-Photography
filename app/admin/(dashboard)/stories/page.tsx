import React from "react";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import { BookOpen, Plus } from "lucide-react";

export const revalidate = 0;

export default async function AdminStoriesPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const postList = posts || [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Stories & Journal"
        description="Editorial wedding stories, photography advice, behind-the-scenes, and local Tamil Nadu venue guides."
        badge={
          <Badge variant="gold" size="sm">
            {postList.length} Stories
          </Badge>
        }
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-3.5 py-2 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 hover:bg-gold-400 transition-all shadow-gold-subtle"
          >
            <Plus size={14} />
            <span>Write Story</span>
          </button>
        }
      />

      {postList.length === 0 ? (
        <AdminEmptyState
          icon={BookOpen}
          title="No Stories Published Yet"
          description="In Phase 11, publish journal articles, wedding photo essays, and SEO-rich Tamil Nadu venue features."
          actionLabel="Draft First Story"
        />
      ) : (
        <div className="rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-bronze-border/60 bg-charcoal-850/80 text-[11px] uppercase tracking-wider text-sand-400">
                <tr>
                  <th className="py-3.5 px-4 font-medium">Title</th>
                  <th className="py-3.5 px-4 font-medium">Slug</th>
                  <th className="py-3.5 px-4 font-medium">Status</th>
                  <th className="py-3.5 px-4 font-medium">Published At</th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bronze-border/40 text-sand-300">
                {postList.map((post) => (
                  <tr key={post.id} className="hover:bg-charcoal-850/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-ivory-100">
                      {post.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gold-400">
                      /{post.slug}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={post.published ? "gold" : "outline"} size="sm">
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-sand-500">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        className="text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
                      >
                        Edit
                      </button>
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

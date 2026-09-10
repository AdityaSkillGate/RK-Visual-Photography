"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAdminToast } from "@/components/admin/AdminToastContext";
import { useAdminConfirm } from "@/components/admin/AdminConfirmDialog";
import {
  createSocialLinkAction,
  updateSocialLinkAction,
  deleteSocialLinkAction,
  toggleSocialLinkActiveAction,
  reorderSocialLinksAction,
  createSocialPostAction,
  updateSocialPostAction,
  deleteSocialPostAction,
  toggleSocialPostFeaturedAction,
  reorderSocialPostsAction,
  detectSocialMetadata,
  type SocialLinkInput,
  type SocialPostInput,
} from "./actions";
import type { SocialLinkRow, SocialPostRow } from "@/lib/supabase/queries";
import {
  Share2,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Video,
  Sparkles,
  X,
  Play,
} from "lucide-react";
import {
  InstagramIcon,
  YouTubeIcon,
  FacebookIcon,
  WhatsAppIcon,
  GoogleBusinessIcon,
} from "@/components/ui/SocialIcons";

interface SocialMediaManagerProps {
  initialLinks: SocialLinkRow[];
  initialPosts: SocialPostRow[];
}

export default function SocialMediaManager({
  initialLinks,
  initialPosts,
}: SocialMediaManagerProps) {
  const [activeTab, setActiveTab] = useState<"channels" | "feed">("feed");
  const [links, setLinks] = useState<SocialLinkRow[]>(initialLinks);
  const [posts, setPosts] = useState<SocialPostRow[]>(initialPosts);

  // Link Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLinkRow | null>(null);
  const [linkPlatform, setLinkPlatform] = useState("instagram");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkHandle, setLinkHandle] = useState("");
  const [linkActive, setLinkActive] = useState(true);

  // Post Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPostRow | null>(null);
  const [postPlatform, setPostPlatform] = useState<"instagram" | "youtube" | "facebook">("instagram");
  const [postUrl, setPostUrl] = useState("");
  const [postThumbnail, setPostThumbnail] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [postFeatured, setPostFeatured] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);

  const [isPending, startTransition] = useTransition();
  const toast = useAdminToast();
  const confirm = useAdminConfirm();

  // Platform Icons Helper
  const getPlatformIcon = (platform: string, size = 16) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <InstagramIcon size={size} className="text-pink-400" />;
      case "youtube":
        return <YouTubeIcon size={size} className="text-red-400" />;
      case "whatsapp":
        return <WhatsAppIcon size={size} className="text-emerald-400" />;
      case "facebook":
        return <FacebookIcon size={size} className="text-blue-400" />;
      case "google_business":
        return <GoogleBusinessIcon size={size} className="text-amber-400" />;
      default:
        return <Share2 size={size} className="text-gold-400" />;
    }
  };

  // Auto-detect link metadata on URL change in Post Modal
  const handlePostUrlChange = async (url: string) => {
    setPostUrl(url);
    if (url.trim().length > 10 && !editingPost) {
      setIsDetecting(true);
      try {
        const meta = await detectSocialMetadata(url);
        if (meta.platform === "youtube" || meta.platform === "instagram" || meta.platform === "facebook") {
          setPostPlatform(meta.platform);
        }
        if (meta.suggestedThumbnail && !postThumbnail) {
          setPostThumbnail(meta.suggestedThumbnail);
        }
      } finally {
        setIsDetecting(false);
      }
    }
  };

  // ============================================================================
  // SOCIAL LINKS ACTIONS
  // ============================================================================

  const openCreateLinkModal = () => {
    setEditingLink(null);
    setLinkPlatform("instagram");
    setLinkLabel("Instagram");
    setLinkUrl("https://www.instagram.com/");
    setLinkHandle("@");
    setLinkActive(true);
    setIsLinkModalOpen(true);
  };

  const openEditLinkModal = (link: SocialLinkRow) => {
    setEditingLink(link);
    setLinkPlatform(link.platform);
    setLinkLabel(link.label);
    setLinkUrl(link.url);
    setLinkHandle(link.handle || "");
    setLinkActive(link.is_active);
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkLabel.trim() || !linkUrl.trim()) {
      toast.error("Please provide both label and URL.");
      return;
    }

    startTransition(async () => {
      if (editingLink) {
        const res = await updateSocialLinkAction(editingLink.id, {
          label: linkLabel,
          url: linkUrl,
          handle: linkHandle,
          is_active: linkActive,
        });

        if (res.success && res.data) {
          setLinks((prev) =>
            prev.map((l) => (l.id === editingLink.id ? (res.data as SocialLinkRow) : l))
          );
          toast.success("Social channel updated.");
          setIsLinkModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update channel.");
        }
      } else {
        const input: SocialLinkInput = {
          platform: linkPlatform,
          label: linkLabel,
          url: linkUrl,
          handle: linkHandle,
          is_active: linkActive,
        };

        const res = await createSocialLinkAction(input);
        if (res.success && res.data) {
          setLinks((prev) => [...prev, res.data as SocialLinkRow]);
          toast.success("Social channel connected.");
          setIsLinkModalOpen(false);
        } else {
          toast.error(res.error || "Failed to add channel.");
        }
      }
    });
  };

  const handleToggleLinkActive = (link: SocialLinkRow) => {
    startTransition(async () => {
      const res = await toggleSocialLinkActiveAction(link.id, link.is_active);
      if (res.success) {
        setLinks((prev) =>
          prev.map((l) => (l.id === link.id ? { ...l, is_active: !l.is_active } : l))
        );
        toast.success(`${link.label} is now ${link.is_active ? "hidden" : "active"}.`);
      } else {
        toast.error(res.error || "Failed to update visibility.");
      }
    });
  };

  const handleMoveLink = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;

    const reordered = [...links];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setLinks(reordered);

    startTransition(async () => {
      const res = await reorderSocialLinksAction(reordered.map((l) => l.id));
      if (!res.success) {
        toast.error(res.error || "Failed to save reorder.");
        setLinks(links); // rollback
      }
    });
  };

  const handleDeleteLink = async (link: SocialLinkRow) => {
    const confirmed = await confirm({
      title: "Disconnect Social Channel?",
      message: `Are you sure you want to disconnect ${link.label}? This will remove it from the footer and contact sections.`,
      confirmText: "Disconnect Channel",
      variant: "danger",
    });

    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteSocialLinkAction(link.id);
      if (res.success) {
        setLinks((prev) => prev.filter((l) => l.id !== link.id));
        toast.success(`${link.label} disconnected.`);
      } else {
        toast.error(res.error || "Failed to delete channel.");
      }
    });
  };

  // ============================================================================
  // SOCIAL POSTS ACTIONS
  // ============================================================================

  const openCreatePostModal = () => {
    setEditingPost(null);
    setPostPlatform("instagram");
    setPostUrl("");
    setPostThumbnail("");
    setPostCaption("");
    setPostFeatured(true);
    setIsPostModalOpen(true);
  };

  const openEditPostModal = (post: SocialPostRow) => {
    setEditingPost(post);
    setPostPlatform((post.platform as "instagram" | "youtube" | "facebook") || "instagram");
    setPostUrl(post.post_url);
    setPostThumbnail(post.thumbnail_url || "");
    setPostCaption(post.caption || "");
    setPostFeatured(post.is_featured);
    setIsPostModalOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.trim()) {
      toast.error("Please provide the Reel, Short, or Post URL.");
      return;
    }

    startTransition(async () => {
      if (editingPost) {
        const res = await updateSocialPostAction(editingPost.id, {
          platform: postPlatform,
          post_url: postUrl,
          thumbnail_url: postThumbnail,
          caption: postCaption,
          is_featured: postFeatured,
        });

        if (res.success && res.data) {
          setPosts((prev) =>
            prev.map((p) => (p.id === editingPost.id ? (res.data as SocialPostRow) : p))
          );
          toast.success("Curated post updated.");
          setIsPostModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update post.");
        }
      } else {
        const input: SocialPostInput = {
          platform: postPlatform,
          post_url: postUrl,
          thumbnail_url: postThumbnail,
          caption: postCaption,
          is_featured: postFeatured,
        };

        const res = await createSocialPostAction(input);
        if (res.success && res.data) {
          setPosts((prev) => [...prev, res.data as SocialPostRow]);
          toast.success("New social content added to feed.");
          setIsPostModalOpen(false);
        } else {
          toast.error(res.error || "Failed to add post.");
        }
      }
    });
  };

  const handleTogglePostFeatured = (post: SocialPostRow) => {
    startTransition(async () => {
      const res = await toggleSocialPostFeaturedAction(post.id, post.is_featured);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, is_featured: !p.is_featured } : p))
        );
        toast.success(`Post is now ${post.is_featured ? "hidden from" : "featured on"} homepage.`);
      } else {
        toast.error(res.error || "Failed to update featured status.");
      }
    });
  };

  const handleMovePost = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= posts.length) return;

    const reordered = [...posts];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setPosts(reordered);

    startTransition(async () => {
      const res = await reorderSocialPostsAction(reordered.map((p) => p.id));
      if (!res.success) {
        toast.error(res.error || "Failed to save reorder.");
        setPosts(posts); // rollback
      }
    });
  };

  const handleDeletePost = async (post: SocialPostRow) => {
    const confirmed = await confirm({
      title: "Remove from Curated Feed?",
      message: `Are you sure you want to remove this ${post.platform} item from your curated feed?`,
      confirmText: "Remove Post",
      variant: "danger",
    });

    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteSocialPostAction(post.id);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        toast.success("Post removed from feed.");
      } else {
        toast.error(res.error || "Failed to remove post.");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <AdminPageHeader
        title="Social Media & Feed"
        description="Curate studio profiles (Instagram, YouTube, WhatsApp) and select featured Reels & Cinema Shorts for the public website."
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="gold" size="sm">
              {links.filter((l) => l.is_active).length} Channels Active
            </Badge>
            <Badge variant="outline" size="sm">
              {posts.filter((p) => p.is_featured).length} Posts Featured
            </Badge>
          </div>
        }
        action={
          activeTab === "channels" ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={openCreateLinkModal}
              className="inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Connect Channel</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={openCreatePostModal}
              className="inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Reel / Short</span>
            </Button>
          )
        }
      />

      {/* Tabs Navigation */}
      <div className="flex border-b border-bronze-border/60">
        <button
          type="button"
          onClick={() => setActiveTab("feed")}
          className={`flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-editorial transition-all border-b-2 ${
            activeTab === "feed"
              ? "border-gold-400 text-gold-400 bg-charcoal-900/40"
              : "border-transparent text-sand-500 hover:text-sand-300"
          }`}
        >
          <Video size={16} />
          <span>Curated Social Feed ({posts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("channels")}
          className={`flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-editorial transition-all border-b-2 ${
            activeTab === "channels"
              ? "border-gold-400 text-gold-400 bg-charcoal-900/40"
              : "border-transparent text-sand-500 hover:text-sand-300"
          }`}
        >
          <Share2 size={16} />
          <span>Connected Channels ({links.length})</span>
        </button>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: CURATED SOCIAL FEED (REELS, SHORTS, POSTS) */}
      {/* ======================================================================= */}
      {activeTab === "feed" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-medium text-ivory-100">
                &ldquo;Follow the Journey&rdquo; Curated Showcase
              </h2>
              <p className="text-xs text-sand-400 font-light">
                These Instagram Reels and YouTube Shorts appear in the public homepage social section.
              </p>
            </div>

            <span className="text-[11px] font-mono text-sand-500">
              Drag or use arrows to reorder
            </span>
          </div>

          {posts.length === 0 ? (
            <AdminEmptyState
              icon={Video}
              title="No Social Feed Content Yet"
              description="Add your latest wedding highlights from Instagram Reels or YouTube Shorts."
              actionLabel="Add First Post"
              onAction={openCreatePostModal}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-bronze-border/70 bg-charcoal-900/70 p-4 transition-all hover:border-gold-500/40"
                >
                  {/* Thumbnail / Media Container */}
                  <div className="relative aspect-[9/12] w-full overflow-hidden rounded-xl bg-charcoal-950">
                    {post.thumbnail_url ? (
                      <Image
                        src={post.thumbnail_url}
                        alt={post.caption || "Social post preview"}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-charcoal-850 text-sand-600">
                        <Video size={36} />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-transparent" />

                    {/* Platform Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-charcoal-950/80 backdrop-blur-md px-2.5 py-1 border border-bronze-border/60">
                      {getPlatformIcon(post.platform, 13)}
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ivory-200 capitalize">
                        {post.platform}
                      </span>
                    </div>

                    {/* Featured Pill */}
                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={() => handleTogglePostFeatured(post)}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                          post.is_featured
                            ? "bg-gold-500/20 text-gold-300 border border-gold-500/40"
                            : "bg-charcoal-900/80 text-sand-500 border border-bronze-border/50"
                        }`}
                      >
                        {post.is_featured ? (
                          <>
                            <Eye size={10} />
                            <span>Featured</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={10} />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Play Badge */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-950/70 border border-gold-500/50 text-gold-400 shadow-gold-subtle group-hover:scale-110 transition-transform">
                        <Play size={20} className="ml-0.5 fill-gold-400/20" />
                      </div>
                    </div>

                    {/* Caption & External link */}
                    <div className="absolute bottom-3 inset-x-3 space-y-1">
                      <p className="line-clamp-2 text-xs font-medium text-ivory-100">
                        {post.caption || "Untitled Highlight"}
                      </p>
                      <a
                        href={post.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-300 truncate max-w-full"
                      >
                        <span className="truncate">{post.post_url}</span>
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Actions & Reorder Row */}
                  <div className="mt-4 flex items-center justify-between border-t border-bronze-border/40 pt-3">
                    {/* Order Controls */}
                    <div className="flex items-center gap-1 text-sand-400">
                      <button
                        type="button"
                        disabled={index === 0 || isPending}
                        onClick={() => handleMovePost(index, "up")}
                        className="p-1 rounded-md hover:bg-charcoal-800 disabled:opacity-30 transition-colors"
                        title="Move Earlier in Feed"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <span className="text-[11px] font-mono text-sand-500 px-1">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        disabled={index === posts.length - 1 || isPending}
                        onClick={() => handleMovePost(index, "down")}
                        className="p-1 rounded-md hover:bg-charcoal-800 disabled:opacity-30 transition-colors"
                        title="Move Later in Feed"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditPostModal(post)}
                        className="inline-flex items-center gap-1 rounded-lg border border-bronze-border/70 bg-charcoal-850 px-2.5 py-1 text-[11px] text-sand-300 hover:text-ivory-100 hover:border-gold-500/40 transition-colors"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove Post"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: CONNECTED CHANNELS (PROFILES) */}
      {/* ======================================================================= */}
      {activeTab === "channels" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-medium text-ivory-100">
                Connected Studio Channels
              </h2>
              <p className="text-xs text-sand-400 font-light">
                These profile links populate the website header, footer, and contact concierge card.
              </p>
            </div>
          </div>

          {links.length === 0 ? (
            <AdminEmptyState
              icon={Share2}
              title="No Social Channels Configured"
              description="Connect your studio's Instagram, YouTube, and WhatsApp accounts."
              actionLabel="Connect Channel"
              onAction={openCreateLinkModal}
            />
          ) : (
            <div className="space-y-3">
              {links.map((link, index) => (
                <div
                  key={link.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-bronze-border/70 bg-charcoal-900/60 p-4 transition-all hover:border-gold-500/30"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Platform Icon Box */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-bronze-border bg-charcoal-850">
                      {getPlatformIcon(link.platform, 22)}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-medium text-ivory-100">
                          {link.label}
                        </span>
                        {link.handle && (
                          <span className="text-xs font-mono text-sand-500">
                            {link.handle}
                          </span>
                        )}
                      </div>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-sand-400 hover:text-gold-400 transition-colors truncate max-w-md"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink size={11} className="shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* Reorder arrows */}
                    <div className="flex items-center gap-1 border-r border-bronze-border/40 pr-3">
                      <button
                        type="button"
                        disabled={index === 0 || isPending}
                        onClick={() => handleMoveLink(index, "up")}
                        className="p-1 rounded hover:bg-charcoal-800 disabled:opacity-30 text-sand-400"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={index === links.length - 1 || isPending}
                        onClick={() => handleMoveLink(index, "down")}
                        className="p-1 rounded hover:bg-charcoal-800 disabled:opacity-30 text-sand-400"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    {/* Active Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleLinkActive(link)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                        link.is_active
                          ? "bg-gold-500/20 text-gold-300 border border-gold-500/40"
                          : "bg-charcoal-800 text-sand-500 border border-bronze-border"
                      }`}
                    >
                      {link.is_active ? "Active" : "Hidden"}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => openEditLinkModal(link)}
                      className="p-1.5 rounded-lg border border-bronze-border/70 text-sand-400 hover:text-ivory-100 hover:border-gold-500/40 transition-colors"
                      title="Edit Channel"
                    >
                      <Edit2 size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link)}
                      className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Channel"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 1: ADD / EDIT SOCIAL POST */}
      {/* ======================================================================= */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-bronze-border bg-charcoal-900 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-bronze-border/40 pb-4">
              <div className="flex items-center gap-2">
                <Video size={18} className="text-gold-400" />
                <h3 className="font-display text-lg font-medium text-ivory-100">
                  {editingPost ? "Edit Curated Social Post" : "Add Reel / Short to Feed"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="text-sand-400 hover:text-ivory-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              {/* URL with smart detection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                  Reel or Video URL *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://www.instagram.com/reel/... or https://youtube.com/shorts/..."
                    value={postUrl}
                    onChange={(e) => handlePostUrlChange(e.target.value)}
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-850 px-3.5 py-2.5 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                  />
                  {isDetecting && (
                    <div className="absolute right-3 top-2.5 text-[11px] text-gold-400 flex items-center gap-1">
                      <Sparkles size={12} className="animate-spin" />
                      <span>Detecting...</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-sand-500">
                  Paste any Instagram Reel, YouTube Shorts, or Facebook video URL.
                </p>
              </div>

              {/* Platform Selector */}
              <div className="grid grid-cols-3 gap-2">
                {(["instagram", "youtube", "facebook"] as const).map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPostPlatform(plat)}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium capitalize border transition-all ${
                      postPlatform === plat
                        ? "border-gold-400 bg-charcoal-800 text-gold-300"
                        : "border-bronze-border/60 bg-charcoal-850/60 text-sand-400 hover:text-ivory-100"
                    }`}
                  >
                    {getPlatformIcon(plat, 14)}
                    <span>{plat}</span>
                  </button>
                ))}
              </div>

              {/* Caption */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                  Caption / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sacred Muhurtham Moments & Temple Gold"
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  className="w-full rounded-xl border border-bronze-border bg-charcoal-850 px-3.5 py-2.5 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                  Thumbnail Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or auto-detected"
                  value={postThumbnail}
                  onChange={(e) => setPostThumbnail(e.target.value)}
                  className="w-full rounded-xl border border-bronze-border bg-charcoal-850 px-3.5 py-2.5 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
              </div>

              {/* Preview Box if thumbnail available */}
              {postThumbnail && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-bronze-border bg-charcoal-950">
                  <Image
                    src={postThumbnail}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded-md bg-charcoal-950/80 px-2 py-0.5 text-[10px] text-gold-400 border border-bronze-border">
                    Preview Poster
                  </div>
                </div>
              )}

              {/* Featured toggle */}
              <div className="flex items-center justify-between rounded-xl border border-bronze-border/60 bg-charcoal-850/40 p-3">
                <div>
                  <span className="text-xs font-medium text-ivory-100 block">
                    Feature on Homepage
                  </span>
                  <span className="text-[11px] text-sand-500">
                    Display prominently in the &ldquo;Follow the Journey&rdquo; feed.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={postFeatured}
                  onChange={(e) => setPostFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-bronze-border bg-charcoal-900 text-gold-500 focus:ring-gold-400"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-bronze-border/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPostModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : editingPost ? "Update Post" : "Add to Feed"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: ADD / EDIT SOCIAL LINK CHANNEL */}
      {/* ======================================================================= */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-bronze-border bg-charcoal-900 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-bronze-border/40 pb-4">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-gold-400" />
                <h3 className="font-display text-lg font-medium text-ivory-100">
                  {editingLink ? `Edit ${editingLink.label}` : "Connect Social Channel"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="text-sand-400 hover:text-ivory-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4">
              {/* Platform Preset */}
              {!editingLink && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                    Platform Type
                  </label>
                  <select
                    value={linkPlatform}
                    onChange={(e) => {
                      const p = e.target.value;
                      setLinkPlatform(p);
                      if (p === "instagram") {
                        setLinkLabel("Instagram");
                        setLinkUrl("https://www.instagram.com/rk_visual_photography/");
                        setLinkHandle("@rk_visual_photography");
                      } else if (p === "youtube") {
                        setLinkLabel("YouTube Cinema");
                        setLinkUrl("https://www.youtube.com/@rkvisualphotography");
                        setLinkHandle("@rkvisualphotography");
                      } else if (p === "whatsapp") {
                        setLinkLabel("WhatsApp Concierge");
                        setLinkUrl("https://wa.me/919876543210");
                        setLinkHandle("+91 98765 43210");
                      } else if (p === "facebook") {
                        setLinkLabel("Facebook");
                        setLinkUrl("https://www.facebook.com/rkvisualphotography");
                        setLinkHandle("RK Visual Photography");
                      } else if (p === "google_business") {
                        setLinkLabel("Google Reviews");
                        setLinkUrl("https://maps.google.com/?q=RK+Visual+Photography+Tamil+Nadu");
                        setLinkHandle("5.0 ★ Client Reviews");
                      }
                    }}
                    className="w-full rounded-xl border border-bronze-border bg-charcoal-850 px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="facebook">Facebook</option>
                    <option value="google_business">Google Business / Reviews</option>
                  </select>
                </div>
              )}

              {/* Label */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                  Channel Display Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Instagram Profile or YouTube Cinema"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  className="w-full rounded-xl border border-bronze-border bg-charcoal-850 px-3.5 py-2.5 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
              </div>

              {/* URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                  Direct Profile URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full rounded-xl border border-bronze-border bg-charcoal-850 px-3.5 py-2.5 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
              </div>

              {/* Handle / Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                  Display Handle / Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. @rk_visual_photography or +91 98765 43210"
                  value={linkHandle}
                  onChange={(e) => setLinkHandle(e.target.value)}
                  className="w-full rounded-xl border border-bronze-border bg-charcoal-850 px-3.5 py-2.5 text-xs text-ivory-100 placeholder:text-sand-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-bronze-border/60 bg-charcoal-850/40 p-3">
                <div>
                  <span className="text-xs font-medium text-ivory-100 block">
                    Active Channel
                  </span>
                  <span className="text-[11px] text-sand-500">
                    Display across website footer, header, and contact options.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={linkActive}
                  onChange={(e) => setLinkActive(e.target.checked)}
                  className="h-4 w-4 rounded border-bronze-border bg-charcoal-900 text-gold-500 focus:ring-gold-400"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-bronze-border/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLinkModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : editingLink ? "Update Channel" : "Connect Channel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PROJECTS,
  FALLBACK_SERVICES,
  FALLBACK_TESTIMONIALS,
  FALLBACK_CHATBOT_CATEGORIES,
  FALLBACK_CHATBOT_QUESTIONS,
  FALLBACK_SOCIAL_LINKS,
  FALLBACK_SOCIAL_POSTS,
  FALLBACK_BLOG_POSTS,
  FALLBACK_SITE_SETTINGS,
  FALLBACK_EXPERIENCE_METRICS,
  type ExperienceMetricItem,
} from "./fallback-data";

export type { ExperienceMetricItem };

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectImageRow = Database["public"]["Tables"]["project_images"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];
export type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];
export type ChatbotCategoryRow = Database["public"]["Tables"]["chatbot_categories"]["Row"];
export type ChatbotQuestionRow = Database["public"]["Tables"]["chatbot_questions"]["Row"];
export type SocialLinkRow = Database["public"]["Tables"]["social_links"]["Row"];
export type SocialPostRow = Database["public"]["Tables"]["social_posts"]["Row"];
export type InquiryRow = Database["public"]["Tables"]["inquiries"]["Row"];


export interface PublicChatbotQuestion extends ChatbotQuestionRow {
  chatbot_categories?: ChatbotCategoryRow | null;
}

export interface PublicProject extends ProjectRow {
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  project_images?: ProjectImageRow[];
}

/**
 * Fetches all published projects, optionally filtered by category slug.
 */
export async function getPublishedProjects(categorySlug?: string): Promise<PublicProject[]> {
  if (!isSupabaseConfigured()) {
    if (categorySlug && categorySlug !== "all") {
      return FALLBACK_PROJECTS.filter((p) => p.categories?.slug === categorySlug);
    }
    return FALLBACK_PROJECTS;
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from("projects")
      .select("*, categories(id, name, slug), project_images(*)")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (categorySlug && categorySlug !== "all") {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (cat) {
        query = query.eq("category_id", cat.id);
      }
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (categorySlug && categorySlug !== "all") {
        return FALLBACK_PROJECTS.filter((p) => p.categories?.slug === categorySlug);
      }
      return FALLBACK_PROJECTS;
    }

    return data as unknown as PublicProject[];
  } catch (err) {
    console.warn("Fallback served for getPublishedProjects:", err);
    if (categorySlug && categorySlug !== "all") {
      return FALLBACK_PROJECTS.filter((p) => p.categories?.slug === categorySlug);
    }
    return FALLBACK_PROJECTS;
  }
}

/**
 * Fetches featured projects for the flagship homepage showcase.
 */
export async function getFeaturedProjects(): Promise<PublicProject[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS.filter((p) => p.featured);
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*, categories(id, name, slug), project_images(*)")
      .eq("published", true)
      .eq("featured", true)
      .order("order_index", { ascending: true })
      .limit(6);

    if (error || !data || data.length === 0) {
      return FALLBACK_PROJECTS.filter((p) => p.featured);
    }

    return data as unknown as PublicProject[];
  } catch (err) {
    console.warn("Fallback served for getFeaturedProjects:", err);
    return FALLBACK_PROJECTS.filter((p) => p.featured);
  }
}

/**
 * Fetches a single project by its unique URL slug, including all gallery images.
 */
export async function getProjectBySlug(slug: string): Promise<PublicProject | null> {
  if (!isSupabaseConfigured()) {
    const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug);
    return fallback || null;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*, categories(id, name, slug), project_images(*)")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) {
      const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug);
      return fallback || null;
    }

    const project = data as unknown as PublicProject;
    if (project.project_images && Array.isArray(project.project_images)) {
      project.project_images.sort((a, b) => a.order_index - b.order_index);
    }

    return project;
  } catch (err) {
    console.warn("Fallback served for getProjectBySlug:", err);
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Fetches the next published project in sequence for seamless editorial next-project navigation.
 */
export async function getNextProject(currentSlug: string): Promise<PublicProject | null> {
  try {
    const projects = await getPublishedProjects();
    if (!projects || projects.length === 0) return null;

    const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
    if (currentIndex === -1) {
      return projects[0] || null;
    }

    const nextIndex = (currentIndex + 1) % projects.length;
    return projects[nextIndex] || null;
  } catch (err) {
    console.warn("Fallback served for getNextProject:", err);
    return null;
  }
}

/**
 * Fetches all active published categories.
 */
export async function getActiveCategories(): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_CATEGORIES;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CATEGORIES;
    }

    return data;
  } catch (err) {
    console.warn("Fallback served for getActiveCategories:", err);
    return FALLBACK_CATEGORIES;
  }
}

/**
 * Fetches active services & packages.
 */
export async function getActiveServices(): Promise<ServiceRow[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_SERVICES;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_SERVICES;
    }

    return data;
  } catch (err) {
    console.warn("Fallback served for getActiveServices:", err);
    return FALLBACK_SERVICES;
  }
}

/**
 * Fetches a single active service by slug or ID.
 */
export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_SERVICES.find((s) => s.slug === slug || s.id === slug) || null;
  }

  try {
    const supabase = await createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let query = supabase.from("services").select("*").eq("is_active", true);
    if (isUuid) {
      query = query.or(`slug.eq.${slug},id.eq.${slug}`);
    } else {
      query = query.eq("slug", slug);
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) {
      return FALLBACK_SERVICES.find((s) => s.slug === slug || s.id === slug) || null;
    }

    return data;
  } catch (err) {
    console.warn("Fallback served for getServiceBySlug:", err);
    return FALLBACK_SERVICES.find((s) => s.slug === slug || s.id === slug) || null;
  }
}

/**
 * Fetches published testimonials.
 */
export async function getPublishedTestimonials(): Promise<TestimonialRow[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_TESTIMONIALS;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_TESTIMONIALS;
    }

    return data;
  } catch (err) {
    console.warn("Fallback served for getPublishedTestimonials:", err);
    return FALLBACK_TESTIMONIALS;
  }
}

/**
 * Fetches published journal stories and blog posts.
 */
export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_BLOG_POSTS;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_BLOG_POSTS;
    }

    return data;
  } catch (err) {
    console.warn("Fallback served for getPublishedBlogPosts:", err);
    return FALLBACK_BLOG_POSTS;
  }
}

/**
 * Fetches a single blog post by its URL slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostRow | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug) || null;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug) || null;
    }

    return data;
  } catch (err) {
    console.warn("Fallback served for getBlogPostBySlug:", err);
    return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Fetches all active chatbot categories.
 */
export async function getChatbotCategories(): Promise<ChatbotCategoryRow[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_CHATBOT_CATEGORIES;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chatbot_categories")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CHATBOT_CATEGORIES;
    }

    return data;
  } catch (err) {
    console.warn("Fallback served for getChatbotCategories:", err);
    return FALLBACK_CHATBOT_CATEGORIES;
  }
}

/**
 * Fetches active chatbot / FAQ questions, optionally filtered by category id or slug.
 */
export async function getChatbotQuestions(categoryId?: string): Promise<PublicChatbotQuestion[]> {
  if (!isSupabaseConfigured()) {
    if (categoryId && categoryId !== "all") {
      return FALLBACK_CHATBOT_QUESTIONS.filter((q) => q.category_id === categoryId);
    }
    return FALLBACK_CHATBOT_QUESTIONS;
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from("chatbot_questions")
      .select("*, chatbot_categories(*)")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (categoryId && categoryId !== "all") {
        return FALLBACK_CHATBOT_QUESTIONS.filter((q) => q.category_id === categoryId);
      }
      return FALLBACK_CHATBOT_QUESTIONS;
    }

    return data as PublicChatbotQuestion[];
  } catch (err) {
    console.warn("Fallback served for getChatbotQuestions:", err);
    if (categoryId && categoryId !== "all") {
      return FALLBACK_CHATBOT_QUESTIONS.filter((q) => q.category_id === categoryId);
    }
    return FALLBACK_CHATBOT_QUESTIONS;
  }
}



export interface StudioSettings {
  id?: string;
  site_name?: string;
  studio_name?: string;
  tagline?: string;
  phone?: string;
  contact_phone?: string;
  whatsapp?: string;
  whatsapp_number?: string;
  email?: string;
  contact_email?: string;
  address?: string;
  location?: string;
  instagram_url?: string;
  youtube_url?: string;
  facebook_url?: string;
}

/**
 * Fetches studio site settings.
 */
export async function getSiteSettings(): Promise<typeof FALLBACK_SITE_SETTINGS> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_SITE_SETTINGS;
  }

  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "general")
      .maybeSingle();

    if (data?.value && typeof data.value === "object") {
      return {
        ...FALLBACK_SITE_SETTINGS,
        ...(data.value as Record<string, any>),
      };
    }

    return FALLBACK_SITE_SETTINGS;
  } catch (err) {
    console.warn("Fallback served for getSiteSettings:", err);
    return FALLBACK_SITE_SETTINGS;
  }
}

/**
 * Fetches studio experience metrics (Media Experience, Weddings Shot, Events Managed, Happy Clients).
 * Stored in Supabase site_settings under key "experience_metrics" (or "general.metrics").
 */
export async function getExperienceMetrics(): Promise<ExperienceMetricItem[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_EXPERIENCE_METRICS;
  }

  try {
    const supabase = await createClient();

    // 1. Check dedicated key "experience_metrics"
    const { data: metricsRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "experience_metrics")
      .maybeSingle();

    if (metricsRow?.value) {
      if (Array.isArray(metricsRow.value)) {
        return metricsRow.value as unknown as ExperienceMetricItem[];
      }
      if (typeof metricsRow.value === "object") {
        const valObj = metricsRow.value as Record<string, any>;
        if (Array.isArray(valObj.items)) {
          return valObj.items as unknown as ExperienceMetricItem[];
        }
      }
    }

    // 2. Fallback: check general settings key for metrics
    const { data: generalRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "general")
      .maybeSingle();

    if (generalRow?.value && typeof generalRow.value === "object") {
      const val = generalRow.value as Record<string, any>;
      if (Array.isArray(val.experience_metrics)) {
        return val.experience_metrics as unknown as ExperienceMetricItem[];
      }
      if (val.media_experience || val.weddings_shot) {
        return [
          {
            id: "media_experience",
            value: String(val.media_experience || "10+"),
            label: "MEDIA EXPERIENCE",
            description: "Years documenting timeless romance across South India and worldwide.",
            order_index: 1,
          },
          {
            id: "weddings_shot",
            value: String(val.weddings_shot || "500+"),
            label: "WEDDINGS SHOT",
            description: "Sacred muhurthams immortalized with fine-art editorial perspective.",
            order_index: 2,
          },
          {
            id: "events_managed",
            value: String(val.events_managed || "1200+"),
            label: "EVENTS MANAGED",
            description: "From intimate dawn rituals to grand multi-day architectural celebrations.",
            order_index: 3,
          },
          {
            id: "happy_clients",
            value: String(val.happy_clients || "1500+"),
            label: "HAPPY CLIENTS",
            description: "Heirloom family monographs cherished across generations.",
            order_index: 4,
          },
        ];
      }
    }

    return FALLBACK_EXPERIENCE_METRICS;
  } catch (err) {
    console.warn("Fallback served for getExperienceMetrics:", err);
    return FALLBACK_EXPERIENCE_METRICS;
  }
}

/**
 * Fetches all active studio social links (Instagram, YouTube, WhatsApp, etc.).
 */
export async function getActiveSocialLinks(): Promise<SocialLinkRow[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_SOCIAL_LINKS;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_SOCIAL_LINKS;
    }

    return data;
  } catch (err) {
    console.warn("Fallback served for getActiveSocialLinks:", err);
    return FALLBACK_SOCIAL_LINKS;
  }
}

/**
 * Fetches featured social posts and reels.
 */
export async function getFeaturedSocialPosts(): Promise<SocialPostRow[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_SOCIAL_POSTS;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("social_posts")
      .select("*")
      .eq("is_featured", true)
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_SOCIAL_POSTS;
    }

    return data;
  } catch (err) {
    console.warn("Fallback served for getFeaturedSocialPosts:", err);
    return FALLBACK_SOCIAL_POSTS;
  }
}

export interface InquiriesFilterOptions {
  status?: string;
  search?: string;
  sort?: "newest" | "oldest" | "event_date";
  includeArchived?: boolean;
}

export interface InquiryPipelineStats {
  total: number;
  newCount: number;
  contactedCount: number;
  followUpCount: number;
  quotedCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  archivedCount: number;
}

/**
 * Fetches inquiries for admin CRM pipeline with filters, sorting, and search.
 */
export async function getInquiries(options: InquiriesFilterOptions = {}): Promise<InquiryRow[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createClient();

    let query = supabase.from("inquiries").select("*");

    // Archive filter
    if (options.includeArchived) {
      query = query.eq("is_archived", true);
    } else {
      query = query.or("is_archived.is.null,is_archived.eq.false");
    }

    // Status filter
    if (options.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    // Sorting
    if (options.sort === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (options.sort === "event_date") {
      query = query.order("event_date", { ascending: true, nullsFirst: false });
    } else {
      // Default newest first
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching inquiries:", error);
      return [];
    }

    let list = data || [];

    // In-memory search filtering if search string provided
    if (options.search && options.search.trim()) {
      const term = options.search.toLowerCase().trim();
      list = list.filter((item) =>
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.phone.toLowerCase().includes(term) ||
        (item.location && item.location.toLowerCase().includes(term)) ||
        (item.event_type && item.event_type.toLowerCase().includes(term)) ||
        (item.preferred_service && item.preferred_service.toLowerCase().includes(term)) ||
        (item.message && item.message.toLowerCase().includes(term))
      );
    }

    return list;
  } catch (err) {
    console.warn("Fallback served for getInquiries:", err);
    return [];
  }
}

/**
 * Fetches a single client inquiry by ID.
 */
export async function getInquiryById(id: string): Promise<InquiryRow | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (err) {
    console.warn("Fallback served for getInquiryById:", err);
    return null;
  }
}

/**
 * Computes pipeline KPI statistics for the Admin CRM dashboard.
 */
export async function getInquiryPipelineStats(): Promise<InquiryPipelineStats> {
  const emptyStats: InquiryPipelineStats = {
    total: 0,
    newCount: 0,
    contactedCount: 0,
    followUpCount: 0,
    quotedCount: 0,
    confirmedCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    archivedCount: 0,
  };

  if (!isSupabaseConfigured()) {
    return emptyStats;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("inquiries").select("status, is_archived");

    if (error || !data) {
      return emptyStats;
    }

    const stats: InquiryPipelineStats = { ...emptyStats };

    for (const item of data) {
      if (item.is_archived) {
        stats.archivedCount++;
        continue;
      }

      stats.total++;
      const s = item.status?.toLowerCase();
      if (s === "new") stats.newCount++;
      else if (s === "contacted") stats.contactedCount++;
      else if (s === "follow_up") stats.followUpCount++;
      else if (s === "quoted") stats.quotedCount++;
      else if (s === "confirmed") stats.confirmedCount++;
      else if (s === "completed") stats.completedCount++;
      else if (s === "cancelled") stats.cancelledCount++;
    }

    return stats;
  } catch (err) {
    console.warn("Fallback served for getInquiryPipelineStats:", err);
    return emptyStats;
  }
}


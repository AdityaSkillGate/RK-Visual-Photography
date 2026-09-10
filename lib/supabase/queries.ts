import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

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
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*, categories(id, name, slug), project_images(*)")
    .eq("published", true)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (categorySlug && categorySlug !== "all") {
    // Filter via category slug
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
  if (error) {
    console.error("Error fetching published projects:", error);
    return [];
  }

  return (data as unknown as PublicProject[]) || [];
}

/**
 * Fetches featured projects for the flagship homepage showcase.
 */
export async function getFeaturedProjects(): Promise<PublicProject[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*, categories(id, name, slug), project_images(*)")
    .eq("published", true)
    .eq("featured", true)
    .order("order_index", { ascending: true })
    .limit(6);

  if (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }

  return (data as unknown as PublicProject[]) || [];
}

/**
 * Fetches a single project by its unique URL slug, including all gallery images.
 */
export async function getProjectBySlug(slug: string): Promise<PublicProject | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*, categories(id, name, slug), project_images(*)")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  // Sort project_images by order_index
  const project = data as unknown as PublicProject;
  if (project.project_images && Array.isArray(project.project_images)) {
    project.project_images.sort((a, b) => a.order_index - b.order_index);
  }

  return project;
}

/**
 * Fetches all active published categories.
 */
export async function getActiveCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching active categories:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetches active services & packages.
 */
export async function getActiveServices(): Promise<ServiceRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching active services:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetches a single active service by slug or ID.
 */
export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
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
    return null;
  }

  return data;
}

/**
 * Fetches published testimonials.
 */
export async function getPublishedTestimonials(): Promise<TestimonialRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetches published journal stories and blog posts.
 */
export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetches a single blog post by its URL slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Fetches all active chatbot categories.
 */
export async function getChatbotCategories(): Promise<ChatbotCategoryRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chatbot_categories")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error || !data || data.length === 0) {
    return [
      { id: "c1000000-0000-0000-0000-000000000001", name: "Wedding", slug: "wedding", description: "Tamil & South Indian traditional celebrations", order_index: 1, is_active: true, created_at: new Date().toISOString() },
      { id: "c1000000-0000-0000-0000-000000000002", name: "Pre-Wedding", slug: "pre-wedding", description: "Couples portraiture & outdoor narratives", order_index: 2, is_active: true, created_at: new Date().toISOString() },
      { id: "c1000000-0000-0000-0000-000000000003", name: "Events", slug: "events", description: "Receptions & milestone celebrations", order_index: 3, is_active: true, created_at: new Date().toISOString() },
      { id: "c1000000-0000-0000-0000-000000000004", name: "Portraits", slug: "portraits", description: "Bespoke bridal & family portraits", order_index: 4, is_active: true, created_at: new Date().toISOString() },
      { id: "c1000000-0000-0000-0000-000000000005", name: "Bookings", slug: "bookings", description: "Reservations & process", order_index: 5, is_active: true, created_at: new Date().toISOString() },
      { id: "c1000000-0000-0000-0000-000000000006", name: "Locations", slug: "locations", description: "Tamil Nadu, pan-India & destinations", order_index: 6, is_active: true, created_at: new Date().toISOString() },
      { id: "c1000000-0000-0000-0000-000000000007", name: "Delivery", slug: "delivery", description: "Turnaround time & albums", order_index: 7, is_active: true, created_at: new Date().toISOString() },
      { id: "c1000000-0000-0000-0000-000000000008", name: "General", slug: "general", description: "Studio philosophy & cinematography", order_index: 8, is_active: true, created_at: new Date().toISOString() },
    ];
  }

  return data;
}

/**
 * Fetches active chatbot / FAQ questions, optionally filtered by category id or slug.
 */
export async function getChatbotQuestions(categoryId?: string): Promise<PublicChatbotQuestion[]> {
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
    return [
      {
        id: "f1000000-0000-0000-0000-000000000005",
        category_id: "c1000000-0000-0000-0000-000000000008",
        question: "What services do you offer?",
        answer: "We specialize in luxury editorial wedding photography, cinematic 4K wedding films, pre-wedding conceptual stories, heirloom bridal portraiture, and handcrafted archival fine-art albums. We cover multi-day celebrations across Tamil Nadu and destination locations.",
        action_label: "Explore Services",
        action_url: "/services",
        order_index: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "f1000000-0000-0000-0000-000000000002",
        category_id: "c1000000-0000-0000-0000-000000000006",
        question: "What areas do you cover?",
        answer: "While our flagship studio is in Tamil Nadu—regularly documenting weddings in Chennai, Coimbatore, Madurai, Tiruchirappalli, and Salem—we travel extensively across India (Kerala, Bangalore, Goa, Udaipur) and international destinations (Sri Lanka, Dubai, Southeast Asia). Travel and logistics are planned seamlessly.",
        action_label: "Contact Studio",
        action_url: "/contact",
        order_index: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "f1000000-0000-0000-0000-000000000006",
        category_id: "c1000000-0000-0000-0000-000000000005",
        question: "How can I enquire or check date availability?",
        answer: "You can submit your celebration details through our bespoke Inquiry Form on our website or connect directly with our studio concierge via WhatsApp at +91 98765 43210. We reply within 24 hours with availability and customized options.",
        action_label: "Send Inquiry",
        action_url: "/contact",
        order_index: 3,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "f1000000-0000-0000-0000-000000000007",
        category_id: "c1000000-0000-0000-0000-000000000001",
        question: "Do you provide wedding films and cinematography?",
        answer: "Yes, our cinematography team produces cinematic wedding films with bespoke sound design, candid storytelling, high-fidelity audio of sacred vows, and licensed musical scores. We provide 3–5 minute highlight trailers, full ceremony documentary edits, and vertical social teasers.",
        action_label: "WhatsApp Concierge",
        action_url: "https://wa.me/919876543210",
        order_index: 4,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "f1000000-0000-0000-0000-000000000001",
        category_id: "c1000000-0000-0000-0000-000000000005",
        question: "How far in advance should we reserve our wedding dates?",
        answer: "Due to our dedicated focus on bespoke editorial curation, we accept a strictly limited number of weddings each season. Most couples secure their dates 6 to 12 months in advance, especially during the auspicious Muhurtham months (September through March).",
        action_label: "Check Date Availability",
        action_url: "/contact",
        order_index: 5,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "f1000000-0000-0000-0000-000000000003",
        category_id: "c1000000-0000-0000-0000-000000000007",
        question: "What is the delivery timeline for our wedding gallery and albums?",
        answer: "We provide a curated teaser gallery of 30–50 master frames within 5 to 7 days post-wedding. The complete high-resolution color-graded gallery is delivered in 6 to 8 weeks, with handcrafted Italian archival albums following selection within 4 weeks.",
        action_label: "View Sample Galleries",
        action_url: "/work",
        order_index: 6,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "f1000000-0000-0000-0000-000000000004",
        category_id: "c1000000-0000-0000-0000-000000000005",
        question: "Can we customize our photography and cinematography package?",
        answer: "Every celebration is distinct. During our initial consultation, we tailor our coverage—from multi-day family ceremonies to intimate couple pre-wedding sessions and drone aerial cinema—to align precisely with your personal vision and schedule.",
        action_label: "WhatsApp Concierge",
        action_url: "https://wa.me/919876543210",
        order_index: 7,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "f1000000-0000-0000-0000-000000000008",
        category_id: "c1000000-0000-0000-0000-000000000002",
        question: "Do you guide couples with styling and poses during pre-wedding sessions?",
        answer: "Absolutely. We believe the finest photographs happen when you feel relaxed and completely authentic. We provide styling moodboards, location guidance, and gentle editorial direction so you never feel stiff or staged.",
        action_label: "View Pre-Wedding Stories",
        action_url: "/work",
        order_index: 8,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "f1000000-0000-0000-0000-000000000009",
        category_id: "c1000000-0000-0000-0000-000000000001",
        question: "How do you handle early morning Muhurtham and low-light mandapam ceremonies?",
        answer: "Traditional Tamil and South Indian Muhurthams often take place in early dawn hours (Brahma Muhurtham). Our team utilizes high-end full-frame sensor cameras and discreet, color-balanced off-camera lighting that preserves the sacred ambiance without disrupting ceremonies.",
        action_label: "Explore Our Work",
        action_url: "/work",
        order_index: 9,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "f1000000-0000-0000-0000-000000000010",
        category_id: "c1000000-0000-0000-0000-000000000008",
        question: "How is our footage and imagery secured during and after the wedding?",
        answer: "Data safety is paramount. All cameras shoot to dual simultaneous memory cards on-site. Footage is ingested that night to triple-redundant local SSDs and offsite cloud cold storage. We maintain an archival copy of your master raw frames for up to 10 years.",
        action_label: "Inquire Now",
        action_url: "/contact",
        order_index: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  return data as PublicChatbotQuestion[];
}


/**
 * Fetches studio site settings.
 */
export async function getSiteSettings() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "general")
    .maybeSingle();

  return (
    (data?.value as {
      studio_name?: string;
      tagline?: string;
      phone?: string;
      whatsapp?: string;
      email?: string;
      address?: string;
      instagram_url?: string;
    }) || {
      studio_name: "RK Visual Photography",
      tagline: "Capturing Stories That Last Beyond the Moment",
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      email: "inquiries@rkvisual.com",
      address: "Tamil Nadu, India",
      instagram_url: "https://instagram.com/rkvisual",
    }
  );
}

/**
 * Fetches all active studio social links (Instagram, YouTube, WhatsApp, etc.).
 */
export async function getActiveSocialLinks(): Promise<SocialLinkRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error || !data || data.length === 0) {
    // Graceful fallback
    return [
      {
        id: "c1000000-0000-0000-0000-000000000001",
        platform: "instagram",
        label: "Instagram",
        url: "https://www.instagram.com/rk_visual_photography/",
        handle: "@rk_visual_photography",
        is_active: true,
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c1000000-0000-0000-0000-000000000002",
        platform: "youtube",
        label: "YouTube Cinema",
        url: "https://www.youtube.com/@rkvisualphotography",
        handle: "@rkvisualphotography",
        is_active: true,
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c1000000-0000-0000-0000-000000000003",
        platform: "whatsapp",
        label: "WhatsApp Concierge",
        url: "https://wa.me/919876543210",
        handle: "+91 98765 43210",
        is_active: true,
        order_index: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c1000000-0000-0000-0000-000000000004",
        platform: "facebook",
        label: "Facebook",
        url: "https://www.facebook.com/rkvisualphotography",
        handle: "RK Visual Photography",
        is_active: true,
        order_index: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c1000000-0000-0000-0000-000000000005",
        platform: "google_business",
        label: "Google Reviews",
        url: "https://maps.google.com/?q=RK+Visual+Photography+Tamil+Nadu",
        handle: "5.0 ★ Client Reviews",
        is_active: true,
        order_index: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  return data;
}

/**
 * Fetches featured social posts and reels.
 */
export async function getFeaturedSocialPosts(): Promise<SocialPostRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .eq("is_featured", true)
    .order("order_index", { ascending: true });

  if (error || !data || data.length === 0) {
    // Graceful fallback using the client-provided reels and shorts
    return [
      {
        id: "d1000000-0000-0000-0000-000000000001",
        platform: "instagram",
        post_url: "https://www.instagram.com/reel/C8et_o8hNk1/",
        thumbnail_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
        caption: "Sacred Muhurtham Exchange & Royal Kanjivaram Heirlooms",
        is_featured: true,
        order_index: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: "d1000000-0000-0000-0000-000000000002",
        platform: "instagram",
        post_url: "https://www.instagram.com/reel/DCZQ5h5OR1O/",
        thumbnail_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
        caption: "Twilight Temple Reflections & Heirloom Silk Portraits",
        is_featured: true,
        order_index: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: "d1000000-0000-0000-0000-000000000003",
        platform: "instagram",
        post_url: "https://www.instagram.com/reel/DcLkIHbB_ig/",
        thumbnail_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        caption: "Intimate Pre-Wedding Moments Under Ancient Banyan Canopies",
        is_featured: true,
        order_index: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: "d1000000-0000-0000-0000-000000000004",
        platform: "youtube",
        post_url: "https://youtube.com/shorts/qwVldxJuVrU?si=02988bSeeasWySQS",
        thumbnail_url: "https://img.youtube.com/vi/qwVldxJuVrU/hqdefault.jpg",
        caption: "Cinematic Wedding Teaser | 4K South Indian Muhurtham",
        is_featured: true,
        order_index: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: "d1000000-0000-0000-0000-000000000005",
        platform: "youtube",
        post_url: "https://youtube.com/shorts/FVTUbNG1EPc?si=0M91nnTHMomBsjkl",
        thumbnail_url: "https://img.youtube.com/vi/FVTUbNG1EPc/hqdefault.jpg",
        caption: "Shore Temple Sunset Union | Mahabalipuram Cinema",
        is_featured: true,
        order_index: 5,
        created_at: new Date().toISOString(),
      },
    ];
  }

  return data;
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
}

/**
 * Fetches a single client inquiry by ID.
 */
export async function getInquiryById(id: string): Promise<InquiryRow | null> {
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
}

/**
 * Computes pipeline KPI statistics for the Admin CRM dashboard.
 */
export async function getInquiryPipelineStats(): Promise<InquiryPipelineStats> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("inquiries").select("status, is_archived");

  if (error || !data) {
    return {
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
  }

  const stats: InquiryPipelineStats = {
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
}


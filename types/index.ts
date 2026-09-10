export type ProjectCategory =
  | "weddings"
  | "engagements"
  | "pre-wedding"
  | "portraits"
  | "events"
  | "commercial";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order_index: number;
  created_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  width?: number;
  height?: number;
  order_index: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  cover_image_url: string;
  location?: string;
  event_date?: string;
  description?: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  cover_image_url: string;
  order_index: number;
  is_active: boolean;
}

export type InquiryStatus =
  | "new"
  | "contacted"
  | "follow_up"
  | "quoted"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date?: string | null;
  location?: string | null;
  expected_guests?: number | null;
  preferred_service?: string | null;
  budget_range?: string | null;
  message?: string | null;
  status: InquiryStatus;
  admin_notes?: string | null;
  is_archived?: boolean;
  source?: string | null;
  created_at: string;
  updated_at?: string;
}


export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "facebook"
  | "google_business"
  | "whatsapp";

export interface SocialLink {
  id: string;
  platform: SocialPlatform | string;
  label: string;
  url: string;
  handle?: string | null;
  is_active: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface SocialPost {
  id: string;
  platform: "instagram" | "youtube" | "facebook" | string;
  post_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  is_featured: boolean;
  order_index: number;
  created_at?: string;
}

export interface ChatbotCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order_index: number;
  is_active: boolean;
  created_at?: string;
}

export interface ChatbotQuestion {
  id: string;
  category_id?: string | null;
  category?: ChatbotCategory | null;
  question: string;
  answer: string;
  action_label?: string | null;
  action_url?: string | null;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}


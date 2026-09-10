-- ==============================================================================
-- RK Visual Photography — Master Schema Migration
-- 15 PostgreSQL Tables, Relational Constraints, Indexes, Triggers, & RLS Policies
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 1. Helper Functions & Triggers
-- ==============================================================================

-- Automatic updated_at timestamp function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Admin role verification function (Security Definer to prevent RLS recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return (
    auth.role() = 'authenticated' and (
      exists (
        select 1 from public.profiles
        where profiles.id = auth.uid() and profiles.role = 'admin'
      )
      or (auth.jwt() ->> 'email' is not null and auth.jwt() ->> 'role' = 'authenticated')
    )
  );
end;
$$ language plpgsql security definer set search_path = public;

-- ==============================================================================
-- 2. Profiles Table (Tied to Supabase Auth)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safely extend profiles table if existing from prior projects
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists role text not null default 'admin';

drop trigger if exists tr_profiles_updated_at on public.profiles;
create trigger tr_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile trigger on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'admin'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- 3. Categories Table
-- ==============================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_categories_updated_at on public.categories;
create trigger tr_categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

create index if not exists categories_slug_idx on public.categories (slug);
create index if not exists categories_order_idx on public.categories (order_index);

-- ==============================================================================
-- 4. Projects Table (Portfolio Showcase)
-- ==============================================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  cover_image_url text not null,
  location text,
  event_date date,
  description text,
  story text,
  featured boolean not null default false,
  published boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_projects_updated_at on public.projects;
create trigger tr_projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_cat_idx on public.projects (category_id);
create index if not exists projects_pub_idx on public.projects (published, featured, order_index);

-- ==============================================================================
-- 5. Project Images Table (Galleries)
-- ==============================================================================
create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  alt_text text,
  caption text,
  width integer,
  height integer,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists proj_imgs_proj_idx on public.project_images (project_id, order_index);

-- ==============================================================================
-- 6. Services Table
-- ==============================================================================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description text not null,
  cover_image_url text,
  features jsonb not null default '[]'::jsonb,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_services_updated_at on public.services;
create trigger tr_services_updated_at
  before update on public.services
  for each row execute function public.handle_updated_at();

create index if not exists services_slug_idx on public.services (slug);
create index if not exists services_active_idx on public.services (is_active, order_index);

-- ==============================================================================
-- 7. Testimonials Table
-- ==============================================================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  partner_name text,
  quote text not null,
  event_type text,
  location text,
  avatar_image_url text,
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  featured boolean not null default false,
  published boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists testi_pub_idx on public.testimonials (published, featured, order_index);

-- ==============================================================================
-- 8. Inquiries Table (Leads Pipeline)
-- ==============================================================================
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  event_type text not null,
  event_date date,
  location text,
  expected_guests integer,
  budget_range text,
  message text,
  source text,
  status text not null default 'new' check (status in ('new', 'contacted', 'follow_up', 'quoted', 'confirmed', 'completed', 'cancelled')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_inquiries_updated_at on public.inquiries;
create trigger tr_inquiries_updated_at
  before update on public.inquiries
  for each row execute function public.handle_updated_at();

create index if not exists inquiries_status_idx on public.inquiries (status, created_at desc);

-- ==============================================================================
-- 9. Social Links Table
-- ==============================================================================
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique,
  label text not null,
  url text not null,
  handle text,
  is_active boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_social_links_updated_at on public.social_links;
create trigger tr_social_links_updated_at
  before update on public.social_links
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- 10. Social Posts Table (Curated Social Wall)
-- ==============================================================================
create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  post_url text not null,
  thumbnail_url text,
  caption text,
  is_featured boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists social_posts_idx on public.social_posts (is_featured, order_index);

-- ==============================================================================
-- 11. Chatbot Categories Table
-- ==============================================================================
create table if not exists public.chatbot_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 12. Chatbot Questions Table
-- ==============================================================================
create table if not exists public.chatbot_questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.chatbot_categories(id) on delete cascade,
  question text not null,
  answer text not null,
  action_label text,
  action_url text,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_chatbot_questions_updated_at on public.chatbot_questions;
create trigger tr_chatbot_questions_updated_at
  before update on public.chatbot_questions
  for each row execute function public.handle_updated_at();

create index if not exists chatbot_q_idx on public.chatbot_questions (category_id, is_active, order_index);

-- ==============================================================================
-- 13. Site Settings Table (Key/Value Store)
-- ==============================================================================
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  description text,
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_site_settings_updated_at on public.site_settings;
create trigger tr_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

create index if not exists site_settings_key_idx on public.site_settings (key);

-- ==============================================================================
-- 14. Homepage Sections Table (CMS Controlled Sections)
-- ==============================================================================
create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text,
  subtitle text,
  content jsonb not null default '{}'::jsonb,
  is_enabled boolean not null default true,
  order_index integer not null default 0,
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_homepage_sections_updated_at on public.homepage_sections;
create trigger tr_homepage_sections_updated_at
  before update on public.homepage_sections
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- 15. Blog Posts Table (Stories & Local SEO)
-- ==============================================================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  author_id uuid references public.profiles(id) on delete set null,
  published boolean not null default false,
  published_at timestamptz,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_blog_posts_updated_at on public.blog_posts;
create trigger tr_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.handle_updated_at();

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_pub_idx on public.blog_posts (published, published_at desc);

-- ==============================================================================
-- 16. Analytics Events Table (Studio Insights)
-- ==============================================================================
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_name_idx on public.analytics_events (event_name, created_at desc);

-- ==============================================================================
-- 17. Row-Level Security (RLS) Configuration
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.inquiries enable row level security;
alter table public.social_links enable row level security;
alter table public.social_posts enable row level security;
alter table public.chatbot_categories enable row level security;
alter table public.chatbot_questions enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.blog_posts enable row level security;
alter table public.analytics_events enable row level security;

-- PROFILES POLICIES
drop policy if exists "Public can read admin profiles" on public.profiles;
create policy "Public can read admin profiles"
  on public.profiles for select
  using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Admin has full access to profiles" on public.profiles;
create policy "Admin has full access to profiles"
  on public.profiles for all
  using (public.is_admin());

-- CATEGORIES POLICIES
drop policy if exists "Public can view categories" on public.categories;
create policy "Public can view categories"
  on public.categories for select
  using (true);

drop policy if exists "Admin can manage categories" on public.categories;
create policy "Admin can manage categories"
  on public.categories for all
  using (public.is_admin());

-- PROJECTS POLICIES
drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects"
  on public.projects for select
  using (published = true);

drop policy if exists "Admin can view and manage all projects" on public.projects;
create policy "Admin can view and manage all projects"
  on public.projects for all
  using (public.is_admin());

-- PROJECT IMAGES POLICIES
drop policy if exists "Public can view images of published projects" on public.project_images;
create policy "Public can view images of published projects"
  on public.project_images for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_images.project_id
      and projects.published = true
    )
  );

drop policy if exists "Admin can manage all project images" on public.project_images;
create policy "Admin can manage all project images"
  on public.project_images for all
  using (public.is_admin());

-- SERVICES POLICIES
drop policy if exists "Public can view active services" on public.services;
create policy "Public can view active services"
  on public.services for select
  using (is_active = true);

drop policy if exists "Admin can manage services" on public.services;
create policy "Admin can manage services"
  on public.services for all
  using (public.is_admin());

-- TESTIMONIALS POLICIES
drop policy if exists "Public can view published testimonials" on public.testimonials;
create policy "Public can view published testimonials"
  on public.testimonials for select
  using (published = true);

drop policy if exists "Admin can manage testimonials" on public.testimonials;
create policy "Admin can manage testimonials"
  on public.testimonials for all
  using (public.is_admin());

-- INQUIRIES POLICIES
drop policy if exists "Anyone can submit an inquiry" on public.inquiries;
create policy "Anyone can submit an inquiry"
  on public.inquiries for insert
  with check (true);

drop policy if exists "Admin can view and manage inquiries" on public.inquiries;
create policy "Admin can view and manage inquiries"
  on public.inquiries for all
  using (public.is_admin());

-- SOCIAL LINKS POLICIES
drop policy if exists "Public can view active social links" on public.social_links;
create policy "Public can view active social links"
  on public.social_links for select
  using (is_active = true);

drop policy if exists "Admin can manage social links" on public.social_links;
create policy "Admin can manage social links"
  on public.social_links for all
  using (public.is_admin());

-- SOCIAL POSTS POLICIES
drop policy if exists "Public can view featured social posts" on public.social_posts;
create policy "Public can view featured social posts"
  on public.social_posts for select
  using (is_featured = true);

drop policy if exists "Admin can manage social posts" on public.social_posts;
create policy "Admin can manage social posts"
  on public.social_posts for all
  using (public.is_admin());

-- CHATBOT CATEGORIES POLICIES
drop policy if exists "Public can view active chatbot categories" on public.chatbot_categories;
create policy "Public can view active chatbot categories"
  on public.chatbot_categories for select
  using (is_active = true);

drop policy if exists "Admin can manage chatbot categories" on public.chatbot_categories;
create policy "Admin can manage chatbot categories"
  on public.chatbot_categories for all
  using (public.is_admin());

-- CHATBOT QUESTIONS POLICIES
drop policy if exists "Public can view active chatbot questions" on public.chatbot_questions;
create policy "Public can view active chatbot questions"
  on public.chatbot_questions for select
  using (is_active = true);

drop policy if exists "Admin can manage chatbot questions" on public.chatbot_questions;
create policy "Admin can manage chatbot questions"
  on public.chatbot_questions for all
  using (public.is_admin());

-- SITE SETTINGS POLICIES
drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Admin can manage site settings" on public.site_settings;
create policy "Admin can manage site settings"
  on public.site_settings for all
  using (public.is_admin());

-- HOMEPAGE SECTIONS POLICIES
drop policy if exists "Public can view active homepage sections" on public.homepage_sections;
create policy "Public can view active homepage sections"
  on public.homepage_sections for select
  using (is_enabled = true);

drop policy if exists "Admin can manage homepage sections" on public.homepage_sections;
create policy "Admin can manage homepage sections"
  on public.homepage_sections for all
  using (public.is_admin());

-- BLOG POSTS POLICIES
drop policy if exists "Public can view published blog posts" on public.blog_posts;
create policy "Public can view published blog posts"
  on public.blog_posts for select
  using (published = true);

drop policy if exists "Admin can manage blog posts" on public.blog_posts;
create policy "Admin can manage blog posts"
  on public.blog_posts for all
  using (public.is_admin());

-- ANALYTICS EVENTS POLICIES
drop policy if exists "Anyone can record analytics events" on public.analytics_events;
create policy "Anyone can record analytics events"
  on public.analytics_events for insert
  with check (true);

drop policy if exists "Admin can view analytics events" on public.analytics_events;
create policy "Admin can view analytics events"
  on public.analytics_events for select
  using (public.is_admin());

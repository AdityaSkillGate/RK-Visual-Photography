import { MetadataRoute } from "next";
import {
  getPublishedProjects,
  getActiveServices,
  getPublishedBlogPosts,
} from "@/lib/supabase/queries";

export const revalidate = 3600; // Revalidate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 2. Fetch dynamic resources safely
  const [projects, services, posts] = await Promise.all([
    getPublishedProjects().catch(() => []),
    getActiveServices().catch(() => []),
    getPublishedBlogPosts().catch(() => []),
  ]);

  // Dynamic Portfolio Projects
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic Services
  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug || service.id}`,
    lastModified: service.updated_at ? new Date(service.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // Dynamic Journal Stories
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/stories/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes, ...postRoutes];
}

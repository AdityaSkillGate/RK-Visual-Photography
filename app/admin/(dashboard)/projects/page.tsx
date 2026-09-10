import React from "react";
import { createClient } from "@/lib/supabase/server";
import ProjectList, { ProjectItem } from "./ProjectList";

export const revalidate = 0;

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const [projectsRes, categoriesRes] = await Promise.all([
    supabase
      .from("projects")
      .select("*, categories(id, name), project_images(count)")
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("id, name")
      .order("order_index", { ascending: true }),
  ]);

  const categories = categoriesRes.data || [];

  const formattedProjects: ProjectItem[] = (projectsRes.data || []).map((proj) => {
    // @ts-ignore categories joined
    const catName = proj.categories?.name;
    // @ts-ignore project_images count joined
    const imagesCount = proj.project_images?.[0]?.count ?? 0;

    return {
      id: proj.id,
      title: proj.title,
      slug: proj.slug,
      category_id: proj.category_id,
      category_name: catName,
      cover_image_url: proj.cover_image_url,
      location: proj.location,
      event_date: proj.event_date,
      featured: proj.featured,
      published: proj.published,
      images_count: imagesCount,
      created_at: proj.created_at,
    };
  });

  return <ProjectList initialProjects={formattedProjects} categories={categories} />;
}

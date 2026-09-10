import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "../../ProjectForm";

export const revalidate = 0;

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [projectRes, categoriesRes] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").order("order_index", { ascending: true }),
  ]);

  if (!projectRes.data) {
    notFound();
  }

  const project = projectRes.data;
  const categories = categoriesRes.data || [];

  return (
    <ProjectForm
      initialData={{
        id: project.id,
        title: project.title,
        slug: project.slug,
        category_id: project.category_id,
        cover_image_url: project.cover_image_url,
        location: project.location,
        event_date: project.event_date,
        description: project.description,
        story: project.story,
        featured: project.featured,
        published: project.published,
        seo_title: project.seo_title,
        seo_description: project.seo_description,
      }}
      categories={categories}
      isEdit={true}
    />
  );
}

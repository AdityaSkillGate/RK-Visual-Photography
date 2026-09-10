import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectGalleryManager, { ProjectImageItem } from "./ProjectGalleryManager";

export const revalidate = 0;

interface ProjectGalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectGalleryPage({ params }: ProjectGalleryPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [projectRes, imagesRes] = await Promise.all([
    supabase.from("projects").select("id, title, slug, cover_image_url").eq("id", id).maybeSingle(),
    supabase
      .from("project_images")
      .select("*")
      .eq("project_id", id)
      .order("order_index", { ascending: true }),
  ]);

  if (!projectRes.data) {
    notFound();
  }

  const project = projectRes.data;
  const images: ProjectImageItem[] = (imagesRes.data || []).map((img) => ({
    id: img.id,
    project_id: img.project_id,
    image_url: img.image_url,
    file_id: img.file_id,
    blur_data_url: img.blur_data_url,
    width: img.width,
    height: img.height,
    alt_text: img.alt_text,
    order_index: img.order_index,
    is_cover: img.is_cover,
    is_featured: img.is_featured,
    created_at: img.created_at,
  }));

  return <ProjectGalleryManager project={project} initialImages={images} />;
}

import React from "react";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "../ProjectForm";

export const revalidate = 0;

export default async function NewProjectPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("order_index", { ascending: true });

  return <ProjectForm categories={categories || []} isEdit={false} />;
}

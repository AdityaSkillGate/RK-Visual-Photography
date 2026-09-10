import React from "react";
import { createClient } from "@/lib/supabase/server";
import CategoryManager, { CategoryWithCount } from "./CategoryManager";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  // Fetch categories with project count
  const { data: categories } = await supabase
    .from("categories")
    .select("*, projects(count)")
    .order("order_index", { ascending: true });

  const formattedCategories: CategoryWithCount[] = (categories || []).map((cat) => {
    // Extract count from joined relation
    // @ts-ignore projects joined count
    const count = cat.projects?.[0]?.count ?? 0;

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      order_index: cat.order_index,
      published: cat.published,
      projectsCount: count,
    };
  });

  return <CategoryManager initialCategories={formattedCategories} />;
}

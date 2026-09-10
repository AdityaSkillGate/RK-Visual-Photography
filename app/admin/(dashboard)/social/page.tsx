import React from "react";
import { createClient } from "@/lib/supabase/server";
import SocialMediaManager from "./SocialMediaManager";
import { getActiveSocialLinks, getFeaturedSocialPosts } from "@/lib/supabase/queries";
import type { SocialLinkRow, SocialPostRow } from "@/lib/supabase/queries";

export const revalidate = 0;

export default async function AdminSocialPage() {
  const supabase = await createClient();

  // Fetch admin view (all links and all posts, whether active/featured or not)
  const [linksRes, postsRes] = await Promise.all([
    supabase.from("social_links").select("*").order("order_index", { ascending: true }),
    supabase.from("social_posts").select("*").order("order_index", { ascending: true }),
  ]);

  let links: SocialLinkRow[] = linksRes.data || [];
  let posts: SocialPostRow[] = postsRes.data || [];

  // If table is completely empty, use defaults
  if (links.length === 0) {
    links = await getActiveSocialLinks();
  }
  if (posts.length === 0) {
    posts = await getFeaturedSocialPosts();
  }

  return (
    <SocialMediaManager
      initialLinks={links}
      initialPosts={posts}
    />
  );
}

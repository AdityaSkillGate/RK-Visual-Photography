import React from "react";
import { createClient } from "@/lib/supabase/server";
import ChatbotManager from "./ChatbotManager";

export const revalidate = 0;

export default async function AdminChatbotPage() {
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from("chatbot_categories")
    .select("*")
    .order("order_index", { ascending: true });

  // Fetch questions with category relation
  const { data: questions } = await supabase
    .from("chatbot_questions")
    .select("*, chatbot_categories(name)")
    .order("order_index", { ascending: true });

  return (
    <ChatbotManager
      initialCategories={categories || []}
      initialQuestions={questions || []}
    />
  );
}

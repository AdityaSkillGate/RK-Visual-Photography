import React from "react";
import { getChatbotCategories, getChatbotQuestions } from "@/lib/supabase/queries";
import RKAssistant from "./RKAssistant";

export const revalidate = 60; // revalidate every 60 seconds

export default async function RKAssistantWrapper() {
  const [categories, questions] = await Promise.all([
    getChatbotCategories(),
    getChatbotQuestions(),
  ]);

  return <RKAssistant categories={categories} questions={questions} />;
}

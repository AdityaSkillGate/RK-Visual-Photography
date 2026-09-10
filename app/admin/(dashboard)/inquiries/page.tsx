import React from "react";
import { getInquiries, getInquiryPipelineStats } from "@/lib/supabase/queries";
import InquiriesManager from "./InquiriesManager";

export const revalidate = 0;

export default async function AdminInquiriesPage() {
  const [inquiries, stats] = await Promise.all([
    getInquiries({ sort: "newest" }),
    getInquiryPipelineStats(),
  ]);

  return <InquiriesManager initialInquiries={inquiries} initialStats={stats} />;
}

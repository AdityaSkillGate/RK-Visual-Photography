import React from "react";
import { notFound } from "next/navigation";
import { getInquiryById } from "@/lib/supabase/queries";
import InquiryDetailView from "./InquiryDetailView";

export const revalidate = 0;

interface InquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { id } = await params;
  const inquiry = await getInquiryById(id);

  if (!inquiry) {
    notFound();
  }

  return <InquiryDetailView initialInquiry={inquiry} />;
}

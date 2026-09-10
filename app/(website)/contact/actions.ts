"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface InquiryResult {
  success: boolean;
  message?: string;
  error?: string;
  inquiryDetails?: {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    eventDate?: string | null;
    location?: string | null;
    guestCount?: number | null;
    preferredService?: string | null;
    referenceId?: string;
  };
}

export async function submitInquiryAction(
  prevState: InquiryResult | null,
  formData: FormData
): Promise<InquiryResult> {
  // 1. Honeypot check (anti-bot)
  const botTrap = formData.get("website_bot_trap") as string;
  if (botTrap) {
    // Silently pretend success to deceptive scrapers/bots
    return {
      success: true,
      message: "Your inquiry has been received with gratitude.",
    };
  }

  // 2. Extract and sanitize inputs
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const event_type = (formData.get("event_type") as string)?.trim();
  const event_date = (formData.get("event_date") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const expected_guests_raw = formData.get("expected_guests") as string;
  const preferred_service = (formData.get("preferred_service") as string)?.trim() || null;
  const budget_range = (formData.get("budget_range") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim() || null;

  // 3. Validation
  if (!name || name.length < 2) {
    return {
      success: false,
      error: "Please provide your full legal name or couple names.",
    };
  }

  if (!email || !email.includes("@") || !email.includes(".")) {
    return {
      success: false,
      error: "Please provide a valid email address for correspondence.",
    };
  }

  if (!phone || phone.length < 7) {
    return {
      success: false,
      error: "Please provide a valid phone / WhatsApp number for date coordination.",
    };
  }

  if (!event_type) {
    return {
      success: false,
      error: "Please select the celebration type.",
    };
  }

  const expected_guests = expected_guests_raw
    ? parseInt(expected_guests_raw, 10) || null
    : null;

  const supabase = createAdminClient();

  // 4. Duplicate submission check (within the last 60 seconds)
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
  const { data: recentDuplicate } = await supabase
    .from("inquiries")
    .select("id")
    .eq("email", email)
    .eq("phone", phone)
    .gte("created_at", oneMinuteAgo)
    .limit(1)
    .maybeSingle();

  if (recentDuplicate) {
    return {
      success: false,
      error: "A consultation inquiry was just submitted from this contact. Please allow our studio team a brief moment to review, or connect directly via WhatsApp.",
    };
  }

  // 5. Insert inquiry
  const { data: inserted, error } = await supabase
    .from("inquiries")
    .insert({
      name,
      email,
      phone,
      event_type,
      event_date,
      location,
      expected_guests,
      preferred_service,
      budget_range,
      message,
      status: "new",
      is_archived: false,
      source: "website_contact_form",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Inquiry submission database error:", error);
    return {
      success: false,
      error: "Unable to submit your inquiry at this moment. Please connect with our concierge directly via WhatsApp (+91 98765 43210).",
    };
  }

  // 6. Anonymous Telemetry
  try {
    await supabase.from("analytics_events").insert({
      event_name: "inquiry_submitted",
      page_path: "/contact",
      metadata: {
        event_type,
        has_location: Boolean(location),
        has_date: Boolean(event_date),
        has_guests: Boolean(expected_guests),
        has_service: Boolean(preferred_service),
      },
    });
  } catch (telemetryErr) {
    // Non-blocking telemetry
    console.warn("Telemetry notice:", telemetryErr);
  }

  return {
    success: true,
    message: "Thank you for reaching out to RK Visual Photography. We have logged your consultation inquiry and will review our studio calendar promptly.",
    inquiryDetails: {
      name,
      email,
      phone,
      eventType: event_type,
      eventDate: event_date,
      location,
      guestCount: expected_guests,
      preferredService: preferred_service,
      referenceId: inserted?.id?.slice(0, 8).toUpperCase(),
    },
  };
}

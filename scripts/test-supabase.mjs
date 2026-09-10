import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dynalwqtaqilrunjtaug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmFsd3F0YXFpbHJ1bmp0YXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMzU0MDgsImV4cCI6MjEwMDcxMTQwOH0.VTa7CPjpNK-Tq4lF-i8Xg-ZVlWl-qcwKCTAXa-SKP7Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log("=================================================");
  console.log("RK Visual Photography - Supabase Integration Test");
  console.log("=================================================");

  let passed = 0;
  let failed = 0;

  // TEST 1: Public Read Categories
  try {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) throw error;
    console.log("✓ TEST 1: Public Read 'categories' succeeded. Rows:", data.length);
    passed++;
  } catch (err) {
    console.error("✗ TEST 1 FAILED:", err.message);
    failed++;
  }

  // TEST 2: Public Read Published Projects
  try {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) throw error;
    console.log("✓ TEST 2: Public Read 'projects' (RLS published filter) succeeded. Rows:", data.length);
    passed++;
  } catch (err) {
    console.error("✗ TEST 2 FAILED:", err.message);
    failed++;
  }

  // TEST 3: Public Insert Inquiry (Lead Generation without data leakage)
  try {
    const testInquiry = {
      name: "Test Client",
      email: "test@example.com",
      phone: "+91 9876543210",
      event_type: "Wedding",
      location: "Chennai, Tamil Nadu",
      message: "Automated integration test inquiry.",
    };

    const { status, error } = await supabase
      .from("inquiries")
      .insert(testInquiry);

    if (error) throw error;
    if (status === 201) {
      console.log("✓ TEST 3: Public Insert into 'inquiries' succeeded with status 201 Created.");
      passed++;
    } else {
      throw new Error(`Unexpected status code: ${status}`);
    }
  } catch (err) {
    console.error("✗ TEST 3 FAILED:", err.message);
    failed++;
  }

  // TEST 4: Public Read Inquiries (Strictly blocked by RLS - no lead leakage)
  try {
    const { data, error } = await supabase.from("inquiries").select("*");
    if (error) {
      console.log("✓ TEST 4: Public Read 'inquiries' denied with error:", error.message);
      passed++;
    } else if (data.length === 0) {
      console.log("✓ TEST 4: Public Read 'inquiries' properly restricted by RLS (0 rows returned to anonymous users).");
      passed++;
    } else {
      console.error("✗ TEST 4 FAILED: Inquiries were returned to unauthenticated user!");
      failed++;
    }
  } catch (err) {
    console.log("✓ TEST 4: Public Read 'inquiries' restricted:", err.message);
    passed++;
  }

  // TEST 5: Public Read Services, Testimonials, Social Links
  try {
    const [services, testimonials, socialLinks] = await Promise.all([
      supabase.from("services").select("*"),
      supabase.from("testimonials").select("*"),
      supabase.from("social_links").select("*"),
    ]);

    if (services.error) throw services.error;
    if (testimonials.error) throw testimonials.error;
    if (socialLinks.error) throw socialLinks.error;

    console.log("✓ TEST 5: Public Read for services, testimonials, social_links succeeded.");
    passed++;
  } catch (err) {
    console.error("✗ TEST 5 FAILED:", err.message);
    failed++;
  }

  // TEST 6: Public Insert Analytics Event
  try {
    const { status, error } = await supabase.from("analytics_events").insert({
      event_name: "test_verification_run",
      page_path: "/test",
      metadata: { test: true },
    });

    if (error) throw error;
    if (status === 201) {
      console.log("✓ TEST 6: Public Insert into 'analytics_events' succeeded with status 201 Created.");
      passed++;
    } else {
      throw new Error(`Unexpected status code: ${status}`);
    }
  } catch (err) {
    console.error("✗ TEST 6 FAILED:", err.message);
    failed++;
  }

  console.log("=================================================");
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

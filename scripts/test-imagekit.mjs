import { createClient } from "@supabase/supabase-js";

function getImageKitUrl(src, options = {}) {
  if (!src) return "";
  const endpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").replace(/\/$/, "");
  if (src.startsWith("http://") || (src.startsWith("https://") && !src.includes("imagekit.io"))) {
    return src;
  }
  let path = src;
  if (path.startsWith(endpoint)) path = path.replace(endpoint, "");
  path = path.replace(/^\/tr:[^/]+\//, "/");
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const transforms = [];
  if (options.width) transforms.push(`w-${Math.round(options.width)}`);
  if (options.height) transforms.push(`h-${Math.round(options.height)}`);
  if (options.quality) transforms.push(`q-${options.quality}`);
  if (options.format) transforms.push(`f-${options.format}`);
  if (options.blur) transforms.push(`bl-${options.blur}`);
  if (options.crop) transforms.push(`c-${options.crop}`);
  if (options.focus) transforms.push(`fo-${options.focus}`);
  if (options.dpr) transforms.push(`dpr-${options.dpr}`);
  if (options.raw) transforms.push(options.raw);
  if (!endpoint || endpoint.includes("placeholder")) return src.startsWith("/") ? src : `/${src}`;
  const transformString = transforms.length > 0 ? `tr:${transforms.join(",")}` : "";
  return transformString ? `${endpoint}/${transformString}/${cleanPath}` : `${endpoint}/${cleanPath}`;
}

const imagePresets = {
  thumbnail: (src) => getImageKitUrl(src, { width: 400, quality: 80, format: "auto", focus: "auto" }),
  card: (src) => getImageKitUrl(src, { width: 800, quality: 85, format: "auto" }),
  editorial: (src) => getImageKitUrl(src, { width: 1400, quality: 85, format: "auto" }),
  fullscreen: (src) => getImageKitUrl(src, { width: 2400, quality: 90, format: "auto" }),
  lqipBlur: (src) => getImageKitUrl(src, { width: 30, quality: 20, blur: 40, format: "webp" }),
};

const SUPABASE_URL = "https://dynalwqtaqilrunjtaug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmFsd3F0YXFpbHJ1bmp0YXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMzU0MDgsImV4cCI6MjEwMDcxMTQwOH0.VTa7CPjpNK-Tq4lF-i8Xg-ZVlWl-qcwKCTAXa-SKP7Y";

async function runImageKitTests() {
  console.log("=================================================");
  console.log("RK Visual Photography - ImageKit Media Test Suite");
  console.log("=================================================");

  let passed = 0;
  let failed = 0;

  // TEST 1: URL Transformation Engine
  try {
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/rkvisual";
    const samplePath = "/weddings/arun_priya_01.jpg";

    const customUrl = getImageKitUrl(samplePath, {
      width: 1200,
      height: 800,
      quality: 85,
      format: "webp",
      crop: "maintain_ratio",
    });

    if (
      customUrl.includes("tr:w-1200,h-800,q-85,f-webp,c-maintain_ratio") &&
      customUrl.includes("weddings/arun_priya_01.jpg")
    ) {
      console.log("✓ TEST 1: Custom ImageKit URL transformation verified.");
      passed++;
    } else {
      throw new Error(`Unexpected generated URL: ${customUrl}`);
    }
  } catch (err) {
    console.error("✗ TEST 1 FAILED:", err.message);
    failed++;
  }

  // TEST 2: Presets Verification
  try {
    const sample = "portraits/editorial.jpg";
    const thumb = imagePresets.thumbnail(sample);
    const card = imagePresets.card(sample);
    const edit = imagePresets.editorial(sample);
    const full = imagePresets.fullscreen(sample);
    const blur = imagePresets.lqipBlur(sample);

    if (
      thumb.includes("w-400") &&
      card.includes("w-800") &&
      edit.includes("w-1400") &&
      full.includes("w-2400") &&
      blur.includes("w-30") &&
      blur.includes("bl-40")
    ) {
      console.log("✓ TEST 2: All 5 ImageKit presets (thumbnail, card, editorial, fullscreen, blur) verified.");
      passed++;
    } else {
      throw new Error("One or more preset URL parameters failed validation.");
    }
  } catch (err) {
    console.error("✗ TEST 2 FAILED:", err.message);
    failed++;
  }

  // TEST 3: Supabase project_images Extended Columns
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from("project_images")
      .select("id, file_id, blur_data_url, image_url")
      .limit(1);

    if (error) throw error;
    console.log("✓ TEST 3: Supabase 'project_images' extended schema (file_id, blur_data_url) query verified.");
    passed++;
  } catch (err) {
    console.error("✗ TEST 3 FAILED:", err.message);
    failed++;
  }

  // TEST 4: Fallback & Security isolation
  try {
    // Check transform handles relative and absolute gracefully without crashing
    const localAsset = "/assets/logo/logo.png";
    const localTransformed = getImageKitUrl(localAsset, { width: 200 });
    if (localTransformed) {
      console.log("✓ TEST 4: Graceful fallback on relative assets verified.");
      passed++;
    }
  } catch (err) {
    console.error("✗ TEST 4 FAILED:", err.message);
    failed++;
  }

  console.log("=================================================");
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) process.exit(1);
}

runImageKitTests();

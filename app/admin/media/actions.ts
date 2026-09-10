"use server";

import { revalidatePath } from "next/cache";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit/server";
import { imagePresets } from "@/lib/imagekit/transform";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/app/admin/actions";

export interface UploadActionResult {
  success?: boolean;
  error?: string;
  data?: {
    fileId: string;
    name: string;
    url: string;
    thumbnailUrl: string;
    editorialUrl: string;
    blurDataUrl: string;
    width: number;
    height: number;
    size: number;
    supabaseId?: string;
  };
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/tiff",
];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Server action to handle photography upload, ImageKit CDN delivery,
 * and Supabase metadata record creation.
 */
export async function uploadMediaAction(
  formData: FormData
): Promise<UploadActionResult> {
  try {
    const session = await getAdminSession();
    if (!session?.user || session.profile?.role !== "admin") {
      return { error: "Unauthorized. Admin privileges required." };
    }

    const file = formData.get("file") as File | null;
    const projectId = (formData.get("projectId") as string) || null;
    const altText = (formData.get("altText") as string) || null;
    const caption = (formData.get("caption") as string) || null;

    if (!file || !(file instanceof File) || file.size === 0) {
      return { error: "No file provided for upload." };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        error: `Unsupported format (${file.type}). Allowed: JPG, PNG, WebP, AVIF.`,
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        error: `File exceeds maximum limit of 25MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64File = buffer.toString("base64");

    // Clean filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    // Check if ImageKit is configured with live keys
    const isLiveConfigured = Boolean(
      process.env.IMAGEKIT_PRIVATE_KEY &&
        !process.env.IMAGEKIT_PRIVATE_KEY.includes("placeholder")
    );

    let fileId: string;
    let fileUrl: string;
    let width: number;
    let height: number;
    let blurDataUrl: string;

    if (isLiveConfigured) {
      // 1. Upload to ImageKit
      const uploadResponse = await uploadToImageKit(base64File, sanitizedName, {
        folder: "/rk-visual/portfolio",
        tags: ["rk-visual", "portfolio", "photography"],
      });

      fileId = uploadResponse.fileId;
      fileUrl = uploadResponse.url;
      width = uploadResponse.width;
      height = uploadResponse.height;
      blurDataUrl = imagePresets.lqipBlur(fileUrl);
    } else {
      // Demo / Fallback mode: simulate CDN response for development
      fileId = `demo_${Date.now()}`;
      fileUrl = `/assets/logo/logo.png`;
      width = 1200;
      height = 800;
      blurDataUrl = fileUrl;
    }

    // 2. Sync Metadata into Supabase (if projectId is given, or if projects exist)
    let supabaseRecordId: string | undefined;
    try {
      const supabase = await createClient();

      let targetProjectId = projectId;

      // If no projectId was passed, link to first project or demo placeholder
      if (!targetProjectId) {
        const { data: existingProjects } = await supabase
          .from("projects")
          .select("id")
          .limit(1);

        if (existingProjects && existingProjects.length > 0) {
          targetProjectId = existingProjects[0].id;
        }
      }

      if (targetProjectId) {
        const { data: insertedImage, error: dbError } = await supabase
          .from("project_images")
          .insert({
            project_id: targetProjectId,
            image_url: fileUrl,
            file_id: fileId,
            blur_data_url: blurDataUrl,
            alt_text: altText || sanitizedName,
            caption: caption,
            width,
            height,
            order_index: 0,
          })
          .select("id")
          .single();

        if (!dbError && insertedImage) {
          supabaseRecordId = insertedImage.id;
        }
      }
    } catch (dbErr) {
      console.warn("Supabase metadata sync note:", dbErr);
    }

    revalidatePath("/admin/media");
    revalidatePath("/admin/test-media");

    return {
      success: true,
      data: {
        fileId,
        name: sanitizedName,
        url: fileUrl,
        thumbnailUrl: imagePresets.thumbnail(fileUrl),
        editorialUrl: imagePresets.editorial(fileUrl),
        blurDataUrl,
        width,
        height,
        size: file.size,
        supabaseId: supabaseRecordId,
      },
    };
  } catch (err: any) {
    console.error("Upload media action error:", err);
    return {
      error: err?.message || "Failed to process and upload image to ImageKit.",
    };
  }
}

/**
 * Server action to delete an image from ImageKit and Supabase.
 */
export async function deleteMediaAction(fileId: string, imageId?: string) {
  try {
    const session = await getAdminSession();
    if (!session?.user || session.profile?.role !== "admin") {
      return { error: "Unauthorized. Admin privileges required." };
    }

    const isLiveConfigured = Boolean(
      process.env.IMAGEKIT_PRIVATE_KEY &&
        !process.env.IMAGEKIT_PRIVATE_KEY.includes("placeholder")
    );

    if (isLiveConfigured && !fileId.startsWith("demo_")) {
      await deleteFromImageKit(fileId);
    }

    if (imageId) {
      const supabase = await createClient();
      await supabase.from("project_images").delete().eq("id", imageId);
    }

    revalidatePath("/admin/test-media");
    return { success: true };
  } catch (err: any) {
    console.error("Delete media action error:", err);
    return { error: err?.message || "Failed to delete media asset." };
  }
}

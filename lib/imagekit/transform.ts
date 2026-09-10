import { imageKitConfig } from "./config";

export interface ImageKitTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  blur?: number;
  crop?: "maintain_ratio" | "force" | "at_least" | "at_max";
  focus?: "auto" | "face" | "center" | "top";
  dpr?: number;
  raw?: string;
}

/**
 * Builds an optimized ImageKit transformation URL.
 * Handles both relative paths ("/weddings/shoot.jpg") and absolute ImageKit URLs.
 */
export function getImageKitUrl(
  src: string,
  options: ImageKitTransformOptions = {}
): string {
  if (!src) return "";

  const endpoint = (
    imageKitConfig.urlEndpoint ||
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
    ""
  ).replace(/\/$/, "");

  // If already an absolute non-ImageKit URL, return as is
  if (src.startsWith("http://") || (src.startsWith("https://") && !src.includes("imagekit.io"))) {
    return src;
  }

  // Extract relative path from absolute ImageKit URL if needed
  let path = src;
  if (path.startsWith(endpoint)) {
    path = path.replace(endpoint, "");
  }

  // Remove existing transformation prefix if any (/tr:...)
  path = path.replace(/^\/tr:[^/]+\//, "/");
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Build transformation parameters
  const transforms: string[] = [];

  if (options.width) transforms.push(`w-${Math.round(options.width)}`);
  if (options.height) transforms.push(`h-${Math.round(options.height)}`);
  if (options.quality) transforms.push(`q-${options.quality}`);
  if (options.format) transforms.push(`f-${options.format}`);
  if (options.blur) transforms.push(`bl-${options.blur}`);
  if (options.crop) transforms.push(`c-${options.crop}`);
  if (options.focus) transforms.push(`fo-${options.focus}`);
  if (options.dpr) transforms.push(`dpr-${options.dpr}`);
  if (options.raw) transforms.push(options.raw);

  // If no endpoint configured yet (e.g. initial dev), fall back gracefully
  if (!endpoint || endpoint.includes("placeholder")) {
    return src.startsWith("/") ? src : `/${src}`;
  }

  const transformString = transforms.length > 0 ? `tr:${transforms.join(",")}` : "";

  return transformString
    ? `${endpoint}/${transformString}/${cleanPath}`
    : `${endpoint}/${cleanPath}`;
}

/**
 * Pre-defined Luxury Editorial Presets for RK Visual Photography
 */
export const imagePresets = {
  /** 400px optimized thumbnail for previews and small cards */
  thumbnail: (src: string) =>
    getImageKitUrl(src, { width: 400, quality: 80, format: "auto", focus: "auto" }),

  /** 800px standard gallery card */
  card: (src: string) =>
    getImageKitUrl(src, { width: 800, quality: 85, format: "auto" }),

  /** 1400px high-resolution editorial portrait / landscape */
  editorial: (src: string) =>
    getImageKitUrl(src, { width: 1400, quality: 85, format: "auto" }),

  /** 2400px cinema / hero display */
  fullscreen: (src: string) =>
    getImageKitUrl(src, { width: 2400, quality: 90, format: "auto" }),

  /** 30px ultra-lightweight blur placeholder for instant LQIP rendering */
  lqipBlur: (src: string) =>
    getImageKitUrl(src, { width: 30, quality: 20, blur: 40, format: "webp" }),
};

/**
 * ImageKit.io Client Configuration & Validation.
 */

export const imageKitConfig = {
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  isConfigured: Boolean(
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT &&
      !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT.includes("placeholder") &&
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY &&
      !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY.includes("placeholder")
  ),
};

export { getImageKitUrl, imagePresets } from "./transform";
export type { ImageKitTransformOptions } from "./transform";

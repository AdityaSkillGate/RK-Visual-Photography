import ImageKit from "imagekit";

/**
 * Server-only ImageKit instance.
 * 
 * SECURITY NOTE:
 * Uses IMAGEKIT_PRIVATE_KEY which must NEVER be exposed to browser bundles.
 */
export function getImageKitServer(): ImageKit {
  if (typeof window !== "undefined") {
    throw new Error(
      "Security Violation: ImageKit server instance cannot be executed in the browser."
    );
  }

  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

  if (!urlEndpoint || !publicKey || !privateKey) {
    throw new Error(
      "Missing ImageKit server environment variables. Please check NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT, NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, and IMAGEKIT_PRIVATE_KEY."
    );
  }

  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
}

/**
 * Generates signed authentication parameters for direct client uploads.
 * Time-limited token + signature so private key remains secret.
 */
export function getImageKitAuthParams() {
  const imagekit = getImageKitServer();
  return imagekit.getAuthenticationParameters();
}

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  isPrivateFile?: boolean;
  customCoordinates?: string;
}

/**
 * Uploads an image directly from server context.
 */
export async function uploadToImageKit(
  file: string | Buffer,
  fileName: string,
  options: UploadOptions = {}
) {
  const imagekit = getImageKitServer();

  return await imagekit.upload({
    file,
    fileName,
    folder: options.folder || "/rk-visual",
    tags: options.tags || ["rk-visual", "portfolio"],
    isPrivateFile: options.isPrivateFile ?? false,
    customCoordinates: options.customCoordinates,
  });
}

/**
 * Deletes an image by fileId from ImageKit.
 */
export async function deleteFromImageKit(fileId: string) {
  const imagekit = getImageKitServer();
  return await imagekit.deleteFile(fileId);
}

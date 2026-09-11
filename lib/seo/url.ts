/**
 * Returns a normalized, validated absolute base URL for the site.
 * Handles protocol prefixes, whitespace, and trailing slashes safely.
 */
export function getSiteUrl(): string {
  const rawUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();

  if (!rawUrl) {
    return "https://rk-visual-photography.vercel.app";
  }

  const withProtocol = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
    ? rawUrl
    : `https://${rawUrl}`;

  return withProtocol.replace(/\/+$/, "");
}

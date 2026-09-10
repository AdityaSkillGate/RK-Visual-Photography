import type { Metadata } from "next";

interface GenerateMetadataProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}

export function constructMetadata({
  title,
  description = "Capturing timeless emotion through an artful lens. Premium wedding, portrait, and cinematic photography in Tamil Nadu, India.",
  path = "",
  image = "/assets/logo/logo.png",
}: GenerateMetadataProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonical = `${siteUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | RK Visual Photography`,
      description,
      url: canonical,
      siteName: "RK Visual Photography",
      images: [
        {
          url: image.startsWith("http") ? image : `${siteUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
  };
}

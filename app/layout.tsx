import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RK Visual Photography | Luxury Editorial Photography",
    template: "%s | RK Visual Photography",
  },
  description:
    "Premium wedding, portrait, and cinematic editorial photography based in Tamil Nadu, India. Capturing timeless emotion through an artful lens.",
  keywords: [
    "RK Visual Photography",
    "Tamil Nadu Wedding Photographer",
    "Luxury Wedding Photography",
    "Editorial Photography India",
    "Pre Wedding Photography Tamil Nadu",
  ],
  authors: [{ name: "RK Visual Photography" }],
  creator: "RK Visual Photography",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  icons: {
    icon: "/assets/logo/logo.png",
    apple: "/assets/logo/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "RK Visual Photography",
    title: "RK Visual Photography | Luxury Editorial Photography",
    description:
      "Capturing timeless emotion through an artful lens. Premium wedding and portrait photography in Tamil Nadu, India.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rk_visual_photography",
    creator: "@rk_visual_photography",
    title: "RK Visual Photography | Luxury Editorial Photography",
    description:
      "Capturing timeless emotion through an artful lens. Premium wedding and portrait photography in Tamil Nadu, India.",
  },
  alternates: {
    canonical: "/",
  },
};

import { JsonLd, getPhotographyBusinessSchema } from "@/lib/seo/structured-data";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const businessSchema = getPhotographyBusinessSchema();

  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <head>
        <JsonLd data={businessSchema} />
      </head>
      <body className="min-h-screen bg-charcoal-950 font-sans text-ivory-100 antialiased selection:bg-gold-500 selection:text-charcoal-950">
        {children}
      </body>
    </html>
  );
}

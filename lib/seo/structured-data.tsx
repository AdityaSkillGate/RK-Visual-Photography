import React from "react";
import type { Database } from "@/types/database";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectImageRow = Database["public"]["Tables"]["project_images"]["Row"];
type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];

export interface BreadcrumbItem {
  name: string;
  url: string;
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/**
 * Renders a secure, validated JSON-LD schema script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generates Schema.org LocalBusiness & PhotographyBusiness definition for RK Visual.
 */
export function getPhotographyBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["PhotographyBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: "RK Visual Photography",
    legalName: "RK Visual Photography Studio",
    alternateName: ["RK Visual", "RK Visual Wedding Cinema"],
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo/logo.png`,
    image: `${SITE_URL}/assets/logo/logo.png`,
    description:
      "Award-winning luxury wedding, portrait, and cinematic editorial photography studio based in Tamil Nadu, India. Specializing in South Indian weddings, intimate celebrations, and fine-art heirlooms worldwide.",
    telephone: "+91 98765 43210",
    email: "inquiries@rkvisual.com",
    priceRange: "₹₹₹",
    currenciesAccepted: "INR, USD, EUR, SGD",
    paymentAccepted: "Cash, Credit Card, Bank Transfer, UPI",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Anna Nagar & Bypass Studio Suite",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      postalCode: "600040",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.0827,
      longitude: 80.2707,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Tamil Nadu" },
      { "@type": "City", name: "Chennai" },
      { "@type": "City", name: "Madurai" },
      { "@type": "City", name: "Coimbatore" },
      { "@type": "City", name: "Tiruchirappalli" },
      { "@type": "City", name: "Mahabalipuram" },
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "Worldwide" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/rk_visual_photography/",
      "https://www.youtube.com/@rkvisualphotography",
      "https://www.facebook.com/rkvisualphotography",
      "https://wa.me/919876543210",
      "https://maps.google.com/?q=RK+Visual+Photography+Tamil+Nadu",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bespoke Photography & Cinema Commissions",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Luxury South Indian Wedding Documentation",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Cinematic 4K Wedding Films",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Pre-Wedding & Destination Couple Sessions",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fine-Art Editorial Bridal & Family Portraits",
          },
        },
      ],
    },
  };
}

/**
 * Generates WebSite Schema with SearchAction support.
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "RK Visual Photography",
    description: "Capturing stories that last beyond the moment. Premium wedding, portrait, and editorial cinematic photography based in Tamil Nadu, India.",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-IN",
  };
}

/**
 * Generates BreadcrumbList Schema.
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generates PhotographyService Schema for a specific service offering.
 */
export function getPhotographyServiceSchema(service: ServiceRow) {
  const serviceUrl = `${SITE_URL}/services/${service.slug || service.id}`;

  return {
    "@context": "https://schema.org",
    "@type": ["Service", "PhotographyService"],
    name: service.title,
    serviceType: "Wedding & Portrait Photography",
    description: service.description || "Bespoke fine-art photography commission.",
    url: serviceUrl,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Tamil Nadu & Worldwide",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/contact?service=${encodeURIComponent(service.title)}`,
    },
    ...(service.cover_image_url
      ? {
          image: service.cover_image_url,
        }
      : {}),
  };
}

/**
 * Generates ImageGallery & Photograph Schema for portfolio project.
 */
export function getProjectGallerySchema(
  project: ProjectRow & { project_images?: ProjectImageRow[] }
) {
  const projectUrl = `${SITE_URL}/work/${project.slug}`;
  const images = project.project_images || [];

  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: project.title,
    description: project.description || `Fine-art visual heirloom from ${project.title}.`,
    url: projectUrl,
    creator: {
      "@id": `${SITE_URL}/#organization`,
    },
    contentLocation: project.location
      ? {
          "@type": "Place",
          name: project.location,
        }
      : undefined,
    datePublished: project.event_date || project.created_at,
    image: project.cover_image_url || undefined,
    hasPart: images.slice(0, 15).map((img, idx) => ({
      "@type": "Photograph",
      position: idx + 1,
      name: img.caption || `${project.title} - Frame ${idx + 1}`,
      contentUrl: img.image_url,
      caption: img.caption || undefined,
      creator: {
        "@id": `${SITE_URL}/#organization`,
      },
    })),
  };
}

/**
 * Generates BlogPosting Schema for Journal stories.
 */
export function getArticleSchema(post: BlogPostRow) {
  const articleUrl = `${SITE_URL}/stories/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "An editorial essay by RK Visual Photography.",
    url: articleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    image: post.cover_image_url || `${SITE_URL}/assets/logo/logo.png`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      "@type": "Organization",
      name: "RK Visual Photography",
      url: SITE_URL,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

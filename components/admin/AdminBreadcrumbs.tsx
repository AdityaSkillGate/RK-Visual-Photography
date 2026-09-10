"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const segmentLabels: Record<string, string> = {
  admin: "Dashboard",
  projects: "Projects",
  galleries: "Galleries",
  categories: "Categories",
  services: "Services",
  testimonials: "Testimonials",
  inquiries: "Inquiries",
  social: "Social Media",
  chatbot: "Chatbot",
  stories: "Stories",
  settings: "Settings",
  "test-media": "Media Lab",
  new: "Create New",
  edit: "Edit",
};

export default function AdminBreadcrumbs() {
  const pathname = usePathname();

  if (!pathname) return null;

  // Split path into segments: "/admin/projects/new" -> ["admin", "projects", "new"]
  const rawSegments = pathname.split("/").filter(Boolean);

  // If we are at root /admin, just show Dashboard
  if (rawSegments.length <= 1) {
    return (
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-sand-400">
        <span className="flex items-center gap-1.5 text-ivory-100 font-medium">
          <Home size={13} className="text-gold-400" />
          <span>Dashboard</span>
        </span>
      </nav>
    );
  }

  let accumulatedPath = "";
  const breadcrumbs = rawSegments.map((segment, index) => {
    accumulatedPath += `/${segment}`;
    const label = segmentLabels[segment] || segment.replace(/-/g, " ");
    const isLast = index === rawSegments.length - 1;

    return {
      label,
      href: accumulatedPath,
      isLast,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-sand-400">
      <Link
        href="/admin"
        className="flex items-center gap-1 hover:text-gold-400 transition-colors"
        title="Admin Dashboard"
      >
        <Home size={13} className="text-sand-500 hover:text-gold-400" />
      </Link>

      {breadcrumbs.slice(1).map((crumb) => (
        <React.Fragment key={crumb.href}>
          <ChevronRight size={12} className="text-sand-600 shrink-0" />
          {crumb.isLast ? (
            <span
              aria-current="page"
              className="text-ivory-100 font-medium capitalize truncate max-w-[140px] sm:max-w-none"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-ivory-100 transition-colors capitalize truncate max-w-[100px] sm:max-w-none"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

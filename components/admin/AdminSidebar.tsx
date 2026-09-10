"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Images,
  Tags,
  Briefcase,
  Quote,
  Inbox,
  Share2,
  Bot,
  BookOpen,
  Settings,
  FlaskConical,
  ExternalLink,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
}

export const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Projects", href: "/admin/projects", icon: FolderKanban },
  { title: "Galleries", href: "/admin/galleries", icon: Images },
  { title: "Categories", href: "/admin/categories", icon: Tags },
  { title: "Services", href: "/admin/services", icon: Briefcase },
  { title: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { title: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { title: "Social Media", href: "/admin/social", icon: Share2 },
  { title: "Chatbot", href: "/admin/chatbot", icon: Bot },
  { title: "Stories", href: "/admin/stories", icon: BookOpen },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export const utilityNavItems: NavItem[] = [
  { title: "Media Lab", href: "/admin/test-media", icon: FlaskConical },
];

interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export default function AdminSidebar({ className = "", onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const isLinkActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside
      className={`flex h-full w-64 flex-col border-r border-bronze-border/60 bg-charcoal-950 text-ivory-100 ${className}`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-bronze-border/60 px-5">
        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gold-500/40 p-0.5 shadow-gold-subtle shrink-0">
          <Image
            src="/assets/logo/logo.png"
            alt="RK Visual Logo"
            fill
            sizes="36px"
            className="object-contain"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-sm font-semibold tracking-wide text-ivory-100 truncate">
              RK Visual
            </span>
            <span className="rounded bg-gold-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold-400 border border-gold-500/20">
              Admin
            </span>
          </div>
          <p className="text-[10px] text-sand-500 tracking-editorial uppercase truncate">
            Studio CMS
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-sand-500 mb-2">
            Management
          </p>
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const active = isLinkActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    active
                      ? "bg-charcoal-850 text-gold-300 border border-gold-500/30 shadow-sm"
                      : "text-sand-400 hover:bg-charcoal-900 hover:text-ivory-100"
                  }`}
                >
                  <Icon
                    size={16}
                    className={`shrink-0 transition-colors ${
                      active
                        ? "text-gold-400"
                        : "text-sand-500 group-hover:text-gold-400/80"
                    }`}
                  />
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-sand-500 mb-2">
            Tools &amp; Utilities
          </p>
          <nav className="space-y-1">
            {utilityNavItems.map((item) => {
              const active = isLinkActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    active
                      ? "bg-charcoal-850 text-gold-300 border border-gold-500/30"
                      : "text-sand-400 hover:bg-charcoal-900 hover:text-ivory-100"
                  }`}
                >
                  <Icon
                    size={16}
                    className={`shrink-0 transition-colors ${
                      active
                        ? "text-gold-400"
                        : "text-sand-500 group-hover:text-gold-400/80"
                    }`}
                  />
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-sand-400 hover:bg-charcoal-900 hover:text-ivory-100 transition-colors"
            >
              <span className="flex items-center gap-3 truncate">
                <ExternalLink size={16} className="text-sand-500 group-hover:text-gold-400/80" />
                <span>Live Studio</span>
              </span>
              <span className="text-[10px] text-sand-600 uppercase">↗</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-bronze-border/60 p-4">
        <div className="rounded-xl border border-bronze-border/40 bg-charcoal-900/50 p-2.5">
          <div className="flex items-center justify-between text-[11px] text-sand-400">
            <span>Role: <strong className="text-gold-400 font-semibold">ADMIN</strong></span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" title="Connected" />
          </div>
          <p className="mt-1 text-[10px] text-sand-500">
            RK Visual Photography v0.1
          </p>
        </div>
      </div>
    </aside>
  );
}
